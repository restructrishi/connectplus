export type PipelineNodeStatus = "PENDING" | "ACTIVE" | "APPROVED" | "REJECTED" | "LOCKED";

export interface PipelineStageView {
  stageName: string;
  orderIndex: number;
  status: PipelineNodeStatus;
  isLocked: boolean;
  canExecute: boolean;
  approvedBy?: string;
  approvedAt?: string;
  durationSeconds?: number;
  slaHoursPending?: number;
}

export interface PipelineView {
  opportunityId: string;
  opportunityName: string;
  companyName: string;
  currentStage: string;
  isLocked: boolean;
  estimatedValue: number;
  marginPercent: number | null;
  marginIndicator: "green" | "yellow" | "red" | "none";
  riskScore: number;
  stages: PipelineStageView[];
  approvalSlaHours?: number;
  timeline: { action: string; userId: string; createdAt: string; comment?: string; stageTo?: string }[];
}
