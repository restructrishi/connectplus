import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Scale } from "lucide-react";
import { getLegalAgreement } from "../../../api/client";

export function AgreementDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["legal", "agreements", id],
    queryFn: () => getLegalAgreement(id!),
    enabled: !!id,
  });
  const a = res?.data;
  const errMsg = error instanceof Error ? error.message : (res?.success === false ? res?.message : "");

  if (!id) return <p className="text-slate-500">Invalid agreement.</p>;
  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (errMsg) return <div className="text-red-600 bg-red-50 rounded-lg p-3">{errMsg}</div>;
  if (!a) return <p className="text-slate-500">Agreement not found.</p>;

  const contact = (a as { contact?: { firstName: string; lastName: string; companyName: string } }).contact;
  const contactStr = contact ? `${contact.firstName} ${contact.lastName} (${contact.companyName})` : "—";
  return (
    <div>
      <Link to="/legal" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Legal & Compliance
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Scale className="w-7 h-7 text-slate-600" />
        {a.agreementNumber}
      </h1>
      <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-2xl">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-slate-500">Type</dt>
          <dd>{a.agreementType}</dd>
          <dt className="text-slate-500">Deal</dt>
          <dd>{(a as { deal?: { dealName: string } }).deal?.dealName ?? "—"}</dd>
          <dt className="text-slate-500">Contact</dt>
          <dd>{contactStr}</dd>
          <dt className="text-slate-500">Sent to client</dt>
          <dd>{a.sentToClient ? "Yes" : "No"}</dd>
          <dt className="text-slate-500">Signed</dt>
          <dd>{a.signed ? "Yes" : "No"}</dd>
          <dt className="text-slate-500">Created</dt>
          <dd>{a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}</dd>
        </dl>
      </div>
    </div>
  );
}
