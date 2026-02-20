import type { DealStage } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
export declare const dealRepository: {
    create(data: {
        clientId: string;
        value: number | Decimal;
        stage?: DealStage;
        expectedClosureDate?: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
        clientId: string;
        stage: import("../../../../generated/prisma-client/index.js").$Enums.DealStage;
        expectedClosureDate: Date | null;
    }>;
    findById(id: string): Promise<({
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
    }) | null>;
    findManyByClientId(clientId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
        clientId: string;
        stage: import("../../../../generated/prisma-client/index.js").$Enums.DealStage;
        expectedClosureDate: Date | null;
    }[]>;
    findMany(filters: {
        clientId?: string;
        stage?: DealStage;
        page?: number;
        pageSize?: number;
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
    update(id: string, data: Partial<{
        value: number | Decimal;
        stage: DealStage;
        expectedClosureDate: Date | null;
    }>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: import("../../../../generated/prisma-client/runtime/library.js").Decimal;
        clientId: string;
        stage: import("../../../../generated/prisma-client/index.js").$Enums.DealStage;
        expectedClosureDate: Date | null;
    }>;
    sumWonByMonth(year: number, month: number): Promise<number>;
    countByStage(): Promise<(import("../../../../generated/prisma-client/index.js").Prisma.PickEnumerable<import("../../../../generated/prisma-client/index.js").Prisma.DealGroupByOutputType, "stage"[]> & {
        _count: {
            id: number;
        };
        _sum: {
            value: import("../../../../generated/prisma-client/runtime/library.js").Decimal | null;
        };
    })[]>;
};
//# sourceMappingURL=deal.repository.d.ts.map