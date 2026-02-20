import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getOrgIdForUser(userId: string): Promise<string> {
  let user: { organizationId: string | null } | null = null;
  try {
    user = await prisma.crmUser.findUnique({
      where: { id: userId },
      select: { organizationId: true },
    });
  } catch (e) {
    console.error("[org] getOrgIdForUser prisma error", e);
    throw new AppError(503, "Service unavailable. Run: npx prisma generate && npm run db:seed");
  }
  if (!user?.organizationId)
    throw new AppError(403, "User has no organization assigned. Run: npm run db:seed");
  return user.organizationId;
}
