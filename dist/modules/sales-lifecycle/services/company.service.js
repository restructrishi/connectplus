"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = void 0;
const company_repository_js_1 = require("../repositories/company.repository.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const constants_js_1 = require("../constants.js");
exports.companyService = {
    async create(name, userId, userRole) {
        if (!(0, constants_js_1.canPerform)(userRole, "create_company"))
            throw new errorHandler_js_1.AppError(403, "Not allowed to create company");
        const company = await company_repository_js_1.companyRepository.create({ name, createdBy: userId });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.company.create",
            entityType: "SalesCompany",
            entityId: company.id,
            metadata: { name: company.name },
        });
        return company;
    },
    async getById(id) {
        const company = await company_repository_js_1.companyRepository.findById(id);
        if (!company)
            throw new errorHandler_js_1.AppError(404, "Company not found");
        return company;
    },
    async list(filters) {
        return company_repository_js_1.companyRepository.findMany(filters);
    },
    async updateStatus(id, status, userId) {
        const company = await company_repository_js_1.companyRepository.findById(id);
        if (!company)
            throw new errorHandler_js_1.AppError(404, "Company not found");
        const updated = await company_repository_js_1.companyRepository.updateStatus(id, status);
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.company.update_status",
            entityType: "SalesCompany",
            entityId: id,
            metadata: { status },
        });
        return updated;
    },
    async softDelete(id, userId, userRole) {
        const company = await company_repository_js_1.companyRepository.findById(id);
        if (!company)
            throw new errorHandler_js_1.AppError(404, "Company not found");
        const hasActive = await company_repository_js_1.companyRepository.hasActiveOpportunity(id);
        if (hasActive)
            throw new errorHandler_js_1.AppError(400, "Cannot delete company with active opportunity");
        if (!(0, constants_js_1.canPerform)(userRole, "*") && !(0, constants_js_1.canPerform)(userRole, "create_company"))
            throw new errorHandler_js_1.AppError(403, "Not allowed");
        await company_repository_js_1.companyRepository.softDelete(id);
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.company.delete",
            entityType: "SalesCompany",
            entityId: id,
        });
        return { success: true };
    },
};
//# sourceMappingURL=company.service.js.map