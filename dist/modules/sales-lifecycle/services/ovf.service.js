"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ovfService = void 0;
const opportunity_repository_js_1 = require("../repositories/opportunity.repository.js");
const quote_repository_js_1 = require("../repositories/quote.repository.js");
const ovf_repository_js_1 = require("../repositories/ovf.repository.js");
const approval_repository_js_1 = require("../repositories/approval.repository.js");
const timeline_js_1 = require("../timeline.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const constants_js_1 = require("../constants.js");
exports.ovfService = {
    async create(data, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "create_ovf"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to create OVF");
        const opp = await opportunity_repository_js_1.opportunityRepository.findById(data.opportunityId);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        if (opp.stage !== "QUOTE_CREATED")
            throw new errorHandler_js_1.AppError(400, "Opportunity must be at Quote Created stage");
        const quote = await quote_repository_js_1.quoteRepository.findById(data.quoteId);
        if (!quote || quote.opportunityId !== data.opportunityId)
            throw new errorHandler_js_1.AppError(404, "Quote not found");
        const ovf = await ovf_repository_js_1.ovfRepository.create({ ...data, createdBy: userId });
        await quote_repository_js_1.quoteRepository.lock(data.quoteId);
        await opportunity_repository_js_1.opportunityRepository.updateStage(data.opportunityId, "OVF_CREATED");
        await (0, timeline_js_1.addTimelineEvent)({
            opportunityId: data.opportunityId,
            action: "ovf_created",
            stageTo: "OVF_CREATED",
            userId,
            metadata: { dealName: data.dealName },
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.ovf.create",
            entityType: "OVF",
            entityId: ovf.id,
            metadata: { opportunityId: data.opportunityId },
        });
        return ovf;
    },
    async sendForApproval(ovfId, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "send_approval"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to send for approval");
        const ovf = await ovf_repository_js_1.ovfRepository.findById(ovfId);
        if (!ovf)
            throw new errorHandler_js_1.AppError(404, "OVF not found");
        if (ovf.status !== "DRAFT")
            throw new errorHandler_js_1.AppError(400, "OVF is not in draft");
        await ovf_repository_js_1.ovfRepository.updateStatus(ovfId, "APPROVAL_PENDING", new Date());
        await approval_repository_js_1.approvalRepository.create({ ovfId, opportunityId: ovf.opportunityId });
        await opportunity_repository_js_1.opportunityRepository.updateStage(ovf.opportunityId, "APPROVAL_PENDING");
        await (0, timeline_js_1.addTimelineEvent)({
            opportunityId: ovf.opportunityId,
            action: "ovf_sent_for_approval",
            stageTo: "APPROVAL_PENDING",
            userId,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.ovf.send_approval",
            entityType: "OVF",
            entityId: ovfId,
        });
        return ovf_repository_js_1.ovfRepository.findById(ovfId);
    },
    async getById(id) {
        const ovf = await ovf_repository_js_1.ovfRepository.findById(id);
        if (!ovf)
            throw new errorHandler_js_1.AppError(404, "OVF not found");
        return ovf;
    },
};
//# sourceMappingURL=ovf.service.js.map