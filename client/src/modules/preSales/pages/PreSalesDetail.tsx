import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileSearch, ClipboardList, Layers, Receipt } from "lucide-react";
import { getPreSales, updatePreSales, type PreSalesListItem } from "../../../api/client";

function safeJsonStringify(obj: Record<string, unknown>): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return "{}";
  }
}

export function PreSalesDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["pre-sales", id],
    queryFn: () => getPreSales(id!),
    enabled: !!id,
  });
  const updatePs = useMutation({
    mutationFn: (body: Record<string, unknown>) => updatePreSales(id!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pre-sales", id] }),
  });

  const p = res?.data as PreSalesListItem | undefined;
  const errMsg = error instanceof Error ? error.message : (res?.success === false ? res?.message : "");

  if (!id) return <p className="text-slate-500">Invalid ID.</p>;
  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (errMsg) return <div className="text-red-600 bg-red-50 rounded-lg p-3">{errMsg}</div>;
  if (!p) return <p className="text-slate-500">Pre-sales record not found.</p>;

  const createdBy = p.createdBy
    ? [p.createdBy.firstName, p.createdBy.lastName].filter(Boolean).join(" ") || p.createdBy.email
    : "—";
  const dealName = p.deal?.dealName ?? p.dealId;

  return (
    <div>
      <Link to="/pre-sales" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Pre-Sales
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <FileSearch className="w-7 h-7 text-slate-600" />
        Pre-Sales details
      </h1>

      <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-2xl mb-6">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-slate-500">Deal</dt>
          <dd className="font-medium">{dealName}</dd>
          <dt className="text-slate-500">Handover date</dt>
          <dd>{p.handoverDate ? new Date(p.handoverDate).toLocaleDateString() : "—"}</dd>
          <dt className="text-slate-500">Handover notes</dt>
          <dd>{p.handoverNotes ?? "—"}</dd>
          <dt className="text-slate-500">Proposal generated</dt>
          <dd>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!p.proposalGenerated}
                onChange={(e) => updatePs.mutate({ proposalGenerated: e.target.checked })}
                disabled={updatePs.isPending}
              />
              {p.proposalGenerated ? "Yes" : "No"}
            </label>
          </dd>
          <dt className="text-slate-500">Created by</dt>
          <dd>{createdBy}</dd>
          <dt className="text-slate-500">Created</dt>
          <dd>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}</dd>
        </dl>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PreSalesJsonSection
          title="Requirement analysis"
          icon={<ClipboardList className="w-4 h-4" />}
          data={p.requirementAnalysis ?? {}}
          onSave={(requirementAnalysis) => updatePs.mutate({ requirementAnalysis })}
          isSaving={updatePs.isPending}
        />
        <PreSalesJsonSection
          title="Solution design"
          icon={<Layers className="w-4 h-4" />}
          data={p.solutionDesign ?? {}}
          onSave={(solutionDesign) => updatePs.mutate({ solutionDesign })}
          isSaving={updatePs.isPending}
        />
      </div>
      <div className="mt-6">
        <PreSalesJsonSection
          title="BOQ (Bill of quantities)"
          icon={<Receipt className="w-4 h-4" />}
          data={p.boq ?? {}}
          onSave={(boq) => updatePs.mutate({ boq })}
          isSaving={updatePs.isPending}
        />
      </div>
    </div>
  );
}

function PreSalesJsonSection({
  title,
  icon,
  data,
  onSave,
  isSaving,
}: {
  title: string;
  icon: React.ReactNode;
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  isSaving: boolean;
}) {
  const [text, setText] = useState(() => safeJsonStringify(data));

  const handleSave = () => {
    try {
      const parsed = JSON.parse(text || "{}") as Record<string, unknown>;
      onSave(parsed);
    } catch {
      // invalid json
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
        {icon} {title}
      </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full rounded border border-slate-300 px-2 py-1.5 font-mono text-sm"
        placeholder='{}'
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="mt-2 rounded bg-slate-700 text-white px-3 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
