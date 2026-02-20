"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAgreements = listAgreements;
exports.getAgreement = getAgreement;
exports.listPolicies = listPolicies;
exports.getPolicy = getPolicy;
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
const legal_service_js_1 = require("./legal.service.js");
function userId(req) {
    const sub = req.user?.sub;
    if (!sub)
        throw new errorHandler_js_1.AppError(401, "Unauthorized");
    return sub;
}
async function listAgreements(req, res, next) {
    try {
        const dealId = req.query.dealId;
        const data = await legal_service_js_1.legalService.listAgreements(userId(req), { dealId });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getAgreement(req, res, next) {
    try {
        const data = await legal_service_js_1.legalService.getAgreementById(req.params.id, userId(req));
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function listPolicies(req, res, next) {
    try {
        const status = req.query.status;
        const data = await legal_service_js_1.legalService.listPolicies(userId(req), { status });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getPolicy(req, res, next) {
    try {
        const data = await legal_service_js_1.legalService.getPolicyById(req.params.id, userId(req));
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=legal.controller.js.map