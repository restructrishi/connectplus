import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Package, Truck, FileText, Receipt, Send } from "lucide-react";
import { getScmPurchaseOrder, updateScmPurchaseOrder, handoffScmPoToDeployment, type POStatus, type PurchaseOrderListItem } from "../../../api/client";

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

function toDateStr(d: string | null | undefined): string {
  if (!d) return "";
  const x = new Date(d);
  return isNaN(x.getTime()) ? "" : x.toISOString().slice(0, 10);
}

function parseDate(s: string): Date | null {
  if (!s?.trim()) return null;
  const x = new Date(s);
  return isNaN(x.getTime()) ? null : x;
}

export function PurchaseOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["scm", "purchase-orders", id],
    queryFn: () => getScmPurchaseOrder(id!),
    enabled: !!id,
  });

  const updatePo = useMutation({
    mutationFn: (body: Record<string, unknown>) => updateScmPurchaseOrder(id!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scm", "purchase-orders", id] }),
  });

  const handoff = useMutation({
    mutationFn: () => handoffScmPoToDeployment(id!),
    onSuccess: (r) => {
      const deploymentId = r.data?.id;
      if (deploymentId) navigate(`/deployment/${deploymentId}`);
      queryClient.invalidateQueries({ queryKey: ["scm", "purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["deployment"] });
    },
  });

  const po = res?.data;
  const errMsg = error instanceof Error ? error.message : res?.success === false ? res?.message : "";

  if (!id) {
    return (
      <div className="text-slate-600">
        <Link to="/scm/purchase-orders" className="text-slate-700 hover:underline">← Purchase Orders</Link>
        <p className="mt-4">Invalid PO id.</p>
      </div>
    );
  }

  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (errMsg) {
    return (
      <div>
        <Link to="/scm/purchase-orders" className="text-slate-700 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Purchase Orders
        </Link>
        <div className="mt-4 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errMsg}</div>
      </div>
    );
  }
  if (!po) return <p className="text-slate-500">Purchase order not found.</p>;

  const createdBy = po.createdBy;
  const name = createdBy
    ? [createdBy.firstName, createdBy.lastName].filter(Boolean).join(" ") || createdBy.email
    : "—";

  return (
    <div>
      <Link
        to="/scm/purchase-orders"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Purchase Orders
      </Link>
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-7 h-7 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-900">{po.poNumber}</h1>
        <span className="px-2 py-0.5 rounded text-sm font-medium bg-slate-100 text-slate-700">
          {STATUS_LABELS[po.status] ?? po.status}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd>{po.currency} {Number(po.subtotal).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Tax</dt>
              <dd>{po.currency} {Number(po.tax).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Shipping</dt>
              <dd>{po.currency} {Number(po.shipping).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between font-medium text-slate-900">
              <dt>Total</dt>
              <dd>{po.currency} {Number(po.total).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Deal</dt>
              <dd>{po.deal?.dealName ?? po.dealId ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Created by</dt>
              <dd>{name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Created</dt>
              <dd>{po.createdAt ? new Date(po.createdAt).toLocaleString() : "—"}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Line items</h2>
          {po.items && po.items.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {po.items.map((item) => (
                <li key={item.id} className="flex justify-between border-b border-slate-100 pb-2">
                  <span>{item.product?.name ?? item.product?.sku ?? "Product"}</span>
                  <span>{item.quantity} × {Number(item.unitPrice).toLocaleString()} = {Number(item.totalPrice).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">No items.</p>
          )}
        </div>
      </div>

      <TimeCalculationSection po={po} onSave={(body) => updatePo.mutate(body)} isSaving={updatePo.isPending} />
      <MipMrnSection po={po} onSave={(body) => updatePo.mutate(body)} isSaving={updatePo.isPending} />
      <InvoiceFlowSection po={po} onSave={(body) => updatePo.mutate(body)} isSaving={updatePo.isPending} />
      <HandoffSection po={po} onHandoff={() => handoff.mutate()} isHandingOff={handoff.isPending} handoffError={handoff.error} />
    </div>
  );
}

function TimeCalculationSection({
  po,
  onSave,
  isSaving,
}: {
  po: PurchaseOrderListItem;
  onSave: (body: Record<string, unknown>) => void;
  isSaving: boolean;
}) {
  const [clientPO, setClientPO] = useState(toDateStr(po.clientPOReceivedAt));
  const [sentDist, setSentDist] = useState(toDateStr(po.poSentToDistributorAt));
  const [distDelivered, setDistDelivered] = useState(toDateStr(po.distributorDeliveredAt));
  const [warehouse, setWarehouse] = useState(toDateStr(po.warehouseToCustomerAt));

  useEffect(() => {
    setClientPO(toDateStr(po.clientPOReceivedAt));
    setSentDist(toDateStr(po.poSentToDistributorAt));
    setDistDelivered(toDateStr(po.distributorDeliveredAt));
    setWarehouse(toDateStr(po.warehouseToCustomerAt));
  }, [po.clientPOReceivedAt, po.poSentToDistributorAt, po.distributorDeliveredAt, po.warehouseToCustomerAt]);

  const start = parseDate(clientPO);
  const end = parseDate(warehouse) || parseDate(distDelivered) || parseDate(sentDist);
  const totalDays = start && end && end >= start ? Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) : null;

  const handleSave = () => {
    onSave({
      clientPOReceivedAt: clientPO ? new Date(clientPO).toISOString() : null,
      poSentToDistributorAt: sentDist ? new Date(sentDist).toISOString() : null,
      distributorDeliveredAt: distDelivered ? new Date(distDelivered).toISOString() : null,
      warehouseToCustomerAt: warehouse ? new Date(warehouse).toISOString() : null,
      timeCalculation: { totalDays: totalDays ?? undefined },
    });
  };

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
        <Truck className="w-4 h-4" /> Time calculation
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <label>
          <span className="block text-slate-600 mb-1">Client PO received</span>
          <input
            type="date"
            value={clientPO}
            onChange={(e) => setClientPO(e.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-1.5"
          />
        </label>
        <label>
          <span className="block text-slate-600 mb-1">PO sent to distributor</span>
          <input
            type="date"
            value={sentDist}
            onChange={(e) => setSentDist(e.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-1.5"
          />
        </label>
        <label>
          <span className="block text-slate-600 mb-1">Distributor delivered</span>
          <input
            type="date"
            value={distDelivered}
            onChange={(e) => setDistDelivered(e.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-1.5"
          />
        </label>
        <label>
          <span className="block text-slate-600 mb-1">Warehouse → customer</span>
          <input
            type="date"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-1.5"
          />
        </label>
      </div>
      {totalDays != null && (
        <p className="mt-2 text-slate-700 font-medium">Total days: {totalDays}</p>
      )}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="mt-3 rounded bg-slate-700 text-white px-3 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Save dates"}
      </button>
    </div>
  );
}

function MipMrnSection({
  po,
  onSave,
  isSaving,
}: {
  po: PurchaseOrderListItem;
  onSave: (body: Record<string, unknown>) => void;
  isSaving: boolean;
}) {
  const list = Array.isArray(po.mipMrnDocuments) ? po.mipMrnDocuments as { name?: string; url?: string }[] : [];
  const [docs, setDocs] = useState(list);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    setDocs(Array.isArray(po.mipMrnDocuments) ? (po.mipMrnDocuments as { name?: string; url?: string }[]) : []);
  }, [po.mipMrnDocuments]);

  const add = () => {
    if (!newName.trim()) return;
    const next = [...docs, { name: newName.trim(), url: newUrl.trim() || undefined }];
    setDocs(next);
    setNewName("");
    setNewUrl("");
    onSave({ mipMrnDocuments: next });
  };

  const remove = (i: number) => {
    const next = docs.filter((_, idx) => idx !== i);
    setDocs(next);
    onSave({ mipMrnDocuments: next });
  };

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" /> MIP / MRN documents
      </h2>
      <ul className="space-y-2 text-sm mb-3">
        {docs.map((d, i) => (
          <li key={i} className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span>{d.name ?? "—"} {d.url ? <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2">Link</a> : null}</span>
            <button type="button" onClick={() => remove(i)} className="text-red-600 hover:underline">Remove</button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 items-end">
        <input
          type="text"
          placeholder="Document name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="rounded border border-slate-300 px-2 py-1.5 text-sm w-40"
        />
        <input
          type="text"
          placeholder="URL (optional)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="rounded border border-slate-300 px-2 py-1.5 text-sm w-48"
        />
        <button
          type="button"
          onClick={add}
          disabled={isSaving || !newName.trim()}
          className="rounded bg-slate-700 text-white px-3 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function InvoiceFlowSection({
  po,
  onSave,
  isSaving,
}: {
  po: PurchaseOrderListItem;
  onSave: (body: Record<string, unknown>) => void;
  isSaving: boolean;
}) {
  const [scmSent, setScmSent] = useState(!!po.scmInvoiceSent);
  const [scmDate, setScmDate] = useState(toDateStr(po.scmInvoiceSentAt));
  const [accountsSent, setAccountsSent] = useState(!!po.accountsInvoiceSent);
  const [accountsDate, setAccountsDate] = useState(toDateStr(po.accountsInvoiceSentAt));

  useEffect(() => {
    setScmSent(!!po.scmInvoiceSent);
    setScmDate(toDateStr(po.scmInvoiceSentAt));
    setAccountsSent(!!po.accountsInvoiceSent);
    setAccountsDate(toDateStr(po.accountsInvoiceSentAt));
  }, [po.scmInvoiceSent, po.scmInvoiceSentAt, po.accountsInvoiceSent, po.accountsInvoiceSentAt]);

  const save = () => {
    onSave({
      scmInvoiceSent: scmSent,
      scmInvoiceSentAt: scmDate ? new Date(scmDate).toISOString() : null,
      accountsInvoiceSent: accountsSent,
      accountsInvoiceSentAt: accountsDate ? new Date(accountsDate).toISOString() : null,
    });
  };

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
        <Receipt className="w-4 h-4" /> Invoice flow
      </h2>
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <input type="checkbox" id="scm-inv" checked={scmSent} onChange={(e) => setScmSent(e.target.checked)} />
          <label htmlFor="scm-inv">SCM invoice sent to Accounts</label>
          <input
            type="date"
            value={scmDate}
            onChange={(e) => setScmDate(e.target.value)}
            className="rounded border border-slate-300 px-2 py-1"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="checkbox" id="acc-inv" checked={accountsSent} onChange={(e) => setAccountsSent(e.target.checked)} />
          <label htmlFor="acc-inv">Accounts invoice sent</label>
          <input
            type="date"
            value={accountsDate}
            onChange={(e) => setAccountsDate(e.target.value)}
            className="rounded border border-slate-300 px-2 py-1"
          />
        </div>
        <p className="text-slate-500">Step 3: Customer invoice file — use Summary for reference.</p>
      </div>
      <button
        type="button"
        onClick={save}
        disabled={isSaving}
        className="mt-3 rounded bg-slate-700 text-white px-3 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Save invoice status"}
      </button>
    </div>
  );
}

function HandoffSection({
  po,
  onHandoff,
  isHandingOff,
  handoffError,
}: {
  po: PurchaseOrderListItem;
  onHandoff: () => void;
  isHandingOff: boolean;
  handoffError: Error | null;
}) {
  const canHandoff = !!po.dealId && !!po.deal?.contactId;

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
        <Send className="w-4 h-4" /> Handoff to Deployment
      </h2>
      {!canHandoff && (
        <p className="text-amber-700 text-sm mb-2">Link this PO to a deal with a contact before handing off to Deployment.</p>
      )}
      {handoffError && (
        <p className="text-red-600 text-sm mb-2">{handoffError instanceof Error ? handoffError.message : "Handoff failed."}</p>
      )}
      <button
        type="button"
        onClick={onHandoff}
        disabled={!canHandoff || isHandingOff}
        className="rounded bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isHandingOff ? "Creating deployment…" : "Handoff to Deployment"}
      </button>
    </div>
  );
}
