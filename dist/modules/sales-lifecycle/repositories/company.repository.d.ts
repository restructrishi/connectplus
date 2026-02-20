import type { CompanyStatus } from "@prisma/client";
export declare const companyRepository: {
    create(data: {
        name: string;
        createdBy: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.CompanyStatus;
        createdBy: string;
        deletedAt: Date | null;
    }>;
    findById(id: string): Promise<({
        leads: {
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
        }[];
        opportunities: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.CompanyStatus;
        createdBy: string;
        deletedAt: Date | null;
    }) | null>;
    findMany(filters: {
        status?: CompanyStatus;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: {
            id: string;
            createdAt: Date;
            name: string;
            status: import("../../../../generated/prisma-client/index.js").$Enums.CompanyStatus;
            createdBy: string;
            deletedAt: Date | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    updateStatus(id: string, status: CompanyStatus): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.CompanyStatus;
        createdBy: string;
        deletedAt: Date | null;
    }>;
    softDelete(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.CompanyStatus;
        createdBy: string;
        deletedAt: Date | null;
    }>;
    hasActiveOpportunity(companyId: string): Promise<boolean>;
};
//# sourceMappingURL=company.repository.d.ts.map