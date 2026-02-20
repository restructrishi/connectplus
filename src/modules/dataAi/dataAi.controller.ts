import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../middleware/errorHandler.js";
import type { ProjectStatus } from "@prisma/client";
import { dataAiService } from "./dataAi.service.js";

function userId(req: Request): string {
  const sub = req.user?.sub;
  if (!sub) throw new AppError(401, "Unauthorized");
  return sub;
}

export async function listProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as ProjectStatus | undefined;
    const data = await dataAiService.listProjects(userId(req), { status });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dataAiService.getProjectById(req.params.id!, userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
