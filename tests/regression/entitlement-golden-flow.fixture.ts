import type { BackendEntitlement } from "@/lib/authService";

export type EntitlementGoldenCase = {
  name: string;
  entitlement: BackendEntitlement;
  expectedHasPremium: boolean;
};

const FUTURE_PERIOD_END = "2099-01-01T00:00:00.000Z";
const PAST_PERIOD_END = "2020-01-01T00:00:00.000Z";

export const entitlementGoldenCases: EntitlementGoldenCase[] = [
  {
    name: "pro active subscription",
    expectedHasPremium: true,
    entitlement: {
      is_premium: true,
      status: "active",
      source: "stripe",
      expires_at: FUTURE_PERIOD_END,
      current_period_end: FUTURE_PERIOD_END,
      tier_id: "premium_year",
      price_id: "price_stale_or_current_does_not_gate",
      plan_name: "Premium Year",
      cancel_at_period_end: false,
    },
  },
  {
    name: "trialing subscription",
    expectedHasPremium: true,
    entitlement: {
      is_premium: true,
      status: "trialing",
      source: "stripe",
      expires_at: FUTURE_PERIOD_END,
      current_period_end: FUTURE_PERIOD_END,
      tier_id: "premium_month",
      price_id: "price_trial_does_not_gate",
      plan_name: "Premium Trial",
      cancel_at_period_end: false,
    },
  },
  {
    name: "non-pro free user",
    expectedHasPremium: false,
    entitlement: {
      is_premium: false,
      status: "inactive",
      source: null,
      expires_at: null,
      current_period_end: null,
      tier_id: "level0",
      price_id: null,
      plan_name: null,
      cancel_at_period_end: null,
    },
  },
  {
    name: "expired premium-looking subscription",
    expectedHasPremium: false,
    entitlement: {
      is_premium: true,
      status: "canceled",
      source: "stripe",
      expires_at: PAST_PERIOD_END,
      current_period_end: PAST_PERIOD_END,
      tier_id: "premium_year",
      price_id: "price_old_does_not_gate",
      plan_name: "Premium Year",
      cancel_at_period_end: false,
    },
  },
];
