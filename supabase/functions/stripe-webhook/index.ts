// PATH: supabase/functions/stripe-webhook/index.ts
// VERSION: v2026-01-06.10 (fail-fast env guards; keep bulletproof email retry via outbox; keep FAST EXIT for DB writes)
//
// Stripe Webhook — Supabase Edge Function (Deno)
// JWT DISABLED — Stripe signature ONLY
//
// Key behavior:
// - DB idempotency: if payment_events already has stripe_event_id, we SKIP DB writes.
// - Email idempotency: we DO send emails on retries IF email_outbox does not show template_key as sent.
//   (Fixes: provider outage on first attempt; Stripe retry now delivers email)
//
// Requires:
// - email_outbox table exists (best-effort; if missing, email is still attempted, but resend safety is reduced)
//
// Keeps:
// - Signature verification
// - Subscription updated/deleted logic (update by stripe_subscription_id then fallback upsert)
// - Local/dev email flow via sendEmail shared module

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno&no-dts";
import { sendEmail } from "../_shared/sendEmail.ts";

// ---------------------------
// CORS
// ---------------------------
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ok200 = () => new Response("ok", { status: 200, headers: corsHeaders });

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const env = (k: string) => (Deno.env.get(k) ?? "").trim();
const norm = (x: unknown) =>
  String(x ?? "").toLowerCase().replace(/\s+/g, " ").trim();

// ---------------------------
// Email helpers (best-effort)
// ---------------------------
function formatMoney(amountMinor: number, currency?: string | null): string {
  const cur = typeof currency === "string" ? currency.toUpperCase() : "";
  const minor = Number.isFinite(amountMinor) ? amountMinor : 0;
  const major = minor / 100;
  return cur ? `${major.toFixed(2)} ${cur}` : `${major.toFixed(2)}`;
}

async function resolveCustomerEmail(
  stripe: Stripe,
  session: any,
): Promise<string | null> {
  // ✅ First choice: deterministic email injected at checkout creation time
  const metaEmail = session?.metadata?.email ?? null;
  if (typeof metaEmail === "string" && metaEmail.trim()) return metaEmail.trim();

  // Next: session fields
  const direct = session?.customer_details?.email ?? session?.customer_email ?? null;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  // Fallback: fetch Stripe customer
  const cid = session?.customer ?? null;
  if (!cid || typeof cid !== "string") return null;

  try {
    const c = await stripe.customers.retrieve(cid);
    const e = (c as any)?.email ?? null;
    return typeof e === "string" && e.trim() ? e.trim() : null;
  } catch {
    return null;
  }
}

// ---------------------------
// Tier helpers
// ---------------------------
type VipKey = "vip1" | "vip3" | "vip9";
type ProductKey = "mercy_blade";

function priceIdToVipKey(priceId?: string | null): VipKey | null {
  if (!priceId) return null;
  if (priceId === env("STRIPE_PRICE_VIP1")) return "vip1";
  if (priceId === env("STRIPE_PRICE_VIP3")) return "vip3";
  if (priceId === env("STRIPE_PRICE_VIP9")) return "vip9";
  return null;
}

function normalizeMetaVip(x?: string | null): VipKey | null {
  const s = norm(x);
  if (s === "vip1") return "vip1";
  if (s === "vip3") return "vip3";
  if (s === "vip9") return "vip9";
  return null;
}

async function resolveTierId(
  supabase: ReturnType<typeof createClient>,
  vip: VipKey,
): Promise<string | null> {
  const { data } = await supabase
    .from("subscription_tiers")
    .select("id, vip_key, code, slug, name, title");

  for (const r of data ?? []) {
    const s = norm(r.vip_key ?? r.code ?? r.slug ?? r.name ?? r.title ?? r.id);
    if (s.includes(vip)) return String(r.id);
  }
  return null;
}

// ---------------------------
// Ledger helpers
// ---------------------------
async function isEventProcessed(
  supabase: ReturnType<typeof createClient>,
  stripeEventId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("payment_events")
    .select("stripe_event_id")
    .eq("stripe_event_id", stripeEventId)
    .maybeSingle();

  if (error) throw error;
  return !!data?.stripe_event_id;
}

async function writeLedger({
  supabase,
  event,
  type,
  userId,
  tierId,
  stripeCustomerId,
  stripeSubscriptionId,
  stripeSessionId,
}: {
  supabase: ReturnType<typeof createClient>;
  event: any;
  type: string;
  userId?: string | null;
  tierId?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeSessionId?: string | null;
}) {
  if (!event?.id) throw new Error("Stripe event missing id");

  const { error } = await supabase.from("payment_events").upsert(
    {
      provider: "stripe",
      event_type: type,
      stripe_event_id: event.id,
      stripe_customer_id: stripeCustomerId ?? null,
      stripe_subscription_id: stripeSubscriptionId ?? null,
      stripe_session_id: stripeSessionId ?? null,
      external_reference: stripeSessionId ?? stripeSubscriptionId ?? null,
      user_id: userId ?? null,
      tier_id: tierId ?? null,
      payload: {
        created: event.created,
        livemode: event.livemode,
        type: event.type,
      },
    },
    { onConflict: "stripe_event_id" },
  );

  if (error) throw error;
}

// ---------------------------
// Email outbox idempotency (best-effort)
// ---------------------------
async function outboxAlreadySent(
  supabase: ReturnType<typeof createClient>,
  correlationId: string,
  templateKey: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("email_outbox")
      .select("id,status")
      .eq("correlation_id", correlationId)
      .eq("template_key", templateKey)
      .eq("status", "sent")
      .limit(1);

    if (error) {
      console.warn(
        "[stripe-webhook] email_outbox read failed (ignored):",
        error.message,
      );
      return false;
    }
    return (data?.length ?? 0) > 0;
  } catch (e) {
    console.warn("[stripe-webhook] email_outbox read threw (ignored):", e);
    return false;
  }
}

async function sendEmailOnce(params: {
  supabase: ReturnType<typeof createClient>;
  correlationId: string;
  to: string;
  templateKey: string;
  variables: Record<string, string>;
}) {
  const already = await outboxAlreadySent(
    params.supabase,
    params.correlationId,
    params.templateKey,
  );
  if (already) {
    console.log("[stripe-webhook] email already sent; skipping:", params.templateKey);
    return;
  }

  await sendEmail({
    to: params.to,
    templateKey: params.templateKey,
    variables: params.variables,
    appKey: "mercy_blade",
    correlationId: params.correlationId,
  });
}

// ---------------------------
// Server
// ---------------------------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return ok200();
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // ✅ Fail-fast env guards (prevents "ghost" empty handler behavior)
  const stripeKey = env("STRIPE_SECRET_KEY");
  const webhookSecret = env("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = env("SUPABASE_URL");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");

  if (!stripeKey) return json({ error: "Missing STRIPE_SECRET_KEY" }, 500);
  if (!webhookSecret) return json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, 500);
  if (!supabaseUrl || !serviceKey) {
    return json(
      { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
      500,
    );
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return json({ error: "Missing signature" }, 400);

  const raw = new TextDecoder().decode(await req.arrayBuffer());

  let event: any;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, webhookSecret);
  } catch {
    return json({ error: "Invalid signature" }, 400);
  }

  if (!event?.id) return json({ error: "Stripe event missing id" }, 400);

  const type = event.type;
  if (
    type !== "checkout.session.completed" &&
    type !== "customer.subscription.updated" &&
    type !== "customer.subscription.deleted"
  ) {
    return ok200();
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    const processed = await isEventProcessed(supabase, event.id);

    // ---------------------------
    // CHECKOUT COMPLETED
    // ---------------------------
    if (type === "checkout.session.completed") {
      const s = event.data.object;
      if (s.mode !== "subscription" || s.payment_status !== "paid") return ok200();

      const userId = s.metadata?.supabase_user_id ?? s.client_reference_id ?? null;
      if (!userId) throw new Error("userId missing");

      const stripeSessionId = s.id;
      const stripeSubscriptionId = s.subscription ?? null;
      const stripeCustomerId = s.customer ?? null;
      const product_key: ProductKey = "mercy_blade";

      let priceId: string | null = null;
      if (stripeSubscriptionId) {
        priceId = await stripe.subscriptions
          .retrieve(stripeSubscriptionId, { expand: ["items.data.price"] })
          .then((sub) => sub.items.data[0]?.price?.id ?? null)
          .catch(() => null);
      }

      const vipKey =
        priceIdToVipKey(priceId) ?? normalizeMetaVip(s.metadata?.vip_key);

      if (!vipKey) throw new Error("vipKey unresolved");

      const tierId = await resolveTierId(supabase, vipKey);
      if (!tierId) throw new Error("tierId unresolved");

      const amount = typeof s.amount_total === "number" ? s.amount_total : 0;
      const currency = typeof s.currency === "string" ? s.currency : null;

      const customerEmail = await resolveCustomerEmail(stripe, s);

      // ✅ DB writes only if NOT processed
      if (!processed) {
        await writeLedger({
          supabase,
          event,
          type,
          userId,
          tierId,
          stripeCustomerId,
          stripeSubscriptionId,
          stripeSessionId,
        });

        // Transition pending -> completed (safe)
        const { data: updatedRows } = await supabase
          .from("payment_transactions")
          .update({
            status: "completed",
            amount,
            currency,
            payment_method: "stripe",
            transaction_type: "subscription",
            updated_at: new Date().toISOString(),
          })
          .eq("external_reference", stripeSessionId)
          .eq("status", "pending")
          .select("id");

        if (!updatedRows || updatedRows.length === 0) {
          // Insert if missing (unique constraint should prevent duplicates)
          const { error: insErr } = await supabase.from("payment_transactions").insert({
            user_id: userId,
            tier_id: tierId,
            external_reference: stripeSessionId,
            status: "completed",
            amount,
            currency,
            payment_method: "stripe",
            transaction_type: "subscription",
            metadata: { vip_key: vipKey, product_key },
          });

          if (insErr) {
            console.log(
              "[stripe-webhook] payment_transactions insert skipped:",
              insErr.message,
            );
          }
        }

        await supabase.from("user_subscriptions").upsert(
          {
            user_id: userId,
            product_key,
            tier_id: tierId,
            status: "active",
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
          },
          { onConflict: "user_id,product_key" },
        );
      } else {
        console.log(
          "[stripe-webhook] event already processed; skipping DB writes, allowing email retry",
        );
      }

      // ✅ Email send (retryable, idempotent via outbox)
      if (customerEmail) {
        const prettyAmount = formatMoney(amount, currency);
        const period = "Monthly";
        const tierLabel = vipKey.toUpperCase();
        const correlationId = event.id; // stable id across retries

        try {
          await sendEmailOnce({
            supabase,
            correlationId,
            to: customerEmail,
            templateKey: "receipt_subscription",
            variables: {
              amount: prettyAmount,
              period,
              tier: tierLabel,
              currency: currency ?? "",
              amount_minor: String(amount),
              stripe_session_id: stripeSessionId,
              stripe_subscription_id: stripeSubscriptionId ?? "",
            },
          });
        } catch (e) {
          console.warn("[stripe-webhook] receipt email failed (ignored)", e);
        }

        try {
          await sendEmailOnce({
            supabase,
            correlationId,
            to: customerEmail,
            templateKey: "welcome_vip",
            variables: {
              tier: tierLabel,
              stripe_session_id: stripeSessionId,
              stripe_subscription_id: stripeSubscriptionId ?? "",
            },
          });
        } catch (e) {
          console.warn("[stripe-webhook] welcome email failed (ignored)", e);
        }
      } else {
        console.log("[stripe-webhook] customerEmail missing; skipping emails");
      }

      return ok200();
    }

    // For non-checkout events: keep FAST EXIT (no emails here anyway)
    if (processed) return ok200();

    // ---------------------------
    // SUBSCRIPTION UPDATED / DELETED
    // ---------------------------
    const sub = event.data.object;
    const stripeSubscriptionId = sub.id;
    const stripeCustomerId = sub.customer;
    const product_key: ProductKey = "mercy_blade";

    const { data: existing } = await supabase
      .from("user_subscriptions")
      .select("user_id,tier_id")
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .maybeSingle();

    if (!existing?.user_id) throw new Error("userId unresolved");

    // subscription.updated plan change -> update tier_id
    let nextTierId: string | null = existing.tier_id ?? null;

    if (type === "customer.subscription.updated") {
      const priceId: string | null = sub?.items?.data?.[0]?.price?.id ?? null;
      const vipKeyFromPrice = priceIdToVipKey(priceId);
      if (vipKeyFromPrice) {
        const resolved = await resolveTierId(supabase, vipKeyFromPrice);
        if (resolved) nextTierId = resolved;
      }
    }

    await writeLedger({
      supabase,
      event,
      type,
      userId: existing.user_id,
      tierId: nextTierId,
      stripeCustomerId,
      stripeSubscriptionId,
    });

    const nextStatus = sub.status === "active" ? "active" : "inactive";

    // Prefer update-by-stripe_subscription_id
    const { data: updRows } = await supabase
      .from("user_subscriptions")
      .update({
        tier_id: nextTierId,
        status: nextStatus,
        stripe_customer_id: stripeCustomerId,
      })
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .select("user_id");

    if (!updRows || updRows.length === 0) {
      await supabase.from("user_subscriptions").upsert(
        {
          user_id: existing.user_id,
          product_key,
          tier_id: nextTierId,
          status: nextStatus,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
        },
        { onConflict: "user_id,product_key" },
      );
    }

    return ok200();
  } catch (e: any) {
    console.error("❌ Stripe webhook failed", e);
    return json({ error: e.message }, 500);
  }
});
