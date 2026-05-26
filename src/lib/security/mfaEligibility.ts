/**
 * Path: src/lib/security/mfaEligibility.ts
 *
 * Single source of truth for "is this user allowed to enable / manage
 * 2FA?". Both /account/security and /auth/security MUST agree, or you
 * end up with the smoke-test bug we just hit: one page shows the
 * "Enable 2FA" button, the other rejects the user as free-tier.
 *
 * Eligibility rules (Phase 1):
 *   - Admin override: admin_level ≥ 9 → eligible regardless of subscription
 *   - Paid: hasPremium === true (premium_month or premium_year) → eligible
 *   - Everyone else → not eligible
 *
 * Loading semantics:
 *   - While `access.loading` is true, eligibility is UNDETERMINED
 *     (returns false). Callers that act on eligibility (e.g.,
 *     redirecting to "ineligible" state) MUST also check
 *     `access.loading` and wait. The `MfaEligibility` return type
 *     surfaces both bits so callers can branch correctly.
 *
 * The smoke-test bug that motivated this helper:
 *   Enable2FA.tsx:237 was firing setStep("ineligible") inside an
 *   effect that gated only on authLoading, NOT on access.loading.
 *   For an admin user (no subscription row but admin_level=10), the
 *   effect ran while access was still fetching → hasPremium=false +
 *   isHighAdmin=false → "ineligible" → blocked. SecuritySettings
 *   dodged the bug because its check is inline at render-time and
 *   naturally re-runs once access settles.
 */

import type { UserAccess } from "@/hooks/useUserAccess";

export type MfaEligibility = {
  /** True iff we have a definitive answer (access has loaded). */
  resolved: boolean;
  /** True iff the user is allowed to use 2FA. False during loading. */
  allowed: boolean;
  /** Categorical reason, useful for telemetry / explanatory copy. */
  reason: "loading" | "admin_override" | "paid" | "free_tier" | "anon";
};

/**
 * Decide whether the calling user can enable / manage 2FA.
 *
 * Inputs are taken as a narrow subset so this helper can be tested
 * without mocking the full UserAccess shape; the hook returns a
 * superset of these fields.
 */
export function canUseMfa(access: Pick<
  UserAccess,
  "isAuthenticated" | "loading" | "hasPremium" | "isHighAdmin"
>): MfaEligibility {
  if (access.loading) {
    return { resolved: false, allowed: false, reason: "loading" };
  }
  if (!access.isAuthenticated) {
    return { resolved: true, allowed: false, reason: "anon" };
  }
  if (access.isHighAdmin) {
    return { resolved: true, allowed: true, reason: "admin_override" };
  }
  if (access.hasPremium) {
    return { resolved: true, allowed: true, reason: "paid" };
  }
  return { resolved: true, allowed: false, reason: "free_tier" };
}
