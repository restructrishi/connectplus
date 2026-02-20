import type { OvfDetailsShape } from "../../../types/pipeline.types";

interface OVFStageProps {
  ovfDetails: OvfDetailsShape | Record<string, unknown>;
  onUpdate: (d: OvfDetailsShape) => void;
}

export function OVFStage({ ovfDetails, onUpdate }: OVFStageProps) {
  const o = ovfDetails as OvfDetailsShape;
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-slate-700">OVF</p>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!o.created} onChange={(e) => onUpdate({ ...o, created: e.target.checked })} />
        OVF created
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!o.approved} onChange={(e) => onUpdate({ ...o, approved: e.target.checked })} />
        Approved
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!o.sharedToSCM} onChange={(e) => onUpdate({ ...o, sharedToSCM: e.target.checked })} />
        Shared to SCM
      </label>
    </div>
  );
}
