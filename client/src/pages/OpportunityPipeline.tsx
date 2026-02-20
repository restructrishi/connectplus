import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  listLifecycleOpportunities,
  getLifecyclePipeline,
  lifecycleTransitionStage,
  listLifecyclePendingApprovals,
  lifecycleApprovalDecide,
} from "../api/client";
import { PipelineContainer } from "../components/pipeline/PipelineContainer";
import { ApprovalBadge } from "../components/pipeline/ApprovalBadge";
import type { PipelineView, PipelineStageView } from "../types/pipeline";

const STAGE_ORDER = [
  "OPEN",
  "BOQ_SUBMITTED",
  "SOW_ATTACHED",
  "OEM_QUOTATION_RECEIVED",
  "QUOTE_CREATED",
  "OVF_CREATED",
  "APPROVAL_PENDING",
  "APPROVED",
  "SENT_TO_SCM",
];

export function OpportunityPipeline() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<{ id: string; name: string; stage: string; company?: { name: string } }[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<PipelineView | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<{ id: string; opportunityId: string; opportunity?: { name: string } }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionModal, setActionModal] = useState<"approve" | "reject" | "lost" | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPipeline = useCallback((id: string) => {
    setLoading(true);
    setError("");
    getLifecyclePipeline(id)
      .then((r) => {
        if (r.data) setPipeline(r.data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load pipeline"))
      .finally(() => setLoading(false));
  }, []);

  const refreshOpportunities = useCallback(() => {
    listLifecycleOpportunities({ pageSize: 100 })
      .then((r) => {
        const raw = r.data;
        const list = Array.isArray(raw) ? raw : (raw && typeof raw === "object" && "items" in raw ? (raw as { items: { id: string; name: string; stage: string; company?: { name: string } }[] }).items : []);
        setOpportunities(Array.isArray(list) ? list : []);
      })
      .catch(() => setOpportunities([]));
  }, []);

  useEffect(() => {
    refreshOpportunities();
  }, [refreshOpportunities]);

  useEffect(() => {
    if (user?.role === "MANAGEMENT" || user?.role === "SUPER_ADMIN") {
      listLifecyclePendingApprovals()
        .then((r) => setPendingApprovals((r.data as typeof pendingApprovals) ?? []))
        .catch(() => {});
    }
  }, [user?.role]);

  useEffect(() => {
    if (selectedId) fetchPipeline(selectedId);
    else setPipeline(null);
  }, [selectedId, fetchPipeline]);

  const refreshPipeline = () => {
    refreshOpportunities();
    if (selectedId) fetchPipeline(selectedId);
    if (user?.role === "MANAGEMENT" || user?.role === "SUPER_ADMIN") {
      listLifecyclePendingApprovals()
        .then((r) => setPendingApprovals((r.data as typeof pendingApprovals) ?? []))
        .catch(() => {});
    }
  };

  const approvalForOpportunity = selectedId ? pendingApprovals.find((a) => a.opportunityId === selectedId) : null;

  const handleApprove = () => {
    if (!approvalForOpportunity?.id) return;
    setSubmitting(true);
    lifecycleApprovalDecide(approvalForOpportunity.id, { status: "APPROVED", comments: comment || undefined })
      .then(() => {
        setActionModal(null);
        setComment("");
        refreshPipeline();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Approve failed"))
      .finally(() => setSubmitting(false));
  };

  const handleReject = () => {
    if (!approvalForOpportunity?.id) return;
    setSubmitting(true);
    lifecycleApprovalDecide(approvalForOpportunity.id, { status: "REJECTED", comments: comment || undefined })
      .then(() => {
        setActionModal(null);
        setComment("");
        refreshPipeline();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Reject failed"))
      .finally(() => setSubmitting(false));
  };

  const handleMarkLost = () => {
    if (!selectedId || !comment.trim()) return;
    setSubmitting(true);
    lifecycleTransitionStage(selectedId, { stage: "LOST_DEAL", lostReason: comment.trim() })
      .then(() => {
        setActionModal(null);
        setComment("");
        refreshPipeline();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Mark lost failed"))
      .finally(() => setSubmitting(false));
  };

  const handleStageClick = (stage: PipelineStageView) => {
    if (!stage.canExecute || !selectedId) return;
    if (stage.stageName === "APPROVAL_PENDING" && (user?.role === "MANAGEMENT" || user?.role === "SUPER_ADMIN")) {
      setActionModal("approve");
      return;
    }
    if (stage.stageName === "LOST_DEAL" || pipeline?.currentStage === "LOST_DEAL") return;
    if (stage.status === "ACTIVE" && stage.stageName === "APPROVAL_PENDING") setActionModal("approve");
  };

  const marginColor = pipeline?.marginIndicator === "green" ? "text-emerald-600" : pipeline?.marginIndicator === "yellow" ? "text-amber-600" : pipeline?.marginIndicator === "red" ? "text-red-600" : "text-slate-600";
  const riskColor = (pipeline?.riskScore ?? 0) <= 33 ? "text-emerald-600" : (pipeline?.riskScore ?? 0) <= 66 ? "text-amber-600" : "text-red-600";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Pipeline Engine</h1>
          <span className="text-slate-500 text-sm">Role: {user?.role?.replace("_", " ")}</span>
        </div>

        {/* Opportunity selector */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-slate-600 text-sm font-medium mb-2">Select Opportunity</label>
              <select
                value={selectedId ?? ""}
                onChange={(e) => setSelectedId(e.target.value || null)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">— Choose opportunity —</option>
                {opportunities.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.company?.name ?? "—"}) · {String(o.stage || "").replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={refreshOpportunities}
              className="mt-6 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh list
            </button>
          </div>
        </div>

        {/* Empty state when no opportunities */}
        {opportunities.length === 0 && !loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">No opportunities yet</h2>
            <p className="text-slate-600 text-sm mb-4">
              Pipeline Engine shows the stage workflow (BOQ → Quote → OVF → Approval) for opportunities from the Lifecycle flow.
            </p>
            <p className="text-slate-600 text-sm mb-4">
              To see data here, create companies and leads in <strong>Sales Pipeline</strong>, then convert a lead to create an opportunity. If your setup uses the Lifecycle API, create opportunities there and they will appear in the dropdown above.
            </p>
            <Link
              to="/pipeline"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
            >
              Go to Sales Pipeline
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12 text-slate-500">Loading pipeline…</div>
        )}

        {!loading && pipeline && (
          <>
            {/* Deal header: value, margin, risk */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm">
                <p className="text-slate-500 text-xs uppercase tracking-wider">Deal</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{pipeline.opportunityName}</p>
                <p className="text-slate-600 text-sm">{pipeline.companyName}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm">
                <p className="text-slate-500 text-xs uppercase tracking-wider">Value</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  ₹{pipeline.estimatedValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm">
                <p className="text-slate-500 text-xs uppercase tracking-wider">Margin</p>
                <p className={`text-xl font-bold mt-0.5 ${marginColor}`}>
                  {pipeline.marginPercent != null ? `${pipeline.marginPercent}%` : "—"}
                </p>
                {pipeline.marginIndicator !== "none" && (
                  <ApprovalBadge
                    label={pipeline.marginIndicator === "green" ? "Healthy" : pipeline.marginIndicator === "yellow" ? "Watch" : "Low"}
                    variant={pipeline.marginIndicator === "green" ? "approved" : pipeline.marginIndicator === "yellow" ? "action" : "rejected"}
                  />
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm">
                <p className="text-slate-500 text-xs uppercase tracking-wider">Risk Score</p>
                <p className={`text-xl font-bold mt-0.5 ${riskColor}`}>{pipeline.riskScore}</p>
              </div>
              {pipeline.currentStage === "APPROVAL_PENDING" && pipeline.approvalSlaHours != null && pipeline.approvalSlaHours > 24 && (
                <ApprovalBadge label={`SLA: ${(pipeline.approvalSlaHours / 24).toFixed(1)} days`} variant="sla" />
              )}
              {pipeline.currentStage === "APPROVAL_PENDING" && approvalForOpportunity && (user?.role === "MANAGEMENT" || user?.role === "SUPER_ADMIN") && (
                <ApprovalBadge label="Action Required" variant="action" />
              )}
            </div>

            {/* Horizontal pipeline (Jenkins-style stage flow) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-slate-700 font-semibold">Stage flow</h2>
                {(() => {
                  const visualStages = pipeline.stages.filter((s) => s.stageName !== "LOST_DEAL");
                  const activeIndex = visualStages.findIndex((s) => s.status === "ACTIVE");
                  const completedCount = visualStages.filter((s) => s.status === "APPROVED").length;
                  const currentStep = activeIndex >= 0 ? activeIndex + 1 : completedCount;
                  return (
                    <span className="text-slate-500 text-sm">
                      Step {currentStep} of {visualStages.length}
                      {pipeline.currentStage && (
                        <span className="ml-2 text-slate-600">
                          · {String(pipeline.currentStage).replace(/_/g, " ")}
                        </span>
                      )}
                    </span>
                  );
                })()}
              </div>
              <PipelineContainer stages={pipeline.stages} onStageClick={handleStageClick} />
              {pipeline.currentStage === "LOST_DEAL" && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  Deal Lost
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity timeline */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm sticky top-4">
                  <h3 className="text-slate-600 text-sm font-semibold uppercase tracking-wider mb-3">Activity Timeline</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {pipeline.timeline.length === 0 && <p className="text-slate-500 text-sm">No activity yet.</p>}
                    {pipeline.timeline.map((t, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <div className="flex-shrink-0 w-1.5 rounded-full bg-blue-500" />
                        <div>
                          <p className="text-slate-800">{t.action.replace(/_/g, " ")}</p>
                          <p className="text-slate-500 text-xs">
                            {t.userId} · {new Date(t.createdAt).toLocaleString()}
                          </p>
                          {t.comment && <p className="text-slate-600 text-xs mt-0.5">{t.comment}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions + content */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-4">
                  <h3 className="text-slate-600 text-sm font-semibold uppercase tracking-wider mb-3">Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    {!pipeline.isLocked && pipeline.currentStage === "APPROVAL_PENDING" && (user?.role === "MANAGEMENT" || user?.role === "SUPER_ADMIN") && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActionModal("approve")}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setActionModal("reject")}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {!pipeline.isLocked && pipeline.currentStage !== "LOST_DEAL" && pipeline.currentStage !== "SENT_TO_SCM" && (
                      <button
                        type="button"
                        onClick={() => setActionModal("lost")}
                        className="px-4 py-2 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-medium text-sm"
                      >
                        Mark Lost
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-slate-600 text-sm font-semibold uppercase tracking-wider mb-3">Stage Summary</h3>
                  <p className="text-slate-600 text-sm">
                    Current stage: <span className="text-slate-900 font-medium">{pipeline.currentStage.replace(/_/g, " ")}</span>
                    {pipeline.isLocked && " (Locked)"}
                  </p>
                  <ul className="mt-2 text-sm text-slate-600 space-y-1">
                    {STAGE_ORDER.map((s) => {
                      const st = pipeline.stages.find((x) => x.stageName === s);
                      if (!st) return null;
                      return (
                        <li key={s}>
                          {s.replace(/_/g, " ")}: {st.status}
                          {st.durationSeconds != null && st.durationSeconds > 0 && ` (${(st.durationSeconds / 3600).toFixed(1)}h)`}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && !pipeline && selectedId && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">
            Could not load pipeline for this opportunity. It may be from a different system (e.g. Sales Pipeline uses a separate pipeline API).
          </div>
        )}

        {!loading && opportunities.length > 0 && !selectedId && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600 text-sm">
            Select an opportunity from the dropdown above to view its pipeline and actions.
          </div>
        )}
      </div>

      {/* Modals - light theme */}
      {actionModal === "approve" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Approve OVF</h3>
            <p className="text-slate-600 text-sm mb-4">This will move the deal to Approved and unlock SCM handoff.</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comments (optional)"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm mb-4 resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button onClick={handleApprove} disabled={submitting} className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50">
                {submitting ? "…" : "Approve"}
              </button>
              <button onClick={() => setActionModal(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {actionModal === "reject" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Reject OVF</h3>
            <p className="text-slate-600 text-sm mb-4">Deal will return to OVF stage for resubmission.</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comments (required)"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm mb-4 resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button onClick={handleReject} disabled={submitting} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium disabled:opacity-50">
                {submitting ? "…" : "Reject"}
              </button>
              <button onClick={() => setActionModal(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {actionModal === "lost" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Mark as Lost</h3>
            <p className="text-slate-600 text-sm mb-4">Reason is required. The deal will be locked.</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Lost reason (required)"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm mb-4 resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button onClick={handleMarkLost} disabled={submitting || !comment.trim()} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium disabled:opacity-50">
                {submitting ? "…" : "Mark Lost"}
              </button>
              <button onClick={() => setActionModal(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
