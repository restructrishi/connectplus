import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../middleware/errorHandler.js";
import type { PolicyStatus } from "@prisma/client";
import { legalService } from "./legal.service.js";

function userId(req: Request): string {
  const sub = req.user?.sub;
  if (!sub) throw new AppError(401, "Unauthorized");
  return sub;
}

export async function listAgreements(req: Request, res: Response, next: NextFunction) {
  try {
    const dealId = req.query.dealId as string | undefined;
    const data = await legalService.listAgreements(userId(req), { dealId });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getAgreement(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await legalService.getAgreementById(req.params.id!, userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function listPolicies(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as PolicyStatus | undefined;
    const data = await legalService.listPolicies(userId(req), { status });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getPolicy(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await legalService.getPolicyById(req.params.id!, userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
