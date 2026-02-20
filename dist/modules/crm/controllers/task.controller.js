"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.getTask = getTask;
exports.listTasks = listTasks;
exports.updateTask = updateTask;
const task_service_js_1 = require("../services/task.service.js");
const auth_js_1 = require("../../../middleware/auth.js");
function options(req) {
    return { assignedTo: req.user.employeeId, canViewAll: (0, auth_js_1.canViewAllLeads)(req) };
}
async function createTask(req, res, next) {
    try {
        const body = req.body;
        const task = await task_service_js_1.taskService.create({
            title: body.title,
            description: body.description,
            assignedTo: body.assignedTo,
            dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
            status: body.status,
        }, req.user.sub);
        res.status(201).json({ success: true, data: task, message: "Task created" });
    }
    catch (e) {
        next(e);
    }
}
async function getTask(req, res, next) {
    try {
        const task = await task_service_js_1.taskService.getById(req.params.id, options(req));
        res.status(200).json({ success: true, data: task });
    }
    catch (e) {
        next(e);
    }
}
async function listTasks(req, res, next) {
    try {
        const { page, pageSize, assignedTo, status } = req.query;
        const result = await task_service_js_1.taskService.list({
            ...options(req),
            page: page ? parseInt(page, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
            assignedTo,
            status: status,
        });
        res.status(200).json({
            success: true,
            data: {
                items: result.items,
                total: result.total,
                page: result.page,
                pageSize: result.pageSize,
                totalPages: result.totalPages,
            },
        });
    }
    catch (e) {
        next(e);
    }
}
async function updateTask(req, res, next) {
    try {
        const body = req.body;
        const task = await task_service_js_1.taskService.update(req.params.id, {
            title: body.title,
            description: body.description,
            assignedTo: body.assignedTo,
            dueDate: body.dueDate != null ? new Date(body.dueDate) : undefined,
            status: body.status,
        }, req.user.sub, options(req));
        res.status(200).json({ success: true, data: task, message: "Task updated" });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=task.controller.js.map