import type { OpportunityStage } from "@prisma/client";
import type { CrmRole } from "@prisma/client";
export declare const opportunityService: {
    create(data: {
        name: string;
        companyId: string;
        leadId?: string;
        estimatedValue?: number;
        assignedSalesPerson: string;
        probability?: number;
        expectedClosureDate?: Date;
    }, userId: string, userRole: CrmRole): Promise<{
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
    }>;
    getById(id: string): Promise<{
        lead: {
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
        } | null;
        quote: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            deletedAt: Date | null;
            opportunityId: string;
            amount: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
            marginPercent: import("../../../../generated/prisma-client/runtime/library.js").Decimal | null;
            marginAmount: import("../../../../generated/prisma-client/runtime/library.js").Decimal | null;
            details: import("../../../../generated/prisma-client/runtime/library.js").JsonValue | null;
            lockedAt: Date | null;
        } | null;
        company: {
            id: string;
            createdAt: Date;
            name: string;
            status: import("../../../../generated/prisma-client/index.js").$Enums.CompanyStatus;
            createdBy: string;
            deletedAt: Date | null;
        };
        documents: {
            id: string;
            type: import("../../../../generated/prisma-client/index.js").$Enums.DocumentType;
            deletedAt: Date | null;
            uploadedAt: Date;
            opportunityId: string;
            filePath: string;
            fileName: string;
            version: number;
            uploadedBy: string;
        }[];
        ovf: ({
            approvals: {
                id: string;
                status: import("../../../../generated/prisma-client/index.js").$Enums.ApprovalStatus;
                deletedAt: Date | null;
                opportunityId: string;
                requestedAt: Date;
                decidedAt: Date | null;
                decidedBy: string | null;
                comments: string | null;
                ovfId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            status: import("../../../../generated/prisma-client/index.js").$Enums.OVFStatus;
            createdBy: string;
            deletedAt: Date | null;
            opportunityId: string;
            marginPercent: import("../../../../generated/prisma-client/runtime/library.js").Decimal | null;
            quoteId: string;
            dealName: string;
            finalAmount: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
            paymentTerms: string | null;
            sentForApprovalAt: Date | null;
        }) | null;
        scmHandoff: {
            id: string;
            status: string;
            deletedAt: Date | null;
            opportunityId: string;
            ovfId: string;
            handedOffAt: Date;
            handedOffBy: string;
        } | null;
        timeline: {
            id: string;
            createdAt: Date;
            userId: string;
            action: string;
            metadata: import("../../../../generated/prisma-client/runtime/library.js").JsonValue | null;
            opportunityId: string;
            stageFrom: string | null;
            stageTo: string | null;
            comment: string | null;
        }[];
    } & {
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
    }>;
    list(filters: {
        companyId?: string;
        stage?: OpportunityStage;
        assignedSalesPerson?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: ({
            quote: {
                id: string;
                amount: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
                lockedAt: Date | null;
            } | null;
            company: {
                id: string;
                name: string;
            };
            ovf: {
                id: string;
                status: import("../../../../generated/prisma-client/index.js").$Enums.OVFStatus;
            } | null;
        } & {
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
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    transitionStage(id: string, toStage: OpportunityStage, userId: string, userRole: CrmRole, options?: {
        reason?: string;
        lostReason?: string;
    }): Promise<{
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
    }>;
    updateOemFields(id: string, data: {
        drNumber?: string;
        drNumberNa?: boolean;
        oemQuotationReceived?: boolean;
    }, userId: string, userRole: CrmRole): Promise<{
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
    }>;
    getTimeline(opportunityId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        action: string;
        metadata: import("../../../../generated/prisma-client/runtime/library.js").JsonValue | null;
        opportunityId: string;
        stageFrom: string | null;
        stageTo: string | null;
        comment: string | null;
    }[]>;
};
//# sourceMappingURL=opportunity.service.d.ts.map