import type { Request, Response, NextFunction } from "express";
import { leadService } from "../services/lead.service.js";
import { canViewAllLeads } from "../../../middleware/auth.js";

export async function createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.sub;
    const body = req.body as Parameters<typeof leadService.create>[0];
    const lead = await leadService.create(body, userId);
    res.status(201).json({ success: true, data: lead, message: "Lead created" });
  } catch (e) {
    next(e);
  }
}

export async function getLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const options = { assignedTo: req.user!.employeeId, canViewAll: canViewAllLeads(req) };
    const lead = await leadService.getById(id!, options);
    res.status(200).json({ success: true, data: lead });
  } catch (e) {
    next(e);
  }
}

export async function listLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize, status, assignedTo } = req.query as {
      page?: string;
      pageSize?: string;
      status?: string;
      assignedTo?: string;
    };
    const canViewAll = canViewAllLeads(req);
    const options = {
      assignedTo: canViewAll ? (assignedTo as string | undefined) : req.user!.employeeId,
      canViewAll,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      status: status as "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined,
    };
    const result = await leadService.list(options);
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

export async function updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const options = { assignedTo: req.user!.employeeId, canViewAll: canViewAllLeads(req) };
    const lead = await leadService.update(id!, req.body, req.user!.sub, options);
    res.status(200).json({ success: true, data: lead, message: "Lead updated" });
  } catch (e) {
    next(e);
  }
}

export async function convertLeadToClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const options = { assignedTo: req.user!.employeeId, canViewAll: canViewAllLeads(req) };
    const client = await leadService.convertToClient(id!, req.user!.sub, options);
    res.status(201).json({ success: true, data: client, message: "Lead converted to client" });
  } catch (e) {
    next(e);
  }
}
