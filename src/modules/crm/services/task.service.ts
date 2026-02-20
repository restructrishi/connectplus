import type { TaskStatus } from "@prisma/client";
import { taskRepository } from "../repositories/task.repository.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";

const VALID_STATUSES: TaskStatus[] = ["PENDING", "COMPLETED"];

export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedTo: string;
  dueDate?: Date;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  assignedTo?: string;
  dueDate?: Date | null;
  status?: TaskStatus;
}

export const taskService = {
  async create(input: CreateTaskInput, userId: string) {
    if (input.status && !VALID_STATUSES.includes(input.status)) {
      throw new AppError(400, "Invalid task status");
    }
    const task = await taskRepository.create({
      title: input.title,
      description: input.description,
      assignedTo: input.assignedTo,
      dueDate: input.dueDate,
      status: input.status ?? "PENDING",
    });
    await createAuditLog({
      userId,
      action: "task.create",
      entityType: "Task",
      entityId: task.id,
      metadata: { assignedTo: input.assignedTo },
    });
    return task;
  },

  async getById(id: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError(404, "Task not found");
    if (!options.canViewAll && task.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this task");
    }
    return task;
  },

  async list(filters: {
    assignedTo?: string;
    status?: TaskStatus;
    page?: number;
    pageSize?: number;
    canViewAll: boolean;
  }) {
    const assignedTo = filters.canViewAll ? undefined : filters.assignedTo;
    return taskRepository.findMany({
      assignedTo: assignedTo ?? undefined,
      status: filters.status,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  },

  async update(id: string, input: UpdateTaskInput, userId: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const existing = await taskRepository.findById(id);
    if (!existing) throw new AppError(404, "Task not found");
    if (!options.canViewAll && existing.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this task");
    }
    if (input.status && !VALID_STATUSES.includes(input.status)) {
      throw new AppError(400, "Invalid task status");
    }
    const updated = await taskRepository.update(id, {
      title: input.title,
      description: input.description,
      assignedTo: input.assignedTo,
      dueDate: input.dueDate,
      status: input.status,
    });
    await createAuditLog({
      userId,
      action: "task.update",
      entityType: "Task",
      entityId: id,
    });
    return updated;
  },
};
