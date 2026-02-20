interface ApprovalBadgeProps {
  label: string;
  variant: "action" | "sla" | "approved" | "rejected";
}

export function ApprovalBadge({ label, variant }: ApprovalBadgeProps) {
  const styles = {
    action: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    sla: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    rejected: "bg-red-500/20 text-red-300 border-red-500/40",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[variant]}`}>
      {label}
    </span>
  );
}
