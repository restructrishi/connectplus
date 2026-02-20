import type { DocumentType } from "@prisma/client";
export declare const documentRepository: {
    create(data: {
        opportunityId: string;
        type: DocumentType;
        filePath: string;
        fileName: string;
        version: number;
        uploadedBy: string;
    }): Promise<{
        id: string;
        type: import("../../../../generated/prisma-client/index.js").$Enums.DocumentType;
        deletedAt: Date | null;
        uploadedAt: Date;
        opportunityId: string;
        filePath: string;
        fileName: string;
        version: number;
        uploadedBy: string;
    }>;
    findById(id: string): Promise<{
        id: string;
        type: import("../../../../generated/prisma-client/index.js").$Enums.DocumentType;
        deletedAt: Date | null;
        uploadedAt: Date;
        opportunityId: string;
        filePath: string;
        fileName: string;
        version: number;
        uploadedBy: string;
    } | null>;
    findManyByOpportunity(opportunityId: string, type?: DocumentType): Promise<{
        id: string;
        type: import("../../../../generated/prisma-client/index.js").$Enums.DocumentType;
        deletedAt: Date | null;
        uploadedAt: Date;
        opportunityId: string;
        filePath: string;
        fileName: string;
        version: number;
        uploadedBy: string;
    }[]>;
    getNextVersion(opportunityId: string, type: DocumentType): Promise<number>;
};
//# sourceMappingURL=document.repository.d.ts.map