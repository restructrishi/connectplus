import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";
import { getDataAiProjects, type DataAiProjectListItem } from "../../../api/client";

export function DataAiProjectList() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["data-ai", "projects", statusFilter || null],
    queryFn: () => getDataAiProjects(statusFilter ? { status: statusFilter } : undefined),
  });

  const list: DataAiProjectListItem[] = res?.data ?? [];
  const errMsg = error instanceof Error ? error.message : (res?.success === false ? res?.message : "");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Cpu className="w-7 h-7 text-slate-600" />
        Data / AI – Projects
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
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
      </div>
      {isLoading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tech Lead</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tasks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No projects yet. Create projects and assign a Tech Lead.
                  </td>
                </tr>
              ) : (
                list.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {p.tl ? [p.tl.firstName, p.tl.lastName].filter(Boolean).join(" ") || p.tl.email : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{p.status}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{p._count?.tasks ?? 0}</td>
                    <td className="px-4 py-3 text-sm">
                      <Link to={`/data-ai/projects/${p.id}`} className="text-slate-700 hover:text-slate-900 font-medium">
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
