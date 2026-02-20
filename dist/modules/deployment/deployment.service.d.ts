import type { DeploymentStatus } from "@prisma/client";
export declare const deploymentService: {
    list(userId: string, filters?: {
        status?: DeploymentStatus;
        dealId?: string;
    }): Promise<({
        deal: {
            id: string;
            stage: import("../../../generated/prisma-client/index.js").$Enums.CrmDealStage;
            dealName: string;
        };
        contact: {
            id: string;
            firstName: string;
            lastName: string;
            companyName: string;
        };
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma-client/index.js").$Enums.DeploymentStatus;
        dealId: string;
        contactId: string;
        kickOffMeeting: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        siteSurvey: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        projectManagerId: string | null;
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
        };
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma-client/index.js").$Enums.DeploymentStatus;
        dealId: string;
        contactId: string;
        kickOffMeeting: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        siteSurvey: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        projectManagerId: string | null;
    }>;
};
//# sourceMappingURL=deployment.service.d.ts.map