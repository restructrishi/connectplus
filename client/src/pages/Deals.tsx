import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Plus, ChevronDown, FileSearch, Truck, Package } from "lucide-react";
import {
  getCrmDeals,
  getCrmContacts,
  createCrmDeal,
  createCrmContact,
  createPreSales,
  createDeployment,
  type CrmDealListItem,
  type CrmContactListItem,
} from "../api/client";

const STAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "LEAD_GENERATION", label: "Lead generation" },
  { value: "QUALIFICATION", label: "Qualification" },
  { value: "PRE_SALES_HANDOVER", label: "Pre-sales handover" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "CLOSED_WON", label: "Closed won" },
  { value: "CLOSED_LOST", label: "Closed lost" },
];

export function Deals() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [stageFilter, setStageFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [pushToPreSalesDeal, setPushToPreSalesDeal] = useState<CrmDealListItem | null>(null);
  const [handoverDate, setHandoverDate] = useState("");
  const [handoverNotes, setHandoverNotes] = useState("");

  const { data: dealsRes, isLoading, error, refetch } = useQuery({
    queryKey: ["crm-deals", stageFilter || null],
    queryFn: () => getCrmDeals(stageFilter ? { stage: stageFilter } : undefined),
  });
  const { data: contactsRes } = useQuery({
    queryKey: ["crm-contacts"],
    queryFn: () => getCrmContacts(),
  });

  const deals: CrmDealListItem[] = dealsRes?.data ?? [];
  const contacts: CrmContactListItem[] = contactsRes?.data ?? [];
  const errMsg = error instanceof Error ? error.message : (dealsRes?.success === false ? dealsRes?.message : "");

  const createPs = useMutation({
    mutationFn: (body: { dealId: string; handoverDate: string; handoverNotes?: string }) => createPreSales(body),
    onSuccess: (res) => {
      if (res.data?.id) {
        queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
        queryClient.invalidateQueries({ queryKey: ["pre-sales"] });
        setPushToPreSalesDeal(null);
        setHandoverDate("");
        setHandoverNotes("");
        navigate(`/pre-sales/${res.data.id}`);
      }
    },
  });
  const createDep = useMutation({
    mutationFn: (body: { dealId: string; contactId: string }) => createDeployment(body),
    onSuccess: (res) => {
      if (res.data?.id) {
        queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
        queryClient.invalidateQueries({ queryKey: ["deployment"] });
        navigate(`/deployment/${res.data.id}`);
      }
    },
  });

  const handlePushToPreSales = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushToPreSalesDeal || !handoverDate.trim()) return;
    createPs.mutate({
      dealId: pushToPreSalesDeal.id,
      handoverDate: handoverDate.trim(),
      handoverNotes: handoverNotes.trim() || undefined,
    });
  };
  const handleCreateDeployment = (d: CrmDealListItem) => {
    if (d.contactId) createDep.mutate({ dealId: d.id, contactId: d.contactId });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-slate-600" />
          Deals
        </h1>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" /> Create deal
        </button>
      </div>
      <p className="text-slate-600 text-sm mb-4">
        Deals here are linked to Pre-Sales, Deployment, and Purchase Orders. Open a deal to hand off to Pre-Sales, create a PO, or create a Deployment.
      </p>
      {errMsg && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errMsg}
        </div>
      )}
      <div className="mb-4 flex gap-2 items-center">
        <span className="text-sm text-slate-600">Stage:</span>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          {STAGE_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Deal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Stage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expected close</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {deals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No deals yet. Create a contact first, then create a deal to see them here and link to Pre-Sales, Deployment, and SCM.
                  </td>
                </tr>
              ) : (
                deals.map((d) => (
                  <tr key={d.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      <Link to={`/deals/${d.id}`} className="text-slate-900 hover:text-slate-700 hover:underline">
                        {d.dealName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {d.contact
                        ? `${d.contact.firstName} ${d.contact.lastName} (${d.contact.companyName})`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">₹{Number(d.dealValue).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{d.stage?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <DealRowActions
                        deal={d}
                        onPushToPreSales={() => setPushToPreSalesDeal(d)}
                        onCreateDeployment={() => handleCreateDeployment(d)}
                        onCreatePO={() => navigate(`/scm/purchase-orders/new?dealId=${d.id}`)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {showCreate && (
        <CreateDealModal
          contacts={contacts}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            refetch();
            setShowCreate(false);
          }}
        />
      )}
      {pushToPreSalesDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Push to Pre-Sales</h3>
            <p className="text-sm text-slate-600 mb-3">Deal: {pushToPreSalesDeal.dealName}</p>
            <form onSubmit={handlePushToPreSales} className="space-y-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Handover date *</label>
                <input
                  type="date"
                  value={handoverDate}
                  onChange={(e) => setHandoverDate(e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  placeholder="Handover notes"
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </div>
              {createPs.error && (
                <p className="text-sm text-red-600">{createPs.error instanceof Error ? createPs.error.message : "Failed"}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createPs.isPending || !handoverDate.trim()}
                  className="rounded bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {createPs.isPending ? "Creating…" : "Push to Pre-Sales"}
                </button>
                <button
                  type="button"
                  onClick={() => { setPushToPreSalesDeal(null); setHandoverDate(""); setHandoverNotes(""); }}
                  className="rounded border border-slate-300 px-3 py-1.5 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DealRowActions({
  deal,
  onPushToPreSales,
  onCreateDeployment,
  onCreatePO,
}: {
  deal: CrmDealListItem;
  onPushToPreSales: () => void;
  onCreateDeployment: () => void;
  onCreatePO: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-sm text-slate-700 hover:bg-slate-50"
      >
        Actions <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            <Link
              to={`/deals/${deal.id}`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <Briefcase className="w-4 h-4" /> Open deal
            </Link>
            <button
              type="button"
              onClick={() => { onPushToPreSales(); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
            >
              <FileSearch className="w-4 h-4" /> Push to Pre-Sales
            </button>
            <button
              type="button"
              onClick={() => { onCreateDeployment(); setOpen(false); }}
              disabled={!deal.contactId}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Truck className="w-4 h-4" /> Create Deployment
            </button>
            <button
              type="button"
              onClick={() => { onCreatePO(); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
            >
              <Package className="w-4 h-4" /> Create PO
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CreateDealModal({
  contacts,
  onClose,
  onCreated,
}: {
  contacts: CrmContactListItem[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [dealName, setDealName] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [contactId, setContactId] = useState("");
  const [stage, setStage] = useState("LEAD_GENERATION");
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", email: "", companyName: "", phone: "" });

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!dealName.trim()) {
      setError("Deal name is required");
      return;
    }
    const value = parseFloat(dealValue);
    if (isNaN(value) || value < 0) {
      setError("Valid value is required");
      return;
    }
    if (!contactId) {
      setError("Select a contact");
      return;
    }
    setSaving(true);
    try {
      await createCrmDeal({
        dealName: dealName.trim(),
        dealValue: value,
        contactId,
        stage,
        expectedCloseDate: expectedCloseDate || undefined,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create deal");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.firstName.trim() || !newContact.lastName.trim() || !newContact.email.trim() || !newContact.companyName.trim()) {
      setError("First name, last name, email, and company are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await createCrmContact({
        firstName: newContact.firstName.trim(),
        lastName: newContact.lastName.trim(),
        email: newContact.email.trim(),
        companyName: newContact.companyName.trim(),
        phone: newContact.phone.trim() || undefined,
      });
      if (res.data?.id) {
        setContactId(res.data.id);
        setShowAddContact(false);
        setNewContact({ firstName: "", lastName: "", email: "", companyName: "", phone: "" });
        onCreated(); // refetch will update contacts list
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create contact");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Create deal</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleCreateDeal} className="p-4 space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deal name *</label>
            <input
              type="text"
              value={dealName}
              onChange={(e) => setDealName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="e.g. Acme Corp – Server Upgrade"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Value (₹) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact *</label>
            {!showAddContact ? (
              <>
                <select
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Select contact</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} – {c.companyName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddContact(true)}
                  className="mt-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  + Add new contact
                </button>
              </>
            ) : (
              <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                <input
                  type="text"
                  placeholder="First name"
                  value={newContact.firstName}
                  onChange={(e) => setNewContact((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={newContact.lastName}
                  onChange={(e) => setNewContact((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newContact.email}
                  onChange={(e) => setNewContact((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
                <input
                  type="text"
                  placeholder="Company name"
                  value={newContact.companyName}
                  onChange={(e) => setNewContact((p) => ({ ...p, companyName: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
                <input
                  type="text"
                  placeholder="Phone (optional)"
                  value={newContact.phone}
                  onChange={(e) => setNewContact((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateContact}
                    disabled={saving}
                    className="rounded bg-emerald-600 text-white px-3 py-1.5 text-sm hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save contact"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {STAGE_OPTIONS.filter((o) => o.value).map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expected close date</label>
            <input
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create deal"}
            </button>
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
