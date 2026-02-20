import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Scale } from "lucide-react";
import { getLegalPolicy } from "../../../api/client";

export function PolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["legal", "policies", id],
    queryFn: () => getLegalPolicy(id!),
    enabled: !!id,
  });
  const p = res?.data;
  const errMsg = error instanceof Error ? error.message : (res?.success === false ? res?.message : "");

  if (!id) return <p className="text-slate-500">Invalid policy.</p>;
  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (errMsg) return <div className="text-red-600 bg-red-50 rounded-lg p-3">{errMsg}</div>;
  if (!p) return <p className="text-slate-500">Policy not found.</p>;

  const createdBy = (p as { createdBy?: { firstName: string; lastName: string; email: string } }).createdBy;
  const createdByName = createdBy ? [createdBy.firstName, createdBy.lastName].filter(Boolean).join(" ") || createdBy.email : "—";
  return (
    <div>
      <Link to="/legal" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Legal & Compliance
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Scale className="w-7 h-7 text-slate-600" />
        {p.policyNumber} – {p.title}
      </h1>
      <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-2xl">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-slate-500">Status</dt>
          <dd>{p.status}</dd>
          <dt className="text-slate-500">Created by</dt>
          <dd>{createdByName}</dd>
          <dt className="text-slate-500">Created</dt>
          <dd>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}</dd>
        </dl>
      </div>
    </div>
  );
}
