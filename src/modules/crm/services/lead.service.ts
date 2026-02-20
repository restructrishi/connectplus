import type { LeadStatus } from "@prisma/client";
import { leadRepository } from "../repositories/lead.repository.js";
import { clientRepository } from "../repositories/client.repository.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";

const VALID_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "LOST", "CONVERTED"];

export interface CreateLeadInput {
  name: string;
  phone?: string;
  email: string;
  company?: string;
  source?: string;
  status?: LeadStatus;
  assignedTo?: string;
  industry?: string;
  expectedClosureDate?: string | Date;
  expectedBusinessAmount?: number;
  details?: Record<string, unknown>;
}

export interface UpdateLeadInput {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  source?: string;
  status?: LeadStatus;
  assignedTo?: string;
  industry?: string;
  expectedClosureDate?: string | Date;
  expectedBusinessAmount?: number;
  details?: Record<string, unknown>;
}

export const leadService = {
  async create(input: CreateLeadInput, userId: string) {
    if (input.status && !VALID_STATUSES.includes(input.status)) {
      throw new AppError(400, "Invalid lead status");
    }
    const lead = await leadRepository.create({
      name: input.name,
      phone: input.phone,
      email: input.email,
      company: input.company,
      source: input.source,
      status: input.status ?? "NEW",
      assignedTo: input.assignedTo ?? undefined,
      industry: input.industry,
      expectedClosureDate: input.expectedClosureDate ? new Date(input.expectedClosureDate) : undefined,
      expectedBusinessAmount: input.expectedBusinessAmount,
      details: input.details,
    });
    await createAuditLog({
      userId,
      action: "lead.create",
      entityType: "Lead",
      entityId: lead.id,
      metadata: { name: lead.name },
    });
    return lead;
  },

  async getById(id: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new AppError(404, "Lead not found");
    if (!options.canViewAll && lead.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this lead");
    }
    return lead;
  },

  async list(filters: {
    assignedTo?: string;
    status?: LeadStatus;
    page?: number;
    pageSize?: number;
    canViewAll: boolean;
  }) {
    const assignedTo = filters.canViewAll ? undefined : filters.assignedTo;
    return leadRepository.findMany({
      assignedTo: assignedTo ?? undefined,
      status: filters.status,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  },

  async update(id: string, input: UpdateLeadInput, userId: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const existing = await leadRepository.findById(id);
    if (!existing) throw new AppError(404, "Lead not found");
    if (!options.canViewAll && existing.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this lead");
    }
    if (input.status && !VALID_STATUSES.includes(input.status)) {
      throw new AppError(400, "Invalid lead status");
    }
    const updated = await leadRepository.update(id, {
      name: input.name,
      phone: input.phone,
      email: input.email,
      company: input.company,
      source: input.source,
      status: input.status,
      assignedTo: input.assignedTo,
      industry: input.industry,
      expectedClosureDate: input.expectedClosureDate ? new Date(input.expectedClosureDate) : undefined,
      expectedBusinessAmount: input.expectedBusinessAmount,
      details: input.details,
    });
    await createAuditLog({
      userId,
      action: "lead.update",
      entityType: "Lead",
      entityId: id,
      metadata: { status: input.status },
    });
    return updated;
  },

  async convertToClient(leadId: string, userId: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw new AppError(404, "Lead not found");
    if (!options.canViewAll && lead.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this lead");
    }
    if (lead.status !== "QUALIFIED") {
      throw new AppError(400, "Only QUALIFIED leads can be converted to client");
    }
    const existingClient = await clientRepository.findByConvertedLeadId(leadId);
    if (existingClient) throw new AppError(400, "Lead already converted to client");

    const client = await clientRepository.create({
      companyName: lead.company ?? lead.name,
      contactPerson: lead.name,
      phone: lead.phone ?? undefined,
      email: lead.email,
      industry: undefined,
      assignedTo: lead.assignedTo ?? undefined,
      convertedFromLeadId: leadId,
    });
    await leadRepository.update(leadId, { status: "CONVERTED" });
    await createAuditLog({
      userId,
      action: "lead.convert_to_client",
      entityType: "Lead",
      entityId: leadId,
      metadata: { clientId: client.id },
    });
    return client;
  },
};
