import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types/index.js";
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean);
}
export declare function errorHandler(err: Error | AppError, _req: Request, res: Response<ApiResponse>, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map