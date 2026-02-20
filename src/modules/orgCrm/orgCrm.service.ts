import { prisma } from "../../lib/prisma.js";
import { getOrgIdForUser } from "../../utils/org.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { CrmDealStage } from "@prisma/client";

export const orgCrmService = {
  async listContacts(userId: string) {
    const orgId = await getOrgIdForUser(userId);
    return prisma.crmContact.findMany({
      where: { organizationId: orgId, isActive: true },
      orderBy: { companyName: "asc" },
      select: { id: true, firstName: true, lastName: true, email: true, companyName: true },
    });
  },

  async createContact(
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      companyName: string;
      phone?: string;
    }
  ) {
    const orgId = await getOrgIdForUser(userId);
    return prisma.crmContact.create({
      data: {
        ...data,
        organizationId: orgId,
        ownerId: userId,
      },
    });
  },

  async getContact(id: string, userId: string) {
    const orgId = await getOrgIdForUser(userId);
    const c = await prisma.crmContact.findUnique({ where: { id } });
    if (!c) throw new AppError(404, "Contact not found");
    if (c.organizationId !== orgId) throw new AppError(403, "Access denied");
    return c;
  },

  async listDeals(userId: string, filters?: { stage?: CrmDealStage }) {
    const orgId = await getOrgIdForUser(userId);
    return prisma.crmDeal.findMany({
      where: { organizationId: orgId, ...(filters?.stage && { stage: filters.stage }) },
      orderBy: { updatedAt: "desc" },
      include: {
        contact: { select: { id: true, firstName: true, lastName: true, companyName: true } },
      },
    });
  },

  async getDeal(id: string, userId: string) {
    const orgId = await getOrgIdForUser(userId);
    const d = await prisma.crmDeal.findUnique({
      where: { id },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            companyName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    if (!d) throw new AppError(404, "Deal not found");
    if (d.organizationId !== orgId) throw new AppError(403, "Access denied");
    // Load related records separately to avoid relation/serialization issues
    const [preSales, deployments, purchaseOrders] = await Promise.all([
      prisma.preSales.findUnique({ where: { dealId: id }, select: { id: true, handoverDate: true } }),
      prisma.deployment.findMany({ where: { dealId: id }, select: { id: true, status: true, createdAt: true } }),
      prisma.purchaseOrder.findMany({ where: { dealId: id }, select: { id: true, poNumber: true, status: true } }),
    ]);
    return {
      ...d,
      preSales: preSales ?? null,
      deployments,
      purchaseOrders,
    };
  },

  async createDeal(
    userId: string,
    data: {
      dealName: string;
      dealValue: number;
      contactId: string;
      stage?: CrmDealStage;
      expectedCloseDate?: string;
    }
  ) {
    const orgId = await getOrgIdForUser(userId);
    const contact = await prisma.crmContact.findFirst({
      where: { id: data.contactId, organizationId: orgId },
    });
    if (!contact) throw new AppError(404, "Contact not found");
    return prisma.crmDeal.create({
      data: {
        dealName: data.dealName,
        dealValue: data.dealValue,
        contactId: data.contactId,
        organizationId: orgId,
        ownerId: userId,
        stage: (data.stage as CrmDealStage) ?? "LEAD_GENERATION",
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
      },
      include: {
        contact: { select: { id: true, firstName: true, lastName: true, companyName: true } },
      },
    });
  },
};
