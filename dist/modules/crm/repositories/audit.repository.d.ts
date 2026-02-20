export declare const auditRepository: {
    findMany(filters: {
        userId?: string;
        entityType?: string;
        entityId?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: {
            id: string;
            userId: string;
            action: string;
            entityType: string;
            entityId: string | null;
            metadata: import("../../../../generated/prisma-client/runtime/library.js").JsonValue | null;
            timestamp: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
};
//# sourceMappingURL=audit.repository.d.ts.map