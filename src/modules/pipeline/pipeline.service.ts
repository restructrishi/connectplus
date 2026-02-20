import { pipelineRepository } from "./pipeline.repository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const pipelineService = {
  // Companies
  async createCompany(name: string) {
    const trimmed = name?.trim();
    if (!trimmed) throw new AppError(400, "Company name is required");
    return pipelineRepository.createCompany(trimmed);
  },
  async listCompanies() {
    return pipelineRepository.listCompanies();
  },
  async getCompanyById(id: string) {
    const company = await pipelineRepository.getCompanyById(id);
    if (!company) throw new AppError(404, "Company not found");
    return company;
  },

  // Leads
  async createLead(companyId: string) {
    const company = await pipelineRepository.getCompanyById(companyId);
    if (!company) throw new AppError(404, "Company not found");
    return pipelineRepository.createLead(companyId);
  },
  async getActiveLeads() {
    return pipelineRepository.getActiveLeads();
  },
  async getLeadById(id: string) {
    const lead = await pipelineRepository.getLeadById(id);
    if (!lead) throw new AppError(404, "Lead not found");
    return lead;
  },
  async convertLeadToOpportunity(leadId: string) {
    const lead = await pipelineRepository.getLeadById(leadId);
    if (!lead) throw new AppError(404, "Lead not found");
    if (lead.status !== "ACTIVE") throw new AppError(400, "Lead is not active");
    const opportunity = await pipelineRepository.createOpportunity(lead.companyId, leadId);
    await pipelineRepository.convertLeadToOpportunity(leadId, opportunity.id);
    return pipelineRepository.getOpportunityById(opportunity.id);
  },
  async markLeadLost(leadId: string, reason: string) {
    if (!reason?.trim()) throw new AppError(400, "Lost reason is required");
    return pipelineRepository.markLeadLost(leadId, reason.trim());
  },

  // Opportunities
  async listOpportunities() {
    return pipelineRepository.listOpportunities();
  },
  async getOpportunityById(id: string) {
    const opp = await pipelineRepository.getOpportunityById(id);
    if (!opp) throw new AppError(404, "Opportunity not found");
    return opp;
  },
  async updateOpportunityStatus(id: string, status: string) {
    await this.getOpportunityById(id);
    return pipelineRepository.updateOpportunityStatus(id, status);
  },
  async updateOpportunityAttachments(id: string, attachments: object) {
    await this.getOpportunityById(id);
    return pipelineRepository.updateOpportunityAttachments(id, attachments);
  },
  async updateOpportunityTechnical(id: string, technicalDetails: object) {
    await this.getOpportunityById(id);
    return pipelineRepository.updateOpportunityTechnical(id, technicalDetails);
  },
  async addApproval(id: string, approval: { type: string; status: string; requestedAt: string; [k: string]: unknown }) {
    const opp = await pipelineRepository.getOpportunityById(id);
    if (!opp) throw new AppError(404, "Opportunity not found");
    const approvals = Array.isArray(opp.approvals) ? (opp.approvals as object[]) : [];
    const next = [...approvals, { ...approval, requestedAt: approval.requestedAt || new Date().toISOString() }];
    return pipelineRepository.updateOpportunityApprovals(id, next);
  },
  async approveOpportunity(id: string, approvalIndex: number, status: string, approvedBy?: string) {
    const opp = await pipelineRepository.getOpportunityById(id);
    if (!opp) throw new AppError(404, "Opportunity not found");
    const approvals = Array.isArray(opp.approvals) ? (opp.approvals as Record<string, unknown>[]) : [];
    if (approvalIndex < 0 || approvalIndex >= approvals.length) throw new AppError(400, "Invalid approval index");
    const updated = [...approvals];
    updated[approvalIndex] = { ...updated[approvalIndex], status, respondedAt: new Date().toISOString(), approvedBy };
    return pipelineRepository.updateOpportunityApprovals(id, updated);
  },
  async addEmailSent(id: string, email: { type: string; sentAt: string; to: string[]; status: string }) {
    const opp = await pipelineRepository.getOpportunityById(id);
    if (!opp) throw new AppError(404, "Opportunity not found");
    const emails = Array.isArray(opp.emailsSent) ? (opp.emailsSent as object[]) : [];
    const next = [...emails, { ...email, sentAt: email.sentAt || new Date().toISOString() }];
    return pipelineRepository.updateOpportunityEmailsSent(id, next);
  },
  async updateOpportunityOvf(id: string, ovfDetails: object) {
    await this.getOpportunityById(id);
    return pipelineRepository.updateOpportunityOvf(id, ovfDetails);
  },
  async markOpportunityLost(id: string, reason: string) {
    if (!reason?.trim()) throw new AppError(400, "Lost reason is required");
    return pipelineRepository.markOpportunityLost(id, reason.trim());
  },
};
