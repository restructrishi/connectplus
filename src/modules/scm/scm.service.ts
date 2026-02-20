import { scmRepository } from "./scm.repository.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { POStatus } from "@prisma/client";

export const scmService = {
  async getOrgIdForUser(userId: string): Promise<string> {
    let user: { organizationId: string | null } | null = null;
    try {
      user = await prisma.crmUser.findUnique({ where: { id: userId }, select: { organizationId: true } });
    } catch (e) {
      console.error("[SCM] getOrgIdForUser prisma error", e);
      throw new AppError(503, "Service unavailable. Run: npx prisma generate && npm run db:seed");
    }
    if (!user?.organizationId) throw new AppError(403, "User has no organization assigned. Run: npm run db:seed");
    return user.organizationId;
  },

  async listPos(userId: string, filters?: { status?: POStatus; dealId?: string }) {
    const orgId = await this.getOrgIdForUser(userId);
    try {
      return await scmRepository.listPos(orgId, filters);
    } catch (e) {
      if (e instanceof AppError) throw e;
      console.error("[SCM] listPos error", e);
      throw new AppError(503, "Service unavailable. Run: npx prisma generate && npm run db:seed");
    }
  },

  async createPo(
    userId: string,
    data: {
      dealId?: string;
      subtotal: number;
      tax?: number;
      shipping?: number;
      total: number;
      currency?: string;
      items?: { productId: string; quantity: number; unitPrice: number }[];
    }
  ) {
    try {
      const orgId = await this.getOrgIdForUser(userId);
      const poNumber = await scmRepository.getNextPoNumber(orgId);
      const po = await scmRepository.createPo({
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
        await prisma.purchaseOrderItem.create({
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
      return await scmRepository.getPoById(po.id);
    } catch (e) {
      if (e instanceof AppError) throw e;
      console.error("[SCM] createPo error", e);
      throw new AppError(503, "Service unavailable. Run: npx prisma generate && npm run db:seed");
    }
  },

  async getPo(id: string, userId: string) {
    const orgId = await this.getOrgIdForUser(userId);
    const po = await scmRepository.getPoById(id);
    if (!po) throw new AppError(404, "Purchase order not found");
    if (po.organizationId !== orgId) throw new AppError(403, "Access denied");
    return po;
  },

  async updatePoStatus(id: string, userId: string, status: POStatus, extra?: Record<string, unknown>) {
    await this.getPo(id, userId);
    return scmRepository.updatePoStatus(id, status, extra);
  },

  async updatePo(id: string, userId: string, data: Record<string, unknown>) {
    await this.getPo(id, userId);
    return scmRepository.updatePo(id, data);
  },

  /** Create a Deployment from this PO (handoff). Uses PO's deal and deal's contact. */
  async handoffToDeployment(poId: string, userId: string) {
    const po = await this.getPo(poId, userId);
    const withDeal = po.dealId
      ? await prisma.purchaseOrder.findUnique({
          where: { id: poId },
          include: { deal: { select: { id: true, contactId: true } } },
        })
      : null;
    if (!withDeal?.deal?.contactId) throw new AppError(400, "PO must be linked to a deal with a contact to hand off to Deployment.");
    const deployment = await prisma.deployment.create({
      data: {
        dealId: withDeal.deal.id,
        contactId: withDeal.deal.contactId,
        organizationId: po.organizationId,
        status: "KICK_OFF_PENDING",
      },
    });
    return deployment;
  },
};
