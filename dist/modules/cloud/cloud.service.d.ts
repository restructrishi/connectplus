import type { CloudStatus } from "@prisma/client";
export declare const cloudService: {
    list(userId: string, filters?: {
        status?: CloudStatus;
    }): Promise<({
        tl: {
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
        name: string;
        status: import("../../../generated/prisma-client/index.js").$Enums.CloudStatus;
        description: string | null;
        tlId: string;
        assessment: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
    })[]>;
    getById(id: string, userId: string): Promise<{
        tl: {
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
        name: string;
        status: import("../../../generated/prisma-client/index.js").$Enums.CloudStatus;
        description: string | null;
        tlId: string;
        assessment: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
    }>;
};
//# sourceMappingURL=cloud.service.d.ts.map