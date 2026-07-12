type EdgeFailureLogContext = {
  request?: Request;
  route: string;
  mode?: string;
  status: number;
  errorClass: string;
  requestId?: string;
  detail?: Record<string, string | number | boolean | null | undefined>;
};

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
