"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const index_js_1 = require("../../config/index.js");
const auth_repository_js_1 = require("./auth.repository.js");
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
const SALT_ROUNDS = 10;
const DB_SETUP_MESSAGE = "Database not set up. Run 'npm run db:setup' from the project root (or fix DB permissions).";
const PRISMA_GENERATE_MESSAGE = "Database client out of date. Run: npx prisma generate && npm run db:seed, then restart the server.";
const DB_UNREACHABLE_MESSAGE = "Database unreachable. Check DATABASE_URL in .env, ensure PostgreSQL is running and reachable (e.g. VPN if using a remote host).";
function isPrismaOrClientError(err) {
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError)
        return true;
    if (err instanceof client_1.Prisma.PrismaClientInitializationError)
        return true;
    if (err instanceof TypeError)
        return true;
    const msg = err instanceof Error ? err.message : String(err);
    const name = err instanceof Error ? err.name : "";
    if (name === "PrismaClientInitializationError")
        return true;
    return (/prisma|findUnique|crmUser|organization|Can't reach database server|ECONNREFUSED|ETIMEDOUT/i.test(msg));
}
exports.authService = {
    async login(input) {
        try {
            let user;
            try {
                user = await auth_repository_js_1.authRepository.findByEmail(input.email);
            }
            catch (err) {
                if (err instanceof errorHandler_js_1.AppError)
                    throw err;
                if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2021") {
                    throw new errorHandler_js_1.AppError(503, DB_SETUP_MESSAGE);
                }
                if (isPrismaOrClientError(err)) {
                    const msg = err instanceof Error ? err.message : String(err);
                    console.error("[auth] login DB/client error", err);
                    if (/Can't reach database server|ECONNREFUSED|ETIMEDOUT/i.test(msg)) {
                        throw new errorHandler_js_1.AppError(503, DB_UNREACHABLE_MESSAGE);
                    }
                    throw new errorHandler_js_1.AppError(503, PRISMA_GENERATE_MESSAGE);
                }
                throw err;
            }
            if (!user)
                throw new errorHandler_js_1.AppError(401, "Invalid email or password");
            const valid = await bcryptjs_1.default.compare(input.password, user.passwordHash);
            if (!valid)
                throw new errorHandler_js_1.AppError(401, "Invalid email or password");
            const payload = {
                sub: user.id,
                employeeId: user.employeeId,
                email: user.email,
                role: user.role,
            };
            const token = jsonwebtoken_1.default.sign(payload, index_js_1.config.jwt.secret, {
                expiresIn: index_js_1.config.jwt.expiresIn,
            });
            return {
                token,
                expiresIn: index_js_1.config.jwt.expiresIn,
                user: { id: user.id, employeeId: user.employeeId, email: user.email, role: user.role },
            };
        }
        catch (err) {
            if (err instanceof errorHandler_js_1.AppError)
                throw err;
            console.error("[auth] login error", err);
            throw new errorHandler_js_1.AppError(503, "Login temporarily unavailable. Check server logs or try again.");
        }
    },
    async register(input) {
        const existing = await auth_repository_js_1.authRepository.findByEmail(input.email);
        if (existing)
            throw new errorHandler_js_1.AppError(400, "Email already registered");
        const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
        const user = await auth_repository_js_1.authRepository.create({
            employeeId: input.employeeId,
            email: input.email,
            passwordHash,
            role: input.role ?? "VIEWER",
        });
        return {
            id: user.id,
            employeeId: user.employeeId,
            email: user.email,
            role: user.role,
        };
    },
    async getProfile(userId) {
        const user = await auth_repository_js_1.authRepository.findById(userId);
        if (!user)
            throw new errorHandler_js_1.AppError(404, "User not found");
        return { id: user.id, employeeId: user.employeeId, email: user.email, role: user.role };
    },
};
//# sourceMappingURL=auth.service.js.map