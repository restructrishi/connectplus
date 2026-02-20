"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
const library_1 = require("@prisma/client/runtime/library");
const DEFAULT_PAGE_SIZE = 20;
exports.dealRepository = {
    async create(data) {
        return prisma_js_1.prisma.deal.create({
            data: {
                ...data,
                value: new library_1.Decimal(data.value),
            },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.deal.findUnique({
            where: { id },
            include: { client: true },
        });
    },
    async findManyByClientId(clientId) {
        return prisma_js_1.prisma.deal.findMany({
            where: { clientId },
            orderBy: { updatedAt: "desc" },
        });
    },
    async findMany(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
        const where = {};
        if (filters.clientId)
            where.clientId = filters.clientId;
        if (filters.stage)
            where.stage = filters.stage;
        const [items, total] = await Promise.all([
            prisma_js_1.prisma.deal.findMany({
                where,
                orderBy: { updatedAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: { client: { select: { id: true, companyName: true, contactPerson: true } } },
            }),
            prisma_js_1.prisma.deal.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
    async update(id, data) {
        const payload = { ...data };
        if (data.value !== undefined)
            payload.value = new library_1.Decimal(data.value);
        return prisma_js_1.prisma.deal.update({ where: { id }, data: payload });
    },
    async sumWonByMonth(year, month) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);
        const result = await prisma_js_1.prisma.deal.aggregate({
            where: { stage: "WON", updatedAt: { gte: start, lte: end } },
            _sum: { value: true },
        });
        return Number(result._sum.value ?? 0);
    },
    async countByStage() {
        return prisma_js_1.prisma.deal.groupBy({
            by: ["stage"],
            _count: { id: true },
            _sum: { value: true },
        });
    },
};
//# sourceMappingURL=deal.repository.js.map