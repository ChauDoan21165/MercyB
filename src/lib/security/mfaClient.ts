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
