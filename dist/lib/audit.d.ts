export declare function createAuditLog(params: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
}): Promise<void>;
//# sourceMappingURL=audit.d.ts.map