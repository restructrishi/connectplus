"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrgIdForUser = getOrgIdForUser;
const prisma_js_1 = require("../lib/prisma.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
async function getOrgIdForUser(userId) {
    let user = null;
    try {
        user = await prisma_js_1.prisma.crmUser.findUnique({
            where: { id: userId },
            select: { organizationId: true },
        });
    }
    catch (e) {
        console.error("[org] getOrgIdForUser prisma error", e);
        throw new errorHandler_js_1.AppError(503, "Service unavailable. Run: npx prisma generate && npm run db:seed");
    }
    if (!user?.organizationId)
        throw new errorHandler_js_1.AppError(403, "User has no organization assigned. Run: npm run db:seed");
    return user.organizationId;
}
//# sourceMappingURL=org.js.map