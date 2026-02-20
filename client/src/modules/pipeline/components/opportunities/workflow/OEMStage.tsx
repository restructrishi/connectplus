import type { TechnicalDetailsShape } from "../../../types/pipeline.types";

interface OEMStageProps {
  technicalDetails: TechnicalDetailsShape | Record<string, unknown>;
  onUpdate: (d: TechnicalDetailsShape) => void;
}

export function OEMStage({ technicalDetails, onUpdate }: OEMStageProps) {
  const t = technicalDetails as TechnicalDetailsShape;
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-slate-700">OEM</p>
      <input
        placeholder="DR Number"
        value={t.drNumber ?? ""}
        onChange={(e) => onUpdate({ ...t, drNumber: e.target.value })}
        className="w-full border rounded px-2 py-1"
      />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!t.oemQuoteReceived} onChange={(e) => onUpdate({ ...t, oemQuoteReceived: e.target.checked })} />
        OEM quote received
      </label>
    </div>
  );
}
