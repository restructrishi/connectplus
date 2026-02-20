import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask } from "../api/client";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  assignedTo: string;
  dueDate?: string | null;
  status: string;
  createdAt: string;
};

export function Tasks() {
  const [items, setItems] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getTasks({ page, pageSize, status: statusFilter || undefined })
      .then((r) => {
        if (r.data) {
          setItems((r.data.items as Task[]) || []);
          setTotal(r.data.total);
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, pageSize, statusFilter]);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    createTask({
      title: fd.get("title") as string,
      assignedTo: fd.get("assignedTo") as string,
      description: (fd.get("description") as string) || undefined,
      dueDate: (fd.get("dueDate") as string) || undefined,
    })
      .then(() => {
        setShowForm(false);
        form.reset();
        load();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Create failed"));
  };

  const handleStatusToggle = (id: string, current: string) => {
    const next = current === "PENDING" ? "COMPLETED" : "PENDING";
    updateTask(id, { status: next }).then(() => load()).catch((e) => setError(e instanceof Error ? e.message : "Update failed"));
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          {showForm ? "Cancel" : "Add Task"}
        </button>
      </div>
      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-6 bg-white rounded-xl border border-slate-200 space-y-4">
          <h2 className="font-semibold text-slate-900">New Task</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="title" required placeholder="Title" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input name="assignedTo" required placeholder="Assigned to (employee ID)" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input name="description" placeholder="Description" className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2" />
            <input name="dueDate" type="date" placeholder="Due date" className="rounded-lg border border-slate-300 px-3 py-2" />
          </div>
          <button type="submit" className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium">
            Create Task
          </button>
        </form>
      )}
      <div className="mb-4 flex gap-2 items-center">
        <span className="text-sm text-slate-600">Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Assigned to</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Due date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{t.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{t.assignedTo}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{t.status}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(t.id, t.status)}
                        className="text-sm text-slate-700 hover:text-slate-900"
                      >
                        Mark {t.status === "PENDING" ? "completed" : "pending"}
                      </button>
                    </td>
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
