"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
const DEFAULT_PAGE_SIZE = 20;
exports.taskRepository = {
    async create(data) {
        return prisma_js_1.prisma.task.create({ data });
    },
    async findById(id) {
        return prisma_js_1.prisma.task.findUnique({ where: { id } });
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
            prisma_js_1.prisma.task.findMany({
                where,
                orderBy: [{ status: "asc" }, { dueDate: "asc" }],
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma_js_1.prisma.task.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
    async update(id, data) {
        return prisma_js_1.prisma.task.update({ where: { id }, data });
    },
};
//# sourceMappingURL=task.repository.js.map