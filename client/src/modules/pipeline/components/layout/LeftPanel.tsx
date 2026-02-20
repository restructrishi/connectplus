import { CompanyList } from "../companies/CompanyList";
import { LeadList } from "../leads/LeadList";
import type { PipelineCompany, PipelineLead, PipelineOpportunity } from "../../types/pipeline.types";

interface LeftPanelProps {
  companies: PipelineCompany[];
  leads: PipelineLead[];
  opportunities: PipelineOpportunity[];
  onAddLead: (companyId: string) => void;
  onConvert: (leadId: string) => void;
  onMarkLost: (leadId: string, reason: string) => void;
}

export function LeftPanel({ companies, leads, opportunities, onAddLead, onConvert, onMarkLost }: LeftPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-900">Companies & leads</h2>
        <p className="text-xs text-slate-500 mt-0.5">Add leads, convert to opportunity.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <section>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Companies</h3>
          <CompanyList companies={companies} leads={leads} opportunities={opportunities} />
        </section>
        <section>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Active leads by company</h3>
          <LeadList
            companies={companies}
            leads={leads}
            onAddLead={onAddLead}
            onConvert={onConvert}
            onMarkLost={onMarkLost}
          />
        </section>
      </div>
    </div>
  );
}
