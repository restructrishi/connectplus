"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadService = void 0;
const lead_repository_js_1 = require("../repositories/lead.repository.js");
const company_repository_js_1 = require("../repositories/company.repository.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const constants_js_1 = require("../constants.js");
exports.leadService = {
    async create(data, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "create_lead"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to create lead");
        const company = await company_repository_js_1.companyRepository.findById(data.companyId);
        if (!company)
            throw new errorHandler_js_1.AppError(404, "Company not found");
        const lead = await lead_repository_js_1.leadRepository.create({
            ...data,
            createdBy: userId,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.lead.create",
            entityType: "SalesLead",
            entityId: lead.id,
            metadata: { name: lead.name, companyId: data.companyId },
        });
        return lead;
    },
    async getById(id) {
        const lead = await lead_repository_js_1.leadRepository.findById(id);
        if (!lead)
            throw new errorHandler_js_1.AppError(404, "Lead not found");
        return lead;
    },
    async list(filters) {
        return lead_repository_js_1.leadRepository.findMany(filters);
    },
    async convertToOpportunity(id, reason, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "convert_lead"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to convert lead");
        const lead = await lead_repository_js_1.leadRepository.findById(id);
        if (!lead)
            throw new errorHandler_js_1.AppError(404, "Lead not found");
        if (lead.status !== "OPEN")
            throw new errorHandler_js_1.AppError(400, "Lead is not open");
        if (!reason?.trim())
            throw new errorHandler_js_1.AppError(400, "Conversion reason is required");
        const updated = await lead_repository_js_1.leadRepository.convert(id, { convertedBy: userId, convertedReason: reason });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.lead.convert",
            entityType: "SalesLead",
            entityId: id,
            metadata: { reason },
        });
        return updated;
    },
    async markDead(id, reason, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "mark_lead_dead"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to mark lead dead");
        const lead = await lead_repository_js_1.leadRepository.findById(id);
        if (!lead)
            throw new errorHandler_js_1.AppError(404, "Lead not found");
        if (lead.status !== "OPEN")
            throw new errorHandler_js_1.AppError(400, "Lead is not open");
        if (!reason?.trim())
            throw new errorHandler_js_1.AppError(400, "Reason is required");
        const updated = await lead_repository_js_1.leadRepository.markDead(id, { deadBy: userId, deadReason: reason });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.lead.mark_dead",
            entityType: "SalesLead",
            entityId: id,
            metadata: { reason },
        });
        return updated;
    },
};
//# sourceMappingURL=lead.service.js.map