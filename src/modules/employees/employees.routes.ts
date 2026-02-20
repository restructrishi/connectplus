import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as ctrl from "./employees.controller.js";

const router = Router();
router.use(authMiddleware);

router.post("/employees/sync", ctrl.syncEmployees);
router.get("/employees/synced", ctrl.listSyncedEmployees);

export { router as employeesRoutes };
