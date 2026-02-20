import type { Request, Response, NextFunction } from "express";
import { orgCrmService } from "./orgCrm.service.js";
import { AppError } from "../../middleware/errorHandler.js";

function userId(req: Request): string {
  const sub = req.user?.sub;
  if (!sub) throw new AppError(401, "Unauthorized");
  return sub;
}

export async function listContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await orgCrmService.listContacts(userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function createContact(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as {
      firstName: string;
      lastName: string;
      email: string;
      companyName: string;
      phone?: string;
    };
    const data = await orgCrmService.createContact(userId(req), body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getContact(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await orgCrmService.getContact(req.params.id!, userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function listDeals(req: Request, res: Response, next: NextFunction) {
  try {
    const stage = req.query.stage as string | undefined;
    const data = await orgCrmService.listDeals(userId(req), stage ? { stage: stage as never } : undefined);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getDeal(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Deal id is required" });
      return;
    }
    const data = await orgCrmService.getDeal(id, userId(req));
    res.status(200).json({ success: true, data });
  } catch (e) {
    if (e instanceof AppError) return next(e);
    console.error("[orgCrm] getDeal error", e);
    next(e);
  }
}

export async function createDeal(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as {
      dealName: string;
      dealValue: number;
      contactId: string;
      stage?: string;
      expectedCloseDate?: string;
    };
    const data = await orgCrmService.createDeal(userId(req), {
      ...body,
      stage: body.stage as never,
    });
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
