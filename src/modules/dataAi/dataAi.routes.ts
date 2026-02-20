import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as ctrl from "./dataAi.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/data-ai/projects", ctrl.listProjects);
router.get("/data-ai/projects/:id", ctrl.getProject);

export { router as dataAiRoutes };
