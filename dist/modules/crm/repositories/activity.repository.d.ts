import type { ActivityType } from "@prisma/client";
export declare const activityRepository: {
    create(data: {
        leadId?: string;
        clientId?: string;
        type: ActivityType;
        notes?: string;
        createdBy: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        type: import("../../../../generated/prisma-client/index.js").$Enums.ActivityType;
        clientId: string | null;
        notes: string | null;
        createdBy: string;
        leadId: string | null;
    }>;
    findById(id: string): Promise<({
        client: {
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
        } | null;
        lead: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import("../../../../generated/prisma-client/index.js").$Enums.LeadStatus;
            phone: string | null;
            company: string | null;
            source: string | null;
            assignedTo: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        type: import("../../../../generated/prisma-client/index.js").$Enums.ActivityType;
        clientId: string | null;
        notes: string | null;
        createdBy: string;
        leadId: string | null;
    }) | null>;
    findMany(filters: {
        leadId?: string;
        clientId?: string;
        createdBy?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: {
            id: string;
            createdAt: Date;
            type: import("../../../../generated/prisma-client/index.js").$Enums.ActivityType;
            clientId: string | null;
            notes: string | null;
            createdBy: string;
            leadId: string | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
};
//# sourceMappingURL=activity.repository.d.ts.map