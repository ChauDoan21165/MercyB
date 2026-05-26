// Path: supabase/functions/mfa-challenge-rate-limit/index.ts
//
// 2FA Phase 2 — TOTP-verify lockout coordinator.
//
// Why this exists:
//   Supabase Auth's mfa.verify() is the ONLY way to advance a session
//   to aal=2. It's a client-side SDK call; we can't replace it with an
//   edge-function relay because no admin API mints aal=2 JWTs. So the
//   client calls mfa.verify() directly.
//
//   This function lets the client cooperatively report success/failure
//   so the shared mfa_lockouts row gets incremented. The same row is
//   consulted by mfa-backup-codes; an attacker probing TOTP and backup
//   codes shares a single 5-attempt budget across both paths.
//
// Threat-model honesty:
//   A malicious client could skip the record_failure call after a
//   failed mfa.verify, evading TOTP-side lockout. Mitigations:
//     1. Supabase Auth has its own server-side rate limiting on
//        mfa.verify (documented). That floor stops bulk probes
//        regardless of what our table says.
//     2. The lockout gate IS server-enforced for the backup-code
//        path (mfa-backup-codes/index.ts checks isLockedOut before
//        any bcrypt work). So a TOTP attacker who reaches this
//        function honestly reports failures and contributes to the
//        budget; a TOTP attacker who lies about failures still
//        gets locked out the moment they try a backup code.
//     3. The expected attacker has the user's password and is
//        guessing TOTP — a 30-second-rotating 6-digit secret. Even
//        unlimited guesses are bounded at 1 in 1,000,000 per attempt;
//        Supabase's built-in floor + this cooperative report cover
//        the realistic risk.
//
// Actions:
//   POST { action: "check" }
//     → { locked_out: bool, lockout_until?: string, remaining?: int }
//   POST { action: "record_failure" }
//     → { lockout_triggered: bool, lockout_until?: string, attempts: int }
//   POST { action: "record_success" }
//     → { ok: true }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { wrapHandler } from "../_shared/sentry.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data.user?.id ?? null;
}

async function notifySecurityEmail(token: string, kind: "lockout_triggered"): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/send-security-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ kind }),
    });
  } catch {
    /* non-blocking */
  }
}

async function checkLockout(userId: string): Promise<Response> {
  const { data } = await supabase
    .from("mfa_lockouts")
    .select("lockout_until, failed_attempt_count, last_failure_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    return jsonResponse({
      locked_out: false,
      remaining: LOCKOUT_THRESHOLD,
    });
  }

  // Active lockout?
  if (data.lockout_until) {
    const until = new Date(data.lockout_until).getTime();
    if (!Number.isNaN(until) && until > Date.now()) {
      return jsonResponse({
        locked_out: true,
        lockout_until: data.lockout_until,
      });
    }
  }

  // Window-expired? Then the count effectively resets.
  let remaining = LOCKOUT_THRESHOLD;
  if (data.last_failure_at && data.failed_attempt_count) {
    const lastMs = new Date(data.last_failure_at).getTime();
    if (!Number.isNaN(lastMs) && Date.now() - lastMs <= LOCKOUT_WINDOW_MS) {
      remaining = Math.max(0, LOCKOUT_THRESHOLD - data.failed_attempt_count);
    }
  }

  return jsonResponse({
    locked_out: false,
    remaining,
  });
}

async function recordFailure(userId: string, token: string): Promise<Response> {
  const { data: existing } = await supabase
    .from("mfa_lockouts")
    .select("failed_attempt_count, last_failure_at, lockout_until")
    .eq("user_id", userId)
    .maybeSingle();

  // If currently locked out, the additional failure does not extend
  // the lockout — return the existing window so the client knows the
  // attempt was a no-op.
  if (existing?.lockout_until) {
    const until = new Date(existing.lockout_until).getTime();
    if (!Number.isNaN(until) && until > Date.now()) {
      return jsonResponse({
        lockout_triggered: false,
        lockout_until: existing.lockout_until,
        attempts: existing.failed_attempt_count ?? 0,
        already_locked: true,
      });
    }
  }

  const now = new Date();
  const nowIso = now.toISOString();

  let count = 1;
  if (existing?.last_failure_at) {
    const lastMs = new Date(existing.last_failure_at).getTime();
    if (!Number.isNaN(lastMs) && now.getTime() - lastMs <= LOCKOUT_WINDOW_MS) {
      count = (existing.failed_attempt_count ?? 0) + 1;
    }
  }

  const triggerLockout = count >= LOCKOUT_THRESHOLD;
  const lockoutUntil = triggerLockout
    ? new Date(now.getTime() + LOCKOUT_DURATION_MS).toISOString()
    : null;

  await supabase.from("mfa_lockouts").upsert(
    {
      user_id: userId,
      failed_attempt_count: count,
      last_failure_at: nowIso,
      lockout_until: lockoutUntil,
      updated_at: nowIso,
    },
    { onConflict: "user_id" },
  );

  if (triggerLockout) {
    void notifySecurityEmail(token, "lockout_triggered");
  }

  return jsonResponse({
    lockout_triggered: triggerLockout,
    lockout_until: lockoutUntil,
    attempts: count,
  });
}

async function recordSuccess(userId: string): Promise<Response> {
  await supabase.from("mfa_lockouts").upsert(
    {
      user_id: userId,
      failed_attempt_count: 0,
      last_failure_at: new Date().toISOString(),
      lockout_until: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  return jsonResponse({ ok: true });
}

serve(
  wrapHandler("mfa-challenge-rate-limit", async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    if (req.method !== "POST") {
      return jsonResponse({ error: "method_not_allowed" }, 405);
    }

    const userId = await getUserId(req);
    if (!userId) return jsonResponse({ error: "auth_required" }, 401);

    const token =
      (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();

    let body: { action?: string };
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "invalid_json" }, 400);
    }

    switch (body.action) {
      case "check":
        return await checkLockout(userId);
      case "record_failure":
        return await recordFailure(userId, token);
      case "record_success":
        return await recordSuccess(userId);
      default:
        return jsonResponse(
          { error: "invalid_action", allowed: ["check", "record_failure", "record_success"] },
          400,
        );
    }
  }),
);
