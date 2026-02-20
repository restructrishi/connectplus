import type { LeadLifecycleStatus } from "@prisma/client";
export declare const leadRepository: {
    create(data: {
        name: string;
        companyId: string;
        contactInfo?: string;
        createdBy: string;
        assignedTo?: string;
    }): Promise<{
        id: string;
        name: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.LeadLifecycleStatus;
        assignedTo: string | null;
        createdBy: string;
        deletedAt: Date | null;
        companyId: string;
        contactInfo: string | null;
        convertedAt: Date | null;
        convertedBy: string | null;
        convertedReason: string | null;
        deadAt: Date | null;
        deadBy: string | null;
        deadReason: string | null;
    }>;
    findById(id: string): Promise<({
        opportunity: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            stage: import("../../../../generated/prisma-client/index.js").$Enums.OpportunityStage;
            expectedClosureDate: Date | null;
            leadId: string | null;
            deletedAt: Date | null;
            companyId: string;
            isLocked: boolean;
            estimatedValue: import("../../../../generated/prisma-client/runtime/library.js").Decimal | null;
            assignedSalesPerson: string;
            probability: number | null;
            drNumber: string | null;
            drNumberNa: boolean;
            oemQuotationReceived: boolean | null;
            lostAt: Date | null;
            lostBy: string | null;
            lostReason: string | null;
            lostStage: string | null;
        } | null;
        company: {
            id: string;
            createdAt: Date;
            name: string;
            status: import("../../../../generated/prisma-client/index.js").$Enums.CompanyStatus;
            createdBy: string;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        name: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.LeadLifecycleStatus;
        assignedTo: string | null;
        createdBy: string;
        deletedAt: Date | null;
        companyId: string;
        contactInfo: string | null;
        convertedAt: Date | null;
        convertedBy: string | null;
        convertedReason: string | null;
        deadAt: Date | null;
        deadBy: string | null;
        deadReason: string | null;
    }) | null>;
    findMany(filters: {
        companyId?: string;
        status?: LeadLifecycleStatus;
        assignedTo?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: ({
            company: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            name: string;
            status: import("../../../../generated/prisma-client/index.js").$Enums.LeadLifecycleStatus;
            assignedTo: string | null;
            createdBy: string;
            deletedAt: Date | null;
            companyId: string;
            contactInfo: string | null;
            convertedAt: Date | null;
            convertedBy: string | null;
            convertedReason: string | null;
            deadAt: Date | null;
            deadBy: string | null;
            deadReason: string | null;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    convert(id: string, data: {
        convertedBy: string;
        convertedReason: string;
    }): Promise<{
        id: string;
        name: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.LeadLifecycleStatus;
        assignedTo: string | null;
        createdBy: string;
        deletedAt: Date | null;
        companyId: string;
        contactInfo: string | null;
        convertedAt: Date | null;
        convertedBy: string | null;
        convertedReason: string | null;
        deadAt: Date | null;
        deadBy: string | null;
        deadReason: string | null;
    }>;
    markDead(id: string, data: {
        deadBy: string;
        deadReason: string;
    }): Promise<{
        id: string;
        name: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.LeadLifecycleStatus;
        assignedTo: string | null;
        createdBy: string;
        deletedAt: Date | null;
        companyId: string;
        contactInfo: string | null;
        convertedAt: Date | null;
        convertedBy: string | null;
        convertedReason: string | null;
        deadAt: Date | null;
        deadBy: string | null;
        deadReason: string | null;
    }>;
    softDelete(id: string): Promise<{
        id: string;
        name: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.LeadLifecycleStatus;
        assignedTo: string | null;
        createdBy: string;
        deletedAt: Date | null;
        companyId: string;
        contactInfo: string | null;
        convertedAt: Date | null;
        convertedBy: string | null;
        convertedReason: string | null;
        deadAt: Date | null;
        deadBy: string | null;
        deadReason: string | null;
    }>;
};
//# sourceMappingURL=lead.repository.d.ts.map