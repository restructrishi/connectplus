"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLead = createLead;
exports.getLead = getLead;
exports.listLeads = listLeads;
exports.updateLead = updateLead;
exports.convertLeadToClient = convertLeadToClient;
const lead_service_js_1 = require("../services/lead.service.js");
const auth_js_1 = require("../../../middleware/auth.js");
async function createLead(req, res, next) {
    try {
        const userId = req.user.sub;
        const body = req.body;
        const lead = await lead_service_js_1.leadService.create(body, userId);
        res.status(201).json({ success: true, data: lead, message: "Lead created" });
    }
    catch (e) {
        next(e);
    }
}
async function getLead(req, res, next) {
    try {
        const { id } = req.params;
        const options = { assignedTo: req.user.employeeId, canViewAll: (0, auth_js_1.canViewAllLeads)(req) };
        const lead = await lead_service_js_1.leadService.getById(id, options);
        res.status(200).json({ success: true, data: lead });
    }
    catch (e) {
        next(e);
    }
}
async function listLeads(req, res, next) {
    try {
        const { page, pageSize, status, assignedTo } = req.query;
        const canViewAll = (0, auth_js_1.canViewAllLeads)(req);
        const options = {
            assignedTo: canViewAll ? assignedTo : req.user.employeeId,
            canViewAll,
            page: page ? parseInt(page, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
            status: status,
        };
        const result = await lead_service_js_1.leadService.list(options);
        res.status(200).json({
            success: true,
            data: {
                items: result.items,
                total: result.total,
                page: result.page,
                pageSize: result.pageSize,
                totalPages: result.totalPages,
            },
        });
    }
    catch (e) {
        next(e);
    }
}
async function updateLead(req, res, next) {
    try {
        const { id } = req.params;
        const options = { assignedTo: req.user.employeeId, canViewAll: (0, auth_js_1.canViewAllLeads)(req) };
        const lead = await lead_service_js_1.leadService.update(id, req.body, req.user.sub, options);
        res.status(200).json({ success: true, data: lead, message: "Lead updated" });
    }
    catch (e) {
        next(e);
    }
}
async function convertLeadToClient(req, res, next) {
    try {
        const { id } = req.params;
        const options = { assignedTo: req.user.employeeId, canViewAll: (0, auth_js_1.canViewAllLeads)(req) };
        const client = await lead_service_js_1.leadService.convertToClient(id, req.user.sub, options);
        res.status(201).json({ success: true, data: client, message: "Lead converted to client" });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=lead.controller.js.map