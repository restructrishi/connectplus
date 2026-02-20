import { prisma } from "../../lib/prisma.js";
import { getOrgIdForUser } from "../../utils/org.js";
import { AppError } from "../../middleware/errorHandler.js";

export const preSalesService = {
  async list(userId: string, filters?: { dealId?: string }) {
    const orgId = await getOrgIdForUser(userId);
    try {
      const where: { organizationId: string; dealId?: string } = { organizationId: orgId };
      if (filters?.dealId) where.dealId = filters.dealId;
      return prisma.preSales.findMany({
        where,
        include: {
          deal: { select: { id: true, dealName: true, stage: true, dealValue: true } },
          createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { handoverDate: "desc" },
      });
    } catch (e) {
      if (e instanceof AppError) throw e;
      console.error("[PreSales] list error", e);
      throw new AppError(503, "Service unavailable.");
    }
  },

  async create(userId: string, data: { dealId: string; handoverDate: string; handoverNotes?: string }) {
    const orgId = await getOrgIdForUser(userId);
    const deal = await prisma.crmDeal.findFirst({
      where: { id: data.dealId, organizationId: orgId },
    });
    if (!deal) throw new AppError(404, "Deal not found");
    const existing = await prisma.preSales.findUnique({ where: { dealId: data.dealId } });
    if (existing) throw new AppError(400, "Pre-sales already exists for this deal");
    return prisma.preSales.create({
      data: {
        dealId: data.dealId,
        handoverDate: new Date(data.handoverDate),
        handoverNotes: data.handoverNotes ?? null,
        organizationId: orgId,
        createdById: userId,
      },
      include: {
        deal: { select: { id: true, dealName: true, stage: true, dealValue: true } },
        createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
  },

  async getById(id: string, userId: string) {
    const orgId = await getOrgIdForUser(userId);
    const p = await prisma.preSales.findUnique({
      where: { id },
      include: { deal: true, createdBy: true },
    });
    if (!p) throw new AppError(404, "Pre-sales record not found");
    if (p.organizationId !== orgId) throw new AppError(403, "Access denied");
    return p;
  },

  async update(id: string, userId: string, data: Record<string, unknown>) {
    await this.getById(id, userId);
    return prisma.preSales.update({
      where: { id },
      data: { ...data, updatedAt: new Date() } as never,
      include: { deal: true, createdBy: true },
    });
  },
};
