"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
exports.documentRepository = {
    async create(data) {
        return prisma_js_1.prisma.document.create({ data });
    },
    async findById(id) {
        return prisma_js_1.prisma.document.findFirst({
            where: { id, deletedAt: null },
        });
    },
    async findManyByOpportunity(opportunityId, type) {
        return prisma_js_1.prisma.document.findMany({
            where: { opportunityId, deletedAt: null, ...(type && { type }) },
            orderBy: [{ type: "asc" }, { version: "desc" }],
        });
    },
    async getNextVersion(opportunityId, type) {
        const last = await prisma_js_1.prisma.document.findFirst({
            where: { opportunityId, deletedAt: null, type },
            orderBy: { version: "desc" },
            select: { version: true },
        });
        return (last?.version ?? 0) + 1;
    },
};
//# sourceMappingURL=document.repository.js.map