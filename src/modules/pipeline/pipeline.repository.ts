import { prisma } from "../../lib/prisma.js";

export const pipelineRepository = {
  // Companies
  async createCompany(name: string) {
    return prisma.pipelineCompany.create({ data: { name } });
  },
  async listCompanies() {
    return prisma.pipelineCompany.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { leads: true, opportunities: true } },
        leads: { where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" } },
      },
    });
  },
  async getCompanyById(id: string) {
    return prisma.pipelineCompany.findUnique({
      where: { id },
      include: { leads: true, opportunities: true },
    });
  },

  // Leads
  async createLead(companyId: string) {
    return prisma.pipelineLead.create({
      data: { companyId, status: "ACTIVE" },
    });
  },
  async getLeadById(id: string) {
    return prisma.pipelineLead.findUnique({
      where: { id },
      include: { company: true, opportunity: true },
    });
  },
  async getActiveLeads() {
    return prisma.pipelineLead.findMany({
      where: { status: "ACTIVE" },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
  },
  async convertLeadToOpportunity(leadId: string, opportunityId: string) {
    const now = new Date();
    await prisma.pipelineLead.update({
      where: { id: leadId },
      data: { status: "CONVERTED", convertedAt: now, convertedToId: opportunityId },
    });
    await prisma.pipelineOpportunity.update({
      where: { id: opportunityId },
      data: { leadId },
    });
  },
  async markLeadLost(leadId: string, reason: string) {
    return prisma.pipelineLead.update({
      where: { id: leadId },
      data: { status: "LOST", lostReason: reason },
    });
  },

  // Opportunities
  async createOpportunity(companyId: string, leadId?: string) {
    return prisma.pipelineOpportunity.create({
      data: { companyId, leadId, status: "LEAD_CONVERTED" },
    });
  },
  async listOpportunities() {
    return prisma.pipelineOpportunity.findMany({
      where: { lostDeal: false },
      include: { company: true, lead: true },
      orderBy: { updatedAt: "desc" },
    });
  },
  async getOpportunityById(id: string) {
    return prisma.pipelineOpportunity.findUnique({
      where: { id },
      include: { company: true, lead: true },
    });
  },
  async updateOpportunityStatus(id: string, status: string) {
    return prisma.pipelineOpportunity.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  },
  async updateOpportunityAttachments(id: string, attachments: object) {
    return prisma.pipelineOpportunity.update({
      where: { id },
      data: { attachments: attachments as never, updatedAt: new Date() },
    });
  },
  async updateOpportunityTechnical(id: string, technicalDetails: object) {
    return prisma.pipelineOpportunity.update({
      where: { id },
      data: { technicalDetails: technicalDetails as never, updatedAt: new Date() },
    });
  },
  async updateOpportunityApprovals(id: string, approvals: unknown[]) {
    return prisma.pipelineOpportunity.update({
      where: { id },
      data: { approvals: approvals as never, updatedAt: new Date() },
    });
  },
  async updateOpportunityEmailsSent(id: string, emailsSent: unknown[]) {
    return prisma.pipelineOpportunity.update({
      where: { id },
      data: { emailsSent: emailsSent as never, updatedAt: new Date() },
    });
  },
  async updateOpportunityOvf(id: string, ovfDetails: object) {
    return prisma.pipelineOpportunity.update({
      where: { id },
      data: { ovfDetails: ovfDetails as never, updatedAt: new Date() },
    });
  },
  async markOpportunityLost(id: string, reason: string) {
    return prisma.pipelineOpportunity.update({
      where: { id },
      data: { lostDeal: true, lostReason: reason, updatedAt: new Date() },
    });
  },
};
