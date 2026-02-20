import { prisma } from "../../../lib/prisma.js";
import { Decimal } from "@prisma/client/runtime/library";

export const quoteRepository = {
  async create(data: {
    opportunityId: string;
    amount: number;
    marginPercent?: number;
    marginAmount?: number;
    details?: object;
    createdBy: string;
  }) {
    return prisma.quote.create({
      data: {
        ...data,
        amount: new Decimal(data.amount),
        marginPercent: data.marginPercent != null ? new Decimal(data.marginPercent) : undefined,
        marginAmount: data.marginAmount != null ? new Decimal(data.marginAmount) : undefined,
      },
    });
  },

  async findById(id: string) {
    return prisma.quote.findFirst({
      where: { id, deletedAt: null },
      include: { opportunity: true, ovf: true },
    });
  },

  async findByOpportunityId(opportunityId: string) {
    return prisma.quote.findFirst({
      where: { opportunityId, deletedAt: null },
      include: { ovf: true },
    });
  },

  async update(id: string, data: { amount?: number; marginPercent?: number; marginAmount?: number; details?: object }) {
    const payload: Record<string, unknown> = { updatedAt: new Date() };
    if (data.amount != null) payload.amount = new Decimal(data.amount);
    if (data.marginPercent != null) payload.marginPercent = new Decimal(data.marginPercent);
    if (data.marginAmount != null) payload.marginAmount = new Decimal(data.marginAmount);
    if (data.details != null) payload.details = data.details;
    return prisma.quote.update({ where: { id }, data: payload as never });
  },

  async lock(id: string) {
    return prisma.quote.update({
      where: { id },
      data: { lockedAt: new Date(), updatedAt: new Date() },
    });
  },
};
