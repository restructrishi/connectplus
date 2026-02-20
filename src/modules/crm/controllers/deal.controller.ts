import type { Request, Response, NextFunction } from "express";
import { dealService } from "../services/deal.service.js";
import { canViewAllLeads } from "../../../middleware/auth.js";

function options(req: Request) {
  return { assignedTo: req.user!.employeeId, canViewAll: canViewAllLeads(req) };
}

export async function createDeal(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as { clientId: string; value: number; stage?: string; expectedClosureDate?: string | Date };
    const deal = await dealService.create(
      {
        clientId: body.clientId,
        value: body.value,
        stage: body.stage as "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST" | undefined,
        expectedClosureDate: body.expectedClosureDate ? new Date(body.expectedClosureDate) : undefined,
      },
      req.user!.sub,
      options(req)
    );
    res.status(201).json({ success: true, data: deal, message: "Deal created" });
  } catch (e) {
    next(e);
  }
}

export async function getDeal(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deal = await dealService.getById(req.params.id!, options(req));
    res.status(200).json({ success: true, data: deal });
  } catch (e) {
    next(e);
  }
}

export async function listDeals(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize, clientId, stage } = req.query as {
      page?: string;
      pageSize?: string;
      clientId?: string;
      stage?: string;
    };
    const result = await dealService.list({
      ...options(req),
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      clientId,
      stage: stage as "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST" | undefined,
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

export async function listDealsByClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deals = await dealService.listByClient(req.params.clientId!, options(req));
    res.status(200).json({ success: true, data: deals });
  } catch (e) {
    next(e);
  }
}

export async function updateDeal(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as { value?: number; stage?: string; expectedClosureDate?: string | null };
    const deal = await dealService.update(
      req.params.id!,
      {
        value: body.value,
        stage: body.stage as "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST" | undefined,
        expectedClosureDate: body.expectedClosureDate != null ? new Date(body.expectedClosureDate) : undefined,
      },
      req.user!.sub,
      options(req)
    );
    res.status(200).json({ success: true, data: deal, message: "Deal updated" });
  } catch (e) {
    next(e);
  }
}
