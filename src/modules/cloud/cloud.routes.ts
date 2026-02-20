import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as ctrl from "./cloud.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/cloud/projects", ctrl.listCloudProjects);
router.get("/cloud/projects/:id", ctrl.getCloudProject);

export { router as cloudRoutes };
