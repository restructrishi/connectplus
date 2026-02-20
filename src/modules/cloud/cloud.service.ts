import { prisma } from "../../lib/prisma.js";
import { getOrgIdForUser } from "../../utils/org.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { CloudStatus } from "@prisma/client";

export const cloudService = {
  async list(userId: string, filters?: { status?: CloudStatus }) {
    const orgId = await getOrgIdForUser(userId);
    try {
      const where: { organizationId: string; status?: CloudStatus } = { organizationId: orgId };
      if (filters?.status) where.status = filters.status;
      return prisma.cloudProject.findMany({
        where,
        include: {
          tl: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      if (e instanceof AppError) throw e;
      console.error("[Cloud] list error", e);
      throw new AppError(503, "Service unavailable.");
    }
  },

  async getById(id: string, userId: string) {
    const orgId = await getOrgIdForUser(userId);
    const c = await prisma.cloudProject.findUnique({
      where: { id },
      include: { tl: true },
    });
    if (!c) throw new AppError(404, "Cloud project not found");
    if (c.organizationId !== orgId) throw new AppError(403, "Access denied");
    return c;
  },
};
