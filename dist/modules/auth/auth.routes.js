"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_js_1 = require("../../middleware/auth.js");
const auth_controller_js_1 = require("./auth.controller.js");
const auth_validation_js_1 = require("./auth.validation.js");
const validate_js_1 = require("../../middleware/validate.js");
const router = (0, express_1.Router)();
exports.authRoutes = router;
router.post("/login", (0, validate_js_1.validate)(auth_validation_js_1.loginSchema), auth_controller_js_1.login);
router.post("/register", (0, validate_js_1.validate)(auth_validation_js_1.registerSchema), auth_controller_js_1.register);
router.get("/profile", auth_js_1.authMiddleware, auth_controller_js_1.getProfile);
//# sourceMappingURL=auth.routes.js.map