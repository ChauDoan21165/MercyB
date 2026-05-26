export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data, null, 2), { ...init, headers });
}

export function error(message: string, status = 400, details?: Record<string, unknown>) {
  return json({ ok: false, error: message, ...(details ?? {}) }, { status });
}
