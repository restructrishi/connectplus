import { z } from "zod";

const pagination = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const createCompanySchema = z.object({
  body: z.object({ name: z.string().min(1, "Company name required") }),
});

export const listCompaniesSchema = z.object({
  query: pagination.extend({ status: z.enum(["OPEN", "CLOSED"]).optional() }),
});

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    companyId: z.string().min(1),
    contactInfo: z.string().optional(),
    assignedTo: z.string().optional(),
  }),
});

export const listLeadsSchema = z.object({
  query: pagination.extend({
    companyId: z.string().optional(),
    status: z.enum(["OPEN", "CONVERTED", "DEAD"]).optional(),
    assignedTo: z.string().optional(),
  }),
});

export const convertLeadSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ reason: z.string().min(1, "Reason required") }),
});

export const markLeadDeadSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ reason: z.string().min(1, "Reason required") }),
});

export const createOpportunitySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    companyId: z.string().min(1),
    leadId: z.string().optional(),
    estimatedValue: z.number().optional(),
    assignedSalesPerson: z.string().min(1),
    probability: z.number().min(0).max(100).optional(),
    expectedClosureDate: z.string().datetime().optional().or(z.coerce.date().optional()),
  }),
});

export const listOpportunitiesSchema = z.object({
  query: pagination.extend({
    companyId: z.string().optional(),
    stage: z.string().optional(),
    assignedSalesPerson: z.string().optional(),
  }),
});

export const transitionStageSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    stage: z.enum([
      "OPEN", "BOQ_SUBMITTED", "SOW_ATTACHED", "OEM_QUOTATION_RECEIVED",
      "QUOTE_CREATED", "OVF_CREATED", "APPROVAL_PENDING", "APPROVED", "SENT_TO_SCM", "LOST_DEAL",
    ]),
    reason: z.string().optional(),
    lostReason: z.string().optional(),
  }),
});

export const updateOemSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    drNumber: z.string().optional(),
    drNumberNa: z.boolean().optional(),
    oemQuotationReceived: z.boolean().optional(),
  }),
});

export const createQuoteSchema = z.object({
  body: z.object({
    opportunityId: z.string().min(1),
    amount: z.number().positive(),
    marginPercent: z.number().optional(),
    marginAmount: z.number().optional(),
    details: z.record(z.unknown()).optional(),
  }),
});

export const updateQuoteSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    amount: z.number().positive().optional(),
    marginPercent: z.number().optional(),
    marginAmount: z.number().optional(),
    details: z.record(z.unknown()).optional(),
  }),
});

export const createOvfSchema = z.object({
  body: z.object({
    opportunityId: z.string().min(1),
    quoteId: z.string().min(1),
    dealName: z.string().min(1),
    finalAmount: z.number().positive(),
    marginPercent: z.number().optional(),
    paymentTerms: z.string().optional(),
  }),
});

export const approvalDecideSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
    comments: z.string().optional(),
  }),
});

export const scmHandoffSchema = z.object({
  params: z.object({ opportunityId: z.string().min(1) }),
});
