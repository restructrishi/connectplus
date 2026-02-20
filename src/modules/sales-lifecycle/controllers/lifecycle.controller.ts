import type { Request, Response, NextFunction } from "express";
import type { CrmRole } from "@prisma/client";
import { companyService } from "../services/company.service.js";
import { leadService } from "../services/lead.service.js";
import { opportunityService } from "../services/opportunity.service.js";
import { quoteService } from "../services/quote.service.js";
import { ovfService } from "../services/ovf.service.js";
import { approvalService } from "../services/approval.service.js";
import { scmService } from "../services/scm.service.js";
import { getLifecycleDashboard } from "../services/lifecycle-dashboard.service.js";
import { pipelineService } from "../services/pipeline.service.js";

function user(req: Request) {
  const u = req.user!;
  return { userId: u.employeeId, userRole: u.role as CrmRole };
}

export async function createCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body as { name: string };
    const data = await companyService.create(name, user(req).userId, user(req).userRole);
    res.status(201).json({ success: true, data, message: "Company created" });
  } catch (e) { next(e); }
}

export async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await companyService.getById(req.params.id!);
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function listCompanies(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query as { page?: string; pageSize?: string; status?: string };
    const data = await companyService.list({
      page: q.page ? parseInt(q.page, 10) : undefined,
      pageSize: q.pageSize ? parseInt(q.pageSize, 10) : undefined,
      status: q.status as "OPEN" | "CLOSED" | undefined,
    });
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await leadService.create(req.body, user(req).userId, user(req).userRole);
    res.status(201).json({ success: true, data, message: "Lead created" });
  } catch (e) { next(e); }
}

export async function getLead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await leadService.getById(req.params.id!);
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function listLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query as { page?: string; pageSize?: string; companyId?: string; status?: string; assignedTo?: string };
    const data = await leadService.list({
      page: q.page ? parseInt(q.page, 10) : undefined,
      pageSize: q.pageSize ? parseInt(q.pageSize, 10) : undefined,
      companyId: q.companyId,
      status: q.status as "OPEN" | "CONVERTED" | "DEAD" | undefined,
      assignedTo: q.assignedTo,
    });
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function convertLead(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = req.body as { reason: string };
    const data = await leadService.convertToOpportunity(req.params.id!, reason, user(req).userId, user(req).userRole);
    res.status(200).json({ success: true, data, message: "Lead converted" });
  } catch (e) { next(e); }
}

export async function markLeadDead(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = req.body as { reason: string };
    const data = await leadService.markDead(req.params.id!, reason, user(req).userId, user(req).userRole);
    res.status(200).json({ success: true, data, message: "Lead marked dead" });
  } catch (e) { next(e); }
}

export async function createOpportunity(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as { name: string; companyId: string; leadId?: string; estimatedValue?: number; assignedSalesPerson: string; probability?: number; expectedClosureDate?: string };
    const data = await opportunityService.create(
      {
        ...body,
        expectedClosureDate: body.expectedClosureDate ? new Date(body.expectedClosureDate) : undefined,
      },
      user(req).userId,
      user(req).userRole
    );
    res.status(201).json({ success: true, data, message: "Opportunity created" });
  } catch (e) { next(e); }
}

export async function getOpportunity(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await opportunityService.getById(req.params.id!);
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function listOpportunities(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query as { page?: string; pageSize?: string; companyId?: string; stage?: string; assignedSalesPerson?: string };
    const data = await opportunityService.list({
      page: q.page ? parseInt(q.page, 10) : undefined,
      pageSize: q.pageSize ? parseInt(q.pageSize, 10) : undefined,
      companyId: q.companyId,
      stage: q.stage as any,
      assignedSalesPerson: q.assignedSalesPerson,
    });
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function transitionStage(req: Request, res: Response, next: NextFunction) {
  try {
    const { stage, reason, lostReason } = req.body as { stage: string; reason?: string; lostReason?: string };
    const data = await opportunityService.transitionStage(
      req.params.id!,
      stage as any,
      user(req).userId,
      user(req).userRole,
      { reason, lostReason }
    );
    res.status(200).json({ success: true, data, message: "Stage updated" });
  } catch (e) { next(e); }
}

export async function updateOemFields(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await opportunityService.updateOemFields(req.params.id!, req.body, user(req).userId, user(req).userRole);
    res.status(200).json({ success: true, data, message: "OEM fields updated" });
  } catch (e) { next(e); }
}

export async function getOpportunityTimeline(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await opportunityService.getTimeline(req.params.id!);
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function getOpportunityPipeline(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await pipelineService.getPipelineView(req.params.id!, user(req).userRole);
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function createQuote(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await quoteService.create(req.body, user(req).userId, user(req).userRole);
    res.status(201).json({ success: true, data, message: "Quote created" });
  } catch (e) { next(e); }
}

export async function getQuote(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await quoteService.getById(req.params.id!);
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function updateQuote(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await quoteService.update(req.params.id!, req.body, user(req).userId, user(req).userRole);
    res.status(200).json({ success: true, data, message: "Quote updated" });
  } catch (e) { next(e); }
}

export async function createOvf(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ovfService.create(req.body, user(req).userId, user(req).userRole);
    res.status(201).json({ success: true, data, message: "OVF created" });
  } catch (e) { next(e); }
}

export async function sendOvfForApproval(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ovfService.sendForApproval(req.params.id!, user(req).userId, user(req).userRole);
    res.status(200).json({ success: true, data, message: "Sent for approval" });
  } catch (e) { next(e); }
}

export async function listPendingApprovals(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await approvalService.listPending(user(req).userRole);
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function approvalDecide(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, comments } = req.body as { status: string; comments?: string };
    const data = await approvalService.decide(req.params.id!, { status: status as any, comments }, user(req).userId, user(req).userRole);
    res.status(200).json({ success: true, data, message: status === "APPROVED" ? "Approved" : "Rejected" });
  } catch (e) { next(e); }
}

export async function scmHandoff(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await scmService.handoff(req.params.opportunityId!, user(req).userId, user(req).userRole);
    res.status(201).json({ success: true, data, message: "Handed off to SCM" });
  } catch (e) { next(e); }
}

export async function listScmHandoffs(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query as { page?: string; pageSize?: string };
    const data = await scmService.list(
      { page: q.page ? parseInt(q.page, 10) : undefined, pageSize: q.pageSize ? parseInt(q.pageSize, 10) : undefined },
      user(req).userRole
    );
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}

export async function getLifecycleDashboardData(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getLifecycleDashboard();
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
}
