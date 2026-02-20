"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjects = listProjects;
exports.getProject = getProject;
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
const dataAi_service_js_1 = require("./dataAi.service.js");
function userId(req) {
    const sub = req.user?.sub;
    if (!sub)
        throw new errorHandler_js_1.AppError(401, "Unauthorized");
    return sub;
}
async function listProjects(req, res, next) {
    try {
        const status = req.query.status;
        const data = await dataAi_service_js_1.dataAiService.listProjects(userId(req), { status });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getProject(req, res, next) {
    try {
        const data = await dataAi_service_js_1.dataAiService.getProjectById(req.params.id, userId(req));
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=dataAi.controller.js.map