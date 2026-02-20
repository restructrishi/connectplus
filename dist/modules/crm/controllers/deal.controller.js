"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeal = createDeal;
exports.getDeal = getDeal;
exports.listDeals = listDeals;
exports.listDealsByClient = listDealsByClient;
exports.updateDeal = updateDeal;
const deal_service_js_1 = require("../services/deal.service.js");
const auth_js_1 = require("../../../middleware/auth.js");
function options(req) {
    return { assignedTo: req.user.employeeId, canViewAll: (0, auth_js_1.canViewAllLeads)(req) };
}
async function createDeal(req, res, next) {
    try {
        const body = req.body;
        const deal = await deal_service_js_1.dealService.create({
            clientId: body.clientId,
            value: body.value,
            stage: body.stage,
            expectedClosureDate: body.expectedClosureDate ? new Date(body.expectedClosureDate) : undefined,
        }, req.user.sub, options(req));
        res.status(201).json({ success: true, data: deal, message: "Deal created" });
    }
    catch (e) {
        next(e);
    }
}
async function getDeal(req, res, next) {
    try {
        const deal = await deal_service_js_1.dealService.getById(req.params.id, options(req));
        res.status(200).json({ success: true, data: deal });
    }
    catch (e) {
        next(e);
    }
}
async function listDeals(req, res, next) {
    try {
        const { page, pageSize, clientId, stage } = req.query;
        const result = await deal_service_js_1.dealService.list({
            ...options(req),
            page: page ? parseInt(page, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
            clientId,
            stage: stage,
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
async function listDealsByClient(req, res, next) {
    try {
        const deals = await deal_service_js_1.dealService.listByClient(req.params.clientId, options(req));
        res.status(200).json({ success: true, data: deals });
    }
    catch (e) {
        next(e);
    }
}
async function updateDeal(req, res, next) {
    try {
        const body = req.body;
        const deal = await deal_service_js_1.dealService.update(req.params.id, {
            value: body.value,
            stage: body.stage,
            expectedClosureDate: body.expectedClosureDate != null ? new Date(body.expectedClosureDate) : undefined,
        }, req.user.sub, options(req));
        res.status(200).json({ success: true, data: deal, message: "Deal updated" });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=deal.controller.js.map