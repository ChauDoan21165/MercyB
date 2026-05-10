// src/lib/gift/fetchActiveGiftSubscription.ts
//
// Read-side helper for the access-code (gift) subscription path.
//
// The redeem-access-code Edge Function writes to `user_subscriptions`
// (legacy table). The me-entitlement Edge Function reads only from
// `subscriptions` (unified table). The two are not bridged today, so
// gift redemptions are invisible to the account-page entitlement check
// even though `user_subscriptions` is the authoritative state.
//
// This helper queries `user_subscriptions` directly and returns the
// active, non-expired gift redemption (if any) for the given user. It
// is meant to be run alongside `fetchCurrentEntitlement` inside
// `useEntitlements`; if the entitlement reports non-premium but a gift
// sub exists, the hook overlays the gift sub's values onto the
// entitlement so the rest of the app sees the user as premium.
//
// RLS: the existing policy "Users can view their own subscription"
// (USING auth.uid() = user_id) lets authenticated callers read their
// own row with an anon-keyed Supabase client. No service-role needed.
// A malicious caller cannot fake premium because RLS only returns
// rows where user_id matches their own auth.uid().

import type { SupabaseClient } from "@supabase/supabase-js";

export type ActiveGiftSubscription = {
  /** uuid of the active subscription_tiers row (e.g. One Year). */
  tier_id: string;
  /** ISO timestamp; null only if the row was created without one. */
  current_period_end: string | null;
  /** Legacy VIP key on the tier — e.g. "vip9". `null` if the tier row
   *  has no vip_key set. The hook uses this to drive `tierToRank`. */
  vip_key: string | null;
  /** Tier display name — e.g. "One Year". Used for plan_name on the
   *  synthesized entitlement so AccountPage shows the human label. */
  plan_name: string | null;
};

/**
 * Returns the user's active, non-expired gift redemption (the row in
 * `user_subscriptions` with `is_gift_redemption = true`, `status =
 * 'active'`, and `current_period_end` either null or in the future) or
 * null. If the user has multiple matching rows (data anomaly) the one
 * with the latest `current_period_end` wins.
 *
 * Returns null on any error so callers can fall through to the legacy
 * entitlement path. Errors are logged via console.warn for ops
 * diagnosis but do not throw.
 */
export async function fetchActiveGiftSubscription(
  client: SupabaseClient,
  userId: string,
): Promise<ActiveGiftSubscription | null> {
  if (!userId) return null;

  const nowIso = new Date().toISOString();

  // PostgREST embed: pull the joined subscription_tiers in one round
  // trip. `tier_id` is a NOT NULL FK to subscription_tiers(id) so the
  // join always resolves; using `subscription_tiers (...)` (no !inner)
  // mirrors the project's existing access_codes/subscription_tiers
  // pattern in the prior redeem-access-code function.
  const { data, error } = await client
    .from("user_subscriptions")
    .select(
      "tier_id, current_period_end, subscription_tiers ( vip_key, name )",
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .eq("is_gift_redemption", true)
    .or(`current_period_end.is.null,current_period_end.gt.${nowIso}`)
    .order("current_period_end", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn(
      "[fetchActiveGiftSubscription] query failed:",
      error.message,
    );
    return null;
  }
  if (!data) return null;

  // Embedded relations come back as either an object or an array
  // depending on PostgREST version + cardinality inference; guard both.
  const tierRaw =
    (data as { subscription_tiers?: unknown }).subscription_tiers ?? null;
  const tier =
    tierRaw && typeof tierRaw === "object"
      ? (Array.isArray(tierRaw) ? tierRaw[0] : tierRaw)
      : null;

  const vipKey = tier && typeof (tier as { vip_key?: unknown }).vip_key === "string"
    ? ((tier as { vip_key: string }).vip_key.trim() || null)
    : null;
  const planName = tier && typeof (tier as { name?: unknown }).name === "string"
    ? ((tier as { name: string }).name.trim() || null)
    : null;

  return {
    tier_id: String((data as { tier_id?: unknown }).tier_id ?? ""),
    current_period_end:
      typeof (data as { current_period_end?: unknown }).current_period_end ===
      "string"
        ? (data as { current_period_end: string }).current_period_end
        : null,
    vip_key: vipKey,
    plan_name: planName,
  };
}
