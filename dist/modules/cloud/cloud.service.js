"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudService = void 0;
const prisma_js_1 = require("../../lib/prisma.js");
const org_js_1 = require("../../utils/org.js");
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
exports.cloudService = {
    async list(userId, filters) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        try {
            const where = { organizationId: orgId };
            if (filters?.status)
                where.status = filters.status;
            return prisma_js_1.prisma.cloudProject.findMany({
                where,
                include: {
                    tl: { select: { id: true, email: true, firstName: true, lastName: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        }
        catch (e) {
            if (e instanceof errorHandler_js_1.AppError)
                throw e;
            console.error("[Cloud] list error", e);
            throw new errorHandler_js_1.AppError(503, "Service unavailable.");
        }
    },
    async getById(id, userId) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        const c = await prisma_js_1.prisma.cloudProject.findUnique({
            where: { id },
            include: { tl: true },
        });
        if (!c)
            throw new errorHandler_js_1.AppError(404, "Cloud project not found");
        if (c.organizationId !== orgId)
            throw new errorHandler_js_1.AppError(403, "Access denied");
        return c;
    },
};
//# sourceMappingURL=cloud.service.js.map