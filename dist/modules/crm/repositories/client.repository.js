"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
const DEFAULT_PAGE_SIZE = 20;
exports.clientRepository = {
    async create(data) {
        return prisma_js_1.prisma.client.create({ data });
    },
    async findById(id) {
        return prisma_js_1.prisma.client.findUnique({
            where: { id },
            include: {
                deals: true,
                activities: { orderBy: { createdAt: "desc" }, take: 10 },
            },
        });
    },
    async findMany(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
        const where = {};
        if (filters.assignedTo != null)
            where.assignedTo = filters.assignedTo;
        const [items, total] = await Promise.all([
            prisma_js_1.prisma.client.findMany({
                where,
                orderBy: { updatedAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
                select: {
                    id: true,
                    companyName: true,
                    contactPerson: true,
                    email: true,
                    phone: true,
                    industry: true,
                    assignedTo: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma_js_1.prisma.client.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
    async update(id, data) {
        return prisma_js_1.prisma.client.update({ where: { id }, data });
    },
    async findByConvertedLeadId(leadId) {
        return prisma_js_1.prisma.client.findUnique({ where: { convertedFromLeadId: leadId } });
    },
};
//# sourceMappingURL=client.repository.js.map