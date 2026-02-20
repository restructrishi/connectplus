import { opportunityRepository } from "../repositories/opportunity.repository.js";
import { quoteRepository } from "../repositories/quote.repository.js";
import { addTimelineEvent } from "../timeline.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { canPerform } from "../constants.js";
import type { CrmRole } from "@prisma/client";

export const quoteService = {
  async create(
    data: {
      opportunityId: string;
      amount: number;
      marginPercent?: number;
      marginAmount?: number;
      details?: object;
    },
    userId: string,
    userRole: CrmRole
  ) {
    if (!canPerform(userRole, "create_quote")) throw new AppError(403, "Not allowed to create quote");
    const opp = await opportunityRepository.findById(data.opportunityId);
    if (!opp) throw new AppError(404, "Opportunity not found");
    if (opp.stage !== "OEM_QUOTATION_RECEIVED" && opp.stage !== "QUOTE_CREATED")
      throw new AppError(400, "Quote can only be created at OEM Quotation or Quote stage");
    const existing = await quoteRepository.findByOpportunityId(data.opportunityId);
    if (existing) throw new AppError(400, "Quote already exists for this opportunity");
    const quote = await quoteRepository.create({
      ...data,
      createdBy: userId,
    });
    await opportunityRepository.updateStage(quote.opportunityId, "QUOTE_CREATED");
    await addTimelineEvent({
      opportunityId: data.opportunityId,
      action: "quote_created",
      stageTo: "QUOTE_CREATED",
      userId,
      metadata: { amount: data.amount },
    });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.quote.create",
      entityType: "Quote",
      entityId: quote.id,
      metadata: { opportunityId: data.opportunityId },
    });
    return quote;
  },

  async getById(id: string) {
    const quote = await quoteRepository.findById(id);
    if (!quote) throw new AppError(404, "Quote not found");
    return quote;
  },

  async update(
    id: string,
    data: { amount?: number; marginPercent?: number; marginAmount?: number; details?: object },
    userId: string,
    userRole: CrmRole
  ) {
    if (!canPerform(userRole, "edit_quote")) throw new AppError(403, "Not allowed to edit quote");
    const quote = await quoteRepository.findById(id);
    if (!quote) throw new AppError(404, "Quote not found");
    if (quote.lockedAt) throw new AppError(400, "Quote is locked (OVF created)");
    const updated = await quoteRepository.update(id, data);
    await createAuditLog({
      userId,
      action: "sales_lifecycle.quote.update",
      entityType: "Quote",
      entityId: id,
    });
    return updated;
  },
};
