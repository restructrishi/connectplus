import { prisma } from "../../../lib/prisma.js";
import type { DocumentType } from "@prisma/client";

export const documentRepository = {
  async create(data: {
    opportunityId: string;
    type: DocumentType;
    filePath: string;
    fileName: string;
    version: number;
    uploadedBy: string;
  }) {
    return prisma.document.create({ data });
  },

  async findById(id: string) {
    return prisma.document.findFirst({
      where: { id, deletedAt: null },
    });
  },

  async findManyByOpportunity(opportunityId: string, type?: DocumentType) {
    return prisma.document.findMany({
      where: { opportunityId, deletedAt: null, ...(type && { type }) },
      orderBy: [{ type: "asc" }, { version: "desc" }],
    });
  },

  async getNextVersion(opportunityId: string, type: DocumentType): Promise<number> {
    const last = await prisma.document.findFirst({
      where: { opportunityId, deletedAt: null, type },
      orderBy: { version: "desc" },
      select: { version: true },
    });
    return (last?.version ?? 0) + 1;
  },
};
