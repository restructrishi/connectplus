"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRepository = void 0;
const prisma_js_1 = require("../../../lib/prisma.js");
const DEFAULT_PAGE_SIZE = 50;
exports.auditRepository = {
    async findMany(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.entityType)
            where.entityType = filters.entityType;
        if (filters.entityId)
            where.entityId = filters.entityId;
        const [items, total] = await Promise.all([
            prisma_js_1.prisma.auditLog.findMany({
                where,
                orderBy: { timestamp: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma_js_1.prisma.auditLog.count({ where }),
        ]);
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
};
//# sourceMappingURL=audit.repository.js.map