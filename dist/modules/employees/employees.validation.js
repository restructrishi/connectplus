"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncEmployeesSchema = void 0;
const zod_1 = require("zod");
const employeeItemSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Employee id required"),
    employeeCode: zod_1.z.string().optional().nullable(),
    firstName: zod_1.z.string().optional().nullable(),
    lastName: zod_1.z.string().optional().nullable(),
    email: zod_1.z.string().optional().nullable(),
    designation: zod_1.z.string().optional().nullable(),
    employmentType: zod_1.z.string().optional().nullable(),
    dateOfJoining: zod_1.z.string().optional().nullable(),
    departmentName: zod_1.z.string().optional().nullable(),
});
exports.syncEmployeesSchema = zod_1.z.object({
    body: zod_1.z.object({
        data: zod_1.z.array(employeeItemSchema).min(1, "At least one employee required"),
    }),
});
//# sourceMappingURL=employees.validation.js.map