import type { Request, Response, NextFunction } from "express";
/** POST body: opportunityId, type, fileName, content (base64). Or filePath if file already on server. */
export declare function uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listDocuments(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=document.controller.d.ts.map