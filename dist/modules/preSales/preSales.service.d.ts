export declare const preSalesService: {
    list(userId: string, filters?: {
        dealId?: string;
    }): Promise<({
        deal: {
            id: string;
            stage: import("../../../generated/prisma-client/index.js").$Enums.CrmDealStage;
            dealName: string;
            dealValue: number;
        };
        createdBy: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        dealId: string;
        createdById: string;
        handoverDate: Date;
        handoverNotes: string | null;
        requirementAnalysis: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        solutionDesign: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        boq: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        proposalGenerated: boolean;
    })[]>;
    getById(id: string, userId: string): Promise<{
        deal: {
            id: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            stage: import("../../../generated/prisma-client/index.js").$Enums.CrmDealStage;
            probability: number | null;
            lostReason: string | null;
            documents: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            dealName: string;
            contactId: string;
            dealValue: number;
            subStage: string | null;
            ownerId: string;
            scmPersonId: string | null;
            preSalesPersonId: string | null;
            expectedCloseDate: Date | null;
            actualCloseDate: Date | null;
            isWon: boolean;
            isLost: boolean;
        };
        createdBy: {
            id: string;
            employeeId: string;
            email: string;
            passwordHash: string;
            role: import("../../../generated/prisma-client/index.js").$Enums.CrmRole;
            isActive: boolean;
            organizationId: string | null;
            firstName: string | null;
            lastName: string | null;
            department: import("../../../generated/prisma-client/index.js").$Enums.UserDepartment | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        dealId: string;
        createdById: string;
        handoverDate: Date;
        handoverNotes: string | null;
        requirementAnalysis: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        solutionDesign: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        boq: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        proposalGenerated: boolean;
    }>;
};
//# sourceMappingURL=preSales.service.d.ts.map