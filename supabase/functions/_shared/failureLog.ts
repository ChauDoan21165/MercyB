type EdgeFailureLogContext = {
  request?: Request;
  route: string;
  mode?: string;
  status: number;
  errorClass: string;
  requestId?: string;
  detail?: Record<string, string | number | boolean | null | undefined>;
};

type DenoEnv = { get(name: string): string | undefined };
type EdgeRuntimeLike = { waitUntil?: (promise: Promise<unknown>) => void };

function createRequestId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function getEdgeRequestId(request: Request | undefined): string {
  return (
    request?.headers.get("x-request-id") ||
    request?.headers.get("x-supabase-request-id") ||
    request?.headers.get("cf-ray") ||
    createRequestId()
  );
}

export function logEdgeFunctionFailure({
  request,
  route,
  mode = "unknown",
  status,
  errorClass,
  requestId = getEdgeRequestId(request),
  detail,
}: EdgeFailureLogContext): string {
  console.error(JSON.stringify({
    event: "edge_function_failure",
    route,
    mode,
    status,
    errorClass,
    requestId,
    ...(detail ? { detail } : {}),
  }));
  scheduleEdgeFailureLog({
    source: "edge-fn",
    function_name: functionNameFromRoute(route),
    endpoint: endpointFromRequest(request, route),
    status,
    error_signature: errorClass,
    message: safeMessage(errorClass, status, detail),
    request_id: requestId,
    detail: safeDetail(mode, detail),
  });
  return requestId;
}

export function failureJsonResponse(
  request: Request,
  route: string,
  mode: string,
  status: number,
  errorClass: string,
  body: unknown,
  headers: HeadersInit = {},
  detail?: EdgeFailureLogContext["detail"],
): Response {
  const requestId = logEdgeFunctionFailure({
    request,
    route,
    mode,
    status,
    errorClass,
    detail,
  });
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
    },
  });
}

function scheduleEdgeFailureLog(row: Record<string, unknown>): void {
  const denoEnv = (globalThis as { Deno?: { env?: DenoEnv } }).Deno?.env;
  const supabaseUrl = (denoEnv?.get("SUPABASE_URL") ?? "").trim();
  const anonKey = (denoEnv?.get("SUPABASE_ANON_KEY") ?? "").trim();
  if (!supabaseUrl || !anonKey) return;

  const task = fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/function_failure_logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  }).then((response) => {
    if (!response.ok) {
      console.error("[edge_function_failure] function_failure_logs insert failed:", response.status);
    }
  }).catch((error) => {
    console.error("[edge_function_failure] function_failure_logs background failed:", error);
  });

  const edgeRuntime = (globalThis as { EdgeRuntime?: EdgeRuntimeLike }).EdgeRuntime;
  if (typeof edgeRuntime?.waitUntil === "function") edgeRuntime.waitUntil(task);
  else void task;
}

function endpointFromRequest(request: Request | undefined, route: string): string {
  if (!request) return `/functions/v1/${functionNameFromRoute(route)}`;
  try {
    return new URL(request.url).pathname;
  } catch {
    return `/functions/v1/${functionNameFromRoute(route)}`;
  }
}

function functionNameFromRoute(route: string): string {
  const trimmed = route.trim();
  if (!trimmed) return "unknown";
  return trimmed.split("/").filter(Boolean).at(-1) ?? trimmed;
}

function safeMessage(
  errorClass: string,
  status: number,
  detail: EdgeFailureLogContext["detail"],
): string {
  const safeParts = [
    typeof detail?.errorName === "string" ? detail.errorName : null,
    typeof detail?.provider === "string" ? `provider=${detail.provider}` : null,
    typeof detail?.providerStatus === "number" ? `provider_status=${detail.providerStatus}` : null,
  ].filter(Boolean);
  return `${errorClass} status=${status}${safeParts.length ? ` ${safeParts.join(" ")}` : ""}`.slice(0, 200);
}

function safeDetail(
  mode: string,
  detail: EdgeFailureLogContext["detail"],
): Record<string, string | number | boolean | null> {
  const safe: Record<string, string | number | boolean | null> = { mode };
  for (const key of ["provider", "providerStatus", "errorName", "timeout", "seed"] as const) {
    const value = detail?.[key];
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
      safe[key] = value;
    }
  }
  return safe;
}
