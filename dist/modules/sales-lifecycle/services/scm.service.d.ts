import type { CrmRole } from "@prisma/client";
export declare const scmService: {
    handoff(opportunityId: string, userId: string, userRole: CrmRole): Promise<{
        id: string;
        status: string;
        deletedAt: Date | null;
        opportunityId: string;
        ovfId: string;
        handedOffAt: Date;
        handedOffBy: string;
    }>;
    list(filters: {
        page?: number;
        pageSize?: number;
    }, userRole: CrmRole): Promise<{
        items: ({
            opportunity: {
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
        } & {
            id: string;
            status: string;
            deletedAt: Date | null;
            opportunityId: string;
            ovfId: string;
            handedOffAt: Date;
            handedOffBy: string;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
};
//# sourceMappingURL=scm.service.d.ts.map