/**
 * Zoho-style home dashboard: KPI cards (this month vs last), lead count user-wise, lead/opportunity count stage-wise.
 * Uses defensive try/catch per query so one missing table or schema mismatch does not 500 the whole dashboard.
 */
import { prisma } from "../../../lib/prisma.js";

function monthRange(monthOffset: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + monthOffset);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

async function safeCount<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.warn("[home-dashboard]", e);
    return fallback;
  }
}

export type HomeDashboardData = {
  leadCountThisMonth: number;
  leadCountLastMonth: number;
  opportunityCountThisMonth: number;
  opportunityCountLastMonth: number;
  quoteCountThisMonth: number;
  quoteCountLastMonth: number;
  contactCountThisMonth: number;
  contactCountLastMonth: number;
  leadCountUserWise: { assignedTo: string | null; recordCount: number }[];
  leadCountStageWise: { stage: string; count: number }[];
};

export async function getHomeDashboard(): Promise<HomeDashboardData> {
  const thisMonth = monthRange(0);
  const lastMonth = monthRange(-1);

  const [
    leadCountThisMonth,
    leadCountLastMonth,
    opportunityCountThisMonth,
    opportunityCountLastMonth,
    quoteCountThisMonth,
    quoteCountLastMonth,
    contactCountThisMonth,
    contactCountLastMonth,
    leadUserWise,
    opportunityByStage,
  ] = await Promise.all([
    safeCount(
      () =>
        prisma.salesLead.count({
          where: { deletedAt: null, createdAt: { gte: thisMonth.start, lte: thisMonth.end } },
        }),
      0
    ),
    safeCount(
      () =>
        prisma.salesLead.count({
          where: { deletedAt: null, createdAt: { gte: lastMonth.start, lte: lastMonth.end } },
        }),
      0
    ),
    safeCount(
      () =>
        prisma.opportunity.count({
          where: { deletedAt: null, createdAt: { gte: thisMonth.start, lte: thisMonth.end } },
        }),
      0
    ),
    safeCount(
      () =>
        prisma.opportunity.count({
          where: { deletedAt: null, createdAt: { gte: lastMonth.start, lte: lastMonth.end } },
        }),
      0
    ),
    safeCount(
      () =>
        prisma.quote.count({
          where: { deletedAt: null, createdAt: { gte: thisMonth.start, lte: thisMonth.end } },
        }),
      0
    ),
    safeCount(
      () =>
        prisma.quote.count({
          where: { deletedAt: null, createdAt: { gte: lastMonth.start, lte: lastMonth.end } },
        }),
      0
    ),
    safeCount(
      () =>
        prisma.crmContact.count({
          where: { createdAt: { gte: thisMonth.start, lte: thisMonth.end } },
        }),
      0
    ),
    safeCount(
      () =>
        prisma.crmContact.count({
          where: { createdAt: { gte: lastMonth.start, lte: lastMonth.end } },
        }),
      0
    ),
    safeCount(
      () =>
        prisma.salesLead.groupBy({
          by: ["assignedTo"],
          where: { deletedAt: null },
          _count: { id: true },
        }),
      []
    ),
    safeCount(
      () =>
        prisma.opportunity.groupBy({
          by: ["stage"],
          where: { deletedAt: null },
          _count: { id: true },
        }),
      []
    ),
  ]);

  const leadCountUserWise = (Array.isArray(leadUserWise) ? leadUserWise : [])
    .map((r: { assignedTo: string | null; _count: { id: number } }) => ({
      assignedTo: r.assignedTo,
      recordCount: r._count.id,
    }))
    .sort((a, b) => b.recordCount - a.recordCount);

  const stageOrder = [
    "OPEN",
    "BOQ_SUBMITTED",
    "SOW_ATTACHED",
    "OEM_QUOTATION_RECEIVED",
    "QUOTE_CREATED",
    "OVF_CREATED",
    "APPROVAL_PENDING",
    "APPROVED",
    "SENT_TO_SCM",
    "LOST_DEAL",
  ];
  const stageMap = new Map(
    (Array.isArray(opportunityByStage) ? opportunityByStage : []).map(
      (s: { stage: string; _count: { id: number } }) => [s.stage, s._count.id]
    )
  );
  const leadCountStageWise = stageOrder.map((stage) => ({
    stage,
    count: stageMap.get(stage) ?? 0,
  }));

  return {
    leadCountThisMonth,
    leadCountLastMonth,
    opportunityCountThisMonth,
    opportunityCountLastMonth,
    quoteCountThisMonth,
    quoteCountLastMonth,
    contactCountThisMonth,
    contactCountLastMonth,
    leadCountUserWise,
    leadCountStageWise,
  };
}
