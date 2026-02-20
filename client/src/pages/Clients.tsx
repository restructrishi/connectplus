import { useEffect, useState } from "react";
import { getClients, createClient } from "../api/client";

type Client = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string | null;
  industry?: string | null;
  assignedTo?: string | null;
};

export function Clients() {
  const [items, setItems] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getClients({ page, pageSize })
      .then((r) => {
        if (r.data) {
          setItems((r.data.items as Client[]) || []);
          setTotal(r.data.total);
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, pageSize]);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    createClient({
      companyName: fd.get("companyName") as string,
      contactPerson: fd.get("contactPerson") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
      industry: (fd.get("industry") as string) || undefined,
    })
      .then(() => {
        setShowForm(false);
        form.reset();
        load();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Create failed"));
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          {showForm ? "Cancel" : "Add Client"}
        </button>
      </div>
      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-6 bg-white rounded-xl border border-slate-200 space-y-4">
          <h2 className="font-semibold text-slate-900">New Client</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="companyName" required placeholder="Company name" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input name="contactPerson" required placeholder="Contact person" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input name="email" type="email" required placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input name="phone" placeholder="Phone" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input name="industry" placeholder="Industry" className="rounded-lg border border-slate-300 px-3 py-2" />
          </div>
          <button type="submit" className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium">
            Create Client
          </button>
        </form>
      )}
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Industry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{c.companyName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.contactPerson}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.industry ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex gap-2 items-center">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {page} of {totalPages} ({total} total)
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
