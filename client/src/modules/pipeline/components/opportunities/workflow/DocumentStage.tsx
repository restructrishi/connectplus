import type { AttachmentsShape } from "../../../types/pipeline.types";

interface DocumentStageProps {
  attachments: AttachmentsShape | Record<string, unknown>;
  onUpdate: (attachments: AttachmentsShape) => void;
}

export function DocumentStage({ attachments, onUpdate }: DocumentStageProps) {
  const a = attachments as AttachmentsShape;
  const set = (key: keyof AttachmentsShape, value: Partial<AttachmentsShape[keyof AttachmentsShape]>) => {
    onUpdate({ ...attachments, [key]: { ...(a[key] as object), ...value } });
  };
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-slate-700">BOQ & SOW</p>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!a.boq?.attached} onChange={(e) => set("boq", { attached: e.target.checked })} />
        BOQ attached
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!a.sow?.attached} onChange={(e) => set("sow", { attached: e.target.checked })} />
        SOW attached
      </label>
    </div>
  );
}
