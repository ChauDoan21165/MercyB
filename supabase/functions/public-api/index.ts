/**
 * Path: supabase/functions/public-api/index.ts
 *
 * Public API — Step 11. Auth via bearer key, sliding-window rate
 * limit, three read-only handlers behind versioned `/api/v1/*` paths.
 *
 * Layered design:
 *   1. CORS preflight
 *   2. extractBearerToken + key lookup → 401 on miss
 *   3. evaluateRateLimit against api_request_logs → 429 on over-budget
 *   4. route to handler
 *   5. log the request to api_request_logs (best-effort)
 *
 * Handler contracts: each takes a `RequestContext` and returns a
 * `HandlerResponse` so the wrapper handles logging + headers in one
 * place.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { hashApiKey, extractBearerToken } from "../../../src/lib/publicApi/keyHash.ts";
import {
  DEFAULT_RATE_LIMIT,
  evaluateRateLimit,
  rateLimitHeaders,
} from "../../../src/lib/publicApi/rateLimit.ts";

import { handleSentenceOfTheDay } from "./handlers/sentenceOfTheDay.ts";
import { handleL1Detect } from "./handlers/l1Detect.ts";
import { handlePublicStats } from "./handlers/publicStats.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

export type RequestContext = {
  url: URL;
  request: Request;
  /** Row from developer_api_keys, with the developer_account joined. */
  apiKey: {
    id: string;
    developer_account_id: string;
    scopes: string[];
  };
  supabaseAdmin: ReturnType<typeof createClient>;
};

export type HandlerResponse = {
  status: number;
  body: unknown;
  /** Optional headers merged into the final response. */
  headers?: Record<string, string>;
};

function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

async function lookupApiKey(rawToken: string) {
  const keyHash = await hashApiKey(rawToken);
  const { data, error } = await supabaseAdmin
    .from("developer_api_keys")
    .select("id, developer_account_id, scopes, revoked_at")
    .eq("key_hash", keyHash)
    .maybeSingle();
  if (error || !data) return null;
  if ((data as { revoked_at: string | null }).revoked_at) return null;
  return data as {
    id: string;
    developer_account_id: string;
    scopes: string[];
    revoked_at: string | null;
  };
}

async function loadRateLimitWindow(
  keyId: string,
  windowMs: number,
): Promise<number[]> {
  const cutoff = new Date(Date.now() - windowMs).toISOString();
  const { data, error } = await supabaseAdmin
    .from("api_request_logs")
    .select("created_at")
    .eq("key_id", keyId)
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(DEFAULT_RATE_LIMIT.limit + 1);
  if (error || !data) return [];
  return (data as { created_at: string }[]).map((r) =>
    new Date(r.created_at).getTime(),
  );
}

async function logRequest(
  keyId: string,
  endpoint: string,
  statusCode: number,
  ms: number,
  anonIp: string | null,
): Promise<void> {
  try {
    await supabaseAdmin.from("api_request_logs").insert({
      key_id: keyId,
      endpoint,
      status_code: statusCode,
      ms,
      anon_ip: anonIp,
    });
  } catch {
    /* best-effort — request log failure must not break the response */
  }
}

async function touchLastUsed(keyId: string): Promise<void> {
  try {
    await supabaseAdmin
      .from("developer_api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyId);
  } catch {
    /* best-effort */
  }
}

function routeHandler(
  pathname: string,
): ((ctx: RequestContext) => Promise<HandlerResponse>) | null {
  // Strip the function-name prefix that Supabase adds when the function
  // is mounted at /functions/v1/public-api/...
  const trimmed = pathname.replace(/^\/+functions\/+v1\/+public-api/, "")
    .replace(/^\/+public-api/, "")
    .replace(/^\/+/, "/");
  switch (trimmed) {
    case "/api/v1/sentence-of-the-day":
      return handleSentenceOfTheDay;
    case "/api/v1/l1-detect":
      return handleL1Detect;
    case "/api/v1/public-stats":
      return handlePublicStats;
    default:
      return null;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const startedAt = Date.now();
  const url = new URL(req.url);

  // Anonymous IP for abuse triage. Cloudflare / Supabase forwards via
  // these headers in this order of priority.
  const anonIp =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;

  // 1. Auth.
  const token = extractBearerToken(req.headers.get("authorization"));
  if (!token) {
    return jsonResponse(
      { error: "missing_or_malformed_bearer_token" },
      401,
    );
  }

  const apiKey = await lookupApiKey(token);
  if (!apiKey) {
    return jsonResponse({ error: "invalid_api_key" }, 401);
  }

  // 2. Rate limit.
  const window = await loadRateLimitWindow(
    apiKey.id,
    DEFAULT_RATE_LIMIT.windowMs,
  );
  const verdict = evaluateRateLimit(window, Date.now(), DEFAULT_RATE_LIMIT);
  const rlHeaders = rateLimitHeaders(verdict, DEFAULT_RATE_LIMIT);
  if (!verdict.allowed) {
    await logRequest(apiKey.id, url.pathname, 429, Date.now() - startedAt, anonIp);
    return jsonResponse({ error: "rate_limit_exceeded" }, 429, rlHeaders);
  }

  // 3. Route + dispatch.
  const handler = routeHandler(url.pathname);
  if (!handler) {
    await logRequest(apiKey.id, url.pathname, 404, Date.now() - startedAt, anonIp);
    return jsonResponse({ error: "endpoint_not_found" }, 404, rlHeaders);
  }

  let resp: HandlerResponse;
  try {
    resp = await handler({
      url,
      request: req,
      apiKey: {
        id: apiKey.id,
        developer_account_id: apiKey.developer_account_id,
        scopes: apiKey.scopes ?? [],
      },
      supabaseAdmin,
    });
  } catch (err) {
    console.error("[public-api] handler threw:", err);
    await logRequest(apiKey.id, url.pathname, 500, Date.now() - startedAt, anonIp);
    return jsonResponse({ error: "internal_error" }, 500, rlHeaders);
  }

  // 4. Side-effects: best-effort log + last-used bump.
  await Promise.all([
    logRequest(apiKey.id, url.pathname, resp.status, Date.now() - startedAt, anonIp),
    touchLastUsed(apiKey.id),
  ]);

  return jsonResponse(resp.body, resp.status, {
    ...rlHeaders,
    ...(resp.headers ?? {}),
  });
});
