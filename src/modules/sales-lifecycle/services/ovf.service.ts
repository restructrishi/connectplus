import { opportunityRepository } from "../repositories/opportunity.repository.js";
import { quoteRepository } from "../repositories/quote.repository.js";
import { ovfRepository } from "../repositories/ovf.repository.js";
import { approvalRepository } from "../repositories/approval.repository.js";
import { addTimelineEvent } from "../timeline.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { canPerform } from "../constants.js";
import type { CrmRole } from "@prisma/client";

export const ovfService = {
  async create(
    data: {
      opportunityId: string;
      quoteId: string;
      dealName: string;
      finalAmount: number;
      marginPercent?: number;
      paymentTerms?: string;
    },
    userId: string,
    userRole: CrmRole
  ) {
    if (!canPerform(userRole, "create_ovf")) throw new AppError(403, "Not allowed to create OVF");
    const opp = await opportunityRepository.findById(data.opportunityId);
    if (!opp) throw new AppError(404, "Opportunity not found");
    if (opp.stage !== "QUOTE_CREATED") throw new AppError(400, "Opportunity must be at Quote Created stage");
    const quote = await quoteRepository.findById(data.quoteId);
    if (!quote || quote.opportunityId !== data.opportunityId) throw new AppError(404, "Quote not found");
    const ovf = await ovfRepository.create({ ...data, createdBy: userId });
    await quoteRepository.lock(data.quoteId);
    await opportunityRepository.updateStage(data.opportunityId, "OVF_CREATED");
    await addTimelineEvent({
      opportunityId: data.opportunityId,
      action: "ovf_created",
      stageTo: "OVF_CREATED",
      userId,
      metadata: { dealName: data.dealName },
    });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.ovf.create",
      entityType: "OVF",
      entityId: ovf.id,
      metadata: { opportunityId: data.opportunityId },
    });
    return ovf;
  },

  async sendForApproval(ovfId: string, userId: string, userRole: CrmRole) {
    if (!canPerform(userRole, "send_approval")) throw new AppError(403, "Not allowed to send for approval");
    const ovf = await ovfRepository.findById(ovfId);
    if (!ovf) throw new AppError(404, "OVF not found");
    if (ovf.status !== "DRAFT") throw new AppError(400, "OVF is not in draft");
    await ovfRepository.updateStatus(ovfId, "APPROVAL_PENDING", new Date());
    await approvalRepository.create({ ovfId, opportunityId: ovf.opportunityId });
    await opportunityRepository.updateStage(ovf.opportunityId, "APPROVAL_PENDING");
    await addTimelineEvent({
      opportunityId: ovf.opportunityId,
      action: "ovf_sent_for_approval",
      stageTo: "APPROVAL_PENDING",
      userId,
    });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.ovf.send_approval",
      entityType: "OVF",
      entityId: ovfId,
    });
    return ovfRepository.findById(ovfId);
  },

  async getById(id: string) {
    const ovf = await ovfRepository.findById(id);
    if (!ovf) throw new AppError(404, "OVF not found");
    return ovf;
  },
};
