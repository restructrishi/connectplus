import { useEffect, useState, useCallback } from "react";
import { getLeads, createLead, updateLead, convertLeadToClient, getLead } from "../api/client";
import type { LeadListItem, CreateLeadBody } from "../api/client";

const STATUS_OPTIONS = [
  { value: "", label: "All leads" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "LOST", label: "Lead lost" },
  { value: "CONVERTED", label: "Converted" },
];

const PAGE_SIZES = [10, 20, 50];

function formatDate(s: string | null | undefined) {
  if (!s) return "—";
  try {
    const d = new Date(s);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return s;
  }
}

export function Leads() {
  const [items, setItems] = useState<LeadListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getLeads({ page, pageSize, status: statusFilter || undefined })
      .then((r) => {
        if (r.data) {
          setItems(r.data.items ?? []);
          setTotal(r.data.total ?? 0);
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load leads"))
      .finally(() => setLoading(false));
  }, [page, pageSize, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleCreate = (values: CreateLeadBody) => {
    createLead(values)
      .then(() => {
        setCreateModalOpen(false);
        load();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Create failed"));
  };

  const handleUpdate = (id: string, values: Partial<CreateLeadBody>) => {
    updateLead(id, values)
      .then(() => {
        setEditingId(null);
        load();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Update failed"));
  };

  const handleStatusChange = (id: string, status: string) => {
    updateLead(id, { status })
      .then(() => load())
      .catch((e) => setError(e instanceof Error ? e.message : "Update failed"));
  };

  const handleConvert = (id: string) => {
    setConvertingId(id);
    convertLeadToClient(id)
      .then(() => load())
      .catch((e) => setError(e instanceof Error ? e.message : "Convert failed"))
      .finally(() => setConvertingId(null));
  };

  return (
    <div className="space-y-4">
      {/* Header: view selector, Create Lead, pagination, sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
          >
            Create Lead
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span>Total records {total}</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="rounded border border-slate-300 px-2 py-1"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>{n} per page</option>
            ))}
          </select>
          <span>
            {total === 0 ? "0" : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border border-slate-300 px-2 py-1 disabled:opacity-50"
            >
              ←
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-slate-300 px-2 py-1 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Lead list: card-style rows */}
      {loading ? (
        <p className="py-8 text-slate-500">Loading…</p>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {items.map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-start gap-4 p-4 hover:bg-slate-50/50">
                <div className="flex items-center gap-2 shrink-0">
                  <input type="checkbox" className="rounded border-slate-300" aria-label={`Select ${lead.name}`} />
                  <button
                    type="button"
                    onClick={() => setEditingId(lead.id)}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    title="Edit"
                  >
                    <span className="sr-only">Edit</span>✎
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold text-slate-900">{lead.name}</span>
                    {lead.status === "LOST" && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">Lead lost</span>
                    )}
                  </div>
                  {lead.company && <p className="mt-0.5 text-sm text-slate-600">{lead.company}</p>}
                  {lead.email && <p className="text-sm text-slate-500">{lead.email}</p>}
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                    {lead.source && <span>{lead.source}</span>}
                    {lead.email && <span>|</span>}
                    {lead.industry && <span>{lead.industry}</span>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  {lead.hasDeal && lead.assignedTo && (
                    <div className="flex items-center justify-end gap-1.5 text-sm text-slate-600">
                      <span className="inline-block h-6 w-6 rounded-full bg-slate-200 text-xs leading-6 text-slate-600 text-center">👤</span>
                      <span>{lead.assignedTo}</span>
                      <span className="text-slate-400">{formatDate(lead.updatedAt)}</span>
                    </div>
                  )}
                  {!lead.hasDeal && <span className="text-slate-400 text-sm">—</span>}
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs"
                    >
                      {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    {lead.status === "QUALIFIED" && (
                      <button
                        type="button"
                        disabled={!!convertingId}
                        onClick={() => handleConvert(lead.id)}
                        className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
                      >
                        {convertingId === lead.id ? "Converting…" : "Convert to client"}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {items.length === 0 && (
            <div className="py-12 text-center text-slate-500">No leads. Create one to get started.</div>
          )}
        </div>
      )}

      {createModalOpen && (
        <CreateLeadModal
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreate}
        />
      )}
      {editingId && (
        <EditLeadModal
          leadId={editingId}
          onClose={() => setEditingId(null)}
          onSave={(values) => handleUpdate(editingId, values)}
        />
      )}
    </div>
  );
}

function CreateLeadModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (v: CreateLeadBody) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const details: Record<string, unknown> = {};
    ["street", "state", "country", "city", "zipCode", "oemName", "oemContactNumber", "oemContactPerson", "oemContactEmail", "distributorName", "distributorContactNumber", "department", "distributorContactPerson", "distributorContactEmail", "endCustomer", "entityName", "entityAddress", "entityGstNo", "entityEmail", "organization", "entityContactNumber", "description"].forEach((k) => {
      const v = fd.get(k);
      if (v != null && String(v).trim()) details[k] = String(v).trim();
    });
    const expectedClosure = (fd.get("expectedClosureDate") as string)?.trim();
    const expectedAmount = (fd.get("expectedBusinessAmount") as string)?.trim();
    const name = (fd.get("name") as string)?.trim() || (fd.get("company") as string)?.trim() || "Lead";
    const email = (fd.get("email") as string)?.trim();
    if (!email) return;
    setSubmitting(true);
    onSave({
      name,
      email,
      phone: (fd.get("phone") as string)?.trim() || undefined,
      company: (fd.get("company") as string)?.trim() || undefined,
      source: (fd.get("source") as string) || undefined,
      status: (fd.get("status") as string) || undefined,
      assignedTo: (fd.get("assignedTo") as string)?.trim() || undefined,
      industry: (fd.get("industry") as string)?.trim() || undefined,
      expectedClosureDate: expectedClosure || undefined,
      expectedBusinessAmount: expectedAmount ? Number(expectedAmount) : undefined,
      details: Object.keys(details).length ? details : undefined,
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Create Lead</h2>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" form="create-lead-form" disabled={submitting} className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800 disabled:opacity-50">Save</button>
          </div>
        </div>
        <form id="create-lead-form" onSubmit={handleSubmit} className="space-y-6 p-6">
          <LeadFormFields />
        </form>
      </div>
    </div>
  );
}

function EditLeadModal({
  leadId,
  onClose,
  onSave,
}: {
  leadId: string;
  onClose: () => void;
  onSave: (v: Partial<CreateLeadBody>) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    getLead(leadId)
      .then((r) => {
        if (r.data) setLead(r.data);
      })
      .finally(() => setLoading(false));
  }, [leadId]);
  const [lead, setLead] = useState<LeadListItem | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const details: Record<string, unknown> = { ...(lead?.details as Record<string, unknown> || {}) };
    ["street", "state", "country", "city", "zipCode", "oemName", "oemContactNumber", "oemContactPerson", "oemContactEmail", "distributorName", "distributorContactNumber", "department", "distributorContactPerson", "distributorContactEmail", "endCustomer", "entityName", "entityAddress", "entityGstNo", "entityEmail", "organization", "entityContactNumber", "description"].forEach((k) => {
      const v = fd.get(k);
      if (v != null && String(v).trim()) details[k] = String(v).trim();
    });
    const expectedClosure = (fd.get("expectedClosureDate") as string)?.trim();
    const expectedAmount = (fd.get("expectedBusinessAmount") as string)?.trim();
    setSubmitting(true);
    onSave({
      name: (fd.get("name") as string)?.trim() || undefined,
      email: (fd.get("email") as string)?.trim() || undefined,
      phone: (fd.get("phone") as string)?.trim() || undefined,
      company: (fd.get("company") as string)?.trim() || undefined,
      source: (fd.get("source") as string)?.trim() || undefined,
      status: (fd.get("status") as string) || undefined,
      assignedTo: (fd.get("assignedTo") as string)?.trim() || undefined,
      industry: (fd.get("industry") as string)?.trim() || undefined,
      expectedClosureDate: expectedClosure || undefined,
      expectedBusinessAmount: expectedAmount ? Number(expectedAmount) : undefined,
      details: Object.keys(details).length ? details : undefined,
    });
    setSubmitting(false);
  };

  if (loading) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><span className="text-white">Loading…</span></div>;
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Edit Lead</h2>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" form="edit-lead-form" className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800">Save</button>
          </div>
        </div>
        <form id="edit-lead-form" onSubmit={handleSubmit} className="space-y-6 p-6">
          <LeadFormFields
            defaultName={lead.name}
            defaultEmail={lead.email}
            defaultPhone={lead.phone ?? ""}
            defaultCompany={lead.company ?? ""}
            defaultSource={lead.source ?? ""}
            defaultStatus={lead.status}
            defaultAssignedTo={lead.assignedTo ?? ""}
            defaultIndustry={lead.industry ?? ""}
            defaultExpectedClosureDate={lead.expectedClosureDate ? (lead.expectedClosureDate as string).slice(0, 10) : ""}
            defaultExpectedBusinessAmount={lead.expectedBusinessAmount ?? ""}
            defaultDetails={lead.details ? Object.fromEntries(Object.entries(lead.details).map(([k, v]) => [k, String(v)])) : null}
          />
        </form>
      </div>
    </div>
  );
}

function LeadFormFields({
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
  defaultCompany = "",
  defaultSource = "",
  defaultStatus = "",
  defaultAssignedTo = "",
  defaultIndustry = "",
  defaultExpectedClosureDate = "",
  defaultExpectedBusinessAmount = "",
  defaultDetails = null,
}: {
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  defaultCompany?: string;
  defaultSource?: string;
  defaultStatus?: string;
  defaultAssignedTo?: string;
  defaultIndustry?: string;
  defaultExpectedClosureDate?: string;
  defaultExpectedBusinessAmount?: string | number;
  defaultDetails?: Record<string, string> | null;
}) {
  const d = defaultDetails || {};
  return (
    <>
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Lead information</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-500">Company</label>
            <input name="company" defaultValue={defaultCompany} className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Company" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Email</label>
            <input name="email" type="email" defaultValue={defaultEmail} required className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Email" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Name</label>
            <input name="name" defaultValue={defaultName} className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Mobile</label>
            <input name="phone" type="tel" defaultValue={defaultPhone} className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="10-digit phone" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Lead source</label>
            <select name="source" defaultValue={defaultSource} className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="">— None —</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Cold call">Cold call</option>
              <option value="Large Enterprise">Large Enterprise</option>
              <option value="Customer Reference">Customer Reference</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Lead status</label>
            <select name="status" defaultValue={defaultStatus} className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Assign to</label>
            <input name="assignedTo" defaultValue={defaultAssignedTo} className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Employee ID or name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Expected closure date</label>
            <input name="expectedClosureDate" type="date" defaultValue={defaultExpectedClosureDate} className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Expected business amount (₹)</label>
            <input name="expectedBusinessAmount" type="number" step="0.01" defaultValue={defaultExpectedBusinessAmount} className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="0" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-500">Industry</label>
            <select name="industry" defaultValue={defaultIndustry} className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="">— None —</option>
              <option value="Technology">Technology</option>
              <option value="Data/Telecom OEM">Data/Telecom OEM</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Customer address</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input name="street" defaultValue={d.street} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Street" />
          </div>
          <div><input name="city" defaultValue={d.city} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="City" /></div>
          <div><input name="state" defaultValue={d.state} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="State" /></div>
          <div><input name="country" defaultValue={d.country} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Country" /></div>
          <div><input name="zipCode" defaultValue={d.zipCode} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Zip code" /></div>
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">OEM information</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><input name="oemName" defaultValue={d.oemName} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="OEM name" /></div>
          <div><input name="oemContactNumber" defaultValue={d.oemContactNumber} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="OEM contact number" /></div>
          <div><input name="oemContactPerson" defaultValue={d.oemContactPerson} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="OEM contact person" /></div>
          <div><input name="oemContactEmail" defaultValue={d.oemContactEmail} type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="OEM contact email" /></div>
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Distributor information</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><input name="distributorName" defaultValue={d.distributorName} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Distributor name" /></div>
          <div><input name="distributorContactNumber" defaultValue={d.distributorContactNumber} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Contact number" /></div>
          <div><input name="department" defaultValue={d.department} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Department" /></div>
          <div><input name="distributorContactPerson" defaultValue={d.distributorContactPerson} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Contact person" /></div>
          <div><input name="distributorContactEmail" defaultValue={d.distributorContactEmail} type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Contact email" /></div>
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Customer & industry</h3>
        <div><input name="endCustomer" defaultValue={d.endCustomer} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="End customer" /></div>
      </section>
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Entity information</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><input name="entityName" defaultValue={d.entityName} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Entity name" /></div>
          <div><input name="entityAddress" defaultValue={d.entityAddress} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Entity address" /></div>
          <div><input name="entityGstNo" defaultValue={d.entityGstNo} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Entity GST no." /></div>
          <div><input name="entityEmail" defaultValue={d.entityEmail} type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Entity email" /></div>
          <div><input name="organization" defaultValue={d.organization} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Organization" /></div>
          <div><input name="entityContactNumber" defaultValue={d.entityContactNumber} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Entity contact number" /></div>
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Additional information</h3>
        <textarea name="description" defaultValue={d.description} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Description" />
      </section>
    </>
  );
}
