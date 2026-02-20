import type { PipelineCompany, PipelineLead, PipelineOpportunity } from "../../types/pipeline.types";

interface CompanyListProps {
  companies: PipelineCompany[];
  leads: PipelineLead[];
  opportunities: PipelineOpportunity[];
}

export function CompanyList({ companies, leads, opportunities }: CompanyListProps) {
  if (companies.length === 0) {
    return (
      <p className="text-slate-500 text-sm py-3">No companies yet. Create one to add leads.</p>
    );
  }
  return (
    <ul className="space-y-2">
      {companies.map((c) => {
        const companyLeads = leads.filter((l) => l.companyId === c.id);
        const companyOpps = opportunities.filter((o) => o.companyId === c.id);
        const activeLeads = companyLeads.filter((l) => l.status === "ACTIVE");
        return (
          <li key={c.id} className="text-sm text-slate-700">
            <span className="font-medium text-slate-900">{c.name}</span>
            <span className="text-slate-400 ml-1">
              ({activeLeads.length} active lead{activeLeads.length !== 1 ? "s" : ""}, {companyOpps.length} opp{companyOpps.length !== 1 ? "s" : ""})
            </span>
          </li>
        );
      })}
    </ul>
  );
}
