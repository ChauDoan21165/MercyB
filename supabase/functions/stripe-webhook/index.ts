// supabase/functions/stripe-webhook/index.ts
// deno-lint-ignore-file no-import-prefix

import {
  createClient,
  type SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.39.3";

import { sendEmail } from "../_shared/sendEmail.ts";

/* ============================================================================
 * Minimal DB typing for Deno compatibility
 * ========================================================================== */

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type BillingProvider = "stripe" | "apple" | "google";
type BillingEnvironment = "production" | "sandbox";
type SharedSubscriptionStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "paused"
  | "canceled"
  | "revoked";

type CanonicalSubscriptionRow = {
  app_id: string;
  user_id: string;
  provider: BillingProvider;

  customer_id: string;
  subscription_id: string;
  price_id: string | null;

  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  provider_transaction_id: string | null;
  provider_original_transaction_id: string | null;

  product_id: string | null;
  provider_price_id: string | null;

  environment: BillingEnvironment | null;
  status: SharedSubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  canceled_at: string | null;
  ended_at: string | null;
  metadata?: Json | null;
  raw_payload?: unknown;
};

type EntitlementSnapshot = {
  status: "active" | "inactive";
  expires_at: string | null;
  source: BillingProvider | null;
};

type Database = {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          app_id: string;
          user_id: string;
          provider: BillingProvider;

          customer_id: string;
          subscription_id: string;
          price_id: string | null;

          provider_customer_id: string | null;
          provider_subscription_id: string | null;
          provider_transaction_id: string | null;
          provider_original_transaction_id: string | null;

          product_id: string | null;
          provider_price_id: string | null;

          environment: BillingEnvironment | null;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          ended_at: string | null;
          metadata: Json | null;
          raw_payload: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          app_id: string;
          user_id: string;
          provider: BillingProvider;

          customer_id: string;
          subscription_id: string;
          price_id?: string | null;

          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          provider_transaction_id?: string | null;
          provider_original_transaction_id?: string | null;

          product_id?: string | null;
          provider_price_id?: string | null;

          environment?: BillingEnvironment | null;
          status: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          ended_at?: string | null;
          metadata?: Json | null;
          raw_payload?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["subscriptions"]["Insert"]
        >;
      };

      entitlement_events: {
        Row: {
          event_id: string;
          provider: BillingProvider;
          event_type: string;
          user_id: string | null;
          payload: Json | null;
        };
        Insert: {
          event_id: string;
          provider: BillingProvider;
          event_type: string;
          user_id?: string | null;
          payload?: Json | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["entitlement_events"]["Insert"]
        >;
      };

      stripe_webhook_events: {
        Row: {
          event_id: string;
          created_at: string | null;
          type: string | null;
          livemode: boolean | null;
          processed_at: string | null;
          error: string | null;
        };
        Insert: {
          event_id: string;
          created_at?: string | null;
          type?: string | null;
          livemode?: boolean | null;
          processed_at?: string | null;
          error?: string | null;
        };
        Update: {
          event_id?: string;
          created_at?: string | null;
          type?: string | null;
          livemode?: boolean | null;
          processed_at?: string | null;
          error?: string | null;
        };
      };

      email_outbox: {
        Row: {
          id: string;
          app_key: string | null;
          correlation_id: string | null;
          template_key: string | null;
          to_email: string | null;
          status: string | null;
          provider: string | null;
          variables: Record<string, string> | null;
          last_error: string | null;
          updated_at: string | null;
        };
        Insert: {
          app_key?: string | null;
          correlation_id?: string | null;
          template_key?: string | null;
          to_email?: string | null;
          status?: string | null;
          provider?: string | null;
          variables?: Record<string, string> | null;
          last_error?: string | null;
          updated_at?: string | null;
        };
        Update: {
          app_key?: string | null;
          correlation_id?: string | null;
          template_key?: string | null;
          to_email?: string | null;
          status?: string | null;
          provider?: string | null;
          variables?: Record<string, string> | null;
          last_error?: string | null;
          updated_at?: string | null;
        };
      };

      profiles: {
        Row: {
          id: string;
          email: string | null;
          stripe_customer_id: string | null;
          premium_status: string | null;
          premium_expires_at: string | null;
          premium_source: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          stripe_customer_id?: string | null;
          premium_status?: string | null;
          premium_expires_at?: string | null;
          premium_source?: string | null;
        };
        Update: {
          email?: string | null;
          stripe_customer_id?: string | null;
          premium_status?: string | null;
          premium_expires_at?: string | null;
          premium_source?: string | null;
        };
      };
    };
  };
};

type DBClient = SupabaseClient<Database>;

/* ============================================================================
 * Config / constants
 * ========================================================================== */

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OUTBOX_SUCCESS_STATUSES = ["sent", "delivered"] as const;
const APP_ID = "mercy_blade" as const;
const SUBSCRIPTIONS_TABLE = "subscriptions" as const;
const STRIPE_PROVIDER: BillingProvider = "stripe";
const MAX_MONOTONIC_RETRIES = 8;

class NonRetryableWebhookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NonRetryableWebhookError";
  }
}

function logWebhook(
  level: "info" | "warn" | "error",
  message: string,
  fields: Record<string, unknown>,
) {
  const logger = level === "error"
    ? console.error
    : level === "warn"
    ? console.warn
    : console.info;

  logger(JSON.stringify({ scope: "stripe-webhook", level, message, ...fields }));
}

/* ============================================================================
 * Response helpers
 * ========================================================================== */

const ok200 = () =>
  new Response("ok", {
    status: 200,
    headers: corsHeaders,
  });

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

/* ============================================================================
 * Environment / primitive helpers
 * ========================================================================== */

function env(key: string): string {
  return (Deno.env.get(key) ?? "").trim();
}

function envRaw(key: string): string {
  return Deno.env.get(key) ?? "";
}

function getSupabaseUrl(): string {
  const configured = env("PROJECT_SUPABASE_URL") ||
    env("VITE_SUPABASE_URL") ||
    env("NEXT_PUBLIC_SUPABASE_URL");

  return configured ? configured.replace(/\/+$/, "") : "";
}

function getServiceRoleKey(): string {
  return env("PROJECT_SUPABASE_SERVICE_ROLE_KEY");
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getStripeSecretKey(): string {
  return env("STRIPE_SECRET_KEY") ||
    env("SECRET_STRIPE_KEY") ||
    env("STRIPE_API_KEY");
}

function getStripeWebhookSecrets(): string[] {
  const candidates = [
    envRaw("STRIPE_WEBHOOK_SECRET"),
    envRaw("SECRET_STRIPE_WEBHOOK_SECRET"),
    envRaw("STRIPE_SIGNING_SECRET"),
    envRaw("STRIPE_WEBHOOK_SIGNING_SECRET"),
  ];

  const parsed = candidates.flatMap((value) => parseWebhookSecrets(value));
  return [...new Set(parsed)];
}

function isoNow(): string {
  return new Date().toISOString();
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(
        value,
      )
  );
}

function asNonEmptyStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asLowerNonEmptyStringOrNull(value: unknown): string | null {
  const v = asNonEmptyStringOrNull(value);
  return v ? v.toLowerCase() : null;
}

function toIsoFromUnix(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return new Date(value * 1000).toISOString();
}

function toMillis(value: string | null | undefined): number {
  if (!value) return Number.NEGATIVE_INFINITY;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : Number.NEGATIVE_INFINITY;
}

function isEntitlingSubscription(
  subscription: Pick<CanonicalSubscriptionRow, "status" | "current_period_end">,
): boolean {
  return (
    subscription.status === "active" ||
    subscription.status === "trialing"
  );
}

function deriveEntitlementFromSubscriptions(
  subscriptions: Array<
    Pick<CanonicalSubscriptionRow, "status" | "current_period_end" | "provider">
  >,
): EntitlementSnapshot {
  let winner:
    | Pick<
      CanonicalSubscriptionRow,
      "status" | "current_period_end" | "provider"
    >
    | null = null;

  for (const subscription of subscriptions) {
    if (!isEntitlingSubscription(subscription)) continue;

    if (
      !winner ||
      toMillis(subscription.current_period_end ?? null) >
        toMillis(winner.current_period_end ?? null)
    ) {
      winner = subscription;
    }
  }

  if (!winner) {
    return {
      status: "inactive",
      expires_at: null,
      source: null,
    };
  }

  return {
    status: "active",
    expires_at: winner.current_period_end ?? null,
    source: winner.provider,
  };
}

function mapStripeSubscription(params: {
  userId: string;
  providerCustomerId: string;
  providerSubscriptionId: string;
  providerTransactionId?: string | null;
  providerOriginalTransactionId?: string | null;
  productId?: string | null;
  providerPriceId?: string | null;
  environment: BillingEnvironment;
  status?: SharedSubscriptionStatus | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean | null;
  canceledAt?: string | null;
  endedAt?: string | null;
  metadata?: unknown;
  rawPayload: unknown;
}): Database["public"]["Tables"]["subscriptions"]["Insert"] {
  return {
    app_id: APP_ID,
    user_id: params.userId,
    provider: STRIPE_PROVIDER,

    customer_id: params.providerCustomerId,
    subscription_id: params.providerSubscriptionId,
    price_id: params.providerPriceId ?? null,

    provider_customer_id: params.providerCustomerId,
    provider_subscription_id: params.providerSubscriptionId,
    provider_transaction_id: params.providerTransactionId ?? null,
    provider_original_transaction_id: params.providerOriginalTransactionId ??
      params.providerSubscriptionId,

    product_id: params.productId ?? null,
    provider_price_id: params.providerPriceId ?? null,

    environment: params.environment,
    status: params.status ?? "revoked",
    current_period_start: params.currentPeriodStart ?? null,
    current_period_end: params.currentPeriodEnd ?? null,
    cancel_at_period_end:
      typeof params.cancelAtPeriodEnd === "boolean"
        ? params.cancelAtPeriodEnd
        : null,
    canceled_at: params.canceledAt ?? null,
    ended_at: params.endedAt ?? null,
    metadata: (params.metadata ?? null) as Json | null,
    raw_payload: (params.rawPayload ?? null) as Json | null,
    updated_at: isoNow(),
  };
}

/* ============================================================================
 * Types
 * ========================================================================== */

type SupportedEventType =
  | "checkout.session.completed"
  | "invoice.paid"
  | "invoice.payment_failed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted";

type StripeObjectMetadata = {
  supabase_user_id?: string | null;
  user_id?: string | null;
  tier_id?: string | null;
  vip_key?: string | null;
  email?: string | null;
  price_id?: string | null;
};

type StripeWebhookEvent<TObject = unknown> = {
  id: string;
  type: string;
  created?: number;
  livemode?: boolean;
  data: {
    object: TObject;
  };
};

type CheckoutSessionLike = {
  id?: string | null;
  mode?: string | null;
  status?: string | null;
  payment_status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  subscription?: string | null;
  customer?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
  } | null;
  client_reference_id?: string | null;
  metadata?: StripeObjectMetadata | null;
};

type InvoiceLineLike = {
  period?: {
    start?: number | null;
    end?: number | null;
  } | null;
  price?: {
    id?: string | null;
    product?: string | null;
    recurring?: {
      interval?: string | null;
      interval_count?: number | null;
    } | null;
  } | null;
};

type InvoiceLike = {
  id?: string | null;
  subscription?: string | null;
  customer?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
  } | null;
  amount_paid?: number | null;
  amount_due?: number | null;
  currency?: string | null;
  lines?: {
    data?: InvoiceLineLike[] | null;
  } | null;
};

type SubscriptionItemLike = {
  price?: {
    id?: string | null;
    product?: string | null;
    recurring?: {
      interval?: string | null;
      interval_count?: number | null;
    } | null;
  } | null;
};

type SubscriptionLike = {
  id?: string | null;
  customer?: string | null;
  status?: string | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
  canceled_at?: number | null;
  ended_at?: number | null;
  metadata?: StripeObjectMetadata | null;
  items?: {
    data?: SubscriptionItemLike[] | null;
  } | null;
};

type StripeFreshness = {
  object_time_ms: number | null;
  event_created: number | null;
  event_id: string | null;
  event_type: string | null;
  event_priority: number | null;
};

type ExistingSubscriptionRow =
  & Pick<
    CanonicalSubscriptionRow,
    | "app_id"
    | "user_id"
    | "provider"
    | "customer_id"
    | "subscription_id"
    | "price_id"
    | "provider_customer_id"
    | "provider_subscription_id"
    | "provider_transaction_id"
    | "provider_original_transaction_id"
    | "product_id"
    | "provider_price_id"
    | "environment"
    | "status"
    | "current_period_start"
    | "current_period_end"
    | "cancel_at_period_end"
    | "canceled_at"
    | "ended_at"
  >
  & {
    metadata?: Json | null;
    raw_payload?: unknown;
  };

type ComparableSubscriptionWrite = Pick<
  Database["public"]["Tables"]["subscriptions"]["Insert"],
  | "app_id"
  | "user_id"
  | "provider"
  | "customer_id"
  | "subscription_id"
  | "price_id"
  | "provider_customer_id"
  | "provider_subscription_id"
  | "provider_transaction_id"
  | "provider_original_transaction_id"
  | "product_id"
  | "provider_price_id"
  | "environment"
  | "status"
  | "current_period_start"
  | "current_period_end"
  | "cancel_at_period_end"
  | "canceled_at"
  | "ended_at"
>;

type FilterableQuery = {
  is(column: string, value: null): unknown;
  eq(column: string, value: string | boolean): unknown;
};

type EmailRoute = {
  originalTo: string;
  forcedTo: string | null;
  finalTo: string;
};

type UpsertSharedSubscriptionMonotonicResult = {
  stateChanged: boolean;
  shouldRecomputeBeforeFinalMark: boolean;
};

/* ============================================================================
 * Stripe event / signature helpers
 * ========================================================================== */

function isSupportedEventType(value: string): value is SupportedEventType {
  return (
    value === "checkout.session.completed" ||
    value === "invoice.paid" ||
    value === "invoice.payment_failed" ||
    value === "customer.subscription.created" ||
    value === "customer.subscription.updated" ||
    value === "customer.subscription.deleted"
  );
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;

  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const value = String(hex ?? "").trim();

  if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) {
    return new Uint8Array();
  }

  const out = new Uint8Array(value.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(value.slice(i * 2, i * 2 + 2), 16);
  }

  return out;
}

function parseStripeSigHeader(
  signatureHeader: string,
): { t: string | null; v1s: string[] } {
  const parts = String(signatureHeader || "").split(",");
  let timestamp: string | null = null;
  const v1s: string[] = [];

  for (const part of parts) {
    const [rawKey, ...rest] = part.split("=");
    const key = (rawKey || "").trim();
    const value = rest.join("=").trim();
    if (!value) continue;

    if (key === "t") timestamp = value;
    if (key === "v1") v1s.push(value);
  }

  return { t: timestamp, v1s };
}

function webhookSecretToKeyBytes(webhookSecret: string): Uint8Array {
  return new TextEncoder().encode(String(webhookSecret || ""));
}

async function computeHmacSha256(
  keyBytes: Uint8Array,
  payload: Uint8Array,
): Promise<Uint8Array> {
  const algorithm: HmacImportParams = {
    name: "HMAC",
    hash: "SHA-256",
  };

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes as BufferSource,
    algorithm,
    false,
    ["sign"],
  );

  const sig = await crypto.subtle.sign(
    { name: "HMAC" },
    key,
    payload as BufferSource,
  );

  return new Uint8Array(sig);
}

function getWebhookToleranceSeconds(): number {
  const raw = env("STRIPE_WEBHOOK_TOLERANCE_SECONDS");
  const parsed = raw ? Number(raw) : NaN;

  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }

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

  const tolerance = getWebhookToleranceSeconds();
  const ts = Number(t);

  if (!Number.isFinite(ts) || ts <= 0) {
    throw new Error("Invalid Stripe-Signature header (bad t)");
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > tolerance) {
    throw new Error(`Stripe timestamp outside tolerance (${tolerance}s)`);
  }

  const prefix = new TextEncoder().encode(`${t}.`);
  const signedPayload = new Uint8Array(prefix.length + rawBodyBytes.length);
  signedPayload.set(prefix, 0);
  signedPayload.set(rawBodyBytes, prefix.length);

  const keyBytes = webhookSecretToKeyBytes(webhookSecret);
  const expected = await computeHmacSha256(keyBytes, signedPayload);

  for (const v1 of v1s) {
    const actual = hexToBytes(v1);
    if (!actual.length) continue;
    if (timingSafeEqual(expected, actual)) return;
  }

  throw new Error("Stripe signature mismatch");
}

function parseWebhookSecrets(raw: string): string[] {
  return String(raw || "")
    .split(/[\n,]+/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

/* ============================================================================
 * Webhook idempotency helpers
 * ========================================================================== */

function isMissingStripeWebhookEventsTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const maybe = error as { code?: string; message?: unknown };

  return (
    maybe.code === "PGRST205" &&
    String(maybe.message ?? "").includes("public.stripe_webhook_events")
  );
}

async function hasProcessedStripeWebhookEvent(
  supabase: DBClient,
  eventId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("stripe_webhook_events")
    .select("event_id")
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    if (isMissingStripeWebhookEventsTable(error)) {
      console.warn(
        "stripe-webhook stripe_webhook_events table missing; skipping replay short-circuit",
        error,
      );
      return false;
    }

    throw error;
  }

  return !!data?.event_id;
}

async function upsertStripeWebhookEventResult(params: {
  supabase: DBClient;
  event: Pick<StripeWebhookEvent, "id" | "type" | "livemode">;
  processed: boolean;
  errorMessage?: string | null;
}): Promise<boolean> {
  const payload: Database["public"]["Tables"]["stripe_webhook_events"]["Insert"] = {
    event_id: params.event.id,
    type: params.event.type,
    livemode: typeof params.event.livemode === "boolean" ? params.event.livemode : null,
    processed_at: params.processed ? isoNow() : null,
    error: params.errorMessage ?? null,
  };

  const { error } = await params.supabase
    .from("stripe_webhook_events")
    .upsert(payload, { onConflict: "event_id" });

  if (!error) return true;

  if (isMissingStripeWebhookEventsTable(error)) {
    console.warn(
      "stripe-webhook stripe_webhook_events table missing; skipping result mark",
      error,
    );
    return true;
  }

  logWebhook("error", "failed to upsert stripe webhook event result", {
    event_id: params.event.id,
    event_type: params.event.type,
    processed: params.processed,
    error_message: params.errorMessage ?? null,
    error,
  });

  throw error;
}

async function markStripeWebhookEventProcessed(
  supabase: DBClient,
  event: Pick<StripeWebhookEvent, "id" | "type" | "livemode">,
): Promise<boolean> {
  return await upsertStripeWebhookEventResult({
    supabase,
    event,
    processed: true,
    errorMessage: null,
  });
}

/* ============================================================================
 * Email helpers
 * ========================================================================== */

function formatMoney(amountMinor: number, currency?: string | null): string {
  const code = typeof currency === "string" ? currency.toUpperCase() : "";
  const minor = Number.isFinite(amountMinor) ? amountMinor : 0;
  const major = minor / 100;

  return code ? `${major.toFixed(2)} ${code}` : `${major.toFixed(2)}`;
}

function resolveEmailRoute(originalTo: string | null): EmailRoute | null {
  const normalizedOriginal = asNonEmptyStringOrNull(originalTo);
  if (!normalizedOriginal) return null;

  const forced = env("FORCE_EMAIL_TO");
  const forcedTo = forced ? forced : null;

  return {
    originalTo: normalizedOriginal,
    forcedTo,
    finalTo: forcedTo ?? normalizedOriginal,
  };
}

function buildCommonEmailAuditVariables(params: {
  originalTo: string;
  forcedTo: string | null;
  correlationId: string;
  userId: string;
}) {
  return {
    user_email: params.originalTo,
    original_to: params.originalTo,
    forced_to: params.forcedTo ?? "",
    correlation_id: params.correlationId,
    email: params.originalTo,
    supabase_user_id: params.userId,
  };
}

async function outboxAlreadySent(
  supabase: DBClient,
  correlationId: string,
  templateKey: string,
  toEmail: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("email_outbox")
      .select("id,status")
      .eq("correlation_id", correlationId)
      .eq("template_key", templateKey)
      .eq("to_email", toEmail)
      .in("status", [...OUTBOX_SUCCESS_STATUSES])
      .limit(1);

    if (error) return false;
    return (data?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

async function outboxUpsertQueued(params: {
  supabase: DBClient;
  correlationId: string;
  to: string;
  templateKey: string;
  variables: Record<string, string>;
}) {
  try {
    const provider = env("EMAIL_PROVIDER") || null;

    await params.supabase.from("email_outbox").upsert(
      {
        app_key: APP_ID,
        correlation_id: params.correlationId,
        template_key: params.templateKey,
        to_email: params.to,
        status: "queued",
        provider,
        variables: params.variables,
        last_error: null,
      },
      { onConflict: "correlation_id,template_key,to_email" },
    );
  } catch {
    // best-effort
  }
}

async function outboxMark(params: {
  supabase: DBClient;
  correlationId: string;
  to: string;
  templateKey: string;
  status: "sent" | "failed";
  lastError?: string | null;
}) {
  try {
    const provider = env("EMAIL_PROVIDER") || null;

    await params.supabase
      .from("email_outbox")
      .update({
        status: params.status,
        provider,
        last_error: params.lastError ?? null,
        updated_at: isoNow(),
      })
      .eq("correlation_id", params.correlationId)
      .eq("template_key", params.templateKey)
      .eq("to_email", params.to);
  } catch {
    // best-effort
  }
}

async function sendEmailOnce(params: {
  supabase: DBClient;
  correlationId: string;
  to: string;
  templateKey: string;
  variables: Record<string, string>;
}) {
  const alreadySent = await outboxAlreadySent(
    params.supabase,
    params.correlationId,
    params.templateKey,
    params.to,
  );

  if (alreadySent) return;

  await outboxUpsertQueued({
    supabase: params.supabase,
    correlationId: params.correlationId,
    to: params.to,
    templateKey: params.templateKey,
    variables: params.variables,
  });

  try {
    await sendEmail({
      to: params.to,
      templateKey: params.templateKey,
      variables: params.variables,
      appKey: APP_ID,
      correlationId: params.correlationId,
    });

    await outboxMark({
      supabase: params.supabase,
      correlationId: params.correlationId,
      to: params.to,
      templateKey: params.templateKey,
      status: "sent",
      lastError: null,
    });
  } catch (error: unknown) {
    await outboxMark({
      supabase: params.supabase,
      correlationId: params.correlationId,
      to: params.to,
      templateKey: params.templateKey,
      status: "failed",
      lastError: error instanceof Error
        ? error.message
        : String(error ?? "unknown error"),
    });
    throw error;
  }
}

async function resolveUserIdByProfileStripeCustomerId(
  supabase: DBClient,
  providerCustomerId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", providerCustomerId)
    .maybeSingle();

  if (error) throw error;

  const id = (data as { id?: string | null } | null)?.id ?? null;
  return isUuid(id) ? id : null;
}

async function syncProfileStripeCustomerIdBestEffort(params: {
  supabase: DBClient;
  userId: string;
  providerCustomerId: string | null;
}) {
  const providerCustomerId = asNonEmptyStringOrNull(params.providerCustomerId);

  if (!providerCustomerId) return;

  try {
    const { data, error } = await params.supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", params.userId)
      .maybeSingle();

    if (error) throw error;

    const existingCustomerId = asNonEmptyStringOrNull(
      (data as { stripe_customer_id?: string | null } | null)
        ?.stripe_customer_id ?? null,
    );

    if (existingCustomerId === providerCustomerId) return;

    if (existingCustomerId && existingCustomerId !== providerCustomerId) {
      console.warn(
        "stripe-webhook profile stripe_customer_id mismatch; leaving existing linkage intact",
        {
          userId: params.userId,
          existingCustomerId,
          incomingCustomerId: providerCustomerId,
        },
      );
      return;
    }

    await params.supabase
      .from("profiles")
      .update({
        stripe_customer_id: providerCustomerId,
      })
      .eq("id", params.userId)
      .is("stripe_customer_id", null);
  } catch (error) {
    console.warn(
      "stripe-webhook failed to persist profile stripe_customer_id linkage",
      {
        userId: params.userId,
        providerCustomerId,
        error,
      },
    );
  }
}

async function resolveProfileEmail(
  supabase: DBClient,
  userId: string,
): Promise<string | null> {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .maybeSingle();

    return asNonEmptyStringOrNull(
      (data as { email?: string | null } | null)?.email,
    );
  } catch {
    return null;
  }
}

async function resolveUserIdByProfileEmail(
  supabase: DBClient,
  email: string | null,
): Promise<string | null> {
  const normalizedEmail = asLowerNonEmptyStringOrNull(email);
  if (!normalizedEmail) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) throw error;

  const id = (data as { id?: string | null } | null)?.id ?? null;
  return isUuid(id) ? id : null;
}

function resolveCheckoutCustomerEmail(
  session: CheckoutSessionLike,
): string | null {
  return (
    asNonEmptyStringOrNull(session?.customer_details?.email) ??
      asNonEmptyStringOrNull(session?.customer_email) ??
      asNonEmptyStringOrNull(session?.metadata?.email) ??
      null
  );
}

async function resolveInvoiceCustomerEmail(params: {
  supabase: DBClient;
  invoice: InvoiceLike;
  userId: string;
}): Promise<string | null> {
  const direct = asNonEmptyStringOrNull(params.invoice?.customer_email) ??
    asNonEmptyStringOrNull(params.invoice?.customer_details?.email);

  if (direct) return direct;
  return await resolveProfileEmail(params.supabase, params.userId);
}

function formatPlanPeriod(params: {
  interval?: string | null;
  intervalCount?: number | null;
}): string {
  const interval = asLowerNonEmptyStringOrNull(params.interval);
  const count =
    typeof params.intervalCount === "number" && Number.isFinite(params.intervalCount)
      ? Math.max(1, Math.floor(params.intervalCount))
      : 1;

  switch (interval) {
    case "month":
      return count === 12 ? "Yearly" : count === 1 ? "Monthly" : `Every ${count} months`;
    case "year":
      return count === 1 ? "Yearly" : `Every ${count} years`;
    case "week":
      return count === 1 ? "Weekly" : `Every ${count} weeks`;
    case "day":
      return count === 1 ? "Daily" : `Every ${count} days`;
    default:
      return "Subscription";
  }
}

function derivePlanDetails(params: {
  providerPriceId?: string | null;
  subscription?: SubscriptionLike | null;
  invoice?: InvoiceLike | null;
  metadata?: StripeObjectMetadata | null;
}): {
  period: string;
  tier: string;
} {
  const invoicePrice = params.invoice?.lines?.data?.[0]?.price ?? null;
  const subscriptionPrice = params.subscription?.items?.data?.[0]?.price ?? null;
  const period = formatPlanPeriod({
    interval: invoicePrice?.recurring?.interval ?? subscriptionPrice?.recurring?.interval ?? null,
    intervalCount: invoicePrice?.recurring?.interval_count ?? subscriptionPrice?.recurring?.interval_count ?? null,
  });

  const tier = asNonEmptyStringOrNull(params.metadata?.tier_id) ??
    asNonEmptyStringOrNull(params.providerPriceId) ??
    asNonEmptyStringOrNull(invoicePrice?.product) ??
    asNonEmptyStringOrNull(subscriptionPrice?.product) ??
    "VIP";

  return { period, tier };
}

/* ============================================================================
 * Stripe payload extractors
 * ========================================================================== */

function stripeEnvironmentFromEvent(
  event: StripeWebhookEvent,
): BillingEnvironment {
  return event?.livemode ? "production" : "sandbox";
}

function normalizeStripeSubscriptionStatus(params: {
  value: unknown;
  currentPeriodEnd?: string | null;
}): SharedSubscriptionStatus {
  const normalized = asLowerNonEmptyStringOrNull(params.value);

  switch (normalized) {
    case "active":
    case "trialing":
    case "past_due":
    case "paused":
      return normalized;

    case "unpaid":
      return "past_due";

    case "canceled":
      return "canceled";

    case "incomplete":
    case "incomplete_expired":
      return "revoked";

    default:
      return "revoked";
  }
}

function getInvoicePeriodRange(invoice: InvoiceLike): {
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
} {
  const lines = invoice?.lines?.data ?? [];
  let start: string | null = null;
  let end: string | null = null;

  for (const line of lines) {
    const lineStart = toIsoFromUnix(line?.period?.start);
    const lineEnd = toIsoFromUnix(line?.period?.end);

    if (
      lineStart &&
      (!start || new Date(lineStart).getTime() < new Date(start).getTime())
    ) {
      start = lineStart;
    }

    if (
      lineEnd &&
      (!end || new Date(lineEnd).getTime() > new Date(end).getTime())
    ) {
      end = lineEnd;
    }
  }

  return {
    currentPeriodStart: start,
    currentPeriodEnd: end,
  };
}

function getInvoiceProductId(invoice: InvoiceLike): string | null {
  const firstLine = invoice?.lines?.data?.[0];
  return asNonEmptyStringOrNull(firstLine?.price?.product) ?? null;
}

function getInvoicePriceId(invoice: InvoiceLike): string | null {
  const firstLine = invoice?.lines?.data?.[0];
  return asNonEmptyStringOrNull(firstLine?.price?.id) ?? null;
}

function getSubscriptionProductId(
  subscription: SubscriptionLike | null | undefined,
): string | null {
  const firstItem = subscription?.items?.data?.[0];
  return asNonEmptyStringOrNull(firstItem?.price?.product) ?? null;
}

function getSubscriptionPriceId(
  subscription: SubscriptionLike | null | undefined,
): string | null {
  const firstItem = subscription?.items?.data?.[0];
  return asNonEmptyStringOrNull(firstItem?.price?.id) ??
    asNonEmptyStringOrNull(subscription?.metadata?.price_id) ??
    null;
}

function getCheckoutSessionPriceId(
  session: CheckoutSessionLike,
): string | null {
  return asNonEmptyStringOrNull(session?.metadata?.price_id) ?? null;
}

async function fetchStripeSubscriptionById(
  providerSubscriptionId: string,
): Promise<SubscriptionLike | null> {
  const stripeSecretKey = getStripeSecretKey();

  if (!stripeSecretKey || !providerSubscriptionId) {
    return null;
  }

  const url = new URL(
    `https://api.stripe.com/v1/subscriptions/${
      encodeURIComponent(providerSubscriptionId)
    }`,
  );
  url.searchParams.append("expand[]", "items.data.price");

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
      },
    });

    if (response.status === 404) {
      return null;
    }

    const raw = await response.text();
    let payload: unknown = null;

    try {
      payload = raw ? JSON.parse(raw) : null;
    } catch {
      payload = raw;
    }

    if (!response.ok) {
      console.warn("stripe-webhook Stripe subscription lookup failed", {
        providerSubscriptionId,
        status: response.status,
        payload,
      });
      return null;
    }

    return payload as SubscriptionLike;
  } catch (error) {
    console.warn("stripe-webhook Stripe subscription lookup threw", {
      providerSubscriptionId,
      error,
    });
    return null;
  }
}

function attachInvoiceLookupPayload(
  invoice: InvoiceLike,
  stripeSubscription: SubscriptionLike | null,
): unknown {
  if (!stripeSubscription) return invoice;

  return {
    ...invoice,
    __stripe_subscription_lookup: stripeSubscription,
  };
}

async function resolveUserForInvoiceEvent(params: {
  supabase: DBClient;
  providerSubscriptionId: string;
  providerCustomerId: string | null;
  invoiceEmail?: string | null;
}): Promise<{
  userId: string | null;
  stripeSubscription: SubscriptionLike | null;
}> {
  const directUserId = await resolveUserByStripeLinkage({
    supabase: params.supabase,
    providerSubscriptionId: params.providerSubscriptionId,
    providerCustomerId: params.providerCustomerId,
  });

  if (directUserId) {
    return {
      userId: directUserId,
      stripeSubscription: null,
    };
  }

  const byEmail = await resolveUserIdByProfileEmail(
    params.supabase,
    params.invoiceEmail ?? null,
  );

  if (byEmail) {
    return {
      userId: byEmail,
      stripeSubscription: null,
    };
  }

  const stripeSubscription = await fetchStripeSubscriptionById(
    params.providerSubscriptionId,
  );

  if (!stripeSubscription) {
    return {
      userId: null,
      stripeSubscription: null,
    };
  }

  const userId = await resolveUserByStripeLinkage({
    supabase: params.supabase,
    metadataSupabaseUserId: stripeSubscription?.metadata?.supabase_user_id ??
      null,
    metadataUserId: stripeSubscription?.metadata?.user_id ?? null,
    providerSubscriptionId:
      asNonEmptyStringOrNull(stripeSubscription?.id) ??
      params.providerSubscriptionId,
    providerCustomerId:
      asNonEmptyStringOrNull(stripeSubscription?.customer) ??
      params.providerCustomerId,
  });

  if (userId) {
    return { userId, stripeSubscription };
  }

  const bySubscriptionEmail = await resolveUserIdByProfileEmail(
    params.supabase,
    stripeSubscription?.metadata?.email ?? null,
  );

  return {
    userId: bySubscriptionEmail,
    stripeSubscription,
  };
}

/* ============================================================================
 * Freshness helpers
 * ========================================================================== */

function asRecordOrNull(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function isoToMillis(value: string | null | undefined): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function maxNullableNumber(
  values: Array<number | null | undefined>,
): number | null {
  let out: number | null = null;

  for (const value of values) {
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    if (out === null || value > out) out = value;
  }

  return out;
}

function deriveObjectTimeMs(rawPayload: unknown): number | null {
  const record = asRecordOrNull(rawPayload);
  if (!record) return null;

  const currentPeriodStart = toIsoFromUnix(record.current_period_start);
  const currentPeriodEnd = toIsoFromUnix(record.current_period_end);
  const canceledAt = toIsoFromUnix(record.canceled_at);
  const endedAt = toIsoFromUnix(record.ended_at);

  if (currentPeriodStart || currentPeriodEnd || canceledAt || endedAt) {
    return maxNullableNumber([
      isoToMillis(currentPeriodStart),
      isoToMillis(currentPeriodEnd),
      isoToMillis(canceledAt),
      isoToMillis(endedAt),
    ]);
  }

  const lines = asRecordOrNull(record.lines);
  const lineItems = Array.isArray(lines?.data) ? lines?.data : [];

  if (lineItems.length > 0) {
    let invoiceObjectTime: number | null = null;

    for (const line of lineItems) {
      const lineRecord = asRecordOrNull(line);
      const period = asRecordOrNull(lineRecord?.period);
      const startIso = toIsoFromUnix(period?.start);
      const endIso = toIsoFromUnix(period?.end);

      invoiceObjectTime = maxNullableNumber([
        invoiceObjectTime,
        isoToMillis(startIso),
        isoToMillis(endIso),
      ]);
    }

    if (invoiceObjectTime !== null) return invoiceObjectTime;
  }

  return null;
}

function getStripeEventPriority(eventType: string | null | undefined): number {
  switch (eventType) {
    case "customer.subscription.deleted":
      return 70;
    case "customer.subscription.updated":
      return 60;
    case "customer.subscription.created":
      return 50;
    case "invoice.paid":
      return 40;
    case "invoice.payment_failed":
      return 35;
    case "checkout.session.completed":
      return 10;
    default:
      return 0;
  }
}

function deriveIncomingFreshness(
  rawPayload: unknown,
  event: StripeWebhookEvent,
): StripeFreshness {
  const eventType = asNonEmptyStringOrNull(event.type);

  return {
    object_time_ms: deriveObjectTimeMs(rawPayload),
    event_created:
      typeof event.created === "number" && Number.isFinite(event.created)
        ? event.created
        : null,
    event_id: asNonEmptyStringOrNull(event.id),
    event_type: eventType,
    event_priority: getStripeEventPriority(eventType),
  };
}

function derivePersistedFreshness(rawPayload: unknown): StripeFreshness {
  const record = asRecordOrNull(rawPayload);
  const explicit = asRecordOrNull(record?.__stripe_freshness);

  const explicitObjectTime = typeof explicit?.object_time_ms === "number" &&
      Number.isFinite(explicit.object_time_ms)
    ? explicit.object_time_ms
    : null;

  const explicitEventCreated = typeof explicit?.event_created === "number" &&
      Number.isFinite(explicit.event_created)
    ? explicit.event_created
    : null;

  const explicitEventId = asNonEmptyStringOrNull(explicit?.event_id);
  const explicitEventType = asNonEmptyStringOrNull(explicit?.event_type);
  const explicitEventPriority =
    typeof explicit?.event_priority === "number" &&
      Number.isFinite(explicit.event_priority)
      ? explicit.event_priority
      : null;

  if (
    explicitObjectTime !== null ||
    explicitEventCreated !== null ||
    explicitEventId !== null ||
    explicitEventType !== null ||
    explicitEventPriority !== null
  ) {
    return {
      object_time_ms: explicitObjectTime,
      event_created: explicitEventCreated,
      event_id: explicitEventId,
      event_type: explicitEventType,
      event_priority: explicitEventPriority,
    };
  }

  return {
    object_time_ms: deriveObjectTimeMs(rawPayload),
    event_created: null,
    event_id: null,
    event_type: null,
    event_priority: null,
  };
}

function compareStripeFreshness(
  left: StripeFreshness,
  right: StripeFreshness,
): number {
  const leftObjectTime = left.object_time_ms ?? -1;
  const rightObjectTime = right.object_time_ms ?? -1;

  if (leftObjectTime !== rightObjectTime) {
    return leftObjectTime > rightObjectTime ? 1 : -1;
  }

  const leftEventCreated = left.event_created ?? -1;
  const rightEventCreated = right.event_created ?? -1;

  if (leftEventCreated !== rightEventCreated) {
    return leftEventCreated > rightEventCreated ? 1 : -1;
  }

  const leftPriority = left.event_priority ?? 0;
  const rightPriority = right.event_priority ?? 0;

  if (leftPriority !== rightPriority) {
    return leftPriority > rightPriority ? 1 : -1;
  }

  return 0;
}

function attachStripeFreshnessToRawPayload(
  rawPayload: unknown,
  event: StripeWebhookEvent,
): unknown {
  const freshness = deriveIncomingFreshness(rawPayload, event);
  const record = asRecordOrNull(rawPayload);

  if (record) {
    return {
      ...record,
      __stripe_freshness: freshness,
    };
  }

  return {
    __stripe_payload: rawPayload,
    __stripe_freshness: freshness,
  };
}

/* ============================================================================
 * Subscription persistence helpers
 * ========================================================================== */

function doesExistingSubscriptionDifferFromWrite(
  existing: ExistingSubscriptionRow,
  write: ComparableSubscriptionWrite,
): boolean {
  return (
    (existing.app_id ?? null) !== (write.app_id ?? null) ||
    (existing.user_id ?? null) !== (write.user_id ?? null) ||
    (existing.provider ?? null) !== (write.provider ?? null) ||

    (existing.customer_id ?? null) !== (write.customer_id ?? null) ||
    (existing.subscription_id ?? null) !== (write.subscription_id ?? null) ||
    (existing.price_id ?? null) !== (write.price_id ?? null) ||

    (existing.provider_customer_id ?? null) !==
      (write.provider_customer_id ?? null) ||
    (existing.provider_subscription_id ?? null) !==
      (write.provider_subscription_id ?? null) ||
    (existing.provider_transaction_id ?? null) !==
      (write.provider_transaction_id ?? null) ||
    (existing.provider_original_transaction_id ?? null) !==
      (write.provider_original_transaction_id ?? null) ||

    (existing.product_id ?? null) !== (write.product_id ?? null) ||
    (existing.provider_price_id ?? null) !==
      (write.provider_price_id ?? null) ||

    (existing.environment ?? null) !== (write.environment ?? null) ||
    (existing.status ?? null) !== (write.status ?? null) ||
    (existing.current_period_start ?? null) !==
      (write.current_period_start ?? null) ||
    (existing.current_period_end ?? null) !==
      (write.current_period_end ?? null) ||
    (existing.cancel_at_period_end ?? null) !==
      (write.cancel_at_period_end ?? null) ||
    (existing.canceled_at ?? null) !== (write.canceled_at ?? null) ||
    (existing.ended_at ?? null) !== (write.ended_at ?? null)
  );
}

function applyExactFilter<T>(
  query: T,
  column: string,
  value: string | boolean | null | undefined,
): T {
  const filterable = query as unknown as FilterableQuery;

  if (value == null) {
    return filterable.is(column, null) as T;
  }

  return filterable.eq(column, value) as T;
}

function isMissingEntitlementEventsTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const maybe = error as { code?: string; message?: unknown };

  return (
    maybe.code === "PGRST205" &&
    String(maybe.message ?? "").includes("public.entitlement_events")
  );
}

async function hasProcessedEntitlementEvent(
  supabase: DBClient,
  eventId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("entitlement_events")
    .select("event_id")
    .eq("provider", STRIPE_PROVIDER)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    if (isMissingEntitlementEventsTable(error)) {
      console.warn(
        "stripe-webhook entitlement_events table missing; skipping processed check",
        error,
      );
      return false;
    }

    throw error;
  }

  return !!data?.event_id;
}

function isDuplicateEventInsertError(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code ?? "";
  const message = String((error as { message?: string } | null)?.message ?? "")
    .toLowerCase();

  return (
    code === "23505" ||
    message.includes("duplicate key") ||
    message.includes("unique constraint")
  );
}

async function markEntitlementEventProcessed(params: {
  supabase: DBClient;
  event: StripeWebhookEvent;
  userId: string;
}): Promise<boolean> {
  const { error } = await params.supabase.from("entitlement_events").insert({
    provider: STRIPE_PROVIDER,
    event_type: params.event.type,
    event_id: params.event.id,
    user_id: params.userId,
    payload: params.event as unknown as Json,
  });

  if (!error) return true;
  if (isDuplicateEventInsertError(error)) return false;

  if (isMissingEntitlementEventsTable(error)) {
    console.warn(
      "stripe-webhook entitlement_events table missing; skipping processed mark",
      error,
    );
    return true;
  }

  throw error;
}

async function getSharedSubscriptionByProviderSubscriptionId(params: {
  supabase: DBClient;
  providerSubscriptionId: string | null;
}): Promise<ExistingSubscriptionRow | null> {
  if (!params.providerSubscriptionId) return null;

  const selectClause =
    "app_id,user_id,provider,customer_id,subscription_id,price_id,provider_customer_id,provider_subscription_id,provider_transaction_id,provider_original_transaction_id,product_id,provider_price_id,environment,status,current_period_start,current_period_end,cancel_at_period_end,canceled_at,ended_at,metadata,raw_payload";

  const byProviderSubscriptionId = await params.supabase
    .from(SUBSCRIPTIONS_TABLE)
    .select(selectClause)
    .eq("app_id", APP_ID)
    .eq("provider", STRIPE_PROVIDER)
    .eq("provider_subscription_id", params.providerSubscriptionId)
    .maybeSingle();

  if (byProviderSubscriptionId.error) throw byProviderSubscriptionId.error;
  if (byProviderSubscriptionId.data) {
    return (byProviderSubscriptionId.data as ExistingSubscriptionRow | null) ??
      null;
  }

  const byLegacySubscriptionId = await params.supabase
    .from(SUBSCRIPTIONS_TABLE)
    .select(selectClause)
    .eq("app_id", APP_ID)
    .eq("provider", STRIPE_PROVIDER)
    .eq("subscription_id", params.providerSubscriptionId)
    .maybeSingle();

  if (byLegacySubscriptionId.error) throw byLegacySubscriptionId.error;
  return (byLegacySubscriptionId.data as ExistingSubscriptionRow | null) ?? null;
}

async function getSharedSubscriptionByProviderCustomerId(params: {
  supabase: DBClient;
  providerCustomerId: string | null;
}): Promise<ExistingSubscriptionRow | null> {
  if (!params.providerCustomerId) return null;

  const selectClause =
    "app_id,user_id,provider,customer_id,subscription_id,price_id,provider_customer_id,provider_subscription_id,provider_transaction_id,provider_original_transaction_id,product_id,provider_price_id,environment,status,current_period_start,current_period_end,cancel_at_period_end,canceled_at,ended_at,metadata,raw_payload";

  const byProviderCustomerId = await params.supabase
    .from(SUBSCRIPTIONS_TABLE)
    .select(selectClause)
    .eq("app_id", APP_ID)
    .eq("provider", STRIPE_PROVIDER)
    .eq("provider_customer_id", params.providerCustomerId)
    .order("current_period_end", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (byProviderCustomerId.error) throw byProviderCustomerId.error;
  if (byProviderCustomerId.data) {
    return (byProviderCustomerId.data as ExistingSubscriptionRow | null) ??
      null;
  }

  const byLegacyCustomerId = await params.supabase
    .from(SUBSCRIPTIONS_TABLE)
    .select(selectClause)
    .eq("app_id", APP_ID)
    .eq("provider", STRIPE_PROVIDER)
    .eq("customer_id", params.providerCustomerId)
    .order("current_period_end", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (byLegacyCustomerId.error) throw byLegacyCustomerId.error;
  return (byLegacyCustomerId.data as ExistingSubscriptionRow | null) ?? null;
}

async function getSharedSubscriptionForUpsert(params: {
  supabase: DBClient;
  providerSubscriptionId: string | null;
  providerCustomerId: string | null;
}): Promise<ExistingSubscriptionRow | null> {
  const bySubscriptionId = await getSharedSubscriptionByProviderSubscriptionId({
    supabase: params.supabase,
    providerSubscriptionId: params.providerSubscriptionId,
  });

  if (bySubscriptionId) return bySubscriptionId;

  if (params.providerSubscriptionId) {
    return null;
  }

  return await getSharedSubscriptionByProviderCustomerId({
    supabase: params.supabase,
    providerCustomerId: params.providerCustomerId,
  });
}

async function resolveUserByStripeLinkage(params: {
  supabase: DBClient;
  metadataSupabaseUserId?: string | null;
  metadataUserId?: string | null;
  clientReferenceId?: string | null;
  providerSubscriptionId?: string | null;
  providerCustomerId?: string | null;
  email?: string | null;
}): Promise<string | null> {
  if (isUuid(params.metadataSupabaseUserId)) {
    return params.metadataSupabaseUserId;
  }

  if (isUuid(params.metadataUserId)) {
    return params.metadataUserId;
  }

  if (isUuid(params.clientReferenceId)) {
    return params.clientReferenceId;
  }

  if (params.providerSubscriptionId) {
    const row = await getSharedSubscriptionByProviderSubscriptionId({
      supabase: params.supabase,
      providerSubscriptionId: params.providerSubscriptionId,
    });

    if (isUuid(row?.user_id)) return row.user_id;
  }

  if (params.providerCustomerId) {
    const profileUserId = await resolveUserIdByProfileStripeCustomerId(
      params.supabase,
      params.providerCustomerId,
    );

    if (profileUserId) return profileUserId;

    const row = await getSharedSubscriptionByProviderCustomerId({
      supabase: params.supabase,
      providerCustomerId: params.providerCustomerId,
    });

    if (isUuid(row?.user_id)) return row.user_id;
  }

  const byEmail = await resolveUserIdByProfileEmail(
    params.supabase,
    params.email ?? null,
  );
  if (byEmail) return byEmail;

  return null;
}

async function recomputeAndPersistEntitlement(
  supabase: DBClient,
  userId: string,
): Promise<EntitlementSnapshot> {
  const { data, error } = await supabase
    .from(SUBSCRIPTIONS_TABLE)
    .select("status,current_period_end,provider")
    .eq("app_id", APP_ID)
    .eq("user_id", userId);

  if (error) throw error;

  const entitlement = deriveEntitlementFromSubscriptions(
    (data ?? []) as Array<
      Pick<
        CanonicalSubscriptionRow,
        "status" | "current_period_end" | "provider"
      >
    >,
  );

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      premium_status: entitlement.status,
      premium_expires_at: entitlement.expires_at,
      premium_source: entitlement.source,
    })
    .eq("id", userId);

  if (profileError) throw profileError;

  return entitlement;
}

async function finalizeSubscriptionProcessing(params: {
  supabase: DBClient;
  userId: string;
  event: StripeWebhookEvent;
  shouldRecomputeBeforeFinalMark: boolean;
}): Promise<boolean> {
  if (params.shouldRecomputeBeforeFinalMark) {
    try {
      await recomputeAndPersistEntitlement(params.supabase, params.userId);
    } catch (error) {
      console.warn("stripe-webhook entitlement recompute skipped", error);
    }
  }

  return await markEntitlementEventProcessed({
    supabase: params.supabase,
    event: params.event,
    userId: params.userId,
  });
}

async function upsertSharedSubscriptionMonotonic(params: {
  supabase: DBClient;
  event: StripeWebhookEvent;
  userId: string;
  providerCustomerId: string | null;
  providerSubscriptionId: string;
  providerTransactionId?: string | null;
  providerOriginalTransactionId?: string | null;
  productId?: string | null;
  providerPriceId?: string | null;
  environment: BillingEnvironment;
  status?: SharedSubscriptionStatus | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean | null;
  canceledAt?: string | null;
  endedAt?: string | null;
  metadata?: unknown;
  rawPayload: unknown;
}): Promise<UpsertSharedSubscriptionMonotonicResult> {
  const incomingFreshness = deriveIncomingFreshness(
    params.rawPayload,
    params.event,
  );

  const rawPayloadWithFreshness = attachStripeFreshnessToRawPayload(
    params.rawPayload,
    params.event,
  );

  for (let attempt = 0; attempt < MAX_MONOTONIC_RETRIES; attempt++) {
    const existing = await getSharedSubscriptionForUpsert({
      supabase: params.supabase,
      providerSubscriptionId: params.providerSubscriptionId,
      providerCustomerId: params.providerCustomerId,
    });

    if (existing?.user_id != null && existing.user_id !== params.userId) {
      throw new Error("Stripe subscription ownership mismatch");
    }

    const resolvedProviderCustomerId = params.providerCustomerId ??
      existing?.provider_customer_id ?? existing?.customer_id ?? null;

    if (!resolvedProviderCustomerId) {
      throw new Error("Stripe subscription missing customer id");
    }

    const write = mapStripeSubscription({
      userId: params.userId,
      providerCustomerId: resolvedProviderCustomerId,
      providerSubscriptionId: params.providerSubscriptionId,
      providerTransactionId: params.providerTransactionId ??
        existing?.provider_transaction_id ??
        null,
      providerOriginalTransactionId: params.providerOriginalTransactionId ??
        existing?.provider_original_transaction_id ??
        existing?.subscription_id ??
        params.providerSubscriptionId,
      productId: params.productId ?? existing?.product_id ?? null,
      providerPriceId: params.providerPriceId ?? existing?.provider_price_id ??
        existing?.price_id ??
        null,
      environment: params.environment,
      status: params.status ?? existing?.status ?? "revoked",
      currentPeriodStart: params.currentPeriodStart ??
        existing?.current_period_start ?? null,
      currentPeriodEnd: params.currentPeriodEnd ??
        existing?.current_period_end ?? null,
      cancelAtPeriodEnd: typeof params.cancelAtPeriodEnd === "boolean"
        ? params.cancelAtPeriodEnd
        : (existing?.cancel_at_period_end ?? null),
      canceledAt: params.canceledAt ?? existing?.canceled_at ?? null,
      endedAt: params.endedAt ?? existing?.ended_at ?? null,
      metadata: params.metadata ?? existing?.metadata ?? null,
      rawPayload: rawPayloadWithFreshness,
    });

    if (existing) {
      const persistedFreshness = derivePersistedFreshness(existing.raw_payload);
      const freshnessComparison = compareStripeFreshness(
        incomingFreshness,
        persistedFreshness,
      );

      if (freshnessComparison < 0) {
        return {
          stateChanged: false,
          shouldRecomputeBeforeFinalMark:
            persistedFreshness.event_id === params.event.id,
        };
      }

      if (freshnessComparison === 0) {
        if (doesExistingSubscriptionDifferFromWrite(existing, write)) {
          throw new Error(
            "Ambiguous equal-freshness Stripe subscription update",
          );
        }

        return {
          stateChanged: false,
          shouldRecomputeBeforeFinalMark:
            persistedFreshness.event_id === params.event.id,
        };
      }
    }

    if (!existing) {
      const { error } = await params.supabase
        .from(SUBSCRIPTIONS_TABLE)
        .insert({
          ...write,
          created_at: write.updated_at ?? isoNow(),
        });

      if (!error) {
        return {
          stateChanged: true,
          shouldRecomputeBeforeFinalMark: true,
        };
      }

      if (isDuplicateEventInsertError(error)) {
        const latest = await getSharedSubscriptionForUpsert({
          supabase: params.supabase,
          providerSubscriptionId: params.providerSubscriptionId,
          providerCustomerId: resolvedProviderCustomerId,
        });

        if (!latest) continue;

        if (latest.user_id != null && latest.user_id !== params.userId) {
          throw new Error("Stripe subscription ownership mismatch");
        }

        const latestFreshness = derivePersistedFreshness(latest.raw_payload);
        const latestComparison = compareStripeFreshness(
          incomingFreshness,
          latestFreshness,
        );

        if (latestComparison < 0) {
          return {
            stateChanged: false,
            shouldRecomputeBeforeFinalMark:
              latestFreshness.event_id === params.event.id,
          };
        }

        if (latestComparison === 0) {
          if (doesExistingSubscriptionDifferFromWrite(latest, write)) {
            throw new Error(
              "Ambiguous equal-freshness Stripe subscription update",
            );
          }

          return {
            stateChanged: false,
            shouldRecomputeBeforeFinalMark:
              latestFreshness.event_id === params.event.id,
          };
        }

        continue;
      }

      throw error;
    }

    let query = params.supabase
      .from(SUBSCRIPTIONS_TABLE)
      .update(write as Database["public"]["Tables"]["subscriptions"]["Update"])
      .eq("app_id", APP_ID)
      .eq("provider", STRIPE_PROVIDER)
      .eq("subscription_id", existing.subscription_id);

    query = applyExactFilter(query, "app_id", existing.app_id);
    query = applyExactFilter(query, "user_id", existing.user_id);
    query = applyExactFilter(query, "provider", existing.provider);

    query = applyExactFilter(query, "customer_id", existing.customer_id);
    query = applyExactFilter(query, "subscription_id", existing.subscription_id);
    query = applyExactFilter(query, "price_id", existing.price_id);

    query = applyExactFilter(
      query,
      "provider_customer_id",
      existing.provider_customer_id,
    );
    query = applyExactFilter(
      query,
      "provider_subscription_id",
      existing.provider_subscription_id,
    );
    query = applyExactFilter(
      query,
      "provider_transaction_id",
      existing.provider_transaction_id,
    );
    query = applyExactFilter(
      query,
      "provider_original_transaction_id",
      existing.provider_original_transaction_id,
    );
    query = applyExactFilter(query, "product_id", existing.product_id);
    query = applyExactFilter(
      query,
      "provider_price_id",
      existing.provider_price_id,
    );
    query = applyExactFilter(query, "environment", existing.environment);
    query = applyExactFilter(query, "status", existing.status);
    query = applyExactFilter(
      query,
      "current_period_start",
      existing.current_period_start,
    );
    query = applyExactFilter(
      query,
      "current_period_end",
      existing.current_period_end,
    );
    query = applyExactFilter(
      query,
      "cancel_at_period_end",
      existing.cancel_at_period_end,
    );
    query = applyExactFilter(query, "canceled_at", existing.canceled_at);
    query = applyExactFilter(query, "ended_at", existing.ended_at);

    const { data, error } = await query
      .select("provider_subscription_id")
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (
      (data as { provider_subscription_id?: string | null } | null)
        ?.provider_subscription_id
    ) {
      return {
        stateChanged: true,
        shouldRecomputeBeforeFinalMark: true,
      };
    }

    const latest = await getSharedSubscriptionForUpsert({
      supabase: params.supabase,
      providerSubscriptionId: params.providerSubscriptionId,
      providerCustomerId: resolvedProviderCustomerId,
    });

    if (!latest) {
      continue;
    }

    if (latest.user_id != null && latest.user_id !== params.userId) {
      throw new Error("Stripe subscription ownership mismatch");
    }

    const latestFreshness = derivePersistedFreshness(latest.raw_payload);
    const latestComparison = compareStripeFreshness(
      incomingFreshness,
      latestFreshness,
    );

    if (latestComparison < 0) {
      return {
        stateChanged: false,
        shouldRecomputeBeforeFinalMark:
          latestFreshness.event_id === params.event.id,
      };
    }

    if (latestComparison === 0) {
      if (doesExistingSubscriptionDifferFromWrite(latest, write)) {
        throw new Error(
          "Ambiguous equal-freshness Stripe subscription update",
        );
      }

      return {
        stateChanged: false,
        shouldRecomputeBeforeFinalMark:
          latestFreshness.event_id === params.event.id,
      };
    }
  }

  throw new Error(
    "Failed to apply monotonic Stripe subscription update after concurrent modifications",
  );
}

/* ============================================================================
 * Request handler
 * ========================================================================== */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return ok200();

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const webhookSecrets = getStripeWebhookSecrets();
  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getServiceRoleKey();

  const serviceKeyPayload = decodeJwtPayload(serviceKey);
  logWebhook("info", "runtime supabase target", {
    supabase_url: supabaseUrl || null,
    service_role_ref: serviceKeyPayload?.ref ?? null,
    service_role_role: serviceKeyPayload?.role ?? null,
  });

  if (!webhookSecrets.length) {
    return json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, 500);
  }

  if (!supabaseUrl || !serviceKey) {
    return json(
      {
        error:
          "Missing hosted Supabase config (PROJECT_SUPABASE_URL/VITE_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or PROJECT_SUPABASE_SERVICE_ROLE_KEY)",
      },
      500,
    );
  }

  const signatureHeader = req.headers.get("stripe-signature");
  if (!signatureHeader) {
    return json({ error: "Missing signature" }, 400);
  }

  const rawBuf = await req.arrayBuffer();
  const rawBytes = new Uint8Array(rawBuf);

  try {
    let verified = false;
    let lastError: unknown = null;

    for (const webhookSecret of webhookSecrets) {
      try {
        await verifyStripeSignatureOrThrow({
          rawBodyBytes: rawBytes,
          sigHeader: signatureHeader,
          webhookSecret,
        });
        verified = true;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!verified) {
      throw lastError ?? new Error("Stripe signature mismatch");
    }
  } catch (error) {
    logWebhook("warn", "invalid stripe signature", {
      details: error instanceof Error ? error.message : String(error),
    });
    return json({ error: "Invalid signature" }, 400);
  }

  let event: StripeWebhookEvent;

  try {
    const rawText = new TextDecoder().decode(rawBytes);
    event = JSON.parse(rawText) as StripeWebhookEvent;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!event?.id) {
    return json({ error: "Stripe event missing id" }, 400);
  }

  if (!isSupportedEventType(event.type)) {
    return ok200();
  }

  logWebhook("info", "received stripe webhook", {
    event_id: event.id,
    event_type: event.type,
    livemode: typeof event.livemode === "boolean" ? event.livemode : null,
  });

  const supabase = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    const alreadyProcessedStripeWebhookEvent =
      await hasProcessedStripeWebhookEvent(
        supabase,
        event.id,
      );

    if (alreadyProcessedStripeWebhookEvent) {
      logWebhook("info", "stripe event replay skipped", {
        event_id: event.id,
        event_type: event.type,
        action: "skip_replayed_event",
      });
      return ok200();
    }

    const alreadyProcessed = await hasProcessedEntitlementEvent(
      supabase,
      event.id,
    );

    if (alreadyProcessed) {
      logWebhook("info", "entitlement event already processed", {
        event_id: event.id,
        event_type: event.type,
        action: "skip_already_processed",
      });
      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    const environment = stripeEnvironmentFromEvent(event);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as CheckoutSessionLike;

      const mode = asLowerNonEmptyStringOrNull(session?.mode);
      const sessionStatus = asLowerNonEmptyStringOrNull(session?.status);
      const paymentStatus = asLowerNonEmptyStringOrNull(
        session?.payment_status,
      );

      if (
        mode !== "subscription" ||
        sessionStatus !== "complete" ||
        (paymentStatus !== "paid" && paymentStatus !== "no_payment_required")
      ) {
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const providerCustomerId = asNonEmptyStringOrNull(session?.customer);
      const providerSubscriptionId = asNonEmptyStringOrNull(
        session?.subscription,
      );
      const checkoutEmail = resolveCheckoutCustomerEmail(session);

      const userId = await resolveUserByStripeLinkage({
        supabase,
        metadataSupabaseUserId: session?.metadata?.supabase_user_id ?? null,
        metadataUserId: session?.metadata?.user_id ?? null,
        clientReferenceId: session?.client_reference_id ?? null,
        providerSubscriptionId,
        providerCustomerId,
        email: checkoutEmail,
      });

      if (!userId) {
        throw new NonRetryableWebhookError(
          "checkout.session.completed user resolution failed",
        );
      }

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId,
      });

      if (!providerSubscriptionId) {
        throw new NonRetryableWebhookError(
          "checkout.session.completed missing subscription id",
        );
      }

      const stripeSubscription = await fetchStripeSubscriptionById(
        providerSubscriptionId,
      );
      if (!stripeSubscription) {
        logWebhook("warn", "stripe subscription fetch failed during checkout", {
          event_id: event.id,
          providerSubscriptionId,
        });
      }

      const checkoutCurrentPeriodStart = toIsoFromUnix(
        stripeSubscription?.current_period_start,
      );
      const checkoutCurrentPeriodEnd = toIsoFromUnix(
        stripeSubscription?.current_period_end,
      );
      const checkoutStatus = stripeSubscription
        ? normalizeStripeSubscriptionStatus({
            value: stripeSubscription.status,
            currentPeriodEnd: checkoutCurrentPeriodEnd,
          })
        : "active";

      const existingCanonical =
        await getSharedSubscriptionByProviderSubscriptionId(
          {
            supabase,
            providerSubscriptionId,
          },
        );

      if (existingCanonical) {
        if (existingCanonical.user_id !== userId) {
          throw new Error("Stripe subscription ownership mismatch");
        }

        const didMarkProcessed = await finalizeSubscriptionProcessing({
          supabase,
          userId,
          event,
          shouldRecomputeBeforeFinalMark: false,
        });

        if (didMarkProcessed) {
          if (checkoutEmail) {
            const route = resolveEmailRoute(checkoutEmail);

            if (route) {
              const amount = typeof session.amount_total === "number"
                ? session.amount_total
                : 0;

              const currency = asNonEmptyStringOrNull(session.currency);
              const correlationId = event.id;

              const commonAuditVars = buildCommonEmailAuditVariables({
                originalTo: route.originalTo,
                forcedTo: route.forcedTo,
                correlationId,
                userId,
              });
              const planDetails = derivePlanDetails({
                providerPriceId: getCheckoutSessionPriceId(session),
                subscription: stripeSubscription,
                metadata: session?.metadata ?? stripeSubscription?.metadata ?? null,
              });

              try {
                await sendEmailOnce({
                  supabase,
                  correlationId,
                  to: route.finalTo,
                  templateKey: "receipt_subscription",
                  variables: {
                    ...commonAuditVars,
                    amount: formatMoney(amount, currency),
                    period: planDetails.period,
                    tier: planDetails.tier,
                    currency: currency ?? "",
                    amount_minor: String(amount),
                    stripe_session_id: asNonEmptyStringOrNull(session.id) ?? "",
                    stripe_subscription_id: providerSubscriptionId,
                  },
                });
              } catch {
                // best-effort
              }

              try {
                await sendEmailOnce({
                  supabase,
                  correlationId,
                  to: route.finalTo,
                  templateKey: "welcome_vip",
                  variables: {
                    ...commonAuditVars,
                    tier: planDetails.tier,
                    stripe_session_id: asNonEmptyStringOrNull(session.id) ?? "",
                    stripe_subscription_id: providerSubscriptionId,
                  },
                });
              } catch {
                // best-effort
              }
            }
          }
        }

        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId,
        providerSubscriptionId,
        providerTransactionId: asNonEmptyStringOrNull(session?.id),
        providerOriginalTransactionId: providerSubscriptionId,
        productId: getSubscriptionProductId(stripeSubscription),
        providerPriceId:
          getCheckoutSessionPriceId(session) ??
          getSubscriptionPriceId(stripeSubscription),
        environment,
        status: checkoutStatus,
        currentPeriodStart: checkoutCurrentPeriodStart,
        currentPeriodEnd: checkoutCurrentPeriodEnd,
        cancelAtPeriodEnd:
          typeof stripeSubscription?.cancel_at_period_end === "boolean"
            ? stripeSubscription.cancel_at_period_end
            : null,
        canceledAt: toIsoFromUnix(stripeSubscription?.canceled_at),
        endedAt: toIsoFromUnix(stripeSubscription?.ended_at),
        metadata: session?.metadata ?? stripeSubscription?.metadata ?? null,
        rawPayload: stripeSubscription ?? session,
      });

      const didMarkProcessed = await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      if (didMarkProcessed) {
        if (checkoutEmail) {
          const route = resolveEmailRoute(checkoutEmail);

          if (route) {
            const amount = typeof session.amount_total === "number"
              ? session.amount_total
              : 0;

            const currency = asNonEmptyStringOrNull(session.currency);
            const correlationId = event.id;

            const commonAuditVars = buildCommonEmailAuditVariables({
              originalTo: route.originalTo,
              forcedTo: route.forcedTo,
              correlationId,
              userId,
            });
            const planDetails = derivePlanDetails({
              providerPriceId: getCheckoutSessionPriceId(session),
              subscription: stripeSubscription,
              metadata: session?.metadata ?? stripeSubscription?.metadata ?? null,
            });

            try {
              await sendEmailOnce({
                supabase,
                correlationId,
                to: route.finalTo,
                templateKey: "receipt_subscription",
                variables: {
                  ...commonAuditVars,
                  amount: formatMoney(amount, currency),
                  period: planDetails.period,
                  tier: planDetails.tier,
                  currency: currency ?? "",
                  amount_minor: String(amount),
                  stripe_session_id: asNonEmptyStringOrNull(session.id) ?? "",
                  stripe_subscription_id: providerSubscriptionId,
                },
              });
            } catch {
              // best-effort
            }

            try {
              await sendEmailOnce({
                supabase,
                correlationId,
                to: route.finalTo,
                templateKey: "welcome_vip",
                variables: {
                  ...commonAuditVars,
                  tier: planDetails.tier,
                  stripe_session_id: asNonEmptyStringOrNull(session.id) ?? "",
                  stripe_subscription_id: providerSubscriptionId,
                },
              });
            } catch {
              // best-effort
            }
          }
        }
      }

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as InvoiceLike;
      const providerTransactionId = asNonEmptyStringOrNull(invoice?.id);
      const providerSubscriptionId = asNonEmptyStringOrNull(
        invoice?.subscription,
      );
      const providerCustomerId = asNonEmptyStringOrNull(invoice?.customer);
      const invoiceEmail = asNonEmptyStringOrNull(invoice?.customer_email) ??
        asNonEmptyStringOrNull(invoice?.customer_details?.email);

      if (!providerSubscriptionId) {
        logWebhook("warn", "missing subscription id", {
          event_id: event.id,
          event_type: event.type,
        });
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const { userId, stripeSubscription } = await resolveUserForInvoiceEvent({
        supabase,
        providerSubscriptionId,
        providerCustomerId,
        invoiceEmail,
      });

      if (!userId) {
        throw new NonRetryableWebhookError("invoice.paid user resolution failed");
      }

      const resolvedProviderCustomerId =
        providerCustomerId ??
        asNonEmptyStringOrNull(stripeSubscription?.customer);

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId: resolvedProviderCustomerId,
      });

      const period = getInvoicePeriodRange(invoice);
      const fallbackCurrentPeriodStart = toIsoFromUnix(
        stripeSubscription?.current_period_start,
      );
      const fallbackCurrentPeriodEnd = toIsoFromUnix(
        stripeSubscription?.current_period_end,
      );

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId: resolvedProviderCustomerId,
        providerSubscriptionId,
        providerTransactionId,
        providerOriginalTransactionId: providerSubscriptionId,
        productId:
          getInvoiceProductId(invoice) ??
          getSubscriptionProductId(stripeSubscription),
        providerPriceId:
          getInvoicePriceId(invoice) ??
          getSubscriptionPriceId(stripeSubscription),
        environment,
        status: "active",
        currentPeriodStart:
          period.currentPeriodStart ?? fallbackCurrentPeriodStart,
        currentPeriodEnd:
          period.currentPeriodEnd ?? fallbackCurrentPeriodEnd,
        metadata: stripeSubscription?.metadata ?? null,
        rawPayload: attachInvoiceLookupPayload(invoice, stripeSubscription),
      });

      const didMarkProcessed = await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      if (didMarkProcessed) {
        const customerEmail = await resolveInvoiceCustomerEmail({
          supabase,
          invoice,
          userId,
        });

        if (customerEmail) {
          const route = resolveEmailRoute(customerEmail);

          if (route) {
            const amountMinor = typeof invoice.amount_paid === "number"
              ? invoice.amount_paid
              : typeof invoice.amount_due === "number"
              ? invoice.amount_due
              : 0;

            const currency = asNonEmptyStringOrNull(invoice.currency);
            const correlationId = event.id;

            const commonAuditVars = buildCommonEmailAuditVariables({
              originalTo: route.originalTo,
              forcedTo: route.forcedTo,
              correlationId,
              userId,
            });
            const planDetails = derivePlanDetails({
              providerPriceId: getInvoicePriceId(invoice) ??
                getSubscriptionPriceId(stripeSubscription),
              subscription: stripeSubscription,
              invoice,
              metadata: stripeSubscription?.metadata ?? null,
            });

            try {
              await sendEmailOnce({
                supabase,
                correlationId,
                to: route.finalTo,
                templateKey: "receipt_subscription",
                variables: {
                  ...commonAuditVars,
                  amount: formatMoney(amountMinor, currency),
                  period: planDetails.period,
                  tier: planDetails.tier,
                  currency: currency ?? "",
                  amount_minor: String(amountMinor),
                  stripe_session_id: "",
                  stripe_subscription_id: providerSubscriptionId,
                },
              });
            } catch {
              // best-effort
            }
          }
        }
      }

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as InvoiceLike;
      const providerTransactionId = asNonEmptyStringOrNull(invoice?.id);
      const providerSubscriptionId = asNonEmptyStringOrNull(
        invoice?.subscription,
      );
      const providerCustomerId = asNonEmptyStringOrNull(invoice?.customer);
      const invoiceEmail = asNonEmptyStringOrNull(invoice?.customer_email) ??
        asNonEmptyStringOrNull(invoice?.customer_details?.email);

      if (!providerSubscriptionId) {
        logWebhook("warn", "missing subscription id", {
          event_id: event.id,
          event_type: event.type,
        });
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const { userId, stripeSubscription } = await resolveUserForInvoiceEvent({
        supabase,
        providerSubscriptionId,
        providerCustomerId,
        invoiceEmail,
      });

      if (!userId) {
        throw new NonRetryableWebhookError(
          "invoice.payment_failed user resolution failed",
        );
      }

      const resolvedProviderCustomerId =
        providerCustomerId ??
        asNonEmptyStringOrNull(stripeSubscription?.customer);

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId: resolvedProviderCustomerId,
      });

      const period = getInvoicePeriodRange(invoice);
      const fallbackCurrentPeriodStart = toIsoFromUnix(
        stripeSubscription?.current_period_start,
      );
      const fallbackCurrentPeriodEnd = toIsoFromUnix(
        stripeSubscription?.current_period_end,
      );

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId: resolvedProviderCustomerId,
        providerSubscriptionId,
        providerTransactionId,
        providerOriginalTransactionId: providerSubscriptionId,
        productId:
          getInvoiceProductId(invoice) ??
          getSubscriptionProductId(stripeSubscription),
        providerPriceId:
          getInvoicePriceId(invoice) ??
          getSubscriptionPriceId(stripeSubscription),
        environment,
        status: "past_due",
        currentPeriodStart:
          period.currentPeriodStart ?? fallbackCurrentPeriodStart,
        currentPeriodEnd:
          period.currentPeriodEnd ?? fallbackCurrentPeriodEnd,
        metadata: stripeSubscription?.metadata ?? null,
        rawPayload: attachInvoiceLookupPayload(invoice, stripeSubscription),
      });

      await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as SubscriptionLike;
      const providerSubscriptionId = asNonEmptyStringOrNull(subscription?.id);
      const providerCustomerId = asNonEmptyStringOrNull(subscription?.customer);

      if (!providerSubscriptionId) {
        logWebhook("warn", "missing subscription id", {
          event_id: event.id,
          event_type: event.type,
        });
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const userId = await resolveUserByStripeLinkage({
        supabase,
        metadataSupabaseUserId: subscription?.metadata?.supabase_user_id ?? null,
        metadataUserId: subscription?.metadata?.user_id ?? null,
        providerSubscriptionId,
        providerCustomerId,
        email: subscription?.metadata?.email ?? null,
      });

      if (!userId) {
        throw new NonRetryableWebhookError(
          `${event.type} user resolution failed`,
        );
      }

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId,
      });

      const currentPeriodEnd = toIsoFromUnix(subscription?.current_period_end);

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId,
        providerSubscriptionId,
        providerTransactionId: providerSubscriptionId,
        providerOriginalTransactionId: providerSubscriptionId,
        productId: getSubscriptionProductId(subscription),
        providerPriceId: getSubscriptionPriceId(subscription),
        environment,
        status: normalizeStripeSubscriptionStatus({
          value: subscription?.status,
          currentPeriodEnd,
        }),
        currentPeriodStart: toIsoFromUnix(subscription?.current_period_start),
        currentPeriodEnd,
        cancelAtPeriodEnd:
          typeof subscription?.cancel_at_period_end === "boolean"
            ? subscription.cancel_at_period_end
            : null,
        canceledAt: toIsoFromUnix(subscription?.canceled_at),
        endedAt: toIsoFromUnix(subscription?.ended_at),
        metadata: subscription?.metadata ?? null,
        rawPayload: subscription,
      });

      await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as SubscriptionLike;
      const providerSubscriptionId = asNonEmptyStringOrNull(subscription?.id);
      const providerCustomerId = asNonEmptyStringOrNull(subscription?.customer);

      if (!providerSubscriptionId) {
        logWebhook("warn", "missing subscription id", {
          event_id: event.id,
          event_type: event.type,
        });
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const userId = await resolveUserByStripeLinkage({
        supabase,
        metadataSupabaseUserId: subscription?.metadata?.supabase_user_id ?? null,
        metadataUserId: subscription?.metadata?.user_id ?? null,
        providerSubscriptionId,
        providerCustomerId,
        email: subscription?.metadata?.email ?? null,
      });

      if (!userId) {
        throw new NonRetryableWebhookError(
          "customer.subscription.deleted user resolution failed",
        );
      }

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId,
      });

      const currentPeriodEnd = toIsoFromUnix(subscription?.current_period_end);
      const endedAt = toIsoFromUnix(subscription?.ended_at) ?? isoNow();

      const status: SharedSubscriptionStatus = "canceled";

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId,
        providerSubscriptionId,
        providerTransactionId: providerSubscriptionId,
        providerOriginalTransactionId: providerSubscriptionId,
        productId: getSubscriptionProductId(subscription),
        providerPriceId: getSubscriptionPriceId(subscription),
        environment,
        status,
        currentPeriodStart: toIsoFromUnix(subscription?.current_period_start),
        currentPeriodEnd,
        cancelAtPeriodEnd:
          typeof subscription?.cancel_at_period_end === "boolean"
            ? subscription.cancel_at_period_end
            : true,
        canceledAt: toIsoFromUnix(subscription?.canceled_at) ?? endedAt,
        endedAt,
        metadata: subscription?.metadata ?? null,
        rawPayload: subscription,
      });

      await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    await markStripeWebhookEventProcessed(supabase, event);
    return ok200();
  } catch (error: unknown) {
    const details =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : typeof error === "object" && error !== null
          ? JSON.parse(JSON.stringify(error))
          : { message: String(error) };

    logWebhook("error", "webhook processing failed", {
      event_id: event?.id ?? null,
      event_type: event?.type ?? null,
      details,
    });

    try {
      await upsertStripeWebhookEventResult({
        supabase,
        event,
        processed: error instanceof NonRetryableWebhookError,
        errorMessage: error instanceof Error
          ? error.message
          : String(error ?? "unknown error"),
      });
    } catch {
      // best-effort only
    }

    if (error instanceof NonRetryableWebhookError) {
      return ok200();
    }

    return json({ error: "Webhook processing failed" }, 500);
  }
});