import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Package } from "lucide-react";
import { createScmPurchaseOrder } from "../../../api/client";
import { toast } from "react-toastify";

export function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dealIdFromUrl = searchParams.get("dealId") ?? undefined;
  const queryClient = useQueryClient();
  const [subtotal, setSubtotal] = useState("");
  const [tax, setTax] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [currency, setCurrency] = useState("INR");

  const createMutation = useMutation({
    mutationFn: () => {
      const s = parseFloat(subtotal) || 0;
      const t = parseFloat(tax) || 0;
      const sh = parseFloat(shipping) || 0;
      return createScmPurchaseOrder({
        dealId: dealIdFromUrl,
        subtotal: s,
        tax: t,
        shipping: sh,
        total: s + t + sh,
        currency: currency || undefined,
      });
    },
    onSuccess: (r) => {
      if (r.data?.id) {
        toast.success("Purchase order created.");
        queryClient.invalidateQueries({ queryKey: ["scm", "purchase-orders"] });
        navigate(`/scm/purchase-orders/${r.data.id}`);
      } else {
        toast.error(r.message ?? "Create failed");
      }
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Create failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  const s = parseFloat(subtotal) || 0;
  const t = parseFloat(tax) || 0;
  const sh = parseFloat(shipping) || 0;
  const total = s + t + sh;

  return (
    <div>
      <Link
        to="/scm/purchase-orders"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Purchase Orders
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Package className="w-7 h-7 text-slate-600" />
        New Purchase Order
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subtotal</label>
          <input
            type="number"
            step="0.01"
            required
            value={subtotal}
            onChange={(e) => setSubtotal(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tax</label>
          <input
            type="number"
            step="0.01"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Shipping</label>
          <input
            type="number"
            step="0.01"
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <p className="text-sm text-slate-600">Total: {currency} {total.toLocaleString()}</p>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createMutation.isPending || !subtotal}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating…" : "Create PO"}
          </button>
          <Link
            to="/scm/purchase-orders"
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
