"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityService = void 0;
const opportunity_repository_js_1 = require("../repositories/opportunity.repository.js");
const timeline_js_1 = require("../timeline.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const constants_js_1 = require("../constants.js");
exports.opportunityService = {
    async create(data, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "create_opportunity"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to create opportunity");
        const opp = await opportunity_repository_js_1.opportunityRepository.create(data);
        await (0, timeline_js_1.addTimelineEvent)({
            opportunityId: opp.id,
            action: "opportunity_created",
            stageTo: "OPEN",
            userId,
            metadata: { name: opp.name },
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.opportunity.create",
            entityType: "Opportunity",
            entityId: opp.id,
            metadata: { name: opp.name },
        });
        return opp;
    },
    async getById(id) {
        const opp = await opportunity_repository_js_1.opportunityRepository.findById(id);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        return opp;
    },
    async list(filters) {
        return opportunity_repository_js_1.opportunityRepository.findMany(filters);
    },
    async transitionStage(id, toStage, userId, userRole, options) {
        const opp = await opportunity_repository_js_1.opportunityRepository.findById(id);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        if (opp.isLocked)
            throw new errorHandler_js_1.AppError(400, "Opportunity is locked");
        if (toStage === "LOST_DEAL") {
            if (!(0, constants_js_1.canPerform)(userRole, "mark_lost"))
                throw new errorHandler_js_1.AppError(403, "Not allowed to mark lost");
            if (!options?.lostReason?.trim())
                throw new errorHandler_js_1.AppError(400, "Lost reason is required");
        }
        const fromStage = opp.stage;
        if (!(0, constants_js_1.canTransitionFromTo)(fromStage, toStage))
            throw new errorHandler_js_1.AppError(400, `Transition from ${fromStage} to ${toStage} not allowed`);
        const updated = await opportunity_repository_js_1.opportunityRepository.updateStage(id, toStage, {
            lostBy: toStage === "LOST_DEAL" ? userId : undefined,
            lostReason: options?.lostReason,
            lostStage: toStage === "LOST_DEAL" ? fromStage : undefined,
        });
        await (0, timeline_js_1.addTimelineEvent)({
            opportunityId: id,
            action: "stage_transition",
            stageFrom: fromStage,
            stageTo: toStage,
            userId,
            comment: options?.reason ?? options?.lostReason,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.opportunity.stage",
            entityType: "Opportunity",
            entityId: id,
            metadata: { from: fromStage, to: toStage },
        });
        return updated;
    },
    async updateOemFields(id, data, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "set_oem_received"))
            throw new errorHandler_js_1.AppError(403, "Not allowed");
        const opp = await opportunity_repository_js_1.opportunityRepository.findById(id);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        if (opp.isLocked)
            throw new errorHandler_js_1.AppError(400, "Opportunity is locked");
        if (data.drNumberNa === false && data.drNumber === undefined && opp.drNumber == null)
            throw new errorHandler_js_1.AppError(400, "DR Number is required or mark as NA");
        const updated = await opportunity_repository_js_1.opportunityRepository.updateOemFields(id, data);
        await (0, timeline_js_1.addTimelineEvent)({
            opportunityId: id,
            action: "oem_fields_updated",
            userId,
            metadata: data,
        });
        return updated;
    },
    async getTimeline(opportunityId) {
        const opp = await opportunity_repository_js_1.opportunityRepository.findById(opportunityId);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        return opp.timeline;
    },
};
//# sourceMappingURL=opportunity.service.js.map