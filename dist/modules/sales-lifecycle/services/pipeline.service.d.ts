import type { OpportunityStage, CrmRole } from "@prisma/client";
/** Jenkins-style stage status for UI */
export type PipelineNodeStatus = "PENDING" | "ACTIVE" | "APPROVED" | "REJECTED" | "LOCKED";
export interface PipelineStageView {
    stageName: OpportunityStage;
    orderIndex: number;
    status: PipelineNodeStatus;
    isLocked: boolean;
    canExecute: boolean;
    approvedBy?: string;
    approvedAt?: string;
    /** Duration in this stage (seconds) - from timeline if available */
    durationSeconds?: number;
    /** SLA: for APPROVAL_PENDING, hours since sent */
    slaHoursPending?: number;
}
/** Display label for stage */
export declare const STAGE_LABELS: Record<OpportunityStage, string>;
export interface PipelineViewResult {
    opportunityId: string;
    opportunityName: string;
    companyName: string;
    currentStage: OpportunityStage;
    isLocked: boolean;
    estimatedValue: number;
    marginPercent: number | null;
    marginIndicator: "green" | "yellow" | "red" | "none";
    riskScore: number;
    stages: PipelineStageView[];
    approvalSlaHours?: number;
    timeline: {
        action: string;
        userId: string;
        createdAt: string;
        comment?: string;
        stageTo?: string;
    }[];
}
export declare const pipelineService: {
    getPipelineView(opportunityId: string, userRole: CrmRole): Promise<PipelineViewResult>;
};
//# sourceMappingURL=pipeline.service.d.ts.map