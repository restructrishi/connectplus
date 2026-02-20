"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteService = void 0;
const opportunity_repository_js_1 = require("../repositories/opportunity.repository.js");
const quote_repository_js_1 = require("../repositories/quote.repository.js");
const timeline_js_1 = require("../timeline.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const constants_js_1 = require("../constants.js");
exports.quoteService = {
    async create(data, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "create_quote"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to create quote");
        const opp = await opportunity_repository_js_1.opportunityRepository.findById(data.opportunityId);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        if (opp.stage !== "OEM_QUOTATION_RECEIVED" && opp.stage !== "QUOTE_CREATED")
            throw new errorHandler_js_1.AppError(400, "Quote can only be created at OEM Quotation or Quote stage");
        const existing = await quote_repository_js_1.quoteRepository.findByOpportunityId(data.opportunityId);
        if (existing)
            throw new errorHandler_js_1.AppError(400, "Quote already exists for this opportunity");
        const quote = await quote_repository_js_1.quoteRepository.create({
            ...data,
            createdBy: userId,
        });
        await opportunity_repository_js_1.opportunityRepository.updateStage(quote.opportunityId, "QUOTE_CREATED");
        await (0, timeline_js_1.addTimelineEvent)({
            opportunityId: data.opportunityId,
            action: "quote_created",
            stageTo: "QUOTE_CREATED",
            userId,
            metadata: { amount: data.amount },
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.quote.create",
            entityType: "Quote",
            entityId: quote.id,
            metadata: { opportunityId: data.opportunityId },
        });
        return quote;
    },
    async getById(id) {
        const quote = await quote_repository_js_1.quoteRepository.findById(id);
        if (!quote)
            throw new errorHandler_js_1.AppError(404, "Quote not found");
        return quote;
    },
    async update(id, data, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "edit_quote"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to edit quote");
        const quote = await quote_repository_js_1.quoteRepository.findById(id);
        if (!quote)
            throw new errorHandler_js_1.AppError(404, "Quote not found");
        if (quote.lockedAt)
            throw new errorHandler_js_1.AppError(400, "Quote is locked (OVF created)");
        const updated = await quote_repository_js_1.quoteRepository.update(id, data);
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.quote.update",
            entityType: "Quote",
            entityId: id,
        });
        return updated;
    },
};
//# sourceMappingURL=quote.service.js.map