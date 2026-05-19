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
    current_period_end: params.currentPeriodEnd ?? null,
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
