"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataAiService = void 0;
const prisma_js_1 = require("../../lib/prisma.js");
const org_js_1 = require("../../utils/org.js");
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
exports.dataAiService = {
    async listProjects(userId, filters) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        try {
            const where = { organizationId: orgId };
            if (filters?.status)
                where.status = filters.status;
            return prisma_js_1.prisma.project.findMany({
                where,
                include: {
                    tl: { select: { id: true, email: true, firstName: true, lastName: true } },
                    _count: { select: { tasks: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        }
        catch (e) {
            if (e instanceof errorHandler_js_1.AppError)
                throw e;
            console.error("[DataAI] listProjects error", e);
            throw new errorHandler_js_1.AppError(503, "Service unavailable.");
        }
    },
    async getProjectById(id, userId) {
        const orgId = await (0, org_js_1.getOrgIdForUser)(userId);
        const p = await prisma_js_1.prisma.project.findUnique({
            where: { id },
            include: { tl: true, tasks: { include: { assignedTo: { select: { id: true, email: true, firstName: true, lastName: true } } } } },
        });
        if (!p)
            throw new errorHandler_js_1.AppError(404, "Project not found");
        if (p.organizationId !== orgId)
            throw new errorHandler_js_1.AppError(403, "Access denied");
        return p;
    },
};
//# sourceMappingURL=dataAi.service.js.map