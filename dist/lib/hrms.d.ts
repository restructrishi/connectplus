/**
 * HRMS integration - READ ONLY.
 * CRM stores only employee_id. Fetch employee details from HRMS service.
 * Never modify employee data from CRM.
 */
export interface HrmsEmployee {
    id: string;
    name: string;
    email: string;
    department?: string;
    role?: string;
}
export declare function getEmployeeById(employeeId: string): Promise<HrmsEmployee | null>;
export declare function getEmployeesByIds(employeeIds: string[]): Promise<Map<string, HrmsEmployee>>;
//# sourceMappingURL=hrms.d.ts.map