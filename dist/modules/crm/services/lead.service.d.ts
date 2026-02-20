import type { LeadStatus } from "@prisma/client";
export interface CreateLeadInput {
    name: string;
    phone?: string;
    email: string;
    company?: string;
    source?: string;
    status?: LeadStatus;
    assignedTo?: string;
}
export interface UpdateLeadInput {
    name?: string;
    phone?: string;
    email?: string;
    company?: string;
    source?: string;
    status?: LeadStatus;
    assignedTo?: string;
}
export declare const leadService: {
    create(input: CreateLeadInput, userId: string): Promise<{
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
    } & {
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
    }>;
    list(filters: {
        assignedTo?: string;
        status?: LeadStatus;
        page?: number;
        pageSize?: number;
        canViewAll: boolean;
    }): Promise<{
        items: {
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
        }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    update(id: string, input: UpdateLeadInput, userId: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
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
    }>;
    convertToClient(leadId: string, userId: string, options: {
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
//# sourceMappingURL=lead.service.d.ts.map