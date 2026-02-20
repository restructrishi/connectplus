import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as ctrl from "./deployment.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/deployment", ctrl.listDeployments);
router.post("/deployment", ctrl.createDeployment);
router.get("/deployment/:id", ctrl.getDeployment);
router.patch("/deployment/:id", ctrl.updateDeployment);

export { router as deploymentRoutes };
