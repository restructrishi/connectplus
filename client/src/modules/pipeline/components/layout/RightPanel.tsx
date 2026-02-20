import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { OpportunityList } from "../opportunities/OpportunityList";
import { OpportunityDetail } from "../opportunities/OpportunityDetail";
import type { PipelineOpportunity } from "../../types/pipeline.types";

interface RightPanelProps {
  opportunities: PipelineOpportunity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onRefresh: () => void;
}

export function RightPanel({ opportunities, selectedId, onSelect, onRefresh }: RightPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold text-slate-900">Opportunities</h2>
        <Link
          to="/pipeline-engine"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 font-medium"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Pipeline Engine
        </Link>
      </div>
      <div className="flex-1 flex min-h-0">
        <div className="w-72 flex-shrink-0 border-r border-slate-200 overflow-y-auto">
          <OpportunityList opportunities={opportunities} selectedId={selectedId} onSelect={onSelect} />
        </div>
        <div className="flex-1 overflow-y-auto min-w-0">
          {selectedId ? (
            <OpportunityDetail opportunityId={selectedId} onClose={() => onSelect(null)} onUpdated={onRefresh} />
          ) : (
            <div className="p-6 text-slate-500 text-sm">
              <p className="font-medium text-slate-600 mb-1">Select an opportunity</p>
              <p className="text-slate-400 text-xs">Click one in the list to view details. For full stage workflow (BOQ, quote, approval), use Pipeline Engine.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
