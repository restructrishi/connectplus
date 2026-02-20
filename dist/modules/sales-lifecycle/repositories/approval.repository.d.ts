import type { ApprovalStatus } from "@prisma/client";
export declare const approvalRepository: {
    create(data: {
        ovfId: string;
        opportunityId: string;
    }): Promise<{
        id: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.ApprovalStatus;
        deletedAt: Date | null;
        opportunityId: string;
        requestedAt: Date;
        decidedAt: Date | null;
        decidedBy: string | null;
        comments: string | null;
        ovfId: string;
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
        };
        ovf: {
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
        };
    } & {
        id: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.ApprovalStatus;
        deletedAt: Date | null;
        opportunityId: string;
        requestedAt: Date;
        decidedAt: Date | null;
        decidedBy: string | null;
        comments: string | null;
        ovfId: string;
    }) | null>;
    findByOvfId(ovfId: string): Promise<{
        id: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.ApprovalStatus;
        deletedAt: Date | null;
        opportunityId: string;
        requestedAt: Date;
        decidedAt: Date | null;
        decidedBy: string | null;
        comments: string | null;
        ovfId: string;
    }[]>;
    findPending(): Promise<({
        ovf: {
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
            };
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
            };
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
        };
    } & {
        id: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.ApprovalStatus;
        deletedAt: Date | null;
        opportunityId: string;
        requestedAt: Date;
        decidedAt: Date | null;
        decidedBy: string | null;
        comments: string | null;
        ovfId: string;
    })[]>;
    decide(id: string, data: {
        status: ApprovalStatus;
        decidedBy: string;
        comments?: string;
    }): Promise<{
        id: string;
        status: import("../../../../generated/prisma-client/index.js").$Enums.ApprovalStatus;
        deletedAt: Date | null;
        opportunityId: string;
        requestedAt: Date;
        decidedAt: Date | null;
        decidedBy: string | null;
        comments: string | null;
        ovfId: string;
    }>;
};
//# sourceMappingURL=approval.repository.d.ts.map