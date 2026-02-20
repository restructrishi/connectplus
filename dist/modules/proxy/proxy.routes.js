"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyRoutes = void 0;
const express_1 = require("express");
const auth_js_1 = require("../../middleware/auth.js");
const proxy_controller_js_1 = require("./proxy.controller.js");
const router = (0, express_1.Router)();
exports.proxyRoutes = router;
router.use(auth_js_1.authMiddleware);
router.post("/", proxy_controller_js_1.proxyRequest);
//# sourceMappingURL=proxy.routes.js.map