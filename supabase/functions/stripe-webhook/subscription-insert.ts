// supabase/functions/stripe-webhook/subscription-insert.ts
//
// Pure mapping: Stripe subscription/checkout-derived params → the
// `subscriptions` table Insert row. Extracted out of billing.ts (which
// transitively imports Deno-only _shared + core.ts and so cannot be unit
// tested) for the same reason #715 extracted logic.ts/core.ts: this is
// money-path persistence and deserves a deterministic, dependency-free,
// deno-check-gated test. No Deno / npm / _shared imports here — only the
// type-only ./types.ts — so it is both `deno check`-clean and
// vitest-importable.
//
// Behaviour is byte-for-byte the billing.ts original with two
// deliberately-explicit seams: `provider` is the literal "stripe" (this
// module only ever builds Stripe rows; mirrors core.ts STRIPE_PROVIDER)
// and the clock is injected via `nowIso` instead of calling isoNow()
// internally, so `updated_at` is testable and the module stays pure.

import type {
  BillingEnvironment,
  Database,
  Json,
  SharedSubscriptionStatus,
} from "./types.ts";

export type SubscriptionInsert =
  Database["public"]["Tables"]["subscriptions"]["Insert"];

/* ============================================================================
 * raw_payload object-quality monotonicity (A14 fix — see
 * reports/RECON-webhook-payload-type-bug-A14.md)
 *
 * The monotonic upsert in billing.ts orders writes by *time* only. For a
 * renewing/new monthly sub the freshness-winning event is `invoice.paid`,
 * whose Stripe body is an **invoice** object (`object:"invoice"`, has
 * `lines`, never `items.data[0].price.unit_amount`). Letting it overwrite a
 * previously-persisted **subscription** body zeroes `amount_cents` on the
 * admin dashboard and starves the A15 raw_payload backfill of an `items`
 * shape to read.
 *
 * Fix: raw_payload becomes monotonic on *object quality* as well as time.
 * A lower-quality incoming object never overwrites a higher-quality
 * persisted body — but the derived columns (status / period / price) still
 * update from the incoming event (those are accurate even from an invoice),
 * and the freshness marker still advances so the monotonic ordering for
 * those columns is byte-identical to before.
 * ========================================================================== */

export type StripeRawPayloadObjectKind =
  | "subscription"
  | "checkout.session"
  | "invoice"
  | "other";

function asPlainRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/**
 * Classify a (possibly freshness-wrapped) Stripe payload by its top-level
 * `object` discriminator. `attachStripeFreshnessToRawPayload` spreads the
 * record so `object` stays at the top level for real Stripe objects; a
 * non-record body is `"other"`.
 */
export function classifyRawPayloadObject(
  rawPayload: unknown,
): StripeRawPayloadObjectKind {
  const record = asPlainRecord(rawPayload);
  if (!record) return "other";

  switch (record.object) {
    case "subscription":
      return "subscription";
    case "checkout.session":
      return "checkout.session";
    case "invoice":
      return "invoice";
    default:
      return "other";
  }
}

/**
 * Subscription-truth ranking. Higher = carries
 * `items.data[0].price.unit_amount` and the canonical period/plan shape the
 * admin dashboard + A15 backfill read. `checkout.session` outranks
 * `invoice` because it is the milder variant of the same writer issue
 * (A14 §Blast radius) — it at least precedes the sub in the lifecycle.
 */
function rawPayloadObjectQuality(kind: StripeRawPayloadObjectKind): number {
  switch (kind) {
    case "subscription":
      return 3;
    case "checkout.session":
      return 2;
    case "invoice":
      return 1;
    default:
      return 0;
  }
}

export type ResolveMonotonicRawPayloadResult = {
  /** The body the caller should persist into `subscriptions.raw_payload`. */
  rawPayload: unknown;
  /** True when a higher-quality persisted body was kept (observability). */
  preserved: boolean;
  existingKind: StripeRawPayloadObjectKind;
  incomingKind: StripeRawPayloadObjectKind;
};

/**
 * Decide which body becomes `subscriptions.raw_payload` for this write.
 *
 * Default: the incoming freshness-wrapped payload (unchanged behaviour).
 *
 * Guard: when the persisted body is strictly higher object-quality than
 * the incoming one (the bug: incoming `invoice` vs persisted
 * `subscription`), keep the persisted body but stamp it with the *incoming*
 * freshness so the monotonic ordering for the status/period/price columns
 * is exactly what it would have been had the incoming body been written.
 * The guard only ever blocks a *lower*-quality object; an equal-or-higher
 * object (a real `customer.subscription.updated` plan change) still
 * overwrites the body normally.
 */
export function resolveMonotonicRawPayload(params: {
  /** Incoming event body + `__stripe_freshness` — the default to persist. */
  incomingRawPayloadWithFreshness: unknown;
  /** Raw incoming event body (pre-freshness) — classified only. */
  incomingRawPayload: unknown;
  /** Currently-persisted `subscriptions.raw_payload` (may be null). */
  existingRawPayload: unknown;
  /** Freshness descriptor the persisted row must carry after this event. */
  incomingFreshness: unknown;
}): ResolveMonotonicRawPayloadResult {
  const incomingKind = classifyRawPayloadObject(params.incomingRawPayload);
  const existingKind = classifyRawPayloadObject(params.existingRawPayload);

  const existingIsHigherQuality =
    rawPayloadObjectQuality(existingKind) >
      rawPayloadObjectQuality(incomingKind);

  const existingRecord = asPlainRecord(params.existingRawPayload);

  if (!existingIsHigherQuality || !existingRecord) {
    return {
      rawPayload: params.incomingRawPayloadWithFreshness,
      preserved: false,
      existingKind,
      incomingKind,
    };
  }

  return {
    rawPayload: {
      ...existingRecord,
      __stripe_freshness: params.incomingFreshness,
    },
    preserved: true,
    existingKind,
    incomingKind,
  };
}

export function mapStripeSubscription(params: {
  userId: string;
  appId: string;
  providerCustomerId: string;
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
  /** ISO timestamp for updated_at (caller passes isoNow()). */
  nowIso: string;
}): SubscriptionInsert {
  return {
    user_id: params.userId,
    app_id: params.appId,
    provider: "stripe",

    customer_id: params.providerCustomerId,
    subscription_id: params.providerSubscriptionId,

    provider_customer_id: params.providerCustomerId,
    provider_subscription_id: params.providerSubscriptionId,
    provider_transaction_id: params.providerTransactionId ?? null,
    provider_original_transaction_id:
      params.providerOriginalTransactionId ?? null,
    product_id: params.productId ?? null,
    provider_product_id: params.providerProductId ?? params.productId ?? null,
    provider_price_id: params.providerPriceId ?? null,
    environment: params.environment,
    status: params.status ?? "revoked",
    current_period_start: params.currentPeriodStart ?? null,
    current_period_start_at: params.currentPeriodStart ?? null,
    current_period_end: params.currentPeriodEnd ?? null,
    current_period_end_at: params.currentPeriodEnd ?? null,
    cancel_at_period_end:
      typeof params.cancelAtPeriodEnd === "boolean"
        ? params.cancelAtPeriodEnd
        : false,
    canceled_at: params.canceledAt ?? null,
    ended_at: params.endedAt ?? null,
    metadata: (params.metadata ?? null) as Json | null,
    provider_metadata: (params.metadata ?? null) as Json | null,
    raw_payload: (params.rawPayload ?? null) as Json | null,
    updated_at: params.nowIso,
  };
}
