import type { PipelineCompany, PipelineLead } from "../../types/pipeline.types";
import { LeadCard } from "./LeadCard";

interface LeadListProps {
  companies: PipelineCompany[];
  leads: PipelineLead[];
  onAddLead: (companyId: string) => void;
  onConvert: (leadId: string) => void;
  onMarkLost: (leadId: string, reason: string) => void;
}

export function LeadList({ companies, leads, onAddLead, onConvert, onMarkLost }: LeadListProps) {
  const leadsByCompany = companies.map((c) => ({
    company: c,
    leads: leads.filter((l) => l.companyId === c.id),
  }));

  return (
    <div className="space-y-4">
      {leadsByCompany.map(({ company, leads: companyLeads }) => (
        <div key={company.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 py-2 bg-slate-100 flex items-center justify-between">
            <span className="font-medium text-slate-900">{company.name}</span>
            <button
              type="button"
              onClick={() => onAddLead(company.id)}
              className="text-xs px-2 py-1 rounded bg-slate-700 text-white hover:bg-slate-600"
            >
              + Add Lead
            </button>
          </div>
          <div className="p-2 space-y-1">
            {companyLeads.length === 0 ? (
              <p className="text-slate-500 text-sm py-2 px-2">No active leads. Use “+ Add Lead” to create one.</p>
            ) : (
              companyLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onConvert={onConvert} onMarkLost={onMarkLost} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
