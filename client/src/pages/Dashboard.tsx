import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getHomeDashboard } from "../api/client";
import type { ApiResponse } from "../api/client";

type HomeDashboardData = {
  leadCountThisMonth: number;
  leadCountLastMonth: number;
  opportunityCountThisMonth: number;
  opportunityCountLastMonth: number;
  quoteCountThisMonth: number;
  quoteCountLastMonth: number;
  contactCountThisMonth: number;
  contactCountLastMonth: number;
  leadCountUserWise: { assignedTo: string | null; recordCount: number }[];
  leadCountStageWise: { stage: string; count: number }[];
};

const STAGE_LABELS: Record<string, string> = {
  OPEN: "Open",
  BOQ_SUBMITTED: "BOQ Received",
  SOW_ATTACHED: "SOW Attached",
  OEM_QUOTATION_RECEIVED: "OEM Quotation Received",
  QUOTE_CREATED: "Quote Created",
  OVF_CREATED: "OVF Created",
  APPROVAL_PENDING: "Approval Pending",
  APPROVED: "Approved",
  SENT_TO_SCM: "Sent to SCM",
  LOST_DEAL: "Lost",
};

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<HomeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    getHomeDashboard()
      .then((r: ApiResponse<HomeDashboardData>) => r.data && setData(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) return <div className="text-slate-500 py-8">Loading dashboard…</div>;
  if (error && !data) return <div className="text-red-600 py-4">{error}</div>;
  if (!data) return null;

  const displayName = user?.email?.split("@")[0] ?? user?.email ?? "User";
  const welcome = `Welcome ${displayName.replace(/\b\w/g, (c) => c.toUpperCase())}.`;

  return (
    <div className="space-y-6">
      {/* Header: Welcome + Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-900">{welcome}</h1>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          title="Refresh"
        >
          <span aria-hidden>↻</span> Refresh
        </button>
      </div>

      {/* KPI cards – same structure as Zoho: 4 cards with this month + % vs last month */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Lead count this month"
          value={data.leadCountThisMonth}
          previous={data.leadCountLastMonth}
        />
        <KpiCard
          title="Opportunity count this month"
          value={data.opportunityCountThisMonth}
          previous={data.opportunityCountLastMonth}
        />
        <KpiCard
          title="Quote count this month"
          value={data.quoteCountThisMonth}
          previous={data.quoteCountLastMonth}
        />
        <KpiCard
          title="Contact count this month"
          value={data.contactCountThisMonth}
          previous={data.contactCountLastMonth}
        />
      </div>

      {/* Two sections: Lead Count User Wise + Lead Count Stage Wise (funnel) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead count user wise */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Lead count user wise</h2>
            <button type="button" onClick={load} className="text-slate-400 hover:text-slate-600 p-1" title="Refresh">
              ↻
            </button>
          </div>
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-600">Lead owner</th>
                  <th className="text-right px-4 py-2.5 font-medium text-slate-600">Record count</th>
                </tr>
              </thead>
              <tbody>
                {data.leadCountUserWise.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 text-slate-800">{row.assignedTo || "Unassigned"}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-900">{row.recordCount}</td>
                  </tr>
                ))}
                {data.leadCountUserWise.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-slate-500">
                      No leads yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead count stage wise – funnel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Lead count stage wise</h2>
          </div>
          <div className="p-4">
            <FunnelChart items={data.leadCountStageWise.filter((s) => s.stage !== "LOST_DEAL")} />
            {data.leadCountStageWise.filter((s) => s.stage === "LOST_DEAL" && s.count > 0).length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm text-slate-600">
                <span>Lost</span>
                <span className="font-medium">
                  {data.leadCountStageWise.find((s) => s.stage === "LOST_DEAL")?.count ?? 0}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  previous,
}: {
  title: string;
  value: number;
  previous: number;
}) {
  const change = percentChange(value, previous);
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      {change !== null && (
        <p className={`text-sm mt-1 ${change > 0 ? "text-emerald-600" : change < 0 ? "text-red-600" : "text-slate-500"}`}>
          {change > 0 ? `Up ${change}%` : change < 0 ? `Down ${Math.abs(change)}%` : "No change"}
          {" from last month"}
        </p>
      )}
    </div>
  );
}

function FunnelChart({ items }: { items: { stage: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const colors = [
    "bg-amber-400",
    "bg-amber-300",
    "bg-orange-300",
    "bg-orange-200",
    "bg-sky-300",
    "bg-sky-200",
    "bg-emerald-400",
    "bg-emerald-300",
    "bg-slate-300",
  ];

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const widthPercent = max > 0 ? Math.max(8, (item.count / max) * 100) : 8;
        const label = STAGE_LABELS[item.stage] ?? item.stage.replace(/_/g, " ");
        return (
          <div key={item.stage} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div
                className={`h-8 rounded-md ${colors[i % colors.length]} transition-all duration-300 flex items-center justify-end pr-2`}
                style={{ width: `${widthPercent}%` }}
              >
                {item.count > 0 && (
                  <span className="text-xs font-medium text-slate-800">{item.count}</span>
                )}
              </div>
            </div>
            <span className="text-sm text-slate-600 w-36 shrink-0 truncate" title={label}>
              {label}
            </span>
          </div>
        );
      })}
      {items.length === 0 && (
        <p className="text-slate-500 text-sm py-4 text-center">No stage data yet</p>
      )}
    </div>
  );
}
