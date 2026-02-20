import { prisma } from "../../lib/prisma.js";
import { getOrgIdForUser } from "../../utils/org.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { ProjectStatus } from "@prisma/client";

export const dataAiService = {
  async listProjects(userId: string, filters?: { status?: ProjectStatus }) {
    const orgId = await getOrgIdForUser(userId);
    try {
      const where: { organizationId: string; status?: ProjectStatus } = { organizationId: orgId };
      if (filters?.status) where.status = filters.status;
      return prisma.project.findMany({
        where,
        include: {
          tl: { select: { id: true, email: true, firstName: true, lastName: true } },
          _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      if (e instanceof AppError) throw e;
      console.error("[DataAI] listProjects error", e);
      throw new AppError(503, "Service unavailable.");
    }
  },

  async getProjectById(id: string, userId: string) {
    const orgId = await getOrgIdForUser(userId);
    const p = await prisma.project.findUnique({
      where: { id },
      include: { tl: true, tasks: { include: { assignedTo: { select: { id: true, email: true, firstName: true, lastName: true } } } } },
    });
    if (!p) throw new AppError(404, "Project not found");
    if (p.organizationId !== orgId) throw new AppError(403, "Access denied");
    return p;
  },
};
