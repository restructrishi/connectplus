export declare const dashboardService: {
    getSummary(): Promise<{
        totalLeads: number;
        leadsByStatus: {
            [k: string]: number;
        };
        totalClients: number;
        dealsWonThisMonth: number;
        revenueThisMonth: number;
        totalRevenue: number;
        teamPerformance: {
            employeeId: string | null;
            leadCount: number;
        }[];
    }>;
};
//# sourceMappingURL=dashboard.service.d.ts.map