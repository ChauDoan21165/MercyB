/**
 * RevenueCat Webhook
 * Path: supabase/functions/revenuecat-webhook/index.ts
 *
 * Receives RevenueCat v2 webhook events and mirrors them into the
 * `public.subscriptions` table + the `public.profiles` premium flags so
 * the existing `me-entitlement` function continues to be the single
 * source of truth the client app reads.
 *
 * Auth: shared bearer token in the Authorization header. Set the same
 * value in RevenueCat Dashboard → Integrations → Webhook and in this
 * function's secrets (`REVENUECAT_WEBHOOK_AUTH_TOKEN`).
 *
 * Handled event types:
 *   INITIAL_PURCHASE, RENEWAL, PRODUCT_CHANGE, NON_RENEWING_PURCHASE →
 *     upsert subscriptions row as active + elevate profile to premium
 *   CANCELLATION → mark cancel_at_period_end (user keeps access until
 *     period end)
 *   EXPIRATION, REFUND → set subscription ended + downgrade profile
 *     (only if no OTHER active subscription exists for the user)
 *   BILLING_ISSUE → mark subscription past_due (grace period —
 *     profile.tier is left untouched)
 *   everything else → logged and ignored, still returns 200 so
 *     RevenueCat doesn't retry forever.
 *
 * Kill switch: set Supabase secret `REVENUECAT_WEBHOOK_DISABLED=true`
 * to make this function return 200 without writing anything. Useful if
 * the webhook is emitting bad data and you need to freeze writes
 * without redeploying. Also disable the webhook on the RevenueCat side
 * if you want to stop retries entirely.
 *
 * Schema assumption: DB enum `billing_provider` already includes
 * "apple" (confirmed during Phase 1 recon). No migration required.
 */

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// ── Constants (MUST mirror src/lib/iap.ts) ──────────────────────────────────

/** App Store Connect product IDs. Mirror of src/lib/iap.ts constants. */
const IAP_PRODUCT_MONTHLY = "mercy.premium.monthly";
const IAP_PRODUCT_YEARLY = "mercy.premium.yearly";

/**
 * Tier string written into `profiles.tier` on successful purchase.
 * Adjust if the access-control model changes what "fully paid" means.
 * Current model (CLAUDE.md #5): level0 = free, higher = paid. We set
 * the top paid slot on any premium IAP; all paid tiers unlock the same
 * content today.
 */
const PREMIUM_PROFILE_TIER = "level3";

const APP_ID = "mercy_blade";

// ── HTTP plumbing ───────────────────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

// ── RevenueCat event shape (subset we care about) ───────────────────────────

type RcEvent = {
  type?: string;
  id?: string;
  app_user_id?: string;
  original_app_user_id?: string;
  product_id?: string;
  transaction_id?: string;
  original_transaction_id?: string;
  entitlement_ids?: string[];
  expiration_at_ms?: number;
  purchased_at_ms?: number;
  environment?: "PRODUCTION" | "SANDBOX";
  price?: number;
  currency?: string;
};

// ── Request handler ─────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Kill switch: freeze all writes without redeploying.
  if (Deno.env.get("REVENUECAT_WEBHOOK_DISABLED") === "true") {
    console.warn("[revenuecat-webhook] DISABLED via env flag");
    return json({ ok: true, skipped: "disabled" });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const expectedToken = (Deno.env.get("REVENUECAT_WEBHOOK_AUTH_TOKEN") ?? "").trim();
  if (!expectedToken) {
    console.error("[revenuecat-webhook] REVENUECAT_WEBHOOK_AUTH_TOKEN not set");
    return json({ error: "Webhook not configured" }, 500);
  }
  const authHeader = (req.headers.get("Authorization") ?? "").trim();
  // RevenueCat lets the operator type either the raw token or a full
  // "Bearer xxx" string into the Authorization field. Accept both forms.
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : authHeader;
  if (bearerToken !== expectedToken) {
    console.warn("[revenuecat-webhook] unauthorized");
    return json({ error: "Unauthorized" }, 401);
  }

  // ── Parse ─────────────────────────────────────────────────────────────────
  let payload: { event?: RcEvent; api_version?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const event = payload?.event;
  if (!event || typeof event.type !== "string") {
    return json({ error: "Missing event payload" }, 400);
  }

  const userId = (event.app_user_id ?? event.original_app_user_id ?? "").trim();
  if (!userId) {
    console.warn("[revenuecat-webhook] event without user id:", event.type);
    return json({ ok: true, skipped: "no_user", type: event.type });
  }

  // Anonymous RevenueCat IDs look like "$RCAnonymousID:…" and don't
  // correspond to any Supabase user. We skip them gracefully so
  // RevenueCat doesn't retry forever.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    console.warn("[revenuecat-webhook] non-UUID user id — skipping:", userId.slice(0, 40));
    return json({ ok: true, skipped: "anonymous", type: event.type });
  }

  // ── Supabase client (service role) ────────────────────────────────────────
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("[revenuecat-webhook] SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not set");
    return json({ error: "Server misconfigured" }, 500);
  }
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Orphan check — stops retry loop if the event names a user we don't
  // have. Returns 200 so RevenueCat doesn't keep delivering forever.
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (profileError) {
    console.error("[revenuecat-webhook] profile lookup failed:", profileError.message);
    return json({ error: "Profile lookup failed" }, 500);
  }
  if (!profile) {
    console.warn("[revenuecat-webhook] unknown user:", userId);
    return json({ ok: true, skipped: "unknown_user", type: event.type });
  }

  // ── Dispatch ──────────────────────────────────────────────────────────────
  try {
    const result = await handleEvent(admin, userId, event);
    return json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[revenuecat-webhook] handler crashed:", message);
    return json({ error: message }, 500);
  }
});

// ── Event dispatch ──────────────────────────────────────────────────────────

async function handleEvent(
  admin: SupabaseClient,
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

function productIdToTier(productId: string): string | null {
  if (productId === IAP_PRODUCT_MONTHLY) return "premium_monthly";
  if (productId === IAP_PRODUCT_YEARLY) return "premium_yearly";
  return null;
}
