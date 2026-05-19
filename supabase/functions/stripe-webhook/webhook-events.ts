// Path: supabase/functions/stripe-webhook/webhook-events.ts

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

function getEventCreatedIso(event: StripeWebhookEvent): string | null {
  return toIsoFromUnix((event as Record<string, unknown>)?.created) ?? null;
}

function buildEventContext(
  event: StripeWebhookEvent,
  extra?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    event_id: event.id,
    event_type: event.type,
    livemode: event.livemode,
    event_created_at: getEventCreatedIso(event),
    ...(extra ?? {}),
  };
}

async function markProcessedWithLog(
  supabase: DBClient,
  event: StripeWebhookEvent,
  markStripeWebhookEventProcessed: MarkProcessedFn,
  extra?: Record<string, unknown>,
): Promise<void> {
  const inserted = await markStripeWebhookEventProcessed(supabase, event);

  logWebhook(
    "info",
    inserted
      ? "stripe webhook event marked processed"
      : "stripe webhook event already processed",
    buildEventContext(event, extra),
  );
}

function resolvePlan(input: {
  plan?: string | null;
  priceId?: string | null;
}): "monthly" | "yearly" | null {
  if (input.plan === "monthly" || input.plan === "yearly") {
    return input.plan;
  }

  if (!input.priceId) return null;

  const id = input.priceId.toLowerCase();

  if (id.includes("month")) return "monthly";
  if (id.includes("year")) return "yearly";

  return null;
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

function getLineParent(
  raw: Record<string, unknown>,
): Record<string, unknown> | null {
  const firstLine = getFirstLine(raw);
  return asRecord(firstLine?.parent);
}

function getInvoiceParent(
  raw: Record<string, unknown>,
): Record<string, unknown> | null {
  return asRecord(raw.parent);
}

function getInvoiceSubscriptionDetails(
  raw: Record<string, unknown>,
): Record<string, unknown> | null {
  const parent = getInvoiceParent(raw);
  return asRecord(parent?.subscription_details);
}

function getLineSubscriptionItemDetails(
  raw: Record<string, unknown>,
): Record<string, unknown> | null {
  const lineParent = getLineParent(raw);
  return asRecord(lineParent?.subscription_item_details);
}

function getInvoiceEventSubscriptionId(raw: Record<string, unknown>): string | null {
  return (
    asNonEmptyStringOrNull(raw.subscription) ??
    asNonEmptyStringOrNull(getInvoiceSubscriptionDetails(raw)?.subscription) ??
    asNonEmptyStringOrNull(getLineSubscriptionItemDetails(raw)?.subscription) ??
    null
  );
}

function getInvoiceMetadata(raw: Record<string, unknown>): Record<string, unknown> {
  const direct = getMetadata(raw);
  const parentSubscriptionDetails = getInvoiceSubscriptionDetails(raw);
  const parentMetadata = asRecord(parentSubscriptionDetails?.metadata) ?? {};
  const firstLine = getFirstLine(raw);
  const lineMetadata = getMetadata(firstLine);

  return withDefaultAppId({
    ...parentMetadata,
    ...lineMetadata,
    ...direct,
  });
}

function getPriceId(raw: Record<string, unknown>): string | null {
  const firstItem = getFirstSubscriptionItem(raw);
  const firstLine = getFirstLine(raw);

  const price =
    asRecord(firstItem?.price) ??
    asRecord(firstLine?.price) ??
    asRecord(asRecord(firstLine?.pricing)?.price_details);

  return (
    asNonEmptyStringOrNull(price?.id) ??
    asNonEmptyStringOrNull(price?.price) ??
    asNonEmptyStringOrNull(raw.price_id)
  );
}

function getProductId(raw: Record<string, unknown>): string | null {
  const firstItem = getFirstSubscriptionItem(raw);
  const firstLine = getFirstLine(raw);

  const price =
    asRecord(firstItem?.price) ??
    asRecord(firstLine?.price);
  const pricing = asRecord(firstLine?.pricing);
  const priceDetails = asRecord(pricing?.price_details);

  return (
    asNonEmptyStringOrNull(price?.product) ??
    asNonEmptyStringOrNull(priceDetails?.product) ??
    null
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

  return toIsoFromUnix(firstItem?.current_period_start) ?? null;
}

function getItemCurrentPeriodEnd(raw: Record<string, unknown>): string | null {
  const firstItem = getFirstSubscriptionItem(raw);

  return toIsoFromUnix(firstItem?.current_period_end) ?? null;
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
  const metadata = getInvoiceMetadata(raw);

  return (
    asNonEmptyStringOrNull(raw.customer_email) ??
    asNonEmptyStringOrNull(customerDetails?.email) ??
    asNonEmptyStringOrNull(metadata.email) ??
    null
  );
}

function getResolvedCustomerId(
  raw: Record<string, unknown>,
  stripeSubscription?: SubscriptionLike | null,
): string | null {
  const subscriptionRecord = asRecord(stripeSubscription as unknown);

  return (
    getCustomerId(raw) ??
    asNonEmptyStringOrNull(getFirstLine(raw)?.customer) ??
    asNonEmptyStringOrNull(getInvoiceParent(raw)?.customer) ??
    asNonEmptyStringOrNull(subscriptionRecord?.customer) ??
    asNonEmptyStringOrNull(subscriptionRecord?.customer_id) ??
    asNonEmptyStringOrNull(subscriptionRecord?.provider_customer_id) ??
    null
  );
}

function withCustomerAliases(
  metadata: Record<string, unknown>,
  customerId: string | null,
): Record<string, unknown> {
  if (!customerId) return metadata;

  return {
    ...metadata,
    customer_id: asNonEmptyStringOrNull(metadata.customer_id) ?? customerId,
    provider_customer_id:
      asNonEmptyStringOrNull(metadata.provider_customer_id) ?? customerId,
    stripe_customer_id:
      asNonEmptyStringOrNull(metadata.stripe_customer_id) ?? customerId,
  };
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

function getCancelAtPeriodEnd(raw: Record<string, unknown>): boolean | null {
  return (
    asBoolean(raw.cancel_at_period_end) ??
    asBoolean(getInvoiceParent(raw)?.cancel_at_period_end) ??
    asBoolean(getInvoiceSubscriptionDetails(raw)?.cancel_at_period_end) ??
    null
  );
}

function getLifecycleDebugPayload(
  raw: Record<string, unknown>,
  event: StripeWebhookEvent,
  extra?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...buildEventContext(event, extra),
    rawCurrentPeriodStart: toIsoFromUnix(raw.current_period_start) ?? null,
    rawCurrentPeriodEnd: toIsoFromUnix(raw.current_period_end) ?? null,
    rawPeriodStart: toIsoFromUnix(raw.period_start) ?? null,
    rawPeriodEnd: toIsoFromUnix(raw.period_end) ?? null,
    rawStartDate: toIsoFromUnix(raw.start_date) ?? null,
    rawTrialEnd: toIsoFromUnix(raw.trial_end) ?? null,
    item0: getFirstSubscriptionItem(raw),
    line0: getFirstLine(raw),
  };
}

async function processSubscriptionLikeEvent(params: {
  supabase: DBClient;
  event: StripeWebhookEvent;
  environment: BillingEnvironment;
  markStripeWebhookEventProcessed: MarkProcessedFn;
  raw: Record<string, unknown>;
  status: "active" | "trialing" | "past_due" | "paused" | "revoked";
}): Promise<void> {
  const baseMetadata = withDefaultAppId(getMetadata(params.raw));

  const providerSubscriptionId = getSubscriptionId(params.raw);
  const providerCustomerId = getCustomerId(params.raw);
  const rawMetadata = withCustomerAliases(baseMetadata, providerCustomerId);
  const priceId =
    asNonEmptyStringOrNull(rawMetadata.price_id) ??
    getPriceId(params.raw);
  const plan = resolvePlan({
    plan: asNonEmptyStringOrNull(rawMetadata.plan),
    priceId,
  });
  // Stripe metadata is an arbitrary string→value map at runtime
  // (getMetadata returns Record<string, unknown>). Without this explicit
  // annotation TS object-spread collapses the type to just the two
  // conditional-spread keys ({ price_id?; plan? }) and drops the index
  // signature, so every other real key read (email / supabase_user_id /
  // user_id / product_id) fails TS2339. Type-only; no behavior change.
  const metadata: Record<string, unknown> = {
    ...rawMetadata,
    ...(plan ? { plan } : {}),
    ...(priceId ? { price_id: priceId } : {}),
  };
  const email =
    asNonEmptyStringOrNull(metadata.email) ??
    getCheckoutEmail(params.raw);

  if (!providerSubscriptionId) {
    throw new Error("Stripe event missing subscription id");
  }

  if (!providerCustomerId) {
    throw new Error("Stripe event missing customer id");
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

  const currentPeriodStart = getCurrentPeriodStart(params.raw);
  const currentPeriodEnd = getCurrentPeriodEnd(params.raw);

  logWebhook(
    "info",
    "stripe webhook subscription lifecycle snapshot",
    getLifecycleDebugPayload(params.raw, params.event, {
      providerSubscriptionId,
      providerCustomerId,
      userId,
      status: params.status,
      currentPeriodStart,
      currentPeriodEnd,
      metadata,
    }),
  );

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
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: getCancelAtPeriodEnd(params.raw),
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

  await markProcessedWithLog(
    params.supabase,
    params.event,
    params.markStripeWebhookEventProcessed,
    {
      providerSubscriptionId,
      providerCustomerId,
      userId,
      status: params.status,
    },
  );
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
    await markProcessedWithLog(supabase, event, markStripeWebhookEventProcessed, {
      reason: "non_subscription_checkout_mode",
      mode,
    });
    return;
  }

  if (paymentStatus && paymentStatus !== "paid") {
    logWebhook(
      "info",
      "checkout.session.completed ignored because payment is not paid",
      buildEventContext(event, {
        payment_status: paymentStatus,
      }),
    );
    await markProcessedWithLog(supabase, event, markStripeWebhookEventProcessed, {
      reason: "payment_not_paid",
      payment_status: paymentStatus,
    });
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
      "provider_subscription_id, provider_customer_id, customer_id, provider_price_id, product_id, metadata, raw_payload",
    )
    .eq("provider", "stripe")
    .eq("provider_subscription_id", providerSubscriptionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const rawPayload = asRecord(data.raw_payload) ?? {};
  const resolvedCustomerId =
    asNonEmptyStringOrNull(data.provider_customer_id) ??
    asNonEmptyStringOrNull(data.customer_id);

  const metadata = withCustomerAliases(
    withDefaultAppId({
      ...(asRecord(data.metadata) ?? {}),
      ...(getMetadata(rawPayload) ?? {}),
    }),
    resolvedCustomerId,
  );

  return {
    id: asNonEmptyStringOrNull(data.provider_subscription_id),
    customer: resolvedCustomerId,
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
  const providerSubscriptionId = getInvoiceEventSubscriptionId(raw);
  const invoiceEmail = getInvoiceEmail(raw);

  if (!providerSubscriptionId) {
    throw new Error("invoice.paid missing subscription id");
  }

  const previewCustomerId = getResolvedCustomerId(raw, null);

  const { userId, stripeSubscription } = await resolveUserForInvoiceEvent({
    supabase,
    providerSubscriptionId,
    providerCustomerId: previewCustomerId,
    invoiceEmail,
    fetchStripeSubscriptionById: (subscriptionId: string) =>
      fetchStripeSubscriptionByIdFromDb(supabase, subscriptionId),
  });

  if (!userId) {
    throw new Error("Could not resolve user for invoice.paid");
  }

  const providerCustomerId = getResolvedCustomerId(raw, stripeSubscription);

  if (!providerCustomerId) {
    throw new Error("invoice.paid missing customer id");
  }

  const mergedMetadata = withCustomerAliases(
    withDefaultAppId({
      ...getInvoiceMetadata(raw),
      ...(asRecord(stripeSubscription?.metadata) ?? {}),
    }),
    providerCustomerId,
  );

  const priceId =
    asNonEmptyStringOrNull(mergedMetadata.price_id) ??
    getPriceId(raw) ??
    asNonEmptyStringOrNull(asRecord(stripeSubscription?.metadata)?.price_id);

  const plan = resolvePlan({
    plan: asNonEmptyStringOrNull(mergedMetadata.plan),
    priceId,
  });

  // See the rawMetadata site above: explicit Record<string, unknown> keeps
  // the open Stripe-metadata shape so product_id et al. stay readable.
  const metadata: Record<string, unknown> = {
    ...mergedMetadata,
    ...(plan ? { plan } : {}),
    ...(priceId ? { price_id: priceId } : {}),
  };

  const currentPeriodStart =
    getCurrentPeriodStart(raw) ??
    getCurrentPeriodStart(asRecord(stripeSubscription) ?? {});
  const currentPeriodEnd =
    getCurrentPeriodEnd(raw) ??
    getCurrentPeriodEnd(asRecord(stripeSubscription) ?? {});

  logWebhook(
    "info",
    "invoice.paid lifecycle snapshot",
    {
      ...getLifecycleDebugPayload(raw, event, {
        providerSubscriptionId,
        providerCustomerId,
        userId,
        status: "active",
        currentPeriodStart,
        currentPeriodEnd,
        metadata,
      }),
      invoiceParent: getInvoiceParent(raw),
      invoiceSubscriptionDetails: getInvoiceSubscriptionDetails(raw),
      lineSubscriptionItemDetails: getLineSubscriptionItemDetails(raw),
      stripeSubscription,
    },
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
    status: "active",
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: getCancelAtPeriodEnd(raw),
    canceledAt: getCanceledAt(raw),
    endedAt: getEndedAt(raw),
    metadata,
    rawPayload: raw,
  });

  await finalizeSubscriptionProcessing({
    supabase,
    userId,
    event,
    shouldRecomputeBeforeFinalMark: result.shouldRecomputeBeforeFinalMark,
  });

  await markProcessedWithLog(supabase, event, markStripeWebhookEventProcessed, {
    providerSubscriptionId,
    providerCustomerId,
    userId,
    status: "active",
  });
}

export async function handleInvoicePaymentFailed({
  supabase,
  event,
  environment,
  markStripeWebhookEventProcessed,
}: WebhookHandlerParams): Promise<void> {
  const raw = getEventObject(event);
  const providerSubscriptionId = getInvoiceEventSubscriptionId(raw);
  const invoiceEmail = getInvoiceEmail(raw);

  if (!providerSubscriptionId) {
    throw new Error("invoice.payment_failed missing subscription id");
  }

  const previewCustomerId = getResolvedCustomerId(raw, null);

  const { userId, stripeSubscription } = await resolveUserForInvoiceEvent({
    supabase,
    providerSubscriptionId,
    providerCustomerId: previewCustomerId,
    invoiceEmail,
    fetchStripeSubscriptionById: (subscriptionId: string) =>
      fetchStripeSubscriptionByIdFromDb(supabase, subscriptionId),
  });

  if (!userId) {
    throw new Error("Could not resolve user for invoice.payment_failed");
  }

  const providerCustomerId = getResolvedCustomerId(raw, stripeSubscription);

  if (!providerCustomerId) {
    throw new Error("invoice.payment_failed missing customer id");
  }

  const mergedMetadata = withCustomerAliases(
    withDefaultAppId({
      ...getInvoiceMetadata(raw),
      ...(asRecord(stripeSubscription?.metadata) ?? {}),
    }),
    providerCustomerId,
  );

  const priceId =
    asNonEmptyStringOrNull(mergedMetadata.price_id) ??
    getPriceId(raw) ??
    asNonEmptyStringOrNull(asRecord(stripeSubscription?.metadata)?.price_id);

  const plan = resolvePlan({
    plan: asNonEmptyStringOrNull(mergedMetadata.plan),
    priceId,
  });

  // See the rawMetadata site above: explicit Record<string, unknown> keeps
  // the open Stripe-metadata shape so product_id et al. stay readable.
  const metadata: Record<string, unknown> = {
    ...mergedMetadata,
    ...(plan ? { plan } : {}),
    ...(priceId ? { price_id: priceId } : {}),
  };

  const currentPeriodStart =
    getCurrentPeriodStart(raw) ??
    getCurrentPeriodStart(asRecord(stripeSubscription) ?? {});
  const currentPeriodEnd =
    getCurrentPeriodEnd(raw) ??
    getCurrentPeriodEnd(asRecord(stripeSubscription) ?? {});

  logWebhook(
    "info",
    "invoice.payment_failed lifecycle snapshot",
    {
      ...getLifecycleDebugPayload(raw, event, {
        providerSubscriptionId,
        providerCustomerId,
        userId,
        status: "past_due",
        currentPeriodStart,
        currentPeriodEnd,
        metadata,
      }),
      invoiceParent: getInvoiceParent(raw),
      invoiceSubscriptionDetails: getInvoiceSubscriptionDetails(raw),
      lineSubscriptionItemDetails: getLineSubscriptionItemDetails(raw),
      stripeSubscription,
    },
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
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: getCancelAtPeriodEnd(raw),
    canceledAt: getCanceledAt(raw),
    endedAt: getEndedAt(raw),
    metadata,
    rawPayload: raw,
  });

  await finalizeSubscriptionProcessing({
    supabase,
    userId,
    event,
    shouldRecomputeBeforeFinalMark: result.shouldRecomputeBeforeFinalMark,
  });

  await markProcessedWithLog(supabase, event, markStripeWebhookEventProcessed, {
    providerSubscriptionId,
    providerCustomerId,
    userId,
    status: "past_due",
  });
}