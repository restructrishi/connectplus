"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legalService = void 0;
const prisma_js_1 = require("../../lib/prisma.js");
const org_js_1 = require("../../utils/org.js");
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
exports.legalService = {
    async listAgreements(userId, filters) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        try {
            const where = { organizationId: orgId };
            if (filters?.dealId)
                where.dealId = filters.dealId;
            return prisma_js_1.prisma.agreement.findMany({
                where,
                include: {
                    deal: { select: { id: true, dealName: true } },
                    contact: { select: { id: true, firstName: true, lastName: true, companyName: true } },
                    createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        }
        catch (e) {
            if (e instanceof errorHandler_js_1.AppError)
                throw e;
            console.error("[Legal] listAgreements error", e);
            throw new errorHandler_js_1.AppError(503, "Service unavailable.");
        }
    },
    async getAgreementById(id, userId) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        const a = await prisma_js_1.prisma.agreement.findUnique({
            where: { id },
            include: { deal: true, contact: true, createdBy: true },
        });
        if (!a)
            throw new errorHandler_js_1.AppError(404, "Agreement not found");
        if (a.organizationId !== orgId)
            throw new errorHandler_js_1.AppError(403, "Access denied");
        return a;
    },
    async listPolicies(userId, filters) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        try {
            const where = { organizationId: orgId };
            if (filters?.status)
                where.status = filters.status;
            return prisma_js_1.prisma.policy.findMany({
                where,
                include: {
                    createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        }
        catch (e) {
            if (e instanceof errorHandler_js_1.AppError)
                throw e;
            console.error("[Legal] listPolicies error", e);
            throw new errorHandler_js_1.AppError(503, "Service unavailable.");
        }
    },
    async getPolicyById(id, userId) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        const p = await prisma_js_1.prisma.policy.findUnique({
            where: { id },
            include: { createdBy: true },
        });
        if (!p)
            throw new errorHandler_js_1.AppError(404, "Policy not found");
        if (p.organizationId !== orgId)
            throw new errorHandler_js_1.AppError(403, "Access denied");
        return p;
    },
};
//# sourceMappingURL=legal.service.js.map