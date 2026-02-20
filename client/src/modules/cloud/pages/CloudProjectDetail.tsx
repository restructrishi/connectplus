import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Cloud } from "lucide-react";
import { getCloudProject } from "../../../api/client";

export function CloudProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["cloud", "projects", id],
    queryFn: () => getCloudProject(id!),
    enabled: !!id,
  });
  const c = res?.data;
  const errMsg = error instanceof Error ? error.message : (res?.success === false ? res?.message : "");

  if (!id) return <p className="text-slate-500">Invalid project.</p>;
  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (errMsg) return <div className="text-red-600 bg-red-50 rounded-lg p-3">{errMsg}</div>;
  if (!c) return <p className="text-slate-500">Cloud project not found.</p>;

  const tl = (c as { tl?: { firstName: string; lastName: string; email: string } }).tl;
  const tlName = tl ? [tl.firstName, tl.lastName].filter(Boolean).join(" ") || tl.email : "—";
  return (
    <div>
      <Link to="/cloud" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Cloud
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Cloud className="w-7 h-7 text-slate-600" />
        {c.name}
      </h1>
      <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-2xl">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-slate-500">Tech Lead</dt>
          <dd>{tlName}</dd>
          <dt className="text-slate-500">Status</dt>
          <dd>{c.status}</dd>
          <dt className="text-slate-500">Description</dt>
          <dd className="col-span-2">{c.description || "—"}</dd>
          <dt className="text-slate-500">Created</dt>
          <dd>{c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}</dd>
        </dl>
      </div>
    </div>
  );
}
