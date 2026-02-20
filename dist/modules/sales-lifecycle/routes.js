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
exports.lifecycleRoutes = void 0;
const express_1 = require("express");
const auth_js_1 = require("../../middleware/auth.js");
const validate_js_1 = require("../../middleware/validate.js");
const ctrl = __importStar(require("./controllers/lifecycle.controller.js"));
const lifecycle_validation_js_1 = require("./lifecycle.validation.js");
const documentCtrl = __importStar(require("./controllers/document.controller.js"));
const router = (0, express_1.Router)();
exports.lifecycleRoutes = router;
router.use(auth_js_1.authMiddleware);
// Dashboard
router.get("/lifecycle/dashboard", ctrl.getLifecycleDashboardData);
// Companies
router.post("/lifecycle/companies", (0, validate_js_1.validate)(lifecycle_validation_js_1.createCompanySchema), ctrl.createCompany);
router.get("/lifecycle/companies", (0, validate_js_1.validate)(lifecycle_validation_js_1.listCompaniesSchema), ctrl.listCompanies);
router.get("/lifecycle/companies/:id", ctrl.getCompany);
// Leads
router.post("/lifecycle/leads", (0, validate_js_1.validate)(lifecycle_validation_js_1.createLeadSchema), ctrl.createLead);
router.get("/lifecycle/leads", (0, validate_js_1.validate)(lifecycle_validation_js_1.listLeadsSchema), ctrl.listLeads);
router.get("/lifecycle/leads/:id", ctrl.getLead);
router.post("/lifecycle/leads/:id/convert", (0, validate_js_1.validate)(lifecycle_validation_js_1.convertLeadSchema), ctrl.convertLead);
router.post("/lifecycle/leads/:id/mark-dead", (0, validate_js_1.validate)(lifecycle_validation_js_1.markLeadDeadSchema), ctrl.markLeadDead);
// Opportunities
router.post("/lifecycle/opportunities", (0, validate_js_1.validate)(lifecycle_validation_js_1.createOpportunitySchema), ctrl.createOpportunity);
router.get("/lifecycle/opportunities", (0, validate_js_1.validate)(lifecycle_validation_js_1.listOpportunitiesSchema), ctrl.listOpportunities);
router.get("/lifecycle/opportunities/:id", ctrl.getOpportunity);
router.get("/lifecycle/opportunities/:id/pipeline", ctrl.getOpportunityPipeline);
router.post("/lifecycle/opportunities/:id/transition", (0, validate_js_1.validate)(lifecycle_validation_js_1.transitionStageSchema), ctrl.transitionStage);
router.patch("/lifecycle/opportunities/:id/oem", (0, validate_js_1.validate)(lifecycle_validation_js_1.updateOemSchema), ctrl.updateOemFields);
router.get("/lifecycle/opportunities/:id/timeline", ctrl.getOpportunityTimeline);
// Documents (BOQ/SOW/OEM - POST body: opportunityId, type, fileName, content base64 or filePath)
router.post("/lifecycle/documents", documentCtrl.uploadDocument);
router.get("/lifecycle/opportunities/:id/documents", documentCtrl.listDocuments);
// Quote
router.get("/lifecycle/quotes/:id", ctrl.getQuote);
router.post("/lifecycle/quotes", (0, validate_js_1.validate)(lifecycle_validation_js_1.createQuoteSchema), ctrl.createQuote);
router.patch("/lifecycle/quotes/:id", (0, validate_js_1.validate)(lifecycle_validation_js_1.updateQuoteSchema), ctrl.updateQuote);
// OVF
router.post("/lifecycle/ovf", (0, validate_js_1.validate)(lifecycle_validation_js_1.createOvfSchema), ctrl.createOvf);
router.post("/lifecycle/ovf/:id/send-approval", ctrl.sendOvfForApproval);
// Approvals
router.get("/lifecycle/approvals/pending", ctrl.listPendingApprovals);
router.post("/lifecycle/approvals/:id/decide", (0, validate_js_1.validate)(lifecycle_validation_js_1.approvalDecideSchema), ctrl.approvalDecide);
// SCM
router.post("/lifecycle/scm/:opportunityId/handoff", (0, validate_js_1.validate)(lifecycle_validation_js_1.scmHandoffSchema), ctrl.scmHandoff);
router.get("/lifecycle/scm", ctrl.listScmHandoffs);
//# sourceMappingURL=routes.js.map