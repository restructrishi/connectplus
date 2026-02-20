"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDeployments = listDeployments;
exports.getDeployment = getDeployment;
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
const deployment_service_js_1 = require("./deployment.service.js");
function userId(req) {
    const sub = req.user?.sub;
    if (!sub)
        throw new errorHandler_js_1.AppError(401, "Unauthorized");
    return sub;
}
async function listDeployments(req, res, next) {
    try {
        const status = req.query.status;
        const dealId = req.query.dealId;
        const data = await deployment_service_js_1.deploymentService.list(userId(req), { status, dealId });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getDeployment(req, res, next) {
    try {
        const data = await deployment_service_js_1.deploymentService.getById(req.params.id, userId(req));
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=deployment.controller.js.map