"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// Use custom output to avoid EPERM on Windows when dev server locks node_modules/.prisma
const index_js_1 = require("../../generated/prisma-client/index.js");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new index_js_1.PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
//# sourceMappingURL=prisma.js.map