"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientService = void 0;
const client_repository_js_1 = require("../repositories/client.repository.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
exports.clientService = {
    async create(input, userId) {
        const client = await client_repository_js_1.clientRepository.create(input);
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "client.create",
            entityType: "Client",
            entityId: client.id,
            metadata: { companyName: client.companyName },
        });
        return client;
    },
    async getById(id, options) {
        const client = await client_repository_js_1.clientRepository.findById(id);
        if (!client)
            throw new errorHandler_js_1.AppError(404, "Client not found");
        if (!options.canViewAll && client.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this client");
        }
        return client;
    },
    async list(filters) {
        const assignedTo = filters.canViewAll ? undefined : filters.assignedTo;
        return client_repository_js_1.clientRepository.findMany({
            assignedTo: assignedTo ?? undefined,
            page: filters.page,
            pageSize: filters.pageSize,
        });
    },
    async update(id, input, userId, options) {
        const existing = await client_repository_js_1.clientRepository.findById(id);
        if (!existing)
            throw new errorHandler_js_1.AppError(404, "Client not found");
        if (!options.canViewAll && existing.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this client");
        }
        const updated = await client_repository_js_1.clientRepository.update(id, input);
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "client.update",
            entityType: "Client",
            entityId: id,
        });
        return updated;
    },
};
//# sourceMappingURL=client.service.js.map