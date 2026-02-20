"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeesRepository = void 0;
const prisma_js_1 = require("../../lib/prisma.js");
exports.employeesRepository = {
    async upsertMany(items) {
        const results = await Promise.all(items.map((row) => {
            let dateOfJoining;
            if (row.dateOfJoining) {
                const d = new Date(row.dateOfJoining);
                if (!Number.isNaN(d.getTime()))
                    dateOfJoining = d;
            }
            return prisma_js_1.prisma.syncedEmployee.upsert({
                where: { id: row.id },
                create: {
                    id: row.id,
                    employeeCode: row.employeeCode ?? undefined,
                    firstName: row.firstName ?? undefined,
                    lastName: row.lastName ?? undefined,
                    email: row.email ?? undefined,
                    designation: row.designation ?? undefined,
                    employmentType: row.employmentType ?? undefined,
                    dateOfJoining,
                    departmentName: row.departmentName ?? undefined,
                },
                update: {
                    employeeCode: row.employeeCode ?? undefined,
                    firstName: row.firstName ?? undefined,
                    lastName: row.lastName ?? undefined,
                    email: row.email ?? undefined,
                    designation: row.designation ?? undefined,
                    employmentType: row.employmentType ?? undefined,
                    ...(dateOfJoining !== undefined && { dateOfJoining }),
                    departmentName: row.departmentName ?? undefined,
                    syncedAt: new Date(),
                },
            });
        }));
        return results;
    },
    async list() {
        return prisma_js_1.prisma.syncedEmployee.findMany({
            orderBy: { syncedAt: "desc" },
        });
    },
};
//# sourceMappingURL=employees.repository.js.map