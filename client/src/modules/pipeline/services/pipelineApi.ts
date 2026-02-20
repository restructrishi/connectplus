import { api } from "../../../api/client";
import type { PipelineCompany, PipelineLead, PipelineOpportunity } from "../types/pipeline.types";

const prefix = "/pipeline";

export const pipelineApi = {
  // Companies
  createCompany: (name: string) =>
    api.post<PipelineCompany>(`${prefix}/companies`, { name }),
  listCompanies: () =>
    api.get<PipelineCompany[]>(`${prefix}/companies`),

  // Leads
  createLead: (companyId: string) =>
    api.post<PipelineLead>(`${prefix}/leads`, { companyId }),
  getActiveLeads: () =>
    api.get<PipelineLead[]>(`${prefix}/leads/active`),
  convertLead: (leadId: string) =>
    api.put<PipelineOpportunity>(`${prefix}/leads/${leadId}/convert`),
  markLeadLost: (leadId: string, reason: string) =>
    api.put<PipelineLead>(`${prefix}/leads/${leadId}/lost`, { reason }),

  // Opportunities
  listOpportunities: () =>
    api.get<PipelineOpportunity[]>(`${prefix}/opportunities`),
  getOpportunity: (id: string) =>
    api.get<PipelineOpportunity>(`${prefix}/opportunities/${id}`),
  updateOpportunityStatus: (id: string, status: string) =>
    api.put<PipelineOpportunity>(`${prefix}/opportunities/${id}/status`, { status }),
  updateOpportunityAttachments: (id: string, attachments: object) =>
    api.put<PipelineOpportunity>(`${prefix}/opportunities/${id}/attachments`, attachments),
  updateOpportunityTechnical: (id: string, technicalDetails: object) =>
    api.put<PipelineOpportunity>(`${prefix}/opportunities/${id}/technical`, technicalDetails),
  sendOpportunityEmail: (id: string, body: { type?: string; to?: string[] }) =>
    api.post<PipelineOpportunity>(`${prefix}/opportunities/${id}/email`, body),
  approveOpportunity: (id: string, body: { approvalIndex?: number; status?: string; approvedBy?: string }) =>
    api.post<PipelineOpportunity>(`${prefix}/opportunities/${id}/approve`, body),
  updateOpportunityOvf: (id: string, ovfDetails: object) =>
    api.put<PipelineOpportunity>(`${prefix}/opportunities/${id}/ovf`, ovfDetails),
  markOpportunityLost: (id: string, reason: string) =>
    api.put<PipelineOpportunity>(`${prefix}/opportunities/${id}/lost`, { reason }),

  // Files
  upload: (body: { opportunityId?: string; type?: string }) =>
    api.post<{ key: string; url: string }>(`${prefix}/upload`, body),
};
