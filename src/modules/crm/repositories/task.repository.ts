import { prisma } from "../../../lib/prisma.js";
import type { TaskStatus } from "@prisma/client";

const DEFAULT_PAGE_SIZE = 20;

export const taskRepository = {
  async create(data: {
    title: string;
    description?: string;
    assignedTo: string;
    dueDate?: Date;
    status?: TaskStatus;
  }) {
    return prisma.task.create({ data });
  },

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  },

  async findMany(filters: {
    assignedTo?: string;
    status?: TaskStatus;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
    const where: { assignedTo?: string; status?: TaskStatus } = {};
    if (filters.assignedTo != null) where.assignedTo = filters.assignedTo;
    if (filters.status != null) where.status = filters.status;

    const [items, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [{ status: "asc" }, { dueDate: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.task.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      assignedTo: string;
      dueDate: Date | null;
      status: TaskStatus;
    }>
  ) {
    return prisma.task.update({ where: { id }, data });
  },
};
