import { prisma } from "../../../lib/prisma.js";
import type { ActivityType } from "@prisma/client";

const DEFAULT_PAGE_SIZE = 20;

export const activityRepository = {
  async create(data: {
    leadId?: string;
    clientId?: string;
    type: ActivityType;
    notes?: string;
    createdBy: string;
  }) {
    return prisma.activity.create({ data });
  },

  async findById(id: string) {
    return prisma.activity.findUnique({
      where: { id },
      include: { lead: true, client: true },
    });
  },

  async findMany(filters: {
    leadId?: string;
    clientId?: string;
    createdBy?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
    const where: { leadId?: string; clientId?: string; createdBy?: string } = {};
    if (filters.leadId != null) where.leadId = filters.leadId;
    if (filters.clientId != null) where.clientId = filters.clientId;
    if (filters.createdBy != null) where.createdBy = filters.createdBy;

    const [items, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.activity.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },
};
