import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Cpu } from "lucide-react";
import { getDataAiProject } from "../../../api/client";

export function DataAiProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["data-ai", "projects", id],
    queryFn: () => getDataAiProject(id!),
    enabled: !!id,
  });
  const p = res?.data;
  const errMsg = error instanceof Error ? error.message : (res?.success === false ? res?.message : "");
  const tasks = (p as { tasks?: { id: string; title: string; status: string; assignedTo?: { email: string } }[] })?.tasks ?? [];

  if (!id) return <p className="text-slate-500">Invalid project.</p>;
  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (errMsg) return <div className="text-red-600 bg-red-50 rounded-lg p-3">{errMsg}</div>;
  if (!p) return <p className="text-slate-500">Project not found.</p>;

  const tl = (p as { tl?: { firstName: string; lastName: string; email: string } }).tl;
  const tlName = tl ? [tl.firstName, tl.lastName].filter(Boolean).join(" ") || tl.email : "—";
  return (
    <div>
      <Link to="/data-ai" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Data / AI
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Cpu className="w-7 h-7 text-slate-600" />
        {p.name}
      </h1>
      <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-2xl mb-6">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-slate-500">Tech Lead</dt>
          <dd>{tlName}</dd>
          <dt className="text-slate-500">Status</dt>
          <dd>{p.status}</dd>
          <dt className="text-slate-500">Description</dt>
          <dd className="col-span-2">{p.description || "—"}</dd>
        </dl>
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-slate-500 text-sm">No tasks yet.</p>
      ) : (
        <ul className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
          {tasks.map((t) => (
            <li key={t.id} className="px-4 py-3 flex justify-between text-sm">
              <span className="font-medium text-slate-900">{t.title}</span>
              <span className="text-slate-600">{t.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
