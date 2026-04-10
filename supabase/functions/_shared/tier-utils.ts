// PATH: supabase/functions/_shared/tier-utils.ts

// Tier normalization utilities for edge functions
// Mirrors the new paid-access policy:
// - premium_month / premium_year unlock the whole paid repo
// - VIP1..VIP9 remain curriculum labels / legacy compatible tiers
// - kids tiers remain separate

export type TierId =
  | "free"
  | "premium_month"
  | "premium_year"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9"
  | "kids_1"
  | "kids_2"
  | "kids_3";

export const PAID_BILLING_TIER_IDS: TierId[] = [
  "premium_month",
  "premium_year",
];

export const VIP_TIER_IDS: TierId[] = [
  "vip1",
  "vip2",
  "vip3",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
  "vip8",
  "vip9",
];

export const KIDS_TIER_IDS: TierId[] = ["kids_1", "kids_2", "kids_3"];

export const ALL_TIER_IDS: TierId[] = [
  "free",
  ...PAID_BILLING_TIER_IDS,
  ...VIP_TIER_IDS,
  ...KIDS_TIER_IDS,
];

/**
 * Kept mainly for display / ordering helpers.
 * Do not use this as a strict billing ladder.
 */
export const TIER_ORDER: TierId[] = [
  "free",
  "premium_month",
  "premium_year",
  "vip1",
  "vip2",
  "vip3",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
  "vip8",
  "vip9",
  "kids_1",
  "kids_2",
  "kids_3",
];

/**
 * Canonical numeric levels for compatibility.
 *
 * Important:
 * - premium_month / premium_year map to 9 so paid users unlock all VIP rooms
 * - kids tiers keep their own curriculum levels
 */
export const TIER_LEVEL: Record<TierId, number> = {
  free: 0,
  premium_month: 9,
  premium_year: 9,
  vip1: 1,
  vip2: 2,
  vip3: 3,
  vip4: 4,
  vip5: 5,
  vip6: 6,
  vip7: 7,
  vip8: 8,
  vip9: 9,
  kids_1: 1,
  kids_2: 2,
  kids_3: 3,
};

/**
 * Get the numeric level for a tier
 */
export function getTierLevel(tier: TierId): number {
  return TIER_LEVEL[tier] ?? 0;
}

/**
 * Check if a tier is a kids tier
 */
export function isKidsTier(tier: TierId): boolean {
  return tier.startsWith("kids_");
}

/**
 * Check if a tier is one of the new paid billing plans
 */
export function isPaidBillingTier(tier: TierId): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

/**
 * Check if a tier is a legacy VIP curriculum tier
 */
export function isLegacyVipTier(tier: TierId): boolean {
  return /^vip[1-9]$/.test(tier);
}

/**
 * Check if a tier should be treated as paid repo access
 */
export function hasPaidRepoAccess(tier: TierId): boolean {
  return isPaidBillingTier(tier) || isLegacyVipTier(tier);
}

/**
 * Normalize any tier-like string (DB, JSON, Supabase, legacy)
 * into a canonical TierId.
 *
 * Handles formats like:
 * - "Free / Miễn phí" -> "free"
 * - "premium" -> "premium_month"
 * - "Premium Month" -> "premium_month"
 * - "Premium Year" -> "premium_year"
 * - "VIP1 / VIP1" -> "vip1"
 * - "VIP9 / Cấp VIP9" -> "vip9"
 * - "VIP3 II / VIP3 II" -> "vip3"
 * - "Kids Level 1 / Trẻ em cấp 1" -> "kids_1"
 */
export function normalizeTier(tier: string | null | undefined): TierId {
  if (!tier) return "free";

  const s = tier.toLowerCase().trim();

  // Paid billing variations
  if (
    s === "premium_month" ||
    s === "premium month" ||
    s === "monthly" ||
    s === "month" ||
    s === "premium" ||
    s.includes("premium_month") ||
    s.includes("premium month") ||
    s.includes("monthly")
  ) {
    return "premium_month";
  }

  if (
    s === "premium_year" ||
    s === "premium year" ||
    s === "yearly" ||
    s === "annual" ||
    s === "year" ||
    s.includes("premium_year") ||
    s.includes("premium year") ||
    s.includes("yearly") ||
    s.includes("annual")
  ) {
    return "premium_year";
  }

  // Kids variations
  if (s.includes("kids") && (s.includes("1") || s.includes("level 1"))) return "kids_1";
  if (s.includes("kids") && (s.includes("2") || s.includes("level 2"))) return "kids_2";
  if (s.includes("kids") && (s.includes("3") || s.includes("level 3"))) return "kids_3";
  if (s.includes("kids_level_1") || s === "kids_1") return "kids_1";
  if (s.includes("kids_level_2") || s === "kids_2") return "kids_2";
  if (s.includes("kids_level_3") || s === "kids_3") return "kids_3";
  if (s.includes("trẻ em") && s.includes("1")) return "kids_1";
  if (s.includes("trẻ em") && s.includes("2")) return "kids_2";
  if (s.includes("trẻ em") && s.includes("3")) return "kids_3";

  // VIP tiers
  if (s.includes("vip9") || s === "vip9") return "vip9";
  if (s.includes("vip8") || s === "vip8") return "vip8";
  if (s.includes("vip7") || s === "vip7") return "vip7";
  if (s.includes("vip6") || s === "vip6") return "vip6";
  if (s.includes("vip5") || s === "vip5") return "vip5";
  if (s.includes("vip4") || s === "vip4") return "vip4";

  // VIP3 II collapses to vip3
  if (
    s.includes("vip3 ii") ||
    s.includes("vip3ii") ||
    s.includes("vip3") ||
    s === "vip3"
  ) {
    return "vip3";
  }

  if (s.includes("vip2") || s === "vip2") return "vip2";
  if (s.includes("vip1") || s === "vip1") return "vip1";

  // Free
  if (s.includes("free") || s.includes("miễn phí") || s.includes("mien phi")) {
    return "free";
  }

  // Safe default
  return "free";
}

/**
 * Check if a string is a valid tier ID
 */
export function isValidTierId(id: string): id is TierId {
  return ALL_TIER_IDS.includes(id as TierId);
}

/**
 * Repo-wide access rule:
 * - free can access only free
 * - paid billing plans unlock all adult VIP repo content
 * - legacy VIP tiers also unlock adult VIP repo content
 * - kids tiers can access only kids progression
 */
export function verifyRepoAccess(userTier: TierId, resourceTier: TierId): boolean {
  if (resourceTier === "free") return true;

  if (isKidsTier(userTier)) {
    if (!isKidsTier(resourceTier)) return false;
    return getTierLevel(userTier) >= getTierLevel(resourceTier);
  }

  if (isKidsTier(resourceTier)) {
    return hasPaidRepoAccess(userTier);
  }

  if (hasPaidRepoAccess(userTier)) return true;

  return false;
}