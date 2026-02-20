import type { PipelineOpportunity } from "../../types/pipeline.types";

interface OpportunityListProps {
  opportunities: PipelineOpportunity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function OpportunityList({ opportunities, selectedId, onSelect }: OpportunityListProps) {
  if (opportunities.length === 0) {
    return (
      <div className="p-4 text-slate-500 text-sm">
        No opportunities. Convert a lead to create one.
      </div>
    );
  }
  return (
    <ul className="divide-y divide-slate-200">
      {opportunities.map((opp) => (
        <li key={opp.id}>
          <button
            type="button"
            onClick={() => onSelect(opp.id)}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 ${
              selectedId === opp.id ? "bg-slate-100 font-medium text-slate-900" : "text-slate-700"
            }`}
          >
            <span className="block truncate">{opp.company?.name ?? "Company"}</span>
            <span className="text-slate-400 text-xs">{opp.status?.replace(/_/g, " ").toLowerCase()}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
