// src/lib/constants/tiers.ts
// Tier constants following Mercy Blade Design System v1.1

// Human-facing labels (what shows in UI / JSON)
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
export type TierValue = (typeof TIERS)[TierKey];

// Short, machine-friendly IDs used across the app
export const VIP_TIER_IDS = [
  "vip1",
  "vip2",
  "vip3",
  "vip3ii",
  "vip4",
  "vip5",
  "vip6",
  "vip9",
] as const;

export const KIDS_TIER_IDS = ["kids_1", "kids_2", "kids_3"] as const;

export const ALL_TIER_IDS = [
  "free",
  ...VIP_TIER_IDS,
  ...KIDS_TIER_IDS,
] as const;

export type VipTierId = (typeof VIP_TIER_IDS)[number];
export type KidsTierId = (typeof KIDS_TIER_IDS)[number];
export type TierId = (typeof ALL_TIER_IDS)[number];

// Canonical mapping: TierId -> human label
export const TIER_ID_TO_LABEL: Record<TierId, TierValue> = {
  free: TIERS.FREE,
  vip1: TIERS.VIP1,
  vip2: TIERS.VIP2,
  vip3: TIERS.VIP3,
  vip3ii: TIERS.VIP3II,
  vip4: TIERS.VIP4,
  vip5: TIERS.VIP5,
  vip6: TIERS.VIP6,
  vip9: TIERS.VIP9,
  kids_1: TIERS.KIDS_1,
  kids_2: TIERS.KIDS_2,
  kids_3: TIERS.KIDS_3,
};

// Helper: validate human-facing label
export function isValidTier(tier: string): tier is TierValue {
  return Object.values(TIERS).includes(tier as TierValue);
}

// Helper: validate tier ID
export function isValidTierId(id: string): id is TierId {
  return (ALL_TIER_IDS as readonly string[]).includes(id);
}

// Map TierId -> human label
export function tierIdToLabel(id: TierId): TierValue {
  return TIER_ID_TO_LABEL[id];
}

// Best-effort mapping from label or messy string -> TierId
export function tierLabelToId(raw: string): TierId {
  const s = raw.toLowerCase().trim();

  // Kids
  if (s.includes("kids level 1") || s.includes("kids_1")) return "kids_1";
  if (s.includes("kids level 2") || s.includes("kids_2")) return "kids_2";
  if (s.includes("kids level 3") || s.includes("kids_3")) return "kids_3";

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
 * Normalize any tier-like string (DB, JSON, Supabase, legacy)
 * into a canonical TierId: "free" | "vip1" | ... | "kids_3"
 *
 * This is what you should pass into access control & routing.
 */
export function normalizeTier(tier: string | null | undefined): TierId {
  if (!tier) return "free";
  return tierLabelToId(tier);
}
