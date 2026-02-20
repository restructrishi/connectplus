import { Router } from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import { validate, type ValidationSchema } from "../../middleware/validate.js";
import * as leadController from "./controllers/lead.controller.js";
import * as clientController from "./controllers/client.controller.js";
import * as dealController from "./controllers/deal.controller.js";
import * as activityController from "./controllers/activity.controller.js";
import * as taskController from "./controllers/task.controller.js";
import * as dashboardController from "./controllers/dashboard.controller.js";
import * as auditController from "./controllers/audit.controller.js";
import {
  createLeadSchema,
  updateLeadSchema,
  listLeadsSchema,
  createClientSchema,
  updateClientSchema,
  listClientsSchema,
  createDealSchema,
  updateDealSchema,
  listDealsSchema,
  createActivitySchema,
  listActivitiesSchema,
  createTaskSchema,
  updateTaskSchema,
  listTasksSchema,
  listAuditSchema,
} from "./crm.validation.js";
const router = Router();

router.use(authMiddleware);

// Dashboard - all authenticated roles
router.get("/dashboard", dashboardController.getDashboard);
router.get("/dashboard/home", dashboardController.getHomeDashboardData);

// Leads
router.post("/leads", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validate(createLeadSchema as ValidationSchema), leadController.createLead);
router.get("/leads", validate(listLeadsSchema as ValidationSchema), leadController.listLeads);
router.get("/leads/:id", leadController.getLead);
router.patch("/leads/:id", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validate(updateLeadSchema as ValidationSchema), leadController.updateLead);
router.post("/leads/:id/convert-to-client", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), leadController.convertLeadToClient);

// Clients
router.post("/clients", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validate(createClientSchema as ValidationSchema), clientController.createClient);
router.get("/clients", validate(listClientsSchema as ValidationSchema), clientController.listClients);
router.get("/clients/:id", clientController.getClient);
router.patch("/clients/:id", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validate(updateClientSchema as ValidationSchema), clientController.updateClient);

// Deals
router.post("/deals", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validate(createDealSchema as ValidationSchema), dealController.createDeal);
router.get("/deals", validate(listDealsSchema as ValidationSchema), dealController.listDeals);
router.get("/deals/:id", dealController.getDeal);
router.get("/clients/:clientId/deals", dealController.listDealsByClient);
router.patch("/deals/:id", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validate(updateDealSchema as ValidationSchema), dealController.updateDeal);

// Activities
router.post("/activities", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validate(createActivitySchema as ValidationSchema), activityController.createActivity);
router.get("/activities", validate(listActivitiesSchema as ValidationSchema), activityController.listActivities);
router.get("/activities/:id", activityController.getActivity);

// Tasks
router.post("/tasks", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validate(createTaskSchema as ValidationSchema), taskController.createTask);
router.get("/tasks", validate(listTasksSchema as ValidationSchema), taskController.listTasks);
router.get("/tasks/:id", taskController.getTask);
router.patch("/tasks/:id", requireRole("SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validate(updateTaskSchema as ValidationSchema), taskController.updateTask);

// Audit logs - Super Admin and Sales Manager only
router.get("/audit-logs", requireRole("SUPER_ADMIN", "SALES_MANAGER"), validate(listAuditSchema as ValidationSchema), auditController.listAuditLogs);

export { router as crmRoutes };
