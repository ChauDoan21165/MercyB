/**
 * Path: src/lib/security/mfaTelemetry.ts
 *
 * Sentry-routed telemetry for 2FA events. Uses captureException in
 * the breadcrumb-only sense (no actual error object) so events show
 * up in the Sentry timeline even when no crash happened. The helper
 * is a no-op when Sentry is disabled, so call sites stay clean.
 *
 * Privacy: never log the TOTP code, the factor secret, or anything
 * that would let a Sentry reader bypass MFA. Only categorical labels.
 */

import { addBreadcrumb, captureError, setTag } from "@/lib/monitoring/captureException";

export type MfaEvent =
  | "mfa_enroll_started"
  | "mfa_enroll_verified"
  | "mfa_enroll_aborted"
  | "mfa_login_challenge_shown"
  | "mfa_login_verified"
  | "mfa_login_failed"
  | "mfa_disable_succeeded"
  | "mfa_upgrade_prompt_shown";

export function trackMfaEvent(event: MfaEvent, data?: Record<string, unknown>): void {
  addBreadcrumb({
    category: "security.mfa",
    level: event === "mfa_login_failed" ? "warning" : "info",
    message: event,
    data: data ?? {},
  });
}

/**
 * Surface a real MFA-flow error to Sentry. Never pass user-entered
 * codes, factor secrets, or session tokens — pass categorical context
 * (which step failed, which Supabase API surface, return code).
 */
export function captureMfaError(
  step: "enroll" | "challenge" | "verify" | "disable" | "list_factors",
  err: unknown,
  context?: Record<string, unknown>,
): void {
  const errorForSentry = err instanceof Error ? err : new Error(`mfa_${step}_failed`);
  setTag("mfa.step", step);
  captureError(errorForSentry, {
    mfa_step: step,
    ...(context ?? {}),
  });
}
