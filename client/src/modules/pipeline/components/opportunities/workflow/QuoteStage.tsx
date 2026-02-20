import type { AttachmentsShape } from "../../../types/pipeline.types";

interface QuoteStageProps {
  attachments: AttachmentsShape | Record<string, unknown>;
  onUpdate: (attachments: AttachmentsShape) => void;
}

export function QuoteStage({ attachments, onUpdate }: QuoteStageProps) {
  const a = attachments as AttachmentsShape;
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-slate-700">Quote</p>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!a.quote?.created}
          onChange={(e) => onUpdate({ ...attachments, quote: { ...(a.quote as object), created: e.target.checked } })}
        />
        Quote created
      </label>
    </div>
  );
}
