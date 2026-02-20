"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        this.name = "AppError";
    }
}
exports.AppError = AppError;
function errorHandler(err, _req, res, _next) {
    const isAppError = err instanceof AppError;
    const statusCode = isAppError ? err.statusCode : 500;
    const message = isAppError ? err.message : "Internal server error";
    if (!isAppError && err.message) {
        console.error("[ERROR]", err);
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            data: {
                stack: err.stack,
                detail: err.message,
            },
        }),
    });
}
//# sourceMappingURL=errorHandler.js.map