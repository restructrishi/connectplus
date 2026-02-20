import type { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task.service.js";
import { canViewAllLeads } from "../../../middleware/auth.js";

function options(req: Request) {
  return { assignedTo: req.user!.employeeId, canViewAll: canViewAllLeads(req) };
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as { title: string; description?: string; assignedTo: string; dueDate?: string; status?: string };
    const task = await taskService.create(
      {
        title: body.title,
        description: body.description,
        assignedTo: body.assignedTo,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        status: body.status as "PENDING" | "COMPLETED" | undefined,
      },
      req.user!.sub
    );
    res.status(201).json({ success: true, data: task, message: "Task created" });
  } catch (e) {
    next(e);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.getById(req.params.id!, options(req));
    res.status(200).json({ success: true, data: task });
  } catch (e) {
    next(e);
  }
}

export async function listTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize, assignedTo, status } = req.query as {
      page?: string;
      pageSize?: string;
      assignedTo?: string;
      status?: string;
    };
    const result = await taskService.list({
      ...options(req),
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      assignedTo,
      status: status as "PENDING" | "COMPLETED" | undefined,
    });
    res.status(200).json({
      success: true,
      data: {
        items: result.items,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as { title?: string; description?: string; assignedTo?: string; dueDate?: string | null; status?: string };
    const task = await taskService.update(
      req.params.id!,
      {
        title: body.title,
        description: body.description,
        assignedTo: body.assignedTo,
        dueDate: body.dueDate != null ? new Date(body.dueDate) : undefined,
        status: body.status as "PENDING" | "COMPLETED" | undefined,
      },
      req.user!.sub,
      options(req)
    );
    res.status(200).json({ success: true, data: task, message: "Task updated" });
  } catch (e) {
    next(e);
  }
}
