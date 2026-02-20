"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPPORTUNITY_STAGE_ORDER = exports.ROLE_ACTIONS = exports.STAGE_TRANSITIONS = void 0;
exports.canPerform = canPerform;
exports.canTransitionFromTo = canTransitionFromTo;
/** Allowed stage transitions: from stage -> to stages */
exports.STAGE_TRANSITIONS = {
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
exports.ROLE_ACTIONS = {
    SALES_EXECUTIVE: ["create_company", "create_lead", "convert_lead", "mark_lead_dead", "create_opportunity", "mark_lost"],
    PRE_SALES: ["upload_boq", "upload_sow", "upload_oem_quote", "set_oem_received"],
    SALES_HEAD: ["create_opportunity", "assign_opportunity", "create_quote", "edit_quote", "create_ovf", "send_approval"],
    MANAGEMENT: ["approve_ovf", "reject_ovf"],
    SCM: ["scm_handoff", "view_scm"],
    SUPER_ADMIN: ["*", "stage_override", "unlock"],
    SALES_MANAGER: ["create_lead", "create_opportunity", "assign_opportunity", "create_quote", "edit_quote", "create_ovf", "send_approval", "mark_lost"],
};
function canPerform(role, action) {
    const allowed = exports.ROLE_ACTIONS[role];
    if (!allowed)
        return false;
    if (allowed.includes("*"))
        return true;
    return allowed.includes(action);
}
function canTransitionFromTo(from, to) {
    const allowed = exports.STAGE_TRANSITIONS[from];
    if (!allowed)
        return false;
    return allowed.includes(to);
}
exports.OPPORTUNITY_STAGE_ORDER = [
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
//# sourceMappingURL=constants.js.map