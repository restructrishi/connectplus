"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAuditSchema = exports.listTasksSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.listActivitiesSchema = exports.createActivitySchema = exports.listDealsSchema = exports.updateDealSchema = exports.createDealSchema = exports.listClientsSchema = exports.updateClientSchema = exports.createClientSchema = exports.listLeadsSchema = exports.updateLeadSchema = exports.createLeadSchema = void 0;
const zod_1 = require("zod");
const leadStatus = zod_1.z.enum(["NEW", "CONTACTED", "QUALIFIED", "LOST", "CONVERTED"]);
const dealStage = zod_1.z.enum(["PROPOSAL", "NEGOTIATION", "WON", "LOST"]);
const activityType = zod_1.z.enum(["CALL", "MEETING", "EMAIL", "FOLLOWUP"]);
const taskStatus = zod_1.z.enum(["PENDING", "COMPLETED"]);
const pagination = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).optional().default(20),
});
// Leads
exports.createLeadSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name required"),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email(),
        company: zod_1.z.string().optional(),
        source: zod_1.z.string().optional(),
        status: leadStatus.optional(),
        assignedTo: zod_1.z.string().optional(),
    }),
});
exports.updateLeadSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        company: zod_1.z.string().optional(),
        source: zod_1.z.string().optional(),
        status: leadStatus.optional(),
        assignedTo: zod_1.z.string().optional(),
    }),
});
exports.listLeadsSchema = zod_1.z.object({
    query: pagination.extend({
        status: leadStatus.optional(),
        assignedTo: zod_1.z.string().optional(),
    }),
});
// Clients
exports.createClientSchema = zod_1.z.object({
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(1),
        contactPerson: zod_1.z.string().min(1),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email(),
        industry: zod_1.z.string().optional(),
        assignedTo: zod_1.z.string().optional(),
    }),
});
exports.updateClientSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(1).optional(),
        contactPerson: zod_1.z.string().min(1).optional(),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        industry: zod_1.z.string().optional(),
        assignedTo: zod_1.z.string().optional(),
    }),
});
exports.listClientsSchema = zod_1.z.object({
    query: pagination.extend({ assignedTo: zod_1.z.string().optional() }),
});
// Deals
exports.createDealSchema = zod_1.z.object({
    body: zod_1.z.object({
        clientId: zod_1.z.string().min(1),
        value: zod_1.z.number().positive(),
        stage: dealStage.optional(),
        expectedClosureDate: zod_1.z.string().datetime().optional().or(zod_1.z.coerce.date().optional()),
    }),
});
exports.updateDealSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        value: zod_1.z.number().positive().optional(),
        stage: dealStage.optional(),
        expectedClosureDate: zod_1.z.string().datetime().optional().or(zod_1.z.coerce.date().optional().nullable()),
    }),
});
exports.listDealsSchema = zod_1.z.object({
    query: pagination.extend({
        clientId: zod_1.z.string().optional(),
        stage: dealStage.optional(),
    }),
});
// Activities
exports.createActivitySchema = zod_1.z.object({
    body: zod_1.z.object({
        leadId: zod_1.z.string().optional(),
        clientId: zod_1.z.string().optional(),
        type: activityType,
        notes: zod_1.z.string().optional(),
    }),
});
exports.listActivitiesSchema = zod_1.z.object({
    query: pagination.extend({
        leadId: zod_1.z.string().optional(),
        clientId: zod_1.z.string().optional(),
        createdBy: zod_1.z.string().optional(),
    }),
});
// Tasks
exports.createTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
        assignedTo: zod_1.z.string().min(1),
        dueDate: zod_1.z.string().datetime().optional().or(zod_1.z.coerce.date().optional()),
        status: taskStatus.optional(),
    }),
});
exports.updateTaskSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        assignedTo: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().datetime().optional().or(zod_1.z.coerce.date().optional().nullable()),
        status: taskStatus.optional(),
    }),
});
exports.listTasksSchema = zod_1.z.object({
    query: pagination.extend({
        assignedTo: zod_1.z.string().optional(),
        status: taskStatus.optional(),
    }),
});
// Audit
exports.listAuditSchema = zod_1.z.object({
    query: pagination.extend({
        userId: zod_1.z.string().optional(),
        entityType: zod_1.z.string().optional(),
        entityId: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=crm.validation.js.map