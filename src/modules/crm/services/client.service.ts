import { clientRepository } from "../repositories/client.repository.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";

export interface CreateClientInput {
  companyName: string;
  contactPerson: string;
  phone?: string;
  email: string;
  industry?: string;
  assignedTo?: string;
}

export interface UpdateClientInput {
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  industry?: string;
  assignedTo?: string;
}

export const clientService = {
  async create(input: CreateClientInput, userId: string) {
    const client = await clientRepository.create(input);
    await createAuditLog({
      userId,
      action: "client.create",
      entityType: "Client",
      entityId: client.id,
      metadata: { companyName: client.companyName },
    });
    return client;
  },

  async getById(id: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const client = await clientRepository.findById(id);
    if (!client) throw new AppError(404, "Client not found");
    if (!options.canViewAll && client.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this client");
    }
    return client;
  },

  async list(filters: {
    assignedTo?: string;
    page?: number;
    pageSize?: number;
    canViewAll: boolean;
  }) {
    const assignedTo = filters.canViewAll ? undefined : filters.assignedTo;
    return clientRepository.findMany({
      assignedTo: assignedTo ?? undefined,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  },

  async update(id: string, input: UpdateClientInput, userId: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const existing = await clientRepository.findById(id);
    if (!existing) throw new AppError(404, "Client not found");
    if (!options.canViewAll && existing.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this client");
    }
    const updated = await clientRepository.update(id, input);
    await createAuditLog({
      userId,
      action: "client.update",
      entityType: "Client",
      entityId: id,
    });
    return updated;
  },
};
