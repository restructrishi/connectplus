import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../middleware/errorHandler.js";
import type { CloudStatus } from "@prisma/client";
import { cloudService } from "./cloud.service.js";

function userId(req: Request): string {
  const sub = req.user?.sub;
  if (!sub) throw new AppError(401, "Unauthorized");
  return sub;
}

export async function listCloudProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as CloudStatus | undefined;
    const data = await cloudService.list(userId(req), { status });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getCloudProject(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cloudService.getById(req.params.id!, userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
