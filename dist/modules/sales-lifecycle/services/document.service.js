"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentService = void 0;
const opportunity_repository_js_1 = require("../repositories/opportunity.repository.js");
const document_repository_js_1 = require("../repositories/document.repository.js");
const timeline_js_1 = require("../timeline.js");
const audit_js_1 = require("../../../lib/audit.js");
const errorHandler_js_1 = require("../../../middleware/errorHandler.js");
const constants_js_1 = require("../constants.js");
const ALLOWED_TYPES = ["BOQ", "SOW", "OEM_QUOTE", "QUOTE_SUPPORTING", "OVF_ATTACHMENT"];
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
function hasAllowedExtension(fileName) {
    const lower = fileName.toLowerCase();
    return ALLOWED_EXT.some((ext) => lower.endsWith(ext));
}
exports.documentService = {
    async upload(opportunityId, type, filePath, fileName, userId, userRole) {
        if (!ALLOWED_TYPES.includes(type))
            throw new errorHandler_js_1.AppError(400, "Invalid document type");
        if (!hasAllowedExtension(fileName))
            throw new errorHandler_js_1.AppError(400, "Only PDF, DOC, DOCX, XLS, XLSX allowed");
        if (!(0, constants_js_1.canPerform)(userRole, "upload_boq") && type === "BOQ")
            throw new errorHandler_js_1.AppError(403, "Not allowed to upload BOQ");
        if (!(0, constants_js_1.canPerform)(userRole, "upload_sow") && type === "SOW")
            throw new errorHandler_js_1.AppError(403, "Not allowed to upload SOW");
        if (!(0, constants_js_1.canPerform)(userRole, "upload_oem_quote") && type === "OEM_QUOTE")
            throw new errorHandler_js_1.AppError(403, "Not allowed to upload OEM quote");
        const opp = await opportunity_repository_js_1.opportunityRepository.findById(opportunityId);
        if (!opp)
            throw new errorHandler_js_1.AppError(404, "Opportunity not found");
        if (opp.isLocked)
            throw new errorHandler_js_1.AppError(400, "Opportunity is locked");
        const version = await document_repository_js_1.documentRepository.getNextVersion(opportunityId, type);
        const doc = await document_repository_js_1.documentRepository.create({
            opportunityId,
            type,
            filePath,
            fileName,
            version,
            uploadedBy: userId,
        });
        await (0, timeline_js_1.addTimelineEvent)({
            opportunityId,
            action: "document_uploaded",
            userId,
            metadata: { type, fileName, version },
        });
        await (0, audit_js_1.createAuditLog)({
            userId,
            action: "sales_lifecycle.document.upload",
            entityType: "Document",
            entityId: doc.id,
            metadata: { type, fileName },
        });
        return doc;
    },
    async listByOpportunity(opportunityId, type) {
        return document_repository_js_1.documentRepository.findManyByOpportunity(opportunityId, type);
    },
};
//# sourceMappingURL=document.service.js.map