"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploymentService = void 0;
const prisma_js_1 = require("../../lib/prisma.js");
const org_js_1 = require("../../utils/org.js");
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
exports.deploymentService = {
    async list(userId, filters) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        try {
            const where = { organizationId: orgId };
            if (filters?.status)
                where.status = filters.status;
            if (filters?.dealId)
                where.dealId = filters.dealId;
            return prisma_js_1.prisma.deployment.findMany({
                where,
                include: {
                    deal: { select: { id: true, dealName: true, stage: true } },
                    contact: { select: { id: true, firstName: true, lastName: true, companyName: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        }
        catch (e) {
            if (e instanceof errorHandler_js_1.AppError)
                throw e;
            console.error("[Deployment] list error", e);
            throw new errorHandler_js_1.AppError(503, "Service unavailable.");
        }
    },
    async getById(id, userId) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        const d = await prisma_js_1.prisma.deployment.findUnique({
            where: { id },
            include: {
                deal: true,
                contact: true,
            },
        });
        if (!d)
            throw new errorHandler_js_1.AppError(404, "Deployment not found");
        if (d.organizationId !== orgId)
            throw new errorHandler_js_1.AppError(403, "Access denied");
        return d;
    },
};
//# sourceMappingURL=deployment.service.js.map