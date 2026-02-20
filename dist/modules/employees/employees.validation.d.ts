import { z } from "zod";
export declare const syncEmployeesSchema: z.ZodObject<{
    body: z.ZodObject<{
        data: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            employeeCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            firstName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            lastName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            designation: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            employmentType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            dateOfJoining: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            departmentName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            email?: string | null | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
            employeeCode?: string | null | undefined;
            designation?: string | null | undefined;
            employmentType?: string | null | undefined;
            dateOfJoining?: string | null | undefined;
            departmentName?: string | null | undefined;
        }, {
            id: string;
            email?: string | null | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
            employeeCode?: string | null | undefined;
            designation?: string | null | undefined;
            employmentType?: string | null | undefined;
            dateOfJoining?: string | null | undefined;
            departmentName?: string | null | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        data: {
            id: string;
            email?: string | null | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
            employeeCode?: string | null | undefined;
            designation?: string | null | undefined;
            employmentType?: string | null | undefined;
            dateOfJoining?: string | null | undefined;
            departmentName?: string | null | undefined;
        }[];
    }, {
        data: {
            id: string;
            email?: string | null | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
            employeeCode?: string | null | undefined;
            designation?: string | null | undefined;
            employmentType?: string | null | undefined;
            dateOfJoining?: string | null | undefined;
            departmentName?: string | null | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        data: {
            id: string;
            email?: string | null | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
            employeeCode?: string | null | undefined;
            designation?: string | null | undefined;
            employmentType?: string | null | undefined;
            dateOfJoining?: string | null | undefined;
            departmentName?: string | null | undefined;
        }[];
    };
}, {
    body: {
        data: {
            id: string;
            email?: string | null | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
            employeeCode?: string | null | undefined;
            designation?: string | null | undefined;
            employmentType?: string | null | undefined;
            dateOfJoining?: string | null | undefined;
            departmentName?: string | null | undefined;
        }[];
    };
}>;
//# sourceMappingURL=employees.validation.d.ts.map