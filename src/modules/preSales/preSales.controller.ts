import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../middleware/errorHandler.js";
import { preSalesService } from "./preSales.service.js";

function userId(req: Request): string {
  const sub = req.user?.sub;
  if (!sub) throw new AppError(401, "Unauthorized");
  return sub;
}

export async function listPreSales(req: Request, res: Response, next: NextFunction) {
  try {
    const dealId = req.query.dealId as string | undefined;
    const data = await preSalesService.list(userId(req), { dealId });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function createPreSales(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as { dealId: string; handoverDate: string; handoverNotes?: string };
    const data = await preSalesService.create(userId(req), body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getPreSales(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await preSalesService.getById(req.params.id!, userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updatePreSales(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await preSalesService.update(req.params.id!, userId(req), req.body as Record<string, unknown>);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
