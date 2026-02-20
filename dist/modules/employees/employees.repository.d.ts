export declare const employeesRepository: {
    upsertMany(items: {
        id: string;
        employeeCode?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        designation?: string | null;
        employmentType?: string | null;
        dateOfJoining?: string | null;
        departmentName?: string | null;
    }[]): Promise<{
        id: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        employeeCode: string | null;
        designation: string | null;
        employmentType: string | null;
        dateOfJoining: Date | null;
        departmentName: string | null;
        syncedAt: Date;
    }[]>;
    list(): Promise<{
        id: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        employeeCode: string | null;
        designation: string | null;
        employmentType: string | null;
        dateOfJoining: Date | null;
        departmentName: string | null;
        syncedAt: Date;
    }[]>;
};
//# sourceMappingURL=employees.repository.d.ts.map