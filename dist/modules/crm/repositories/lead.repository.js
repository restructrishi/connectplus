"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
const DEFAULT_PAGE_SIZE = 20;
exports.leadRepository = {
    async create(data) {
        return prisma_js_1.prisma.lead.create({ data });
    },
    async findById(id) {
        return prisma_js_1.prisma.lead.findUnique({
            where: { id },
            include: { activities: { orderBy: { createdAt: "desc" }, take: 10 } },
        });
    },
    async findMany(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
        const where = {};
        if (filters.assignedTo != null)
            where.assignedTo = filters.assignedTo;
        if (filters.status != null)
            where.status = filters.status;
        const [items, total] = await Promise.all([
            prisma_js_1.prisma.lead.findMany({
                where,
                orderBy: { updatedAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    company: true,
                    source: true,
                    status: true,
                    assignedTo: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma_js_1.prisma.lead.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
    async update(id, data) {
        return prisma_js_1.prisma.lead.update({ where: { id }, data });
    },
    async countByStatus() {
        return prisma_js_1.prisma.lead.groupBy({
            by: ["status"],
            _count: { id: true },
        });
    },
    async countByAssigned(assignedTo) {
        return prisma_js_1.prisma.lead.count({ where: { assignedTo } });
    },
};
//# sourceMappingURL=lead.repository.js.map