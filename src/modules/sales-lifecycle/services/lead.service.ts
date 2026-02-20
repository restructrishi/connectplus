import type { LeadLifecycleStatus } from "@prisma/client";
import { leadRepository } from "../repositories/lead.repository.js";
import { companyRepository } from "../repositories/company.repository.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { canPerform } from "../constants.js";
import type { CrmRole } from "@prisma/client";

export const leadService = {
  async create(
    data: { name: string; companyId: string; contactInfo?: string; assignedTo?: string },
    userId: string,
    userRole: CrmRole
  ) {
    if (!canPerform(userRole, "create_lead")) throw new AppError(403, "Not allowed to create lead");
    const company = await companyRepository.findById(data.companyId);
    if (!company) throw new AppError(404, "Company not found");
    const lead = await leadRepository.create({
      ...data,
      createdBy: userId,
    });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.lead.create",
      entityType: "SalesLead",
      entityId: lead.id,
      metadata: { name: lead.name, companyId: data.companyId },
    });
    return lead;
  },

  async getById(id: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new AppError(404, "Lead not found");
    return lead;
  },

  async list(filters: { companyId?: string; status?: LeadLifecycleStatus; assignedTo?: string; page?: number; pageSize?: number }) {
    return leadRepository.findMany(filters);
  },

  async convertToOpportunity(id: string, reason: string, userId: string, userRole: CrmRole) {
    if (!canPerform(userRole, "convert_lead")) throw new AppError(403, "Not allowed to convert lead");
    const lead = await leadRepository.findById(id);
    if (!lead) throw new AppError(404, "Lead not found");
    if (lead.status !== "OPEN") throw new AppError(400, "Lead is not open");
    if (!reason?.trim()) throw new AppError(400, "Conversion reason is required");
    const updated = await leadRepository.convert(id, { convertedBy: userId, convertedReason: reason });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.lead.convert",
      entityType: "SalesLead",
      entityId: id,
      metadata: { reason },
    });
    return updated;
  },

  async markDead(id: string, reason: string, userId: string, userRole: CrmRole) {
    if (!canPerform(userRole, "mark_lead_dead")) throw new AppError(403, "Not allowed to mark lead dead");
    const lead = await leadRepository.findById(id);
    if (!lead) throw new AppError(404, "Lead not found");
    if (lead.status !== "OPEN") throw new AppError(400, "Lead is not open");
    if (!reason?.trim()) throw new AppError(400, "Reason is required");
    const updated = await leadRepository.markDead(id, { deadBy: userId, deadReason: reason });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.lead.mark_dead",
      entityType: "SalesLead",
      entityId: id,
      metadata: { reason },
    });
    return updated;
  },
};
