import type { DealStage } from "@prisma/client";
export interface CreateDealInput {
    clientId: string;
    value: number;
    stage?: DealStage;
    expectedClosureDate?: Date;
}
export interface UpdateDealInput {
    value?: number;
    stage?: DealStage;
    expectedClosureDate?: Date | null;
}
export declare const dealService: {
    create(input: CreateDealInput, userId: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
        clientId: string;
        stage: import("../../../../generated/prisma-client/index.js").$Enums.DealStage;
        expectedClosureDate: Date | null;
    }>;
    getById(id: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
        client: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            assignedTo: string | null;
            companyName: string;
            contactPerson: string;
            industry: string | null;
            convertedFromLeadId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
        clientId: string;
        stage: import("../../../../generated/prisma-client/index.js").$Enums.DealStage;
        expectedClosureDate: Date | null;
    }>;
    listByClient(clientId: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
        clientId: string;
        stage: import("../../../../generated/prisma-client/index.js").$Enums.DealStage;
        expectedClosureDate: Date | null;
    }[]>;
    list(filters: {
        clientId?: string;
        stage?: DealStage;
        page?: number;
        pageSize?: number;
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
        items: ({
            client: {
                id: string;
                companyName: string;
                contactPerson: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            value: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
            clientId: string;
            stage: import("../../../../generated/prisma-client/index.js").$Enums.DealStage;
            expectedClosureDate: Date | null;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    update(id: string, input: UpdateDealInput, userId: string, options: {
        assignedTo?: string;
        canViewAll: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
        clientId: string;
        stage: import("../../../../generated/prisma-client/index.js").$Enums.DealStage;
        expectedClosureDate: Date | null;
    }>;
};
//# sourceMappingURL=deal.service.d.ts.map