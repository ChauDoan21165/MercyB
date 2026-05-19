// supabase/functions/get-subscription-status/core.ts
//
// Pure decision logic for the `get-subscription-status` edge function.
// Extracted from index.ts in B13 Phase 3 PR-B so the entitlement
// decision is unit-testable under vitest — index.ts itself can't be
// imported (top-level esm.sh import + Deno.serve). esm.sh-free; mirrors
// the split already applied to `me-entitlement` (index → entitlement.ts)
// and `revenuecat-webhook` (index → auth.ts).
//
// Pre-PR-B, this function lived inline at index.ts:50 as
// `const isPremium = premiumStatus === "active"` — `premiumExpiresAt`
// was read but never used. An "active" row with a past expiry was
// projected as premium. R2 of B13 Phase 3.
//
// Now `is_premium` flows through the shared expiry-aware
// `deriveEntitlement`; `status` becomes the canonical normalized
// EntitlementStatus (previously the raw DB string was passed through,
// which could be lowercase/mixed-case Stripe states); `expires_at` and
// `source` mirror the persisted projection unchanged.

import {
  deriveEntitlement,
  type EntitlementSnapshot,
} from "../_shared/entitlement.ts";

export type SubscriptionStatusProfile = {
  premium_status?: unknown;
  premium_expires_at?: unknown;
  premium_source?: unknown;
} | null;

/**
 * Project the persisted `profiles.premium_*` columns into the response
 * envelope returned by `get-subscription-status`. Pure; `now` is
 * injected for testability.
 */
export function buildEntitlementSnapshot(
  profile: SubscriptionStatusProfile,
  now: Date | number = new Date(),
): EntitlementSnapshot {
  return deriveEntitlement(
    [
      {
        status: profile?.premium_status,
        expires_at: profile?.premium_expires_at,
        source: profile?.premium_source,
      },
    ],
    now,
  );
}
