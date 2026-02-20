"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
exports.leadRepository = {
    async create(data) {
        return prisma_js_1.prisma.salesLead.create({
            data: { ...data, status: "OPEN" },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.salesLead.findFirst({
            where: { id, deletedAt: null },
            include: { company: true, opportunity: true },
        });
    },
    async findMany(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
        const where = {
            deletedAt: null,
            ...(filters.companyId && { companyId: filters.companyId }),
            ...(filters.status && { status: filters.status }),
            ...(filters.assignedTo && { assignedTo: filters.assignedTo }),
        };
        const [items, total] = await Promise.all([
            prisma_js_1.prisma.salesLead.findMany({
                where,
                orderBy: { id: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: { company: { select: { id: true, name: true } } },
            }),
            prisma_js_1.prisma.salesLead.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
    async convert(id, data) {
        return prisma_js_1.prisma.salesLead.update({
            where: { id },
            data: {
                status: "CONVERTED",
                convertedAt: new Date(),
                convertedBy: data.convertedBy,
                convertedReason: data.convertedReason,
            },
        });
    },
    async markDead(id, data) {
        return prisma_js_1.prisma.salesLead.update({
            where: { id },
            data: {
                status: "DEAD",
                deadAt: new Date(),
                deadBy: data.deadBy,
                deadReason: data.deadReason,
            },
        });
    },
    async softDelete(id) {
        return prisma_js_1.prisma.salesLead.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
};
//# sourceMappingURL=lead.repository.js.map