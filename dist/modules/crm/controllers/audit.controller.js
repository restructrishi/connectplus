"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAuditLogs = listAuditLogs;
const audit_repository_js_1 = require("../repositories/audit.repository.js");
async function listAuditLogs(req, res, next) {
    try {
        const { page, pageSize, userId, entityType, entityId } = req.query;
        const result = await audit_repository_js_1.auditRepository.findMany({
            page: page ? parseInt(page, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
            userId,
            entityType,
            entityId,
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
//# sourceMappingURL=audit.controller.js.map