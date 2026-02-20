"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPos = listPos;
exports.getPo = getPo;
exports.createPo = createPo;
exports.updatePoStatus = updatePoStatus;
exports.updatePo = updatePo;
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
const scm_service_js_1 = require("./scm.service.js");
function userId(req) {
    const sub = req.user?.sub;
    if (!sub)
        throw new errorHandler_js_1.AppError(401, "Unauthorized");
    return sub;
}
async function listPos(req, res, next) {
    try {
        const status = req.query.status;
        const dealId = req.query.dealId;
        const data = await scm_service_js_1.scmService.listPos(userId(req), { status: status, dealId });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getPo(req, res, next) {
    try {
        const data = await scm_service_js_1.scmService.getPo(req.params.id, userId(req));
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function createPo(req, res, next) {
    try {
        const body = req.body;
        const data = await scm_service_js_1.scmService.createPo(userId(req), body);
        res.status(201).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function updatePoStatus(req, res, next) {
    try {
        const { status } = req.body;
        const extra = req.body;
        delete extra.status;
        const data = await scm_service_js_1.scmService.updatePoStatus(req.params.id, userId(req), status, extra);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function updatePo(req, res, next) {
    try {
        const data = await scm_service_js_1.scmService.updatePo(req.params.id, userId(req), req.body);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=scm.controller.js.map