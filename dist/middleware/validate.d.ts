import type { Request, Response, NextFunction } from "express";
import { type ZodTypeAny } from "zod";
export type ValidationSchema = {
    shape?: {
        body?: ZodTypeAny;
        query?: ZodTypeAny;
        params?: ZodTypeAny;
    };
};
export declare function validate(schema: ValidationSchema): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map