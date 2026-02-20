import type { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { getHomeDashboard } from "../services/home-dashboard.service.js";

export async function getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const summary = await dashboardService.getSummary();
    res.status(200).json({ success: true, data: summary });
  } catch (e) {
    next(e);
  }
}

export async function getHomeDashboardData(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getHomeDashboard();
    res.status(200).json({ success: true, data });
  } catch (e) {
    console.error("[dashboard/home]", e);
    res.status(200).json({
      success: true,
      data: {
        leadCountThisMonth: 0,
        leadCountLastMonth: 0,
        opportunityCountThisMonth: 0,
        opportunityCountLastMonth: 0,
        quoteCountThisMonth: 0,
        quoteCountLastMonth: 0,
        contactCountThisMonth: 0,
        contactCountLastMonth: 0,
        leadCountUserWise: [],
        leadCountStageWise: [
          { stage: "OPEN", count: 0 },
          { stage: "BOQ_SUBMITTED", count: 0 },
          { stage: "SOW_ATTACHED", count: 0 },
          { stage: "OEM_QUOTATION_RECEIVED", count: 0 },
          { stage: "QUOTE_CREATED", count: 0 },
          { stage: "OVF_CREATED", count: 0 },
          { stage: "APPROVAL_PENDING", count: 0 },
          { stage: "APPROVED", count: 0 },
          { stage: "SENT_TO_SCM", count: 0 },
          { stage: "LOST_DEAL", count: 0 },
        ],
      },
    });
  }
}
