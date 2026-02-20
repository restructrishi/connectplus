import { useState } from "react";
import type { PipelineLead } from "../../types/pipeline.types";
import { ConvertButton } from "./ConvertButton";

interface LeadCardProps {
  lead: PipelineLead;
  onConvert: (leadId: string) => void;
  onMarkLost: (leadId: string, reason: string) => void;
}

export function LeadCard({ lead, onConvert, onMarkLost }: LeadCardProps) {
  const [showLost, setShowLost] = useState(false);
  const [lostReason, setLostReason] = useState("");
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 border border-slate-200">
      <span className="text-sm text-slate-700">Lead #{lead.id.slice(-6)}</span>
      <div className="flex gap-2">
        <ConvertButton leadId={lead.id} onConvert={onConvert} />
        <button
          type="button"
          onClick={() => setShowLost(true)}
          className="text-xs px-2 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50"
        >
          Mark Lost
        </button>
      </div>
      {showLost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow max-w-sm w-full">
            <p className="text-sm mb-2">Lost reason (required)</p>
            <input
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm mb-2"
              placeholder="Reason"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowLost(false)} className="text-sm px-2 py-1 border rounded">Cancel</button>
              <button
                onClick={() => {
                  if (lostReason.trim()) {
                    onMarkLost(lead.id, lostReason.trim());
                    setShowLost(false);
                    setLostReason("");
                  }
                }}
                className="text-sm px-2 py-1 bg-red-600 text-white rounded"
              >
                Mark Lost
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
