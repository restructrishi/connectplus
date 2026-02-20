import type { CrmRole } from "@prisma/client";
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
}
export interface JwtPayload {
    sub: string;
    employeeId: string;
    email: string;
    role: CrmRole;
    iat?: number;
    exp?: number;
}
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED";
export type DealStage = "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";
export type ActivityType = "CALL" | "MEETING" | "EMAIL" | "FOLLOWUP";
export type TaskStatus = "PENDING" | "COMPLETED";
//# sourceMappingURL=index.d.ts.map