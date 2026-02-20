"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = getDashboard;
const dashboard_service_js_1 = require("../services/dashboard.service.js");
async function getDashboard(_req, res, next) {
    try {
        const summary = await dashboard_service_js_1.dashboardService.getSummary();
        res.status(200).json({ success: true, data: summary });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=dashboard.controller.js.map