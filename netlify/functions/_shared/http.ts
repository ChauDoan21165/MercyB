type HeaderValue = string | number | boolean;

export type NetlifyEvent = {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
  isBase64Encoded?: boolean;
};

export type NetlifyResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body?: string;
  isBase64Encoded?: boolean;
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
};

export function optionsResponse(): NetlifyResponse {
  return { statusCode: 204, headers: corsHeaders, body: "" };
}

export function json(
  payload: unknown,
  statusCode = 200,
  headers: Record<string, HeaderValue> = {},
): NetlifyResponse {
  return {
    statusCode,
    headers: normalizeHeaders({
      ...corsHeaders,
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    }),
    body: JSON.stringify(payload),
  };
}

export function audio(
  bytes: Buffer,
  headers: Record<string, HeaderValue> = {},
): NetlifyResponse {
  return {
    statusCode: 200,
    headers: normalizeHeaders({
      ...corsHeaders,
      "Cache-Control": "no-store",
      "Content-Type": "audio/mpeg",
      ...headers,
    }),
    body: bytes.toString("base64"),
    isBase64Encoded: true,
  };
}

export function readJsonBody<T extends Record<string, unknown>>(event: NetlifyEvent): Partial<T> {
  const raw = event.body || "";
  if (!raw) return {};
  try {
    const text = event.isBase64Encoded ? Buffer.from(raw, "base64").toString("utf8") : raw;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function envValue(name: string): string {
  return (process.env[name] || "").trim();
}

export function getHeader(event: NetlifyEvent, name: string): string {
  const target = name.toLowerCase();
  for (const [key, value] of Object.entries(event.headers || {})) {
    if (key.toLowerCase() === target) return value || "";
  }
  return "";
}

export function getBearerToken(event: NetlifyEvent): string {
  const auth = getHeader(event, "authorization");
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) return "";
  return token.trim();
}

export function getIp(event: NetlifyEvent): string {
  const forwarded =
    getHeader(event, "x-nf-client-connection-ip") ||
    getHeader(event, "x-real-ip") ||
    getHeader(event, "x-forwarded-for");
  return forwarded.split(",")[0]?.trim() || "unknown";
}

function normalizeHeaders(headers: Record<string, HeaderValue>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key, String(value)]),
  );
}
