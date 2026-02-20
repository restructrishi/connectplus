import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Package, Plus } from "lucide-react";
import {
  getScmPurchaseOrders,
  type PurchaseOrderListItem,
  type POStatus,
} from "../../../api/client";

const STATUS_LABELS: Record<POStatus, string> = {
  CLIENT_PO_RECEIVED: "PO Received",
  PO_SENT_TO_DISTRIBUTOR: "Sent to Distributor",
  DISTRIBUTOR_DELIVERED: "Distributor Delivered",
  WAREHOUSE_TO_CUSTOMER: "Warehouse → Customer",
  DOCUMENTS_COMPLETED: "Documents Done",
  INVOICE_SENT_TO_ACCOUNTS: "Invoice to Accounts",
  INVOICE_SENT_TO_CUSTOMER: "Invoice to Customer",
  COMPLETED: "Completed",
};

export function PurchaseOrderList() {
  const [statusFilter, setStatusFilter] = useState<POStatus | "">("");
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["scm", "purchase-orders", statusFilter || null],
    queryFn: () => getScmPurchaseOrders(statusFilter ? { status: statusFilter } : undefined),
  });

  const list: PurchaseOrderListItem[] = res?.data ?? [];
  const errMsg = error instanceof Error ? error.message : res?.success === false ? res?.message : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-7 h-7 text-slate-600" />
          Purchase Orders
        </h1>
        <Link
          to="/scm/purchase-orders/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" />
          New PO
        </Link>
      </div>

      {errMsg && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errMsg}
        </div>
      )}

      <div className="mb-4 flex gap-2 items-center">
        <span className="text-sm text-slate-600">Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter((e.target.value || "") as POStatus | "")}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">All</option>
          {(Object.keys(STATUS_LABELS) as POStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">PO #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Deal</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No purchase orders yet.
                  </td>
                </tr>
              ) : (
                list.map((po) => (
                  <tr key={po.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{po.poNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {STATUS_LABELS[po.status] ?? po.status}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {po.deal?.dealName ?? po.dealId ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right">
                      {po.currency} {Number(po.total).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {po.createdAt ? new Date(po.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        to={`/scm/purchase-orders/${po.id}`}
                        className="text-slate-700 hover:text-slate-900 font-medium"
                      >
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
