import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../middleware/errorHandler.js";
import type { DeploymentStatus } from "@prisma/client";
import { deploymentService } from "./deployment.service.js";

function userId(req: Request): string {
  const sub = req.user?.sub;
  if (!sub) throw new AppError(401, "Unauthorized");
  return sub;
}

export async function listDeployments(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as DeploymentStatus | undefined;
    const dealId = req.query.dealId as string | undefined;
    const data = await deploymentService.list(userId(req), { status, dealId });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getDeployment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await deploymentService.getById(req.params.id!, userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function createDeployment(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as { dealId: string; contactId: string };
    const data = await deploymentService.create(userId(req), body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updateDeployment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await deploymentService.update(req.params.id!, userId(req), req.body as Record<string, unknown>);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
