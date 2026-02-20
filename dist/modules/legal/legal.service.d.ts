import type { PolicyStatus } from "@prisma/client";
export declare const legalService: {
    listAgreements(userId: string, filters?: {
        dealId?: string;
    }): Promise<({
        deal: {
            id: string;
            dealName: string;
        } | null;
        createdBy: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        contact: {
            id: string;
            firstName: string;
            lastName: string;
            companyName: string;
        } | null;
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        dealId: string | null;
        createdById: string;
        contactId: string | null;
        agreementNumber: string;
        agreementType: import("../../../generated/prisma-client/index.js").$Enums.AgreementType;
        sentToClient: boolean;
        signed: boolean;
    })[]>;
    getAgreementById(id: string, userId: string): Promise<{
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
        } | null;
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
        contact: {
            id: string;
            email: string;
            isActive: boolean;
            organizationId: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            companyName: string;
            designation: string | null;
            ownerId: string | null;
            mobile: string | null;
            website: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            pincode: string | null;
            contactType: string;
            leadSource: string | null;
            lastContactedAt: Date | null;
            customFields: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        } | null;
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        dealId: string | null;
        createdById: string;
        contactId: string | null;
        agreementNumber: string;
        agreementType: import("../../../generated/prisma-client/index.js").$Enums.AgreementType;
        sentToClient: boolean;
        signed: boolean;
    }>;
    listPolicies(userId: string, filters?: {
        status?: PolicyStatus;
    }): Promise<({
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
        status: import("../../../generated/prisma-client/index.js").$Enums.PolicyStatus;
        title: string;
        createdById: string;
        policyNumber: string;
    })[]>;
    getPolicyById(id: string, userId: string): Promise<{
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
        status: import("../../../generated/prisma-client/index.js").$Enums.PolicyStatus;
        title: string;
        createdById: string;
        policyNumber: string;
    }>;
};
//# sourceMappingURL=legal.service.d.ts.map