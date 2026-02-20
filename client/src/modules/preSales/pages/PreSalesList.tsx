import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FileSearch } from "lucide-react";
import { getPreSalesList, type PreSalesListItem } from "../../../api/client";

export function PreSalesList() {
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["pre-sales"],
    queryFn: () => getPreSalesList(),
  });

  const list: PreSalesListItem[] = res?.data ?? [];
  const errMsg = error instanceof Error ? error.message : (res?.success === false ? res?.message : "");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <FileSearch className="w-7 h-7 text-slate-600" />
        Pre-Sales
      </h1>
      {errMsg && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errMsg}
        </div>
      )}
      {isLoading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Deal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Handover date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Proposal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created by</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No pre-sales records yet. Pre-sales is linked to deals after lead handover.
                  </td>
                </tr>
              ) : (
                list.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {p.deal?.dealName ?? p.dealId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {p.handoverDate ? new Date(p.handoverDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {p.proposalGenerated ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {p.createdBy ? [p.createdBy.firstName, p.createdBy.lastName].filter(Boolean).join(" ") || p.createdBy.email : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link to={`/pre-sales/${p.id}`} className="text-slate-700 hover:text-slate-900 font-medium">
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
