export type BillingProvider = "stripe" | "apple" | "google";
export type BillingEnvironment = "sandbox" | "production";

export const SHARED_SUBSCRIPTION_STATUSES = [
  "active",
  "trialing",
  "grace_period",
  "past_due",
  "paused",
  "expired",
  "revoked",
] as const;

export type SharedSubscriptionStatus =
  (typeof SHARED_SUBSCRIPTION_STATUSES)[number];

export type PremiumStatus = "active" | "inactive";

export interface EntitlementResult {
  status: PremiumStatus;
  expires_at: string | null;
  source: BillingProvider | null;
}

export interface SubscriptionRow {
  user_id: string;
  provider: BillingProvider;
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;
  provider_transaction_id?: string | null;
  provider_original_transaction_id?: string | null;
  product_id?: string | null;
  environment?: BillingEnvironment | null;
  status: SharedSubscriptionStatus;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
  canceled_at?: string | null;
  ended_at?: string | null;
  raw_payload?: unknown;
}