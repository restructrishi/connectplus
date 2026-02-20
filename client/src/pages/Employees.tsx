import { useEffect, useState } from "react";
import { listSyncedEmployees } from "../api/client";

type Employee = {
  id: string;
  employeeCode?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  designation?: string | null;
  employmentType?: string | null;
  dateOfJoining?: string | null;
  departmentName?: string | null;
  syncedAt: string;
};

export function Employees() {
  const [items, setItems] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    listSyncedEmployees()
      .then((r) => {
        if (r.data) setItems(Array.isArray(r.data) ? (r.data as Employee[]) : []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load employees"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="text-slate-500">Loading employees…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Employees</h1>
      <p className="text-slate-600 text-sm mb-6">
        Synced from API Fetcher. Use API Fetcher to fetch and &quot;Save to database&quot; to update this list.
      </p>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Designation</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Joined</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Synced at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No employees yet. Use API Fetcher to fetch from your HRMS API, then click &quot;Save to database&quot;.
                  </td>
                </tr>
              ) : (
                items.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-sm text-slate-900">{e.employeeCode ?? "—"}</td>
                    <td className="px-4 py-2 text-sm text-slate-900">
                      {[e.firstName, e.lastName].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-600">{e.email ?? "—"}</td>
                    <td className="px-4 py-2 text-sm text-slate-600">{e.designation ?? "—"}</td>
                    <td className="px-4 py-2 text-sm text-slate-600">{e.employmentType ?? "—"}</td>
                    <td className="px-4 py-2 text-sm text-slate-600">{e.departmentName ?? "—"}</td>
                    <td className="px-4 py-2 text-sm text-slate-600">
                      {e.dateOfJoining ? new Date(e.dateOfJoining).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-500">
                      {e.syncedAt ? new Date(e.syncedAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
