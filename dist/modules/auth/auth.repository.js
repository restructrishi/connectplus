"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const prisma_js_1 = require("../../lib/prisma.js");
exports.authRepository = {
    async findByEmail(email) {
        const user = await prisma_js_1.prisma.crmUser.findUnique({
            where: { email: email.toLowerCase() },
        });
        return user?.isActive ? user : null;
    },
    async findById(id) {
        const user = await prisma_js_1.prisma.crmUser.findUnique({
            where: { id },
        });
        return user?.isActive ? user : null;
    },
    async create(data) {
        return prisma_js_1.prisma.crmUser.create({
            data: {
                ...data,
                email: data.email.toLowerCase(),
            },
        });
    },
    async updatePassword(id, passwordHash) {
        return prisma_js_1.prisma.crmUser.update({
            where: { id },
            data: { passwordHash, updatedAt: new Date() },
        });
    },
};
//# sourceMappingURL=auth.repository.js.map