import { useState } from "react";
import { useOpportunity } from "../../hooks/useOpportunity";
import { DocumentStage } from "./workflow/DocumentStage";
import { PreSalesStage } from "./workflow/PreSalesStage";
import { OEMStage } from "./workflow/OEMStage";
import { QuoteStage } from "./workflow/QuoteStage";
import { CustomerStage } from "./workflow/CustomerStage";
import { OVFStage } from "./workflow/OVFStage";
import type { AttachmentsShape, TechnicalDetailsShape, OvfDetailsShape } from "../../types/pipeline.types";

interface OpportunityDetailProps {
  opportunityId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export function OpportunityDetail({ opportunityId, onClose, onUpdated }: OpportunityDetailProps) {
  const { opportunity, loading, error, updateAttachments, updateTechnical, updateOvf, markLost } = useOpportunity(opportunityId);
  const [lostReason, setLostReason] = useState("");
  const [showLost, setShowLost] = useState(false);

  const handleAttachments = (att: AttachmentsShape) => {
    updateAttachments(att).then(() => onUpdated());
  };
  const handleTechnical = (t: TechnicalDetailsShape) => {
    updateTechnical(t).then(() => onUpdated());
  };
  const handleOvf = (o: OvfDetailsShape) => {
    updateOvf(o).then(() => onUpdated());
  };

  if (loading) return <div className="p-6 text-slate-500">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!opportunity) return null;

  const att = (opportunity.attachments ?? {}) as AttachmentsShape;
  const tech = (opportunity.technicalDetails ?? {}) as TechnicalDetailsShape;
  const ovf = (opportunity.ovfDetails ?? {}) as OvfDetailsShape;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{opportunity.company?.name ?? "Opportunity"}</h3>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="text-sm px-2 py-1 border rounded text-slate-600">Close</button>
          {!opportunity.lostDeal && (
            <button type="button" onClick={() => setShowLost(true)} className="text-sm px-2 py-1 rounded bg-red-100 text-red-700">Mark Lost</button>
          )}
        </div>
      </div>
      <p className="text-slate-500 text-sm">Status: {opportunity.status}</p>

      <section className="border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 mb-2">Document stage</h4>
        <DocumentStage attachments={att} onUpdate={handleAttachments} />
      </section>
      <section className="border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 mb-2">Pre-sales</h4>
        <PreSalesStage />
      </section>
      <section className="border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 mb-2">OEM</h4>
        <OEMStage technicalDetails={tech} onUpdate={handleTechnical} />
      </section>
      <section className="border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 mb-2">Quote</h4>
        <QuoteStage attachments={att} onUpdate={handleAttachments} />
      </section>
      <section className="border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 mb-2">Customer / PO</h4>
        <CustomerStage />
      </section>
      <section className="border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 mb-2">OVF</h4>
        <OVFStage ovfDetails={ovf} onUpdate={handleOvf} />
      </section>

      {showLost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow max-w-sm w-full">
            <p className="text-sm mb-2">Lost reason (required)</p>
            <input value={lostReason} onChange={(e) => setLostReason(e.target.value)} className="w-full border rounded px-2 py-1 text-sm mb-2" placeholder="Reason" />
            <div className="flex gap-2">
              <button onClick={() => setShowLost(false)} className="text-sm px-2 py-1 border rounded">Cancel</button>
              <button
                onClick={() => {
                  if (lostReason.trim()) {
                    markLost(lostReason.trim()).then(() => { setShowLost(false); onUpdated(); });
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
