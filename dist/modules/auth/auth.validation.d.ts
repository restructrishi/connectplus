import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        employeeId: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "VIEWER"]>>;
    }, "strip", z.ZodTypeAny, {
        employeeId: string;
        email: string;
        password: string;
        role?: "SUPER_ADMIN" | "SALES_MANAGER" | "SALES_EXECUTIVE" | "VIEWER" | undefined;
    }, {
        employeeId: string;
        email: string;
        password: string;
        role?: "SUPER_ADMIN" | "SALES_MANAGER" | "SALES_EXECUTIVE" | "VIEWER" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        employeeId: string;
        email: string;
        password: string;
        role?: "SUPER_ADMIN" | "SALES_MANAGER" | "SALES_EXECUTIVE" | "VIEWER" | undefined;
    };
}, {
    body: {
        employeeId: string;
        email: string;
        password: string;
        role?: "SUPER_ADMIN" | "SALES_MANAGER" | "SALES_EXECUTIVE" | "VIEWER" | undefined;
    };
}>;
export type LoginBody = z.infer<typeof loginSchema>["body"];
export type RegisterBody = z.infer<typeof registerSchema>["body"];
//# sourceMappingURL=auth.validation.d.ts.map