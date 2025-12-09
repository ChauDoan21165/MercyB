// Tier normalization utilities for edge functions
// Mirrors the logic from src/lib/constants/tiers.ts

export type TierId = 
  | "free"
  | "vip1" | "vip2" | "vip3" | "vip3ii" | "vip4" | "vip5"
  | "vip6" | "vip7" | "vip8" | "vip9"
  | "kids_1" | "kids_2" | "kids_3";

export const VIP_TIER_IDS: TierId[] = [
  "vip1", "vip2", "vip3", "vip3ii", "vip4", "vip5", "vip6", "vip7", "vip8", "vip9"
];

export const KIDS_TIER_IDS: TierId[] = ["kids_1", "kids_2", "kids_3"];

export const ALL_TIER_IDS: TierId[] = [
  "free",
  ...VIP_TIER_IDS,
  ...KIDS_TIER_IDS,
];

export const TIER_ORDER: TierId[] = [
  'free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5',
  'vip6', 'vip7', 'vip8', 'vip9',
  'kids_1', 'kids_2', 'kids_3',
];

/**
 * Canonical tier levels per authoritative tier structure:
 * FREE = 0, VIP1 = 1, VIP2 = 2, VIP3 = 3, VIP3II = 3 (same level as VIP3), 
 * VIP4 = 4, VIP5 = 5, VIP6 = 6, VIP7 = 7, VIP8 = 8, VIP9 = 9
 */
export const TIER_LEVEL: Record<TierId, number> = {
  free: 0,
  vip1: 1,
  vip2: 2,
  vip3: 3,
  vip3ii: 3, // Same level as VIP3 - it's a specialization, not a higher tier
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
  return tier.startsWith('kids_');
}

/**
 * Normalize any tier-like string (DB, JSON, Supabase, legacy)
 * into a canonical TierId: "free" | "vip1" | ... | "kids_3"
 * 
 * Handles formats like:
 * - "Free / Miễn phí" -> "free"
 * - "VIP1 / VIP1" -> "vip1"
 * - "VIP9 / Cấp VIP9" -> "vip9"
 * - "Kids Level 1 / Trẻ em cấp 1" -> "kids_1"
 */
export function normalizeTier(tier: string | null | undefined): TierId {
  if (!tier) return "free";
  
  const s = tier.toLowerCase().trim();

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

  // VIP tiers (check higher numbers first, and VIP3II before VIP3)
  if (s.includes("vip9") || s === "vip9") return "vip9";
  if (s.includes("vip8") || s === "vip8") return "vip8";
  if (s.includes("vip7") || s === "vip7") return "vip7";
  if (s.includes("vip6") || s === "vip6") return "vip6";
  if (s.includes("vip5") || s === "vip5") return "vip5";
  if (s.includes("vip4") || s === "vip4") return "vip4";
  // VIP3II must come before VIP3 to avoid false match
  if (s.includes("vip3ii") || s.includes("vip3 ii") || s === "vip3ii") return "vip3ii";
  if (s.includes("vip3") || s === "vip3") return "vip3";
  if (s.includes("vip2") || s === "vip2") return "vip2";
  if (s.includes("vip1") || s === "vip1") return "vip1";

  // Free
  if (s.includes("free") || s.includes("miễn phí")) return "free";

  // Safe default (no crash): treat unknown as free
  return "free";
}

/**
 * Check if a string is a valid tier ID
 */
export function isValidTierId(id: string): id is TierId {
  return ALL_TIER_IDS.includes(id as TierId);
}
