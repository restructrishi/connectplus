import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/rbac";
import {
  createScmOrder,
  getScmOrder,
  getScmProcurement,
  getScmDispatch,
  getScmDocuments,
  getScmEmails,
  getScmExpenses,
  getScmStageLogs,
  getScmStats,
  getScmSummary,
  getScmWarehouse,
  listScmOrders,
  updateScmExpenseStatus,
  updateScmOrder,
  advanceScmStage,
  upsertScmProcurement,
  upsertScmWarehouse,
  upsertScmDispatch,
  sendScmProcurementPo,
  confirmScmWarehouse,
  confirmScmDispatch,
  uploadScmDocument,
  shareScmDocuments,
  addScmExpense,
  sendScmEmail,
  completeScmOrder,
  getScmActivities,
  addScmManualActivity,
} from "./controller";

export const scmRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

scmRouter.use(authenticate);

scmRouter.get(
  "/orders",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SALES", "DEPLOYMENT", "SUPER_ADMIN"]),
  asyncHandler(listScmOrders),
);

scmRouter.get(
  "/orders/summary",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SALES", "DEPLOYMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmSummary),
);

scmRouter.get(
  "/",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SALES", "DEPLOYMENT", "SUPER_ADMIN"]),
  asyncHandler(listScmOrders),
);

scmRouter.get(
  "/stats",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SALES", "DEPLOYMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmStats),
);

scmRouter.post("/", requireRoles(["SCM", "SUPER_ADMIN"]), asyncHandler(createScmOrder));

scmRouter.get(
  "/:id",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SALES", "DEPLOYMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmOrder),
);

scmRouter.get(
  "/:id/activities",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SALES", "DEPLOYMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmActivities),
);

scmRouter.patch("/:id", requireRoles(["SCM", "SUPER_ADMIN"]), asyncHandler(updateScmOrder));

scmRouter.get(
  "/:id/stages",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SALES", "DEPLOYMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmStageLogs),
);

scmRouter.post("/:id/stages/advance", requireRoles(["SCM", "SUPER_ADMIN"]), asyncHandler(advanceScmStage));

scmRouter.get(
  "/:id/procurement",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmProcurement),
);

scmRouter.put("/:id/procurement", requireRoles(["SCM", "SUPER_ADMIN"]), asyncHandler(upsertScmProcurement));

scmRouter.post(
  "/:id/procurement/send-po",
  requireRoles(["SCM", "SUPER_ADMIN"]),
  asyncHandler(sendScmProcurementPo),
);

scmRouter.get(
  "/:id/warehouse",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmWarehouse),
);

scmRouter.put("/:id/warehouse", requireRoles(["SCM", "SUPER_ADMIN"]), asyncHandler(upsertScmWarehouse));

scmRouter.post(
  "/:id/warehouse/confirm",
  requireRoles(["SCM", "SUPER_ADMIN"]),
  asyncHandler(confirmScmWarehouse),
);

scmRouter.get(
  "/:id/dispatch",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmDispatch),
);

scmRouter.put("/:id/dispatch", requireRoles(["SCM", "SUPER_ADMIN"]), asyncHandler(upsertScmDispatch));

scmRouter.post(
  "/:id/dispatch/confirm",
  requireRoles(["SCM", "SUPER_ADMIN"]),
  asyncHandler(confirmScmDispatch),
);

scmRouter.get(
  "/:id/documents",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmDocuments),
);

scmRouter.post(
  "/:id/documents",
  requireRoles(["SCM", "SUPER_ADMIN"]),
  upload.single("file"),
  asyncHandler(uploadScmDocument),
);

scmRouter.post(
  "/:id/documents/share",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SUPER_ADMIN"]),
  asyncHandler(shareScmDocuments),
);

scmRouter.get(
  "/:id/expenses",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmExpenses),
);

scmRouter.post("/:id/expenses", requireRoles(["SCM", "SUPER_ADMIN"]), asyncHandler(addScmExpense));

scmRouter.patch(
  "/:id/expenses/:expId",
  requireRoles(["ACCOUNTS", "MANAGEMENT", "SUPER_ADMIN"]),
  asyncHandler(updateScmExpenseStatus),
);

scmRouter.post(
  "/:id/activities",
  requireRoles(["SCM", "SUPER_ADMIN"]),
  asyncHandler(addScmManualActivity),
);

scmRouter.get(
  "/:id/emails",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SUPER_ADMIN"]),
  asyncHandler(getScmEmails),
);

scmRouter.post(
  "/:id/emails/send",
  requireRoles(["SCM", "ACCOUNTS", "MANAGEMENT", "SUPER_ADMIN"]),
  asyncHandler(sendScmEmail),
);

scmRouter.post("/:id/complete", requireRoles(["SCM", "SUPER_ADMIN"]), asyncHandler(completeScmOrder));
