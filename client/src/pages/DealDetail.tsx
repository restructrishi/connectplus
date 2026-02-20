import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Briefcase,
  FileSearch,
  Truck,
  Package,
  Plus,
  ExternalLink,
} from "lucide-react";
import {
  getCrmDeal,
  createPreSales,
  createDeployment,
} from "../api/client";

export function DealDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [handoverDate, setHandoverDate] = useState("");
  const [handoverNotes, setHandoverNotes] = useState("");

  const { data: dealRes, isLoading, error } = useQuery({
    queryKey: ["crm-deal", id],
    queryFn: () => getCrmDeal(id!),
    enabled: !!id,
  });
  const deal = dealRes?.data;
  const errMsg = error instanceof Error ? error.message : (dealRes?.success === false ? dealRes?.message : "");

  const createPs = useMutation({
    mutationFn: (body: { dealId: string; handoverDate: string; handoverNotes?: string }) =>
      createPreSales(body),
    onSuccess: (res) => {
      if (res.data?.id) {
        queryClient.invalidateQueries({ queryKey: ["crm-deal", id] });
        queryClient.invalidateQueries({ queryKey: ["pre-sales"] });
        navigate(`/pre-sales/${res.data.id}`);
      }
    },
  });

  const createDep = useMutation({
    mutationFn: (body: { dealId: string; contactId: string }) => createDeployment(body),
    onSuccess: (res) => {
      if (res.data?.id) {
        queryClient.invalidateQueries({ queryKey: ["crm-deal", id] });
        queryClient.invalidateQueries({ queryKey: ["deployment"] });
        navigate(`/deployment/${res.data.id}`);
      }
    },
  });

  if (!id) return <p className="text-slate-500">Invalid deal.</p>;
  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (errMsg)
    return (
      <div>
        <Link to="/deals" className="text-slate-600 hover:underline">← Deals</Link>
        <div className="mt-4 text-red-600 bg-red-50 rounded-lg p-3">{errMsg}</div>
      </div>
    );
  if (!deal) return <p className="text-slate-500">Deal not found.</p>;

  const contact = deal.contact;
  const contactLabel = contact
    ? `${contact.firstName} ${contact.lastName} (${contact.companyName})`
    : "—";
  const hasPreSales = !!deal.preSales;
  const deployments = deal.deployments ?? [];
  const pos = deal.purchaseOrders ?? [];

  const handleHandoffPreSales = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverDate.trim()) return;
    createPs.mutate({
      dealId: id,
      handoverDate: handoverDate.trim(),
      handoverNotes: handoverNotes.trim() || undefined,
    });
  };

  const handleCreateDeployment = () => {
    if (deal.contactId) createDep.mutate({ dealId: id, contactId: deal.contactId });
  };

  return (
    <div>
      <Link
        to="/deals"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Deals
      </Link>
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="w-7 h-7 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-900">{deal.dealName}</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">Deal details — push to Pre-Sales, create Deployment or PO below.</p>

      <div className="rounded-xl border border-slate-200 bg-white p-4 mb-6 max-w-2xl">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Deal details</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-slate-500">Value</dt>
          <dd className="font-medium">₹{Number(deal.dealValue).toLocaleString()}</dd>
          <dt className="text-slate-500">Stage</dt>
          <dd>{deal.stage?.replace(/_/g, " ")}</dd>
          <dt className="text-slate-500">Contact</dt>
          <dd>{contactLabel}</dd>
          <dt className="text-slate-500">Expected close</dt>
          <dd>{deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : "—"}</dd>
        </dl>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <FileSearch className="w-4 h-4" /> Pre-Sales
          </h2>
          {hasPreSales ? (
            <>
              <p className="text-sm text-slate-600 mb-2">
                Pre-sales record exists for this deal.
              </p>
              <Link
                to={`/pre-sales/${deal.preSales!.id}`}
                className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium text-sm"
              >
                Open Pre-Sales <ExternalLink className="w-3 h-3" />
              </Link>
            </>
          ) : (
            <form onSubmit={handleHandoffPreSales} className="space-y-2 max-w-sm">
              <label className="block text-sm text-slate-600">Handover date *</label>
              <input
                type="date"
                value={handoverDate}
                onChange={(e) => setHandoverDate(e.target.value)}
                className="rounded border border-slate-300 px-2 py-1.5 text-sm w-full"
              />
              <label className="block text-sm text-slate-600">Notes (optional)</label>
              <input
                type="text"
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                placeholder="Handover notes"
                className="rounded border border-slate-300 px-2 py-1.5 text-sm w-full"
              />
              <button
                type="submit"
                disabled={createPs.isPending || !handoverDate.trim()}
                className="rounded bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-50"
              >
                {createPs.isPending ? "Creating…" : "Hand off to Pre-Sales"}
              </button>
            </form>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4" /> Deployment
          </h2>
          {deployments.length > 0 && (
            <ul className="space-y-2 mb-3 text-sm">
              {deployments.map((d) => (
                <li key={d.id}>
                  <Link to={`/deployment/${d.id}`} className="text-slate-700 hover:text-slate-900 font-medium">
                    Deployment – {d.status.replace(/_/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={handleCreateDeployment}
            disabled={!deal.contactId || createDep.isPending}
            className="inline-flex items-center gap-1 rounded bg-slate-700 text-white px-3 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-50"
          >
            <Plus className="w-3 h-3" /> Create deployment
          </button>
          {!deal.contactId && (
            <p className="text-amber-700 text-xs mt-1">Deal must have a contact to create a deployment.</p>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" /> Purchase orders (SCM)
          </h2>
          {pos.length > 0 && (
            <ul className="space-y-2 mb-3 text-sm">
              {pos.map((po) => (
                <li key={po.id}>
                  <Link
                    to={`/scm/purchase-orders/${po.id}`}
                    className="text-slate-700 hover:text-slate-900 font-medium"
                  >
                    {po.poNumber} – {po.status?.replace(/_/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            to={`/scm/purchase-orders/new?dealId=${id}`}
            className="inline-flex items-center gap-1 rounded bg-slate-700 text-white px-3 py-1.5 text-sm hover:bg-slate-800"
          >
            <Plus className="w-3 h-3" /> Create purchase order
          </Link>
        </section>
      </div>
    </div>
  );
}
