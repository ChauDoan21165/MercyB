/**
 * Path: src/lib/security/mfaClient.ts
 *
 * Thin wrapper around supabase.auth.mfa.* so the rest of the app can
 * call into MFA without each component re-implementing the same
 * boilerplate. Phase 1 covers TOTP only; backup codes land in Phase 2.
 *
 * Why a wrapper:
 *   - Centralizes telemetry — every MFA event flows through one
 *     module, so Sentry breadcrumbs are consistent.
 *   - Centralizes error humanization — the SDK throws structured
 *     errors with `name` codes; the UI needs friendly bilingual
 *     messages.
 *   - Lets us swap in a fake during tests without each component
 *     mocking the supabase client directly.
 *
 * Privacy: this module never logs TOTP codes, factor secrets, or
 * challenge IDs. See mfaTelemetry.ts for the telemetry surface.
 */

import { supabase } from "@/lib/supabaseClient";
import { captureMfaError, trackMfaEvent } from "./mfaTelemetry";

export type MfaFactor = {
  id: string;
  factor_type: "totp" | "phone";
  status: "verified" | "unverified";
  friendly_name?: string | null;
  created_at?: string;
};

export type EnrollResult = {
  factorId: string;
  /** Data-URI SVG. Render in `<img src={qrCode} />`. */
  qrCode: string;
  /**
   * Manual-entry secret. Useful when the user can't scan the QR
   * (kids mode disallows webcam, paid users on desktop without a
   * second device). Show alongside the QR.
   */
  secret: string;
  /** otpauth:// URI, useful for "copy link" deep-linkers. */
  uri: string;
};

export type ChallengeResult = {
  factorId: string;
  challengeId: string;
};

/**
 * List the user's MFA factors. We treat the user as "MFA enabled" if
 * they have any factor with status === "verified".
 */
export async function listMfaFactors(): Promise<MfaFactor[]> {
  try {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw error;
    // The SDK groups factors by type ({totp: [...], phone: [...]}).
    // Flatten to a single list — Phase 1 only cares about TOTP, but
    // returning all keeps the surface generic for Phase 2.
    const all: MfaFactor[] = [
      ...(data?.totp ?? []),
      ...(data?.phone ?? []),
    ];
    return all;
  } catch (err) {
    captureMfaError("list_factors", err);
    throw err;
  }
}

export function hasVerifiedTotpFactor(factors: MfaFactor[]): boolean {
  return factors.some((f) => f.factor_type === "totp" && f.status === "verified");
}

export function findFirstVerifiedTotp(factors: MfaFactor[]): MfaFactor | null {
  return factors.find((f) => f.factor_type === "totp" && f.status === "verified") ?? null;
}

/**
 * Begin enrollment. Returns the QR code (data-URI SVG) and the
 * fallback secret to render in the UI. The user MUST then call
 * `verifyEnrollment(factorId, code)` with a valid TOTP from their
 * authenticator app to actually activate the factor.
 */
export async function enrollTotp(friendlyName?: string): Promise<EnrollResult> {
  trackMfaEvent("mfa_enroll_started");
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: friendlyName ?? "MercyBlade",
    });
    if (error) throw error;
    if (!data || data.type !== "totp") {
      throw new Error("mfa_enroll_unexpected_response");
    }
    return {
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    };
  } catch (err) {
    captureMfaError("enroll", err);
    throw err;
  }
}

/**
 * Cancel an in-progress enrollment (user backs out of the QR step).
 * Calls unenroll on the unverified factor so it doesn't sit around
 * cluttering the user's MFA list.
 */
export async function cancelEnrollment(factorId: string): Promise<void> {
  trackMfaEvent("mfa_enroll_aborted", { factorId });
  try {
    await supabase.auth.mfa.unenroll({ factorId });
  } catch (err) {
    // Best-effort cleanup. If the abort fails, the unverified factor
    // sits in the user's list until they retry — annoying but not
    // a security issue.
    captureMfaError("disable", err, { context: "cancel_enrollment" });
  }
}

/**
 * Verify the user's first 6-digit code from the authenticator app.
 * On success the factor flips to status="verified" and counts as
 * MFA-enabled for this account.
 */
export async function verifyEnrollment(
  factorId: string,
  code: string,
): Promise<void> {
  try {
    // Step 1: get a challenge ID for the factor we just enrolled.
    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) throw challenge.error;
    const challengeId = challenge.data?.id;
    if (!challengeId) throw new Error("mfa_challenge_missing_id");

    // Step 2: verify the user's code against the challenge.
    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });
    if (verify.error) throw verify.error;

    trackMfaEvent("mfa_enroll_verified", { factorId });
  } catch (err) {
    captureMfaError("verify", err, { phase: "enroll" });
    throw err;
  }
}

/**
 * Begin a login-time challenge for an already-verified factor.
 * Returns the challengeId; pair with `verifyChallenge(...)` after
 * the user enters their code.
 */
export async function challengeFactor(factorId: string): Promise<ChallengeResult> {
  trackMfaEvent("mfa_login_challenge_shown", { factorId });
  try {
    const { data, error } = await supabase.auth.mfa.challenge({ factorId });
    if (error) throw error;
    if (!data?.id) throw new Error("mfa_challenge_missing_id");
    return { factorId, challengeId: data.id };
  } catch (err) {
    captureMfaError("challenge", err);
    throw err;
  }
}

/**
 * Submit the user's TOTP code for an active challenge. On success
 * the session's authenticator-assurance level (aal) goes from 1
 * → 2, completing the login.
 */
export async function verifyChallenge(
  factorId: string,
  challengeId: string,
  code: string,
): Promise<void> {
  try {
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });
    if (error) {
      trackMfaEvent("mfa_login_failed", { reason: error.message?.slice(0, 50) });
      throw error;
    }
    trackMfaEvent("mfa_login_verified", { factorId });
  } catch (err) {
    captureMfaError("verify", err, { phase: "login" });
    throw err;
  }
}

export type AalLevels = {
  /** What the session is at right now. Either "aal1" (password only)
   * or "aal2" (password + TOTP verified). */
  currentLevel: "aal1" | "aal2" | null;
  /** What this user could reach if they completed any pending
   * challenges. If currentLevel < nextLevel a challenge is required. */
  nextLevel: "aal1" | "aal2" | null;
};

/**
 * Returns the current and next assurance levels for the signed-in user.
 *
 * Decision logic for the client guard:
 *   - currentLevel === null: not signed in.
 *   - currentLevel === nextLevel === "aal1": user has no factors;
 *     they're as authenticated as they can get. Pass through.
 *   - currentLevel === nextLevel === "aal2": fully MFA-authed. Pass.
 *   - currentLevel === "aal1" && nextLevel === "aal2": user has a
 *     verified factor but the session has not satisfied it yet.
 *     The client guard MUST redirect to a challenge page.
 *
 * This wraps `supabase.auth.mfa.getAuthenticatorAssuranceLevel()`
 * which reads from the local session JWT — no network round-trip in
 * the modern SDK.
 */
export async function getAal(): Promise<AalLevels> {
  try {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) throw error;
    return {
      currentLevel: (data?.currentLevel ?? null) as AalLevels["currentLevel"],
      nextLevel: (data?.nextLevel ?? null) as AalLevels["nextLevel"],
    };
  } catch (err) {
    captureMfaError("list_factors", err, { context: "getAal" });
    throw err;
  }
}

/**
 * Convenience predicate used by the route guard. Returns `true` when
 * the user holds a verified factor but their session is at aal=1 —
 * meaning we should force them to /auth/challenge before letting them
 * reach any sensitive route. Falls back to `false` on any error so
 * a transient SDK hiccup doesn't lock the user out of the app
 * entirely (the server-side RLS gate from the 20260524 migration is
 * the actual security boundary; this is the UX layer).
 */
export async function needsAal2Upgrade(): Promise<boolean> {
  try {
    const { currentLevel, nextLevel } = await getAal();
    return currentLevel === "aal1" && nextLevel === "aal2";
  } catch {
    return false;
  }
}

/**
 * Disable MFA. Caller must already have re-authenticated (Supabase
 * enforces aal=2 before unenroll succeeds, so the user must enter a
 * fresh TOTP before this call). The /account/security UI handles
 * that re-auth step before invoking this.
 */
export async function disableTotpFactor(factorId: string): Promise<void> {
  try {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw error;
    trackMfaEvent("mfa_disable_succeeded", { factorId });
  } catch (err) {
    captureMfaError("disable", err);
    throw err;
  }
}

/**
 * Map structured Supabase auth errors to bilingual UI strings.
 * Kept here so the components don't all reimplement it.
 */
export function humanizeMfaError(err: unknown): { en: string; vi: string } {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes("invalid totp code") || lower.includes("invalid_otp_code")) {
    return {
      en: "That code didn't match. Try again, or check that your phone's clock is on auto-time.",
      vi: "Mã không khớp. Bạn thử lại, hoặc kiểm tra điện thoại đã bật giờ tự động chưa nhé.",
    };
  }

  if (lower.includes("too many requests") || lower.includes("rate limit")) {
    return {
      en: "Too many attempts. Wait a minute and try again.",
      vi: "Bạn thử quá nhiều lần. Chờ một phút rồi thử lại nhé.",
    };
  }

  if (lower.includes("aal") || lower.includes("aal2")) {
    return {
      en: "Please enter your authenticator code first to confirm this change.",
      vi: "Vui lòng nhập mã xác thực để xác nhận thay đổi này.",
    };
  }

  return {
    en: "Something went wrong. Please try again.",
    vi: "Có lỗi xảy ra. Vui lòng thử lại.",
  };
}

// ─── Phase 2: backup codes + lockout coordinator ──────────────────────

/**
 * Result of a backup-code generate/regenerate. The plaintext codes
 * are shown ONCE; once the user navigates away the only path to
 * recover is to regenerate (which invalidates these).
 */
export type BackupCodesResult = {
  codes: string[];
  generation_id: string;
};

function getSupabaseUrl(): string {
  return String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
}

async function callMfaBackupCodes<T>(body: Record<string, unknown>): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;
  if (!jwt) throw new Error("not_signed_in");

  const baseUrl = getSupabaseUrl();
  if (!baseUrl) throw new Error("supabase_url_missing");

  const res = await fetch(`${baseUrl}/functions/v1/mfa-backup-codes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Throw an Error whose message is the server-provided code so
    // humanizeMfaError can route it.
    const err = new Error(
      typeof json?.error === "string" ? json.error : `http_${res.status}`,
    );
    (err as Error & { details?: unknown }).details = json;
    throw err;
  }
  return json as T;
}

async function callMfaRateLimit<T>(action: "check" | "record_failure" | "record_success"): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;
  if (!jwt) throw new Error("not_signed_in");

  const baseUrl = getSupabaseUrl();
  if (!baseUrl) throw new Error("supabase_url_missing");

  const res = await fetch(`${baseUrl}/functions/v1/mfa-challenge-rate-limit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ action }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      typeof json?.error === "string" ? json.error : `http_${res.status}`,
    );
    (err as Error & { details?: unknown }).details = json;
    throw err;
  }
  return json as T;
}

/**
 * Generate 8 backup codes for the first time. Requires aal=2.
 * Returns plaintext codes ONCE — they cannot be re-displayed.
 *
 * Throws "backup_codes_already_exist" if the user already has unused
 * codes; call regenerateBackupCodes() to replace them instead.
 */
export async function generateBackupCodes(): Promise<BackupCodesResult> {
  return await callMfaBackupCodes<BackupCodesResult>({ action: "generate" });
}

/**
 * Replace all existing backup codes with 8 fresh ones. Requires aal=2
 * (user must have entered TOTP recently). Old codes are atomically
 * marked used before the new ones are inserted.
 */
export async function regenerateBackupCodes(): Promise<BackupCodesResult> {
  return await callMfaBackupCodes<BackupCodesResult>({ action: "regenerate" });
}

/**
 * Verify a backup code as part of the recovery flow at /auth/recover.
 * On match the server unenrolls the user's verified TOTP factor so
 * the (already aal=1) session passes the require_aal2_when_factor_present
 * RLS gate. The user is then prompted to re-enroll MFA.
 *
 * Caller MUST already have a valid signed-in session — the recovery
 * page calls supabase.auth.signInWithPassword first.
 */
export async function verifyBackupCode(code: string): Promise<{ ok: true; mfa_disabled: boolean }> {
  return await callMfaBackupCodes<{ ok: true; mfa_disabled: boolean }>({
    action: "verify",
    code,
  });
}

/** Status query for the /account/security UI: returns count of unused codes. */
export async function getBackupCodeStatus(): Promise<{
  unused_count: number;
  total: number;
}> {
  return await callMfaBackupCodes<{ unused_count: number; total: number }>({
    action: "status",
  });
}

// ─── Lockout coordinator ──────────────────────────────────────────────

export type LockoutCheckResult = {
  locked_out: boolean;
  lockout_until?: string;
  remaining?: number;
};

export type LockoutFailureResult = {
  lockout_triggered: boolean;
  lockout_until?: string;
  attempts: number;
  already_locked?: boolean;
};

/** Check current lockout state for the signed-in user. Returns
 * `{ locked_out: false, remaining }` when not locked, or
 * `{ locked_out: true, lockout_until }` when locked. */
export async function checkMfaLockout(): Promise<LockoutCheckResult> {
  return await callMfaRateLimit<LockoutCheckResult>("check");
}

/** Report a failed TOTP verify so the lockout counter increments.
 * Cooperative — see mfa-challenge-rate-limit/index.ts for the threat
 * model rationale. */
export async function reportTotpFailure(): Promise<LockoutFailureResult> {
  return await callMfaRateLimit<LockoutFailureResult>("record_failure");
}

/** Report a successful TOTP verify so the counter is cleared. */
export async function reportTotpSuccess(): Promise<{ ok: true }> {
  return await callMfaRateLimit<{ ok: true }>("record_success");
}
