export type PagesEnv = Record<string, string | undefined>;

export type PagesContext = {
  request: Request;
  env: PagesEnv;
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
};

export function optionsResponse(): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export function json(payload: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

export function audio(bytes: ArrayBuffer | Uint8Array, headers: HeadersInit = {}): Response {
  const body = bytes instanceof Uint8Array ? bytes.slice().buffer as ArrayBuffer : bytes;
  return new Response(body, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store",
      "Content-Type": "audio/mpeg",
      ...headers,
    },
  });
}

export async function readJsonBody<T extends Record<string, unknown>>(
  request: Request,
): Promise<Partial<T>> {
  const text = await request.text();
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function envValue(env: PagesEnv, name: string): string {
  return (env[name] ?? "").trim();
}

export function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function getBearerToken(request: Request): string {
  const auth = request.headers.get("authorization") ?? "";
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) return "";
  return token.trim();
}
