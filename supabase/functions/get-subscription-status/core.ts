// supabase/functions/get-subscription-status/core.ts
//
// Pure decision logic for the `get-subscription-status` edge function.
// Extracted from index.ts in B13 Phase 3 PR-B so the entitlement
// decision is unit-testable under vitest — index.ts itself can't be
// imported (top-level esm.sh import + Deno.serve). esm.sh-free; mirrors
// the split already applied to `me-entitlement` (index → entitlement.ts)
// and `revenuecat-webhook` (index → auth.ts).
//
// This function intentionally derives from public.subscriptions rows, not
// profiles.premium_* projection columns. profiles.premium_* is only a display
// cache and may be stale until the edge reader reconciles it.

import {
  deriveEntitlement,
  type EntitlementSnapshot,
} from "../_shared/entitlement.ts";

export type SubscriptionStatusRow = {
  status?: unknown;
  current_period_end?: unknown;
  current_period_end_at?: unknown;
  provider?: unknown;
  source?: unknown;
  updated_at?: unknown;
  id?: unknown;
};

/**
 * Project canonical subscription rows into the response envelope returned by
 * `get-subscription-status`. Pure; `now` is injected for testability.
 */
export function buildEntitlementSnapshot(
  subscriptions: readonly SubscriptionStatusRow[] | null | undefined,
  now: Date | number = new Date()
): EntitlementSnapshot {
  return deriveEntitlement(subscriptions ?? [], now);
}
