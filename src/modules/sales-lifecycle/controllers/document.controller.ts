import type { Request, Response, NextFunction } from "express";
import type { CrmRole } from "@prisma/client";
import type { DocumentType } from "@prisma/client";
import path from "node:path";
import fs from "node:fs";
import { documentService } from "../services/document.service.js";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "lifecycle");

function user(req: Request) {
  const u = req.user!;
  return { userId: u.employeeId, userRole: u.role as CrmRole };
}

/** POST body: opportunityId, type, fileName, content (base64). Or filePath if file already on server. */
export async function uploadDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const { opportunityId, type, fileName, content, filePath: existingPath } = req.body as {
      opportunityId?: string;
      type?: DocumentType;
      fileName?: string;
      content?: string;
      filePath?: string;
    };
    if (!opportunityId || !type || !fileName) {
      res.status(400).json({ success: false, message: "opportunityId, type, fileName required" });
      return;
    }
    let filePath: string;
    if (existingPath && typeof existingPath === "string") {
      filePath = existingPath;
    } else if (content && typeof content === "string") {
      const buf = Buffer.from(content, "base64");
      const dir = path.join(UPLOAD_DIR, opportunityId);
      fs.mkdirSync(dir, { recursive: true });
      filePath = path.join(dir, `${type}_${Date.now()}_${path.basename(fileName)}`);
      fs.writeFileSync(filePath, buf);
    } else {
      res.status(400).json({ success: false, message: "content (base64) or filePath required" });
      return;
    }
    const data = await documentService.upload(
      opportunityId,
      type,
      filePath,
      fileName,
      user(req).userId,
      user(req).userRole
    );
    res.status(201).json({ success: true, data, message: "Document uploaded" });
  } catch (e) {
    next(e);
  }
}

export async function listDocuments(req: Request, res: Response, next: NextFunction) {
  try {
    const opportunityId = req.params.id;
    const type = req.query.type as DocumentType | undefined;
    const data = await documentService.listByOpportunity(opportunityId!, type);
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
