"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scmHandoffSchema = exports.approvalDecideSchema = exports.createOvfSchema = exports.updateQuoteSchema = exports.createQuoteSchema = exports.updateOemSchema = exports.transitionStageSchema = exports.listOpportunitiesSchema = exports.createOpportunitySchema = exports.markLeadDeadSchema = exports.convertLeadSchema = exports.listLeadsSchema = exports.createLeadSchema = exports.listCompaniesSchema = exports.createCompanySchema = void 0;
const zod_1 = require("zod");
const pagination = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).optional().default(20),
});
exports.createCompanySchema = zod_1.z.object({
    body: zod_1.z.object({ name: zod_1.z.string().min(1, "Company name required") }),
});
exports.listCompaniesSchema = zod_1.z.object({
    query: pagination.extend({ status: zod_1.z.enum(["OPEN", "CLOSED"]).optional() }),
});
exports.createLeadSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        companyId: zod_1.z.string().min(1),
        contactInfo: zod_1.z.string().optional(),
        assignedTo: zod_1.z.string().optional(),
    }),
});
exports.listLeadsSchema = zod_1.z.object({
    query: pagination.extend({
        companyId: zod_1.z.string().optional(),
        status: zod_1.z.enum(["OPEN", "CONVERTED", "DEAD"]).optional(),
        assignedTo: zod_1.z.string().optional(),
    }),
});
exports.convertLeadSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({ reason: zod_1.z.string().min(1, "Reason required") }),
});
exports.markLeadDeadSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({ reason: zod_1.z.string().min(1, "Reason required") }),
});
exports.createOpportunitySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        companyId: zod_1.z.string().min(1),
        leadId: zod_1.z.string().optional(),
        estimatedValue: zod_1.z.number().optional(),
        assignedSalesPerson: zod_1.z.string().min(1),
        probability: zod_1.z.number().min(0).max(100).optional(),
        expectedClosureDate: zod_1.z.string().datetime().optional().or(zod_1.z.coerce.date().optional()),
    }),
});
exports.listOpportunitiesSchema = zod_1.z.object({
    query: pagination.extend({
        companyId: zod_1.z.string().optional(),
        stage: zod_1.z.string().optional(),
        assignedSalesPerson: zod_1.z.string().optional(),
    }),
});
exports.transitionStageSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        stage: zod_1.z.enum([
            "OPEN", "BOQ_SUBMITTED", "SOW_ATTACHED", "OEM_QUOTATION_RECEIVED",
            "QUOTE_CREATED", "OVF_CREATED", "APPROVAL_PENDING", "APPROVED", "SENT_TO_SCM", "LOST_DEAL",
        ]),
        reason: zod_1.z.string().optional(),
        lostReason: zod_1.z.string().optional(),
    }),
});
exports.updateOemSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        drNumber: zod_1.z.string().optional(),
        drNumberNa: zod_1.z.boolean().optional(),
        oemQuotationReceived: zod_1.z.boolean().optional(),
    }),
});
exports.createQuoteSchema = zod_1.z.object({
    body: zod_1.z.object({
        opportunityId: zod_1.z.string().min(1),
        amount: zod_1.z.number().positive(),
        marginPercent: zod_1.z.number().optional(),
        marginAmount: zod_1.z.number().optional(),
        details: zod_1.z.record(zod_1.z.unknown()).optional(),
    }),
});
exports.updateQuoteSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        amount: zod_1.z.number().positive().optional(),
        marginPercent: zod_1.z.number().optional(),
        marginAmount: zod_1.z.number().optional(),
        details: zod_1.z.record(zod_1.z.unknown()).optional(),
    }),
});
exports.createOvfSchema = zod_1.z.object({
    body: zod_1.z.object({
        opportunityId: zod_1.z.string().min(1),
        quoteId: zod_1.z.string().min(1),
        dealName: zod_1.z.string().min(1),
        finalAmount: zod_1.z.number().positive(),
        marginPercent: zod_1.z.number().optional(),
        paymentTerms: zod_1.z.string().optional(),
    }),
});
exports.approvalDecideSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["APPROVED", "REJECTED"]),
        comments: zod_1.z.string().optional(),
    }),
});
exports.scmHandoffSchema = zod_1.z.object({
    params: zod_1.z.object({ opportunityId: zod_1.z.string().min(1) }),
});
//# sourceMappingURL=lifecycle.validation.js.map