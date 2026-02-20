/**
 * When a pipeline lead is converted, we create a lifecycle Opportunity so it appears
 * in the Pipeline Engine dropdown and the stage workflow (BOQ → Quote → OVF → Approval) works.
 */
import { prisma } from "../../lib/prisma.js";
import { opportunityRepository } from "../sales-lifecycle/repositories/opportunity.repository.js";

export async function syncPipelineOpportunityToLifecycle(
  pipelineOpportunityId: string,
  userId: string,
  _userRole: string
): Promise<string | null> {
  const po = await prisma.pipelineOpportunity.findUnique({
    where: { id: pipelineOpportunityId },
    include: { company: true },
  });
  if (!po || po.lifecycleOpportunityId) return po?.lifecycleOpportunityId ?? null;

  const companyName = po.company.name.trim() || "Unknown Company";
  let salesCompany = await prisma.salesCompany.findFirst({
    where: { name: companyName, deletedAt: null },
  });
  if (!salesCompany) {
    salesCompany = await prisma.salesCompany.create({
      data: { name: companyName, createdBy: userId, status: "OPEN" },
    });
  }

  const opportunity = await opportunityRepository.create({
    name: `${companyName} – Opportunity`,
    companyId: salesCompany.id,
    assignedSalesPerson: userId,
  });

  await prisma.pipelineOpportunity.update({
    where: { id: pipelineOpportunityId },
    data: { lifecycleOpportunityId: opportunity.id, updatedAt: new Date() },
  });

  return opportunity.id;
}
