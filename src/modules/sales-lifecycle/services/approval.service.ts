import { ovfRepository } from "../repositories/ovf.repository.js";
import { opportunityRepository } from "../repositories/opportunity.repository.js";
import { approvalRepository } from "../repositories/approval.repository.js";
import { addTimelineEvent } from "../timeline.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { canPerform } from "../constants.js";
import type { CrmRole } from "@prisma/client";
import type { ApprovalStatus } from "@prisma/client";

export const approvalService = {
  async listPending(userRole: CrmRole) {
    if (!canPerform(userRole, "approve_ovf")) throw new AppError(403, "Not allowed to view approvals");
    return approvalRepository.findPending();
  },

  async decide(approvalId: string, data: { status: ApprovalStatus; comments?: string }, userId: string, userRole: CrmRole) {
    if (!canPerform(userRole, "approve_ovf") && !canPerform(userRole, "reject_ovf"))
      throw new AppError(403, "Not allowed to approve/reject");
    const approval = await approvalRepository.findById(approvalId);
    if (!approval) throw new AppError(404, "Approval not found");
    if (approval.status !== "PENDING") throw new AppError(400, "Approval already decided");
    await approvalRepository.decide(approvalId, {
      status: data.status,
      decidedBy: userId,
      comments: data.comments,
    });
    const ovf = await ovfRepository.findById(approval.ovfId);
    if (ovf) {
      await ovfRepository.updateStatus(ovf.id, data.status === "APPROVED" ? "APPROVED" : "REJECTED");
      if (data.status === "APPROVED") {
        await opportunityRepository.updateStage(ovf.opportunityId, "APPROVED");
        await addTimelineEvent({
          opportunityId: ovf.opportunityId,
          action: "ovf_approved",
          stageTo: "APPROVED",
          userId,
        });
      } else {
        await opportunityRepository.updateStage(ovf.opportunityId, "OVF_CREATED");
        await addTimelineEvent({
          opportunityId: ovf.opportunityId,
          action: "ovf_rejected",
          stageFrom: "APPROVAL_PENDING",
          stageTo: "OVF_CREATED",
          userId,
          comment: data.comments,
        });
      }
    }
    await createAuditLog({
      userId,
      action: data.status === "APPROVED" ? "sales_lifecycle.approval.approve" : "sales_lifecycle.approval.reject",
      entityType: "Approval",
      entityId: approvalId,
      metadata: { status: data.status },
    });
    return approvalRepository.findById(approvalId);
  },
};
