// src/lib/constants/tiers.ts

export type TierId =
  | "level0"
  | "premium_month"
  | "premium_year"
  // legacy values still kept so older files can compile during migration
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

export type TierValue = TierId;

export const TIER_IDS: readonly TierId[] = [
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
] as const;

// Back-compat exports expected by older callers
export const ALL_TIER_IDS: readonly TierId[] = TIER_IDS;
export const TIERS: readonly TierId[] = TIER_IDS;

export const tierIdToLabel: Record<TierId, string> = {
  level0: "Level 0",
  premium_month: "Premium Monthly",
  premium_year: "Premium Yearly",
  level1: "Level 1",
  level2: "Level 2",
  level3: "Level 3",
  level4: "Level 4",
  level5: "Level 5",
  level6: "Level 6",
  level7: "Level 7",
  level8: "Level 8",
  level9: "Level 9",
  kids_1: "Kids 1",
  kids_2: "Kids 2",
  kids_3: "Kids 3",
};

export const TIER_ID_TO_LABEL: Record<TierId, string> = tierIdToLabel;

export const KIDS_TIER_IDS: readonly TierId[] = [
  "kids_1",
  "kids_2",
  "kids_3",
] as const;

const tierLabelToIdMap: Record<string, TierId> = Object.fromEntries(
  Object.entries(tierIdToLabel).map(([tierId, label]) => [label.toLowerCase(), tierId as TierId]),
) as Record<string, TierId>;

export const tierLabelToId: Record<string, TierId> = tierLabelToIdMap;

function clean(input: unknown): string {
  return String(input ?? "").trim().toLowerCase();
}

export function isTierId(value: unknown): value is TierId {
  return (TIER_IDS as readonly string[]).includes(clean(value));
}

export function isValidTierId(value: unknown): value is TierId {
  return isTierId(value);
}

export function isValidTier(value: unknown): value is TierId {
  return isTierId(value);
}

export function isKidsTier(value: unknown): value is TierId {
  const normalized = normalizeTierOrUndefined(value);
  return normalized !== undefined && (KIDS_TIER_IDS as readonly TierId[]).includes(normalized);
}

export function normalizeTier(input: unknown): TierId {
  return normalizeTierOrUndefined(input) ?? "level0";
}

export function normalizeTierOrUndefined(input: unknown): TierId | undefined {
  const raw = clean(input);

  if (!raw) return undefined;

  // direct exact match
  if (isTierId(raw)) return raw;

  // current product model
  if (
    raw === "premium_month" ||
    raw === "premium-month" ||
    raw === "premium month" ||
    raw === "monthly" ||
    raw === "month" ||
    raw === "1 month premium" ||
    raw === "one month premium"
  ) {
    return "premium_month";
  }

  if (
    raw === "premium_year" ||
    raw === "premium-year" ||
    raw === "premium year" ||
    raw === "yearly" ||
    raw === "year" ||
    raw === "1 year premium" ||
    raw === "one year premium"
  ) {
    return "premium_year";
  }

  if (raw === "level0" || raw.includes("miễn phí") || raw.includes("mien phi")) {
    return "level0";
  }

  // legacy VIP mappings
  if (raw === "level1" || raw.includes("level1")) return "level1";
  if (raw === "level2" || raw.includes("level2")) return "level2";
  if (raw === "level3" || raw.includes("level3 ii") || raw.includes("level3")) return "level3";
  if (raw === "level4" || raw.includes("level4")) return "level4";
  if (raw === "level5" || raw.includes("level5")) return "level5";
  if (raw === "level6" || raw.includes("level6")) return "level6";
  if (raw === "level7" || raw.includes("level7")) return "level7";
  if (raw === "level8" || raw.includes("level8")) return "level8";
  if (
    raw === "level9" ||
    raw.includes("cấp level9") ||
    raw.includes("cap level9") ||
    raw.includes("level9")
  ) {
    return "level9";
  }

  if (
    raw === "kids_1" ||
    raw === "kids-1" ||
    raw.includes("kids level 1") ||
    raw.includes("trẻ em cấp 1") ||
    raw.includes("tre em cap 1")
  ) {
    return "kids_1";
  }

  if (
    raw === "kids_2" ||
    raw === "kids-2" ||
    raw.includes("kids level 2") ||
    raw.includes("trẻ em cấp 2") ||
    raw.includes("tre em cap 2")
  ) {
    return "kids_2";
  }

  if (
    raw === "kids_3" ||
    raw === "kids-3" ||
    raw.includes("kids level 3") ||
    raw.includes("trẻ em cấp 3") ||
    raw.includes("tre em cap 3")
  ) {
    return "kids_3";
  }

  // label-based normalization
  if (raw in tierLabelToIdMap) {
    return tierLabelToIdMap[raw];
  }

  return undefined;
}