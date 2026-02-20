import { prisma } from "../../lib/prisma.js";
import { getOrgIdForUser } from "../../utils/org.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { DeploymentStatus } from "@prisma/client";

export const deploymentService = {
  async list(userId: string, filters?: { status?: DeploymentStatus; dealId?: string }) {
    const orgId = await getOrgIdForUser(userId);
    try {
      const where: { organizationId: string; status?: DeploymentStatus; dealId?: string } = { organizationId: orgId };
      if (filters?.status) where.status = filters.status;
      if (filters?.dealId) where.dealId = filters.dealId;
      return prisma.deployment.findMany({
        where,
        include: {
          deal: { select: { id: true, dealName: true, stage: true } },
          contact: { select: { id: true, firstName: true, lastName: true, companyName: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      if (e instanceof AppError) throw e;
      console.error("[Deployment] list error", e);
      throw new AppError(503, "Service unavailable.");
    }
  },

  async getById(id: string, userId: string) {
    const orgId = await getOrgIdForUser(userId);
    const d = await prisma.deployment.findUnique({
      where: { id },
      include: {
        deal: true,
        contact: true,
      },
    });
    if (!d) throw new AppError(404, "Deployment not found");
    if (d.organizationId !== orgId) throw new AppError(403, "Access denied");
    return d;
  },

  async create(userId: string, data: { dealId: string; contactId: string }) {
    const orgId = await getOrgIdForUser(userId);
    const deal = await prisma.crmDeal.findFirst({
      where: { id: data.dealId, organizationId: orgId },
      select: { id: true, contactId: true },
    });
    if (!deal) throw new AppError(404, "Deal not found");
    if (deal.contactId !== data.contactId) throw new AppError(400, "Contact must belong to the deal");
    return prisma.deployment.create({
      data: {
        dealId: data.dealId,
        contactId: data.contactId,
        organizationId: orgId,
        status: "KICK_OFF_PENDING",
      },
      include: {
        deal: { select: { id: true, dealName: true, stage: true } },
        contact: { select: { id: true, firstName: true, lastName: true, companyName: true } },
      },
    });
  },

  async update(id: string, userId: string, data: Record<string, unknown>) {
    await this.getById(id, userId);
    return prisma.deployment.update({
      where: { id },
      data: { ...data, updatedAt: new Date() } as never,
      include: { deal: true, contact: true },
    });
  },
};
