interface StageConnectorProps {
  fromStatus: "PENDING" | "ACTIVE" | "APPROVED" | "REJECTED" | "LOCKED";
  toStatus: "PENDING" | "ACTIVE" | "APPROVED" | "REJECTED" | "LOCKED";
}

export function StageConnector({ fromStatus, toStatus }: StageConnectorProps) {
  const approved = fromStatus === "APPROVED";
  const active = toStatus === "ACTIVE";
  const lineColor = approved && active ? "bg-emerald-400" : approved ? "bg-emerald-300" : "bg-slate-300";

  return (
    <div className="flex items-center flex-shrink-0 px-1 relative">
      <div className={`h-0.5 w-6 sm:w-8 rounded-full ${lineColor} transition-colors duration-300`} />
      {active && (
        <span className="absolute right-0 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      )}
    </div>
  );
}
