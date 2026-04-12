// FILE: tierFromRoomId.ts
// PATH: src/lib/tierFromRoomId.ts
//
// SIMPLE APP MODE (FINAL):
// - Level 3 II (and other Level 3 roman variants) are NOT real tiers anymore → always maps to Level 3
// - strictTierFromRoomId(): returns TierId ONLY when confidently detected
// - tierFromRoomId(): legacy wrapper defaults to "level0"
// - NO DB migration needed
// - Stops Level 0 from becoming a garbage can
// - Kids mapping preserved so /tiers/kids_* still works

import type { TierId } from "@/lib/constants/tiers";

/**
 * STRICT inference:
 * Returns TierId only when confidently recognized from the room id/path.
 * Otherwise returns undefined (caller may bucket as "unknown").
 */
export function strictTierFromRoomId(id: string): TierId | undefined {
  const s = String(id || "").toLowerCase().trim();
  if (!s) return undefined;

  // Boundary-aware token matcher (prevents level3 matching vip30, etc.)
  const hasToken = (token: string) => {
    const re = new RegExp(`(^|[^a-z0-9])${token}([^a-z0-9]|$)`, "i");
    return re.test(s);
  };

  // ---------------------------------------------------------------------------
  // Level 3 ROMAN VARIANTS — COLLAPSED INTO Level 3 (simple app mode)
  //
  // Examples that must map to "level3":
  // - ...-vip3ii
  // - ...-level3-ii
  // - ...-vip3ii-ii
  // - ...-vip3iii
  // - ...-level3-iv
  // - ...-vip3v (if it ever exists)
  //
  // IMPORTANT:
  // - We DO NOT want "level3" alone to match unless it is a proper token boundary.
  // - We DO want level3 + roman numerals stuck together (vip3ii) to match.
  // ---------------------------------------------------------------------------
  if (
    // explicit vip3_ii token
    hasToken("vip3_ii") ||
    // level3 + roman numerals (ii/iii/iv/...) with optional separators OR none
    /(^|[^a-z0-9])level3[\s_-]*([ivx]+)([^a-z0-9]|$)/i.test(s)
  ) {
    return "level3";
  }

  // ---------------------------------------------------------------------------
  // Kids tiers (explicit only)
  // ---------------------------------------------------------------------------
  if (
    /(^|[^a-z0-9])kids[\s_-]*l[\s_-]*1([^a-z0-9]|$)/i.test(s) ||
    /(^|[^a-z0-9])kids[\s_-]*level[\s_-]*1([^a-z0-9]|$)/i.test(s) ||
    /(^|[^a-z0-9])kids[\s_-]*1([^a-z0-9]|$)/i.test(s)
  ) {
    return "kids_1";
  }

  if (
    /(^|[^a-z0-9])kids[\s_-]*l[\s_-]*2([^a-z0-9]|$)/i.test(s) ||
    /(^|[^a-z0-9])kids[\s_-]*level[\s_-]*2([^a-z0-9]|$)/i.test(s) ||
    /(^|[^a-z0-9])kids[\s_-]*2([^a-z0-9]|$)/i.test(s)
  ) {
    return "kids_2";
  }

  if (
    /(^|[^a-z0-9])kids[\s_-]*l[\s_-]*3([^a-z0-9]|$)/i.test(s) ||
    /(^|[^a-z0-9])kids[\s_-]*level[\s_-]*3([^a-z0-9]|$)/i.test(s) ||
    /(^|[^a-z0-9])kids[\s_-]*3([^a-z0-9]|$)/i.test(s)
  ) {
    return "kids_3";
  }

  // ---------------------------------------------------------------------------
  // VIP tiers (high → low, after level3 roman collapse)
  // NOTE: This only matches "vipN" when it is a token boundary.
  // ---------------------------------------------------------------------------
  for (let n = 9; n >= 1; n--) {
    if (
      hasToken(`vip${n}`) ||
      s.includes(`_vip${n}`) ||
      s.includes(`-vip${n}`) ||
      s.includes(`/vip${n}/`)
    ) {
      return `vip${n}` as TierId;
    }
  }

  // ---------------------------------------------------------------------------
  // FREE (ONLY when explicit)
  // ---------------------------------------------------------------------------
  if (
    hasToken("level0") ||
    s.endsWith("_free") ||
    s.endsWith("-level0") ||
    s.includes("_free_") ||
    s.includes("-level0-") ||
    s.includes("/level0/")
  ) {
    return "level0";
  }

  // Not confidently inferred
  return undefined;
}

/**
 * Legacy wrapper (kept for backward compatibility):
 * Defaults to "level0" when not confidently inferred.
 */
export function tierFromRoomId(id: string): TierId {
  return (strictTierFromRoomId(id) ?? "level0") as TierId;
}