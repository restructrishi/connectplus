import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as ctrl from "./scm.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/scm/purchase-orders", ctrl.listPos);
router.get("/scm/purchase-orders/:id", ctrl.getPo);
router.post("/scm/purchase-orders", ctrl.createPo);
router.patch("/scm/purchase-orders/:id", ctrl.updatePo);
router.put("/scm/purchase-orders/:id/status", ctrl.updatePoStatus);
router.post("/scm/purchase-orders/:id/handoff-to-deployment", ctrl.handoffToDeployment);

export { router as scmRoutes };
