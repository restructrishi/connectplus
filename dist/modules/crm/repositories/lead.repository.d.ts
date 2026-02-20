import type { LeadStatus } from "@prisma/client";
export declare const leadRepository: {
    create(data: {
        name: string;
        phone?: string;
        email: string;
        company?: string;
        source?: string;
        status?: LeadStatus;
        assignedTo?: string;
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
    }) | null>;
    findMany(filters: {
        assignedTo?: string;
        status?: LeadStatus;
        page?: number;
        pageSize?: number;
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
    update(id: string, data: Partial<{
        name: string;
        phone: string;
        email: string;
        company: string;
        source: string;
        status: LeadStatus;
        assignedTo: string;
    }>): Promise<{
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
    countByStatus(): Promise<(import("../../../../generated/prisma-client/index.js").Prisma.PickEnumerable<import("../../../../generated/prisma-client/index.js").Prisma.LeadGroupByOutputType, "status"[]> & {
        _count: {
            id: number;
        };
    })[]>;
    countByAssigned(assignedTo: string): Promise<number>;
};
//# sourceMappingURL=lead.repository.d.ts.map