"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scmService = void 0;
const scm_repository_js_1 = require("./scm.repository.js");
const prisma_js_1 = require("../../lib/prisma.js");
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
exports.scmService = {
    async getOrgIdForUser(userId) {
        let user = null;
        try {
            user = await prisma_js_1.prisma.crmUser.findUnique({ where: { id: userId }, select: { organizationId: true } });
        }
        catch (e) {
            console.error("[SCM] getOrgIdForUser prisma error", e);
            throw new errorHandler_js_1.AppError(503, "Service unavailable. Run: npx prisma generate && npm run db:seed");
        }
        if (!user?.organizationId)
            throw new errorHandler_js_1.AppError(403, "User has no organization assigned. Run: npm run db:seed");
        return user.organizationId;
    },
    async listPos(userId, filters) {
        const orgId = await this.getOrgIdForUser(userId);
        try {
            return await scm_repository_js_1.scmRepository.listPos(orgId, filters);
        }
        catch (e) {
            if (e instanceof errorHandler_js_1.AppError)
                throw e;
            console.error("[SCM] listPos error", e);
            throw new errorHandler_js_1.AppError(503, "Service unavailable. Run: npx prisma generate && npm run db:seed");
        }
    },
    async createPo(userId, data) {
        try {
            const orgId = await this.getOrgIdForUser(userId);
            const poNumber = await scm_repository_js_1.scmRepository.getNextPoNumber(orgId);
            const po = await scm_repository_js_1.scmRepository.createPo({
                poNumber,
                organizationId: orgId,
                createdById: userId,
                dealId: data.dealId,
                subtotal: data.subtotal,
                tax: data.tax ?? 0,
                shipping: data.shipping ?? 0,
                total: data.total,
                currency: data.currency,
            });
            if (data.items?.length) {
                for (const item of data.items) {
                    await prisma_js_1.prisma.purchaseOrderItem.create({
                        data: {
                            purchaseOrderId: po.id,
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            totalPrice: item.quantity * item.unitPrice,
                        },
                    });
                }
            }
            return await scm_repository_js_1.scmRepository.getPoById(po.id);
        }
        catch (e) {
            if (e instanceof errorHandler_js_1.AppError)
                throw e;
            console.error("[SCM] createPo error", e);
            throw new errorHandler_js_1.AppError(503, "Service unavailable. Run: npx prisma generate && npm run db:seed");
        }
    },
    async getPo(id, userId) {
        const orgId = await this.getOrgIdForUser(userId);
        const po = await scm_repository_js_1.scmRepository.getPoById(id);
        if (!po)
            throw new errorHandler_js_1.AppError(404, "Purchase order not found");
        if (po.organizationId !== orgId)
            throw new errorHandler_js_1.AppError(403, "Access denied");
        return po;
    },
    async updatePoStatus(id, userId, status, extra) {
        await this.getPo(id, userId);
        return scm_repository_js_1.scmRepository.updatePoStatus(id, status, extra);
    },
    async updatePo(id, userId, data) {
        await this.getPo(id, userId);
        return scm_repository_js_1.scmRepository.updatePo(id, data);
    },
};
//# sourceMappingURL=scm.service.js.map