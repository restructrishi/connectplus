import { prisma } from "../../../lib/prisma.js";
import type { ApprovalStatus } from "@prisma/client";

export const approvalRepository = {
  async create(data: { ovfId: string; opportunityId: string }) {
    return prisma.approval.create({
      data: { ...data, status: "PENDING" },
    });
  },

  async findById(id: string) {
    return prisma.approval.findFirst({
      where: { id, deletedAt: null },
      include: { ovf: true, opportunity: true },
    });
  },

  async findByOvfId(ovfId: string) {
    return prisma.approval.findMany({
      where: { ovfId, deletedAt: null },
      orderBy: { requestedAt: "desc" },
    });
  },

  async findPending() {
    return prisma.approval.findMany({
      where: { status: "PENDING", deletedAt: null },
      include: { ovf: { include: { opportunity: true, quote: true } } },
      orderBy: { requestedAt: "asc" },
    });
  },

  async decide(id: string, data: { status: ApprovalStatus; decidedBy: string; comments?: string }) {
    return prisma.approval.update({
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
