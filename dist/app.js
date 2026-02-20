"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const index_js_1 = require("./config/index.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const auth_routes_js_1 = require("./modules/auth/auth.routes.js");
const routes_js_1 = require("./modules/crm/routes.js");
const proxy_routes_js_1 = require("./modules/proxy/proxy.routes.js");
const employees_routes_js_1 = require("./modules/employees/employees.routes.js");
const routes_js_2 = require("./modules/sales-lifecycle/routes.js");
const pipeline_routes_js_1 = require("./modules/pipeline/pipeline.routes.js");
const scm_routes_js_1 = require("./modules/scm/scm.routes.js");
const deployment_routes_js_1 = require("./modules/deployment/deployment.routes.js");
const preSales_routes_js_1 = require("./modules/preSales/preSales.routes.js");
const dataAi_routes_js_1 = require("./modules/dataAi/dataAi.routes.js");
const cloud_routes_js_1 = require("./modules/cloud/cloud.routes.js");
const legal_routes_js_1 = require("./modules/legal/legal.routes.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, express_rate_limit_1.default)({
    windowMs: index_js_1.config.rateLimit.windowMs,
    max: index_js_1.config.rateLimit.max,
    message: { success: false, message: "Too many requests" },
    standardHeaders: true,
    legacyHeaders: false,
}));
// Health
app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});
// API
app.use("/api/auth", auth_routes_js_1.authRoutes);
app.use("/api/proxy", proxy_routes_js_1.proxyRoutes);
app.use("/api", employees_routes_js_1.employeesRoutes);
app.use("/api", routes_js_2.lifecycleRoutes);
app.use("/api", pipeline_routes_js_1.pipelineRoutes);
app.use("/api", scm_routes_js_1.scmRoutes);
app.use("/api", deployment_routes_js_1.deploymentRoutes);
app.use("/api", preSales_routes_js_1.preSalesRoutes);
app.use("/api", dataAi_routes_js_1.dataAiRoutes);
app.use("/api", cloud_routes_js_1.cloudRoutes);
app.use("/api", legal_routes_js_1.legalRoutes);
app.use("/api", routes_js_1.crmRoutes);
app.use(errorHandler_js_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map