import { prisma } from "../../lib/prisma.js";

export async function addTimelineEvent(params: {
  opportunityId: string;
  action: string;
  stageFrom?: string;
  stageTo?: string;
  userId: string;
  comment?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await prisma.opportunityTimeline.create({
    data: {
      opportunityId: params.opportunityId,
      action: params.action,
      stageFrom: params.stageFrom,
      stageTo: params.stageTo,
      userId: params.userId,
      comment: params.comment ?? undefined,
      metadata: (params.metadata ?? undefined) as object | undefined,
    },
  });
}
