import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/index.js";
import type { CrmRole } from "@prisma/client";
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): void;
export declare function requireRole(...allowedRoles: CrmRole[]): (req: Request, _res: Response, next: NextFunction) => void;
/** Sales Manager and above can view all leads; Sales Executive sees only assigned. */
export declare function canViewAllLeads(req: Request): boolean;
//# sourceMappingURL=auth.d.ts.map