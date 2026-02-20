"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const crmRoleEnum = zod_1.z.enum(["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "VIEWER"]);
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Valid email required"),
        password: zod_1.z.string().min(1, "Password required"),
    }),
});
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        employeeId: zod_1.z.string().min(1, "Employee ID required"),
        email: zod_1.z.string().email("Valid email required"),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
        role: crmRoleEnum.optional(),
    }),
});
//# sourceMappingURL=auth.validation.js.map