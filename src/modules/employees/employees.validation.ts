import { z } from "zod";

const employeeItemSchema = z.object({
  id: z.string().min(1, "Employee id required"),
  employeeCode: z.string().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  employmentType: z.string().optional().nullable(),
  dateOfJoining: z.string().optional().nullable(),
  departmentName: z.string().optional().nullable(),
});

export const syncEmployeesSchema = z.object({
  body: z.object({
    data: z.array(employeeItemSchema).min(1, "At least one employee required"),
  }),
});
