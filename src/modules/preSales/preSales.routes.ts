import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as ctrl from "./preSales.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/pre-sales", ctrl.listPreSales);
router.post("/pre-sales", ctrl.createPreSales);
router.get("/pre-sales/:id", ctrl.getPreSales);
router.patch("/pre-sales/:id", ctrl.updatePreSales);

export { router as preSalesRoutes };
