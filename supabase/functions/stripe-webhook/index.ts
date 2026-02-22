/**
 * MercyBlade Blue — Stripe Webhook (Supabase Edge Function)
 *
 * PATH: supabase/functions/stripe-webhook/index.ts
 * VERSION: v2026-01-06.10 + PATCH v2026-02-22.04 (manual WebCrypto signature verify; NO Stripe SDK)
 *
 * ⚠️ IMPORTANT (ROOT CAUSE OF 401 IN STRIPE DASHBOARD):
 * Supabase Edge Functions will return 401 BEFORE running this code if JWT verification is enabled.
 *
 * ✅ REQUIRED in supabase/config.toml:
 *   [functions.stripe-webhook]
 *   verify_jwt = false
 *
 * Stripe Webhook — Supabase Edge Function (Deno)
 * JWT DISABLED — Stripe signature ONLY
 *
 * Key behavior:
 * - DB idempotency: if payment_events already has stripe_event_id, we SKIP DB writes.
 * - Email idempotency: we DO send emails on retries IF email_outbox does not show template_key as sent.
 *   (Fixes: provider outage on first attempt; Stripe retry now delivers email)
 *
 * Requires:
 * - email_outbox table exists (best-effort; if missing, email is still attempted, but resend safety is reduced)
 *
 * Keeps:
 * - Signature verification
 * - Subscription updated/deleted logic (update by stripe_subscription_id then fallback upsert)
 * - Local/dev email flow via sendEmail shared module
 *
 * PATCH (2026-02-22.02):
 * - Avoid ALL Stripe API calls inside the webhook (Edge runMicrotasks crash risk).
 * - Rely on checkout metadata + payload fields instead:
 *   create-checkout-session MUST set:
 *     metadata: { tier_id, vip_key, email, supabase_user_id }
 *   and client_reference_id = supabase_user_id
 *
 * PATCH (2026-02-22.04):
 * - REMOVE Stripe SDK import entirely.
 * - Verify Stripe signature manually using WebCrypto HMAC (async).
 *
 * PATCH (2026-02-22.06):
 * - Support MULTIPLE Stripe signing secrets in STRIPE_WEBHOOK_SECRET (comma/newline-separated).
 *   This prevents “400 ERR” signature mismatch when you create/rotate Stripe Event Destinations.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
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
// ⚠️ DO NOT trim secrets (HMAC keys must be exact)
const envRaw = (k: string) => Deno.env.get(k) ?? "";

const norm = (x: unknown) =>
  String(x ?? "").toLowerCase().replace(/\s+/g, " ").trim();

function isUuid(x: any): boolean {
  return (
    typeof x === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      x,
    )
  );
}

// ---------------------------
// Stripe signature verify (manual, async WebCrypto)
// ---------------------------

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const s = hex.trim();
  if (!/^[0-9a-f]+$/i.test(s) || s.length % 2 !== 0) return new Uint8Array();
  const out = new Uint8Array(s.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function parseStripeSigHeader(sig: string): { t: string | null; v1s: string[] } {
  // Example: "t=123,v1=abc,v1=def,v0=old"
  const parts = String(sig || "").split(",");
  let t: string | null = null;
  const v1s: string[] = [];

  for (const p of parts) {
    const [k, ...rest] = p.split("=");
    const key = (k || "").trim();
    const val = rest.join("=").trim();
    if (!val) continue;

    if (key === "t") t = val;
    if (key === "v1") v1s.push(val);
  }

  return { t, v1s };
}

// NOTE: unused; kept harmlessly for future tooling/debug
function _base64ToBytes(b64: string): Uint8Array {
  // Deno supports atob()
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function webhookSecretToKeyBytes(webhookSecret: string): Uint8Array {
  /**
   * ✅ FIX (2026-02-22.05):
   * Stripe signing secret (whsec_...) is an OPAQUE string.
   * Do NOT base64-decode it.
   * Use UTF-8 bytes of the ENTIRE secret exactly as stored.
   */
  const s = String(webhookSecret || "");
  return new TextEncoder().encode(s);
}

async function computeHmacSha256(
  keyBytes: Uint8Array,
  payload: Uint8Array,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, payload);
  return new Uint8Array(sig);
}

function getWebhookToleranceSeconds(): number {
  // Stripe guidance is ~300s. Allow override.
  const raw = env("STRIPE_WEBHOOK_TOLERANCE_SECONDS");
  const n = raw ? Number(raw) : NaN;
  if (Number.isFinite(n) && n > 0) return Math.floor(n);
  return 300;
}

async function verifyStripeSignatureOrThrow(opts: {
  rawBodyBytes: Uint8Array;
  sigHeader: string;
  webhookSecret: string;
}) {
  const { rawBodyBytes, sigHeader, webhookSecret } = opts;
  const { t, v1s } = parseStripeSigHeader(sigHeader);

  if (!t || !v1s.length) {
    throw new Error("Invalid Stripe-Signature header (missing t or v1)");
  }

  // Replay protection: reject if timestamp too old/new.
  const tolerance = getWebhookToleranceSeconds();
  const ts = Number(t);
  if (!Number.isFinite(ts) || ts <= 0) {
    throw new Error("Invalid Stripe-Signature header (bad t)");
  }
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > tolerance) {
    throw new Error(`Stripe timestamp outside tolerance (${tolerance}s)`);
  }

  // Signed payload is: `${t}.${rawBody}`
  const tDot = new TextEncoder().encode(`${t}.`);
  const signedPayload = new Uint8Array(tDot.length + rawBodyBytes.length);
  signedPayload.set(tDot, 0);
  signedPayload.set(rawBodyBytes, tDot.length);

  const keyBytes = webhookSecretToKeyBytes(webhookSecret);
  const expected = await computeHmacSha256(keyBytes, signedPayload);

  // Stripe may send multiple v1 signatures; accept any match.
  for (const v1 of v1s) {
    const got = hexToBytes(v1);
    if (!got.length) continue;
    if (timingSafeEqual(expected, got)) return;
  }

  throw new Error("Stripe signature mismatch");
}

// NEW: allow multiple secrets so new/rotated Stripe Event Destinations keep working.
function parseWebhookSecrets(raw: string): string[] {
  // Allow comma/newline separation. We only trim AROUND each token (not inside).
  return String(raw || "")
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------------------------
// Email helpers (best-effort)
// ---------------------------
function formatMoney(amountMinor: number, currency?: string | null): string {
  const cur = typeof currency === "string" ? currency.toUpperCase() : "";
  const minor = Number.isFinite(amountMinor) ? amountMinor : 0;
  const major = minor / 100;
  return cur ? `${major.toFixed(2)} ${cur}` : `${major.toFixed(2)}`;
}

// Do NOT call Stripe API in webhook. Only use metadata + session fields.
async function resolveCustomerEmail(session: any): Promise<string | null> {
  const metaEmail = session?.metadata?.email ?? null;
  if (typeof metaEmail === "string" && metaEmail.trim()) return metaEmail.trim();

  const direct =
    session?.customer_details?.email ?? session?.customer_email ?? null;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  return null;
}

async function resolveProfileEmail(
  supabase: ReturnType<typeof createClient>,
  userId: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .maybeSingle();
    if (error) return null;
    const e = (data as any)?.email;
    if (typeof e === "string" && e.trim()) return e.trim();
    return null;
  } catch {
    return null;
  }
}

async function resolveInvoiceEmail(params: {
  supabase: ReturnType<typeof createClient>;
  invoice: any;
  userId?: string | null;
}): Promise<string | null> {
  const inv = params.invoice;

  // Stripe invoice often has customer_email (may be null depending on settings/api version)
  const invEmail = inv?.customer_email ?? inv?.customer_details?.email ?? null;
  if (typeof invEmail === "string" && invEmail.trim()) return invEmail.trim();

  if (params.userId && isUuid(params.userId)) {
    const pe = await resolveProfileEmail(params.supabase, params.userId);
    if (pe) return pe;
  }

  return null;
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

// Prefer select("*") and infer tier safely.
async function resolveTierId(
  supabase: ReturnType<typeof createClient>,
  vip: VipKey,
): Promise<string | null> {
  const { data, error } = await supabase.from("subscription_tiers").select("*");
  if (error) throw error;

  for (const r of data ?? []) {
    const s = norm(
      (r as any).vip_key ??
        (r as any).code ??
        (r as any).slug ??
        (r as any).name ??
        (r as any).title ??
        (r as any).name_vi ??
        (r as any).id,
    );

    if (s.includes(vip)) return String((r as any).id);

    const pm = (r as any).price_monthly;
    const n =
      typeof pm === "number" ? pm : typeof pm === "string" ? Number(pm) : NaN;
    if (Number.isFinite(n)) {
      if (vip === "vip1" && n === 5) return String((r as any).id);
      if (vip === "vip3" && n === 12) return String((r as any).id);
      if (vip === "vip9" && n === 25) return String((r as any).id);
    }

    const d = (r as any).display_order;
    const di =
      typeof d === "number" ? d : typeof d === "string" ? Number(d) : NaN;
    if (Number.isFinite(di)) {
      if (vip === "vip1" && di === 1) return String((r as any).id);
      if (vip === "vip3" && di === 3) return String((r as any).id);
      if (vip === "vip9" && di === 9) return String((r as any).id);
    }
  }

  return null;
}

async function tierExists(
  supabase: ReturnType<typeof createClient>,
  tierId: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("subscription_tiers")
      .select("id")
      .eq("id", tierId)
      .maybeSingle();
    if (error) return false;
    return !!data?.id;
  } catch {
    return false;
  }
}

async function resolveTierFromCheckoutContext(params: {
  supabase: ReturnType<typeof createClient>;
  vipKeyFromPrice: VipKey | null;
  metaVipKey: VipKey | null;
  metaTierId: string | null;
}): Promise<{ vipKey: VipKey; tierId: string } | null> {
  const { supabase, vipKeyFromPrice, metaVipKey, metaTierId } = params;

  if (metaTierId && isUuid(metaTierId)) {
    const ok = await tierExists(supabase, metaTierId);
    if (ok) {
      const v = metaVipKey ?? vipKeyFromPrice;
      if (v) return { vipKey: v, tierId: metaTierId };
      return { vipKey: "vip1", tierId: metaTierId }; // label-only fallback
    }
  }

  const vip = metaVipKey ?? vipKeyFromPrice;
  if (!vip) return null;

  const tierId = await resolveTierId(supabase, vip);
  if (!tierId) return null;

  return { vipKey: vip, tierId };
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
    console.log(
      "[stripe-webhook] email already sent; skipping:",
      params.templateKey,
    );
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
  try {
    console.log("[stripe-webhook] hit", {
      method: req.method,
      has_sig: !!req.headers.get("stripe-signature"),
      ua: req.headers.get("user-agent") ?? "",
    });
  } catch {
    // ignore
  }

  if (req.method === "OPTIONS") return ok200();
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // ✅ MULTI-SECRET SUPPORT
  const webhookSecretsRaw = envRaw("STRIPE_WEBHOOK_SECRET");
  const webhookSecrets = parseWebhookSecrets(webhookSecretsRaw);

  const supabaseUrl = env("SUPABASE_URL");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");

  if (!webhookSecrets.length)
    return json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, 500);
  if (!supabaseUrl || !serviceKey) {
    return json(
      { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
      500,
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return json({ error: "Missing signature" }, 400);

  // Diagnostics (safe)
  try {
    const first = webhookSecrets[0] ?? "";
    console.log("[stripe-webhook] sig debug", {
      whsec_prefix: first.slice(0, 7),
      whsec_last4: first.slice(-4),
      whsec_len: first.length,
      whsec_count: webhookSecrets.length,
      sig_preview: String(sig).slice(0, 24),
      tolerance_s: getWebhookToleranceSeconds(),
    });
  } catch {
    // ignore
  }

  // IMPORTANT: verify against the EXACT raw bytes Stripe signed.
  const rawBuf = await req.arrayBuffer();
  const rawBytes = new Uint8Array(rawBuf);

  // Verify signature (async WebCrypto) — accept ANY configured secret
  try {
    let ok = false;
    let lastErr: any = null;

    for (const webhookSecret of webhookSecrets) {
      try {
        await verifyStripeSignatureOrThrow({
          rawBodyBytes: rawBytes,
          sigHeader: sig,
          webhookSecret,
        });
        ok = true;
        break;
      } catch (e: any) {
        lastErr = e;
      }
    }

    if (!ok) throw lastErr ?? new Error("Stripe signature mismatch");
  } catch (e: any) {
    const sigPreview = String(sig).slice(0, 32);
    console.warn("[stripe-webhook] Invalid signature", {
      sig_preview: sigPreview,
      raw_len: rawBytes.length,
      whsec_count: webhookSecrets.length,
      err: e?.message ?? String(e),
    });
    return json({ error: "Invalid signature" }, 400);
  }

  // Parse JSON after signature is verified
  let event: any;
  try {
    const rawText = new TextDecoder().decode(rawBytes);
    event = JSON.parse(rawText);
  } catch (e: any) {
    console.error("[stripe-webhook] JSON parse failed", e);
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!event?.id) return json({ error: "Stripe event missing id" }, 400);

  const type = event.type;
  console.log("[stripe-webhook] received", { id: event.id, type });

  // ✅ Allowlist (keep webhook fast)
  if (
    type !== "checkout.session.completed" &&
    type !== "invoice.paid" &&
    type !== "invoice.payment_succeeded" &&
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

      const isComplete = s?.status === "complete";
      const payOk =
        s?.payment_status === "paid" ||
        s?.payment_status === "no_payment_required";
      if (s.mode !== "subscription" || !isComplete || !payOk) return ok200();

      const candidateUserId =
        s.client_reference_id ??
        s.metadata?.supabase_user_id ??
        s.metadata?.user_id ??
        null;

      const userId = isUuid(candidateUserId) ? candidateUserId : null;
      if (!userId) {
        throw new Error(
          "userId missing/invalid (expected UUID client_reference_id or metadata.supabase_user_id)",
        );
      }

      const stripeSessionId = s.id;
      const stripeSubscriptionId = s.subscription ?? null;
      const stripeCustomerId = s.customer ?? null;
      const product_key: ProductKey = "mercy_blade";

      // No Stripe API calls here. Price may not be available; rely on metadata.
      const priceId: string | null = null;

      const vipKeyFromPrice = priceIdToVipKey(priceId);
      const metaVipKey = normalizeMetaVip(s.metadata?.vip_key);
      const metaTierId =
        typeof s.metadata?.tier_id === "string" ? s.metadata.tier_id : null;

      const resolvedTier = await resolveTierFromCheckoutContext({
        supabase,
        vipKeyFromPrice,
        metaVipKey,
        metaTierId,
      });

      if (!resolvedTier) {
        throw new Error(
          "tierId/vipKey unresolved (expected metadata.tier_id and/or metadata.vip_key)",
        );
      }

      const { tierId } = resolvedTier;
      const vipKey: VipKey = resolvedTier.vipKey;

      const amount = typeof s.amount_total === "number" ? s.amount_total : 0;
      const currency = typeof s.currency === "string" ? s.currency : null;

      const customerEmail = await resolveCustomerEmail(s);

      if (!processed) {
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
          const { error: insErr } = await supabase
            .from("payment_transactions")
            .insert({
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

        // ledger LAST
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
      } else {
        console.log(
          "[stripe-webhook] event already processed; skipping DB writes, allowing email retry",
        );
      }

      // Emails (retryable; idempotent if correlation_id is stored in outbox)
      if (customerEmail) {
        const prettyAmount = formatMoney(amount, currency);
        const period = "Monthly";
        const tierLabel = vipKey.toUpperCase();
        const correlationId = event.id;

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

    // ---------------------------
    // INVOICE PAID / PAYMENT SUCCEEDED ✅ (real subscription money source)
    // Put this BEFORE the processed fast-exit so first-time invoices write DB.
    // ---------------------------
    if (type === "invoice.paid" || type === "invoice.payment_succeeded") {
      const inv = event.data.object;

      const stripeInvoiceId = inv?.id ?? null;
      const stripeSubscriptionId = inv?.subscription ?? null;
      const stripeCustomerId = inv?.customer ?? null;

      if (!stripeInvoiceId || !stripeSubscriptionId) {
        // Without subscription we cannot link to a user in our DB
        console.log("[stripe-webhook] invoice missing id/subscription; skipping");
        return ok200();
      }

      const product_key: ProductKey = "mercy_blade";

      // Link to user/tier via user_subscriptions (source of truth)
      const { data: us, error: usErr } = await supabase
        .from("user_subscriptions")
        .select("user_id,tier_id")
        .eq("stripe_subscription_id", stripeSubscriptionId)
        .maybeSingle();

      if (usErr) throw usErr;

      const userId = isUuid((us as any)?.user_id) ? (us as any).user_id : null;
      const tierId = isUuid((us as any)?.tier_id) ? (us as any).tier_id : null;

      if (!userId) {
        throw new Error(
          "invoice user unresolved (expected user_subscriptions row by stripe_subscription_id)",
        );
      }

      // Stripe invoice amounts are minor units
      const amountMinor =
        typeof inv?.amount_paid === "number"
          ? inv.amount_paid
          : typeof inv?.amount_due === "number"
            ? inv.amount_due
            : 0;

      const currency = typeof inv?.currency === "string" ? inv.currency : null;

      if (!processed) {
        // Record the money event as a transaction (external_reference = invoice id)
        const { error: insErr } = await supabase.from("payment_transactions").insert({
          user_id: userId,
          tier_id: tierId,
          external_reference: stripeInvoiceId,
          status: "completed",
          amount: amountMinor,
          currency,
          payment_method: "stripe",
          transaction_type: "invoice",
          metadata: {
            product_key,
            stripe_invoice_id: stripeInvoiceId,
            stripe_subscription_id: stripeSubscriptionId,
          },
        });

        if (insErr) {
          // If you later add a unique constraint on external_reference, this becomes safe-idempotent.
          console.log(
            "[stripe-webhook] payment_transactions invoice insert skipped:",
            insErr.message,
          );
        }

        // Keep subscription status active if Stripe says paid/succeeded
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

        // ledger LAST
        await writeLedger({
          supabase,
          event,
          type,
          userId,
          tierId,
          stripeCustomerId,
          stripeSubscriptionId,
          stripeSessionId: null,
        });
      } else {
        console.log(
          "[stripe-webhook] invoice event already processed; skipping DB writes, allowing email retry",
        );
      }

      // Receipt email (retryable)
      const customerEmail = await resolveInvoiceEmail({
        supabase,
        invoice: inv,
        userId,
      });

      if (customerEmail) {
        const prettyAmount = formatMoney(amountMinor, currency);
        const period = "Monthly"; // keep your template expectation
        const correlationId = event.id;

        try {
          await sendEmailOnce({
            supabase,
            correlationId,
            to: customerEmail,
            templateKey: "receipt_subscription",
            variables: {
              amount: prettyAmount,
              period,
              tier: tierId ? "VIP" : "VIP", // template requires tier; keep generic if unknown
              currency: currency ?? "",
              amount_minor: String(amountMinor),
              stripe_session_id: "",
              stripe_subscription_id: String(stripeSubscriptionId ?? ""),
            },
          });
        } catch (e) {
          console.warn("[stripe-webhook] invoice receipt email failed (ignored)", e);
        }
      } else {
        console.log("[stripe-webhook] invoice customerEmail missing; skipping email");
      }

      return ok200();
    }

    // For non-checkout/invoice events: keep FAST EXIT
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

    let userId: string | null =
      (existing?.user_id as string | undefined) ?? null;

    if (!isUuid(userId)) {
      const metaUserId =
        sub?.metadata?.supabase_user_id ?? sub?.metadata?.user_id ?? null;
      userId = isUuid(metaUserId) ? metaUserId : null;
    }

    if (!isUuid(userId)) {
      throw new Error(
        "userId unresolved (expected existing row or subscription metadata.supabase_user_id)",
      );
    }

    let nextTierId: string | null =
      (existing?.tier_id as string | undefined) ?? null;

    const subMetaTierId =
      typeof sub?.metadata?.tier_id === "string" ? sub.metadata.tier_id : null;
    if (subMetaTierId && isUuid(subMetaTierId)) {
      const ok = await tierExists(supabase, subMetaTierId);
      if (ok) nextTierId = subMetaTierId;
    }

    if (type === "customer.subscription.updated") {
      if (!nextTierId) {
        const priceId: string | null = sub?.items?.data?.[0]?.price?.id ?? null;
        const vipKeyFromPrice = priceIdToVipKey(priceId);
        const metaVipKey = normalizeMetaVip(sub?.metadata?.vip_key);

        const resolvedTier = await resolveTierFromCheckoutContext({
          supabase,
          vipKeyFromPrice,
          metaVipKey,
          metaTierId: null,
        });

        if (resolvedTier?.tierId) nextTierId = resolvedTier.tierId;
      }
    }

    const nextStatus = sub.status === "active" ? "active" : "inactive";

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
          user_id: userId,
          product_key,
          tier_id: nextTierId,
          status: nextStatus,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
        },
        { onConflict: "user_id,product_key" },
      );
    }

    // ledger LAST
    await writeLedger({
      supabase,
      event,
      type,
      userId,
      tierId: nextTierId,
      stripeCustomerId,
      stripeSubscriptionId,
    });

    return ok200();
  } catch (e: any) {
    console.error("❌ Stripe webhook failed", e);
    return json({ error: e.message }, 500);
  }
});