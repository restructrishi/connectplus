import type { CrmRole } from "@prisma/client";
export declare const authRepository: {
    findByEmail(email: string): Promise<{
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
    } | null>;
    findById(id: string): Promise<{
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
    } | null>;
    create(data: {
        employeeId: string;
        email: string;
        passwordHash: string;
        role?: CrmRole;
    }): Promise<{
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
    }>;
    updatePassword(id: string, passwordHash: string): Promise<{
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
    }>;
};
//# sourceMappingURL=auth.repository.d.ts.map