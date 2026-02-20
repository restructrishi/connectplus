import { prisma } from "../../../lib/prisma.js";
import type { OpportunityStage } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const opportunityRepository = {
  async create(data: {
    name: string;
    companyId: string;
    leadId?: string;
    estimatedValue?: number;
    assignedSalesPerson: string;
    probability?: number;
    expectedClosureDate?: Date;
  }) {
    return prisma.opportunity.create({
      data: {
        ...data,
        estimatedValue: data.estimatedValue != null ? new Decimal(data.estimatedValue) : undefined,
        stage: "OPEN",
      },
    });
  },

  async findById(id: string) {
    return prisma.opportunity.findFirst({
      where: { id, deletedAt: null },
      include: {
        company: true,
        lead: true,
        documents: { where: { deletedAt: null }, orderBy: { uploadedAt: "desc" } },
        quote: true,
        ovf: { include: { approvals: true } },
        scmHandoff: true,
        timeline: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
  },

  async findMany(filters: {
    companyId?: string;
    stage?: OpportunityStage;
    assignedSalesPerson?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
    const where = {
      deletedAt: null,
      ...(filters.companyId && { companyId: filters.companyId }),
      ...(filters.stage && { stage: filters.stage }),
      ...(filters.assignedSalesPerson && { assignedSalesPerson: filters.assignedSalesPerson }),
    };
    const [items, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          company: { select: { id: true, name: true } },
          quote: { select: { id: true, amount: true, lockedAt: true } },
          ovf: { select: { id: true, status: true } },
        },
      }),
      prisma.opportunity.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async updateStage(id: string, stage: OpportunityStage, extra?: { lostBy?: string; lostReason?: string; lostStage?: string }) {
    const data: Record<string, unknown> = { stage, updatedAt: new Date() };
    if (stage === "LOST_DEAL" && extra) {
      data.isLocked = true;
      data.lostAt = new Date();
      data.lostBy = extra.lostBy;
      data.lostReason = extra.lostReason;
      data.lostStage = extra.lostStage;
    }
    if (stage === "SENT_TO_SCM") data.isLocked = true;
    return prisma.opportunity.update({ where: { id }, data: data as never });
  },

  async updateOemFields(id: string, data: { drNumber?: string; drNumberNa?: boolean; oemQuotationReceived?: boolean }) {
    return prisma.opportunity.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  },

  async softDelete(id: string) {
    return prisma.opportunity.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
