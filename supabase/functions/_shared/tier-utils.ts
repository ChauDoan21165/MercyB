// Tier normalization utilities for edge functions
// Mirrors the logic from src/lib/constants/tiers.ts

export type TierId = 
  | "free"
  | "vip1" | "vip2" | "vip3" | "vip3ii" | "vip4" | "vip5" | "vip6" | "vip9"
  | "kids_1" | "kids_2" | "kids_3";

export const VIP_TIER_IDS: TierId[] = [
  "vip1", "vip2", "vip3", "vip3ii", "vip4", "vip5", "vip6", "vip9"
];

export const KIDS_TIER_IDS: TierId[] = ["kids_1", "kids_2", "kids_3"];

export const ALL_TIER_IDS: TierId[] = [
  "free",
  ...VIP_TIER_IDS,
  ...KIDS_TIER_IDS,
];

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

  // Kids
  if (s.includes("kids level 1") || s.includes("kids_1") || s.includes("trẻ em cấp 1")) return "kids_1";
  if (s.includes("kids level 2") || s.includes("kids_2") || s.includes("trẻ em cấp 2")) return "kids_2";
  if (s.includes("kids level 3") || s.includes("kids_3") || s.includes("trẻ em cấp 3")) return "kids_3";

  // VIP3 II variants
  if (s.includes("vip3 ii") || s.includes("vip3ii")) return "vip3ii";

  // Normal VIP tiers
  if (s.includes("vip1")) return "vip1";
  if (s.includes("vip2")) return "vip2";
  if (s.includes("vip3")) return "vip3";
  if (s.includes("vip4")) return "vip4";
  if (s.includes("vip5")) return "vip5";
  if (s.includes("vip6")) return "vip6";
  if (s.includes("vip9")) return "vip9";

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
