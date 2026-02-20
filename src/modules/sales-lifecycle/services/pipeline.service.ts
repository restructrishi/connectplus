import type { OpportunityStage, CrmRole } from "@prisma/client";
import { opportunityRepository } from "../repositories/opportunity.repository.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { canPerform, OPPORTUNITY_STAGE_ORDER } from "../constants.js";

/** Jenkins-style stage status for UI */
export type PipelineNodeStatus = "PENDING" | "ACTIVE" | "APPROVED" | "REJECTED" | "LOCKED";

export interface PipelineStageView {
  stageName: OpportunityStage;
  orderIndex: number;
  status: PipelineNodeStatus;
  isLocked: boolean;
  canExecute: boolean;
  approvedBy?: string;
  approvedAt?: string;
  /** Duration in this stage (seconds) - from timeline if available */
  durationSeconds?: number;
  /** SLA: for APPROVAL_PENDING, hours since sent */
  slaHoursPending?: number;
}

/** Display label for stage */
export const STAGE_LABELS: Record<OpportunityStage, string> = {
  OPEN: "Open",
  BOQ_SUBMITTED: "BOQ",
  SOW_ATTACHED: "SOW",
  OEM_QUOTATION_RECEIVED: "OEM",
  QUOTE_CREATED: "Quote",
  OVF_CREATED: "OVF",
  APPROVAL_PENDING: "Approval",
  APPROVED: "Approved",
  SENT_TO_SCM: "SCM",
  LOST_DEAL: "Lost",
};

const VISUAL_ORDER: OpportunityStage[] = [
  "OPEN",
  "BOQ_SUBMITTED",
  "SOW_ATTACHED",
  "OEM_QUOTATION_RECEIVED",
  "QUOTE_CREATED",
  "OVF_CREATED",
  "APPROVAL_PENDING",
  "APPROVED",
  "SENT_TO_SCM",
  "LOST_DEAL",
];

function canExecuteStage(role: CrmRole, stage: OpportunityStage): boolean {
  switch (stage) {
    case "OPEN":
      return canPerform(role, "create_opportunity");
    case "BOQ_SUBMITTED":
    case "SOW_ATTACHED":
      return canPerform(role, "upload_boq") || canPerform(role, "upload_sow");
    case "OEM_QUOTATION_RECEIVED":
      return canPerform(role, "upload_oem_quote") || canPerform(role, "set_oem_received");
    case "QUOTE_CREATED":
      return canPerform(role, "create_quote") || canPerform(role, "edit_quote");
    case "OVF_CREATED":
      return canPerform(role, "create_ovf") || canPerform(role, "send_approval");
    case "APPROVAL_PENDING":
      return canPerform(role, "approve_ovf") || canPerform(role, "reject_ovf");
    case "APPROVED":
    case "SENT_TO_SCM":
      return canPerform(role, "scm_handoff") || canPerform(role, "view_scm");
    case "LOST_DEAL":
      return canPerform(role, "mark_lost");
    default:
      return false;
  }
}

export interface PipelineViewResult {
  opportunityId: string;
  opportunityName: string;
  companyName: string;
  currentStage: OpportunityStage;
  isLocked: boolean;
  estimatedValue: number;
  marginPercent: number | null;
  marginIndicator: "green" | "yellow" | "red" | "none";
  riskScore: number; // 0-100, higher = riskier
  stages: PipelineStageView[];
  approvalSlaHours?: number;
  timeline: { action: string; userId: string; createdAt: string; comment?: string; stageTo?: string }[];
}

export const pipelineService = {
  async getPipelineView(opportunityId: string, userRole: CrmRole): Promise<PipelineViewResult> {
    const opp = await opportunityRepository.findById(opportunityId);
    if (!opp) throw new AppError(404, "Opportunity not found");

    const currentStage = opp.stage;
    const isLost = currentStage === "LOST_DEAL";
    const timeline = (opp.timeline ?? []).map((t) => ({
      action: t.action,
      userId: t.userId,
      createdAt: t.createdAt.toISOString(),
      comment: t.comment ?? undefined,
      stageTo: t.stageTo ?? undefined,
    }));

    // Build stage durations from timeline (stage_transition events)
    const stageEnteredAt: Record<string, Date> = {};
    const sortedTimeline = [...(opp.timeline ?? [])].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    for (const e of sortedTimeline) {
      if (e.stageTo) stageEnteredAt[e.stageTo] = e.createdAt;
    }
    const now = new Date();
    const lostAt = opp.lostAt;
    function durationFor(stage: OpportunityStage): number | undefined {
      const entered = stageEnteredAt[stage];
      if (!entered) return undefined;
      const end = isLost && currentStage === stage ? lostAt ?? now : now;
      return Math.floor((new Date(end).getTime() - new Date(entered).getTime()) / 1000);
    }

    // Approval SLA: when did we send for approval
    let approvalSlaHours: number | undefined;
    const latestApproval = (opp.ovf?.approvals ?? []).filter((a) => a.status === "PENDING")[0];
    if (latestApproval) {
      approvalSlaHours = (now.getTime() - new Date(latestApproval.requestedAt).getTime()) / (1000 * 60 * 60);
    }
    const decidedApproval = (opp.ovf?.approvals ?? []).filter((a) => a.status === "APPROVED" || a.status === "REJECTED").sort(
      (a, b) => new Date(b.decidedAt ?? 0).getTime() - new Date(a.decidedAt ?? 0).getTime()
    )[0];

    const stages: PipelineStageView[] = VISUAL_ORDER.filter((s) => s !== "LOST_DEAL").map((stageName, orderIndex) => {
      const stageOrder = OPPORTUNITY_STAGE_ORDER.indexOf(stageName);
      const currentOrder = OPPORTUNITY_STAGE_ORDER.indexOf(currentStage);
      let status: PipelineNodeStatus = "PENDING";
      let isLocked = opp.isLocked;
      let approvedBy: string | undefined;
      let approvedAt: string | undefined;
      let slaHoursPending: number | undefined;

      if (isLost) {
        status = stageName === opp.lostStage ? "REJECTED" : "LOCKED";
        isLocked = true;
      } else {
        if (stageOrder < currentOrder) {
          status = "APPROVED";
          if (stageName === "APPROVAL_PENDING" && decidedApproval?.status === "APPROVED") {
            approvedBy = decidedApproval.decidedBy ?? undefined;
            approvedAt = decidedApproval.decidedAt?.toISOString();
          }
        } else if (stageOrder === currentOrder) {
          status = "ACTIVE";
          if (stageName === "APPROVAL_PENDING" && latestApproval) {
            slaHoursPending = approvalSlaHours;
          }
          if (stageName === "APPROVAL_PENDING" && decidedApproval?.status === "REJECTED") {
            status = "REJECTED";
            approvedBy = decidedApproval.decidedBy ?? undefined;
            approvedAt = decidedApproval.decidedAt?.toISOString();
          }
        } else {
          status = "PENDING";
        }
      }

      const canExecute =
        !isLocked &&
        status === "ACTIVE" &&
        (userRole === "SUPER_ADMIN" || canExecuteStage(userRole as CrmRole, stageName));

      return {
        stageName,
        orderIndex,
        status,
        isLocked,
        canExecute,
        approvedBy,
        approvedAt,
        durationSeconds: durationFor(stageName),
        slaHoursPending,
      };
    });

    // Margin indicator from quote or OVF
    let marginPercent: number | null = null;
    if (opp.quote?.marginPercent != null) marginPercent = Number(opp.quote.marginPercent);
    if (opp.ovf?.marginPercent != null) marginPercent = Number(opp.ovf.marginPercent);
    let marginIndicator: "green" | "yellow" | "red" | "none" = "none";
    if (marginPercent != null) {
      if (marginPercent >= 20) marginIndicator = "green";
      else if (marginPercent >= 10) marginIndicator = "yellow";
      else marginIndicator = "red";
    }

    // Risk score: inverse of probability, or late approval, or low margin
    let riskScore = 100 - (opp.probability ?? 50);
    if (marginPercent != null && marginPercent < 10) riskScore = Math.min(100, riskScore + 20);
    if (approvalSlaHours != null && approvalSlaHours > 24) riskScore = Math.min(100, riskScore + 15);
    riskScore = Math.max(0, Math.min(100, riskScore));

    return {
      opportunityId: opp.id,
      opportunityName: opp.name,
      companyName: opp.company?.name ?? "",
      currentStage,
      isLocked: opp.isLocked,
      estimatedValue: Number(opp.estimatedValue ?? 0),
      marginPercent,
      marginIndicator,
      riskScore,
      stages,
      approvalSlaHours,
      timeline,
    };
  },
};
