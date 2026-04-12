// PATH: supabase/functions/_shared/tier-utils.ts
// File: tier-utils.ts

// Tier normalization utilities for edge functions
// Mirrors the new paid-access policy:
// - premium_month / premium_year unlock the whole paid repo
// - Level 1..Level 9 remain curriculum labels / legacy compatible tiers
// - kids tiers remain separate

export type TierId =
  | "level0"
  | "premium_month"
  | "premium_year"
  | "level1"
  | "level2"
  | "level3"
  | "level4"
  | "level5"
  | "level6"
  | "level7"
  | "level8"
  | "level9"
  | "kids_1"
  | "kids_2"
  | "kids_3";

export const PAID_BILLING_TIER_IDS: TierId[] = [
  "premium_month",
  "premium_year",
];

export const VIP_TIER_IDS: TierId[] = [
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
  "level6",
  "level7",
  "level8",
  "level9",
];

export const KIDS_TIER_IDS: TierId[] = ["kids_1", "kids_2", "kids_3"];

export const ALL_TIER_IDS: TierId[] = [
  "level0",
  ...PAID_BILLING_TIER_IDS,
  ...VIP_TIER_IDS,
  ...KIDS_TIER_IDS,
];

/**
 * Kept mainly for display / ordering helpers.
 * Do not use this as a strict billing ladder.
 */
export const TIER_ORDER: TierId[] = [
  "level0",
  "premium_month",
  "premium_year",
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
  "level6",
  "level7",
  "level8",
  "level9",
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
  level0: 0,
  premium_month: 9,
  premium_year: 9,
  level1: 1,
  level2: 2,
  level3: 3,
  level4: 4,
  level5: 5,
  level6: 6,
  level7: 7,
  level8: 8,
  level9: 9,
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

function normalizeText(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

/**
 * Normalize any tier-like string (DB, JSON, Supabase, legacy)
 * into a canonical TierId.
 *
 * Handles formats like:
 * - "Level 0 / Miễn phí" -> "level0"
 * - "premium" -> "premium_month"
 * - "Premium Month" -> "premium_month"
 * - "Premium Year" -> "premium_year"
 * - "Level 1 / Level 1" -> "level1"
 * - "Level 9 / Cấp Level 9" -> "level9"
 * - "Level 3 II / Level 3 II" -> "level3"
 * - "Kids Level 1 / Trẻ em cấp 1" -> "kids_1"
 */
export function normalizeTier(tier: string | null | undefined): TierId {
  const s = normalizeText(tier);

  if (!s) return "level0";

  // Exact canonical ids first
  if (isValidTierId(s)) {
    return s;
  }

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
  if (
    s === "kids_1" ||
    s === "kids-1" ||
    s === "kids_l1" ||
    s === "kids level 1" ||
    s.includes("kids_level_1") ||
    s.includes("kids level 1") ||
    s.includes("kids-l1") ||
    s.includes("kids_l1")
  ) {
    return "kids_1";
  }

  if (
    s === "kids_2" ||
    s === "kids-2" ||
    s === "kids_l2" ||
    s === "kids level 2" ||
    s.includes("kids_level_2") ||
    s.includes("kids level 2") ||
    s.includes("kids-l2") ||
    s.includes("kids_l2")
  ) {
    return "kids_2";
  }

  if (
    s === "kids_3" ||
    s === "kids-3" ||
    s === "kids_l3" ||
    s === "kids level 3" ||
    s.includes("kids_level_3") ||
    s.includes("kids level 3") ||
    s.includes("kids-l3") ||
    s.includes("kids_l3")
  ) {
    return "kids_3";
  }

  if (s.includes("kids") && (s.includes("level 1") || s.includes(" 1") || s.endsWith("1"))) {
    return "kids_1";
  }
  if (s.includes("kids") && (s.includes("level 2") || s.includes(" 2") || s.endsWith("2"))) {
    return "kids_2";
  }
  if (s.includes("kids") && (s.includes("level 3") || s.includes(" 3") || s.endsWith("3"))) {
    return "kids_3";
  }

  if (s.includes("trẻ em") && s.includes("1")) return "kids_1";
  if (s.includes("trẻ em") && s.includes("2")) return "kids_2";
  if (s.includes("trẻ em") && s.includes("3")) return "kids_3";

  // VIP tiers
  if (s.includes("level9") || s === "level9") return "level9";
  if (s.includes("level8") || s === "level8") return "level8";
  if (s.includes("level7") || s === "level7") return "level7";
  if (s.includes("level6") || s === "level6") return "level6";
  if (s.includes("level5") || s === "level5") return "level5";
  if (s.includes("level4") || s === "level4") return "level4";

  // Level 3 II collapses to level3
  if (
    s.includes("level3 ii") ||
    s.includes("vip3ii") ||
    s.includes("level3") ||
    s === "level3"
  ) {
    return "level3";
  }

  if (s.includes("level2") || s === "level2") return "level2";
  if (s.includes("level1") || s === "level1") return "level1";

  // Level 0
  if (s.includes("level0") || s.includes("miễn phí") || s.includes("mien phi")) {
    return "level0";
  }

  // Safe default
  return "level0";
}

/**
 * Check if a string is a valid tier ID
 */
export function isValidTierId(id: string): id is TierId {
  return ALL_TIER_IDS.includes(normalizeText(id) as TierId);
}

/**
 * Repo-wide access rule:
 * - level0 can access only level0
 * - paid billing plans unlock all adult VIP repo content
 * - legacy VIP tiers also unlock adult VIP repo content
 * - kids tiers can access only kids progression
 * - adult users may access kids resources only when they have paid-style adult access
 */
export function verifyRepoAccess(userTier: TierId, resourceTier: TierId): boolean {
  if (resourceTier === "level0") return true;

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