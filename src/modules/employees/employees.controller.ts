import type { Request, Response, NextFunction } from "express";
import { employeesRepository } from "./employees.repository.js";
import { AppError } from "../../middleware/errorHandler.js";

export async function syncEmployees(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as unknown;
    const data = Array.isArray(body) ? body : (body != null && typeof body === "object" && "data" in body ? (body as { data: unknown }).data : null);
    if (!Array.isArray(data) || data.length === 0) {
      throw new AppError(400, "Body must be { data: [...] } or an array of employees");
    }
    const normalized = data.map((row: Record<string, unknown>) => ({
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
      throw new AppError(400, "Every employee must have an 'id'");
    }
    const saved = await employeesRepository.upsertMany(normalized);
    res.status(200).json({
      success: true,
      message: `Saved ${saved.length} employee(s) to database`,
      data: { count: saved.length },
    });
  } catch (e) {
    next(e);
  }
}

export async function listSyncedEmployees(_req: Request, res: Response, next: NextFunction) {
  try {
    const list = await employeesRepository.list();
    res.status(200).json({ success: true, data: list });
  } catch (e) {
    next(e);
  }
}
