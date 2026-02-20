import { prisma } from "../../lib/prisma.js";
import { getOrgIdForUser } from "../../utils/org.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { PolicyStatus } from "@prisma/client";

export const legalService = {
  async listAgreements(userId: string, filters?: { dealId?: string }) {
    const orgId = await getOrgIdForUser(userId);
    try {
      const where: { organizationId: string; dealId?: string } = { organizationId: orgId };
      if (filters?.dealId) where.dealId = filters.dealId;
      return prisma.agreement.findMany({
        where,
        include: {
          deal: { select: { id: true, dealName: true } },
          contact: { select: { id: true, firstName: true, lastName: true, companyName: true } },
          createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      if (e instanceof AppError) throw e;
      console.error("[Legal] listAgreements error", e);
      throw new AppError(503, "Service unavailable.");
    }
  },

  async getAgreementById(id: string, userId: string) {
    const orgId = await getOrgIdForUser(userId);
    const a = await prisma.agreement.findUnique({
      where: { id },
      include: { deal: true, contact: true, createdBy: true },
    });
    if (!a) throw new AppError(404, "Agreement not found");
    if (a.organizationId !== orgId) throw new AppError(403, "Access denied");
    return a;
  },

  async listPolicies(userId: string, filters?: { status?: PolicyStatus }) {
    const orgId = await getOrgIdForUser(userId);
    try {
      const where: { organizationId: string; status?: PolicyStatus } = { organizationId: orgId };
      if (filters?.status) where.status = filters.status;
      return prisma.policy.findMany({
        where,
        include: {
          createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      if (e instanceof AppError) throw e;
      console.error("[Legal] listPolicies error", e);
      throw new AppError(503, "Service unavailable.");
    }
  },

  async getPolicyById(id: string, userId: string) {
    const orgId = await getOrgIdForUser(userId);
    const p = await prisma.policy.findUnique({
      where: { id },
      include: { createdBy: true },
    });
    if (!p) throw new AppError(404, "Policy not found");
    if (p.organizationId !== orgId) throw new AppError(403, "Access denied");
    return p;
  },
};
