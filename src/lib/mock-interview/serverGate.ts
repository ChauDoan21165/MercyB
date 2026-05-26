// src/lib/mock-interview/serverGate.ts
//
// Client wrapper for the `mock-interview` edge function. Authoritative
// server-side rate limit replacing the localStorage soft gate (which
// stays in place during the soak window per the brief).
//
// Two endpoints:
//   POST /functions/v1/mock-interview/start  → 200 ok or 429 limit
//   POST /functions/v1/mock-interview/end/:sessionId → 200 ok
//
// The 429 body shape is the bilingual error from
// `_shared/mockInterviewRateLimit.ts.buildMockInterviewLimitErrorBody`.
// Local helpers below mirror that contract; server is the source of
// truth.

import { supabase } from "@/lib/supabaseClient";

export type StartGateResult =
  | { kind: "allowed"; sessionId: string; usedThisPeriod: number; limit: number | null; reason: string; resetsAt: string }
  | { kind: "blocked"; usedThisPeriod: number; limit: number; retryAfterSeconds: number; resetsAt: string; messageVi: string; messageEn: string }
  | { kind: "error"; reason: "auth" | "network" | "unknown"; httpStatus?: number };

const FUNCTION_NAME = "mock-interview";

/**
 * Ask the server for permission to start a session. On `allowed`, the
 * server already inserted the row — caller advances to the questions.
 * On `blocked`, caller surfaces the bilingual upgrade prompt.
 */
export async function startMockInterviewSession(
  scenarioId: string,
): Promise<StartGateResult> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  if (!accessToken) {
    return { kind: "error", reason: "auth" };
  }

  const url = resolveFunctionUrl("/start");
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ scenarioId }),
    });
  } catch (err) {
    console.warn("[mockInterview/serverGate] /start network error:", err);
    return { kind: "error", reason: "network" };
  }

  if (res.status === 401) {
    return { kind: "error", reason: "auth", httpStatus: 401 };
  }

  if (res.status === 429) {
    try {
      const body = await res.json();
      return {
        kind: "blocked",
        usedThisPeriod: numberOr(body.used_this_period, 1),
        limit: numberOr(body.limit, 1),
        retryAfterSeconds: numberOr(body.retry_after_seconds, 0),
        resetsAt: typeof body.resets_at === "string" ? body.resets_at : "",
        messageVi: typeof body.error_message_vi === "string" ? body.error_message_vi : "",
        messageEn: typeof body.error_message_en === "string" ? body.error_message_en : "",
      };
    } catch {
      return { kind: "error", reason: "unknown", httpStatus: 429 };
    }
  }

  if (!res.ok) {
    return { kind: "error", reason: "unknown", httpStatus: res.status };
  }

  let body: Record<string, unknown>;
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    return { kind: "error", reason: "unknown", httpStatus: res.status };
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  if (!sessionId) {
    return { kind: "error", reason: "unknown", httpStatus: res.status };
  }

  return {
    kind: "allowed",
    sessionId,
    usedThisPeriod: numberOr(body.used_this_period, 1),
    limit: typeof body.limit === "number" ? body.limit : null,
    reason: typeof body.allow_reason === "string" ? body.allow_reason : "unknown",
    resetsAt: typeof body.resets_at === "string" ? body.resets_at : "",
  };
}

/**
 * Mark a session completed. Best-effort — failure here doesn't break
 * the user experience (the session just stays as `active` and the
 * abandoned-session reaper handles it later).
 */
export async function endMockInterviewSession(sessionId: string): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  if (!accessToken) return false;

  try {
    const res = await fetch(resolveFunctionUrl(`/end/${sessionId}`), {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

function resolveFunctionUrl(suffix: string): string {
  const base = (import.meta as ImportMeta & { env?: Record<string, string> }).env
    ?.VITE_SUPABASE_URL;
  if (typeof base === "string" && base.length > 0) {
    return `${base.replace(/\/$/, "")}/functions/v1/${FUNCTION_NAME}${suffix}`;
  }
  // Vite proxies /functions/v1 → Supabase in dev; same path works
  // when served from the production app at the same origin.
  return `/functions/v1/${FUNCTION_NAME}${suffix}`;
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
