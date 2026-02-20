import { prisma } from "../../../lib/prisma.js";
import type { DealStage } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const DEFAULT_PAGE_SIZE = 20;

export const dealRepository = {
  async create(data: {
    clientId: string;
    value: number | Decimal;
    stage?: DealStage;
    expectedClosureDate?: Date;
  }) {
    return prisma.deal.create({
      data: {
        ...data,
        value: new Decimal(data.value),
      },
    });
  },

  async findById(id: string) {
    return prisma.deal.findUnique({
      where: { id },
      include: { client: true },
    });
  },

  async findManyByClientId(clientId: string) {
    return prisma.deal.findMany({
      where: { clientId },
      orderBy: { updatedAt: "desc" },
    });
  },

  async findMany(filters: { clientId?: string; stage?: DealStage; page?: number; pageSize?: number }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
    const where: { clientId?: string; stage?: DealStage } = {};
    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.stage) where.stage = filters.stage;

    const [items, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { client: { select: { id: true, companyName: true, contactPerson: true } } },
      }),
      prisma.deal.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async update(
    id: string,
    data: Partial<{
      value: number | Decimal;
      stage: DealStage;
      expectedClosureDate: Date | null;
    }>
  ) {
    const payload = { ...data };
    if (data.value !== undefined) (payload as { value?: Decimal }).value = new Decimal(data.value);
    return prisma.deal.update({ where: { id }, data: payload });
  },

  async sumWonByMonth(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    const result = await prisma.deal.aggregate({
      where: { stage: "WON", updatedAt: { gte: start, lte: end } },
      _sum: { value: true },
    });
    return Number(result._sum.value ?? 0);
  },

  async countByStage() {
    return prisma.deal.groupBy({
      by: ["stage"],
      _count: { id: true },
      _sum: { value: true },
    });
  },
};
