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
exports.pipelineRoutes = void 0;
const express_1 = require("express");
const auth_js_1 = require("../../middleware/auth.js");
const ctrl = __importStar(require("./pipeline.controller.js"));
const router = (0, express_1.Router)();
exports.pipelineRoutes = router;
router.use(auth_js_1.authMiddleware);
// Companies
router.post("/pipeline/companies", ctrl.createCompany);
router.get("/pipeline/companies", ctrl.listCompanies);
// Leads
router.post("/pipeline/leads", ctrl.createLead);
router.get("/pipeline/leads/active", ctrl.getActiveLeads);
router.put("/pipeline/leads/:id/convert", ctrl.convertLead);
router.put("/pipeline/leads/:id/lost", ctrl.markLeadLost);
// Opportunities
router.get("/pipeline/opportunities", ctrl.listOpportunities);
router.get("/pipeline/opportunities/:id", ctrl.getOpportunity);
router.put("/pipeline/opportunities/:id/status", ctrl.updateOpportunityStatus);
router.put("/pipeline/opportunities/:id/attachments", ctrl.updateOpportunityAttachments);
router.put("/pipeline/opportunities/:id/technical", ctrl.updateOpportunityTechnical);
router.post("/pipeline/opportunities/:id/email", ctrl.sendOpportunityEmail);
router.post("/pipeline/opportunities/:id/approve", ctrl.approveOpportunity);
router.put("/pipeline/opportunities/:id/ovf", ctrl.updateOpportunityOvf);
router.put("/pipeline/opportunities/:id/lost", ctrl.markOpportunityLost);
// Files (stub)
router.post("/pipeline/upload", ctrl.pipelineUpload);
router.get("/pipeline/files/:key", ctrl.getPipelineFile);
//# sourceMappingURL=pipeline.routes.js.map