// src/lib/constants/tiers.ts
// Tier constants following Mercy Blade Design System v1.1

// Human-facing labels (what shows in UI / JSON)
export const TIERS = {
  FREE: "Free / Miễn phí",
  VIP1: "VIP1 / VIP1",
  VIP2: "VIP2 / VIP2",
  VIP3: "VIP3 / VIP3",
  VIP3II: "VIP3 II / VIP3 II", // Distinct label for VIP3II specialization
  VIP4: "VIP4 / VIP4",
  VIP5: "VIP5 / VIP5",
  VIP6: "VIP6 / VIP6",
  VIP7: "VIP7 / VIP7",
  VIP8: "VIP8 / VIP8",
  VIP9: "VIP9 / Cấp VIP9",
  KIDS_1: "Kids Level 1 / Trẻ em cấp 1",
  KIDS_2: "Kids Level 2 / Trẻ em cấp 2",
  KIDS_3: "Kids Level 3 / Trẻ em cấp 3",
} as const;

export type TierKey = keyof typeof TIERS;
export type TierValue = (typeof TIERS)[TierKey];

// Canonical TierId type - the single source of truth
export type TierId =
  | 'free'
  | 'vip1' | 'vip2' | 'vip3' | 'vip3ii' | 'vip4' | 'vip5'
  | 'vip6' | 'vip7' | 'vip8' | 'vip9'
  | 'kids_1' | 'kids_2' | 'kids_3';

// Tier order for access control hierarchy
export const TIER_ORDER: TierId[] = [
  'free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5',
  'vip6', 'vip7', 'vip8', 'vip9',
  'kids_1', 'kids_2', 'kids_3',
];

// Short, machine-friendly IDs used across the app
export const VIP_TIER_IDS = [
  "vip1", "vip2", "vip3", "vip3ii", "vip4", "vip5",
  "vip6", "vip7", "vip8", "vip9",
] as const;

export const KIDS_TIER_IDS: TierId[] = ['kids_1', 'kids_2', 'kids_3'];

export const ALL_TIER_IDS: TierId[] = [
  'free',
  'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5',
  'vip6', 'vip7', 'vip8', 'vip9',
  'kids_1', 'kids_2', 'kids_3',
];

export type VipTierId = (typeof VIP_TIER_IDS)[number];
export type KidsTierId = 'kids_1' | 'kids_2' | 'kids_3';

// Canonical mapping: TierId -> human label
export const TIER_ID_TO_LABEL: Record<TierId, TierValue> = {
  free: TIERS.FREE,
  vip1: TIERS.VIP1,
  vip2: TIERS.VIP2,
  vip3: TIERS.VIP3,
  vip3ii: TIERS.VIP3II, // VIP3II has distinct label for correct room filtering
  vip4: TIERS.VIP4,
  vip5: TIERS.VIP5,
  vip6: TIERS.VIP6,
  vip7: TIERS.VIP7,
  vip8: TIERS.VIP8,
  vip9: TIERS.VIP9,
  kids_1: TIERS.KIDS_1,
  kids_2: TIERS.KIDS_2,
  kids_3: TIERS.KIDS_3,
};

/**
 * Check if a tier is a kids tier
 */
export function isKidsTier(tier: TierId): boolean {
  return tier.startsWith('kids_');
}

// Helper: validate human-facing label
export function isValidTier(tier: string): tier is TierValue {
  return Object.values(TIERS).includes(tier as TierValue);
}

// Helper: validate tier ID
export function isValidTierId(id: string): id is TierId {
  return ALL_TIER_IDS.includes(id as TierId);
}

// Map TierId -> human label
export function tierIdToLabel(id: TierId): TierValue {
  return TIER_ID_TO_LABEL[id];
}

/**
 * Best-effort mapping from label or messy string -> TierId
 * Handles all variations: "Free / Miễn phí", "Free", "free",
 * "Kids 1", "Kids Level 1", "kids_level_1", "kids_1", etc.
 */
export function tierLabelToId(raw: string): TierId {
  const s = raw.toLowerCase().trim();

  // Kids variations: "Kids 1", "Kids Level 1", "kids_level_1", "kids_1", "trẻ em cấp 1"
  if (s.includes("kids") && (s.includes("1") || s.includes("level 1"))) return "kids_1";
  if (s.includes("kids") && (s.includes("2") || s.includes("level 2"))) return "kids_2";
  if (s.includes("kids") && (s.includes("3") || s.includes("level 3"))) return "kids_3";
  if (s.includes("kids_level_1") || s === "kids_1") return "kids_1";
  if (s.includes("kids_level_2") || s === "kids_2") return "kids_2";
  if (s.includes("kids_level_3") || s === "kids_3") return "kids_3";
  if (s.includes("trẻ em") && s.includes("1")) return "kids_1";
  if (s.includes("trẻ em") && s.includes("2")) return "kids_2";
  if (s.includes("trẻ em") && s.includes("3")) return "kids_3";

  // VIP tiers (check longer ones first to avoid partial matches)
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

  // Free variations: "Free / Miễn phí", "Free", "free", "miễn phí"
  if (s.includes("free") || s.includes("miễn phí")) return "free";

  // Safe default: treat unknown as free
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
