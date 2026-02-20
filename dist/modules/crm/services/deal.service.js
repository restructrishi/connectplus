"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealService = void 0;
const deal_repository_js_1 = require("../repositories/deal.repository.js");
const client_repository_js_1 = require("../repositories/client.repository.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const VALID_STAGES = ["PROPOSAL", "NEGOTIATION", "WON", "LOST"];
exports.dealService = {
    async create(input, userId, options) {
        const client = await client_repository_js_1.clientRepository.findById(input.clientId);
        if (!client)
            throw new errorHandler_js_1.AppError(404, "Client not found");
        if (!options.canViewAll && client.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this client");
        }
        if (input.stage && !VALID_STAGES.includes(input.stage)) {
            throw new errorHandler_js_1.AppError(400, "Invalid deal stage");
        }
        const deal = await deal_repository_js_1.dealRepository.create({
            clientId: input.clientId,
            value: input.value,
            stage: input.stage ?? "PROPOSAL",
            expectedClosureDate: input.expectedClosureDate,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "deal.create",
            entityType: "Deal",
            entityId: deal.id,
            metadata: { clientId: input.clientId, value: input.value },
        });
        return deal;
    },
    async getById(id, options) {
        const deal = await deal_repository_js_1.dealRepository.findById(id);
        if (!deal)
            throw new errorHandler_js_1.AppError(404, "Deal not found");
        if (!options.canViewAll && deal.client.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this deal");
        }
        return deal;
    },
    async listByClient(clientId, options) {
        const client = await client_repository_js_1.clientRepository.findById(clientId);
        if (!client)
            throw new errorHandler_js_1.AppError(404, "Client not found");
        if (!options.canViewAll && client.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this client");
        }
        return deal_repository_js_1.dealRepository.findManyByClientId(clientId);
    },
    async list(filters) {
        return deal_repository_js_1.dealRepository.findMany({
            clientId: filters.clientId,
            stage: filters.stage,
            page: filters.page,
            pageSize: filters.pageSize,
        });
    },
    async update(id, input, userId, options) {
        const existing = await deal_repository_js_1.dealRepository.findById(id);
        if (!existing)
            throw new errorHandler_js_1.AppError(404, "Deal not found");
        if (!options.canViewAll && existing.client.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this deal");
        }
        if (input.stage && !VALID_STAGES.includes(input.stage)) {
            throw new errorHandler_js_1.AppError(400, "Invalid deal stage");
        }
        const updated = await deal_repository_js_1.dealRepository.update(id, {
            value: input.value,
            stage: input.stage,
            expectedClosureDate: input.expectedClosureDate,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "deal.update",
            entityType: "Deal",
            entityId: id,
            metadata: { stage: input.stage },
        });
        return updated;
    },
};
//# sourceMappingURL=deal.service.js.map