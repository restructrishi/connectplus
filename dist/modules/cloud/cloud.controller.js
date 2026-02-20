"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCloudProjects = listCloudProjects;
exports.getCloudProject = getCloudProject;
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
const cloud_service_js_1 = require("./cloud.service.js");
function userId(req) {
    const sub = req.user?.sub;
    if (!sub)
        throw new errorHandler_js_1.AppError(401, "Unauthorized");
    return sub;
}
async function listCloudProjects(req, res, next) {
    try {
        const status = req.query.status;
        const data = await cloud_service_js_1.cloudService.list(userId(req), { status });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getCloudProject(req, res, next) {
    try {
        const data = await cloud_service_js_1.cloudService.getById(req.params.id, userId(req));
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=cloud.controller.js.map