import type { SharedSubscriptionStatus, SubscriptionRow } from "../types";

export type StripeMappedSubscription = Pick<
  SubscriptionRow,
  | "user_id"
  | "provider"
  | "provider_customer_id"
  | "provider_subscription_id"
  | "provider_transaction_id"
  | "provider_original_transaction_id"
  | "product_id"
  | "environment"
  | "status"
  | "current_period_start"
  | "current_period_end"
  | "cancel_at_period_end"
  | "canceled_at"
  | "ended_at"
  | "raw_payload"
>;

export function mapStripeSubscription(params: {
  userId: string;
  providerCustomerId: string | null;
  providerSubscriptionId: string;
  providerTransactionId?: string | null;
  providerOriginalTransactionId?: string | null;
  productId?: string | null;
  environment: "production" | "sandbox";
  status?: SharedSubscriptionStatus | null;
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
    status: params.status ?? "expired",
    current_period_start: params.currentPeriodStart ?? null,
    current_period_end: params.currentPeriodEnd ?? null,
    cancel_at_period_end: Boolean(params.cancelAtPeriodEnd),
    canceled_at: params.canceledAt ?? null,
    ended_at: params.endedAt ?? null,
    raw_payload: params.rawPayload,
  };
}