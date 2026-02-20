import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getLifecycleDashboard,
  listLifecycleOpportunities,
  createLifecycleCompany,
  listLifecycleCompanies,
} from "../api/client";

const STAGES = [
  "OPEN",
  "BOQ_SUBMITTED",
  "SOW_ATTACHED",
  "OEM_QUOTATION_RECEIVED",
  "QUOTE_CREATED",
  "OVF_CREATED",
  "APPROVAL_PENDING",
  "APPROVED",
  "SENT_TO_SCM",
  "LOST_DEAL",
];

export function SalesPipeline() {
  const [dashboard, setDashboard] = useState<{
    totalCompanies: number;
    openLeads: number;
    totalOpportunities: number;
    dealsByStage: Record<string, number>;
    approvalPendingCount: number;
    lostDealsCount: number;
    revenueForecast: number;
    conversionRatio: number;
  } | null>(null);
  const [opportunities, setOpportunities] = useState<{ id: string; name: string; stage: string; company?: { name: string }; estimatedValue?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getLifecycleDashboard()
      .then((r) => r.data && setDashboard(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    listLifecycleOpportunities({ pageSize: 50 })
      .then((r) => setOpportunities((r.data?.items as typeof opportunities) ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    listLifecycleCompanies({ pageSize: 100 })
      .then((r) => setCompanies((r.data?.items as { id: string; name: string }[]) ?? []))
      .catch(() => {});
  }, []);

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    createLifecycleCompany(companyName.trim())
      .then((r) => {
        if (r.data && typeof r.data === "object" && "id" in r.data)
          setCompanies((c) => [{ id: (r.data as { id: string }).id, name: companyName.trim() }, ...c]);
        setCompanyName("");
        getLifecycleDashboard().then((r) => r.data && setDashboard(r.data));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Create failed"));
  };

  if (loading) return <div className="text-slate-500">Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sales Lifecycle Pipeline</h1>
          <p className="text-slate-600 text-sm">
            Company → Lead → Opportunity → BOQ/SOW → OEM Quote → Quote → OVF → Approval → SCM. Stage-driven, role-based, audit-tracked.
          </p>
        </div>
        <Link
          to="/pipeline-engine"
          className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          Open Pipeline Engine →
        </Link>
      </div>

      {dashboard && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card title="Companies" value={dashboard.totalCompanies} />
          <Card title="Open Leads" value={dashboard.openLeads} />
          <Card title="Opportunities" value={dashboard.totalOpportunities} />
          <Card title="Approval Pending" value={dashboard.approvalPendingCount} />
          <Card title="Lost Deals" value={dashboard.lostDealsCount} />
          <Card title="Revenue Forecast" value={`₹${Number(dashboard.revenueForecast).toLocaleString()}`} />
          <Card title="Conversion %" value={`${dashboard.conversionRatio}%`} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Create Company</h2>
        <form onSubmit={handleCreateCompany} className="flex gap-2">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company name (required before Lead)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium">
            Create
          </button>
        </form>
        {companies.length > 0 && (
          <p className="text-slate-500 text-sm mt-2">Companies: {companies.map((c) => c.name).join(", ")}</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <h2 className="font-semibold text-slate-900 px-4 py-3 border-b border-slate-200">Deals by Stage</h2>
        <div className="p-4">
          {dashboard?.dealsByStage && (
            <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              {STAGES.map((stage) => (
                <li key={stage} className="flex justify-between">
                  <span className="text-slate-600">{stage.replace(/_/g, " ")}</span>
                  <span className="font-medium">{dashboard.dealsByStage[stage] ?? 0}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <h2 className="font-semibold text-slate-900 px-4 py-3 border-b border-slate-200">Recent Opportunities</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Company</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Stage</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {opportunities.slice(0, 20).map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-2 text-sm text-slate-900">{o.name}</td>
                  <td className="px-4 py-2 text-sm text-slate-600">{o.company?.name ?? "—"}</td>
                  <td className="px-4 py-2 text-sm text-slate-600">{o.stage?.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2 text-sm text-slate-600">{o.estimatedValue ? `₹${o.estimatedValue}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-slate-500 text-xs font-medium">{title}</p>
      <p className="text-lg font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
