import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as ctrl from "./legal.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/legal/agreements", ctrl.listAgreements);
router.get("/legal/agreements/:id", ctrl.getAgreement);
router.get("/legal/policies", ctrl.listPolicies);
router.get("/legal/policies/:id", ctrl.getPolicy);

export { router as legalRoutes };
