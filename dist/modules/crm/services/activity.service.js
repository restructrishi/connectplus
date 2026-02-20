"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityService = void 0;
const activity_repository_js_1 = require("../repositories/activity.repository.js");
const lead_repository_js_1 = require("../repositories/lead.repository.js");
const client_repository_js_1 = require("../repositories/client.repository.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const VALID_TYPES = ["CALL", "MEETING", "EMAIL", "FOLLOWUP"];
exports.activityService = {
    async create(input, userId, options) {
        if (!input.leadId && !input.clientId) {
            throw new errorHandler_js_1.AppError(400, "Either leadId or clientId is required");
        }
        if (input.leadId) {
            const lead = await lead_repository_js_1.leadRepository.findById(input.leadId);
            if (!lead)
                throw new errorHandler_js_1.AppError(404, "Lead not found");
            if (!options.canViewAll && lead.assignedTo !== options.assignedTo) {
                throw new errorHandler_js_1.AppError(403, "Access denied to this lead");
            }
        }
        if (input.clientId) {
            const client = await client_repository_js_1.clientRepository.findById(input.clientId);
            if (!client)
                throw new errorHandler_js_1.AppError(404, "Client not found");
            if (!options.canViewAll && client.assignedTo !== options.assignedTo) {
                throw new errorHandler_js_1.AppError(403, "Access denied to this client");
            }
        }
        if (!VALID_TYPES.includes(input.type)) {
            throw new errorHandler_js_1.AppError(400, "Invalid activity type");
        }
        const activity = await activity_repository_js_1.activityRepository.create({
            leadId: input.leadId,
            clientId: input.clientId,
            type: input.type,
            notes: input.notes,
            createdBy: userId,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "activity.create",
            entityType: "Activity",
            entityId: activity.id,
        });
        return activity;
    },
    async getById(id, options) {
        const activity = await activity_repository_js_1.activityRepository.findById(id);
        if (!activity)
            throw new errorHandler_js_1.AppError(404, "Activity not found");
        if (activity.leadId && activity.lead) {
            if (!options.canViewAll && activity.lead.assignedTo !== options.assignedTo)
                throw new errorHandler_js_1.AppError(403, "Access denied");
        }
        if (activity.clientId && activity.client) {
            if (!options.canViewAll && activity.client.assignedTo !== options.assignedTo)
                throw new errorHandler_js_1.AppError(403, "Access denied");
        }
        return activity;
    },
    async list(filters) {
        return activity_repository_js_1.activityRepository.findMany({
            leadId: filters.leadId,
            clientId: filters.clientId,
            createdBy: filters.createdBy,
            page: filters.page,
            pageSize: filters.pageSize,
        });
    },
};
//# sourceMappingURL=activity.service.js.map