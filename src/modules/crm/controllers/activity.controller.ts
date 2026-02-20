import type { Request, Response, NextFunction } from "express";
import { activityService } from "../services/activity.service.js";
import { canViewAllLeads } from "../../../middleware/auth.js";

function options(req: Request) {
  return { assignedTo: req.user!.employeeId, canViewAll: canViewAllLeads(req) };
}

export async function createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const activity = await activityService.create(req.body, req.user!.sub, options(req));
    res.status(201).json({ success: true, data: activity, message: "Activity created" });
  } catch (e) {
    next(e);
  }
}

export async function getActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const activity = await activityService.getById(req.params.id!, options(req));
    res.status(200).json({ success: true, data: activity });
  } catch (e) {
    next(e);
  }
}

export async function listActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize, leadId, clientId, createdBy } = req.query as {
      page?: string;
      pageSize?: string;
      leadId?: string;
      clientId?: string;
      createdBy?: string;
    };
    const result = await activityService.list({
      ...options(req),
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      leadId,
      clientId,
      createdBy,
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
