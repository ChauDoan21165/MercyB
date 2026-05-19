// supabase/functions/stripe-webhook/core.ts

import { sendEmail } from "../_shared/sendEmail.ts";
import { parseWebhookSecrets } from "./stripe-signature.ts";
import type {
  BillingEnvironment,
  BillingProvider,
  CanonicalSubscriptionRow,
  CheckoutSessionLike,
  DBClient,
  EmailRoute,
  EntitlementSnapshot,
  InvoiceLike,
  Json,
  StripeObjectMetadata,
  StripeWebhookEvent,
  SubscriptionLike,
} from "./types.ts";

/* ============================================================================
 * Config / constants
 * ========================================================================== */

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const OUTBOX_SUCCESS_STATUSES = ["sent", "delivered"] as const;
export const STRIPE_PROVIDER: BillingProvider = "stripe";

export class NonRetryableWebhookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NonRetryableWebhookError";
  }
}

export function logWebhook(
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

export const ok200 = () =>
  new Response("ok", {
    status: 200,
    headers: corsHeaders,
  });

export function json(payload: unknown, status = 200) {
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

export function env(key: string): string {
  return (Deno.env.get(key) ?? "").trim();
}

export function envRaw(key: string): string {
  return Deno.env.get(key) ?? "";
}

export function getSupabaseUrl(): string {
  const configured = env("PROJECT_SUPABASE_URL") ||
    env("VITE_SUPABASE_URL") ||
    env("NEXT_PUBLIC_SUPABASE_URL");

  return configured ? configured.replace(/\/+$/, "") : "";
}

export function getServiceRoleKey(): string {
  return env("PROJECT_SUPABASE_SERVICE_ROLE_KEY");
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
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

export function getStripeSecretKey(): string {
  return env("STRIPE_SECRET_KEY") ||
    env("SECRET_STRIPE_KEY") ||
    env("STRIPE_API_KEY");
}

export function getStripeWebhookSecrets(): string[] {
  const candidates = [
    envRaw("STRIPE_WEBHOOK_SECRET"),
    envRaw("SECRET_STRIPE_WEBHOOK_SECRET"),
    envRaw("STRIPE_SIGNING_SECRET"),
    envRaw("STRIPE_WEBHOOK_SIGNING_SECRET"),
  ];

  const parsed = candidates.flatMap((value) => parseWebhookSecrets(value));
  return [...new Set(parsed)];
}

export function isoNow(): string {
  return new Date().toISOString();
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(value)
  );
}

export function asNonEmptyStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function asLowerNonEmptyStringOrNull(value: unknown): string | null {
  const v = asNonEmptyStringOrNull(value);
  return v ? v.toLowerCase() : null;
}

export function toIsoFromUnix(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return new Date(value * 1000).toISOString();
}

export function toMillis(value: string | null | undefined): number {
  if (!value) return Number.NEGATIVE_INFINITY;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : Number.NEGATIVE_INFINITY;
}

export function isEntitlingSubscription(
  subscription: Pick<CanonicalSubscriptionRow, "status" | "current_period_end">,
): boolean {
  return (
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    subscription.status === "grace_period" ||
    subscription.status === "past_due"
  );
}

export function deriveEntitlementFromSubscriptions(
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

/* ============================================================================
 * Email helpers
 * ========================================================================== */

// Stripe zero-decimal currencies: `unit_amount` is already the full amount,
// NOT minor units, so it must NOT be divided by 100. Dividing here produced a
// 100× understatement (e.g. a 2,000,000 VND charge rendered as "20000.00 VND").
// Source: https://docs.stripe.com/currencies#zero-decimal
const ZERO_DECIMAL_CURRENCIES = new Set<string>([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

export function formatMoney(amountMinor: number, currency?: string | null): string {
  const code = typeof currency === "string" ? currency.toUpperCase() : "";
  const amount = Number.isFinite(amountMinor) ? amountMinor : 0;
  const zeroDecimal = code !== "" && ZERO_DECIMAL_CURRENCIES.has(code);

  const fractionDigits = zeroDecimal ? 0 : 2;
  const major = zeroDecimal ? amount : amount / 100;
  const formatted = major.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return code ? `${formatted} ${code}` : `${formatted}`;
}

export function resolveEmailRoute(originalTo: string | null): EmailRoute | null {
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

export function buildCommonEmailAuditVariables(params: {
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

export async function outboxAlreadySent(
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

export async function outboxUpsertQueued(params: {
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
        app_key: "mercy_blade",
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

export async function outboxMark(params: {
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

export async function sendEmailOnce(params: {
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
      appKey: "mercy_blade",
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

export async function resolveUserIdByProfileStripeCustomerId(
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

export async function syncProfileStripeCustomerIdBestEffort(params: {
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

export async function resolveProfileEmail(
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

export async function resolveUserIdByProfileEmail(
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

export function resolveCheckoutCustomerEmail(
  session: CheckoutSessionLike,
): string | null {
  return (
    asNonEmptyStringOrNull(session?.customer_details?.email) ??
      asNonEmptyStringOrNull(session?.customer_email) ??
      asNonEmptyStringOrNull(session?.metadata?.email) ??
      null
  );
}

export async function resolveInvoiceCustomerEmail(params: {
  supabase: DBClient;
  invoice: InvoiceLike;
  userId: string;
}): Promise<string | null> {
  const direct = asNonEmptyStringOrNull(params.invoice?.customer_email) ??
    asNonEmptyStringOrNull(params.invoice?.customer_details?.email);

  if (direct) return direct;
  return await resolveProfileEmail(params.supabase, params.userId);
}

export function formatPlanPeriod(params: {
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
      return count === 12
        ? "Yearly"
        : count === 1
        ? "Monthly"
        : `Every ${count} months`;
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

export function derivePlanDetails(params: {
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
    interval:
      invoicePrice?.recurring?.interval ??
      subscriptionPrice?.recurring?.interval ??
      null,
    intervalCount:
      invoicePrice?.recurring?.interval_count ??
      subscriptionPrice?.recurring?.interval_count ??
      null,
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

export function stripeEnvironmentFromEvent(
  event: StripeWebhookEvent,
): BillingEnvironment {
  return event?.livemode ? "production" : "sandbox";
}

export function normalizeStripeSubscriptionStatus(params: {
  value: unknown;
  currentPeriodEnd?: string | null;
}): import("./types.ts").SharedSubscriptionStatus {
  const normalized = asLowerNonEmptyStringOrNull(params.value);

  switch (normalized) {
    case "active":
    case "trialing":
    case "past_due":
    case "paused":
      return normalized;

    case "unpaid":
      return "revoked";

    case "canceled":
      return "expired";

    case "incomplete":
      return "grace_period";

    case "incomplete_expired":
      return "expired";

    default:
      return "revoked";
  }
}

export function getInvoicePeriodRange(invoice: InvoiceLike): {
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

export function getInvoiceProductId(invoice: InvoiceLike): string | null {
  const firstLine = invoice?.lines?.data?.[0];
  return asNonEmptyStringOrNull(firstLine?.price?.product) ?? null;
}

export function getInvoicePriceId(invoice: InvoiceLike): string | null {
  const firstLine = invoice?.lines?.data?.[0];
  return asNonEmptyStringOrNull(firstLine?.price?.id) ?? null;
}

export function getSubscriptionProductId(
  subscription: SubscriptionLike | null | undefined,
): string | null {
  const firstItem = subscription?.items?.data?.[0];
  return asNonEmptyStringOrNull(firstItem?.price?.product) ?? null;
}

export function getSubscriptionPriceId(
  subscription: SubscriptionLike | null | undefined,
): string | null {
  const firstItem = subscription?.items?.data?.[0];
  return asNonEmptyStringOrNull(firstItem?.price?.id) ??
    asNonEmptyStringOrNull(subscription?.metadata?.price_id) ??
    null;
}

export function getCheckoutSessionPriceId(
  session: CheckoutSessionLike,
): string | null {
  return asNonEmptyStringOrNull(session?.metadata?.price_id) ?? null;
}

export async function fetchStripeSubscriptionById(
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

export function attachInvoiceLookupPayload(
  invoice: InvoiceLike,
  stripeSubscription: SubscriptionLike | null,
): unknown {
  if (!stripeSubscription) return invoice;

  return {
    ...invoice,
    __stripe_subscription_lookup: stripeSubscription,
  };
}
