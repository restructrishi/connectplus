import { prisma } from "../../../lib/prisma.js";
import type { LeadLifecycleStatus } from "@prisma/client";

export const leadRepository = {
  async create(data: {
    name: string;
    companyId: string;
    contactInfo?: string;
    createdBy: string;
    assignedTo?: string;
  }) {
    return prisma.salesLead.create({
      data: { ...data, status: "OPEN" },
    });
  },

  async findById(id: string) {
    return prisma.salesLead.findFirst({
      where: { id, deletedAt: null },
      include: { company: true, opportunity: true },
    });
  },

  async findMany(filters: {
    companyId?: string;
    status?: LeadLifecycleStatus;
    assignedTo?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
    const where = {
      deletedAt: null,
      ...(filters.companyId && { companyId: filters.companyId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.assignedTo && { assignedTo: filters.assignedTo }),
    };
    const [items, total] = await Promise.all([
      prisma.salesLead.findMany({
        where,
        orderBy: { id: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { company: { select: { id: true, name: true } } },
      }),
      prisma.salesLead.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async convert(id: string, data: { convertedBy: string; convertedReason: string }) {
    return prisma.salesLead.update({
      where: { id },
      data: {
        status: "CONVERTED",
        convertedAt: new Date(),
        convertedBy: data.convertedBy,
        convertedReason: data.convertedReason,
      },
    });
  },

  async markDead(id: string, data: { deadBy: string; deadReason: string }) {
    return prisma.salesLead.update({
      where: { id },
      data: {
        status: "DEAD",
        deadAt: new Date(),
        deadBy: data.deadBy,
        deadReason: data.deadReason,
      },
    });
  },

  async softDelete(id: string) {
    return prisma.salesLead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
