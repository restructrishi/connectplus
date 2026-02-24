import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/rbac";
import {
  addDeploymentActivity,
  advanceDeploymentStage,
  assignDeploymentEngineer,
  completeDeploymentInfra,
  completeDeploymentSiteSurvey,
  completeDeploymentTask,
  createDeploymentMaterialRequest,
  createDeploymentProject,
  createDeploymentTask,
  getDeploymentActivities,
  getDeploymentEmails,
  getDeploymentEngineers,
  getDeploymentInfra,
  getDeploymentMaterials,
  getDeploymentProject,
  getDeploymentSiteSurvey,
  getDeploymentStageLogs,
  getDeploymentStats,
  getDeploymentTasks,
  getDeploymentSummary,
  getDeploymentTasksForEngineer,
  listDeploymentSiteSurveys,
  listDeploymentProjects,
  markDeploymentGoLive,
  removeDeploymentEngineer,
  sendDeploymentEmail,
  updateDeploymentMaterialRequest,
  updateDeploymentProject,
  updateDeploymentTask,
  upsertDeploymentInfra,
  upsertDeploymentSiteSurvey,
  verifyDeploymentMaterial,
} from "./controller";

export const deploymentRouter = Router();

deploymentRouter.use(authenticate);

const readRoles = ["SUPER_ADMIN", "MANAGEMENT", "DEPLOYMENT", "SALES", "SCM"];
const writeRoles = ["SUPER_ADMIN", "MANAGEMENT", "DEPLOYMENT"];

deploymentRouter.get("/summary", requireRoles(readRoles), asyncHandler(getDeploymentSummary));

deploymentRouter.get("/stats", requireRoles(readRoles), asyncHandler(getDeploymentStats));

deploymentRouter.get("/", requireRoles(readRoles), asyncHandler(listDeploymentProjects));

deploymentRouter.get("/projects", requireRoles(readRoles), asyncHandler(listDeploymentProjects));

deploymentRouter.get("/tasks", requireRoles(readRoles), asyncHandler(getDeploymentTasksForEngineer));

deploymentRouter.get("/site-surveys", requireRoles(readRoles), asyncHandler(listDeploymentSiteSurveys));

deploymentRouter.post("/", requireRoles(writeRoles), asyncHandler(createDeploymentProject));

deploymentRouter.get("/:id", requireRoles(readRoles), asyncHandler(getDeploymentProject));

deploymentRouter.patch("/:id", requireRoles(writeRoles), asyncHandler(updateDeploymentProject));

deploymentRouter.get("/:id/stages", requireRoles(readRoles), asyncHandler(getDeploymentStageLogs));

deploymentRouter.post("/:id/stages/advance", requireRoles(writeRoles), asyncHandler(advanceDeploymentStage));

deploymentRouter.get("/:id/tasks", requireRoles(readRoles), asyncHandler(getDeploymentTasks));

deploymentRouter.post("/:id/tasks", requireRoles(writeRoles), asyncHandler(createDeploymentTask));

deploymentRouter.patch("/:id/tasks/:taskId", requireRoles(writeRoles), asyncHandler(updateDeploymentTask));

deploymentRouter.post(
  "/:id/tasks/:taskId/complete",
  requireRoles(writeRoles),
  asyncHandler(completeDeploymentTask),
);

deploymentRouter.get("/:id/engineers", requireRoles(readRoles), asyncHandler(getDeploymentEngineers));

deploymentRouter.post("/:id/engineers", requireRoles(writeRoles), asyncHandler(assignDeploymentEngineer));

deploymentRouter.delete(
  "/:id/engineers/:engId",
  requireRoles(writeRoles),
  asyncHandler(removeDeploymentEngineer),
);

deploymentRouter.get("/:id/site-survey", requireRoles(readRoles), asyncHandler(getDeploymentSiteSurvey));

deploymentRouter.put("/:id/site-survey", requireRoles(writeRoles), asyncHandler(upsertDeploymentSiteSurvey));

deploymentRouter.post(
  "/:id/site-survey/complete",
  requireRoles(writeRoles),
  asyncHandler(completeDeploymentSiteSurvey),
);

deploymentRouter.get("/:id/infra", requireRoles(readRoles), asyncHandler(getDeploymentInfra));

deploymentRouter.put("/:id/infra", requireRoles(writeRoles), asyncHandler(upsertDeploymentInfra));

deploymentRouter.post("/:id/infra/complete", requireRoles(writeRoles), asyncHandler(completeDeploymentInfra));

deploymentRouter.get("/:id/materials", requireRoles(readRoles), asyncHandler(getDeploymentMaterials));

deploymentRouter.post(
  "/:id/materials",
  requireRoles(writeRoles),
  asyncHandler(createDeploymentMaterialRequest),
);

deploymentRouter.patch(
  "/:id/materials/:mrId",
  requireRoles(writeRoles),
  asyncHandler(updateDeploymentMaterialRequest),
);

deploymentRouter.post(
  "/:id/materials/:mrId/verify",
  requireRoles(writeRoles),
  asyncHandler(verifyDeploymentMaterial),
);

deploymentRouter.get("/:id/emails", requireRoles(readRoles), asyncHandler(getDeploymentEmails));

deploymentRouter.post("/:id/emails", requireRoles(writeRoles), asyncHandler(sendDeploymentEmail));

deploymentRouter.post("/:id/golive", requireRoles(writeRoles), asyncHandler(markDeploymentGoLive));

deploymentRouter.get("/:id/activities", requireRoles(readRoles), asyncHandler(getDeploymentActivities));

deploymentRouter.post("/:id/activities", requireRoles(writeRoles), asyncHandler(addDeploymentActivity));
