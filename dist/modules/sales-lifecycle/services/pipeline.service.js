"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineService = exports.STAGE_LABELS = void 0;
const opportunity_repository_js_1 = require("../repositories/opportunity.repository.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const constants_js_1 = require("../constants.js");
/** Display label for stage */
exports.STAGE_LABELS = {
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
const VISUAL_ORDER = [
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
function canExecuteStage(role, stage) {
    switch (stage) {
        case "OPEN":
            return (0, constants_js_1.canPerform)(role, "create_opportunity");
        case "BOQ_SUBMITTED":
        case "SOW_ATTACHED":
            return (0, constants_js_1.canPerform)(role, "upload_boq") || (0, constants_js_1.canPerform)(role, "upload_sow");
        case "OEM_QUOTATION_RECEIVED":
            return (0, constants_js_1.canPerform)(role, "upload_oem_quote") || (0, constants_js_1.canPerform)(role, "set_oem_received");
        case "QUOTE_CREATED":
            return (0, constants_js_1.canPerform)(role, "create_quote") || (0, constants_js_1.canPerform)(role, "edit_quote");
        case "OVF_CREATED":
            return (0, constants_js_1.canPerform)(role, "create_ovf") || (0, constants_js_1.canPerform)(role, "send_approval");
        case "APPROVAL_PENDING":
            return (0, constants_js_1.canPerform)(role, "approve_ovf") || (0, constants_js_1.canPerform)(role, "reject_ovf");
        case "APPROVED":
        case "SENT_TO_SCM":
            return (0, constants_js_1.canPerform)(role, "scm_handoff") || (0, constants_js_1.canPerform)(role, "view_scm");
        case "LOST_DEAL":
            return (0, constants_js_1.canPerform)(role, "mark_lost");
        default:
            return false;
    }
}
exports.pipelineService = {
    async getPipelineView(opportunityId, userRole) {
        const opp = await opportunity_repository_js_1.opportunityRepository.findById(opportunityId);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
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
        const stageEnteredAt = {};
        const sortedTimeline = [...(opp.timeline ?? [])].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        for (const e of sortedTimeline) {
            if (e.stageTo)
                stageEnteredAt[e.stageTo] = e.createdAt;
        }
        const now = new Date();
        const lostAt = opp.lostAt;
        function durationFor(stage) {
            const entered = stageEnteredAt[stage];
            if (!entered)
                return undefined;
            const end = isLost && currentStage === stage ? lostAt ?? now : now;
            return Math.floor((new Date(end).getTime() - new Date(entered).getTime()) / 1000);
        }
        // Approval SLA: when did we send for approval
        let approvalSlaHours;
        const latestApproval = (opp.ovf?.approvals ?? []).filter((a) => a.status === "PENDING")[0];
        if (latestApproval) {
            approvalSlaHours = (now.getTime() - new Date(latestApproval.requestedAt).getTime()) / (1000 * 60 * 60);
        }
        const decidedApproval = (opp.ovf?.approvals ?? []).filter((a) => a.status === "APPROVED" || a.status === "REJECTED").sort((a, b) => new Date(b.decidedAt ?? 0).getTime() - new Date(a.decidedAt ?? 0).getTime())[0];
        const stages = VISUAL_ORDER.filter((s) => s !== "LOST_DEAL").map((stageName, orderIndex) => {
            const stageOrder = constants_js_1.OPPORTUNITY_STAGE_ORDER.indexOf(stageName);
            const currentOrder = constants_js_1.OPPORTUNITY_STAGE_ORDER.indexOf(currentStage);
            let status = "PENDING";
            let isLocked = opp.isLocked;
            let approvedBy;
            let approvedAt;
            let slaHoursPending;
            if (isLost) {
                status = stageName === opp.lostStage ? "REJECTED" : "LOCKED";
                isLocked = true;
            }
            else {
                if (stageOrder < currentOrder) {
                    status = "APPROVED";
                    if (stageName === "APPROVAL_PENDING" && decidedApproval?.status === "APPROVED") {
                        approvedBy = decidedApproval.decidedBy ?? undefined;
                        approvedAt = decidedApproval.decidedAt?.toISOString();
                    }
                }
                else if (stageOrder === currentOrder) {
                    status = "ACTIVE";
                    if (stageName === "APPROVAL_PENDING" && latestApproval) {
                        slaHoursPending = approvalSlaHours;
                    }
                    if (stageName === "APPROVAL_PENDING" && decidedApproval?.status === "REJECTED") {
                        status = "REJECTED";
                        approvedBy = decidedApproval.decidedBy ?? undefined;
                        approvedAt = decidedApproval.decidedAt?.toISOString();
                    }
                }
                else {
                    status = "PENDING";
                }
            }
            const canExecute = !isLocked &&
                status === "ACTIVE" &&
                (userRole === "SUPER_ADMIN" || canExecuteStage(userRole, stageName));
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
        let marginPercent = null;
        if (opp.quote?.marginPercent != null)
            marginPercent = Number(opp.quote.marginPercent);
        if (opp.ovf?.marginPercent != null)
            marginPercent = Number(opp.ovf.marginPercent);
        let marginIndicator = "none";
        if (marginPercent != null) {
            if (marginPercent >= 20)
                marginIndicator = "green";
            else if (marginPercent >= 10)
                marginIndicator = "yellow";
            else
                marginIndicator = "red";
        }
        // Risk score: inverse of probability, or late approval, or low margin
        let riskScore = 100 - (opp.probability ?? 50);
        if (marginPercent != null && marginPercent < 10)
            riskScore = Math.min(100, riskScore + 20);
        if (approvalSlaHours != null && approvalSlaHours > 24)
            riskScore = Math.min(100, riskScore + 15);
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
//# sourceMappingURL=pipeline.service.js.map