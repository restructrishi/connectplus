export declare const pipelineRepository: {
    createCompany(name: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    listCompanies(): Promise<({
        _count: {
            leads: number;
            opportunities: number;
        };
        leads: {
            id: string;
            createdAt: Date;
            status: string;
            companyId: string;
            convertedAt: Date | null;
            lostReason: string | null;
            convertedToId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    })[]>;
    getCompanyById(id: string): Promise<({
        leads: {
            id: string;
            createdAt: Date;
            status: string;
            companyId: string;
            convertedAt: Date | null;
            lostReason: string | null;
            convertedToId: string | null;
        }[];
        opportunities: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            leadId: string | null;
            companyId: string;
            lostReason: string | null;
            approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            lostDeal: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }) | null>;
    createLead(companyId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        companyId: string;
        convertedAt: Date | null;
        lostReason: string | null;
        convertedToId: string | null;
    }>;
    getLeadById(id: string): Promise<({
        opportunity: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            leadId: string | null;
            companyId: string;
            lostReason: string | null;
            approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
            lostDeal: boolean;
        } | null;
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        companyId: string;
        convertedAt: Date | null;
        lostReason: string | null;
        convertedToId: string | null;
    }) | null>;
    getActiveLeads(): Promise<({
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        companyId: string;
        convertedAt: Date | null;
        lostReason: string | null;
        convertedToId: string | null;
    })[]>;
    convertLeadToOpportunity(leadId: string, opportunityId: string): Promise<void>;
    markLeadLost(leadId: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        companyId: string;
        convertedAt: Date | null;
        lostReason: string | null;
        convertedToId: string | null;
    }>;
    createOpportunity(companyId: string, leadId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    }>;
    listOpportunities(): Promise<({
        lead: {
            id: string;
            createdAt: Date;
            status: string;
            companyId: string;
            convertedAt: Date | null;
            lostReason: string | null;
            convertedToId: string | null;
        } | null;
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    })[]>;
    getOpportunityById(id: string): Promise<({
        lead: {
            id: string;
            createdAt: Date;
            status: string;
            companyId: string;
            convertedAt: Date | null;
            lostReason: string | null;
            convertedToId: string | null;
        } | null;
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    }) | null>;
    updateOpportunityStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    }>;
    updateOpportunityAttachments(id: string, attachments: object): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    }>;
    updateOpportunityTechnical(id: string, technicalDetails: object): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    }>;
    updateOpportunityApprovals(id: string, approvals: unknown[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    }>;
    updateOpportunityEmailsSent(id: string, emailsSent: unknown[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    }>;
    updateOpportunityOvf(id: string, ovfDetails: object): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    }>;
    markOpportunityLost(id: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string | null;
        companyId: string;
        lostReason: string | null;
        approvals: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        attachments: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        technicalDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        emailsSent: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        ovfDetails: import("../../../generated/prisma-client/runtime/library.js").JsonValue;
        lostDeal: boolean;
    }>;
};
//# sourceMappingURL=pipeline.repository.d.ts.map