// src/lib/constants/tiers.ts
// MB-BLUE-97.9 — 2025-12-29 (+0700)
// Tier constants following Mercy Blade Design System v1.1
//
// FIX (BUILD-BLOCKER):
// - Provide missing named exports expected by UI modules:
//   TIER_COLUMNS, getTierLabel, getTierDescription
// - Keep existing TierId / normalizeTier logic unchanged.

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
  | "free"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip3ii"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9"
  | "kids_1"
  | "kids_2"
  | "kids_3";

// Tier order for access control hierarchy
export const TIER_ORDER: TierId[] = [
  "free",
  "vip1",
  "vip2",
  "vip3",
  "vip3ii",
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

// Short, machine-friendly IDs used across the app
export const VIP_TIER_IDS = [
  "vip1",
  "vip2",
  "vip3",
  "vip3ii",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
  "vip8",
  "vip9",
] as const;

export const KIDS_TIER_IDS: TierId[] = ["kids_1", "kids_2", "kids_3"];

export const ALL_TIER_IDS: TierId[] = [
  "free",
  "vip1",
  "vip2",
  "vip3",
  "vip3ii",
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

export type VipTierId = (typeof VIP_TIER_IDS)[number];
export type KidsTierId = "kids_1" | "kids_2" | "kids_3";

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
  vip7: TIERS.VIP7,
  vip8: TIERS.VIP8,
  vip9: TIERS.VIP9,
  kids_1: TIERS.KIDS_1,
  kids_2: TIERS.KIDS_2,
  kids_3: TIERS.KIDS_3,
};

/**
 * UI columns (used by tier pages / filters).
 * Keep this simple and stable: order is ALL_TIER_IDS.
 */
export const TIER_COLUMNS: TierId[] = [...ALL_TIER_IDS];

/**
 * Back-compat: some UI expects getTierLabel().
 */
export function getTierLabel(tier: TierId | string | null | undefined): string {
  const id = normalizeTier(tier);
  return tierIdToLabel(id);
}

/**
 * Back-compat: some UI expects getTierDescription().
 * Short descriptions are safe defaults; you can refine later.
 */
export function getTierDescription(tier: TierId | string | null | undefined): string {
  const id = normalizeTier(tier);

  if (id === "free") return "Free access rooms / Phòng miễn phí";
  if (id.startsWith("kids_")) return "Kids learning track / Lộ trình cho trẻ em";
  if (id === "vip3ii") return "VIP3 II specialization / Chuyên sâu VIP3 II";

  if (id.startsWith("vip")) {
    // e.g. vip6 -> "VIP6"
    const upper = id.toUpperCase();
    return `${upper} access rooms / Phòng ${upper}`;
  }

  return "Access tier / Gói truy cập";
}

/**
 * Check if a tier is a kids tier
 */
export function isKidsTier(tier: TierId): boolean {
  return tier.startsWith("kids_");
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
 */
export function tierLabelToId(raw: string): TierId {
  const s = raw.toLowerCase().trim();

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

  // VIP tiers (check longer ones first)
  if (s.includes("vip9") || s === "vip9") return "vip9";
  if (s.includes("vip8") || s === "vip8") return "vip8";
  if (s.includes("vip7") || s === "vip7") return "vip7";
  if (s.includes("vip6") || s === "vip6") return "vip6";
  if (s.includes("vip5") || s === "vip5") return "vip5";
  if (s.includes("vip4") || s === "vip4") return "vip4";
  if (s.includes("vip3ii") || s.includes("vip3 ii") || s === "vip3ii") return "vip3ii";
  if (s.includes("vip3") || s === "vip3") return "vip3";
  if (s.includes("vip2") || s === "vip2") return "vip2";
  if (s.includes("vip1") || s === "vip1") return "vip1";

  // Free variations
  if (s.includes("free") || s.includes("miễn phí")) return "free";

  return "free";
}

/**
 * Normalize any tier-like string into canonical TierId
 */
export function normalizeTier(tier: string | null | undefined): TierId {
  if (!tier) return "free";
  if (isValidTierId(tier)) return tier; // already canonical
  return tierLabelToId(tier);
}
