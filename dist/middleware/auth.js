"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
exports.canViewAllLeads = canViewAllLeads;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = require("../config/index.js");
const errorHandler_js_1 = require("./errorHandler.js");
function authMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        next(new errorHandler_js_1.AppError(401, "Authentication required"));
        return;
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, index_js_1.config.jwt.secret);
        req.user = decoded;
        next();
    }
    catch {
        next(new errorHandler_js_1.AppError(401, "Invalid or expired token"));
    }
}
const roleHierarchy = {
    SUPER_ADMIN: 6,
    SALES_MANAGER: 5,
    MANAGEMENT: 4,
    SALES_HEAD: 4,
    SCM: 3,
    PRE_SALES: 3,
    SALES_EXECUTIVE: 2,
    VIEWER: 1,
};
function requireRole(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            next(new errorHandler_js_1.AppError(401, "Authentication required"));
            return;
        }
        if (allowedRoles.includes(req.user.role)) {
            next();
            return;
        }
        next(new errorHandler_js_1.AppError(403, "Insufficient permissions"));
    };
}
/** Sales Manager and above can view all leads; Sales Executive sees only assigned. */
function canViewAllLeads(req) {
    if (!req.user)
        return false;
    return roleHierarchy[req.user.role] >= roleHierarchy.SALES_MANAGER;
}
//# sourceMappingURL=auth.js.map