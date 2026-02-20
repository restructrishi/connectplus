import { prisma } from "../../../lib/prisma.js";

export async function getLifecycleDashboard() {
  const [
    totalCompanies,
    openLeads,
    totalOpportunities,
    opportunitiesByStage,
    approvalPendingCount,
    lostDealsCount,
    revenueForecast,
  ] = await Promise.all([
    prisma.salesCompany.count({ where: { deletedAt: null, status: "OPEN" } }),
    prisma.salesLead.count({ where: { deletedAt: null, status: "OPEN" } }),
    prisma.opportunity.count({ where: { deletedAt: null, stage: { not: "LOST_DEAL" } } }),
    prisma.opportunity.groupBy({
      by: ["stage"],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.approval.count({ where: { status: "PENDING", deletedAt: null } }),
    prisma.opportunity.count({ where: { deletedAt: null, stage: "LOST_DEAL" } }),
    prisma.opportunity.aggregate({
      where: { deletedAt: null, stage: { not: "LOST_DEAL" } },
      _sum: { estimatedValue: true },
    }),
  ]);

  const dealsByStage = Object.fromEntries(
    opportunitiesByStage.map((s) => [s.stage, s._count.id])
  );
  const convertedLeads = await prisma.salesLead.count({
    where: { deletedAt: null, status: "CONVERTED" },
  });
  const conversionRatio = openLeads + convertedLeads > 0
    ? Math.round((convertedLeads / (openLeads + convertedLeads)) * 100)
    : 0;

  return {
    totalCompanies,
    openLeads,
    totalOpportunities,
    dealsByStage,
    approvalPendingCount,
    lostDealsCount,
    revenueForecast: Number(revenueForecast._sum.estimatedValue ?? 0),
    conversionRatio,
  };
}
