import { prisma } from "../../../lib/prisma.js";

export const scmRepository = {
  async create(data: { opportunityId: string; ovfId: string; handedOffBy: string }) {
    return prisma.sCMHandoff.create({
      data: { ...data, status: "SENT" },
    });
  },

  async findByOpportunityId(opportunityId: string) {
    return prisma.sCMHandoff.findFirst({
      where: { opportunityId, deletedAt: null },
    });
  },

  async findMany(filters: { page?: number; pageSize?: number }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
    const where = { deletedAt: null };
    const [items, total] = await Promise.all([
      prisma.sCMHandoff.findMany({
        where,
        orderBy: { handedOffAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { opportunity: { include: { company: true } } },
      }),
      prisma.sCMHandoff.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },
};
