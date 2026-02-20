import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { AppError } from "./errorHandler.js";
import type { JwtPayload } from "../types/index.js";
import type { CrmRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required"));
    return;
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

const roleHierarchy: Record<CrmRole, number> = {
  SUPER_ADMIN: 6,
  SALES_MANAGER: 5,
  MANAGEMENT: 4,
  SALES_HEAD: 4,
  SCM: 3,
  PRE_SALES: 3,
  SALES_EXECUTIVE: 2,
  VIEWER: 1,
};

export function requireRole(...allowedRoles: CrmRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, "Authentication required"));
      return;
    }
    if (allowedRoles.includes(req.user.role)) {
      next();
      return;
    }
    next(new AppError(403, "Insufficient permissions"));
  };
}

/** Sales Manager and above can view all leads; Sales Executive sees only assigned. */
export function canViewAllLeads(req: Request): boolean {
  if (!req.user) return false;
  return roleHierarchy[req.user.role] >= roleHierarchy.SALES_MANAGER;
}
