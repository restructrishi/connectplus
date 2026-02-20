import { z } from "zod";

const crmRoleEnum = z.enum(["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "VIEWER"]);

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email required"),
    password: z.string().min(1, "Password required"),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    employeeId: z.string().min(1, "Employee ID required"),
    email: z.string().email("Valid email required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: crmRoleEnum.optional(),
  }),
});

export type LoginBody = z.infer<typeof loginSchema>["body"];
export type RegisterBody = z.infer<typeof registerSchema>["body"];
