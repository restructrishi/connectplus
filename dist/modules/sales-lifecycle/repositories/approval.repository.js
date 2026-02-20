"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
exports.approvalRepository = {
    async create(data) {
        return prisma_js_1.prisma.approval.create({
            data: { ...data, status: "PENDING" },
        });
    },
    async findById(id) {
        return prisma_js_1.prisma.approval.findFirst({
            where: { id, deletedAt: null },
            include: { ovf: true, opportunity: true },
        });
    },
    async findByOvfId(ovfId) {
        return prisma_js_1.prisma.approval.findMany({
            where: { ovfId, deletedAt: null },
            orderBy: { requestedAt: "desc" },
        });
    },
    async findPending() {
        return prisma_js_1.prisma.approval.findMany({
            where: { status: "PENDING", deletedAt: null },
            include: { ovf: { include: { opportunity: true, quote: true } } },
            orderBy: { requestedAt: "asc" },
        });
    },
    async decide(id, data) {
        return prisma_js_1.prisma.approval.update({
            where: { id },
            data: {
                status: data.status,
                decidedBy: data.decidedBy,
                decidedAt: new Date(),
                comments: data.comments ?? undefined,
            },
        });
    },
};
//# sourceMappingURL=approval.repository.js.map