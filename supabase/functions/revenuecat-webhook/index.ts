/**
 * RevenueCat Webhook
 * Path: supabase/functions/revenuecat-webhook/index.ts
 *
 * Receives RevenueCat v2 webhook events and mirrors them into the
 * `public.subscriptions` table + the `public.profiles` premium flags so
 * the existing `me-entitlement` function continues to be the single
 * source of truth the client app reads.
 *
 * Auth: shared token in the Authorization header (RevenueCat sends no
 * HMAC/signature — this is its only mechanism; see
 * reports/RECON-revenuecat-hmac.md). Set the same value in RevenueCat
 * Dashboard → Integrations → Webhook and in this function's secret
 * `REVENUECAT_WEBHOOK_AUTH_TOKEN`. The check is constant-time and
 * accepts a comma/newline-separated rotation set ("<new>,<old>") for
 * zero-downtime token rotation. See ./auth.ts.
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
 * The event→DB projection lives in ./projection.ts (pure, esm.sh-free,
 * unit-tested in __tests__/projection.test.ts). This file is only the
 * HTTP + auth + Supabase-client plumbing.
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

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { isAuthorized, parseTokens } from "./auth.ts";
import { handleEvent } from "./projection.ts";
import type { RcEvent } from "./types.ts";

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
  // RevenueCat does NOT sign its webhooks (no HMAC, no signature header —
  // verified, see reports/RECON-revenuecat-hmac.md). The shared
  // Authorization-header token is the only mechanism RevenueCat offers.
  // We compare it constant-time and accept a rotation set
  // ("<new>,<old>") so the secret can be rotated with zero downtime.
  // See ./auth.ts. Do not "add HMAC" here — there is nothing to verify.
  const configuredTokens = parseTokens(
    Deno.env.get("REVENUECAT_WEBHOOK_AUTH_TOKEN") ?? "",
  );
  if (configuredTokens.length === 0) {
    console.error("[revenuecat-webhook] REVENUECAT_WEBHOOK_AUTH_TOKEN not set");
    return json({ error: "Webhook not configured" }, 500);
  }
  const authHeader = (req.headers.get("Authorization") ?? "").trim();
  // RevenueCat lets the operator type either the raw token or a full
  // "Bearer xxx" string into the Authorization field. Accept both forms.
  const presentedToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : authHeader;
  if (!isAuthorized(presentedToken, configuredTokens)) {
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
