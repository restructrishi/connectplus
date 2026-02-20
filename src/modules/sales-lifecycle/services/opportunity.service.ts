import type { OpportunityStage } from "@prisma/client";
import { opportunityRepository } from "../repositories/opportunity.repository.js";
import { addTimelineEvent } from "../timeline.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { canPerform, canTransitionFromTo } from "../constants.js";
import type { CrmRole } from "@prisma/client";

export const opportunityService = {
  async create(
    data: {
      name: string;
      companyId: string;
      leadId?: string;
      estimatedValue?: number;
      assignedSalesPerson: string;
      probability?: number;
      expectedClosureDate?: Date;
    },
    userId: string,
    userRole: CrmRole
  ) {
    if (!canPerform(userRole, "create_opportunity")) throw new AppError(403, "Not allowed to create opportunity");
    const opp = await opportunityRepository.create(data);
    await addTimelineEvent({
      opportunityId: opp.id,
      action: "opportunity_created",
      stageTo: "OPEN",
      userId,
      metadata: { name: opp.name },
    });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.opportunity.create",
      entityType: "Opportunity",
      entityId: opp.id,
      metadata: { name: opp.name },
    });
    return opp;
  },

  async getById(id: string) {
    const opp = await opportunityRepository.findById(id);
    if (!opp) throw new AppError(404, "Opportunity not found");
    return opp;
  },

  async list(filters: { companyId?: string; stage?: OpportunityStage; assignedSalesPerson?: string; page?: number; pageSize?: number }) {
    return opportunityRepository.findMany(filters);
  },

  async transitionStage(
    id: string,
    toStage: OpportunityStage,
    userId: string,
    userRole: CrmRole,
    options?: { reason?: string; lostReason?: string }
  ) {
    const opp = await opportunityRepository.findById(id);
    if (!opp) throw new AppError(404, "Opportunity not found");
    if (opp.isLocked) throw new AppError(400, "Opportunity is locked");
    if (toStage === "LOST_DEAL") {
      if (!canPerform(userRole, "mark_lost")) throw new AppError(403, "Not allowed to mark lost");
      if (!options?.lostReason?.trim()) throw new AppError(400, "Lost reason is required");
    }
    const fromStage = opp.stage;
    if (!canTransitionFromTo(fromStage, toStage))
      throw new AppError(400, `Transition from ${fromStage} to ${toStage} not allowed`);
    const updated = await opportunityRepository.updateStage(id, toStage, {
      lostBy: toStage === "LOST_DEAL" ? userId : undefined,
      lostReason: options?.lostReason,
      lostStage: toStage === "LOST_DEAL" ? fromStage : undefined,
    });
    await addTimelineEvent({
      opportunityId: id,
      action: "stage_transition",
      stageFrom: fromStage,
      stageTo: toStage,
      userId,
      comment: options?.reason ?? options?.lostReason,
    });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.opportunity.stage",
      entityType: "Opportunity",
      entityId: id,
      metadata: { from: fromStage, to: toStage },
    });
    return updated;
  },

  async updateOemFields(
    id: string,
    data: { drNumber?: string; drNumberNa?: boolean; oemQuotationReceived?: boolean },
    userId: string,
    userRole: CrmRole
  ) {
    if (!canPerform(userRole, "set_oem_received")) throw new AppError(403, "Not allowed");
    const opp = await opportunityRepository.findById(id);
    if (!opp) throw new AppError(404, "Opportunity not found");
    if (opp.isLocked) throw new AppError(400, "Opportunity is locked");
    if (data.drNumberNa === false && data.drNumber === undefined && opp.drNumber == null)
      throw new AppError(400, "DR Number is required or mark as NA");
    const updated = await opportunityRepository.updateOemFields(id, data);
    await addTimelineEvent({
      opportunityId: id,
      action: "oem_fields_updated",
      userId,
      metadata: data as Record<string, unknown>,
    });
    return updated;
  },

  async getTimeline(opportunityId: string) {
    const opp = await opportunityRepository.findById(opportunityId);
    if (!opp) throw new AppError(404, "Opportunity not found");
    return opp.timeline;
  },
};
