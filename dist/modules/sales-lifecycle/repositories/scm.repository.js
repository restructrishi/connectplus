"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scmRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
exports.scmRepository = {
    async create(data) {
        return prisma_js_1.prisma.sCMHandoff.create({
            data: { ...data, status: "SENT" },
        });
    },
    async findByOpportunityId(opportunityId) {
        return prisma_js_1.prisma.sCMHandoff.findFirst({
            where: { opportunityId, deletedAt: null },
        });
    },
    async findMany(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
        const where = { deletedAt: null };
        const [items, total] = await Promise.all([
            prisma_js_1.prisma.sCMHandoff.findMany({
                where,
                orderBy: { handedOffAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: { opportunity: { include: { company: true } } },
            }),
            prisma_js_1.prisma.sCMHandoff.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
};
//# sourceMappingURL=scm.repository.js.map