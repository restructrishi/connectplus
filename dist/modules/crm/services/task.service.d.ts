import type { TaskStatus } from "@prisma/client";
export interface CreateTaskInput {
    title: string;
    description?: string;
    assignedTo: string;
    dueDate?: Date;
    status?: TaskStatus;
}
export interface UpdateTaskInput {
    title?: string;
    description?: string;
    assignedTo?: string;
    dueDate?: Date | null;
    status?: TaskStatus;
}
export declare const taskService: {
    create(input: CreateTaskInput, userId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("../../../../generated/prisma-client/index.js").$Enums.TaskStatus;
        assignedTo: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
    }>;
    getById(id: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: import("../../../../generated/prisma-client/index.js").$Enums.TaskStatus;
        assignedTo: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
    }>;
    list(filters: {
        assignedTo?: string;
        status?: TaskStatus;
        page?: number;
        pageSize?: number;
        canViewAll: boolean;
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
    update(id: string, input: UpdateTaskInput, userId: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: import("../../../../generated/prisma-client/index.js").$Enums.TaskStatus;
        assignedTo: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
    }>;
};
//# sourceMappingURL=task.service.d.ts.map