"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
exports.companyRepository = {
    async create(data) {
        return prisma_js_1.prisma.salesCompany.create({
            data: { name: data.name, createdBy: data.createdBy, status: "OPEN" },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.salesCompany.findFirst({
            where: { id, deletedAt: null },
            include: { leads: { where: { deletedAt: null } }, opportunities: { where: { deletedAt: null } } },
        });
    },
    async findMany(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
        const where = { deletedAt: null, ...(filters.status && { status: filters.status }) };
        const [items, total] = await Promise.all([
            prisma_js_1.prisma.salesCompany.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma_js_1.prisma.salesCompany.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
    async updateStatus(id, status) {
        return prisma_js_1.prisma.salesCompany.update({
            where: { id },
            data: { status },
        });
    },
    async softDelete(id) {
        return prisma_js_1.prisma.salesCompany.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
    async hasActiveOpportunity(companyId) {
        const n = await prisma_js_1.prisma.opportunity.count({
            where: { companyId, deletedAt: null, isLocked: false, stage: { not: "LOST_DEAL" } },
        });
        return n > 0;
    },
};
//# sourceMappingURL=company.repository.js.map