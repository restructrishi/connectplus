"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
const library_1 = require("@prisma/client/runtime/library");
exports.quoteRepository = {
    async create(data) {
        return prisma_js_1.prisma.quote.create({
            data: {
                ...data,
                amount: new library_1.Decimal(data.amount),
                marginPercent: data.marginPercent != null ? new library_1.Decimal(data.marginPercent) : undefined,
                marginAmount: data.marginAmount != null ? new library_1.Decimal(data.marginAmount) : undefined,
            },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.quote.findFirst({
            where: { id, deletedAt: null },
            include: { opportunity: true, ovf: true },
        });
    },
    async findByOpportunityId(opportunityId) {
        return prisma_js_1.prisma.quote.findFirst({
            where: { opportunityId, deletedAt: null },
            include: { ovf: true },
        });
    },
    async update(id, data) {
        const payload = { updatedAt: new Date() };
        if (data.amount != null)
            payload.amount = new library_1.Decimal(data.amount);
        if (data.marginPercent != null)
            payload.marginPercent = new library_1.Decimal(data.marginPercent);
        if (data.marginAmount != null)
            payload.marginAmount = new library_1.Decimal(data.marginAmount);
        if (data.details != null)
            payload.details = data.details;
        return prisma_js_1.prisma.quote.update({ where: { id }, data: payload });
    },
    async lock(id) {
        return prisma_js_1.prisma.quote.update({
            where: { id },
            data: { lockedAt: new Date(), updatedAt: new Date() },
        });
    },
};
//# sourceMappingURL=quote.repository.js.map