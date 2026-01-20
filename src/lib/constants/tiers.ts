// FILE: tiers.ts
// PATH: src/lib/constants/tiers.ts
// VERSION: MB-BLUE-97.9e — 2026-01-19 (+0700)
//
// Tier constants following Mercy Blade Design System v1.1
//
// FIX (VIP3 II REMOVAL + Free 482 bug — SAFE NORMALIZER):
// - VIP3 II is fully removed (no UI, no type, no counters).
// - normalizeTierOrUndefined(): strict tier parsing (unknown stays undefined).
// - parseTierString(): alias for normalizeTierOrUndefined (back-compat).
// - KEEP normalizeTier() legacy behavior (defaults to "free") for display paths.
//
// FIX (Type correctness):
// - Remove accidental duplicate union member: | 'vip3'
// - Normalize case before isValidTierId checks (so "VIP3" doesn't fail strict paths).

export const TIERS = {
  FREE: "Free / Miễn phí",
  VIP1: "VIP1 / VIP1",
  VIP2: "VIP2 / VIP2",
  VIP3: "VIP3 / VIP3",
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

export type TierId =
  | "free"
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

export const TIER_ORDER: TierId[] = [
  "free",
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

export const VIP_TIER_IDS = [
  "vip1",
  "vip2",
  "vip3",
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

export const TIER_ID_TO_LABEL: Record<TierId, TierValue> = {
  free: TIERS.FREE,
  vip1: TIERS.VIP1,
  vip2: TIERS.VIP2,
  vip3: TIERS.VIP3,
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
 * Order is ALL_TIER_IDS.
 */
export const TIER_COLUMNS: TierId[] = [...ALL_TIER_IDS];

export function getTierLabel(tier: TierId | string | null | undefined): string {
  const id = normalizeTier(tier);
  return tierIdToLabel(id);
}

export function getTierDescription(
  tier: TierId | string | null | undefined
): string {
  const id = normalizeTier(tier);

  if (id === "free") return "Free access rooms / Phòng miễn phí";
  if (id.startsWith("kids_")) return "Kids learning track / Lộ trình cho trẻ em";

  if (id.startsWith("vip")) {
    const upper = id.toUpperCase();
    return `${upper} access rooms / Phòng ${upper}`;
  }

  return "Access tier / Gói truy cập";
}

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
 * NOTE: permissive, defaults to "free".
 * Use normalizeTierOrUndefined() for strict counting.
 */
export function tierLabelToId(raw: string): TierId {
  const s = String(raw).toLowerCase().trim();

  // Free (explicit)
  if (s.includes("free") || s.includes("miễn phí")) return "free";

  // Kids
  if (s.includes("kids") && s.includes("1")) return "kids_1";
  if (s.includes("kids") && s.includes("2")) return "kids_2";
  if (s.includes("kids") && s.includes("3")) return "kids_3";
  if (s.includes("trẻ em") && s.includes("1")) return "kids_1";
  if (s.includes("trẻ em") && s.includes("2")) return "kids_2";
  if (s.includes("trẻ em") && s.includes("3")) return "kids_3";

  // VIP (high → low)
  for (let n = 9; n >= 1; n--) {
    if (s.includes(`vip${n}`)) return `vip${n}` as TierId;
  }

  return "free";
}

/**
 * Normalize any tier-like string into canonical TierId
 * DISPLAY DEFAULTS TO FREE
 */
export function normalizeTier(tier: string | null | undefined): TierId {
  if (!tier) return "free";

  const s = String(tier).toLowerCase().trim();
  if (!s) return "free";

  if (isValidTierId(s)) return s;
  return tierLabelToId(s);
}

/**
 * STRICT normalizer for counting/generation:
 * - returns TierId if recognized
 * - returns undefined if missing/unknown
 */
export function normalizeTierOrUndefined(
  tier: string | null | undefined
): TierId | undefined {
  if (!tier) return undefined;

  const s = String(tier).toLowerCase().trim();
  if (!s) return undefined;

  if (isValidTierId(s)) return s;

  // Free (explicit only)
  if (s.includes("free") || s.includes("miễn phí")) return "free";

  // Kids
  if (s.includes("kids")) {
    if (s.includes("1")) return "kids_1";
    if (s.includes("2")) return "kids_2";
    if (s.includes("3")) return "kids_3";
  }
  if (s.includes("trẻ em")) {
    if (s.includes("1")) return "kids_1";
    if (s.includes("2")) return "kids_2";
    if (s.includes("3")) return "kids_3";
  }

  // VIP
  // - strict: only accept vip[1-9] patterns
  // - allows "vip 3", "vip3", "VIP3 / VIP3", etc.
  const m = s.match(/(^|[^a-z0-9])vip\s*([1-9])([^a-z0-9]|$)/);
  if (m?.[2]) return `vip${m[2]}` as TierId;

  return undefined;
}

/**
 * Alias (back-compat).
 */
export const parseTierString = normalizeTierOrUndefined;
