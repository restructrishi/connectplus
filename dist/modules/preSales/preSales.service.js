"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preSalesService = void 0;
const prisma_js_1 = require("../../lib/prisma.js");
const org_js_1 = require("../../utils/org.js");
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
exports.preSalesService = {
    async list(userId, filters) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        try {
            const where = { organizationId: orgId };
            if (filters?.dealId)
                where.dealId = filters.dealId;
            return prisma_js_1.prisma.preSales.findMany({
                where,
                include: {
                    deal: { select: { id: true, dealName: true, stage: true, dealValue: true } },
                    createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
                },
                orderBy: { handoverDate: "desc" },
            });
        }
        catch (e) {
            if (e instanceof errorHandler_js_1.AppError)
                throw e;
            console.error("[PreSales] list error", e);
            throw new errorHandler_js_1.AppError(503, "Service unavailable.");
        }
    },
    async getById(id, userId) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        const p = await prisma_js_1.prisma.preSales.findUnique({
            where: { id },
            include: { deal: true, createdBy: true },
        });
        if (!p)
            throw new errorHandler_js_1.AppError(404, "Pre-sales record not found");
        if (p.organizationId !== orgId)
            throw new errorHandler_js_1.AppError(403, "Access denied");
        return p;
    },
};
//# sourceMappingURL=preSales.service.js.map