import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { validate, type ValidationSchema } from "../../middleware/validate.js";
import * as ctrl from "./controllers/lifecycle.controller.js";
import {
  createCompanySchema,
  listCompaniesSchema,
  createLeadSchema,
  listLeadsSchema,
  convertLeadSchema,
  markLeadDeadSchema,
  createOpportunitySchema,
  listOpportunitiesSchema,
  transitionStageSchema,
  updateOemSchema,
  createQuoteSchema,
  updateQuoteSchema,
  createOvfSchema,
  approvalDecideSchema,
  scmHandoffSchema,
} from "./lifecycle.validation.js";
import * as documentCtrl from "./controllers/document.controller.js";

const router = Router();
router.use(authMiddleware);

// Dashboard
router.get("/lifecycle/dashboard", ctrl.getLifecycleDashboardData);

// Companies
router.post("/lifecycle/companies", validate(createCompanySchema as ValidationSchema), ctrl.createCompany);
router.get("/lifecycle/companies", validate(listCompaniesSchema as ValidationSchema), ctrl.listCompanies);
router.get("/lifecycle/companies/:id", ctrl.getCompany);

// Leads
router.post("/lifecycle/leads", validate(createLeadSchema as ValidationSchema), ctrl.createLead);
router.get("/lifecycle/leads", validate(listLeadsSchema as ValidationSchema), ctrl.listLeads);
router.get("/lifecycle/leads/:id", ctrl.getLead);
router.post("/lifecycle/leads/:id/convert", validate(convertLeadSchema as ValidationSchema), ctrl.convertLead);
router.post("/lifecycle/leads/:id/mark-dead", validate(markLeadDeadSchema as ValidationSchema), ctrl.markLeadDead);

// Opportunities
router.post("/lifecycle/opportunities", validate(createOpportunitySchema as ValidationSchema), ctrl.createOpportunity);
router.get("/lifecycle/opportunities", validate(listOpportunitiesSchema as ValidationSchema), ctrl.listOpportunities);
router.get("/lifecycle/opportunities/:id", ctrl.getOpportunity);
router.get("/lifecycle/opportunities/:id/pipeline", ctrl.getOpportunityPipeline);
router.post("/lifecycle/opportunities/:id/transition", validate(transitionStageSchema as ValidationSchema), ctrl.transitionStage);
router.patch("/lifecycle/opportunities/:id/oem", validate(updateOemSchema as ValidationSchema), ctrl.updateOemFields);
router.get("/lifecycle/opportunities/:id/timeline", ctrl.getOpportunityTimeline);

// Documents (BOQ/SOW/OEM - POST body: opportunityId, type, fileName, content base64 or filePath)
router.post("/lifecycle/documents", documentCtrl.uploadDocument);
router.get("/lifecycle/opportunities/:id/documents", documentCtrl.listDocuments);

// Quote
router.get("/lifecycle/quotes/:id", ctrl.getQuote);
router.post("/lifecycle/quotes", validate(createQuoteSchema as ValidationSchema), ctrl.createQuote);
router.patch("/lifecycle/quotes/:id", validate(updateQuoteSchema as ValidationSchema), ctrl.updateQuote);

// OVF
router.post("/lifecycle/ovf", validate(createOvfSchema as ValidationSchema), ctrl.createOvf);
router.post("/lifecycle/ovf/:id/send-approval", ctrl.sendOvfForApproval);

// Approvals
router.get("/lifecycle/approvals/pending", ctrl.listPendingApprovals);
router.post("/lifecycle/approvals/:id/decide", validate(approvalDecideSchema as ValidationSchema), ctrl.approvalDecide);

// SCM
router.post("/lifecycle/scm/:opportunityId/handoff", validate(scmHandoffSchema as ValidationSchema), ctrl.scmHandoff);
router.get("/lifecycle/scm", ctrl.listScmHandoffs);

export { router as lifecycleRoutes };
