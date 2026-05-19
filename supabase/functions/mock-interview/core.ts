// supabase/functions/mock-interview/core.ts
//
// Pure handler for the mock-interview server-side rate limit. Splits
// from `index.ts` so vitest under Node can exercise the handler with
// fake `Deps` (no Deno, no Supabase round-trips). Mirrors the
// azure-phoneme split.
//
// Endpoints:
//   POST /mock-interview/start  body: { scenarioId }
//     → 200 { ok: true, sessionId, used_this_period, limit, allow_reason }
//     → 429 { ok: false, error_code, error_message_vi, error_message_en, ... }
//     → 401 missing/invalid JWT
//     → 400 missing scenarioId
//
//   POST /mock-interview/end/:sessionId
//     → 200 { ok: true }
//     → 404 session not found / not owner
//     → 401 missing/invalid JWT
//
// Failure mode: any infrastructure error (Postgres blip, missing
// admin RPC) returns the request as ALLOWED — brief: "DO NOT block
// existing mock interview UX during transition". The localStorage
// soft gate on the client side remains a backstop while we soak.

import {
  buildMockInterviewLimitErrorBody,
  checkMockInterviewRateLimit,
  type MockInterviewGateContext,
  type MockInterviewGateDeps,
  type MockInterviewGateResult,
} from "../_shared/mockInterviewRateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export interface UserProfile {
  /**
   * From `profiles.tier`. DEAD as a paid signal — that column is TEXT
   * so it always resolves to 0 here (B5/B17). Carried only for the
   * gate's defensive fallback; `isPaid` is the real paid signal.
   */
  tier: number;
  /** True when the user is in the free trial window. */
  isTrialing: boolean;
  /**
   * Entitled paid user per `profiles.premium_status` /
   * `premium_expires_at` (incl. past_due / grace_period dunning).
   * See _shared/premiumEntitlement.ts.
   */
  isPaid: boolean;
}

export interface MockInterviewSessionRow {
  id: string;
  user_id: string;
  scenario_id: string;
  started_at: string;
  completed_at: string | null;
  status: "active" | "completed" | "abandoned";
}

export interface Deps {
  /** Resolves the JWT and returns the user, or null on failure. */
  getUserFromAuthHeader: (req: Request) => Promise<{ id: string } | null>;
  /** Read tier + trialing flag from `profiles`. Null on miss. */
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
  /** Resolve admin level (0 if non-admin or RPC failure). */
  resolveAdminLevel: (userId: string) => Promise<number>;
  /** Count sessions started this ICT week — drives the rate-limit math. */
  countSessionsThisWeek: MockInterviewGateDeps["countSessionsThisWeek"];
  /** Insert a new session row; return the id. */
  insertSession: (userId: string, scenarioId: string) => Promise<string>;
  /** Mark a session completed. Returns true on success. */
  markSessionCompleted: (sessionId: string, userId: string) => Promise<boolean>;
  /** Override "now" for tests. */
  now?: () => Date;
}

export async function handleRequest(req: Request, deps: Deps): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const url = new URL(req.url);
  // The path includes the function name when called via /functions/v1/...
  // Strip everything up to and including 'mock-interview' so we can
  // route on the trailing segment.
  const path = url.pathname.replace(/^.*\/mock-interview/, "") || "/";

  const user = await deps.getUserFromAuthHeader(req);
  if (!user) {
    return json(
      {
        error: "auth_required",
        message: "Sign in to start a mock interview.",
        message_vi: "Vui lòng đăng nhập để bắt đầu phỏng vấn thử.",
      },
      401,
    );
  }

  if (path === "/start" || path === "/start/") {
    return handleStart(req, user.id, deps);
  }

  // /end/:sessionId
  const endMatch = path.match(/^\/end\/([0-9a-fA-F-]{36})\/?$/);
  if (endMatch) {
    return handleEnd(endMatch[1], user.id, deps);
  }

  return json({ error: "not_found", path }, 404);
}

async function handleStart(
  req: Request,
  userId: string,
  deps: Deps,
): Promise<Response> {
  let body: { scenarioId?: unknown };
  try {
    body = (await req.json()) as { scenarioId?: unknown };
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const scenarioId =
    typeof body.scenarioId === "string" && body.scenarioId.trim().length > 0
      ? body.scenarioId.trim()
      : null;
  if (!scenarioId) {
    return json({ error: "scenarioId_required" }, 400);
  }

  // Resolve tier + admin level in parallel; both fail-open to "least
  // privilege" (tier 0, adminLevel 0) so a Postgres blip doesn't grant
  // free unlimited access.
  const [profile, adminLevel] = await Promise.all([
    deps.fetchUserProfile(userId),
    deps.resolveAdminLevel(userId),
  ]);

  const ctx: MockInterviewGateContext = {
    userId,
    tier: profile?.tier ?? 0,
    isTrialing: profile?.isTrialing ?? false,
    isPaid: profile?.isPaid ?? false,
    adminLevel,
  };

  let gate: MockInterviewGateResult;
  try {
    gate = await checkMockInterviewRateLimit(ctx, {
      countSessionsThisWeek: deps.countSessionsThisWeek,
      now: deps.now,
    });
  } catch (err) {
    console.error("[mock-interview] gate threw — failing open:", err);
    // Brief: "DO NOT block existing mock interview UX during
    // transition". A telemetry blip should not lock the user out;
    // localStorage soft gate on the client remains a backstop.
    return startSessionAndReturn(userId, scenarioId, deps, {
      allowed: true,
      reason: "within_free_limit",
      used_this_period: 0,
      limit: 1,
      retry_after_seconds: 0,
      resets_at: new Date().toISOString(),
    });
  }

  if (!gate.allowed) {
    const body = buildMockInterviewLimitErrorBody(gate);
    return new Response(JSON.stringify(body), {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": String(gate.retry_after_seconds),
      },
    });
  }

  return startSessionAndReturn(userId, scenarioId, deps, gate);
}

async function startSessionAndReturn(
  userId: string,
  scenarioId: string,
  deps: Deps,
  gate: MockInterviewGateResult,
): Promise<Response> {
  let sessionId: string;
  try {
    sessionId = await deps.insertSession(userId, scenarioId);
  } catch (err) {
    console.error("[mock-interview] insertSession failed:", err);
    return json({ error: "insert_failed" }, 500);
  }
  return json({
    ok: true,
    sessionId,
    used_this_period: gate.used_this_period + 1,
    limit:
      gate.limit === Number.POSITIVE_INFINITY ? null : gate.limit,
    allow_reason: gate.reason,
    resets_at: gate.resets_at,
  });
}

async function handleEnd(
  sessionId: string,
  userId: string,
  deps: Deps,
): Promise<Response> {
  let ok = false;
  try {
    ok = await deps.markSessionCompleted(sessionId, userId);
  } catch (err) {
    console.error("[mock-interview] markSessionCompleted threw:", err);
    return json({ error: "update_failed" }, 500);
  }
  if (!ok) {
    return json({ error: "session_not_found" }, 404);
  }
  return json({ ok: true });
}
