// FILE: src/billing/stripe/mapStripeSubscription.ts
// VERSION: prettified / sectioned

export type StripeMappedSubscription = {
  user_id: string;
  provider: "stripe";
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  provider_transaction_id: string | null;
  provider_original_transaction_id: string | null;
  product_id: string | null;
  environment: "sandbox" | "production";
  status:
    | "active"
    | "trialing"
    | "grace_period"
    | "past_due"
    | "paused"
    | "expired"
    | "canceled"
    | "revoked"
    | "incomplete";
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  ended_at: string | null;
  raw_payload: unknown;
};

export function mapStripeSubscription(params: {
  userId: string;
  providerCustomerId: string | null;
  providerSubscriptionId: string;
  providerTransactionId?: string | null;
  providerOriginalTransactionId?: string | null;
  productId?: string | null;
  environment: "production" | "sandbox";
  status?: StripeMappedSubscription["status"] | string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean | null;
  canceledAt?: string | null;
  endedAt?: string | null;
  rawPayload: unknown;
}): StripeMappedSubscription {
  return {
    user_id: params.userId,
    provider: "stripe",
    provider_customer_id: params.providerCustomerId ?? null,
    provider_subscription_id: params.providerSubscriptionId ?? null,
    provider_transaction_id: params.providerTransactionId ?? null,
    provider_original_transaction_id:
      params.providerOriginalTransactionId ?? params.providerSubscriptionId,
    product_id: params.productId ?? null,
    environment: params.environment,
    status:
      (params.status as StripeMappedSubscription["status"] | null | undefined) ??
      "incomplete",
    current_period_start: params.currentPeriodStart ?? null,
    current_period_end: params.currentPeriodEnd ?? null,
    cancel_at_period_end: Boolean(params.cancelAtPeriodEnd),
    canceled_at: params.canceledAt ?? null,
    ended_at: params.endedAt ?? null,
    raw_payload: params.rawPayload,
  };
}