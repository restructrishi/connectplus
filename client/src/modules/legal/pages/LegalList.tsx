import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import { getLegalAgreements, getLegalPolicies, type AgreementListItem, type PolicyListItem } from "../../../api/client";

export function LegalList() {
  const [activeTab, setActiveTab] = useState<"agreements" | "policies">("agreements");
  const [policyStatus, setPolicyStatus] = useState("");

  const { data: agreementsRes, isLoading: agreementsLoading, error: agreementsError } = useQuery({
    queryKey: ["legal", "agreements"],
    queryFn: () => getLegalAgreements(),
  });
  const { data: policiesRes, isLoading: policiesLoading, error: policiesError } = useQuery({
    queryKey: ["legal", "policies", policyStatus || null],
    queryFn: () => getLegalPolicies(policyStatus ? { status: policyStatus } : undefined),
  });

  const agreements: AgreementListItem[] = agreementsRes?.data ?? [];
  const policies: PolicyListItem[] = policiesRes?.data ?? [];
  const errMsg = activeTab === "agreements"
    ? (agreementsError instanceof Error ? agreementsError.message : (agreementsRes?.success === false ? agreementsRes?.message : ""))
    : (policiesError instanceof Error ? policiesError.message : (policiesRes?.success === false ? policiesRes?.message : ""));
  const isLoading = activeTab === "agreements" ? agreementsLoading : policiesLoading;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Scale className="w-7 h-7 text-slate-600" />
        Legal & Compliance
      </h1>
      {errMsg && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errMsg}
        </div>
      )}
      <div className="flex gap-2 mb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("agreements")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === "agreements" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
        >
          Agreements
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("policies")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === "policies" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
        >
          Policies
        </button>
      </div>
      {activeTab === "policies" && (
        <div className="mb-4 flex gap-2 items-center">
          <span className="text-sm text-slate-600">Status:</span>
          <select
            value={policyStatus}
            onChange={(e) => setPolicyStatus(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      )}
      {isLoading ? (
        <p className="text-slate-500">Loading…</p>
      ) : activeTab === "agreements" ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Agreement #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Deal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Signed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {agreements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No agreements yet.
                  </td>
                </tr>
              ) : (
                agreements.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{a.agreementNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.agreementType}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.deal?.dealName ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.sentToClient ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.signed ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-sm">
                      <Link to={`/legal/agreements/${a.id}`} className="text-slate-700 hover:text-slate-900 font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Policy #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {policies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No policies yet.
                  </td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.policyNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{p.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{p.status}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link to={`/legal/policies/${p.id}`} className="text-slate-700 hover:text-slate-900 font-medium">
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
