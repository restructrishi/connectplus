import { prisma } from "../../lib/prisma.js";

export const employeesRepository = {
  async upsertMany(
    items: {
      id: string;
      employeeCode?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      designation?: string | null;
      employmentType?: string | null;
      dateOfJoining?: string | null;
      departmentName?: string | null;
    }[]
  ) {
    const results = await Promise.all(
      items.map((row) => {
        let dateOfJoining: Date | undefined;
        if (row.dateOfJoining) {
          const d = new Date(row.dateOfJoining);
          if (!Number.isNaN(d.getTime())) dateOfJoining = d;
        }
        return prisma.syncedEmployee.upsert({
          where: { id: row.id },
          create: {
            id: row.id,
            employeeCode: row.employeeCode ?? undefined,
            firstName: row.firstName ?? undefined,
            lastName: row.lastName ?? undefined,
            email: row.email ?? undefined,
            designation: row.designation ?? undefined,
            employmentType: row.employmentType ?? undefined,
            dateOfJoining,
            departmentName: row.departmentName ?? undefined,
          },
          update: {
            employeeCode: row.employeeCode ?? undefined,
            firstName: row.firstName ?? undefined,
            lastName: row.lastName ?? undefined,
            email: row.email ?? undefined,
            designation: row.designation ?? undefined,
            employmentType: row.employmentType ?? undefined,
            ...(dateOfJoining !== undefined && { dateOfJoining }),
            departmentName: row.departmentName ?? undefined,
            syncedAt: new Date(),
          },
        });
      })
    );
    return results;
  },

  async list() {
    return prisma.syncedEmployee.findMany({
      orderBy: { syncedAt: "desc" },
    });
  },
};
