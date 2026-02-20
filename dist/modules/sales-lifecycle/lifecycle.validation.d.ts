import { z } from "zod";
export declare const createCompanySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
    }, {
        name: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
    };
}, {
    body: {
        name: string;
    };
}>;
export declare const listCompaniesSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    } & {
        status: z.ZodOptional<z.ZodEnum<["OPEN", "CLOSED"]>>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        status?: "OPEN" | "CLOSED" | undefined;
    }, {
        status?: "OPEN" | "CLOSED" | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        pageSize: number;
        status?: "OPEN" | "CLOSED" | undefined;
    };
}, {
    query: {
        status?: "OPEN" | "CLOSED" | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    };
}>;
export declare const createLeadSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        companyId: z.ZodString;
        contactInfo: z.ZodOptional<z.ZodString>;
        assignedTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        companyId: string;
        assignedTo?: string | undefined;
        contactInfo?: string | undefined;
    }, {
        name: string;
        companyId: string;
        assignedTo?: string | undefined;
        contactInfo?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        companyId: string;
        assignedTo?: string | undefined;
        contactInfo?: string | undefined;
    };
}, {
    body: {
        name: string;
        companyId: string;
        assignedTo?: string | undefined;
        contactInfo?: string | undefined;
    };
}>;
export declare const listLeadsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    } & {
        companyId: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["OPEN", "CONVERTED", "DEAD"]>>;
        assignedTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        status?: "CONVERTED" | "OPEN" | "DEAD" | undefined;
        assignedTo?: string | undefined;
        companyId?: string | undefined;
    }, {
        status?: "CONVERTED" | "OPEN" | "DEAD" | undefined;
        assignedTo?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        companyId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        pageSize: number;
        status?: "CONVERTED" | "OPEN" | "DEAD" | undefined;
        assignedTo?: string | undefined;
        companyId?: string | undefined;
    };
}, {
    query: {
        status?: "CONVERTED" | "OPEN" | "DEAD" | undefined;
        assignedTo?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        companyId?: string | undefined;
    };
}>;
export declare const convertLeadSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
    }, {
        reason: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        reason: string;
    };
}, {
    params: {
        id: string;
    };
    body: {
        reason: string;
    };
}>;
export declare const markLeadDeadSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
    }, {
        reason: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        reason: string;
    };
}, {
    params: {
        id: string;
    };
    body: {
        reason: string;
    };
}>;
export declare const createOpportunitySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        companyId: z.ZodString;
        leadId: z.ZodOptional<z.ZodString>;
        estimatedValue: z.ZodOptional<z.ZodNumber>;
        assignedSalesPerson: z.ZodString;
        probability: z.ZodOptional<z.ZodNumber>;
        expectedClosureDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        companyId: string;
        assignedSalesPerson: string;
        expectedClosureDate?: string | Date | undefined;
        leadId?: string | undefined;
        estimatedValue?: number | undefined;
        probability?: number | undefined;
    }, {
        name: string;
        companyId: string;
        assignedSalesPerson: string;
        expectedClosureDate?: string | Date | undefined;
        leadId?: string | undefined;
        estimatedValue?: number | undefined;
        probability?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        companyId: string;
        assignedSalesPerson: string;
        expectedClosureDate?: string | Date | undefined;
        leadId?: string | undefined;
        estimatedValue?: number | undefined;
        probability?: number | undefined;
    };
}, {
    body: {
        name: string;
        companyId: string;
        assignedSalesPerson: string;
        expectedClosureDate?: string | Date | undefined;
        leadId?: string | undefined;
        estimatedValue?: number | undefined;
        probability?: number | undefined;
    };
}>;
export declare const listOpportunitiesSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    } & {
        companyId: z.ZodOptional<z.ZodString>;
        stage: z.ZodOptional<z.ZodString>;
        assignedSalesPerson: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        stage?: string | undefined;
        companyId?: string | undefined;
        assignedSalesPerson?: string | undefined;
    }, {
        page?: number | undefined;
        pageSize?: number | undefined;
        stage?: string | undefined;
        companyId?: string | undefined;
        assignedSalesPerson?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        pageSize: number;
        stage?: string | undefined;
        companyId?: string | undefined;
        assignedSalesPerson?: string | undefined;
    };
}, {
    query: {
        page?: number | undefined;
        pageSize?: number | undefined;
        stage?: string | undefined;
        companyId?: string | undefined;
        assignedSalesPerson?: string | undefined;
    };
}>;
export declare const transitionStageSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        stage: z.ZodEnum<["OPEN", "BOQ_SUBMITTED", "SOW_ATTACHED", "OEM_QUOTATION_RECEIVED", "QUOTE_CREATED", "OVF_CREATED", "APPROVAL_PENDING", "APPROVED", "SENT_TO_SCM", "LOST_DEAL"]>;
        reason: z.ZodOptional<z.ZodString>;
        lostReason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        stage: "OPEN" | "BOQ_SUBMITTED" | "SOW_ATTACHED" | "OEM_QUOTATION_RECEIVED" | "QUOTE_CREATED" | "OVF_CREATED" | "APPROVAL_PENDING" | "APPROVED" | "SENT_TO_SCM" | "LOST_DEAL";
        reason?: string | undefined;
        lostReason?: string | undefined;
    }, {
        stage: "OPEN" | "BOQ_SUBMITTED" | "SOW_ATTACHED" | "OEM_QUOTATION_RECEIVED" | "QUOTE_CREATED" | "OVF_CREATED" | "APPROVAL_PENDING" | "APPROVED" | "SENT_TO_SCM" | "LOST_DEAL";
        reason?: string | undefined;
        lostReason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        stage: "OPEN" | "BOQ_SUBMITTED" | "SOW_ATTACHED" | "OEM_QUOTATION_RECEIVED" | "QUOTE_CREATED" | "OVF_CREATED" | "APPROVAL_PENDING" | "APPROVED" | "SENT_TO_SCM" | "LOST_DEAL";
        reason?: string | undefined;
        lostReason?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        stage: "OPEN" | "BOQ_SUBMITTED" | "SOW_ATTACHED" | "OEM_QUOTATION_RECEIVED" | "QUOTE_CREATED" | "OVF_CREATED" | "APPROVAL_PENDING" | "APPROVED" | "SENT_TO_SCM" | "LOST_DEAL";
        reason?: string | undefined;
        lostReason?: string | undefined;
    };
}>;
export declare const updateOemSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        drNumber: z.ZodOptional<z.ZodString>;
        drNumberNa: z.ZodOptional<z.ZodBoolean>;
        oemQuotationReceived: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        drNumber?: string | undefined;
        drNumberNa?: boolean | undefined;
        oemQuotationReceived?: boolean | undefined;
    }, {
        drNumber?: string | undefined;
        drNumberNa?: boolean | undefined;
        oemQuotationReceived?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        drNumber?: string | undefined;
        drNumberNa?: boolean | undefined;
        oemQuotationReceived?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        drNumber?: string | undefined;
        drNumberNa?: boolean | undefined;
        oemQuotationReceived?: boolean | undefined;
    };
}>;
export declare const createQuoteSchema: z.ZodObject<{
    body: z.ZodObject<{
        opportunityId: z.ZodString;
        amount: z.ZodNumber;
        marginPercent: z.ZodOptional<z.ZodNumber>;
        marginAmount: z.ZodOptional<z.ZodNumber>;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        opportunityId: string;
        amount: number;
        marginPercent?: number | undefined;
        marginAmount?: number | undefined;
        details?: Record<string, unknown> | undefined;
    }, {
        opportunityId: string;
        amount: number;
        marginPercent?: number | undefined;
        marginAmount?: number | undefined;
        details?: Record<string, unknown> | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        opportunityId: string;
        amount: number;
        marginPercent?: number | undefined;
        marginAmount?: number | undefined;
        details?: Record<string, unknown> | undefined;
    };
}, {
    body: {
        opportunityId: string;
        amount: number;
        marginPercent?: number | undefined;
        marginAmount?: number | undefined;
        details?: Record<string, unknown> | undefined;
    };
}>;
export declare const updateQuoteSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        amount: z.ZodOptional<z.ZodNumber>;
        marginPercent: z.ZodOptional<z.ZodNumber>;
        marginAmount: z.ZodOptional<z.ZodNumber>;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        amount?: number | undefined;
        marginPercent?: number | undefined;
        marginAmount?: number | undefined;
        details?: Record<string, unknown> | undefined;
    }, {
        amount?: number | undefined;
        marginPercent?: number | undefined;
        marginAmount?: number | undefined;
        details?: Record<string, unknown> | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        amount?: number | undefined;
        marginPercent?: number | undefined;
        marginAmount?: number | undefined;
        details?: Record<string, unknown> | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        amount?: number | undefined;
        marginPercent?: number | undefined;
        marginAmount?: number | undefined;
        details?: Record<string, unknown> | undefined;
    };
}>;
export declare const createOvfSchema: z.ZodObject<{
    body: z.ZodObject<{
        opportunityId: z.ZodString;
        quoteId: z.ZodString;
        dealName: z.ZodString;
        finalAmount: z.ZodNumber;
        marginPercent: z.ZodOptional<z.ZodNumber>;
        paymentTerms: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        opportunityId: string;
        quoteId: string;
        dealName: string;
        finalAmount: number;
        marginPercent?: number | undefined;
        paymentTerms?: string | undefined;
    }, {
        opportunityId: string;
        quoteId: string;
        dealName: string;
        finalAmount: number;
        marginPercent?: number | undefined;
        paymentTerms?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        opportunityId: string;
        quoteId: string;
        dealName: string;
        finalAmount: number;
        marginPercent?: number | undefined;
        paymentTerms?: string | undefined;
    };
}, {
    body: {
        opportunityId: string;
        quoteId: string;
        dealName: string;
        finalAmount: number;
        marginPercent?: number | undefined;
        paymentTerms?: string | undefined;
    };
}>;
export declare const approvalDecideSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<["APPROVED", "REJECTED"]>;
        comments: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "APPROVED" | "REJECTED";
        comments?: string | undefined;
    }, {
        status: "APPROVED" | "REJECTED";
        comments?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        status: "APPROVED" | "REJECTED";
        comments?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: "APPROVED" | "REJECTED";
        comments?: string | undefined;
    };
}>;
export declare const scmHandoffSchema: z.ZodObject<{
    params: z.ZodObject<{
        opportunityId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        opportunityId: string;
    }, {
        opportunityId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        opportunityId: string;
    };
}, {
    params: {
        opportunityId: string;
    };
}>;
//# sourceMappingURL=lifecycle.validation.d.ts.map