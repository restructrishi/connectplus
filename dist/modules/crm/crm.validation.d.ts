import { z } from "zod";
export declare const createLeadSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodString;
        company: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["NEW", "CONTACTED", "QUALIFIED", "LOST", "CONVERTED"]>>;
        assignedTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        source?: string | undefined;
        assignedTo?: string | undefined;
    }, {
        email: string;
        name: string;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        source?: string | undefined;
        assignedTo?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        name: string;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        source?: string | undefined;
        assignedTo?: string | undefined;
    };
}, {
    body: {
        email: string;
        name: string;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        source?: string | undefined;
        assignedTo?: string | undefined;
    };
}>;
export declare const updateLeadSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["NEW", "CONTACTED", "QUALIFIED", "LOST", "CONVERTED"]>>;
        assignedTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        name?: string | undefined;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        source?: string | undefined;
        assignedTo?: string | undefined;
    }, {
        email?: string | undefined;
        name?: string | undefined;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        source?: string | undefined;
        assignedTo?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        name?: string | undefined;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        source?: string | undefined;
        assignedTo?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        name?: string | undefined;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        source?: string | undefined;
        assignedTo?: string | undefined;
    };
}>;
export declare const listLeadsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    } & {
        status: z.ZodOptional<z.ZodEnum<["NEW", "CONTACTED", "QUALIFIED", "LOST", "CONVERTED"]>>;
        assignedTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        assignedTo?: string | undefined;
    }, {
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        assignedTo?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        pageSize: number;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        assignedTo?: string | undefined;
    };
}, {
    query: {
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED" | undefined;
        assignedTo?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    };
}>;
export declare const createClientSchema: z.ZodObject<{
    body: z.ZodObject<{
        companyName: z.ZodString;
        contactPerson: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodString;
        industry: z.ZodOptional<z.ZodString>;
        assignedTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        companyName: string;
        contactPerson: string;
        phone?: string | undefined;
        assignedTo?: string | undefined;
        industry?: string | undefined;
    }, {
        email: string;
        companyName: string;
        contactPerson: string;
        phone?: string | undefined;
        assignedTo?: string | undefined;
        industry?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        companyName: string;
        contactPerson: string;
        phone?: string | undefined;
        assignedTo?: string | undefined;
        industry?: string | undefined;
    };
}, {
    body: {
        email: string;
        companyName: string;
        contactPerson: string;
        phone?: string | undefined;
        assignedTo?: string | undefined;
        industry?: string | undefined;
    };
}>;
export declare const updateClientSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        companyName: z.ZodOptional<z.ZodString>;
        contactPerson: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        industry: z.ZodOptional<z.ZodString>;
        assignedTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        phone?: string | undefined;
        assignedTo?: string | undefined;
        companyName?: string | undefined;
        contactPerson?: string | undefined;
        industry?: string | undefined;
    }, {
        email?: string | undefined;
        phone?: string | undefined;
        assignedTo?: string | undefined;
        companyName?: string | undefined;
        contactPerson?: string | undefined;
        industry?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        phone?: string | undefined;
        assignedTo?: string | undefined;
        companyName?: string | undefined;
        contactPerson?: string | undefined;
        industry?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        phone?: string | undefined;
        assignedTo?: string | undefined;
        companyName?: string | undefined;
        contactPerson?: string | undefined;
        industry?: string | undefined;
    };
}>;
export declare const listClientsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    } & {
        assignedTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        assignedTo?: string | undefined;
    }, {
        assignedTo?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        pageSize: number;
        assignedTo?: string | undefined;
    };
}, {
    query: {
        assignedTo?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    };
}>;
export declare const createDealSchema: z.ZodObject<{
    body: z.ZodObject<{
        clientId: z.ZodString;
        value: z.ZodNumber;
        stage: z.ZodOptional<z.ZodEnum<["PROPOSAL", "NEGOTIATION", "WON", "LOST"]>>;
        expectedClosureDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        clientId: string;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
        expectedClosureDate?: string | Date | undefined;
    }, {
        value: number;
        clientId: string;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
        expectedClosureDate?: string | Date | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        value: number;
        clientId: string;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
        expectedClosureDate?: string | Date | undefined;
    };
}, {
    body: {
        value: number;
        clientId: string;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
        expectedClosureDate?: string | Date | undefined;
    };
}>;
export declare const updateDealSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        value: z.ZodOptional<z.ZodNumber>;
        stage: z.ZodOptional<z.ZodEnum<["PROPOSAL", "NEGOTIATION", "WON", "LOST"]>>;
        expectedClosureDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodNullable<z.ZodOptional<z.ZodDate>>]>;
    }, "strip", z.ZodTypeAny, {
        value?: number | undefined;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
        expectedClosureDate?: string | Date | null | undefined;
    }, {
        value?: number | undefined;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
        expectedClosureDate?: string | Date | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        value?: number | undefined;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
        expectedClosureDate?: string | Date | null | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        value?: number | undefined;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
        expectedClosureDate?: string | Date | null | undefined;
    };
}>;
export declare const listDealsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    } & {
        clientId: z.ZodOptional<z.ZodString>;
        stage: z.ZodOptional<z.ZodEnum<["PROPOSAL", "NEGOTIATION", "WON", "LOST"]>>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        clientId?: string | undefined;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
    }, {
        clientId?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        pageSize: number;
        clientId?: string | undefined;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
    };
}, {
    query: {
        clientId?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        stage?: "LOST" | "PROPOSAL" | "NEGOTIATION" | "WON" | undefined;
    };
}>;
export declare const createActivitySchema: z.ZodObject<{
    body: z.ZodObject<{
        leadId: z.ZodOptional<z.ZodString>;
        clientId: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["CALL", "MEETING", "EMAIL", "FOLLOWUP"]>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "CALL" | "MEETING" | "EMAIL" | "FOLLOWUP";
        clientId?: string | undefined;
        notes?: string | undefined;
        leadId?: string | undefined;
    }, {
        type: "CALL" | "MEETING" | "EMAIL" | "FOLLOWUP";
        clientId?: string | undefined;
        notes?: string | undefined;
        leadId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: "CALL" | "MEETING" | "EMAIL" | "FOLLOWUP";
        clientId?: string | undefined;
        notes?: string | undefined;
        leadId?: string | undefined;
    };
}, {
    body: {
        type: "CALL" | "MEETING" | "EMAIL" | "FOLLOWUP";
        clientId?: string | undefined;
        notes?: string | undefined;
        leadId?: string | undefined;
    };
}>;
export declare const listActivitiesSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    } & {
        leadId: z.ZodOptional<z.ZodString>;
        clientId: z.ZodOptional<z.ZodString>;
        createdBy: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        clientId?: string | undefined;
        createdBy?: string | undefined;
        leadId?: string | undefined;
    }, {
        clientId?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        createdBy?: string | undefined;
        leadId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        pageSize: number;
        clientId?: string | undefined;
        createdBy?: string | undefined;
        leadId?: string | undefined;
    };
}, {
    query: {
        clientId?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        createdBy?: string | undefined;
        leadId?: string | undefined;
    };
}>;
export declare const createTaskSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        assignedTo: z.ZodString;
        dueDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
        status: z.ZodOptional<z.ZodEnum<["PENDING", "COMPLETED"]>>;
    }, "strip", z.ZodTypeAny, {
        assignedTo: string;
        title: string;
        status?: "PENDING" | "COMPLETED" | undefined;
        description?: string | undefined;
        dueDate?: string | Date | undefined;
    }, {
        assignedTo: string;
        title: string;
        status?: "PENDING" | "COMPLETED" | undefined;
        description?: string | undefined;
        dueDate?: string | Date | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        assignedTo: string;
        title: string;
        status?: "PENDING" | "COMPLETED" | undefined;
        description?: string | undefined;
        dueDate?: string | Date | undefined;
    };
}, {
    body: {
        assignedTo: string;
        title: string;
        status?: "PENDING" | "COMPLETED" | undefined;
        description?: string | undefined;
        dueDate?: string | Date | undefined;
    };
}>;
export declare const updateTaskSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        assignedTo: z.ZodOptional<z.ZodString>;
        dueDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodNullable<z.ZodOptional<z.ZodDate>>]>;
        status: z.ZodOptional<z.ZodEnum<["PENDING", "COMPLETED"]>>;
    }, "strip", z.ZodTypeAny, {
        status?: "PENDING" | "COMPLETED" | undefined;
        assignedTo?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        dueDate?: string | Date | null | undefined;
    }, {
        status?: "PENDING" | "COMPLETED" | undefined;
        assignedTo?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        dueDate?: string | Date | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        status?: "PENDING" | "COMPLETED" | undefined;
        assignedTo?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        dueDate?: string | Date | null | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status?: "PENDING" | "COMPLETED" | undefined;
        assignedTo?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        dueDate?: string | Date | null | undefined;
    };
}>;
export declare const listTasksSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    } & {
        assignedTo: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["PENDING", "COMPLETED"]>>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        status?: "PENDING" | "COMPLETED" | undefined;
        assignedTo?: string | undefined;
    }, {
        status?: "PENDING" | "COMPLETED" | undefined;
        assignedTo?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        pageSize: number;
        status?: "PENDING" | "COMPLETED" | undefined;
        assignedTo?: string | undefined;
    };
}, {
    query: {
        status?: "PENDING" | "COMPLETED" | undefined;
        assignedTo?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    };
}>;
export declare const listAuditSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    } & {
        userId: z.ZodOptional<z.ZodString>;
        entityType: z.ZodOptional<z.ZodString>;
        entityId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        userId?: string | undefined;
        entityType?: string | undefined;
        entityId?: string | undefined;
    }, {
        userId?: string | undefined;
        entityType?: string | undefined;
        entityId?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        pageSize: number;
        userId?: string | undefined;
        entityType?: string | undefined;
        entityId?: string | undefined;
    };
}, {
    query: {
        userId?: string | undefined;
        entityType?: string | undefined;
        entityId?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    };
}>;
//# sourceMappingURL=crm.validation.d.ts.map