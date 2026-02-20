"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.crmRoutes = void 0;
const express_1 = require("express");
const auth_js_1 = require("../../middleware/auth.js");
const validate_js_1 = require("../../middleware/validate.js");
const leadController = __importStar(require("./controllers/lead.controller.js"));
const clientController = __importStar(require("./controllers/client.controller.js"));
const dealController = __importStar(require("./controllers/deal.controller.js"));
const activityController = __importStar(require("./controllers/activity.controller.js"));
const taskController = __importStar(require("./controllers/task.controller.js"));
const dashboardController = __importStar(require("./controllers/dashboard.controller.js"));
const auditController = __importStar(require("./controllers/audit.controller.js"));
const crm_validation_js_1 = require("./crm.validation.js");
const router = (0, express_1.Router)();
exports.crmRoutes = router;
router.use(auth_js_1.authMiddleware);
// Dashboard - all authenticated roles
router.get("/dashboard", dashboardController.getDashboard);
// Leads
router.post("/leads", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), (0, validate_js_1.validate)(crm_validation_js_1.createLeadSchema), leadController.createLead);
router.get("/leads", (0, validate_js_1.validate)(crm_validation_js_1.listLeadsSchema), leadController.listLeads);
router.get("/leads/:id", leadController.getLead);
router.patch("/leads/:id", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), (0, validate_js_1.validate)(crm_validation_js_1.updateLeadSchema), leadController.updateLead);
router.post("/leads/:id/convert-to-client", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), leadController.convertLeadToClient);
// Clients
router.post("/clients", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), (0, validate_js_1.validate)(crm_validation_js_1.createClientSchema), clientController.createClient);
router.get("/clients", (0, validate_js_1.validate)(crm_validation_js_1.listClientsSchema), clientController.listClients);
router.get("/clients/:id", clientController.getClient);
router.patch("/clients/:id", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), (0, validate_js_1.validate)(crm_validation_js_1.updateClientSchema), clientController.updateClient);
// Deals
router.post("/deals", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), (0, validate_js_1.validate)(crm_validation_js_1.createDealSchema), dealController.createDeal);
router.get("/deals", (0, validate_js_1.validate)(crm_validation_js_1.listDealsSchema), dealController.listDeals);
router.get("/deals/:id", dealController.getDeal);
router.get("/clients/:clientId/deals", dealController.listDealsByClient);
router.patch("/deals/:id", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), (0, validate_js_1.validate)(crm_validation_js_1.updateDealSchema), dealController.updateDeal);
// Activities
router.post("/activities", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), (0, validate_js_1.validate)(crm_validation_js_1.createActivitySchema), activityController.createActivity);
router.get("/activities", (0, validate_js_1.validate)(crm_validation_js_1.listActivitiesSchema), activityController.listActivities);
router.get("/activities/:id", activityController.getActivity);
// Tasks
router.post("/tasks", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), (0, validate_js_1.validate)(crm_validation_js_1.createTaskSchema), taskController.createTask);
router.get("/tasks", (0, validate_js_1.validate)(crm_validation_js_1.listTasksSchema), taskController.listTasks);
router.get("/tasks/:id", taskController.getTask);
router.patch("/tasks/:id", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), (0, validate_js_1.validate)(crm_validation_js_1.updateTaskSchema), taskController.updateTask);
// Audit logs - Super Admin and Sales Manager only
router.get("/audit-logs", (0, auth_js_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER"), (0, validate_js_1.validate)(crm_validation_js_1.listAuditSchema), auditController.listAuditLogs);
//# sourceMappingURL=routes.js.map