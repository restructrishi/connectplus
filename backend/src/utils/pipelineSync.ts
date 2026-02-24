import { prisma } from "../prisma";
import { logger } from "./logger";

type PipelineTrigger = {
  type: "stage" | "log";
  nextStage?: string;
  logMessage?: string;
};

const stageTriggerMap: Record<string, PipelineTrigger> = {
  ovf_approved: {
    type: "stage",
    nextStage: "OVF_APPROVED",
  },
  scm_order_received: {
    type: "stage",
    nextStage: "OVF_APPROVED",
  },
  scm_stage_ORDER_RECEIVED: {
    type: "stage",
    nextStage: "OVF_APPROVED",
  },
  po_sent_distributor: {
    type: "stage",
    nextStage: "WAITING_PO_APPROVAL",
  },
  scm_stage_PO_SENT_TO_DISTRIBUTOR: {
    type: "stage",
    nextStage: "WAITING_PO_APPROVAL",
  },
  material_in_warehouse: {
    type: "log",
    logMessage: "Material marked as delivered to warehouse in SCM.",
  },
  scm_stage_MATERIAL_DELIVERED_WAREHOUSE: {
    type: "log",
    logMessage: "Material marked as delivered to warehouse in SCM.",
  },
  dispatched_to_customer: {
    type: "log",
    logMessage: "Dispatch towards customer recorded in SCM.",
  },
  scm_stage_WAREHOUSE_DISPATCH_TO_CUSTOMER: {
    type: "log",
    logMessage: "Dispatch towards customer recorded in SCM.",
  },
  scm_completed: {
    type: "stage",
    nextStage: "DEAL_WON",
  },
  scm_stage_SCM_WORK_COMPLETED: {
    type: "stage",
    nextStage: "DEAL_WON",
  },
  deployment_initiated: {
    type: "log",
    logMessage: "Deployment project initialized after SCM completion.",
  },
  deployment_golive: {
    type: "stage",
    nextStage: "DEAL_WON",
  },
  deal_won: {
    type: "stage",
    nextStage: "DEAL_WON",
  },
};

export const pipelineSync = {
  async advance(dealId: number | string, eventKey: string, userId: number | null, sourceModule: string) {
    const numericDealId = typeof dealId === "string" ? parseInt(dealId, 10) : dealId;

    const trigger = stageTriggerMap[eventKey];

    if (!trigger || !Number.isFinite(numericDealId)) {
      logger.info("Pipeline advance logged (no mapped trigger)", {
        dealId,
        eventKey,
        userId,
        sourceModule,
      });
      return;
    }

    try {
      if (trigger.type === "stage" && trigger.nextStage) {
        await prisma.opportunity.updateMany({
          where: {
            id: numericDealId as number,
          },
          data: {
            stage: trigger.nextStage,
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: userId ?? null,
            action: "Pipeline Stage Updated",
            entityType: "opportunity",
            entityId: numericDealId as number,
            metadata: {
              eventKey,
              sourceModule,
              nextStage: trigger.nextStage,
            },
          },
        });
      } else if (trigger.type === "log") {
        await prisma.auditLog.create({
          data: {
            userId: userId ?? null,
            action: "Pipeline Activity Logged",
            entityType: "opportunity",
            entityId: numericDealId as number,
            metadata: {
              eventKey,
              sourceModule,
              message: trigger.logMessage ?? "",
            },
          },
        });
      }

      logger.info("Pipeline advance processed", {
        dealId: numericDealId,
        eventKey,
        userId,
        sourceModule,
      });
    } catch (error) {
      logger.error("Pipeline advance failed", {
        dealId: numericDealId,
        eventKey,
        userId,
        sourceModule,
        error,
      });
    }
  },
};
