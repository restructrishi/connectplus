import type { Request, Response, NextFunction } from "express";
import { pipelineService } from "./pipeline.service.js";
import { syncPipelineOpportunityToLifecycle } from "./pipeline-lifecycle-sync.js";

export async function createCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body as { name: string };
    const data = await pipelineService.createCompany(name);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function listCompanies(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await pipelineService.listCompanies();
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const { companyId } = req.body as { companyId: string };
    const data = await pipelineService.createLead(companyId);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getActiveLeads(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await pipelineService.getActiveLeads();
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function convertLead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await pipelineService.convertLeadToOpportunity(req.params.id!);
    if (req.user?.employeeId && data?.id) {
      syncPipelineOpportunityToLifecycle(data.id, req.user.employeeId, (req.user as { role?: string })?.role ?? "SALES_EXECUTIVE").catch(
        () => { /* pipeline convert already succeeded; sync failure is non-fatal */ }
      );
    }
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function markLeadLost(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = req.body as { reason: string };
    const data = await pipelineService.markLeadLost(req.params.id!, reason);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function listOpportunities(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await pipelineService.listOpportunities();
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getOpportunity(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await pipelineService.getOpportunityById(req.params.id!);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updateOpportunityStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status: string };
    const data = await pipelineService.updateOpportunityStatus(req.params.id!, status);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updateOpportunityAttachments(req: Request, res: Response, next: NextFunction) {
  try {
    const attachments = req.body as object;
    const data = await pipelineService.updateOpportunityAttachments(req.params.id!, attachments);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updateOpportunityTechnical(req: Request, res: Response, next: NextFunction) {
  try {
    const technicalDetails = req.body as object;
    const data = await pipelineService.updateOpportunityTechnical(req.params.id!, technicalDetails);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function sendOpportunityEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as { type?: string; to?: string[] };
    const data = await pipelineService.addEmailSent(req.params.id!, {
      type: body.type ?? "PRESALES_TEAM",
      sentAt: new Date().toISOString(),
      to: Array.isArray(body.to) ? body.to : [],
      status: "SENT",
    });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function approveOpportunity(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as { approvalIndex?: number; status?: string; approvedBy?: string };
    const data = await pipelineService.approveOpportunity(
      req.params.id!,
      body.approvalIndex ?? 0,
      body.status ?? "APPROVED",
      body.approvedBy
    );
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updateOpportunityOvf(req: Request, res: Response, next: NextFunction) {
  try {
    const ovfDetails = req.body as object;
    const data = await pipelineService.updateOpportunityOvf(req.params.id!, ovfDetails);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function markOpportunityLost(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = req.body as { reason: string };
    const data = await pipelineService.markOpportunityLost(req.params.id!, reason);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function pipelineUpload(req: Request, res: Response, next: NextFunction) {
  try {
    const opportunityId = (req.body as { opportunityId?: string })?.opportunityId ?? "temp";
    const type = (req.body as { type?: string })?.type ?? "file";
    const key = "pipeline/" + opportunityId + "/" + type + "-" + Date.now();
    res.status(200).json({ success: true, data: { key, url: "/api/pipeline/files/" + key } });
  } catch (e) {
    next(e);
  }
}

export async function getPipelineFile(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(404).json({ success: false, message: "File not found" });
  } catch (e) {
    next(e);
  }
}
