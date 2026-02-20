import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as ctrl from "./pipeline.controller.js";

const router = Router();
router.use(authMiddleware);

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

export { router as pipelineRoutes };
