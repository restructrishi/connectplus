"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
exports.getClient = getClient;
exports.listClients = listClients;
exports.updateClient = updateClient;
const client_service_js_1 = require("../services/client.service.js");
const auth_js_1 = require("../../../middleware/auth.js");
function options(req) {
    return { assignedTo: req.user.employeeId, canViewAll: (0, auth_js_1.canViewAllLeads)(req) };
}
async function createClient(req, res, next) {
    try {
        const client = await client_service_js_1.clientService.create(req.body, req.user.sub);
        res.status(201).json({ success: true, data: client, message: "Client created" });
    }
    catch (e) {
        next(e);
    }
}
async function getClient(req, res, next) {
    try {
        const client = await client_service_js_1.clientService.getById(req.params.id, options(req));
        res.status(200).json({ success: true, data: client });
    }
    catch (e) {
        next(e);
    }
}
async function listClients(req, res, next) {
    try {
        const { page, pageSize, assignedTo } = req.query;
        const result = await client_service_js_1.clientService.list({
            ...options(req),
            page: page ? parseInt(page, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
            assignedTo: assignedTo,
        });
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
async function updateClient(req, res, next) {
    try {
        const client = await client_service_js_1.clientService.update(req.params.id, req.body, req.user.sub, options(req));
        res.status(200).json({ success: true, data: client, message: "Client updated" });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=client.controller.js.map