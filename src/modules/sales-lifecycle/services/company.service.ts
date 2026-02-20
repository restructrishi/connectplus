import type { CompanyStatus } from "@prisma/client";
import { companyRepository } from "../repositories/company.repository.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { canPerform } from "../constants.js";
import type { CrmRole } from "@prisma/client";

export const companyService = {
  async create(name: string, userId: string, userRole: CrmRole) {
    if (!canPerform(userRole, "create_company")) throw new AppError(403, "Not allowed to create company");
    const company = await companyRepository.create({ name, createdBy: userId });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.company.create",
      entityType: "SalesCompany",
      entityId: company.id,
      metadata: { name: company.name },
    });
    return company;
  },

  async getById(id: string) {
    const company = await companyRepository.findById(id);
    if (!company) throw new AppError(404, "Company not found");
    return company;
  },

  async list(filters: { status?: CompanyStatus; page?: number; pageSize?: number }) {
    return companyRepository.findMany(filters);
  },

  async updateStatus(id: string, status: CompanyStatus, userId: string) {
    const company = await companyRepository.findById(id);
    if (!company) throw new AppError(404, "Company not found");
    const updated = await companyRepository.updateStatus(id, status);
    await createAuditLog({
      userId,
      action: "sales_lifecycle.company.update_status",
      entityType: "SalesCompany",
      entityId: id,
      metadata: { status },
    });
    return updated;
  },

  async softDelete(id: string, userId: string, userRole: CrmRole) {
    const company = await companyRepository.findById(id);
    if (!company) throw new AppError(404, "Company not found");
    const hasActive = await companyRepository.hasActiveOpportunity(id);
    if (hasActive) throw new AppError(400, "Cannot delete company with active opportunity");
    if (!canPerform(userRole, "*") && !canPerform(userRole, "create_company")) throw new AppError(403, "Not allowed");
    await companyRepository.softDelete(id);
    await createAuditLog({
      userId,
      action: "sales_lifecycle.company.delete",
      entityType: "SalesCompany",
      entityId: id,
    });
    return { success: true };
  },
};
