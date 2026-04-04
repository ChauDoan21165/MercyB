// FILE PATH: supabase/functions/stripe-webhook/webhook-events.ts

import {
  asNonEmptyStringOrNull,
  logWebhook,
  toIsoFromUnix,
} from "./core.ts";
import {
  finalizeSubscriptionProcessing,
  resolveUserByStripeLinkage,
  resolveUserForInvoiceEvent,
  upsertSharedSubscriptionMonotonic,
} from "./billing.ts";
import type {
  BillingEnvironment,
  DBClient,
  StripeWebhookEvent,
  SubscriptionLike,
} from "./types.ts";

const DEFAULT_APP_ID = "mercy_blade";

type MarkProcessedFn = (
  supabase: DBClient,
  event: Pick<StripeWebhookEvent, "id" | "type" | "livemode">,
) => Promise<boolean>;

type WebhookHandlerParams = {
  supabase: DBClient;
  event: StripeWebhookEvent;
  environment: BillingEnvironment;
  markStripeWebhookEventProcessed: MarkProcessedFn;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function getEventObject(event: StripeWebhookEvent): Record<string, unknown> {
  return (asRecord(event?.data)?.object as Record<string, unknown>) ?? {};
}

function getMetadata(
  raw: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  return asRecord(raw?.metadata) ?? {};
}

function withDefaultAppId(
  metadata: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const base = metadata ?? {};
  return {
    ...base,
    app_id: asNonEmptyStringOrNull(base.app_id) ?? DEFAULT_APP_ID,
  };
}

function getSubscriptionId(raw: Record<string, unknown>): string | null {
  return (
    asNonEmptyStringOrNull(raw.subscription) ??
    asNonEmptyStringOrNull(raw.id)
  );
}

function getCustomerId(raw: Record<string, unknown>): string | null {
  return (
    asNonEmptyStringOrNull(raw.customer) ??
    asNonEmptyStringOrNull(raw.customer_id)
  );
}

function getFirstSubscriptionItem(
  raw: Record<string, unknown>,
): Record<string, unknown> | null {
  const items = asRecord(raw.items);
  const data = Array.isArray(items?.data) ? items.data : [];
  return asRecord(data[0]);
}

function getFirstLine(
  raw: Record<string, unknown>,
): Record<string, unknown> | null {
  const lines = asRecord(raw.lines);
  const data = Array.isArray(lines?.data) ? lines.data : [];
  return asRecord(data[0]);
}

function getPriceId(raw: Record<string, unknown>): string | null {
  const firstItem = getFirstSubscriptionItem(raw);
  const firstLine = getFirstLine(raw);
  const price =
    asRecord(firstItem?.price) ??
    asRecord(firstLine?.price);

  return (
    asNonEmptyStringOrNull(price?.id) ??
    asNonEmptyStringOrNull(raw.price_id)
  );
}

function getProductId(raw: Record<string, unknown>): string | null {
  const firstItem = getFirstSubscriptionItem(raw);
  const firstLine = getFirstLine(raw);
  const price =
    asRecord(firstItem?.price) ??
    asRecord(firstLine?.price);

  return (
    asNonEmptyStringOrNull(price?.product) ??
    asNonEmptyStringOrNull(raw.product_id)
  );
}

function getLinePeriodStart(raw: Record<string, unknown>): string | null {
  const line = getFirstLine(raw);
  const period = asRecord(line?.period);

  return toIsoFromUnix(period?.start) ?? null;
}

function getLinePeriodEnd(raw: Record<string, unknown>): string | null {
  const line = getFirstLine(raw);
  const period = asRecord(line?.period);

  return toIsoFromUnix(period?.end) ?? null;
}

function getItemCurrentPeriodStart(raw: Record<string, unknown>): string | null {
  const firstItem = getFirstSubscriptionItem(raw);

  return (
    toIsoFromUnix(firstItem?.current_period_start) ??
    null
  );
}

function getItemCurrentPeriodEnd(raw: Record<string, unknown>): string | null {
  const firstItem = getFirstSubscriptionItem(raw);

  return (
    toIsoFromUnix(firstItem?.current_period_end) ??
    null
  );
}

function getCurrentPeriodStart(raw: Record<string, unknown>): string | null {
  return (
    toIsoFromUnix(raw.current_period_start) ??
    toIsoFromUnix(raw.period_start) ??
    getItemCurrentPeriodStart(raw) ??
    getLinePeriodStart(raw) ??
    toIsoFromUnix(raw.start_date) ??
    null
  );
}

function getCurrentPeriodEnd(raw: Record<string, unknown>): string | null {
  return (
    toIsoFromUnix(raw.current_period_end) ??
    toIsoFromUnix(raw.period_end) ??
    getItemCurrentPeriodEnd(raw) ??
    getLinePeriodEnd(raw) ??
    toIsoFromUnix(raw.trial_end) ??
    null
  );
}

function getCanceledAt(raw: Record<string, unknown>): string | null {
  return toIsoFromUnix(raw.canceled_at) ?? null;
}

function getEndedAt(raw: Record<string, unknown>): string | null {
  return (
    toIsoFromUnix(raw.ended_at) ??
    toIsoFromUnix(raw.cancel_at) ??
    null
  );
}

function getCheckoutEmail(raw: Record<string, unknown>): string | null {
  const customerDetails = asRecord(raw.customer_details);
  const metadata = withDefaultAppId(getMetadata(raw));

  return (
    asNonEmptyStringOrNull(customerDetails?.email) ??
    asNonEmptyStringOrNull(raw.customer_email) ??
    asNonEmptyStringOrNull(metadata.email) ??
    null
  );
}

function getInvoiceEmail(raw: Record<string, unknown>): string | null {
  const customerDetails = asRecord(raw.customer_details);

  return (
    asNonEmptyStringOrNull(raw.customer_email) ??
    asNonEmptyStringOrNull(customerDetails?.email) ??
    null
  );
}

function normalizeSubscriptionStatus(
  rawStatus: string | null,
): "active" | "trialing" | "past_due" | "paused" | "revoked" {
  switch ((rawStatus ?? "").toLowerCase()) {
    case "trialing":
    case "trial":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "paused":
    case "pause":
      return "paused";
    case "canceled":
    case "cancelled":
    case "incomplete":
    case "incomplete_expired":
    case "expired":
    case "revoked":
      return "revoked";
    case "active":
    default:
      return "active";
  }
}

async function processSubscriptionLikeEvent(params: {
  supabase: DBClient;
  event: StripeWebhookEvent;
  environment: BillingEnvironment;
  markStripeWebhookEventProcessed: MarkProcessedFn;
  raw: Record<string, unknown>;
  status: "active" | "trialing" | "past_due" | "paused" | "revoked";
}): Promise<void> {
  const metadata = withDefaultAppId(getMetadata(params.raw));

  const providerSubscriptionId = getSubscriptionId(params.raw);
  const providerCustomerId = getCustomerId(params.raw);
  const email =
    asNonEmptyStringOrNull(metadata.email) ??
    getCheckoutEmail(params.raw);

  if (!providerSubscriptionId) {
    throw new Error("Stripe event missing subscription id");
  }

  const userId = await resolveUserByStripeLinkage({
    supabase: params.supabase,
    metadataSupabaseUserId:
      asNonEmptyStringOrNull(metadata.supabase_user_id),
    metadataUserId: asNonEmptyStringOrNull(metadata.user_id),
    clientReferenceId: asNonEmptyStringOrNull(params.raw.client_reference_id),
    providerSubscriptionId,
    providerCustomerId,
    email,
  });

  if (!userId) {
    throw new Error("Could not resolve user for Stripe subscription event");
  }

  const result = await upsertSharedSubscriptionMonotonic({
    supabase: params.supabase,
    event: params.event,
    userId,
    providerCustomerId,
    providerSubscriptionId,
    providerTransactionId:
      asNonEmptyStringOrNull(params.raw.latest_invoice) ??
      asNonEmptyStringOrNull(params.raw.invoice),
    providerOriginalTransactionId: null,
    productId:
      asNonEmptyStringOrNull(metadata.product_id) ??
      getProductId(params.raw),
    providerProductId:
      asNonEmptyStringOrNull(metadata.product_id) ??
      getProductId(params.raw),
    providerPriceId:
      asNonEmptyStringOrNull(metadata.price_id) ??
      getPriceId(params.raw),
    environment: params.environment,
    status: params.status,
    currentPeriodStart: getCurrentPeriodStart(params.raw),
    currentPeriodEnd: getCurrentPeriodEnd(params.raw),
    cancelAtPeriodEnd: asBoolean(params.raw.cancel_at_period_end),
    canceledAt: getCanceledAt(params.raw),
    endedAt: getEndedAt(params.raw),
    metadata,
    rawPayload: params.raw,
  });

  await finalizeSubscriptionProcessing({
    supabase: params.supabase,
    userId,
    event: params.event,
    shouldRecomputeBeforeFinalMark: result.shouldRecomputeBeforeFinalMark,
  });

  await params.markStripeWebhookEventProcessed(params.supabase, params.event);
}

export async function handleCheckoutSessionCompleted({
  supabase,
  event,
  environment,
  markStripeWebhookEventProcessed,
}: WebhookHandlerParams): Promise<void> {
  const raw = getEventObject(event);
  const metadata = withDefaultAppId(getMetadata(raw));

  const paymentStatus = asNonEmptyStringOrNull(raw.payment_status);
  const mode = asNonEmptyStringOrNull(raw.mode);

  if (mode !== "subscription") {
    await markStripeWebhookEventProcessed(supabase, event);
    return;
  }

  if (paymentStatus && paymentStatus !== "paid") {
    logWebhook(
      "info",
      "checkout.session.completed ignored because payment is not paid",
      {
        event_id: event.id,
        payment_status: paymentStatus,
      },
    );
    await markStripeWebhookEventProcessed(supabase, event);
    return;
  }

  await processSubscriptionLikeEvent({
    supabase,
    event,
    environment,
    markStripeWebhookEventProcessed,
    raw,
    status: "active",
  });

  logWebhook("info", "checkout.session.completed processed", {
    event_id: event.id,
    checkout_session_id: asNonEmptyStringOrNull(raw.id),
    subscription_id: getSubscriptionId(raw),
    customer_id: getCustomerId(raw),
    app_id: asNonEmptyStringOrNull(metadata.app_id) ?? DEFAULT_APP_ID,
  });
}

export async function handleCustomerSubscriptionCreatedOrUpdated({
  supabase,
  event,
  environment,
  markStripeWebhookEventProcessed,
}: WebhookHandlerParams): Promise<void> {
  const raw = getEventObject(event);
  const status = normalizeSubscriptionStatus(asNonEmptyStringOrNull(raw.status));

  await processSubscriptionLikeEvent({
    supabase,
    event,
    environment,
    markStripeWebhookEventProcessed,
    raw,
    status,
  });

  logWebhook("info", "customer.subscription created/updated processed", {
    event_id: event.id,
    subscription_id: getSubscriptionId(raw),
    customer_id: getCustomerId(raw),
    status,
  });
}

export async function handleCustomerSubscriptionDeleted({
  supabase,
  event,
  environment,
  markStripeWebhookEventProcessed,
}: WebhookHandlerParams): Promise<void> {
  const raw = getEventObject(event);

  await processSubscriptionLikeEvent({
    supabase,
    event,
    environment,
    markStripeWebhookEventProcessed,
    raw,
    status: "revoked",
  });

  logWebhook("info", "customer.subscription.deleted processed", {
    event_id: event.id,
    subscription_id: getSubscriptionId(raw),
    customer_id: getCustomerId(raw),
  });
}

async function fetchStripeSubscriptionByIdFromDb(
  supabase: DBClient,
  providerSubscriptionId: string,
): Promise<SubscriptionLike | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "provider_subscription_id, provider_customer_id, provider_price_id, product_id, metadata, raw_payload",
    )
    .eq("provider", "stripe")
    .eq("provider_subscription_id", providerSubscriptionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const rawPayload = asRecord(data.raw_payload) ?? {};
  const metadata = withDefaultAppId({
    ...(asRecord(data.metadata) ?? {}),
    ...(getMetadata(rawPayload) ?? {}),
  });

  return {
    id: asNonEmptyStringOrNull(data.provider_subscription_id),
    customer: asNonEmptyStringOrNull(data.provider_customer_id),
    metadata,
  } as SubscriptionLike;
}

export async function handleInvoicePaid({
  supabase,
  event,
  environment,
  markStripeWebhookEventProcessed,
}: WebhookHandlerParams): Promise<void> {
  const raw = getEventObject(event);
  const providerSubscriptionId = asNonEmptyStringOrNull(raw.subscription);
  const providerCustomerId = getCustomerId(raw);
  const invoiceEmail = getInvoiceEmail(raw);

  if (!providerSubscriptionId) {
    throw new Error("invoice.paid missing subscription id");
  }

  const { userId, stripeSubscription } = await resolveUserForInvoiceEvent({
    supabase,
    providerSubscriptionId,
    providerCustomerId,
    invoiceEmail,
    fetchStripeSubscriptionById: (subscriptionId: string) =>
      fetchStripeSubscriptionByIdFromDb(supabase, subscriptionId),
  });

  if (!userId) {
    throw new Error("Could not resolve user for invoice.paid");
  }

  const metadata = withDefaultAppId(
    asRecord(stripeSubscription?.metadata) ?? {},
  );

  const currentPeriodStart =
    getCurrentPeriodStart(raw) ??
    getCurrentPeriodStart(asRecord(stripeSubscription) ?? {});
  const currentPeriodEnd =
    getCurrentPeriodEnd(raw) ??
    getCurrentPeriodEnd(asRecord(stripeSubscription) ?? {});

  const result = await upsertSharedSubscriptionMonotonic({
    supabase,
    event,
    userId,
    providerCustomerId,
    providerSubscriptionId,
    providerTransactionId: asNonEmptyStringOrNull(raw.id),
    providerOriginalTransactionId: null,
    productId:
      asNonEmptyStringOrNull(metadata.product_id) ??
      getProductId(raw),
    providerProductId:
      asNonEmptyStringOrNull(metadata.product_id) ??
      getProductId(raw),
    providerPriceId:
      asNonEmptyStringOrNull(metadata.price_id) ??
      getPriceId(raw),
    environment,
    status: "active",
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: null,
    canceledAt: null,
    endedAt: null,
    metadata,
    rawPayload: raw,
  });

  await finalizeSubscriptionProcessing({
    supabase,
    userId,
    event,
    shouldRecomputeBeforeFinalMark: result.shouldRecomputeBeforeFinalMark,
  });

  await markStripeWebhookEventProcessed(supabase, event);
}

export async function handleInvoicePaymentFailed({
  supabase,
  event,
  environment,
  markStripeWebhookEventProcessed,
}: WebhookHandlerParams): Promise<void> {
  const raw = getEventObject(event);
  const providerSubscriptionId = asNonEmptyStringOrNull(raw.subscription);
  const providerCustomerId = getCustomerId(raw);
  const invoiceEmail = getInvoiceEmail(raw);

  if (!providerSubscriptionId) {
    throw new Error("invoice.payment_failed missing subscription id");
  }

  const { userId, stripeSubscription } = await resolveUserForInvoiceEvent({
    supabase,
    providerSubscriptionId,
    providerCustomerId,
    invoiceEmail,
    fetchStripeSubscriptionById: (subscriptionId: string) =>
      fetchStripeSubscriptionByIdFromDb(supabase, subscriptionId),
  });

  if (!userId) {
    throw new Error("Could not resolve user for invoice.payment_failed");
  }

  const metadata = withDefaultAppId(
    asRecord(stripeSubscription?.metadata) ?? {},
  );

  const result = await upsertSharedSubscriptionMonotonic({
    supabase,
    event,
    userId,
    providerCustomerId,
    providerSubscriptionId,
    providerTransactionId: asNonEmptyStringOrNull(raw.id),
    providerOriginalTransactionId: null,
    productId:
      asNonEmptyStringOrNull(metadata.product_id) ??
      getProductId(raw),
    providerProductId:
      asNonEmptyStringOrNull(metadata.product_id) ??
      getProductId(raw),
    providerPriceId:
      asNonEmptyStringOrNull(metadata.price_id) ??
      getPriceId(raw),
    environment,
    status: "past_due",
    currentPeriodStart:
      getCurrentPeriodStart(raw) ??
      getCurrentPeriodStart(asRecord(stripeSubscription) ?? {}),
    currentPeriodEnd:
      getCurrentPeriodEnd(raw) ??
      getCurrentPeriodEnd(asRecord(stripeSubscription) ?? {}),
    cancelAtPeriodEnd: null,
    canceledAt: null,
    endedAt: null,
    metadata,
    rawPayload: raw,
  });

  await finalizeSubscriptionProcessing({
    supabase,
    userId,
    event,
    shouldRecomputeBeforeFinalMark: result.shouldRecomputeBeforeFinalMark,
  });

  await markStripeWebhookEventProcessed(supabase, event);
}