import type { Request, Response, NextFunction } from "express";
export declare function createCompany(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listCompanies(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createLead(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getActiveLeads(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function convertLead(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function markLeadLost(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listOpportunities(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getOpportunity(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateOpportunityStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateOpportunityAttachments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateOpportunityTechnical(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function sendOpportunityEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function approveOpportunity(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateOpportunityOvf(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function markOpportunityLost(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function pipelineUpload(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getPipelineFile(_req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=pipeline.controller.d.ts.map