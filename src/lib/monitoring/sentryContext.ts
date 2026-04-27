/**
 * Sentry context wiring — derives a coarse `tier` cohort from the live
 * UserAccess snapshot and pushes it (plus the user_id) into the Sentry
 * scope as a tag + user. Hooked from a small effect inside React (see
 * SentryUserBinding) so this file stays render-free and unit-testable.
 *
 * Privacy contract (matches sentryInit.scrubEvent):
 *   - Never set email / username / IP / phone.
 *   - Tier is a low-cardinality label, NOT a billing identifier.
 *
 * The tier mapping is deliberately small so it's useful as a Sentry
 * filter ("show me crashes for premium users") without leaking the full
 * entitlement matrix that lives in `useUserAccess`.
 */

import type { SentryTier } from "./captureException";
import { setTag, tagWithUser, clearUser } from "./captureException";

interface AccessLikeForSentry {
  isAuthenticated?: boolean;
  loading?: boolean;
  isHighAdmin?: boolean;
  hasPremium?: boolean;
  isTrialExpired?: boolean;
  userId?: string | null;
  user?: { id?: string | null } | null;
}

export function deriveSentryTier(access: AccessLikeForSentry): SentryTier {
  if (access.loading) return "anon";
  if (!access.isAuthenticated) return "anon";
  if (access.isHighAdmin) return "admin";
  if (access.hasPremium) return "premium";
  if (access.isTrialExpired) return "trial_expired";
  // Free + on-trial both register as "trial" — they're the same crash
  // cohort for our purposes (free tier inside the 3-day window). Promote
  // to "free" once we add an explicit trial flag.
  return "trial";
}

/**
 * Apply user + tier to the Sentry scope. Idempotent — safe to call on
 * every auth/access change.
 */
export function applySentryContext(access: AccessLikeForSentry): void {
  const userId = access.userId ?? access.user?.id ?? null;
  if (userId) {
    tagWithUser(userId);
  } else {
    clearUser();
  }
  setTag("tier", deriveSentryTier(access));
}

/**
 * Apply route name (the React Router `pathname`) as a `route` tag so
 * Sentry's filter-by-route works without each captureError caller
 * needing to thread the value. Caller should normalize dynamic segments
 * (e.g. `/room/:roomId`) before passing — raw pathnames explode tag
 * cardinality.
 */
export function applySentryRoute(routePattern: string): void {
  if (!routePattern) return;
  setTag("route", routePattern);
}

/**
 * Tag a feature flag value. Key is namespaced under `flag.` to keep
 * Sentry's tag table tidy.
 */
export function applySentryFeatureFlag(flagKey: string, enabled: boolean): void {
  if (!flagKey) return;
  setTag(`flag.${flagKey}`, enabled ? "on" : "off");
}
