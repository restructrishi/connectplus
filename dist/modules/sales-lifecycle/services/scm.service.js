"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scmService = void 0;
const opportunity_repository_js_1 = require("../repositories/opportunity.repository.js");
const ovf_repository_js_1 = require("../repositories/ovf.repository.js");
const scm_repository_js_1 = require("../repositories/scm.repository.js");
const timeline_js_1 = require("../timeline.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const constants_js_1 = require("../constants.js");
exports.scmService = {
    async handoff(opportunityId, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "scm_handoff"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to hand off to SCM");
        const opp = await opportunity_repository_js_1.opportunityRepository.findById(opportunityId);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        if (opp.stage !== "APPROVED")
            throw new errorHandler_js_1.AppError(400, "Opportunity must be approved first");
        const ovf = await ovf_repository_js_1.ovfRepository.findByOpportunityId(opportunityId);
        if (!ovf || ovf.status !== "APPROVED")
            throw new errorHandler_js_1.AppError(400, "OVF must be approved");
        const existing = await scm_repository_js_1.scmRepository.findByOpportunityId(opportunityId);
        if (existing)
            throw new errorHandler_js_1.AppError(400, "Already handed off to SCM");
        const handoff = await scm_repository_js_1.scmRepository.create({
            opportunityId,
            ovfId: ovf.id,
            handedOffBy: userId,
        });
        await opportunity_repository_js_1.opportunityRepository.updateStage(opportunityId, "SENT_TO_SCM");
        await (0, timeline_js_1.addTimelineEvent)({
            opportunityId,
            action: "scm_handoff",
            stageTo: "SENT_TO_SCM",
            userId,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.scm.handoff",
            entityType: "SCMHandoff",
            entityId: handoff.id,
            metadata: { opportunityId },
        });
        return handoff;
    },
    async list(filters, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "view_scm"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to view SCM");
        return scm_repository_js_1.scmRepository.findMany(filters);
    },
};
//# sourceMappingURL=scm.service.js.map