import { prisma } from "../../../lib/prisma.js";

const DEFAULT_PAGE_SIZE = 20;

export const clientRepository = {
  async create(data: {
    companyName: string;
    contactPerson: string;
    phone?: string;
    email: string;
    industry?: string;
    assignedTo?: string;
    convertedFromLeadId?: string;
  }) {
    return prisma.client.create({ data });
  },

  async findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        deals: true,
        activities: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
  },

  async findMany(filters: {
    assignedTo?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
    const where: { assignedTo?: string } = {};
    if (filters.assignedTo != null) where.assignedTo = filters.assignedTo;

    const [items, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          companyName: true,
          contactPerson: true,
          email: true,
          phone: true,
          industry: true,
          assignedTo: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.client.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async update(
    id: string,
    data: Partial<{
      companyName: string;
      contactPerson: string;
      phone: string;
      email: string;
      industry: string;
      assignedTo: string;
    }>
  ) {
    return prisma.client.update({ where: { id }, data });
  },

  async findByConvertedLeadId(leadId: string) {
    return prisma.client.findUnique({ where: { convertedFromLeadId: leadId } });
  },
};
