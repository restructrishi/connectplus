"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
const DEFAULT_PAGE_SIZE = 20;
exports.activityRepository = {
    async create(data) {
        return prisma_js_1.prisma.activity.create({ data });
    },
    async findById(id) {
        return prisma_js_1.prisma.activity.findUnique({
            where: { id },
            include: { lead: true, client: true },
        });
    },
    async findMany(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
        const where = {};
        if (filters.leadId != null)
            where.leadId = filters.leadId;
        if (filters.clientId != null)
            where.clientId = filters.clientId;
        if (filters.createdBy != null)
            where.createdBy = filters.createdBy;
        const [items, total] = await Promise.all([
            prisma_js_1.prisma.activity.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma_js_1.prisma.activity.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
};
//# sourceMappingURL=activity.repository.js.map