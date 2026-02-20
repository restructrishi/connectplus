import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { proxyRequest } from "./proxy.controller.js";

const router = Router();
router.use(authMiddleware);
router.post("/", proxyRequest);
export { router as proxyRoutes };
