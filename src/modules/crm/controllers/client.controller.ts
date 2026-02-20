import type { Request, Response, NextFunction } from "express";
import { clientService } from "../services/client.service.js";
import { canViewAllLeads } from "../../../middleware/auth.js";

function options(req: Request) {
  return { assignedTo: req.user!.employeeId, canViewAll: canViewAllLeads(req) };
}

export async function createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const client = await clientService.create(req.body, req.user!.sub);
    res.status(201).json({ success: true, data: client, message: "Client created" });
  } catch (e) {
    next(e);
  }
}

export async function getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const client = await clientService.getById(req.params.id!, options(req));
    res.status(200).json({ success: true, data: client });
  } catch (e) {
    next(e);
  }
}

export async function listClients(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize, assignedTo } = req.query as { page?: string; pageSize?: string; assignedTo?: string };
    const result = await clientService.list({
      ...options(req),
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      assignedTo: assignedTo as string | undefined,
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

export async function updateClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const client = await clientService.update(req.params.id!, req.body, req.user!.sub, options(req));
    res.status(200).json({ success: true, data: client, message: "Client updated" });
  } catch (e) {
    next(e);
  }
}
