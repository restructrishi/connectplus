import { useState } from "react";
import { apiFetcherRaw } from "../api/fetcher";
import { api, syncEmployeesToDb } from "../api/client";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface HeaderRow {
  id: string;
  key: string;
  value: string;
}

const METHODS: Method[] = ["GET", "POST", "PATCH", "PUT", "DELETE"];

/** Example: external HRMS employees API (use Proxy when CORS blocks direct call) */
const EXAMPLE_URL = "https://naturalistically-hyperopic-juelz.ngrok-free.dev/api/v1/integration/employees";
const EXAMPLE_X_API_KEY = "hrms_0920a9062c088fb694ac9971061cc207c41b67469cc9fae3";

function makeId() {
  return Math.random().toString(36).slice(2, 11);
}

export function ApiFetcher() {
  const [url, setUrl] = useState(EXAMPLE_URL);
  const [method, setMethod] = useState<Method>("GET");
  const [headers, setHeaders] = useState<HeaderRow[]>([
    { id: makeId(), key: "Content-Type", value: "application/json" },
    { id: makeId(), key: "x-api-key", value: EXAMPLE_X_API_KEY },
  ]);
  const [body, setBody] = useState("{\n  \n}");
  const [useAuth, setUseAuth] = useState(true);
  const [useProxy, setUseProxy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    ok: boolean;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: unknown;
    error?: string;
  } | null>(null);

  const addHeader = () => {
    setHeaders((h) => [...h, { id: makeId(), key: "", value: "" }]);
  };

  const updateHeader = (id: string, field: "key" | "value", value: string) => {
    setHeaders((h) => h.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const removeHeader = (id: string) => {
    setHeaders((h) => h.filter((r) => r.id !== id));
  };

  const buildHeaders = (): Record<string, string> => {
    const out: Record<string, string> = {};
    headers.forEach((r) => {
      if (r.key.trim()) out[r.key.trim()] = r.value;
    });
    return out;
  };

  const handleSend = async () => {
    setLoading(true);
    setResult(null);
    const targetUrl = url.trim();
    if (!targetUrl) {
      setResult({ ok: false, status: 0, statusText: "", headers: {}, data: null, error: "Enter a URL" });
      setLoading(false);
      return;
    }
    let parsedBody: unknown = undefined;
    if (method !== "GET" && body.trim()) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        setResult({
          ok: false,
          status: 0,
          statusText: "",
          headers: {},
          data: null,
          error: "Invalid JSON in body",
        });
        setLoading(false);
        return;
      }
    }
    const headerMap = buildHeaders();
    try {
      if (useProxy && (targetUrl.startsWith("http://") || targetUrl.startsWith("https://"))) {
        const r = await api.post<{ ok: boolean; status: number; statusText: string; headers: Record<string, string>; data: unknown }>("/proxy", {
          url: targetUrl,
          method,
          headers: headerMap,
          body: parsedBody,
        });
        if (r.data) setResult(r.data);
        else setResult({ ok: false, status: 0, statusText: "", headers: {}, data: null, error: "No response" });
      } else {
        const res = await apiFetcherRaw(
          targetUrl,
          { method, headers: headerMap, body: parsedBody },
          { baseUrl: "", useAuthToken: useAuth }
        );
        setResult(res);
      }
    } catch (e) {
      setResult({
        ok: false,
        status: 0,
        statusText: "",
        headers: {},
        data: null,
        error: e instanceof Error ? e.message : "Request failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDataArray = (): unknown[] | null => {
    if (!result?.ok || result.data == null) return null;
    const d = result.data as unknown;
    if (Array.isArray(d)) return d;
    if (typeof d === "object" && d !== null && "data" in d && Array.isArray((d as { data: unknown }).data)) {
      return (d as { data: unknown[] }).data;
    }
    return null;
  };

  const handleSaveToDb = async () => {
    const arr = getDataArray();
    if (!arr || arr.length === 0) {
      setSaveMessage("No employee array to save. Fetch the API first and ensure response is an array or { success: true, data: [...] }.");
      return;
    }
    const rows = arr as Record<string, unknown>[];
    setSaveLoading(true);
    setSaveMessage(null);
    try {
      const r = await syncEmployeesToDb(rows);
      setSaveMessage(r.data?.count != null ? `Saved ${r.data.count} employee(s) to database.` : "Saved to database.");
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaveLoading(false);
    }
  };

  const hasBody = method !== "GET";
  const canSave = result?.ok === true && getDataArray() != null && getDataArray()!.length > 0;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">API Fetcher</h1>
      <p className="text-slate-600 text-sm mb-6">
        Send requests with URL and headers (Postman-style). Use <strong>Proxy via backend</strong> for external APIs to avoid CORS (e.g. HRMS employees).
      </p>

      {/* Request */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
          Request
        </div>

        {/* Method + URL row */}
        <div className="p-4 flex flex-wrap gap-2 items-center">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as Method)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 bg-white"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Full URL (e.g. https://... or /api/dashboard)"
            className="flex-1 min-w-[280px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-slate-600" title="Send JWT for CRM API">
            <input type="checkbox" checked={useAuth} onChange={(e) => setUseAuth(e.target.checked)} />
            Auth token
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600" title="Forward via backend to avoid CORS for external URLs">
            <input type="checkbox" checked={useProxy} onChange={(e) => setUseProxy(e.target.checked)} />
            Proxy via backend
          </label>
          <button
            type="button"
            onClick={handleSend}
            disabled={loading}
            className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>

        {/* Headers */}
        <div className="border-t border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Headers</span>
            <button
              type="button"
              onClick={addHeader}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              + Add header
            </button>
          </div>
          <div className="space-y-2">
            {headers.map((row) => (
              <div key={row.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => updateHeader(row.id, "key", e.target.value)}
                  placeholder="Key"
                  className="rounded border border-slate-300 px-2 py-1.5 text-sm flex-1"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => updateHeader(row.id, "value", e.target.value)}
                  placeholder="Value"
                  className="rounded border border-slate-300 px-2 py-1.5 text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeHeader(row.id)}
                  className="text-slate-400 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        {hasBody && (
          <div className="border-t border-slate-200 px-4 py-3">
            <span className="text-sm font-medium text-slate-700 block mb-2">Body (JSON)</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              placeholder='{ "key": "value" }'
            />
          </div>
        )}
      </div>

      {/* Response */}
      {result && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className={`border-b border-slate-200 px-4 py-2 text-sm font-medium ${result.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            Response {result.status > 0 ? `${result.status} ${result.statusText}` : result.error}
          </div>
          <div className="p-4 space-y-4">
            {canSave && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveToDb}
                  disabled={saveLoading}
                  className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
                >
                  {saveLoading ? "Saving…" : "Save to database"}
                </button>
                {saveMessage && <span className="text-sm text-slate-600">{saveMessage}</span>}
              </div>
            )}
            {Object.keys(result.headers).length > 0 && (
              <div>
                <span className="text-sm font-medium text-slate-700 block mb-2">Response headers</span>
                <pre className="text-xs bg-slate-50 rounded p-3 overflow-x-auto">
                  {JSON.stringify(result.headers, null, 2)}
                </pre>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-slate-700 block mb-2">Body</span>
              <pre className="text-xs bg-slate-50 rounded p-3 overflow-x-auto max-h-96 overflow-y-auto">
                {typeof result.data === "object" && result.data !== null
                  ? JSON.stringify(result.data, null, 2)
                  : String(result.data)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
