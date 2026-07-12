export function isKeepaliveRequestBody(bodyText: string): boolean {
  const trimmed = bodyText.trim();
  if (!trimmed) return true;

  try {
    const body = JSON.parse(trimmed) as unknown;
    if (!body || Array.isArray(body) || typeof body !== "object") return false;
    const record = body as Record<string, unknown>;
    return Object.keys(record).length === 0 || record.keepalive === true;
  } catch {
    return false;
  }
}
