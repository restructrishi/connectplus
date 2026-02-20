"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncEmployees = syncEmployees;
exports.listSyncedEmployees = listSyncedEmployees;
const employees_repository_js_1 = require("./employees.repository.js");
const errorHandler_js_1 = require("../../middleware/errorHandler.js");
async function syncEmployees(req, res, next) {
    try {
        const body = req.body;
        const data = Array.isArray(body) ? body : (body != null && typeof body === "object" && "data" in body ? body.data : null);
        if (!Array.isArray(data) || data.length === 0) {
            throw new errorHandler_js_1.AppError(400, "Body must be { data: [...] } or an array of employees");
        }
        const normalized = data.map((row) => ({
            id: String(row.id ?? ""),
            employeeCode: row.employeeCode != null ? String(row.employeeCode) : null,
            firstName: row.firstName != null ? String(row.firstName) : null,
            lastName: row.lastName != null ? String(row.lastName) : null,
            email: row.email != null ? String(row.email) : null,
            designation: row.designation != null ? String(row.designation) : null,
            employmentType: row.employmentType != null ? String(row.employmentType) : null,
            dateOfJoining: row.dateOfJoining != null ? String(row.dateOfJoining) : null,
            departmentName: row.departmentName != null ? String(row.departmentName) : null,
        }));
        const invalid = normalized.filter((r) => !r.id.trim());
        if (invalid.length > 0) {
            throw new errorHandler_js_1.AppError(400, "Every employee must have an 'id'");
        }
        const saved = await employees_repository_js_1.employeesRepository.upsertMany(normalized);
        res.status(200).json({
            success: true,
            message: `Saved ${saved.length} employee(s) to database`,
            data: { count: saved.length },
        });
    }
    catch (e) {
        next(e);
    }
}
async function listSyncedEmployees(_req, res, next) {
    try {
        const list = await employees_repository_js_1.employeesRepository.list();
        res.status(200).json({ success: true, data: list });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=employees.controller.js.map