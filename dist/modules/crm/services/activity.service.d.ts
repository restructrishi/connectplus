import type { ActivityType } from "@prisma/client";
export interface CreateActivityInput {
    leadId?: string;
    clientId?: string;
    type: ActivityType;
    notes?: string;
}
export declare const activityService: {
    create(input: CreateActivityInput, userId: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        type: import("../../../../generated/prisma-client/index.js").$Enums.ActivityType;
        clientId: string | null;
        notes: string | null;
        createdBy: string;
        leadId: string | null;
    }>;
    getById(id: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
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
    }>;
    list(filters: {
        leadId?: string;
        clientId?: string;
        createdBy?: string;
        page?: number;
        pageSize?: number;
        assignedTo?: string;
        canViewAll: boolean;
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
//# sourceMappingURL=activity.service.d.ts.map