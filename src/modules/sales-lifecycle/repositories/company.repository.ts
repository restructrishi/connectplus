import { prisma } from "../../../lib/prisma.js";
import type { CompanyStatus } from "@prisma/client";

export const companyRepository = {
  async create(data: { name: string; createdBy: string }) {
    return prisma.salesCompany.create({
      data: { name: data.name, createdBy: data.createdBy, status: "OPEN" },
    });
  },

  async findById(id: string) {
    return prisma.salesCompany.findFirst({
      where: { id, deletedAt: null },
      include: { leads: { where: { deletedAt: null } }, opportunities: { where: { deletedAt: null } } },
    });
  },

  async findMany(filters: { status?: CompanyStatus; page?: number; pageSize?: number }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
    const where = { deletedAt: null, ...(filters.status && { status: filters.status }) };
    const [items, total] = await Promise.all([
      prisma.salesCompany.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.salesCompany.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async updateStatus(id: string, status: CompanyStatus) {
    return prisma.salesCompany.update({
      where: { id },
      data: { status },
    });
  },

  async softDelete(id: string) {
    return prisma.salesCompany.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async hasActiveOpportunity(companyId: string): Promise<boolean> {
    const n = await prisma.opportunity.count({
      where: { companyId, deletedAt: null, isLocked: false, stage: { not: "LOST_DEAL" } },
    });
    return n > 0;
  },
};
