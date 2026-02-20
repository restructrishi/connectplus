import type { Request, Response, NextFunction } from "express";
import { auditRepository } from "../repositories/audit.repository.js";

export async function listAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize, userId, entityType, entityId } = req.query as {
      page?: string;
      pageSize?: string;
      userId?: string;
      entityType?: string;
      entityId?: string;
    };
    const result = await auditRepository.findMany({
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      userId,
      entityType,
      entityId,
    });
    res.status(200).json({
      success: true,
      data: {
        items: result.items,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      },
    });
  } catch (e) {
    next(e);
  }
}
