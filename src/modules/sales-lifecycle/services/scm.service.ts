import { opportunityRepository } from "../repositories/opportunity.repository.js";
import { ovfRepository } from "../repositories/ovf.repository.js";
import { scmRepository } from "../repositories/scm.repository.js";
import { addTimelineEvent } from "../timeline.js";
import { createAuditLog } from "../../../lib/audit.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { canPerform } from "../constants.js";
import type { CrmRole } from "@prisma/client";

export const scmService = {
  async handoff(opportunityId: string, userId: string, userRole: CrmRole) {
    if (!canPerform(userRole, "scm_handoff")) throw new AppError(403, "Not allowed to hand off to SCM");
    const opp = await opportunityRepository.findById(opportunityId);
    if (!opp) throw new AppError(404, "Opportunity not found");
    if (opp.stage !== "APPROVED") throw new AppError(400, "Opportunity must be approved first");
    const ovf = await ovfRepository.findByOpportunityId(opportunityId);
    if (!ovf || ovf.status !== "APPROVED") throw new AppError(400, "OVF must be approved");
    const existing = await scmRepository.findByOpportunityId(opportunityId);
    if (existing) throw new AppError(400, "Already handed off to SCM");
    const handoff = await scmRepository.create({
      opportunityId,
      ovfId: ovf.id,
      handedOffBy: userId,
    });
    await opportunityRepository.updateStage(opportunityId, "SENT_TO_SCM");
    await addTimelineEvent({
      opportunityId,
      action: "scm_handoff",
      stageTo: "SENT_TO_SCM",
      userId,
    });
    await createAuditLog({
      userId,
      action: "sales_lifecycle.scm.handoff",
      entityType: "SCMHandoff",
      entityId: handoff.id,
      metadata: { opportunityId },
    });
    return handoff;
  },

  async list(filters: { page?: number; pageSize?: number }, userRole: CrmRole) {
    if (!canPerform(userRole, "view_scm")) throw new AppError(403, "Not allowed to view SCM");
    return scmRepository.findMany(filters);
  },
};
