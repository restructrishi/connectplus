export interface CreateClientInput {
    companyName: string;
    contactPerson: string;
    phone?: string;
    email: string;
    industry?: string;
    assignedTo?: string;
}
export interface UpdateClientInput {
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    industry?: string;
    assignedTo?: string;
}
export declare const clientService: {
    create(input: CreateClientInput, userId: string): Promise<{
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
    getById(id: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
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
    }>;
    list(filters: {
        assignedTo?: string;
        page?: number;
        pageSize?: number;
        canViewAll: boolean;
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
    update(id: string, input: UpdateClientInput, userId: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
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
};
//# sourceMappingURL=client.service.d.ts.map