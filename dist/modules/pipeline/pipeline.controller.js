"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = createCompany;
exports.listCompanies = listCompanies;
exports.createLead = createLead;
exports.getActiveLeads = getActiveLeads;
exports.convertLead = convertLead;
exports.markLeadLost = markLeadLost;
exports.listOpportunities = listOpportunities;
exports.getOpportunity = getOpportunity;
exports.updateOpportunityStatus = updateOpportunityStatus;
exports.updateOpportunityAttachments = updateOpportunityAttachments;
exports.updateOpportunityTechnical = updateOpportunityTechnical;
exports.sendOpportunityEmail = sendOpportunityEmail;
exports.approveOpportunity = approveOpportunity;
exports.updateOpportunityOvf = updateOpportunityOvf;
exports.markOpportunityLost = markOpportunityLost;
exports.pipelineUpload = pipelineUpload;
exports.getPipelineFile = getPipelineFile;
const pipeline_service_js_1 = require("./pipeline.service.js");
async function createCompany(req, res, next) {
    try {
        const { name } = req.body;
        const data = await pipeline_service_js_1.pipelineService.createCompany(name);
        res.status(201).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function listCompanies(_req, res, next) {
    try {
        const data = await pipeline_service_js_1.pipelineService.listCompanies();
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function createLead(req, res, next) {
    try {
        const { companyId } = req.body;
        const data = await pipeline_service_js_1.pipelineService.createLead(companyId);
        res.status(201).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getActiveLeads(_req, res, next) {
    try {
        const data = await pipeline_service_js_1.pipelineService.getActiveLeads();
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function convertLead(req, res, next) {
    try {
        const data = await pipeline_service_js_1.pipelineService.convertLeadToOpportunity(req.params.id);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function markLeadLost(req, res, next) {
    try {
        const { reason } = req.body;
        const data = await pipeline_service_js_1.pipelineService.markLeadLost(req.params.id, reason);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function listOpportunities(_req, res, next) {
    try {
        const data = await pipeline_service_js_1.pipelineService.listOpportunities();
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getOpportunity(req, res, next) {
    try {
        const data = await pipeline_service_js_1.pipelineService.getOpportunityById(req.params.id);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function updateOpportunityStatus(req, res, next) {
    try {
        const { status } = req.body;
        const data = await pipeline_service_js_1.pipelineService.updateOpportunityStatus(req.params.id, status);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function updateOpportunityAttachments(req, res, next) {
    try {
        const attachments = req.body;
        const data = await pipeline_service_js_1.pipelineService.updateOpportunityAttachments(req.params.id, attachments);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function updateOpportunityTechnical(req, res, next) {
    try {
        const technicalDetails = req.body;
        const data = await pipeline_service_js_1.pipelineService.updateOpportunityTechnical(req.params.id, technicalDetails);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function sendOpportunityEmail(req, res, next) {
    try {
        const body = req.body;
        const data = await pipeline_service_js_1.pipelineService.addEmailSent(req.params.id, {
            type: body.type ?? "PRESALES_TEAM",
            sentAt: new Date().toISOString(),
            to: Array.isArray(body.to) ? body.to : [],
            status: "SENT",
        });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function approveOpportunity(req, res, next) {
    try {
        const body = req.body;
        const data = await pipeline_service_js_1.pipelineService.approveOpportunity(req.params.id, body.approvalIndex ?? 0, body.status ?? "APPROVED", body.approvedBy);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function updateOpportunityOvf(req, res, next) {
    try {
        const ovfDetails = req.body;
        const data = await pipeline_service_js_1.pipelineService.updateOpportunityOvf(req.params.id, ovfDetails);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function markOpportunityLost(req, res, next) {
    try {
        const { reason } = req.body;
        const data = await pipeline_service_js_1.pipelineService.markOpportunityLost(req.params.id, reason);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function pipelineUpload(req, res, next) {
    try {
        const opportunityId = req.body?.opportunityId ?? "temp";
        const type = req.body?.type ?? "file";
        const key = "pipeline/" + opportunityId + "/" + type + "-" + Date.now();
        res.status(200).json({ success: true, data: { key, url: "/api/pipeline/files/" + key } });
    }
    catch (e) {
        next(e);
    }
}
async function getPipelineFile(_req, res, next) {
    try {
        res.status(404).json({ success: false, message: "File not found" });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=pipeline.controller.js.map