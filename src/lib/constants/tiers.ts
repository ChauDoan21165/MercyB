// Tier constants following Mercy Blade Design System v1.1

export const TIERS = {
  FREE: "Free / Miễn phí",
  VIP1: "VIP1 / VIP1",
  VIP2: "VIP2 / VIP2",
  VIP3: "VIP3 / VIP3",
  VIP3II: "VIP3 II / VIP3 II",
  VIP4: "VIP4 / VIP4",
  VIP5: "VIP5 / VIP5",
  VIP6: "VIP6 / VIP6",
  VIP9: "VIP9 / Cấp VIP9",
  KIDS_1: "Kids Level 1 / Trẻ em cấp 1",
  KIDS_2: "Kids Level 2 / Trẻ em cấp 2",
  KIDS_3: "Kids Level 3 / Trẻ em cấp 3",
} as const;

export type TierKey = keyof typeof TIERS;
export type TierValue = typeof TIERS[TierKey];

export const VIP_TIER_IDS = ["vip1", "vip2", "vip3", "vip3ii", "vip4", "vip5", "vip6", "vip9"] as const;
export type VipTierId = typeof VIP_TIER_IDS[number];

// Helper to check if a string is a valid tier
export function isValidTier(tier: string): tier is TierValue {
  return Object.values(TIERS).includes(tier as TierValue);
}

// Normalize tier string for comparison
export function normalizeTier(tier: string): string {
  return tier.toLowerCase().trim();
}
