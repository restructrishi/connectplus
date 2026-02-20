"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = uploadDocument;
exports.listDocuments = listDocuments;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const document_service_js_1 = require("../services/document.service.js");
const UPLOAD_DIR = node_path_1.default.join(process.cwd(), "uploads", "lifecycle");
function user(req) {
    const u = req.user;
    return { userId: u.employeeId, userRole: u.role };
}
/** POST body: opportunityId, type, fileName, content (base64). Or filePath if file already on server. */
async function uploadDocument(req, res, next) {
    try {
        const { opportunityId, type, fileName, content, filePath: existingPath } = req.body;
        if (!opportunityId || !type || !fileName) {
            res.status(400).json({ success: false, message: "opportunityId, type, fileName required" });
            return;
        }
        let filePath;
        if (existingPath && typeof existingPath === "string") {
            filePath = existingPath;
        }
        else if (content && typeof content === "string") {
            const buf = Buffer.from(content, "base64");
            const dir = node_path_1.default.join(UPLOAD_DIR, opportunityId);
            node_fs_1.default.mkdirSync(dir, { recursive: true });
            filePath = node_path_1.default.join(dir, `${type}_${Date.now()}_${node_path_1.default.basename(fileName)}`);
            node_fs_1.default.writeFileSync(filePath, buf);
        }
        else {
            res.status(400).json({ success: false, message: "content (base64) or filePath required" });
            return;
        }
        const data = await document_service_js_1.documentService.upload(opportunityId, type, filePath, fileName, user(req).userId, user(req).userRole);
        res.status(201).json({ success: true, data, message: "Document uploaded" });
    }
    catch (e) {
        next(e);
    }
}
async function listDocuments(req, res, next) {
    try {
        const opportunityId = req.params.id;
        const type = req.query.type;
        const data = await document_service_js_1.documentService.listByOpportunity(opportunityId, type);
        res.status(200).json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=document.controller.js.map