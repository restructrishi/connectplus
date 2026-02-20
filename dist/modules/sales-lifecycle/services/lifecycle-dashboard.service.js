"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLifecycleDashboard = getLifecycleDashboard;
const prisma_js_1 = require("../../../lib/prisma.js");
async function getLifecycleDashboard() {
    const [totalCompanies, openLeads, totalOpportunities, opportunitiesByStage, approvalPendingCount, lostDealsCount, revenueForecast,] = await Promise.all([
        prisma_js_1.prisma.salesCompany.count({ where: { deletedAt: null, status: "OPEN" } }),
        prisma_js_1.prisma.salesLead.count({ where: { deletedAt: null, status: "OPEN" } }),
        prisma_js_1.prisma.opportunity.count({ where: { deletedAt: null, stage: { not: "LOST_DEAL" } } }),
        prisma_js_1.prisma.opportunity.groupBy({
            by: ["stage"],
            where: { deletedAt: null },
            _count: { id: true },
        }),
        prisma_js_1.prisma.approval.count({ where: { status: "PENDING", deletedAt: null } }),
        prisma_js_1.prisma.opportunity.count({ where: { deletedAt: null, stage: "LOST_DEAL" } }),
        prisma_js_1.prisma.opportunity.aggregate({
            where: { deletedAt: null, stage: { not: "LOST_DEAL" } },
            _sum: { estimatedValue: true },
        }),
    ]);
    const dealsByStage = Object.fromEntries(opportunitiesByStage.map((s) => [s.stage, s._count.id]));
    const convertedLeads = await prisma_js_1.prisma.salesLead.count({
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
//# sourceMappingURL=lifecycle-dashboard.service.js.map