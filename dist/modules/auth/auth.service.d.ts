import type { CrmRole } from "@prisma/client";
export interface LoginInput {
    email: string;
    password: string;
}
export interface RegisterInput {
    employeeId: string;
    email: string;
    password: string;
    role?: CrmRole;
}
export interface TokenResult {
    token: string;
    expiresIn: string;
    user: {
        id: string;
        employeeId: string;
        email: string;
        role: CrmRole;
    };
}
export declare const authService: {
    login(input: LoginInput): Promise<TokenResult>;
    register(input: RegisterInput): Promise<{
        id: string;
        employeeId: string;
        email: string;
        role: import("../../../generated/prisma-client/index.js").$Enums.CrmRole;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        employeeId: string;
        email: string;
        role: import("../../../generated/prisma-client/index.js").$Enums.CrmRole;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map