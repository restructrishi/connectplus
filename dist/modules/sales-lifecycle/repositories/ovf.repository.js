"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ovfRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
const library_1 = require("@prisma/client/runtime/library");
exports.ovfRepository = {
    async create(data) {
        return prisma_js_1.prisma.oVF.create({
            data: {
                ...data,
                finalAmount: new library_1.Decimal(data.finalAmount),
                marginPercent: data.marginPercent != null ? new library_1.Decimal(data.marginPercent) : undefined,
                status: "DRAFT",
            },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.oVF.findFirst({
            where: { id, deletedAt: null },
            include: { opportunity: true, quote: true, approvals: true },
        });
    },
    async findByOpportunityId(opportunityId) {
        return prisma_js_1.prisma.oVF.findFirst({
            where: { opportunityId, deletedAt: null },
            include: { quote: true, approvals: true },
        });
    },
    async updateStatus(id, status, sentForApprovalAt) {
        const data = { status };
        if (sentForApprovalAt)
            data.sentForApprovalAt = sentForApprovalAt;
        return prisma_js_1.prisma.oVF.update({ where: { id }, data });
    },
};
//# sourceMappingURL=ovf.repository.js.map