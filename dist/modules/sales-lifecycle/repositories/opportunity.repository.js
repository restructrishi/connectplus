"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
const library_1 = require("@prisma/client/runtime/library");
exports.opportunityRepository = {
    async create(data) {
        return prisma_js_1.prisma.opportunity.create({
            data: {
                ...data,
                estimatedValue: data.estimatedValue != null ? new library_1.Decimal(data.estimatedValue) : undefined,
                stage: "OPEN",
            },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.opportunity.findFirst({
            where: { id, deletedAt: null },
            include: {
                company: true,
                lead: true,
                documents: { where: { deletedAt: null }, orderBy: { uploadedAt: "desc" } },
                quote: true,
                ovf: { include: { approvals: true } },
                scmHandoff: true,
                timeline: { orderBy: { createdAt: "desc" }, take: 50 },
            },
        });
    },
    async findMany(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
        const where = {
            deletedAt: null,
            ...(filters.companyId && { companyId: filters.companyId }),
            ...(filters.stage && { stage: filters.stage }),
            ...(filters.assignedSalesPerson && { assignedSalesPerson: filters.assignedSalesPerson }),
        };
        const [items, total] = await Promise.all([
            prisma_js_1.prisma.opportunity.findMany({
                where,
                orderBy: { updatedAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    company: { select: { id: true, name: true } },
                    quote: { select: { id: true, amount: true, lockedAt: true } },
                    ovf: { select: { id: true, status: true } },
                },
            }),
            prisma_js_1.prisma.opportunity.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
    async updateStage(id, stage, extra) {
        const data = { stage, updatedAt: new Date() };
        if (stage === "LOST_DEAL" && extra) {
            data.isLocked = true;
            data.lostAt = new Date();
            data.lostBy = extra.lostBy;
            data.lostReason = extra.lostReason;
            data.lostStage = extra.lostStage;
        }
        if (stage === "SENT_TO_SCM")
            data.isLocked = true;
        return prisma_js_1.prisma.opportunity.update({ where: { id }, data: data });
    },
    async updateOemFields(id, data) {
        return prisma_js_1.prisma.opportunity.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    },
    async softDelete(id) {
        return prisma_js_1.prisma.opportunity.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
};
//# sourceMappingURL=opportunity.repository.js.map