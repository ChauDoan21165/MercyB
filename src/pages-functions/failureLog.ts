import { json, type PagesContext } from "./http";

type FailureLogContext = {
  request?: Request;
  route: string;
  mode?: string;
  status: number;
  errorClass: string;
  requestId?: string;
  detail?: Record<string, string | number | boolean | null | undefined>;
};

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
    request: context.request,
    route,
    mode,
    status,
    errorClass,
    detail,
  });
  return json(payload, status, { "X-Request-Id": requestId });
}
