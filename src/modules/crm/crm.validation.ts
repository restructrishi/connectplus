import { z } from "zod";

const leadStatus = z.enum(["NEW", "CONTACTED", "QUALIFIED", "LOST", "CONVERTED"]);
const dealStage = z.enum(["PROPOSAL", "NEGOTIATION", "WON", "LOST"]);
const activityType = z.enum(["CALL", "MEETING", "EMAIL", "FOLLOWUP"]);
const taskStatus = z.enum(["PENDING", "COMPLETED"]);

const pagination = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

// Leads
export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name required"),
    phone: z.string().optional(),
    email: z.string().email(),
    company: z.string().optional(),
    source: z.string().optional(),
    status: leadStatus.optional(),
    assignedTo: z.string().optional(),
    industry: z.string().optional(),
    expectedClosureDate: z.string().optional(),
    expectedBusinessAmount: z.coerce.number().optional(),
    details: z.record(z.unknown()).optional(),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    company: z.string().optional(),
    source: z.string().optional(),
    status: leadStatus.optional(),
    assignedTo: z.string().optional(),
    industry: z.string().optional(),
    expectedClosureDate: z.string().optional(),
    expectedBusinessAmount: z.coerce.number().optional(),
    details: z.record(z.unknown()).optional(),
  }),
});

export const listLeadsSchema = z.object({
  query: pagination.extend({
    status: leadStatus.optional(),
    assignedTo: z.string().optional(),
  }),
});

// Clients
export const createClientSchema = z.object({
  body: z.object({
    companyName: z.string().min(1),
    contactPerson: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email(),
    industry: z.string().optional(),
    assignedTo: z.string().optional(),
  }),
});

export const updateClientSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    companyName: z.string().min(1).optional(),
    contactPerson: z.string().min(1).optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    industry: z.string().optional(),
    assignedTo: z.string().optional(),
  }),
});

export const listClientsSchema = z.object({
  query: pagination.extend({ assignedTo: z.string().optional() }),
});

// Deals
export const createDealSchema = z.object({
  body: z.object({
    clientId: z.string().min(1),
    value: z.number().positive(),
    stage: dealStage.optional(),
    expectedClosureDate: z.string().datetime().optional().or(z.coerce.date().optional()),
  }),
});

export const updateDealSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    value: z.number().positive().optional(),
    stage: dealStage.optional(),
    expectedClosureDate: z.string().datetime().optional().or(z.coerce.date().optional().nullable()),
  }),
});

export const listDealsSchema = z.object({
  query: pagination.extend({
    clientId: z.string().optional(),
    stage: dealStage.optional(),
  }),
});

// Activities
export const createActivitySchema = z.object({
  body: z.object({
    leadId: z.string().optional(),
    clientId: z.string().optional(),
    type: activityType,
    notes: z.string().optional(),
  }),
});

export const listActivitiesSchema = z.object({
  query: pagination.extend({
    leadId: z.string().optional(),
    clientId: z.string().optional(),
    createdBy: z.string().optional(),
  }),
});

// Tasks
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    assignedTo: z.string().min(1),
    dueDate: z.string().datetime().optional().or(z.coerce.date().optional()),
    status: taskStatus.optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    assignedTo: z.string().optional(),
    dueDate: z.string().datetime().optional().or(z.coerce.date().optional().nullable()),
    status: taskStatus.optional(),
  }),
});

export const listTasksSchema = z.object({
  query: pagination.extend({
    assignedTo: z.string().optional(),
    status: taskStatus.optional(),
  }),
});

// Audit
export const listAuditSchema = z.object({
  query: pagination.extend({
    userId: z.string().optional(),
    entityType: z.string().optional(),
    entityId: z.string().optional(),
  }),
});
