import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import { getDeployments, type DeploymentListItem } from "../../../api/client";

const STATUS_LABELS: Record<string, string> = {
  KICK_OFF_PENDING: "Kick-off Pending",
  SITE_SURVEY: "Site Survey",
  SEGREGATION: "Segregation",
  RACK_INSTALLATION: "Rack Installation",
  CONFIGURATION: "Configuration",
  TESTING: "Testing",
  LIVE: "Live",
  COMPLETED: "Completed",
  DELAYED: "Delayed",
};

export function DeploymentList() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["deployment", statusFilter || null],
    queryFn: () => getDeployments(statusFilter ? { status: statusFilter } : undefined),
  });

  const list: DeploymentListItem[] = res?.data ?? [];
  const errMsg = error instanceof Error ? error.message : (res?.success === false ? res?.message : "");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Truck className="w-7 h-7 text-slate-600" />
        Deployment
      </h1>
      {errMsg && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errMsg}
        </div>
      )}
      <div className="mb-4 flex gap-2 items-center">
        <span className="text-sm text-slate-600">Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">All</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Deal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No deployments yet. Deployments are created from won deals.
                  </td>
                </tr>
              ) : (
                list.map((d) => (
                  <tr key={d.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {d.deal?.dealName ?? d.dealId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {d.contact ? `${d.contact.firstName} ${d.contact.lastName} (${d.contact.companyName})` : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {STATUS_LABELS[d.status] ?? d.status}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link to={`/deployment/${d.id}`} className="text-slate-700 hover:text-slate-900 font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
