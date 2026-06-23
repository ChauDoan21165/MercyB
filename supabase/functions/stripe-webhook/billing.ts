// FILE PATH: supabase/functions/stripe-webhook/billing.ts

import {
  STRIPE_PROVIDER,
  asNonEmptyStringOrNull,
  deriveEntitlementFromSubscriptions,
  isoNow,
  isUuid,
  resolveUserIdByProfileEmail,
  resolveUserIdByProfileStripeCustomerId,
  toIsoFromUnix,
} from "./core.ts";
import type {
  BillingEnvironment,
  CanonicalSubscriptionRow,
  DBClient,
  ExistingSubscriptionRow,
  FilterableQuery,
  Json,
  StripeFreshness,
  StripeWebhookEvent,
  SubscriptionLike,
  SharedSubscriptionStatus,
  UpsertSharedSubscriptionMonotonicResult,
} from "./types.ts";
import {
  mapStripeSubscription,
  resolveMonotonicRawPayload,
} from "./subscription-insert.ts";
import { captureEdgeError } from "../_shared/sentry.ts";
import { monotonicBackoffDelayMs, sleep } from "./monotonic-backoff.ts";

/* ============================================================================
 * Config
 * ========================================================================== */

const MAX_MONOTONIC_RETRIES = 8;
const DEFAULT_APP_ID = "mercy_blade";

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

  const items = asRecordOrNull(record.items);
  const itemData = Array.isArray(items?.data) ? items.data : [];

  if (itemData.length > 0) {
    let subscriptionObjectTime: number | null = null;

    for (const item of itemData) {
      const itemRecord = asRecordOrNull(item);
      const startIso = toIsoFromUnix(itemRecord?.current_period_start);
      const endIso = toIsoFromUnix(itemRecord?.current_period_end);

      subscriptionObjectTime = maxNullableNumber([
        subscriptionObjectTime,
        isoToMillis(startIso),
        isoToMillis(endIso),
      ]);
    }

    if (subscriptionObjectTime !== null) return subscriptionObjectTime;
  }

  const lines = asRecordOrNull(record.lines);
  const lineItems = Array.isArray(lines?.data) ? lines.data : [];

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

  const explicitObjectTime =
    typeof explicit?.object_time_ms === "number" &&
      Number.isFinite(explicit.object_time_ms)
      ? explicit.object_time_ms
      : null;

  const explicitEventCreated =
    typeof explicit?.event_created === "number" &&
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

/**
 * Observability beacon for the A14 raw_payload object-quality guard.
 *
 * Fired only when a preserved (higher-quality) body is actually committed,
 * so a Sentry issue's event count == the live rate the guard is firing at.
 * This is NOT a failure: the guard working is the correct outcome. It is
 * tagged so a billing dashboard can facet it and so it never pollutes the
 * real error surface. Awaited (so the short edge isolate does not tear down
 * before Sentry flushes) but `captureEdgeError` is internally guarded —
 * it never throws and is a zero-cost no-op when SENTRY_DSN is unset, so
 * this cannot affect the webhook response or the idempotency flow.
 */
async function reportRawPayloadPreservation(params: {
  event: StripeWebhookEvent;
  providerSubscriptionId: string;
  existingKind: string;
  incomingKind: string;
}): Promise<void> {
  console.warn(
    "stripe-webhook raw_payload object-quality guard fired — kept persisted body",
    {
      eventId: params.event.id,
      eventType: params.event.type,
      providerSubscriptionId: params.providerSubscriptionId,
      existingKind: params.existingKind,
      incomingKind: params.incomingKind,
    },
  );

  await captureEdgeError(
    new Error(
      "stripe-webhook raw_payload object-quality preservation " +
        `(${params.incomingKind} would have clobbered ${params.existingKind})`,
    ),
    {
      functionName: "stripe-webhook",
      extra: {
        stage: "raw_payload_object_quality_preserved",
        event_id: params.event.id,
        provider_subscription_id: params.providerSubscriptionId,
      },
      tags: {
        webhook: "stripe",
        billing: "true",
        kind: "observability",
        stage: "raw_payload_object_quality_preserved",
        existing_object: params.existingKind,
        incoming_object: params.incomingKind,
        event_type: asNonEmptyStringOrNull(params.event.type) ?? "unknown",
      },
    },
  );
}

/* ============================================================================
 * App resolution helpers
 * ========================================================================== */

function resolveAppId(params: {
  metadata?: unknown;
  rawPayload?: unknown;
  existingAppId?: string | null;
}): string {
  const metadataRecord = asRecordOrNull(params.metadata);
  const payloadRecord = asRecordOrNull(params.rawPayload);

  return (
    asNonEmptyStringOrNull(metadataRecord?.app_id) ??
    asNonEmptyStringOrNull(metadataRecord?.appId) ??
    asNonEmptyStringOrNull(payloadRecord?.app_id) ??
    asNonEmptyStringOrNull(payloadRecord?.appId) ??
    asNonEmptyStringOrNull(params.existingAppId) ??
    DEFAULT_APP_ID
  );
}

/* ============================================================================
 * Subscription persistence helpers
 * ========================================================================== */

// mapStripeSubscription lives in ./subscription-insert.ts now — a pure,
// dependency-free, deno-check-gated + vitest-unit-tested module (it used
// to be untestable here because billing.ts transitively imports Deno-only
// code). The clock is injected (nowIso) to keep that module pure; the one
// caller below passes isoNow().

function doesExistingSubscriptionDifferFromWrite(
  existing: ExistingSubscriptionRow,
  write: import("./types.ts").ComparableSubscriptionWrite,
): boolean {
  return (
    (existing.user_id ?? null) !== (write.user_id ?? null) ||
    ((existing as { app_id?: string | null }).app_id ?? null) !==
      (((write as unknown as { app_id?: string | null }).app_id) ?? null) ||
    (existing.provider ?? null) !== (write.provider ?? null) ||
    ((existing as { customer_id?: string | null }).customer_id ?? null) !==
      ((write as unknown as { customer_id?: string | null }).customer_id ??
        null) ||
    (existing.provider_customer_id ?? null) !==
      (write.provider_customer_id ?? null) ||
    (existing.provider_subscription_id ?? null) !==
      (write.provider_subscription_id ?? null) ||
    (existing.provider_transaction_id ?? null) !==
      (write.provider_transaction_id ?? null) ||
    (existing.provider_original_transaction_id ?? null) !==
      (write.provider_original_transaction_id ?? null) ||
    (existing.product_id ?? null) !== (write.product_id ?? null) ||
    (existing.provider_product_id ?? null) !==
      (write.provider_product_id ?? null) ||
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

export async function hasProcessedEntitlementEvent(
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
  environment: BillingEnvironment;
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

  // FK 23503: user_id not in profiles (e.g. orphaned sandbox subscription).
  if (
    params.environment === "sandbox" &&
    (error as { code?: string } | null)?.code === "23503"
  ) {
    console.warn(
      "stripe-webhook sandbox FK violation on entitlement_events; downgrading to no-op",
      {
        eventId: params.event.id,
        userId: params.userId,
        code: (error as { code?: string } | null)?.code ?? null,
      },
    );
    return true;
  }

  throw error;
}

export async function getSharedSubscriptionByProviderSubscriptionId(params: {
  supabase: DBClient;
  providerSubscriptionId: string | null;
}): Promise<ExistingSubscriptionRow | null> {
  if (!params.providerSubscriptionId) return null;

  const selectClause =
    "user_id,app_id,customer_id,provider,provider_customer_id,provider_subscription_id,provider_transaction_id,provider_original_transaction_id,product_id,provider_product_id,provider_price_id,environment,status,current_period_start,current_period_end,cancel_at_period_end,canceled_at,ended_at,metadata,provider_metadata,raw_payload";

  const byProviderSubscriptionId = await params.supabase
    .from("subscriptions")
    .select(selectClause)
    .eq("provider", STRIPE_PROVIDER)
    .eq("provider_subscription_id", params.providerSubscriptionId)
    .maybeSingle();

  if (byProviderSubscriptionId.error) throw byProviderSubscriptionId.error;
  return (byProviderSubscriptionId.data as ExistingSubscriptionRow | null) ??
    null;
}

async function getSharedSubscriptionByProviderCustomerId(params: {
  supabase: DBClient;
  providerCustomerId: string | null;
}): Promise<ExistingSubscriptionRow | null> {
  if (!params.providerCustomerId) return null;

  const selectClause =
    "user_id,app_id,customer_id,provider,provider_customer_id,provider_subscription_id,provider_transaction_id,provider_original_transaction_id,product_id,provider_product_id,provider_price_id,environment,status,current_period_start,current_period_end,cancel_at_period_end,canceled_at,ended_at,metadata,provider_metadata,raw_payload";

  const byProviderCustomerId = await params.supabase
    .from("subscriptions")
    .select(selectClause)
    .eq("provider", STRIPE_PROVIDER)
    .eq("provider_customer_id", params.providerCustomerId)
    .order("current_period_end", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (byProviderCustomerId.error) throw byProviderCustomerId.error;
  return (byProviderCustomerId.data as ExistingSubscriptionRow | null) ?? null;
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

export async function resolveUserByStripeLinkage(params: {
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
  now: Date | number = new Date(),
): Promise<import("./types.ts").EntitlementSnapshot> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status,current_period_end,provider")
    .eq("user_id", userId)
    .eq("app_id", DEFAULT_APP_ID);

  if (error) throw error;

  // B13 Phase 3 PR-B: `now` is threaded into the shared derive. An
  // entitling row with a past `current_period_end` no longer projects
  // to `profiles.premium_status = 'active'` — the bug closes here.
  const entitlement = deriveEntitlementFromSubscriptions(
    (data ?? []) as Array<
      Pick<
        CanonicalSubscriptionRow,
        "status" | "current_period_end" | "provider"
      >
    >,
    now,
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

export async function finalizeSubscriptionProcessing(params: {
  supabase: DBClient;
  userId: string;
  event: StripeWebhookEvent;
  environment: BillingEnvironment;
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
    environment: params.environment,
  });
}

export async function upsertSharedSubscriptionMonotonic(params: {
  supabase: DBClient;
  event: StripeWebhookEvent;
  userId: string;
  providerCustomerId: string | null;
  providerSubscriptionId: string;
  providerTransactionId?: string | null;
  providerOriginalTransactionId?: string | null;
  productId?: string | null;
  providerProductId?: string | null;
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
    // A91 fix A: full-jitter exponential backoff between CAS attempts so a
    // concurrent Stripe multi-event burst for this subscription can commit
    // before we re-read, giving the next attempt a clean read→write gap.
    // Placed at the top of the loop body so it covers BOTH retry paths
    // uniformly: the `continue` when the row vanished, and the fall-through
    // when our write is freshness-superior. attempt 0 (the happy path) never
    // sleeps. Purely additive — does not change MAX_MONOTONIC_RETRIES, the
    // CAS WHERE clause, the exhaustion throw, or the #561 claim/release flow.
    if (attempt > 0) {
      await sleep(monotonicBackoffDelayMs(attempt - 1));
    }

    const existing = await getSharedSubscriptionForUpsert({
      supabase: params.supabase,
      providerSubscriptionId: params.providerSubscriptionId,
      providerCustomerId: params.providerCustomerId,
    });

    if (existing?.user_id != null && existing.user_id !== params.userId) {
      if (params.environment === "sandbox") {
        console.warn(
          "stripe-webhook sandbox ownership mismatch; downgrading to no-op",
          {
            eventId: params.event.id,
            providerSubscriptionId: params.providerSubscriptionId,
            existingUserId: existing.user_id,
            resolvedUserId: params.userId,
          },
        );
        return { stateChanged: false, shouldRecomputeBeforeFinalMark: false };
      }
      throw new Error("Stripe subscription ownership mismatch");
    }

    const resolvedProviderCustomerId =
      params.providerCustomerId ??
      existing?.provider_customer_id ??
      (existing as { customer_id?: string | null } | null)?.customer_id ??
      null;

    if (!resolvedProviderCustomerId) {
      throw new Error("Stripe subscription missing customer id");
    }

    const resolvedAppId = resolveAppId({
      metadata: params.metadata,
      rawPayload: params.rawPayload,
      existingAppId: (existing as { app_id?: string | null } | null)?.app_id ??
        null,
    });

    // A14 fix: raw_payload is monotonic on object quality, not just time.
    // A lower-quality incoming body (e.g. an `invoice` from `invoice.paid`)
    // must not overwrite a persisted higher-quality `subscription` body.
    // The status/period/price columns below still come from this event's
    // params (accurate even from an invoice); only the persisted body is
    // preserved, with the freshness marker advanced so column ordering is
    // unchanged. See reports/RECON-webhook-payload-type-bug-A14.md.
    const resolvedRawPayload = resolveMonotonicRawPayload({
      incomingRawPayloadWithFreshness: rawPayloadWithFreshness,
      incomingRawPayload: params.rawPayload,
      existingRawPayload: existing?.raw_payload ?? null,
      incomingFreshness,
    });

    const write = mapStripeSubscription({
      nowIso: isoNow(),
      userId: params.userId,
      appId: resolvedAppId,
      providerCustomerId: resolvedProviderCustomerId,
      providerSubscriptionId: params.providerSubscriptionId,
      providerTransactionId:
        params.providerTransactionId ??
        existing?.provider_transaction_id ??
        null,
      providerOriginalTransactionId:
        params.providerOriginalTransactionId ??
        existing?.provider_original_transaction_id ??
        null,
      productId: params.productId ?? existing?.product_id ?? null,
      providerProductId:
        params.providerProductId ??
        existing?.provider_product_id ??
        params.productId ??
        existing?.product_id ??
        null,
      providerPriceId:
        params.providerPriceId ?? existing?.provider_price_id ?? null,
      environment: params.environment,
      status: params.status ?? existing?.status ?? "revoked",
      currentPeriodStart:
        params.currentPeriodStart ?? existing?.current_period_start ?? null,
      currentPeriodEnd:
        params.currentPeriodEnd ?? existing?.current_period_end ?? null,
      cancelAtPeriodEnd:
        typeof params.cancelAtPeriodEnd === "boolean"
          ? params.cancelAtPeriodEnd
          : (existing?.cancel_at_period_end ?? false),
      canceledAt: params.canceledAt ?? existing?.canceled_at ?? null,
      endedAt: params.endedAt ?? existing?.ended_at ?? null,
      metadata: params.metadata ?? existing?.metadata ?? null,
      rawPayload: resolvedRawPayload.rawPayload,
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
          console.warn("Equal freshness update — allowing overwrite", {
            eventId: params.event.id,
            providerSubscriptionId: params.providerSubscriptionId,
          });
        } else {
          return {
            stateChanged: false,
            shouldRecomputeBeforeFinalMark:
              persistedFreshness.event_id === params.event.id,
          };
        }
      }
    }

    if (!existing) {
      const { error } = await params.supabase
        .from("subscriptions")
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
          if (params.environment === "sandbox") {
            console.warn(
              "stripe-webhook sandbox ownership mismatch; downgrading to no-op",
              {
                eventId: params.event.id,
                providerSubscriptionId: params.providerSubscriptionId,
                existingUserId: latest.user_id,
                resolvedUserId: params.userId,
              },
            );
            return { stateChanged: false, shouldRecomputeBeforeFinalMark: false };
          }
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
            console.warn("Equal freshness duplicate-path update — allowing overwrite", {
              eventId: params.event.id,
              providerSubscriptionId: params.providerSubscriptionId,
            });
          } else {
            return {
              stateChanged: false,
              shouldRecomputeBeforeFinalMark:
                latestFreshness.event_id === params.event.id,
            };
          }
        }

        continue;
      }

      throw error;
    }

    let query = params.supabase
      .from("subscriptions")
      .update(
        write as import("./types.ts").Database["public"]["Tables"]["subscriptions"]["Update"],
      )
      .eq("provider", STRIPE_PROVIDER)
      .eq("provider_subscription_id", existing.provider_subscription_id);

    query = applyExactFilter(query, "user_id", existing.user_id);
    query = applyExactFilter(
      query,
      "app_id",
      (existing as { app_id?: string | null }).app_id ?? null,
    );
    query = applyExactFilter(
      query,
      "customer_id",
      (existing as { customer_id?: string | null }).customer_id ?? null,
    );
    query = applyExactFilter(query, "provider", existing.provider);
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
      "provider_product_id",
      existing.provider_product_id,
    );
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
      if (resolvedRawPayload.preserved) {
        await reportRawPayloadPreservation({
          event: params.event,
          providerSubscriptionId: params.providerSubscriptionId,
          existingKind: resolvedRawPayload.existingKind,
          incomingKind: resolvedRawPayload.incomingKind,
        });
      }

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
      if (params.environment === "sandbox") {
        console.warn(
          "stripe-webhook sandbox ownership mismatch; downgrading to no-op",
          {
            eventId: params.event.id,
            providerSubscriptionId: params.providerSubscriptionId,
            existingUserId: latest.user_id,
            resolvedUserId: params.userId,
          },
        );
        return { stateChanged: false, shouldRecomputeBeforeFinalMark: false };
      }
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
        console.warn("Equal freshness post-update conflict — accepting latest state", {
          eventId: params.event.id,
          providerSubscriptionId: params.providerSubscriptionId,
        });
      } else {
        return {
          stateChanged: false,
          shouldRecomputeBeforeFinalMark:
            latestFreshness.event_id === params.event.id,
        };
      }
    }
  }

  throw new Error(
    "Failed to apply monotonic Stripe subscription update after concurrent modifications",
  );
}

export async function resolveUserForInvoiceEvent(params: {
  supabase: DBClient;
  providerSubscriptionId: string;
  providerCustomerId: string | null;
  invoiceEmail?: string | null;
  fetchStripeSubscriptionById: (
    providerSubscriptionId: string,
  ) => Promise<SubscriptionLike | null>;
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

  const stripeSubscription = await params.fetchStripeSubscriptionById(
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