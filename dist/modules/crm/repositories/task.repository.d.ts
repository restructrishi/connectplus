import type { TaskStatus } from "@prisma/client";
export declare const taskRepository: {
    create(data: {
        title: string;
        description?: string;
        assignedTo: string;
        dueDate?: Date;
        status?: TaskStatus;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: import("../../../../generated/prisma-client/index.js").$Enums.TaskStatus;
        assignedTo: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
    }>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("../../../../generated/prisma-client/index.js").$Enums.TaskStatus;
        assignedTo: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
    } | null>;
    findMany(filters: {
        assignedTo?: string;
        status?: TaskStatus;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: {
            id: string;
            createdAt: Date;
            status: import("../../../../generated/prisma-client/index.js").$Enums.TaskStatus;
            assignedTo: string;
            title: string;
            description: string | null;
            dueDate: Date | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    update(id: string, data: Partial<{
        title: string;
        description: string;
        assignedTo: string;
        dueDate: Date | null;
        status: TaskStatus;
    }>): Promise<{
        id: string;
        createdAt: Date;
        status: import("../../../../generated/prisma-client/index.js").$Enums.TaskStatus;
        assignedTo: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
    }>;
};
//# sourceMappingURL=task.repository.d.ts.map