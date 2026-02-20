export declare const clientRepository: {
    create(data: {
        companyName: string;
        contactPerson: string;
        phone?: string;
        email: string;
        industry?: string;
        assignedTo?: string;
        convertedFromLeadId?: string;
    }): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        assignedTo: string | null;
        companyName: string;
        contactPerson: string;
        industry: string | null;
        convertedFromLeadId: string | null;
    }>;
    findById(id: string): Promise<({
        activities: {
            id: string;
            createdAt: Date;
            type: import("../../../../generated/prisma-client/index.js").$Enums.ActivityType;
            clientId: string | null;
            notes: string | null;
            createdBy: string;
            leadId: string | null;
        }[];
        deals: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            value: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
            clientId: string;
            stage: import("../../../../generated/prisma-client/index.js").$Enums.DealStage;
            expectedClosureDate: Date | null;
        }[];
    } & {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        assignedTo: string | null;
        companyName: string;
        contactPerson: string;
        industry: string | null;
        convertedFromLeadId: string | null;
    }) | null>;
    findMany(filters: {
        assignedTo?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            assignedTo: string | null;
            companyName: string;
            contactPerson: string;
            industry: string | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    update(id: string, data: Partial<{
        companyName: string;
        contactPerson: string;
        phone: string;
        email: string;
        industry: string;
        assignedTo: string;
    }>): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        assignedTo: string | null;
        companyName: string;
        contactPerson: string;
        industry: string | null;
        convertedFromLeadId: string | null;
    }>;
    findByConvertedLeadId(leadId: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        assignedTo: string | null;
        companyName: string;
        contactPerson: string;
        industry: string | null;
        convertedFromLeadId: string | null;
    } | null>;
};
//# sourceMappingURL=client.repository.d.ts.map