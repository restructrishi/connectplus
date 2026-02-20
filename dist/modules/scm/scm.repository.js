"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scmRepository = void 0;
const prisma_js_1 = require("../../lib/prisma.js");
exports.scmRepository = {
    async createPo(data) {
        return prisma_js_1.prisma.purchaseOrder.create({
            data: {
                poNumber: data.poNumber,
                organizationId: data.organizationId,
                createdById: data.createdById,
                dealId: data.dealId,
                subtotal: data.subtotal,
                tax: data.tax ?? 0,
                shipping: data.shipping ?? 0,
                total: data.total,
                currency: data.currency ?? "INR",
                status: data.status ?? "CLIENT_PO_RECEIVED",
            },
        });
    },
    async listPos(organizationId, filters) {
        const where = { organizationId };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.dealId)
            where.dealId = filters.dealId;
        return prisma_js_1.prisma.purchaseOrder.findMany({
            where,
            include: { deal: true, createdBy: { select: { id: true, email: true, firstName: true, lastName: true } }, items: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        });
    },
    async getPoById(id) {
        return prisma_js_1.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { deal: true, createdBy: true, items: { include: { product: true } } },
        });
    },
    async updatePoStatus(id, status, extra) {
        const data = { status, updatedAt: new Date() };
        if (status === "CLIENT_PO_RECEIVED" && extra?.clientPOReceivedAt)
            data.clientPOReceivedAt = extra.clientPOReceivedAt;
        if (status === "PO_SENT_TO_DISTRIBUTOR" && extra?.poSentToDistributorAt)
            data.poSentToDistributorAt = extra.poSentToDistributorAt;
        if (extra)
            Object.assign(data, extra);
        return prisma_js_1.prisma.purchaseOrder.update({ where: { id }, data: data });
    },
    async updatePo(id, data) {
        return prisma_js_1.prisma.purchaseOrder.update({
            where: { id },
            data: { ...data, updatedAt: new Date() },
        });
    },
    async getNextPoNumber(organizationId) {
        const last = await prisma_js_1.prisma.purchaseOrder.findFirst({
            where: { organizationId },
            orderBy: { createdAt: "desc" },
            select: { poNumber: true },
        });
        const num = last ? parseInt(last.poNumber.replace(/\D/g, ""), 10) || 0 : 0;
        return `PO-${String(num + 1).padStart(5, "0")}`;
    },
};
//# sourceMappingURL=scm.repository.js.map