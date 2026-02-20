export interface PipelineCompany {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: { leads: number; opportunities: number };
  leads?: PipelineLead[];
  opportunities?: PipelineOpportunity[];
}

export interface PipelineLead {
  id: string;
  companyId: string;
  status: "ACTIVE" | "CONVERTED" | "LOST";
  createdAt: string;
  convertedAt?: string | null;
  convertedToId?: string | null;
  lostReason?: string | null;
  company?: PipelineCompany;
  opportunity?: PipelineOpportunity | null;
}

export interface AttachmentsShape {
  boq?: { attached: boolean; url?: string; fileName?: string };
  sow?: { attached: boolean; url?: string; fileName?: string };
  oemQuote?: { attached: boolean; url?: string; fileName?: string };
  quote?: { created: boolean; url?: string; amount?: number };
  po?: { attached: boolean; url?: string; fileName?: string; approved?: boolean };
}

export interface TechnicalDetailsShape {
  drNumber?: string;
  oemQuoteReceived?: boolean;
  oemAttachmentOption?: boolean;
  approvalPercentage?: number;
}

export interface ApprovalItem {
  type: string;
  status: string;
  requestedAt: string;
  respondedAt?: string;
  approvedBy?: string;
  autoApproved?: boolean;
}

export interface EmailSentItem {
  type: string;
  sentAt: string;
  to: string[];
  status: string;
}

export interface OvfDetailsShape {
  created?: boolean;
  approved?: boolean;
  sharedToSCM?: boolean;
  sharedAt?: string;
}

export interface PipelineOpportunity {
  id: string;
  companyId: string;
  leadId?: string | null;
  status: string;
  attachments: AttachmentsShape | Record<string, unknown>;
  technicalDetails: TechnicalDetailsShape | Record<string, unknown>;
  approvals: ApprovalItem[] | unknown[];
  emailsSent: EmailSentItem[] | unknown[];
  ovfDetails: OvfDetailsShape | Record<string, unknown>;
  lostDeal: boolean;
  lostReason?: string | null;
  createdAt: string;
  updatedAt: string;
  company?: PipelineCompany;
  lead?: PipelineLead | null;
}
