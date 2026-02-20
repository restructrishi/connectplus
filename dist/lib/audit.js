"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
const prisma_js_1 = require("./prisma.js");
async function createAuditLog(params) {
    await prisma_js_1.prisma.auditLog.create({
        data: {
            userId: params.userId,
            action: params.action,
            entityType: params.entityType,
            entityId: params.entityId ?? null,
            metadata: (params.metadata ?? undefined),
        },
    });
}
//# sourceMappingURL=audit.js.map