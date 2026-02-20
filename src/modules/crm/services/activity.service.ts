import type { ActivityType } from "@prisma/client";
import { activityRepository } from "../repositories/activity.repository.js";
import { leadRepository } from "../repositories/lead.repository.js";
import { clientRepository } from "../repositories/client.repository.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";

const VALID_TYPES: ActivityType[] = ["CALL", "MEETING", "EMAIL", "FOLLOWUP"];

export interface CreateActivityInput {
  leadId?: string;
  clientId?: string;
  type: ActivityType;
  notes?: string;
}

export const activityService = {
  async create(input: CreateActivityInput, userId: string, options: { assignedTo?: string; canViewAll: boolean }) {
    if (!input.leadId && !input.clientId) {
      throw new AppError(400, "Either leadId or clientId is required");
    }
    if (input.leadId) {
      const lead = await leadRepository.findById(input.leadId);
      if (!lead) throw new AppError(404, "Lead not found");
      if (!options.canViewAll && lead.assignedTo !== options.assignedTo) {
        throw new AppError(403, "Access denied to this lead");
      }
    }
    if (input.clientId) {
      const client = await clientRepository.findById(input.clientId);
      if (!client) throw new AppError(404, "Client not found");
      if (!options.canViewAll && client.assignedTo !== options.assignedTo) {
        throw new AppError(403, "Access denied to this client");
      }
    }
    if (!VALID_TYPES.includes(input.type)) {
      throw new AppError(400, "Invalid activity type");
    }
    const activity = await activityRepository.create({
      leadId: input.leadId,
      clientId: input.clientId,
      type: input.type,
      notes: input.notes,
      createdBy: userId,
    });
    await createAuditLog({
      userId,
      action: "activity.create",
      entityType: "Activity",
      entityId: activity.id,
    });
    return activity;
  },

  async getById(id: string, options: { assignedTo?: string; canViewAll: boolean }) {
    const activity = await activityRepository.findById(id);
    if (!activity) throw new AppError(404, "Activity not found");
    if (activity.leadId && activity.lead) {
      if (!options.canViewAll && activity.lead.assignedTo !== options.assignedTo) throw new AppError(403, "Access denied");
    }
    if (activity.clientId && activity.client) {
      if (!options.canViewAll && activity.client.assignedTo !== options.assignedTo) throw new AppError(403, "Access denied");
    }
    return activity;
  },

  async list(filters: {
    leadId?: string;
    clientId?: string;
    createdBy?: string;
    page?: number;
    pageSize?: number;
    assignedTo?: string;
    canViewAll: boolean;
  }) {
    return activityRepository.findMany({
      leadId: filters.leadId,
      clientId: filters.clientId,
      createdBy: filters.createdBy,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  },
};
