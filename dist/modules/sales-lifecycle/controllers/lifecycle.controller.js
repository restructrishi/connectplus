"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = createCompany;
exports.getCompany = getCompany;
exports.listCompanies = listCompanies;
exports.createLead = createLead;
exports.getLead = getLead;
exports.listLeads = listLeads;
exports.convertLead = convertLead;
exports.markLeadDead = markLeadDead;
exports.createOpportunity = createOpportunity;
exports.getOpportunity = getOpportunity;
exports.listOpportunities = listOpportunities;
exports.transitionStage = transitionStage;
exports.updateOemFields = updateOemFields;
exports.getOpportunityTimeline = getOpportunityTimeline;
exports.getOpportunityPipeline = getOpportunityPipeline;
exports.createQuote = createQuote;
exports.getQuote = getQuote;
exports.updateQuote = updateQuote;
exports.createOvf = createOvf;
exports.sendOvfForApproval = sendOvfForApproval;
exports.listPendingApprovals = listPendingApprovals;
exports.approvalDecide = approvalDecide;
exports.scmHandoff = scmHandoff;
exports.listScmHandoffs = listScmHandoffs;
exports.getLifecycleDashboardData = getLifecycleDashboardData;
const company_service_js_1 = require("../services/company.service.js");
const lead_service_js_1 = require("../services/lead.service.js");
const opportunity_service_js_1 = require("../services/opportunity.service.js");
const quote_service_js_1 = require("../services/quote.service.js");
const ovf_service_js_1 = require("../services/ovf.service.js");
const approval_service_js_1 = require("../services/approval.service.js");
const scm_service_js_1 = require("../services/scm.service.js");
const lifecycle_dashboard_service_js_1 = require("../services/lifecycle-dashboard.service.js");
const pipeline_service_js_1 = require("../services/pipeline.service.js");
function user(req) {
    const u = req.user;
    return { userId: u.employeeId, userRole: u.role };
}
async function createCompany(req, res, next) {
    try {
        const { name } = req.body;
        const data = await company_service_js_1.companyService.create(name, user(req).userId, user(req).userRole);
        res.status(201).json({ success: true, data, message: "Company created" });
    }
    catch (e) {
        next(e);
    }
}
async function getCompany(req, res, next) {
    try {
        const data = await company_service_js_1.companyService.getById(req.params.id);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function listCompanies(req, res, next) {
    try {
        const q = req.query;
        const data = await company_service_js_1.companyService.list({
            page: q.page ? parseInt(q.page, 10) : undefined,
            pageSize: q.pageSize ? parseInt(q.pageSize, 10) : undefined,
            status: q.status,
        });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function createLead(req, res, next) {
    try {
        const data = await lead_service_js_1.leadService.create(req.body, user(req).userId, user(req).userRole);
        res.status(201).json({ success: true, data, message: "Lead created" });
    }
    catch (e) {
        next(e);
    }
}
async function getLead(req, res, next) {
    try {
        const data = await lead_service_js_1.leadService.getById(req.params.id);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function listLeads(req, res, next) {
    try {
        const q = req.query;
        const data = await lead_service_js_1.leadService.list({
            page: q.page ? parseInt(q.page, 10) : undefined,
            pageSize: q.pageSize ? parseInt(q.pageSize, 10) : undefined,
            companyId: q.companyId,
            status: q.status,
            assignedTo: q.assignedTo,
        });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function convertLead(req, res, next) {
    try {
        const { reason } = req.body;
        const data = await lead_service_js_1.leadService.convertToOpportunity(req.params.id, reason, user(req).userId, user(req).userRole);
        res.status(200).json({ success: true, data, message: "Lead converted" });
    }
    catch (e) {
        next(e);
    }
}
async function markLeadDead(req, res, next) {
    try {
        const { reason } = req.body;
        const data = await lead_service_js_1.leadService.markDead(req.params.id, reason, user(req).userId, user(req).userRole);
        res.status(200).json({ success: true, data, message: "Lead marked dead" });
    }
    catch (e) {
        next(e);
    }
}
async function createOpportunity(req, res, next) {
    try {
        const body = req.body;
        const data = await opportunity_service_js_1.opportunityService.create({
            ...body,
            expectedClosureDate: body.expectedClosureDate ? new Date(body.expectedClosureDate) : undefined,
        }, user(req).userId, user(req).userRole);
        res.status(201).json({ success: true, data, message: "Opportunity created" });
    }
    catch (e) {
        next(e);
    }
}
async function getOpportunity(req, res, next) {
    try {
        const data = await opportunity_service_js_1.opportunityService.getById(req.params.id);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function listOpportunities(req, res, next) {
    try {
        const q = req.query;
        const data = await opportunity_service_js_1.opportunityService.list({
            page: q.page ? parseInt(q.page, 10) : undefined,
            pageSize: q.pageSize ? parseInt(q.pageSize, 10) : undefined,
            companyId: q.companyId,
            stage: q.stage,
            assignedSalesPerson: q.assignedSalesPerson,
        });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function transitionStage(req, res, next) {
    try {
        const { stage, reason, lostReason } = req.body;
        const data = await opportunity_service_js_1.opportunityService.transitionStage(req.params.id, stage, user(req).userId, user(req).userRole, { reason, lostReason });
        res.status(200).json({ success: true, data, message: "Stage updated" });
    }
    catch (e) {
        next(e);
    }
}
async function updateOemFields(req, res, next) {
    try {
        const data = await opportunity_service_js_1.opportunityService.updateOemFields(req.params.id, req.body, user(req).userId, user(req).userRole);
        res.status(200).json({ success: true, data, message: "OEM fields updated" });
    }
    catch (e) {
        next(e);
    }
}
async function getOpportunityTimeline(req, res, next) {
    try {
        const data = await opportunity_service_js_1.opportunityService.getTimeline(req.params.id);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getOpportunityPipeline(req, res, next) {
    try {
        const data = await pipeline_service_js_1.pipelineService.getPipelineView(req.params.id, user(req).userRole);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function createQuote(req, res, next) {
    try {
        const data = await quote_service_js_1.quoteService.create(req.body, user(req).userId, user(req).userRole);
        res.status(201).json({ success: true, data, message: "Quote created" });
    }
    catch (e) {
        next(e);
    }
}
async function getQuote(req, res, next) {
    try {
        const data = await quote_service_js_1.quoteService.getById(req.params.id);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function updateQuote(req, res, next) {
    try {
        const data = await quote_service_js_1.quoteService.update(req.params.id, req.body, user(req).userId, user(req).userRole);
        res.status(200).json({ success: true, data, message: "Quote updated" });
    }
    catch (e) {
        next(e);
    }
}
async function createOvf(req, res, next) {
    try {
        const data = await ovf_service_js_1.ovfService.create(req.body, user(req).userId, user(req).userRole);
        res.status(201).json({ success: true, data, message: "OVF created" });
    }
    catch (e) {
        next(e);
    }
}
async function sendOvfForApproval(req, res, next) {
    try {
        const data = await ovf_service_js_1.ovfService.sendForApproval(req.params.id, user(req).userId, user(req).userRole);
        res.status(200).json({ success: true, data, message: "Sent for approval" });
    }
    catch (e) {
        next(e);
    }
}
async function listPendingApprovals(req, res, next) {
    try {
        const data = await approval_service_js_1.approvalService.listPending(user(req).userRole);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function approvalDecide(req, res, next) {
    try {
        const { status, comments } = req.body;
        const data = await approval_service_js_1.approvalService.decide(req.params.id, { status: status, comments }, user(req).userId, user(req).userRole);
        res.status(200).json({ success: true, data, message: status === "APPROVED" ? "Approved" : "Rejected" });
    }
    catch (e) {
        next(e);
    }
}
async function scmHandoff(req, res, next) {
    try {
        const data = await scm_service_js_1.scmService.handoff(req.params.opportunityId, user(req).userId, user(req).userRole);
        res.status(201).json({ success: true, data, message: "Handed off to SCM" });
    }
    catch (e) {
        next(e);
    }
}
async function listScmHandoffs(req, res, next) {
    try {
        const q = req.query;
        const data = await scm_service_js_1.scmService.list({ page: q.page ? parseInt(q.page, 10) : undefined, pageSize: q.pageSize ? parseInt(q.pageSize, 10) : undefined }, user(req).userRole);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getLifecycleDashboardData(_req, res, next) {
    try {
        const data = await (0, lifecycle_dashboard_service_js_1.getLifecycleDashboard)();
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=lifecycle.controller.js.map