import { prisma } from "../../../lib/prisma.js";
import { Decimal } from "@prisma/client/runtime/library";
import type { OVFStatus } from "@prisma/client";

export const ovfRepository = {
  async create(data: {
    opportunityId: string;
    quoteId: string;
    dealName: string;
    finalAmount: number;
    marginPercent?: number;
    paymentTerms?: string;
    createdBy: string;
  }) {
    return prisma.oVF.create({
      data: {
        ...data,
        finalAmount: new Decimal(data.finalAmount),
        marginPercent: data.marginPercent != null ? new Decimal(data.marginPercent) : undefined,
        status: "DRAFT",
      },
    });
  },

  async findById(id: string) {
    return prisma.oVF.findFirst({
      where: { id, deletedAt: null },
      include: { opportunity: true, quote: true, approvals: true },
    });
  },

  async findByOpportunityId(opportunityId: string) {
    return prisma.oVF.findFirst({
      where: { opportunityId, deletedAt: null },
      include: { quote: true, approvals: true },
    });
  },

  async updateStatus(id: string, status: OVFStatus, sentForApprovalAt?: Date) {
    const data: { status: OVFStatus; sentForApprovalAt?: Date } = { status };
    if (sentForApprovalAt) data.sentForApprovalAt = sentForApprovalAt;
    return prisma.oVF.update({ where: { id }, data });
  },
};
