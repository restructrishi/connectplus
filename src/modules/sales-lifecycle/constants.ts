import type { OpportunityStage, CrmRole } from "@prisma/client";

/** Allowed stage transitions: from stage -> to stages */
export const STAGE_TRANSITIONS: Record<OpportunityStage, OpportunityStage[]> = {
  OPEN: ["BOQ_SUBMITTED", "LOST_DEAL"],
  BOQ_SUBMITTED: ["SOW_ATTACHED", "LOST_DEAL"],
  SOW_ATTACHED: ["OEM_QUOTATION_RECEIVED", "LOST_DEAL"],
  OEM_QUOTATION_RECEIVED: ["QUOTE_CREATED", "LOST_DEAL"],
  QUOTE_CREATED: ["OVF_CREATED", "LOST_DEAL"],
  OVF_CREATED: ["APPROVAL_PENDING", "LOST_DEAL"],
  APPROVAL_PENDING: ["APPROVED", "LOST_DEAL"],
  APPROVED: ["SENT_TO_SCM"],
  SENT_TO_SCM: [],
  LOST_DEAL: [],
};

/** Who can perform which lifecycle actions */
export const ROLE_ACTIONS: Record<string, string[]> = {
  SALES_EXECUTIVE: ["create_company", "create_lead", "convert_lead", "mark_lead_dead", "create_opportunity", "mark_lost"],
  PRE_SALES: ["upload_boq", "upload_sow", "upload_oem_quote", "set_oem_received"],
  SALES_HEAD: ["create_opportunity", "assign_opportunity", "create_quote", "edit_quote", "create_ovf", "send_approval"],
  MANAGEMENT: ["approve_ovf", "reject_ovf"],
  SCM: ["scm_handoff", "view_scm"],
  SUPER_ADMIN: ["*", "stage_override", "unlock"],
  SALES_MANAGER: ["create_lead", "create_opportunity", "assign_opportunity", "create_quote", "edit_quote", "create_ovf", "send_approval", "mark_lost"],
};

export function canPerform(role: CrmRole, action: string): boolean {
  const allowed = ROLE_ACTIONS[role];
  if (!allowed) return false;
  if (allowed.includes("*")) return true;
  return allowed.includes(action);
}

export function canTransitionFromTo(from: OpportunityStage, to: OpportunityStage): boolean {
  const allowed = STAGE_TRANSITIONS[from];
  if (!allowed) return false;
  return allowed.includes(to);
}

export const OPPORTUNITY_STAGE_ORDER: OpportunityStage[] = [
  "OPEN",
  "BOQ_SUBMITTED",
  "SOW_ATTACHED",
  "OEM_QUOTATION_RECEIVED",
  "QUOTE_CREATED",
  "OVF_CREATED",
  "APPROVAL_PENDING",
  "APPROVED",
  "SENT_TO_SCM",
  "LOST_DEAL",
];
