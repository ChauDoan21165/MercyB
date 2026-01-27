// PATH: supabase/functions/stripe-webhook/index.ts
// VERSION: v2026-01-27.01 (EDGE-SAFE: NO Stripe SDK; WebCrypto sig verify; OBSERVABILITY HARDEN: request_id, timing, signature age, loud DB errors, richer ledger payload)
//
// Stripe Webhook — Supabase Edge Function (Deno)
// JWT DISABLED — Stripe signature ONLY
//
// Key behavior:
// - DB idempotency: if payment_events already has stripe_event_id, we SKIP DB writes.
// - Email idempotency: we DO send emails on retries IF email_outbox does not show template_key as sent.
// - Out-of-order tolerance: subscription.updated/deleted will NOT 500-loop if user_id cannot be resolved;
//   we ledger the event (user_id null) and return 200.
//
// Requires:
// - email_outbox table exists (best-effort; if missing, email is still attempted, but resend safety is reduced)
//
// Keeps:
// - Signature verification
// - Subscription updated/deleted logic (update by stripe_subscription_id then fallback upsert)
// - Local/dev email flow via sendEmail shared module
//
// IMPORTANT (Edge runtime):
// - DO NOT import Stripe SDK (esm.sh stripe) — can trigger Deno.core.runMicrotasks() error.
// - Use WebCrypto for webhook signature verification.
// - Use direct Stripe REST calls via fetch for customer/subscription lookups.
//
// HARD FIX (v2026-01-26.01):
// - payment_events: DO NOT use upsert(onConflict: stripe_event_id) unless stripe_event_id is UNIQUE.
// - We now INSERT and treat duplicate errors as “already processed”.
//
// OBSERVABILITY HARDEN (v2026-01-27.01):
// - Add request_id (uuid), timing(ms), cf-ray/ip, signature timestamp age, and a consistent log prefix.
// - Ledger payload includes key refs (object id, session/subscription/customer), and handler stage.
// - All DB errors log full Postgres fields (code/details/hint) — never silent.
// - Optional DEBUG_WEBHOOK=1 returns JSON (still 200) ONLY for invalid signature / invalid JSON to help diagnosis.

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

const env = (k: string) => (Deno.env.get(k) ?? "").trim();
const norm = (x: unknown) =>
  String(x ?? "").toLowerCase().replace(/\s+/g, " ").trim();

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function ok200(reqId?: string) {
  // keep response tiny and stable for Stripe
  return new Response("ok", {
    status: 200,
    headers: {
      ...corsHeaders,
      ...(reqId ? { "x-mb-request-id": reqId } : {}),
    },
  });
}

function hostFromUrl(u: string): string {
  try {
    return new URL(u).host;
  } catch {
    return u.slice(0, 80);
  }
}

function nowMs() {
  return Date.now();
}

function safeEq(a: string, b: string): boolean {
  // timing-safe compare (best-effort)
  try {
    const aa = new TextEncoder().encode(a);
    const bb = new TextEncoder().encode(b);
    if (aa.length !== bb.length) return false;
    let out = 0;
    for (let i = 0; i < aa.length; i++) out |= aa[i] ^ bb[i];
    return out === 0;
  } catch {
    return false;
  }
}

function pgErrObj(e: any) {
  return {
    message: e?.message ?? String(e),
    code: e?.code ?? null,
    details: e?.details ?? null,
    hint: e?.hint ?? null,
  };
}

function getReqMeta(req: Request) {
  const cfRay = req.headers.get("cf-ray") || "";
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for") ||
    "";
  const ua = req.headers.get("user-agent") || "";
  return { cfRay, ip, ua };
}

function logp(reqId: string, stage: string, data?: any) {
  // Always one-line JSON-ish logs -> easy to scan in Edge logs
  if (data === undefined) {
    console.log(`[stripe-webhook][${reqId}] ${stage}`);
  } else {
    try {
      console.log(
        `[stripe-webhook][${reqId}] ${stage} ${JSON.stringify(data)}`,
      );
    } catch {
      console.log(`[stripe-webhook][${reqId}] ${stage}`, data);
    }
  }
}

// ---------------------------
// Stripe Webhook Signature (WebCrypto)
// ---------------------------
function parseStripeSignatureHeader(sig: string): {
  t: string | null;
  v1: string[];
} {
  const parts = sig.split(",").map((s) => s.trim());
  let t: string | null = null;
  const v1: string[] = [];

  for (const p of parts) {
    const idx = p.indexOf("=");
    if (idx <= 0) continue;
    const k = p.slice(0, idx);
    const v = p.slice(idx + 1);
    if (k === "t") t = v;
    if (k === "v1") v1.push(v);
  }

  return { t, v1 };
}

async function hmacSha256Hex(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(msg),
  );
  const bytes = new Uint8Array(sig);
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

async function verifyStripeWebhookSignature(params: {
  rawBody: string;
  signatureHeader: string;
  webhookSecret: string;
}): Promise<{ ok: boolean; t: string | null }> {
  const { rawBody, signatureHeader, webhookSecret } = params;

  const parsed = parseStripeSignatureHeader(signatureHeader);
  if (!parsed.t || parsed.v1.length === 0) return { ok: false, t: parsed.t };

  // Stripe signs: `${t}.${rawBody}`
  const signedPayload = `${parsed.t}.${rawBody}`;
  const expected = await hmacSha256Hex(webhookSecret, signedPayload);

  for (const v of parsed.v1) {
    if (safeEq(v, expected)) return { ok: true, t: parsed.t };
  }
  return { ok: false, t: parsed.t };
}

// ---------------------------
// Stripe REST helpers (no Stripe SDK)
// ---------------------------
const STRIPE_API = "https://api.stripe.com/v1";

async function stripeGetJson<T = any>(
  stripeKey: string,
  path: string,
  query?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${STRIPE_API}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Stripe GET ${path} failed: ${res.status} ${text}`);

  try {
    return JSON.parse(text) as T;
  } catch {
    return (text as any) as T;
  }
}

async function resolveSubscriptionPriceId(params: {
  stripeKey: string;
  stripeSubscriptionId: string;
}): Promise<string | null> {
  const { stripeKey, stripeSubscriptionId } = params;
  try {
    const sub = await stripeGetJson<any>(
      stripeKey,
      `/subscriptions/${encodeURIComponent(stripeSubscriptionId)}`,
      { "expand[]": "items.data.price" },
    );
    const priceId = sub?.items?.data?.[0]?.price?.id ?? null;
    return typeof priceId === "string" && priceId ? priceId : null;
  } catch {
    return null;
  }
}

async function resolveStripeCustomerEmail(params: {
  stripeKey: string;
  stripeCustomerId: string;
}): Promise<string | null> {
  const { stripeKey, stripeCustomerId } = params;
  try {
    const c = await stripeGetJson<any>(
      stripeKey,
      `/customers/${encodeURIComponent(stripeCustomerId)}`,
    );
    const e = c?.email ?? null;
    return typeof e === "string" && e.trim() ? e.trim() : null;
  } catch {
    return null;
  }
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

async function resolveCustomerEmail(params: {
  stripeKey: string;
  session: any;
}): Promise<string | null> {
  const { stripeKey, session } = params;

  const metaEmail = session?.metadata?.email ?? null;
  if (typeof metaEmail === "string" && metaEmail.trim()) return metaEmail.trim();

  const direct =
    session?.customer_details?.email ?? session?.customer_email ?? null;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const cid = session?.customer ?? null;
  if (!cid || typeof cid !== "string") return null;

  return await resolveStripeCustomerEmail({ stripeKey, stripeCustomerId: cid });
}

// ---------------------------
// Tier helpers
// ---------------------------
type VipKey = "vip1" | "vip3" | "vip9";
type ProductCode = "mercy_blade";

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
  const { data, error } = await supabase
    .from("subscription_tiers")
    .select("id, vip_key, code, slug, name, title");

  if (error) {
    console.warn("[stripe-webhook] resolveTierId read failed:", pgErrObj(error));
    return null;
  }

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
  try {
    const { data, error } = await supabase
      .from("payment_events")
      .select("stripe_event_id")
      .eq("stripe_event_id", stripeEventId)
      .maybeSingle();

    if (error) throw error;
    return !!data?.stripe_event_id;
  } catch (e: any) {
    console.warn(
      "[stripe-webhook] isEventProcessed failed (treat as not processed):",
      pgErrObj(e),
    );
    return false;
  }
}

async function resolveUserIdFromLedger(
  supabase: ReturnType<typeof createClient>,
  stripeSubscriptionId: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("payment_events")
      .select("user_id")
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    const uid = (data?.[0] as any)?.user_id ?? null;
    return typeof uid === "string" && uid ? uid : null;
  } catch (e: any) {
    console.warn(
      "[stripe-webhook] resolveUserIdFromLedger failed (ignored):",
      pgErrObj(e),
    );
    return null;
  }
}

function isDuplicatePgError(err: any): boolean {
  const msg = String(err?.message ?? err ?? "");
  return (
    err?.code === "23505" ||
    msg.toLowerCase().includes("duplicate key") ||
    msg.toLowerCase().includes("unique constraint")
  );
}

function extractObjectRefs(event: any): {
  objectId: string | null;
  stripeSessionId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  mode: string | null;
} {
  const obj = event?.data?.object ?? null;
  const objectId = typeof obj?.id === "string" ? obj.id : null;

  // session shape
  const stripeSessionId = event?.type === "checkout.session.completed" && objectId
    ? objectId
    : null;

  const stripeSubscriptionId =
    typeof obj?.subscription === "string"
      ? obj.subscription
      : typeof obj?.id === "string" && String(event?.type || "").startsWith("customer.subscription.")
        ? obj.id
        : null;

  const stripeCustomerId =
    typeof obj?.customer === "string"
      ? obj.customer
      : typeof obj?.customer_id === "string"
        ? obj.customer_id
        : null;

  const mode = typeof obj?.mode === "string" ? obj.mode : null;

  return { objectId, stripeSessionId, stripeSubscriptionId, stripeCustomerId, mode };
}

async function writeLedger(params: {
  supabase: ReturnType<typeof createClient>;
  event: any;
  type: string;
  userId?: string | null;
  tierId?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeSessionId?: string | null;
  productCode?: ProductCode | null;
  stage?: string | null;
}) {
  if (!params.event?.id) throw new Error("Stripe event missing id");

  const row = {
    provider: "stripe",
    event_type: params.type,
    stripe_event_id: params.event.id,
    stripe_customer_id: params.stripeCustomerId ?? null,
    stripe_subscription_id: params.stripeSubscriptionId ?? null,
    stripe_session_id: params.stripeSessionId ?? null,
    external_reference: params.stripeSessionId ?? params.stripeSubscriptionId ?? null,
    user_id: params.userId ?? null,
    tier_id: params.tierId ?? null,
    product_code: params.productCode ?? null,
    payload: {
      created: params.event.created,
      livemode: params.event.livemode,
      type: params.event.type,
      object_id: params.event?.data?.object?.id ?? null,
      stage: params.stage ?? null,
      // Keep it small; full event is huge and noisy.
    },
  };

  const { error } = await params.supabase.from("payment_events").insert(row);

  if (error) {
    if (isDuplicatePgError(error)) return;
    throw error;
  }
}

async function writeLedgerBestEffort(params: {
  reqId: string;
  supabase: ReturnType<typeof createClient>;
  event: any;
  type: string;
  refs?: {
    userId?: string | null;
    tierId?: string | null;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    stripeSessionId?: string | null;
    productCode?: ProductCode | null;
  };
  stage?: string;
}) {
  try {
    await writeLedger({
      supabase: params.supabase,
      event: params.event,
      type: params.type,
      userId: params.refs?.userId ?? null,
      tierId: params.refs?.tierId ?? null,
      stripeCustomerId: params.refs?.stripeCustomerId ?? null,
      stripeSubscriptionId: params.refs?.stripeSubscriptionId ?? null,
      stripeSessionId: params.refs?.stripeSessionId ?? null,
      productCode: params.refs?.productCode ?? null,
      stage: params.stage ?? null,
    });
  } catch (e: any) {
    logp(params.reqId, "LEDGER_INSERT_FAILED", pgErrObj(e));
  }
}

// ---------------------------
// Profile tier sync (best-effort)
// ---------------------------
async function syncProfileTierBestEffort(params: {
  reqId: string;
  supabase: ReturnType<typeof createClient>;
  userId: string;
}) {
  try {
    const { error } = await params.supabase.rpc(
      "sync_profile_tier_from_latest_payment",
      { p_user_id: params.userId },
    );
    if (error) {
      logp(params.reqId, "PROFILE_TIER_SYNC_RPC_FAILED", pgErrObj(error));
    }
  } catch (e: any) {
    logp(params.reqId, "PROFILE_TIER_SYNC_THROW", pgErrObj(e));
  }
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

    if (error) return false;
    return (data?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

async function sendEmailOnce(params: {
  reqId: string;
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
    logp(params.reqId, "EMAIL_SKIP_ALREADY_SENT", { templateKey: params.templateKey });
    return;
  }

  await sendEmail({
    to: params.to,
    templateKey: params.templateKey,
    variables: params.variables,
    appKey: "mercy_blade",
    correlationId: params.correlationId,
  });

  logp(params.reqId, "EMAIL_SENT_ATTEMPTED", { templateKey: params.templateKey });
}

// ---------------------------
// Server
// ---------------------------
Deno.serve(async (req) => {
  const reqId = crypto.randomUUID();
  const t0 = nowMs();

  if (req.method === "OPTIONS") return ok200(reqId);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const stripeKey = env("STRIPE_SECRET_KEY");
  const webhookSecret = env("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = env("SUPABASE_URL");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const debugWebhook = env("DEBUG_WEBHOOK") === "1";

  if (!stripeKey) return json({ error: "Missing STRIPE_SECRET_KEY" }, 500);
  if (!webhookSecret) return json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, 500);
  if (!supabaseUrl || !serviceKey) {
    return json(
      { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
      500,
    );
  }

  const meta = getReqMeta(req);
  logp(reqId, "BOOT", {
    cfRay: meta.cfRay || null,
    ip: meta.ip ? String(meta.ip).slice(0, 64) : null,
    ua: meta.ua ? String(meta.ua).slice(0, 80) : null,
    supabase_host: hostFromUrl(supabaseUrl),
  });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return debugWebhook ? json({ error: "Missing signature", reqId }, 400) : json({ error: "Missing signature" }, 400);

  const raw = await req.text();

  // Verify signature
  let sigT: string | null = null;
  try {
    const v = await verifyStripeWebhookSignature({
      rawBody: raw,
      signatureHeader: sig,
      webhookSecret,
    });
    sigT = v.t;
    if (!v.ok) {
      logp(reqId, "SIG_INVALID", {
        t: sigT,
        age_sec:
          sigT && /^\d+$/.test(sigT) ? Math.max(0, Math.floor(nowMs() / 1000) - Number(sigT)) : null,
      });
      return debugWebhook ? json({ error: "Invalid signature", reqId }, 400) : json({ error: "Invalid signature" }, 400);
    }
  } catch (e: any) {
    logp(reqId, "SIG_VERIFY_THROW", pgErrObj(e));
    return debugWebhook ? json({ error: "Invalid signature", reqId }, 400) : json({ error: "Invalid signature" }, 400);
  }

  // Parse event
  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    logp(reqId, "JSON_INVALID");
    return debugWebhook ? json({ error: "Invalid JSON payload", reqId }, 400) : json({ error: "Invalid JSON payload" }, 400);
  }

  if (!event?.id) return json({ error: "Stripe event missing id" }, 400);
  const type = String(event.type || "");

  const refs0 = extractObjectRefs(event);
  logp(reqId, "RECEIVED", {
    id: event.id,
    type,
    created: event.created ?? null,
    livemode: event.livemode ?? null,
    sig_t: sigT,
    sig_age_sec:
      sigT && /^\d+$/.test(sigT) ? Math.max(0, Math.floor(nowMs() / 1000) - Number(sigT)) : null,
    object_id: refs0.objectId,
    mode: refs0.mode,
  });

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    const processed = await isEventProcessed(supabase, event.id);

    const handled =
      type === "checkout.session.completed" ||
      type === "customer.subscription.created" ||
      type === "customer.subscription.updated" ||
      type === "customer.subscription.deleted";

    if (!handled) {
      if (!processed) {
        await writeLedgerBestEffort({
          reqId,
          supabase,
          event,
          type,
          refs: {
            stripeCustomerId: refs0.stripeCustomerId,
            stripeSubscriptionId: refs0.stripeSubscriptionId,
            stripeSessionId: refs0.stripeSessionId,
            productCode: "mercy_blade",
          },
          stage: "unhandled_event",
        });
      }
      logp(reqId, "DONE_UNHANDLED", { ms: nowMs() - t0 });
      return ok200(reqId);
    }

    // ---------------------------
    // CHECKOUT COMPLETED
    // ---------------------------
    if (type === "checkout.session.completed") {
      const s = event.data.object;

      // If Stripe CLI sends mode="payment", we ledger it and exit.
      if (s.mode !== "subscription" || s.payment_status !== "paid") {
        if (!processed) {
          await writeLedgerBestEffort({
            reqId,
            supabase,
            event,
            type,
            refs: {
              stripeCustomerId: typeof s.customer === "string" ? s.customer : null,
              stripeSubscriptionId: typeof s.subscription === "string" ? s.subscription : null,
              stripeSessionId: typeof s.id === "string" ? s.id : null,
              productCode: "mercy_blade",
            },
            stage: "checkout_non_subscription_or_unpaid",
          });
        }
        logp(reqId, "DONE_CHECKOUT_NON_SUB", { ms: nowMs() - t0 });
        return ok200(reqId);
      }

      const userId =
        s.metadata?.supabase_user_id ??
        s.metadata?.user_id ??
        s.metadata?.userId ??
        s.client_reference_id ??
        null;

      if (!userId) {
        // ledger for visibility; do not 500-loop Stripe retries for metadata-only mistakes
        if (!processed) {
          await writeLedgerBestEffort({
            reqId,
            supabase,
            event,
            type,
            refs: {
              userId: null,
              stripeCustomerId: typeof s.customer === "string" ? s.customer : null,
              stripeSubscriptionId: typeof s.subscription === "string" ? s.subscription : null,
              stripeSessionId: typeof s.id === "string" ? s.id : null,
              productCode: "mercy_blade",
            },
            stage: "checkout_missing_userId",
          });
        }
        logp(reqId, "DONE_CHECKOUT_MISSING_USERID", { ms: nowMs() - t0 });
        return ok200(reqId);
      }

      const stripeSessionId = s.id;
      const stripeSubscriptionId = s.subscription ?? null;
      const stripeCustomerId = s.customer ?? null;
      const productCode: ProductCode = "mercy_blade";

      // Resolve priceId (REST)
      let priceId: string | null = null;
      if (stripeSubscriptionId && typeof stripeSubscriptionId === "string") {
        priceId = await resolveSubscriptionPriceId({
          stripeKey,
          stripeSubscriptionId,
        });
      }

      const vipKey =
        priceIdToVipKey(priceId) ?? normalizeMetaVip(s.metadata?.vip_key);

      if (!vipKey) {
        if (!processed) {
          await writeLedgerBestEffort({
            reqId,
            supabase,
            event,
            type,
            refs: {
              userId,
              stripeCustomerId,
              stripeSubscriptionId,
              stripeSessionId,
              productCode,
            },
            stage: "checkout_unresolved_vipKey",
          });
        }
        logp(reqId, "DONE_CHECKOUT_NO_VIPKEY", { ms: nowMs() - t0 });
        return ok200(reqId);
      }

      const tierId = await resolveTierId(supabase, vipKey);
      if (!tierId) {
        if (!processed) {
          await writeLedgerBestEffort({
            reqId,
            supabase,
            event,
            type,
            refs: {
              userId,
              stripeCustomerId,
              stripeSubscriptionId,
              stripeSessionId,
              productCode,
            },
            stage: "checkout_unresolved_tierId",
          });
        }
        logp(reqId, "DONE_CHECKOUT_NO_TIERID", { ms: nowMs() - t0 });
        return ok200(reqId);
      }

      const amount = typeof s.amount_total === "number" ? s.amount_total : 0;
      const currency = typeof s.currency === "string" ? s.currency : null;

      const customerEmail = await resolveCustomerEmail({ stripeKey, session: s });

      if (!processed) {
        // Ledger first (audit trail + out-of-order resolution)
        try {
          await writeLedger({
            supabase,
            event,
            type,
            userId,
            tierId,
            stripeCustomerId,
            stripeSubscriptionId,
            stripeSessionId,
            productCode,
            stage: "checkout_paid_subscription",
          });
        } catch (e: any) {
          logp(reqId, "LEDGER_INSERT_THROW", pgErrObj(e));
          // do not fail webhook purely on ledger insert; Stripe will retry and spam
        }

        // Transition pending -> completed (safe)
        const { data: updatedRows, error: updErr } = await supabase
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

        if (updErr) logp(reqId, "PAYMENT_TX_UPDATE_ERR", pgErrObj(updErr));

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
              metadata: {
                vip_key: vipKey,
                product_code: productCode,
                stripe_event_id: event.id,
              },
            });

          if (insErr) logp(reqId, "PAYMENT_TX_INSERT_ERR", pgErrObj(insErr));
        }

        const { error: subErr } = await supabase.from("user_subscriptions").upsert(
          {
            user_id: userId,
            product_key: productCode,
            tier_id: tierId,
            status: "active",
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
          },
          { onConflict: "user_id,product_key" },
        );
        if (subErr) logp(reqId, "USER_SUBSCRIPTIONS_UPSERT_ERR", pgErrObj(subErr));

        await syncProfileTierBestEffort({ reqId, supabase, userId });
      } else {
        logp(reqId, "EVENT_ALREADY_PROCESSED", {
          note: "skipping DB writes; allowing email retry",
        });
      }

      // Email send (retryable, idempotent via outbox)
      if (customerEmail) {
        const prettyAmount = formatMoney(amount, currency);
        const period = "Monthly";
        const tierLabel = vipKey.toUpperCase();
        const correlationId = event.id;

        try {
          await sendEmailOnce({
            reqId,
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
              stripe_subscription_id:
                typeof stripeSubscriptionId === "string" ? stripeSubscriptionId : "",
            },
          });
        } catch (e: any) {
          logp(reqId, "EMAIL_RECEIPT_THROW", pgErrObj(e));
        }

        try {
          await sendEmailOnce({
            reqId,
            supabase,
            correlationId,
            to: customerEmail,
            templateKey: "welcome_vip",
            variables: {
              tier: tierLabel,
              stripe_session_id: stripeSessionId,
              stripe_subscription_id:
                typeof stripeSubscriptionId === "string" ? stripeSubscriptionId : "",
            },
          });
        } catch (e: any) {
          logp(reqId, "EMAIL_WELCOME_THROW", pgErrObj(e));
        }
      } else {
        logp(reqId, "EMAIL_SKIP_NO_CUSTOMER_EMAIL");
      }

      logp(reqId, "DONE_CHECKOUT", { ms: nowMs() - t0 });
      return ok200(reqId);
    }

    // For non-checkout events: fast exit if already processed
    if (processed) {
      logp(reqId, "DONE_SUB_ALREADY_PROCESSED", { ms: nowMs() - t0 });
      return ok200(reqId);
    }

    // ---------------------------
    // SUBSCRIPTION CREATED / UPDATED / DELETED
    // ---------------------------
    const sub = event.data.object;
    const stripeSubscriptionId = sub.id;
    const stripeCustomerId = sub.customer;
    const productCode: ProductCode = "mercy_blade";

    const { data: existing, error: exErr } = await supabase
      .from("user_subscriptions")
      .select("user_id,tier_id")
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .maybeSingle();

    if (exErr) logp(reqId, "USER_SUB_LOOKUP_ERR", pgErrObj(exErr));

    const metaUserId =
      sub?.metadata?.supabase_user_id ?? sub?.metadata?.user_id ?? null;

    const resolvedUserId =
      (existing?.user_id as string | undefined) ??
      (typeof metaUserId === "string" && metaUserId ? metaUserId : null) ??
      (await resolveUserIdFromLedger(supabase, stripeSubscriptionId));

    let nextTierId: string | null = existing?.tier_id ?? null;

    if (
      type === "customer.subscription.updated" ||
      type === "customer.subscription.created"
    ) {
      const priceId: string | null = sub?.items?.data?.[0]?.price?.id ?? null;
      const vipKeyFromPrice = priceIdToVipKey(priceId);
      if (vipKeyFromPrice) {
        const resolved = await resolveTierId(supabase, vipKeyFromPrice);
        if (resolved) nextTierId = resolved;
      }
    }

    if (!resolvedUserId) {
      await writeLedgerBestEffort({
        reqId,
        supabase,
        event,
        type,
        refs: {
          userId: null,
          tierId: nextTierId,
          stripeCustomerId,
          stripeSubscriptionId,
          stripeSessionId: null,
          productCode,
        },
        stage: "sub_userId_unresolved",
      });

      logp(reqId, "DONE_SUB_USERID_UNRESOLVED", {
        type,
        stripeSubscriptionId,
        ms: nowMs() - t0,
      });
      return ok200(reqId);
    }

    try {
      await writeLedger({
        supabase,
        event,
        type,
        userId: resolvedUserId,
        tierId: nextTierId,
        stripeCustomerId,
        stripeSubscriptionId,
        stripeSessionId: null,
        productCode,
        stage: "sub_event",
      });
    } catch (e: any) {
      logp(reqId, "LEDGER_INSERT_THROW_SUB", pgErrObj(e));
      // continue; we still attempt to sync state
    }

    const nextStatus = sub.status === "active" ? "active" : "inactive";

    const { data: updRows, error: updErr } = await supabase
      .from("user_subscriptions")
      .update({
        tier_id: nextTierId,
        status: nextStatus,
        stripe_customer_id: stripeCustomerId,
      })
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .select("user_id");

    if (updErr) logp(reqId, "USER_SUB_UPDATE_ERR", pgErrObj(updErr));

    if (!updRows || updRows.length === 0) {
      const { error: upErr } = await supabase.from("user_subscriptions").upsert(
        {
          user_id: resolvedUserId,
          product_key: productCode,
          tier_id: nextTierId,
          status: nextStatus,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
        },
        { onConflict: "user_id,product_key" },
      );
      if (upErr) logp(reqId, "USER_SUB_UPSERT_ERR", pgErrObj(upErr));
    }

    await syncProfileTierBestEffort({ reqId, supabase, userId: resolvedUserId });

    logp(reqId, "DONE_SUB", { ms: nowMs() - t0 });
    return ok200(reqId);
  } catch (e: any) {
    // Keep 500 so Stripe retries (this is a real failure)
    logp(reqId, "FATAL", pgErrObj(e));
    return json({ error: e?.message ?? "Stripe webhook failed", reqId }, 500);
  }
});

/* teacher GPT — new thing to learn:
   Observability is “correlation + timing + loud errors”. If you can’t answer “what happened?” in 60 seconds, add a request_id and log the stage. */
