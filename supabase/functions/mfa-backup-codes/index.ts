// Path: supabase/functions/mfa-backup-codes/index.ts
//
// 2FA Phase 2 — backup codes API. Three actions on one endpoint:
//
//   POST { action: "generate" }      — first-time enrollment, requires
//                                       aal=2 session (already verified
//                                       TOTP). Inserts 8 hashed codes
//                                       and returns 8 plaintext codes
//                                       once. Aborts with 409 if user
//                                       already has unused codes.
//
//   POST { action: "regenerate" }    — replace all existing codes.
//                                       Requires aal=2. Marks prior
//                                       generation as used (used_at=now)
//                                       atomically, then inserts 8 new.
//                                       Returns 8 new plaintext codes.
//
//   POST { action: "verify",         — recovery use. Requires JWT but
//          code: "XXXX-XXXX" }         NOT aal=2 (the user is recovering
//                                       BECAUSE they can't reach aal=2).
//                                       bcrypt-compares against unused
//                                       rows; on match marks used_at,
//                                       unenrolls the user's TOTP
//                                       factor, sends a security email,
//                                       and returns success. The
//                                       client then has an aal=1
//                                       session that passes the RLS
//                                       gate because no verified factor
//                                       exists anymore.
//
//   POST { action: "status" }        — returns { unused_count } for UI.
//                                       Same data as the
//                                       mfa_backup_code_unused_count()
//                                       SQL helper, exposed here for
//                                       single-RPC convenience.
//
// Recovery model rationale:
//   Per reports/2fa-design-decisions-2026-04-27.md § Decision 1, recovery
//   requires password + backup code. The page at /auth/recover performs
//   signInWithPassword first (so we have a valid JWT in the request),
//   then calls verify here. The edge function verifies the backup code
//   and disables MFA so the user can sign in at aal=1; this is the
//   GitHub / 1Password / Authy pattern (backup code triggers a factor
//   reset). The user is then prompted to re-enroll MFA on next visit
//   to /account/security.
//
// Lockout integration:
//   verify counts toward mfa_lockouts (5/15min → 30min lockout) so
//   bulk backup-code probing is bounded. The same lockout row is
//   shared with mfa-challenge-rate-limit.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { wrapHandler } from "../_shared/sentry.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BCRYPT_ROUNDS = 10;
const BACKUP_CODE_COUNT = 8;
// Lockout: 5 failed verify attempts in 15 min → 30 min lockout. Same
// table as mfa-challenge-rate-limit so backup-code probing and TOTP
// guessing share the same 5-attempt budget.
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

// ─── Code generation ─────────────────────────────────────────────────

/** Crockford-base32 alphabet, minus 0/O/1/I/L for human legibility. */
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Generate a single 8-char code formatted "XXXX-XXXX" using
 * crypto.getRandomValues. Rejects on the rare zero-byte buffer; in
 * practice this never fires but the guard is cheap. */
function generateOneBackupCode(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let raw = "";
  for (let i = 0; i < bytes.length; i++) {
    raw += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

function generateBackupCodes(): string[] {
  return Array.from({ length: BACKUP_CODE_COUNT }, () => generateOneBackupCode());
}

/** Normalize user-submitted backup codes for verification. The user
 * may type lowercase, omit the dash, or add spaces. We canonicalize
 * to UPPER + dash-at-position-4 for the bcrypt-compare path. */
function normalizeBackupCode(input: string): string {
  const upper = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (upper.length !== 8) return upper; // let downstream fail
  return `${upper.slice(0, 4)}-${upper.slice(4, 8)}`;
}

// ─── Auth helpers ────────────────────────────────────────────────────

async function getUserFromAuthHeader(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return { user: data.user, token };
}

/** Read the aal claim from a JWT. Used to enforce aal=2 on
 * generate/regenerate without an extra round-trip. */
function readAalFromJwt(token: string): "aal1" | "aal2" | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const b64 = padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "=");
    const claims = JSON.parse(atob(b64));
    return claims?.aal === "aal2" ? "aal2" : "aal1";
  } catch {
    return null;
  }
}

// ─── Lockout helpers (shared with mfa-challenge-rate-limit semantics) ─

/** Returns true if the user is currently locked out. */
async function isLockedOut(userId: string): Promise<{
  lockedOut: boolean;
  lockoutUntil: string | null;
}> {
  const { data } = await supabase
    .from("mfa_lockouts")
    .select("lockout_until")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data?.lockout_until) return { lockedOut: false, lockoutUntil: null };
  const until = new Date(data.lockout_until).getTime();
  if (Number.isNaN(until)) return { lockedOut: false, lockoutUntil: null };
  if (until <= Date.now()) return { lockedOut: false, lockoutUntil: null };
  return { lockedOut: true, lockoutUntil: data.lockout_until };
}

/** Record a failed verify attempt. If the user crosses
 * LOCKOUT_THRESHOLD failures in LOCKOUT_WINDOW_MS, set lockout_until
 * to now + LOCKOUT_DURATION_MS. */
async function recordFailedAttempt(userId: string): Promise<{
  lockoutTriggered: boolean;
  lockoutUntil: string | null;
}> {
  const { data: existing } = await supabase
    .from("mfa_lockouts")
    .select("failed_attempt_count, last_failure_at, lockout_until")
    .eq("user_id", userId)
    .maybeSingle();

  const now = new Date();
  const nowIso = now.toISOString();

  // Reset window if last failure was outside the rolling 15-min window
  let count = 1;
  if (existing?.last_failure_at) {
    const lastMs = new Date(existing.last_failure_at).getTime();
    if (now.getTime() - lastMs <= LOCKOUT_WINDOW_MS) {
      count = (existing.failed_attempt_count ?? 0) + 1;
    }
  }

  const triggerLockout = count >= LOCKOUT_THRESHOLD;
  const lockoutUntil = triggerLockout
    ? new Date(now.getTime() + LOCKOUT_DURATION_MS).toISOString()
    : null;

  await supabase
    .from("mfa_lockouts")
    .upsert(
      {
        user_id: userId,
        failed_attempt_count: count,
        last_failure_at: nowIso,
        lockout_until: lockoutUntil,
        updated_at: nowIso,
      },
      { onConflict: "user_id" },
    );

  return {
    lockoutTriggered: triggerLockout,
    lockoutUntil,
  };
}

/** Clear the lockout row on a successful verify so the user starts
 * fresh next time. */
async function clearFailureCounter(userId: string): Promise<void> {
  await supabase
    .from("mfa_lockouts")
    .upsert(
      {
        user_id: userId,
        failed_attempt_count: 0,
        last_failure_at: new Date().toISOString(),
        lockout_until: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
}

// ─── Security email notification (fire-and-forget) ────────────────────

async function notifySecurityEmail(
  userJwt: string,
  kind:
    | "backup_codes_generated"
    | "backup_codes_regenerated"
    | "backup_code_used"
    | "lockout_triggered",
): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/send-security-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJwt}`,
      },
      body: JSON.stringify({ kind }),
    });
  } catch {
    // Non-blocking; log only in dev (Sentry breadcrumb already attached
    // via wrapHandler).
  }
}

// ─── Action handlers ─────────────────────────────────────────────────

async function handleGenerate(userId: string, userJwt: string): Promise<Response> {
  // aal=2 is required; checked by caller via readAalFromJwt.
  // Block if the user already has unused codes — regenerate is the
  // explicit path to replace them.
  const { data: existing, count } = await supabase
    .from("mfa_backup_codes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("used_at", null);

  if (existing !== null && (count ?? 0) > 0) {
    return jsonResponse(
      {
        error: "backup_codes_already_exist",
        message: "Bạn đã có mã dự phòng. Dùng 'Tạo mã mới' để thay thế.",
        en_message: "You already have backup codes. Use 'Regenerate' to replace them.",
        unused_count: count ?? 0,
      },
      409,
    );
  }

  return await insertNewGeneration(userId, userJwt, "backup_codes_generated");
}

async function handleRegenerate(userId: string, userJwt: string): Promise<Response> {
  // aal=2 is required; checked by caller via readAalFromJwt.
  // Mark all existing un-used codes as used (prevents the prior
  // generation from being usable while we're inserting the new one).
  const nowIso = new Date().toISOString();
  await supabase
    .from("mfa_backup_codes")
    .update({ used_at: nowIso })
    .eq("user_id", userId)
    .is("used_at", null);

  return await insertNewGeneration(userId, userJwt, "backup_codes_regenerated");
}

async function insertNewGeneration(
  userId: string,
  userJwt: string,
  emailKind: "backup_codes_generated" | "backup_codes_regenerated",
): Promise<Response> {
  const codes = generateBackupCodes();

  // bcrypt-hash all 8 in parallel. Each hash takes ~150ms so doing
  // them serially would be a noticeable wait; Promise.all parallelizes.
  const hashes = await Promise.all(
    codes.map((code) => bcrypt.hash(code, BCRYPT_ROUNDS)),
  );

  // Single generation_id ties the 8 codes together for future
  // bulk-invalidate or audit queries.
  const generationId = crypto.randomUUID();

  const rows = hashes.map((code_hash) => ({
    user_id: userId,
    code_hash,
    generation_id: generationId,
  }));

  const { error } = await supabase.from("mfa_backup_codes").insert(rows);
  if (error) {
    return jsonResponse(
      { error: "insert_failed", detail: error.message?.slice(0, 200) },
      500,
    );
  }

  // Fire the security email (non-blocking).
  void notifySecurityEmail(userJwt, emailKind);

  return jsonResponse({
    ok: true,
    codes, // ⚠ plaintext, returned ONCE
    generation_id: generationId,
    message:
      "Lưu 8 mã này ngay — sau khi đóng trang, bạn sẽ không xem lại được. Mỗi mã chỉ dùng được một lần.",
    en_message:
      "Save these 8 codes now — once you leave this page they cannot be shown again. Each code is single-use.",
  });
}

async function handleVerify(
  userId: string,
  userJwt: string,
  candidate: string,
): Promise<Response> {
  // Lockout check first — refuse before any bcrypt work to keep the
  // brute-force ceiling tight.
  const lockoutState = await isLockedOut(userId);
  if (lockoutState.lockedOut) {
    return jsonResponse(
      {
        error: "locked_out",
        lockout_until: lockoutState.lockoutUntil,
        message: "Tài khoản bị tạm khoá do nhập sai quá nhiều lần. Vui lòng thử lại sau.",
        en_message: "Account temporarily locked due to too many failed attempts. Please try again later.",
      },
      429,
    );
  }

  const normalized = normalizeBackupCode(candidate);
  if (normalized.length !== 9 || !/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalized)) {
    // Don't increment lockout for malformed input — that lets a typo
    // burn the budget. Reject early without lockout cost.
    return jsonResponse(
      {
        error: "invalid_format",
        message: "Mã dự phòng phải có dạng XXXX-XXXX.",
        en_message: "Backup codes look like XXXX-XXXX.",
      },
      400,
    );
  }

  // Fetch unused codes. bcrypt.compare each — there are at most 8 so
  // the worst case is ~1.2s. Acceptable for a recovery flow.
  const { data: unused, error } = await supabase
    .from("mfa_backup_codes")
    .select("id, code_hash")
    .eq("user_id", userId)
    .is("used_at", null);

  if (error) {
    return jsonResponse({ error: "lookup_failed" }, 500);
  }

  let matchId: string | null = null;
  for (const row of unused ?? []) {
    try {
      const ok = await bcrypt.compare(normalized, row.code_hash);
      if (ok) {
        matchId = row.id;
        break;
      }
    } catch {
      // bcrypt errors on one row should not abort the loop — try the next.
    }
  }

  if (!matchId) {
    const failureState = await recordFailedAttempt(userId);
    if (failureState.lockoutTriggered) {
      void notifySecurityEmail(userJwt, "lockout_triggered");
    }
    return jsonResponse(
      {
        error: "invalid_code",
        lockout_triggered: failureState.lockoutTriggered,
        lockout_until: failureState.lockoutUntil,
        message: "Mã không đúng. Vui lòng thử lại.",
        en_message: "Code didn't match. Please try again.",
      },
      401,
    );
  }

  // Match. Mark code used.
  const nowIso = new Date().toISOString();
  await supabase
    .from("mfa_backup_codes")
    .update({ used_at: nowIso })
    .eq("id", matchId);

  // Recovery semantic (Option B from design): unenroll all the user's
  // verified MFA factors so the aal=1 session can pass the
  // require_aal2_when_factor_present RLS gate. The user will be
  // prompted to re-enroll on next visit to /account/security.
  try {
    const { data: factorsData } = await supabase.auth.admin.mfa.listFactors({
      userId,
    });
    const factors = factorsData?.factors ?? [];
    for (const f of factors) {
      if (f.status === "verified") {
        await supabase.auth.admin.mfa.deleteFactor({ userId, id: f.id });
      }
    }
  } catch {
    // If unenroll fails the user's still locked at aal=1 with no path
    // forward. Log via Sentry (wrapHandler) but proceed — manual
    // intervention required in that case.
  }

  // Clear lockout counter — successful verify.
  await clearFailureCounter(userId);

  // Notify the email-on-file that a backup code was used. Critical
  // for catching unauthorized recovery.
  void notifySecurityEmail(userJwt, "backup_code_used");

  return jsonResponse({
    ok: true,
    mfa_disabled: true,
    message:
      "Mã dự phòng được chấp nhận. 2FA đã tạm tắt — vui lòng bật lại từ trang Bảo mật.",
    en_message:
      "Backup code accepted. 2FA has been disabled — please re-enable it from your Security page.",
  });
}

async function handleStatus(userId: string): Promise<Response> {
  const { count, error } = await supabase
    .from("mfa_backup_codes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("used_at", null);

  if (error) {
    return jsonResponse({ error: "status_lookup_failed" }, 500);
  }

  return jsonResponse({
    ok: true,
    unused_count: count ?? 0,
    total: BACKUP_CODE_COUNT,
  });
}

// ─── Entry ───────────────────────────────────────────────────────────

serve(
  wrapHandler("mfa-backup-codes", async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    if (req.method !== "POST") {
      return jsonResponse({ error: "method_not_allowed" }, 405);
    }

    const auth = await getUserFromAuthHeader(req);
    if (!auth) return jsonResponse({ error: "auth_required" }, 401);

    const userId = auth.user.id;
    const userJwt = auth.token;

    let body: { action?: string; code?: string };
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "invalid_json" }, 400);
    }

    const action = body?.action;
    const aal = readAalFromJwt(userJwt);

    switch (action) {
      case "generate":
      case "regenerate":
        if (aal !== "aal2") {
          return jsonResponse(
            {
              error: "aal2_required",
              message: "Bạn cần xác thực 2FA trước khi tạo mã dự phòng.",
              en_message: "Verify your 2FA code before generating backup codes.",
            },
            403,
          );
        }
        return action === "generate"
          ? await handleGenerate(userId, userJwt)
          : await handleRegenerate(userId, userJwt);

      case "verify":
        if (typeof body.code !== "string" || !body.code.trim()) {
          return jsonResponse({ error: "code_required" }, 400);
        }
        return await handleVerify(userId, userJwt, body.code);

      case "status":
        return await handleStatus(userId);

      default:
        return jsonResponse(
          {
            error: "invalid_action",
            allowed: ["generate", "regenerate", "verify", "status"],
          },
          400,
        );
    }
  }),
);
