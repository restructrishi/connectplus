import { prisma } from "../../lib/prisma.js";
import type { CrmRole } from "@prisma/client";

export const authRepository = {
  async findByEmail(email: string) {
    const user = await prisma.crmUser.findUnique({
      where: { email: email.toLowerCase() },
    });
    return user?.isActive ? user : null;
  },

  async findById(id: string) {
    const user = await prisma.crmUser.findUnique({
      where: { id },
    });
    return user?.isActive ? user : null;
  },

  async create(data: {
    employeeId: string;
    email: string;
    passwordHash: string;
    role?: CrmRole;
  }) {
    return prisma.crmUser.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.crmUser.update({
      where: { id },
      data: { passwordHash, updatedAt: new Date() },
    });
  },
};
