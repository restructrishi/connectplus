"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadService = void 0;
const lead_repository_js_1 = require("../repositories/lead.repository.js");
const client_repository_js_1 = require("../repositories/client.repository.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const VALID_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "LOST", "CONVERTED"];
exports.leadService = {
    async create(input, userId) {
        if (input.status && !VALID_STATUSES.includes(input.status)) {
            throw new errorHandler_js_1.AppError(400, "Invalid lead status");
        }
        const lead = await lead_repository_js_1.leadRepository.create({
            name: input.name,
            phone: input.phone,
            email: input.email,
            company: input.company,
            source: input.source,
            status: input.status ?? "NEW",
            assignedTo: input.assignedTo ?? undefined,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "lead.create",
            entityType: "Lead",
            entityId: lead.id,
            metadata: { name: lead.name },
        });
        return lead;
    },
    async getById(id, options) {
        const lead = await lead_repository_js_1.leadRepository.findById(id);
        if (!lead)
            throw new errorHandler_js_1.AppError(404, "Lead not found");
        if (!options.canViewAll && lead.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this lead");
        }
        return lead;
    },
    async list(filters) {
        const assignedTo = filters.canViewAll ? undefined : filters.assignedTo;
        return lead_repository_js_1.leadRepository.findMany({
            assignedTo: assignedTo ?? undefined,
            status: filters.status,
            page: filters.page,
            pageSize: filters.pageSize,
        });
    },
    async update(id, input, userId, options) {
        const existing = await lead_repository_js_1.leadRepository.findById(id);
        if (!existing)
            throw new errorHandler_js_1.AppError(404, "Lead not found");
        if (!options.canViewAll && existing.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this lead");
        }
        if (input.status && !VALID_STATUSES.includes(input.status)) {
            throw new errorHandler_js_1.AppError(400, "Invalid lead status");
        }
        const updated = await lead_repository_js_1.leadRepository.update(id, {
            name: input.name,
            phone: input.phone,
            email: input.email,
            company: input.company,
            source: input.source,
            status: input.status,
            assignedTo: input.assignedTo,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "lead.update",
            entityType: "Lead",
            entityId: id,
            metadata: { status: input.status },
        });
        return updated;
    },
    async convertToClient(leadId, userId, options) {
        const lead = await lead_repository_js_1.leadRepository.findById(leadId);
        if (!lead)
            throw new errorHandler_js_1.AppError(404, "Lead not found");
        if (!options.canViewAll && lead.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this lead");
        }
        if (lead.status !== "QUALIFIED") {
            throw new errorHandler_js_1.AppError(400, "Only QUALIFIED leads can be converted to client");
        }
        const existingClient = await client_repository_js_1.clientRepository.findByConvertedLeadId(leadId);
        if (existingClient)
            throw new errorHandler_js_1.AppError(400, "Lead already converted to client");
        const client = await client_repository_js_1.clientRepository.create({
            companyName: lead.company ?? lead.name,
            contactPerson: lead.name,
            phone: lead.phone ?? undefined,
            email: lead.email,
            industry: undefined,
            assignedTo: lead.assignedTo ?? undefined,
            convertedFromLeadId: leadId,
        });
        await lead_repository_js_1.leadRepository.update(leadId, { status: "CONVERTED" });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "lead.convert_to_client",
            entityType: "Lead",
            entityId: leadId,
            metadata: { clientId: client.id },
        });
        return client;
    },
};
//# sourceMappingURL=lead.service.js.map