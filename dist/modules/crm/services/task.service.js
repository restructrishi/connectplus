"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const task_repository_js_1 = require("../repositories/task.repository.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const VALID_STATUSES = ["PENDING", "COMPLETED"];
exports.taskService = {
    async create(input, userId) {
        if (input.status && !VALID_STATUSES.includes(input.status)) {
            throw new errorHandler_js_1.AppError(400, "Invalid task status");
        }
        const task = await task_repository_js_1.taskRepository.create({
            title: input.title,
            description: input.description,
            assignedTo: input.assignedTo,
            dueDate: input.dueDate,
            status: input.status ?? "PENDING",
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "task.create",
            entityType: "Task",
            entityId: task.id,
            metadata: { assignedTo: input.assignedTo },
        });
        return task;
    },
    async getById(id, options) {
        const task = await task_repository_js_1.taskRepository.findById(id);
        if (!task)
            throw new errorHandler_js_1.AppError(404, "Task not found");
        if (!options.canViewAll && task.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this task");
        }
        return task;
    },
    async list(filters) {
        const assignedTo = filters.canViewAll ? undefined : filters.assignedTo;
        return task_repository_js_1.taskRepository.findMany({
            assignedTo: assignedTo ?? undefined,
            status: filters.status,
            page: filters.page,
            pageSize: filters.pageSize,
        });
    },
    async update(id, input, userId, options) {
        const existing = await task_repository_js_1.taskRepository.findById(id);
        if (!existing)
            throw new errorHandler_js_1.AppError(404, "Task not found");
        if (!options.canViewAll && existing.assignedTo !== options.assignedTo) {
            throw new errorHandler_js_1.AppError(403, "Access denied to this task");
        }
        if (input.status && !VALID_STATUSES.includes(input.status)) {
            throw new errorHandler_js_1.AppError(400, "Invalid task status");
        }
        const updated = await task_repository_js_1.taskRepository.update(id, {
            title: input.title,
            description: input.description,
            assignedTo: input.assignedTo,
            dueDate: input.dueDate,
            status: input.status,
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "task.update",
            entityType: "Task",
            entityId: id,
        });
        return updated;
    },
};
//# sourceMappingURL=task.service.js.map