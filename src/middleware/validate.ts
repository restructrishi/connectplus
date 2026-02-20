import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import { AppError } from "./errorHandler.js";

export type ValidationSchema = { shape?: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny } };

export function validate(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const shape = schema.shape;
      if (shape?.body) {
        req.body = shape.body.parse(req.body);
      }
      if (shape?.query) {
        req.query = shape.query.parse(req.query);
      }
      if (shape?.params) {
        req.params = shape.params.parse(req.params);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
        next(new AppError(400, message));
      } else {
        next(err);
      }
    }
  };
}
