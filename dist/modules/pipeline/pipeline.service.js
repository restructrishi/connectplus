"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineService = void 0;
const pipeline_repository_js_1 = require("./pipeline.repository.js");
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
exports.pipelineService = {
    // Companies
    async createCompany(name) {
        const trimmed = name?.trim();
        if (!trimmed)
            throw new errorHandler_js_1.AppError(400, "Company name is required");
        return pipeline_repository_js_1.pipelineRepository.createCompany(trimmed);
    },
    async listCompanies() {
        return pipeline_repository_js_1.pipelineRepository.listCompanies();
    },
    async getCompanyById(id) {
        const company = await pipeline_repository_js_1.pipelineRepository.getCompanyById(id);
        if (!company)
            throw new errorHandler_js_1.AppError(404, "Company not found");
        return company;
    },
    // Leads
    async createLead(companyId) {
        const company = await pipeline_repository_js_1.pipelineRepository.getCompanyById(companyId);
        if (!company)
            throw new errorHandler_js_1.AppError(404, "Company not found");
        return pipeline_repository_js_1.pipelineRepository.createLead(companyId);
    },
    async getActiveLeads() {
        return pipeline_repository_js_1.pipelineRepository.getActiveLeads();
    },
    async getLeadById(id) {
        const lead = await pipeline_repository_js_1.pipelineRepository.getLeadById(id);
        if (!lead)
            throw new errorHandler_js_1.AppError(404, "Lead not found");
        return lead;
    },
    async convertLeadToOpportunity(leadId) {
        const lead = await pipeline_repository_js_1.pipelineRepository.getLeadById(leadId);
        if (!lead)
            throw new errorHandler_js_1.AppError(404, "Lead not found");
        if (lead.status !== "ACTIVE")
            throw new errorHandler_js_1.AppError(400, "Lead is not active");
        const opportunity = await pipeline_repository_js_1.pipelineRepository.createOpportunity(lead.companyId, leadId);
        await pipeline_repository_js_1.pipelineRepository.convertLeadToOpportunity(leadId, opportunity.id);
        return pipeline_repository_js_1.pipelineRepository.getOpportunityById(opportunity.id);
    },
    async markLeadLost(leadId, reason) {
        if (!reason?.trim())
            throw new errorHandler_js_1.AppError(400, "Lost reason is required");
        return pipeline_repository_js_1.pipelineRepository.markLeadLost(leadId, reason.trim());
    },
    // Opportunities
    async listOpportunities() {
        return pipeline_repository_js_1.pipelineRepository.listOpportunities();
    },
    async getOpportunityById(id) {
        const opp = await pipeline_repository_js_1.pipelineRepository.getOpportunityById(id);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        return opp;
    },
    async updateOpportunityStatus(id, status) {
        await this.getOpportunityById(id);
        return pipeline_repository_js_1.pipelineRepository.updateOpportunityStatus(id, status);
    },
    async updateOpportunityAttachments(id, attachments) {
        await this.getOpportunityById(id);
        return pipeline_repository_js_1.pipelineRepository.updateOpportunityAttachments(id, attachments);
    },
    async updateOpportunityTechnical(id, technicalDetails) {
        await this.getOpportunityById(id);
        return pipeline_repository_js_1.pipelineRepository.updateOpportunityTechnical(id, technicalDetails);
    },
    async addApproval(id, approval) {
        const opp = await pipeline_repository_js_1.pipelineRepository.getOpportunityById(id);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        const approvals = Array.isArray(opp.approvals) ? opp.approvals : [];
        const next = [...approvals, { ...approval, requestedAt: approval.requestedAt || new Date().toISOString() }];
        return pipeline_repository_js_1.pipelineRepository.updateOpportunityApprovals(id, next);
    },
    async approveOpportunity(id, approvalIndex, status, approvedBy) {
        const opp = await pipeline_repository_js_1.pipelineRepository.getOpportunityById(id);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        const approvals = Array.isArray(opp.approvals) ? opp.approvals : [];
        if (approvalIndex < 0 || approvalIndex >= approvals.length)
            throw new errorHandler_js_1.AppError(400, "Invalid approval index");
        const updated = [...approvals];
        updated[approvalIndex] = { ...updated[approvalIndex], status, respondedAt: new Date().toISOString(), approvedBy };
        return pipeline_repository_js_1.pipelineRepository.updateOpportunityApprovals(id, updated);
    },
    async addEmailSent(id, email) {
        const opp = await pipeline_repository_js_1.pipelineRepository.getOpportunityById(id);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        const emails = Array.isArray(opp.emailsSent) ? opp.emailsSent : [];
        const next = [...emails, { ...email, sentAt: email.sentAt || new Date().toISOString() }];
        return pipeline_repository_js_1.pipelineRepository.updateOpportunityEmailsSent(id, next);
    },
    async updateOpportunityOvf(id, ovfDetails) {
        await this.getOpportunityById(id);
        return pipeline_repository_js_1.pipelineRepository.updateOpportunityOvf(id, ovfDetails);
    },
    async markOpportunityLost(id, reason) {
        if (!reason?.trim())
            throw new errorHandler_js_1.AppError(400, "Lost reason is required");
        return pipeline_repository_js_1.pipelineRepository.markOpportunityLost(id, reason.trim());
    },
};
//# sourceMappingURL=pipeline.service.js.map