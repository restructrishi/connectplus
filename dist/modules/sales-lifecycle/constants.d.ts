import type { OpportunityStage, CrmRole } from "@prisma/client";
/** Allowed stage transitions: from stage -> to stages */
export declare const STAGE_TRANSITIONS: Record<OpportunityStage, OpportunityStage[]>;
/** Who can perform which lifecycle actions */
export declare const ROLE_ACTIONS: Record<string, string[]>;
export declare function canPerform(role: CrmRole, action: string): boolean;
export declare function canTransitionFromTo(from: OpportunityStage, to: OpportunityStage): boolean;
export declare const OPPORTUNITY_STAGE_ORDER: OpportunityStage[];
//# sourceMappingURL=constants.d.ts.map