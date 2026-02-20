import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { login, register, getProfile } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { validate, type ValidationSchema } from "../../middleware/validate.js";

const router = Router();

router.post("/login", validate(loginSchema as ValidationSchema), login);
router.post("/register", validate(registerSchema as ValidationSchema), register);

router.get("/profile", authMiddleware, getProfile);

export { router as authRoutes };
