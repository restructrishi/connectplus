"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: parseInt(process.env.PORT ?? "4000", 10),
    jwt: {
        secret: process.env.JWT_SECRET ?? "change-me-in-production-min-32-chars",
        expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    },
    hrms: {
        serviceUrl: process.env.HRMS_SERVICE_URL ?? "http://localhost:4001",
        apiKey: process.env.HRMS_API_KEY ?? "",
    },
    rateLimit: {
        max: parseInt(process.env.RATE_LIMIT_MAX ?? "200", 10),
        windowMs: 15 * 60 * 1000, // 15 minutes
    },
};
//# sourceMappingURL=index.js.map