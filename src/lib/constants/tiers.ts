// src/lib/constants/tiers.ts

export type TierId =
  | "free"
  | "premium_month"
  | "premium_year"
  // legacy values still kept so older files can compile during migration
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip9"
  | "kids_1"
  | "kids_2"
  | "kids_3";

export const TIER_IDS: readonly TierId[] = [
  "free",
  "premium_month",
  "premium_year",
  "vip1",
  "vip2",
  "vip3",
  "vip4",
  "vip5",
  "vip6",
  "vip9",
  "kids_1",
  "kids_2",
  "kids_3",
] as const;

// ✅ Back-compat export expected by TierDetail.tsx and older callers
export const ALL_TIER_IDS: readonly TierId[] = TIER_IDS;

export const tierIdToLabel: Record<TierId, string> = {
  free: "Free",
  premium_month: "Premium Monthly",
  premium_year: "Premium Yearly",
  vip1: "VIP 1",
  vip2: "VIP 2",
  vip3: "VIP 3",
  vip4: "VIP 4",
  vip5: "VIP 5",
  vip6: "VIP 6",
  vip9: "VIP 9",
  kids_1: "Kids 1",
  kids_2: "Kids 2",
  kids_3: "Kids 3",
};

function clean(input: unknown): string {
  return String(input ?? "")
    .trim()
    .toLowerCase();
}

export function isTierId(value: unknown): value is TierId {
  return (TIER_IDS as readonly string[]).includes(clean(value));
}

export function normalizeTier(input: unknown): TierId {
  const raw = clean(input);

  if (!raw) return "free";

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

  if (raw === "free" || raw.includes("miễn phí") || raw.includes("mien phi")) {
    return "free";
  }

  // legacy VIP mappings kept temporarily so older code/tests don't explode
  if (raw === "vip1" || raw.includes("vip1")) return "vip1";
  if (raw === "vip2" || raw.includes("vip2")) return "vip2";
  if (raw === "vip3" || raw.includes("vip3 ii") || raw.includes("vip3")) return "vip3";
  if (raw === "vip4" || raw.includes("vip4")) return "vip4";
  if (raw === "vip5" || raw.includes("vip5")) return "vip5";
  if (raw === "vip6" || raw.includes("vip6")) return "vip6";
  if (
    raw === "vip9" ||
    raw.includes("cấp vip9") ||
    raw.includes("cap vip9") ||
    raw.includes("vip9")
  ) {
    return "vip9";
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

  return "free";
}