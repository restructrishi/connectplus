"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPreSales = listPreSales;
exports.getPreSales = getPreSales;
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
const preSales_service_js_1 = require("./preSales.service.js");
function userId(req) {
    const sub = req.user?.sub;
    if (!sub)
        throw new errorHandler_js_1.AppError(401, "Unauthorized");
    return sub;
}
async function listPreSales(req, res, next) {
    try {
        const dealId = req.query.dealId;
        const data = await preSales_service_js_1.preSalesService.list(userId(req), { dealId });
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function getPreSales(req, res, next) {
    try {
        const data = await preSales_service_js_1.preSalesService.getById(req.params.id, userId(req));
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=preSales.controller.js.map