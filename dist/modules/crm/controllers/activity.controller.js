"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivity = createActivity;
exports.getActivity = getActivity;
exports.listActivities = listActivities;
const activity_service_js_1 = require("../services/activity.service.js");
const auth_js_1 = require("../../../middleware/auth.js");
function options(req) {
    return { assignedTo: req.user.employeeId, canViewAll: (0, auth_js_1.canViewAllLeads)(req) };
}
async function createActivity(req, res, next) {
    try {
        const activity = await activity_service_js_1.activityService.create(req.body, req.user.sub, options(req));
        res.status(201).json({ success: true, data: activity, message: "Activity created" });
    }
    catch (e) {
        next(e);
    }
}
async function getActivity(req, res, next) {
    try {
        const activity = await activity_service_js_1.activityService.getById(req.params.id, options(req));
        res.status(200).json({ success: true, data: activity });
    }
    catch (e) {
        next(e);
    }
}
async function listActivities(req, res, next) {
    try {
        const { page, pageSize, leadId, clientId, createdBy } = req.query;
        const result = await activity_service_js_1.activityService.list({
            ...options(req),
            page: page ? parseInt(page, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
            leadId,
            clientId,
            createdBy,
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
//# sourceMappingURL=activity.controller.js.map