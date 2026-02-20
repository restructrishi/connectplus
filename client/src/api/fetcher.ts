/**
 * Functional API fetcher with configurable endpoint and headers.
 * Use for any API call where you need explicit control over URL and headers.
 */

const DEFAULT_BASE = "/api";

export interface FetcherConfig {
  /** Base URL (default: "/api"). No trailing slash. */
  baseUrl?: string;
  /** Whether to attach the stored JWT (default: true for same-origin CRM API). */
  useAuthToken?: boolean;
}

export interface FetcherOptions {
  /** HTTP method (default: "GET"). */
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  /** Request headers. Merged with defaults (Content-Type, optional Authorization). */
  headers?: Record<string, string>;
  /** Request body. Object is JSON.stringify'd; string is sent as-is. */
  body?: unknown;
}

const defaultConfig: FetcherConfig = {
  baseUrl: DEFAULT_BASE,
  useAuthToken: true,
};

function getToken(): string | null {
  return localStorage.getItem("crm_token");
}

/**
 * Build the full URL from base + endpoint.
 * Endpoint can be a path like "/auth/login" or a full URL (then base is ignored).
 */
function resolveUrl(baseUrl: string, endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const base = baseUrl.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

/**
 * Functional API fetcher.
 *
 * @param endpoint - Path (e.g. "/auth/login") or full URL.
 * @param options - Optional method, headers, body.
 * @param config - Optional baseUrl and useAuthToken.
 * @returns Parsed JSON response.
 * @throws Error with message from response or status text if request fails.
 *
 * @example
 * const data = await apiFetcher("/dashboard", { method: "GET" });
 *
 * @example
 * const res = await apiFetcher("/leads", {
 *   method: "POST",
 *   headers: { "X-Custom": "value" },
 *   body: { name: "Lead", email: "a@b.com" },
 * });
 *
 * @example
 * const res = await apiFetcher("https://api.example.com/v1/users", {
 *   method: "GET",
 *   headers: { "Authorization": "Bearer token" },
 * }, { baseUrl: "", useAuthToken: false });
 */
export async function apiFetcher<T = unknown>(
  endpoint: string,
  options: FetcherOptions = {},
  config: FetcherConfig = {}
): Promise<T> {
  const { baseUrl = defaultConfig.baseUrl!, useAuthToken = defaultConfig.useAuthToken } = {
    ...defaultConfig,
    ...config,
  };

  const url = resolveUrl(baseUrl, endpoint);
  const method = options.method ?? "GET";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (useAuthToken) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let body: string | undefined;
  if (options.body !== undefined && options.body !== null) {
    body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }

  const res = await fetch(url, {
    method,
    headers,
    ...(body !== undefined && { body }),
  });

  const json = await res.json().catch(() => ({})) as { message?: string; data?: T };

  if (!res.ok) {
    if (res.status === 401) localStorage.removeItem("crm_token");
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }

  return json as T;
}

/**
 * Convenience: GET request.
 */
export function fetcherGet<T = unknown>(
  endpoint: string,
  headers?: Record<string, string>,
  config?: FetcherConfig
): Promise<T> {
  return apiFetcher<T>(endpoint, { method: "GET", headers }, config);
}

/**
 * Convenience: POST request.
 */
export function fetcherPost<T = unknown>(
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>,
  config?: FetcherConfig
): Promise<T> {
  return apiFetcher<T>(endpoint, { method: "POST", headers, body }, config);
}

/** Response shape for Postman-style UI: always returns, never throws. */
export interface FetcherResult {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  error?: string;
}

/**
 * Send request and return full response (status, headers, body) for API management UI.
 * Does not throw; errors are in result.error and result.ok === false.
 */
export async function apiFetcherRaw(
  endpoint: string,
  options: FetcherOptions = {},
  config: FetcherConfig = {}
): Promise<FetcherResult> {
  const { baseUrl = defaultConfig.baseUrl!, useAuthToken = defaultConfig.useAuthToken } = {
    ...defaultConfig,
    ...config,
  };
  const url = resolveUrl(baseUrl, endpoint);
  const method = options.method ?? "GET";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (useAuthToken) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  let body: string | undefined;
  if (options.body !== undefined && options.body !== null) {
    body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }
  try {
    const res = await fetch(url, { method, headers, ...(body !== undefined && { body }) });
    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => { responseHeaders[k] = v; });
    const data = await res.json().catch(() => null);
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
      data,
      ...(res.status === 401 && { error: "Unauthorized" }),
    };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      statusText: "",
      headers: {},
      data: null,
      error: e instanceof Error ? e.message : "Request failed",
    };
  }
}
