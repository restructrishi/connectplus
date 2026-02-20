import type { DocumentType } from "@prisma/client";
import { opportunityRepository } from "../repositories/opportunity.repository.js";
import { documentRepository } from "../repositories/document.repository.js";
import { addTimelineEvent } from "../timeline.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { canPerform } from "../constants.js";
import type { CrmRole } from "@prisma/client";

const ALLOWED_TYPES: DocumentType[] = ["BOQ", "SOW", "OEM_QUOTE", "QUOTE_SUPPORTING", "OVF_ATTACHMENT"];
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];

function hasAllowedExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return ALLOWED_EXT.some((ext) => lower.endsWith(ext));
}

export const documentService = {
  async upload(
    opportunityId: string,
    type: DocumentType,
    filePath: string,
    fileName: string,
    userId: string,
    userRole: CrmRole
  ) {
    if (!ALLOWED_TYPES.includes(type)) throw new AppError(400, "Invalid document type");
    if (!hasAllowedExtension(fileName)) throw new AppError(400, "Only PDF, DOC, DOCX, XLS, XLSX allowed");
    if (!canPerform(userRole, "upload_boq") && type === "BOQ") throw new AppError(403, "Not allowed to upload BOQ");
    if (!canPerform(userRole, "upload_sow") && type === "SOW") throw new AppError(403, "Not allowed to upload SOW");
    if (!canPerform(userRole, "upload_oem_quote") && type === "OEM_QUOTE") throw new AppError(403, "Not allowed to upload OEM quote");
    const opp = await opportunityRepository.findById(opportunityId);
    if (!opp) throw new AppError(404, "Opportunity not found");
    if (opp.isLocked) throw new AppError(400, "Opportunity is locked");
    const version = await documentRepository.getNextVersion(opportunityId, type);
    const doc = await documentRepository.create({
      opportunityId,
      type,
      filePath,
      fileName,
      version,
      uploadedBy: userId,
    });
    await addTimelineEvent({
      opportunityId,
      action: "document_uploaded",
      userId,
      metadata: { type, fileName, version },
    });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.document.upload",
      entityType: "Document",
      entityId: doc.id,
      metadata: { type, fileName },
    });
    return doc;
  },

  async listByOpportunity(opportunityId: string, type?: DocumentType) {
    return documentRepository.findManyByOpportunity(opportunityId, type);
  },
};
