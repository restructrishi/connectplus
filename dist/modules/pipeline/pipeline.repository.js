"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineRepository = void 0;
const prisma_js_1 = require("../../lib/prisma.js");
exports.pipelineRepository = {
    // Companies
    async createCompany(name) {
        return prisma_js_1.prisma.pipelineCompany.create({ data: { name } });
    },
    async listCompanies() {
        return prisma_js_1.prisma.pipelineCompany.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { leads: true, opportunities: true } },
                leads: { where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" } },
            },
        });
    },
    async getCompanyById(id) {
        return prisma_js_1.prisma.pipelineCompany.findUnique({
            where: { id },
            include: { leads: true, opportunities: true },
        });
    },
    // Leads
    async createLead(companyId) {
        return prisma_js_1.prisma.pipelineLead.create({
            data: { companyId, status: "ACTIVE" },
        });
    },
    async getLeadById(id) {
        return prisma_js_1.prisma.pipelineLead.findUnique({
            where: { id },
            include: { company: true, opportunity: true },
        });
    },
    async getActiveLeads() {
        return prisma_js_1.prisma.pipelineLead.findMany({
            where: { status: "ACTIVE" },
            include: { company: true },
            orderBy: { createdAt: "desc" },
        });
    },
    async convertLeadToOpportunity(leadId, opportunityId) {
        const now = new Date();
        await prisma_js_1.prisma.pipelineLead.update({
            where: { id: leadId },
            data: { status: "CONVERTED", convertedAt: now, convertedToId: opportunityId },
        });
        await prisma_js_1.prisma.pipelineOpportunity.update({
            where: { id: opportunityId },
            data: { leadId },
        });
    },
    async markLeadLost(leadId, reason) {
        return prisma_js_1.prisma.pipelineLead.update({
            where: { id: leadId },
            data: { status: "LOST", lostReason: reason },
        });
    },
    // Opportunities
    async createOpportunity(companyId, leadId) {
        return prisma_js_1.prisma.pipelineOpportunity.create({
            data: { companyId, leadId, status: "LEAD_CONVERTED" },
        });
    },
    async listOpportunities() {
        return prisma_js_1.prisma.pipelineOpportunity.findMany({
            where: { lostDeal: false },
            include: { company: true, lead: true },
            orderBy: { updatedAt: "desc" },
        });
    },
    async getOpportunityById(id) {
        return prisma_js_1.prisma.pipelineOpportunity.findUnique({
            where: { id },
            include: { company: true, lead: true },
        });
    },
    async updateOpportunityStatus(id, status) {
        return prisma_js_1.prisma.pipelineOpportunity.update({
            where: { id },
            data: { status, updatedAt: new Date() },
        });
    },
    async updateOpportunityAttachments(id, attachments) {
        return prisma_js_1.prisma.pipelineOpportunity.update({
            where: { id },
            data: { attachments: attachments, updatedAt: new Date() },
        });
    },
    async updateOpportunityTechnical(id, technicalDetails) {
        return prisma_js_1.prisma.pipelineOpportunity.update({
            where: { id },
            data: { technicalDetails: technicalDetails, updatedAt: new Date() },
        });
    },
    async updateOpportunityApprovals(id, approvals) {
        return prisma_js_1.prisma.pipelineOpportunity.update({
            where: { id },
            data: { approvals: approvals, updatedAt: new Date() },
        });
    },
    async updateOpportunityEmailsSent(id, emailsSent) {
        return prisma_js_1.prisma.pipelineOpportunity.update({
            where: { id },
            data: { emailsSent: emailsSent, updatedAt: new Date() },
        });
    },
    async updateOpportunityOvf(id, ovfDetails) {
        return prisma_js_1.prisma.pipelineOpportunity.update({
            where: { id },
            data: { ovfDetails: ovfDetails, updatedAt: new Date() },
        });
    },
    async markOpportunityLost(id, reason) {
        return prisma_js_1.prisma.pipelineOpportunity.update({
            where: { id },
            data: { lostDeal: true, lostReason: reason, updatedAt: new Date() },
        });
    },
};
//# sourceMappingURL=pipeline.repository.js.map