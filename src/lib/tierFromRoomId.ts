// FILE: tierFromRoomId.ts
// PATH: src/lib/tierFromRoomId.ts
//
// SIMPLE APP MODE (FINAL):
// - VIP3 II is NOT a real tier anymore → always maps to VIP3
// - strictTierFromRoomId(): returns TierId ONLY when confidently detected
// - tierFromRoomId(): legacy wrapper defaults to "free"
// - NO DB migration needed
// - Stops Free from becoming a garbage can
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

  // Boundary-aware token matcher (prevents vip3 matching vip30, etc.)
  const hasToken = (token: string) => {
    const re = new RegExp(`(^|[^a-z0-9])${token}([^a-z0-9]|$)`, "i");
    return re.test(s);
  };

  // ---------------------------------------------------------------------------
  // VIP3 II — COLLAPSED INTO VIP3 (simple app mode)
  // ---------------------------------------------------------------------------
  if (
    hasToken("vip3_ii") ||
    /(^|[^a-z0-9])vip3[\s_-]*ii([^a-z0-9]|$)/i.test(s)
  ) {
    return "vip3";
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
  // VIP tiers (high → low, after vip3 collapse)
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
    hasToken("free") ||
    s.endsWith("_free") ||
    s.endsWith("-free") ||
    s.includes("_free_") ||
    s.includes("-free-") ||
    s.includes("/free/")
  ) {
    return "free";
  }

  // Not confidently inferred
  return undefined;
}

/**
 * Legacy wrapper (kept for backward compatibility):
 * Defaults to "free" when not confidently inferred.
 */
export function tierFromRoomId(id: string): TierId {
  return (strictTierFromRoomId(id) ?? "free") as TierId;
}
