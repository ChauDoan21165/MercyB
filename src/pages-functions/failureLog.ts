import { json, type PagesContext } from "./http";

type FailureLogContext = {
  context?: PagesContext;
  request?: Request;
  route: string;
  mode?: string;
  status: number;
  errorClass: string;
  requestId?: string;
  detail?: Record<string, string | number | boolean | null | undefined>;
};

type WithWaitUntil = { waitUntil?: (promise: Promise<unknown>) => void };

function createRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getRequestId(request: Request | undefined): string {
  return (
    request?.headers.get("x-request-id") ||
    request?.headers.get("cf-ray") ||
    createRequestId()
  );
}

export function logFunctionFailure({
  context,
  request,
  route,
  mode = "unknown",
  status,
  errorClass,
  requestId = getRequestId(request),
  detail,
}: FailureLogContext): string {
  console.error(JSON.stringify({
    event: "function_failure",
    route,
    mode,
    status,
    errorClass,
    requestId,
    ...(detail ? { detail } : {}),
  }));
  if (context) schedulePagesFailureLog(context, {
    source: "cf-pages",
    function_name: functionNameFromRoute(route),
    endpoint: route,
    status,
    error_signature: errorClass,
    message: safeMessage(errorClass, status, detail),
    request_id: requestId,
    detail: safeDetail(mode, detail),
  });
  return requestId;
}

export function failureJson(
  context: PagesContext,
  route: string,
  mode: string,
  status: number,
  errorClass: string,
  payload: unknown,
  detail?: FailureLogContext["detail"],
): Response {
  const requestId = logFunctionFailure({
    context,
    request: context.request,
    route,
    mode,
    status,
    errorClass,
    detail,
  });
  return json(payload, status, { "X-Request-Id": requestId });
}

function schedulePagesFailureLog(
  context: PagesContext,
  row: Record<string, unknown>,
): void {
  const supabaseUrl = (context.env.SUPABASE_URL || context.env.VITE_SUPABASE_URL || "").trim();
  const anonKey = (context.env.SUPABASE_ANON_KEY || context.env.VITE_SUPABASE_ANON_KEY || "").trim();
  if (!supabaseUrl || !anonKey) return;

  try {
    const maybeTask = (fetch as (...args: Parameters<typeof fetch>) => unknown)(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/function_failure_logs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(row),
      },
    );
    if (!maybeTask || typeof (maybeTask as { then?: unknown }).then !== "function") return;
    const task = (maybeTask as Promise<Response>).then((response) => {
      if (!response.ok) {
        console.error("[function_failure] function_failure_logs insert failed:", response.status);
      }
    }).catch((error) => {
      console.error("[function_failure] function_failure_logs background failed:", error);
    });

    const waitUntil = (context as PagesContext & WithWaitUntil).waitUntil;
    if (typeof waitUntil === "function") waitUntil(task);
    else void task;
  } catch (error) {
    console.error("[function_failure] function_failure_logs scheduling failed:", error);
  }
}

function functionNameFromRoute(route: string): string {
  const trimmed = route.trim();
  if (!trimmed) return "unknown";
  const parts = trimmed.split("/").filter(Boolean);
  if (parts[0] === "api" && parts[1]) return parts[1];
  return parts.at(-1) ?? trimmed;
}

function safeMessage(
  errorClass: string,
  status: number,
  detail: FailureLogContext["detail"],
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
  detail: FailureLogContext["detail"],
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
