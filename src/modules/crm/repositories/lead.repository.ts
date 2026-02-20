import { prisma } from "../../../lib/prisma.js";
import type { LeadStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const DEFAULT_PAGE_SIZE = 20;

export const leadRepository = {
  async create(data: {
    name: string;
    phone?: string;
    email: string;
    company?: string;
    source?: string;
    status?: LeadStatus;
    assignedTo?: string;
    industry?: string;
    expectedClosureDate?: Date;
    expectedBusinessAmount?: number;
    details?: object;
  }) {
    const payload: Record<string, unknown> = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      company: data.company,
      source: data.source,
      status: data.status ?? "NEW",
      assignedTo: data.assignedTo,
      industry: data.industry,
      expectedClosureDate: data.expectedClosureDate,
      details: data.details ?? undefined,
    };
    if (data.expectedBusinessAmount != null) payload.expectedBusinessAmount = new Decimal(data.expectedBusinessAmount);
    return prisma.lead.create({ data: payload as never });
  },

  async findById(id: string) {
    return prisma.lead.findUnique({
      where: { id },
      include: { activities: { orderBy: { createdAt: "desc" }, take: 10 } },
    });
  },

  async findMany(filters: {
    assignedTo?: string;
    status?: LeadStatus;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
    const where: { assignedTo?: string; status?: LeadStatus } = {};
    if (filters.assignedTo != null) where.assignedTo = filters.assignedTo;
    if (filters.status != null) where.status = filters.status;

    const [rawItems, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          client: { include: { _count: { select: { deals: true } } } },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    const items = rawItems.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
      assignedTo: lead.assignedTo,
      industry: lead.industry,
      expectedClosureDate: lead.expectedClosureDate,
      expectedBusinessAmount: lead.expectedBusinessAmount != null ? Number(lead.expectedBusinessAmount) : null,
      details: lead.details as Record<string, unknown> | null,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      hasDeal: (lead.client?._count?.deals ?? 0) > 0,
    }));

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      phone: string;
      email: string;
      company: string;
      source: string;
      status: LeadStatus;
      assignedTo: string;
      industry: string;
      expectedClosureDate: Date;
      expectedBusinessAmount: number;
      details: object;
    }>
  ) {
    const payload: Record<string, unknown> = { ...data };
    if (data.expectedBusinessAmount !== undefined) payload.expectedBusinessAmount = new Decimal(data.expectedBusinessAmount);
    return prisma.lead.update({ where: { id }, data: payload as never });
  },

  async countByStatus() {
    return prisma.lead.groupBy({
      by: ["status"],
      _count: { id: true },
    });
  },

  async countByAssigned(assignedTo: string) {
    return prisma.lead.count({ where: { assignedTo } });
  },
};
