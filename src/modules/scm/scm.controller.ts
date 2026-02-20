import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../middleware/errorHandler.js";
import { scmService } from "./scm.service.js";

function userId(req: Request): string {
  const sub = req.user?.sub;
  if (!sub) throw new AppError(401, "Unauthorized");
  return sub;
}

export async function listPos(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as string | undefined;
    const dealId = req.query.dealId as string | undefined;
    const data = await scmService.listPos(userId(req), { status: status as any, dealId });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getPo(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await scmService.getPo(req.params.id!, userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function createPo(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as {
      dealId?: string;
      subtotal: number;
      tax?: number;
      shipping?: number;
      total: number;
      currency?: string;
      items?: { productId: string; quantity: number; unitPrice: number }[];
    };
    const data = await scmService.createPo(userId(req), body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updatePoStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status: string };
    const extra = req.body as Record<string, unknown>;
    delete extra.status;
    const data = await scmService.updatePoStatus(req.params.id!, userId(req), status as any, extra);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updatePo(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await scmService.updatePo(req.params.id!, userId(req), req.body as Record<string, unknown>);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function handoffToDeployment(req: Request, res: Response, next: NextFunction) {
  try {
    const deployment = await scmService.handoffToDeployment(req.params.id!, userId(req));
    res.status(201).json({ success: true, data: deployment });
  } catch (e) {
    next(e);
  }
}
