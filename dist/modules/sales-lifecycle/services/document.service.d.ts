import type { DocumentType } from "@prisma/client";
import type { CrmRole } from "@prisma/client";
export declare const documentService: {
    upload(opportunityId: string, type: DocumentType, filePath: string, fileName: string, userId: string, userRole: CrmRole): Promise<{
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
    listByOpportunity(opportunityId: string, type?: DocumentType): Promise<{
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
};
//# sourceMappingURL=document.service.d.ts.map