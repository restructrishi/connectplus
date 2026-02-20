import type { DealStage } from "@prisma/client";
import { dealRepository } from "../repositories/deal.repository.js";
import { clientRepository } from "../repositories/client.repository.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";

const VALID_STAGES: DealStage[] = ["PROPOSAL", "NEGOTIATION", "WON", "LOST"];

export interface CreateDealInput {
  clientId: string;
  value: number;
  stage?: DealStage;
  expectedClosureDate?: Date;
}

export interface UpdateDealInput {
  value?: number;
  stage?: DealStage;
  expectedClosureDate?: Date | null;
}

export const dealService = {
  async create(input: CreateDealInput, userId: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const client = await clientRepository.findById(input.clientId);
    if (!client) throw new AppError(404, "Client not found");
    if (!options.canViewAll && client.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this client");
    }
    if (input.stage && !VALID_STAGES.includes(input.stage)) {
      throw new AppError(400, "Invalid deal stage");
    }
    const deal = await dealRepository.create({
      clientId: input.clientId,
      value: input.value,
      stage: input.stage ?? "PROPOSAL",
      expectedClosureDate: input.expectedClosureDate,
    });
    await createAuditLog({
      userId,
      action: "deal.create",
      entityType: "Deal",
      entityId: deal.id,
      metadata: { clientId: input.clientId, value: input.value },
    });
    return deal;
  },

  async getById(id: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const deal = await dealRepository.findById(id);
    if (!deal) throw new AppError(404, "Deal not found");
    if (!options.canViewAll && deal.client.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this deal");
    }
    return deal;
  },

  async listByClient(clientId: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const client = await clientRepository.findById(clientId);
    if (!client) throw new AppError(404, "Client not found");
    if (!options.canViewAll && client.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this client");
    }
    return dealRepository.findManyByClientId(clientId);
  },

  async list(filters: { clientId?: string; stage?: DealStage; page?: number; pageSize?: number; assignedTo?: string; canViewAll: boolean }) {
    return dealRepository.findMany({
      clientId: filters.clientId,
      stage: filters.stage,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  },

  async update(id: string, input: UpdateDealInput, userId: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const existing = await dealRepository.findById(id);
    if (!existing) throw new AppError(404, "Deal not found");
    if (!options.canViewAll && existing.client.assignedTo !== options.assignedTo) {
      throw new AppError(403, "Access denied to this deal");
    }
    if (input.stage && !VALID_STAGES.includes(input.stage)) {
      throw new AppError(400, "Invalid deal stage");
    }
    const updated = await dealRepository.update(id, {
      value: input.value,
      stage: input.stage,
      expectedClosureDate: input.expectedClosureDate,
    });
    await createAuditLog({
      userId,
      action: "deal.update",
      entityType: "Deal",
      entityId: id,
      metadata: { stage: input.stage },
    });
    return updated;
  },
};
