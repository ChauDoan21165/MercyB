export type Provider = "stripe" | "apple" | "google" | "none";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "paused"
  | "expired"
  | "canceled"
  | "revoked";

export type PremiumStatus =
  | "free"
  | "active"
  | "grace_period"
  | "past_due"
  | "expired";

export interface SubscriptionRow {
  user_id: string;
  provider: Exclude<Provider, "none">;
  status: SubscriptionStatus;
  current_period_end: string | null;
  cancel_at_period_end?: boolean | null;
  ended_at?: string | null;
}

export interface EntitlementResult {
  isPremium: boolean;
  premiumStatus: PremiumStatus;
  premiumSource: Provider;
  premiumExpiresAt: string | null;
}