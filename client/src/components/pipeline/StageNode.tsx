type PipelineNodeStatus = "PENDING" | "ACTIVE" | "APPROVED" | "REJECTED" | "LOCKED";

const STATUS_STYLES: Record<PipelineNodeStatus, string> = {
  PENDING: "bg-slate-100 border-slate-300 text-slate-500",
  ACTIVE: "bg-blue-50 border-blue-500 text-blue-800 shadow-md ring-2 ring-blue-400/60",
  APPROVED: "bg-emerald-50 border-emerald-500 text-emerald-800",
  REJECTED: "bg-red-50 border-red-500 text-red-700",
  LOCKED: "bg-slate-100 border-slate-400 text-slate-500",
};

const STAGE_LABELS: Record<string, string> = {
  OPEN: "Open",
  BOQ_SUBMITTED: "BOQ",
  SOW_ATTACHED: "SOW",
  OEM_QUOTATION_RECEIVED: "OEM",
  QUOTE_CREATED: "Quote",
  OVF_CREATED: "OVF",
  APPROVAL_PENDING: "Approval",
  APPROVED: "Approved",
  SENT_TO_SCM: "SCM",
  LOST_DEAL: "Lost",
};

export interface StageNodeProps {
  stageName: string;
  status: PipelineNodeStatus | string;
  isLocked: boolean;
  canExecute: boolean;
  approvedBy?: string;
  approvedAt?: string;
  slaHoursPending?: number;
  durationSeconds?: number;
  onClick?: () => void;
}

export function StageNode({
  stageName,
  status,
  isLocked,
  canExecute,
  approvedBy,
  approvedAt,
  slaHoursPending,
  durationSeconds,
  onClick,
}: StageNodeProps) {
  const label = STAGE_LABELS[stageName] ?? stageName.replace(/_/g, " ");
  const style = STATUS_STYLES[status as PipelineNodeStatus] ?? STATUS_STYLES.PENDING;
  const showLock = isLocked && status !== "APPROVED" && status !== "REJECTED";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center min-w-[88px] py-3 px-3 rounded-xl border-2
        transition-all duration-300 ease-out
        hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-400
        ${style}
        ${canExecute ? "cursor-pointer focus:ring-blue-400" : "cursor-default"}
      `}
    >
      {showLock && (
        <span className="absolute -top-1 -right-1 text-slate-500" title="Locked">
          🔒
        </span>
      )}
      <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
      {durationSeconds != null && durationSeconds > 0 && status === "APPROVED" && (
        <span className="text-xs mt-0.5 opacity-80">
          {durationSeconds < 3600 ? `${Math.round(durationSeconds / 60)}m` : `${(durationSeconds / 3600).toFixed(1)}h`}
        </span>
      )}
      {status === "ACTIVE" && stageName === "APPROVAL_PENDING" && slaHoursPending != null && (
        <span className="text-xs mt-0.5 text-amber-600" title="SLA">
          {slaHoursPending < 24 ? `${Math.round(slaHoursPending)}h` : `${(slaHoursPending / 24).toFixed(1)}d`} pending
        </span>
      )}
      {approvedBy && approvedAt && (
        <span className="text-[10px] mt-0.5 opacity-75 truncate max-w-full" title={`By ${approvedBy} at ${approvedAt}`}>
          ✓ {approvedBy?.slice(-6)}
        </span>
      )}
    </button>
  );
}
