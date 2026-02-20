export declare function getLifecycleDashboard(): Promise<{
    totalCompanies: number;
    openLeads: number;
    totalOpportunities: number;
    dealsByStage: {
        [k: string]: number;
    };
    approvalPendingCount: number;
    lostDealsCount: number;
    revenueForecast: number;
    conversionRatio: number;
}>;
//# sourceMappingURL=lifecycle-dashboard.service.d.ts.map