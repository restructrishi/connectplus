"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalService = void 0;
const ovf_repository_js_1 = require("../repositories/ovf.repository.js");
const opportunity_repository_js_1 = require("../repositories/opportunity.repository.js");
const approval_repository_js_1 = require("../repositories/approval.repository.js");
const timeline_js_1 = require("../timeline.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const constants_js_1 = require("../constants.js");
exports.approvalService = {
    async listPending(userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "approve_ovf"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to view approvals");
        return approval_repository_js_1.approvalRepository.findPending();
    },
    async decide(approvalId, data, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "approve_ovf") && !(0, constants_js_1.canPerform)(userRole, "reject_ovf"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to approve/reject");
        const approval = await approval_repository_js_1.approvalRepository.findById(approvalId);
        if (!approval)
            throw new errorHandler_js_1.AppError(404, "Approval not found");
        if (approval.status !== "PENDING")
            throw new errorHandler_js_1.AppError(400, "Approval already decided");
        await approval_repository_js_1.approvalRepository.decide(approvalId, {
            status: data.status,
            decidedBy: userId,
            comments: data.comments,
        });
        const ovf = await ovf_repository_js_1.ovfRepository.findById(approval.ovfId);
        if (ovf) {
            await ovf_repository_js_1.ovfRepository.updateStatus(ovf.id, data.status === "APPROVED" ? "APPROVED" : "REJECTED");
            if (data.status === "APPROVED") {
                await opportunity_repository_js_1.opportunityRepository.updateStage(ovf.opportunityId, "APPROVED");
                await (0, timeline_js_1.addTimelineEvent)({
                    opportunityId: ovf.opportunityId,
                    action: "ovf_approved",
                    stageTo: "APPROVED",
                    userId,
                });
            }
            else {
                await opportunity_repository_js_1.opportunityRepository.updateStage(ovf.opportunityId, "OVF_CREATED");
                await (0, timeline_js_1.addTimelineEvent)({
                    opportunityId: ovf.opportunityId,
                    action: "ovf_rejected",
                    stageFrom: "APPROVAL_PENDING",
                    stageTo: "OVF_CREATED",
                    userId,
                    comment: data.comments,
                });
            }
        }
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: data.status === "APPROVED" ? "sales_lifecycle.approval.approve" : "sales_lifecycle.approval.reject",
            entityType: "Approval",
            entityId: approvalId,
            metadata: { status: data.status },
        });
        return approval_repository_js_1.approvalRepository.findById(approvalId);
    },
};
//# sourceMappingURL=approval.service.js.map