"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
exports.dashboardService = {
    async getSummary() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const [totalLeads, leadsByStatus, totalClients, dealsWonThisMonth, dealAggregates, leadsPerExecutive,] = await Promise.all([
            prisma_js_1.prisma.lead.count(),
            prisma_js_1.prisma.lead.groupBy({ by: ["status"], _count: { id: true } }),
            prisma_js_1.prisma.client.count(),
            prisma_js_1.prisma.deal.aggregate({
                where: { stage: "WON", updatedAt: { gte: startOfMonth, lte: endOfMonth } },
                _sum: { value: true },
                _count: { id: true },
            }),
            prisma_js_1.prisma.deal.aggregate({
                where: { stage: "WON" },
                _sum: { value: true },
            }),
            prisma_js_1.prisma.lead.groupBy({
                by: ["assignedTo"],
                where: { assignedTo: { not: null } },
                _count: { id: true },
            }),
        ]);
        const revenueThisMonth = Number(dealsWonThisMonth._sum.value ?? 0);
        const totalRevenue = Number(dealAggregates._sum.value ?? 0);
        const leadsByStatusMap = Object.fromEntries(leadsByStatus.map((s) => [s.status, s._count.id]));
        const teamPerformance = leadsPerExecutive.map((p) => ({
            employeeId: p.assignedTo,
            leadCount: p._count.id,
        }));
        return {
            totalLeads,
            leadsByStatus: leadsByStatusMap,
            totalClients,
            dealsWonThisMonth: dealsWonThisMonth._count.id,
            revenueThisMonth,
            totalRevenue,
            teamPerformance,
        };
    },
};
//# sourceMappingURL=dashboard.service.js.map