import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Truck, Calendar, MapPin, CheckCircle } from "lucide-react";
import { getDeployment, updateDeployment, type DeploymentListItem } from "../../../api/client";

const DEPLOYMENT_STEPS: { key: string; label: string }[] = [
  { key: "KICK_OFF_PENDING", label: "Kick-off" },
  { key: "SITE_SURVEY", label: "Site survey" },
  { key: "SEGREGATION", label: "Segregation" },
  { key: "RACK_INSTALLATION", label: "Rack installation" },
  { key: "CONFIGURATION", label: "Configuration" },
  { key: "TESTING", label: "Testing" },
  { key: "LIVE", label: "Live" },
  { key: "COMPLETED", label: "Completed" },
  { key: "DELAYED", label: "Delayed" },
];

type DeploymentDetailData = DeploymentListItem & {
  kickOffMeeting?: Record<string, unknown>;
  siteSurvey?: Record<string, unknown>;
};

export function DeploymentDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["deployment", id],
    queryFn: () => getDeployment(id!),
    enabled: !!id,
  });
  const updateDep = useMutation({
    mutationFn: (body: Record<string, unknown>) => updateDeployment(id!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deployment", id] }),
  });

  const d = res?.data as DeploymentDetailData | undefined;
  const errMsg = error instanceof Error ? error.message : (res?.success === false ? res?.message : "");

  if (!id) return <p className="text-slate-500">Invalid deployment.</p>;
  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (errMsg) return <div className="text-red-600 bg-red-50 rounded-lg p-3">{errMsg}</div>;
  if (!d) return <p className="text-slate-500">Deployment not found.</p>;

  const contact = d.contact;
  const contactLabel = contact
    ? [contact.firstName, contact.lastName].filter(Boolean).join(" ") + (contact.companyName ? ` (${contact.companyName})` : "")
    : "—";
  const kickOff = d.kickOffMeeting ?? {};
  const siteSurveyData = d.siteSurvey ?? {};
  const dealName = d.deal?.dealName ?? d.dealId;
  const currentStepIndex = DEPLOYMENT_STEPS.findIndex((s) => s.key === d.status);
  const isDelayed = d.status === "DELAYED";

  return (
    <div>
      <Link to="/deployment" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Deployment
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Truck className="w-7 h-7 text-slate-600" />
        Deployment details
      </h1>

      <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-2xl mb-6">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-slate-500">Deal</dt>
          <dd className="font-medium">{dealName}</dd>
          <dt className="text-slate-500">Contact</dt>
          <dd>{contactLabel}</dd>
          <dt className="text-slate-500">Created</dt>
          <dd>{d.createdAt ? new Date(d.createdAt).toLocaleString() : "—"}</dd>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 mb-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Workflow progress
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {DEPLOYMENT_STEPS.map((step, idx) => {
            const isPast = currentStepIndex >= 0 && idx < currentStepIndex;
            const isCurrent = d.status === step.key;
            const done = isPast || (isCurrent && step.key === "COMPLETED");
            return (
              <span
                key={step.key}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  isCurrent && !isDelayed
                    ? "bg-emerald-600 text-white"
                    : isDelayed && step.key === "DELAYED"
                    ? "bg-amber-500 text-white"
                    : done
                    ? "bg-slate-200 text-slate-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {step.label}
              </span>
            );
          })}
        </div>
        <label className="block text-sm text-slate-600 mb-1">Update status</label>
        <select
          value={d.status}
          onChange={(e) => updateDep.mutate({ status: e.target.value })}
          disabled={updateDep.isPending}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          {DEPLOYMENT_STEPS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <JsonSection
          title="Kick-off meeting"
          icon={<Calendar className="w-4 h-4" />}
          data={kickOff}
          onSave={(kickOffMeeting) => updateDep.mutate({ kickOffMeeting })}
          isSaving={updateDep.isPending}
        />
        <JsonSection
          title="Site survey"
          icon={<MapPin className="w-4 h-4" />}
          data={siteSurveyData}
          onSave={(siteSurvey) => updateDep.mutate({ siteSurvey })}
          isSaving={updateDep.isPending}
        />
      </div>
    </div>
  );
}

function JsonSection({
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
      // invalid json, ignore
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
        rows={6}
        className="w-full rounded border border-slate-300 px-2 py-1.5 font-mono text-sm"
        placeholder='{"date": "...", "attendees": [], "notes": "..."}'
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

function safeJsonStringify(obj: Record<string, unknown>): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return "{}";
  }
}
