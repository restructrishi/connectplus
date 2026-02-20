import { prisma } from "../../lib/prisma.js";
import type { POStatus } from "@prisma/client";

export const scmRepository = {
  async createPo(data: {
    poNumber: string;
    organizationId: string;
    createdById: string;
    dealId?: string;
    subtotal: number;
    tax: number;
    shipping?: number;
    total: number;
    currency?: string;
    status?: POStatus;
  }) {
    return prisma.purchaseOrder.create({
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

  async listPos(organizationId: string, filters?: { status?: POStatus; dealId?: string }) {
    const where: { organizationId: string; dealId?: string; status?: POStatus } = { organizationId };
    if (filters?.status) where.status = filters.status;
    if (filters?.dealId) where.dealId = filters.dealId;
    return prisma.purchaseOrder.findMany({
      where,
      include: { deal: true, createdBy: { select: { id: true, email: true, firstName: true, lastName: true } }, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async getPoById(id: string) {
    return prisma.purchaseOrder.findUnique({
      where: { id },
      include: { deal: true, createdBy: true, items: { include: { product: true } } },
    });
  },

  async updatePoStatus(id: string, status: POStatus, extra?: Record<string, unknown>) {
    const data: Record<string, unknown> = { status, updatedAt: new Date() };
    if (status === "CLIENT_PO_RECEIVED" && extra?.clientPOReceivedAt) data.clientPOReceivedAt = extra.clientPOReceivedAt;
    if (status === "PO_SENT_TO_DISTRIBUTOR" && extra?.poSentToDistributorAt) data.poSentToDistributorAt = extra.poSentToDistributorAt;
    if (extra) Object.assign(data, extra);
    return prisma.purchaseOrder.update({ where: { id }, data: data as never });
  },

  async updatePo(id: string, data: Record<string, unknown>) {
    return prisma.purchaseOrder.update({
      where: { id },
      data: { ...data, updatedAt: new Date() } as never,
    });
  },

  async getNextPoNumber(organizationId: string): Promise<string> {
    const last = await prisma.purchaseOrder.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      select: { poNumber: true },
    });
    const num = last ? parseInt(last.poNumber.replace(/\D/g, ""), 10) || 0 : 0;
    return `PO-${String(num + 1).padStart(5, "0")}`;
  },
};
