"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.getProfile = getProfile;
const auth_service_js_1 = require("./auth.service.js");
async function login(req, res, next) {
    try {
        const body = req.body;
        const result = await auth_service_js_1.authService.login(body);
        res.status(200).json({ success: true, data: result, message: "Login successful" });
    }
    catch (e) {
        next(e);
    }
}
async function register(req, res, next) {
    try {
        const body = req.body;
        const user = await auth_service_js_1.authService.register(body);
        res.status(201).json({ success: true, data: user, message: "User registered" });
    }
    catch (e) {
        next(e);
    }
}
async function getProfile(req, res, next) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const profile = await auth_service_js_1.authService.getProfile(req.user.sub);
        res.status(200).json({ success: true, data: profile });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=auth.controller.js.map