import type {
  EntitlementResult,
  PremiumStatus,
  SubscriptionRow,
} from "./types";

function toTime(value: string | null | undefined): number {
  if (!value) return Number.NEGATIVE_INFINITY;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}

function isPastDueStillValid(sub: SubscriptionRow, nowMs: number): boolean {
  if (sub.status !== "past_due") return false;
  const endMs = toTime(sub.current_period_end);
  return endMs > nowMs;
}

function isPremiumEligible(sub: SubscriptionRow, nowMs: number): boolean {
  if (sub.status === "active") return true;
  if (sub.status === "trialing") return true;
  if (sub.status === "grace_period") return true;
  if (isPastDueStillValid(sub, nowMs)) return true;

  return false;
}

function mapWinningStatus(sub: SubscriptionRow): PremiumStatus {
  if (sub.status === "grace_period") return "grace_period";
  if (sub.status === "past_due") return "past_due";
  if (sub.status === "trialing") return "active";
  if (sub.status === "active") return "active";

  return "expired";
}

export function computeEntitlement(
  subscriptions: SubscriptionRow[],
  now: Date = new Date()
): EntitlementResult {
  const nowMs = now.getTime();

  const eligible = subscriptions.filter((sub) => {
    if (sub.status === "expired") return false;
    if (sub.status === "canceled") return false;
    if (sub.status === "revoked") return false;
    if (sub.status === "paused") return false;

    return isPremiumEligible(sub, nowMs);
  });

  if (eligible.length === 0) {
    return {
      isPremium: false,
      premiumStatus: "free",
      premiumSource: "none",
      premiumExpiresAt: null,
    };
  }

  const winner = eligible.sort((a, b) => {
    return toTime(b.current_period_end) - toTime(a.current_period_end);
  })[0];

  return {
    isPremium: true,
    premiumStatus: mapWinningStatus(winner),
    premiumSource: winner.provider,
    premiumExpiresAt: winner.current_period_end,
  };
}