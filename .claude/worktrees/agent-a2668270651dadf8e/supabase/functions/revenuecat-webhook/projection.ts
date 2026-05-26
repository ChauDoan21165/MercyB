// supabase/functions/revenuecat-webhook/projection.ts
//
// Pure(-ish) RevenueCat → app projection. Extracted verbatim from
// index.ts (PR: me-entitlement test backfill) so it can be unit-tested
// under vitest — index.ts itself can't be imported (top-level esm.sh
// import + Deno.serve). `handleEvent` already takes the admin client as
// a parameter, so it is testable with a fake client (the
// stripe-webhook/idempotency.ts test pattern). This module is
// intentionally esm.sh-free: it imports the SupabaseClient type only via
// the type-only ./types.ts seam.
//
// ZERO behavior change vs the previous inline implementation. The event
// dispatch, write payloads, return shapes, and error messages are
// identical; index.ts now imports `handleEvent` from here.

import type { RcAdminClient, RcEvent } from "./types.ts";

export const APP_ID = "mercy_blade";

/** App Store Connect product IDs. Mirror of src/lib/iap.ts constants. */
export const IAP_PRODUCT_MONTHLY = "mercy.premium.monthly";
export const IAP_PRODUCT_YEARLY = "mercy.premium.yearly";

/**
 * Tier string written into `profiles.tier` on successful purchase.
 * Adjust if the access-control model changes what "fully paid" means.
 * Current model (CLAUDE.md #5): level0 = free, higher = paid. We set
 * the top paid slot on any premium IAP; all paid tiers unlock the same
 * content today.
 */
export const PREMIUM_PROFILE_TIER = "level3";

export function productIdToTier(productId: string): string | null {
  if (productId === IAP_PRODUCT_MONTHLY) return "premium_monthly";
  if (productId === IAP_PRODUCT_YEARLY) return "premium_yearly";
  return null;
}

export async function handleEvent(
  admin: RcAdminClient,
  userId: string,
  event: RcEvent,
): Promise<Record<string, unknown>> {
  const type = (event.type ?? "").toUpperCase();
  const productId = (event.product_id ?? "").trim();
  const subscriptionId = (
    event.original_transaction_id ?? event.transaction_id ?? ""
  ).trim();
  const expiresISO = event.expiration_at_ms
    ? new Date(event.expiration_at_ms).toISOString()
    : null;
  const environment = (event.environment ?? "PRODUCTION").toLowerCase();

  const productTier = productIdToTier(productId);

  switch (type) {
    case "INITIAL_PURCHASE":
    case "RENEWAL":
    case "PRODUCT_CHANGE":
    case "NON_RENEWING_PURCHASE": {
      if (!subscriptionId) {
        return { skipped: "no_subscription_id", type };
      }

      const subRow = {
        app_id: APP_ID,
        user_id: userId,
        customer_id: userId,
        subscription_id: subscriptionId,
        provider: "apple",
        provider_subscription_id: event.transaction_id ?? null,
        provider_original_transaction_id: event.original_transaction_id ?? null,
        provider_product_id: productId || null,
        product_id: productId || null,
        tier: productTier,
        status: "active",
        environment,
        current_period_end: expiresISO,
        current_period_end_at: expiresISO,
        cancel_at_period_end: false,
        canceled_at: null,
        ended_at: null,
      };

      const { error: subErr } = await admin
        .from("subscriptions")
        .upsert(subRow, { onConflict: "subscription_id" });
      if (subErr) throw new Error(`subscriptions upsert: ${subErr.message}`);

      const { error: profErr } = await admin
        .from("profiles")
        .update({
          tier: PREMIUM_PROFILE_TIER,
          premium_status: "active",
          premium_source: "apple",
          premium_expires_at: expiresISO,
        })
        .eq("id", userId);
      if (profErr) throw new Error(`profiles update: ${profErr.message}`);

      return { action: "granted", type, product_tier: productTier };
    }

    case "CANCELLATION": {
      // Auto-renew cancelled. User keeps access until period end; the
      // EXPIRATION event later will flip status + downgrade the profile.
      if (!subscriptionId) return { skipped: "no_subscription_id", type };
      const { error } = await admin
        .from("subscriptions")
        .update({
          cancel_at_period_end: true,
          canceled_at: new Date().toISOString(),
        })
        .eq("subscription_id", subscriptionId);
      if (error) throw new Error(`subscriptions cancel mark: ${error.message}`);
      return { action: "cancel_at_period_end", type };
    }

    case "EXPIRATION":
    case "REFUND": {
      // Real loss of access. Mark the specific sub ended first…
      if (subscriptionId) {
        const { error: subErr } = await admin
          .from("subscriptions")
          .update({
            status: "canceled",
            ended_at: new Date().toISOString(),
          })
          .eq("subscription_id", subscriptionId);
        if (subErr) throw new Error(`subscriptions expire: ${subErr.message}`);
      }

      // …then downgrade the profile ONLY if no other active subscription
      // exists for this user. Prevents a refund from clobbering a newer
      // concurrent purchase (rare, but possible).
      const { data: otherActive, error: otherErr } = await admin
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1);
      if (otherErr) throw new Error(`active sub check: ${otherErr.message}`);

      if (!otherActive || otherActive.length === 0) {
        const { error: profErr } = await admin
          .from("profiles")
          .update({
            tier: "level0",
            premium_status: "inactive",
            premium_expires_at: null,
          })
          .eq("id", userId);
        if (profErr) throw new Error(`profiles downgrade: ${profErr.message}`);
        return { action: "revoked", type };
      }
      return { action: "sub_ended_profile_kept", type };
    }

    case "BILLING_ISSUE": {
      // Grace period. Mark past_due; leave profile.tier unchanged so
      // the user keeps access while Apple retries billing.
      if (!subscriptionId) return { skipped: "no_subscription_id", type };
      const { error } = await admin
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("subscription_id", subscriptionId);
      if (error) throw new Error(`subscriptions past_due: ${error.message}`);
      return { action: "past_due", type };
    }

    default:
      // TRANSFER, SUBSCRIPTION_EXTENDED, UNCANCELLATION, TEMPORARY_ENTITLEMENT_GRANT,
      // SUBSCRIPTION_PAUSED, EXPIRATION_GRACE, VIRTUAL_CURRENCIES_TRANSACTION, etc.
      // Acknowledge so RevenueCat stops retrying; do nothing else.
      console.info("[revenuecat-webhook] ignored event type:", type);
      return { action: "ignored", type };
  }
}
