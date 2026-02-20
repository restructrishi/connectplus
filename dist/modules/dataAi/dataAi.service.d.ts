import type { ProjectStatus } from "@prisma/client";
export declare const dataAiService: {
    listProjects(userId: string, filters?: {
        status?: ProjectStatus;
    }): Promise<({
        _count: {
            tasks: number;
        };
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
        status: import("../../../generated/prisma-client/index.js").$Enums.ProjectStatus;
        description: string | null;
        tlId: string;
        teamMembers: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
    })[]>;
    getProjectById(id: string, userId: string): Promise<{
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
        tasks: ({
            assignedTo: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../../generated/prisma-client/index.js").$Enums.ProjectTaskStatus;
            title: string;
            description: string | null;
            dueDate: Date | null;
            projectId: string;
            assignedToId: string;
        })[];
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import("../../../generated/prisma-client/index.js").$Enums.ProjectStatus;
        description: string | null;
        tlId: string;
        teamMembers: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
    }>;
};
//# sourceMappingURL=dataAi.service.d.ts.map