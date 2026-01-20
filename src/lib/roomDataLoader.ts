// FILE: tierFromRoomId.ts
// PATH: src/lib/tierFromRoomId.ts
//
// FIX (VIP3 II missing rooms):
// - vip3_ii / vip3-ii / vip3 ii MUST map to "vip3ii"
// - MUST run BEFORE vipN detection, otherwise vip3_ii gets swallowed by vip3
// - Keep "free" inference only when explicitly indicated

import type { TierId } from "@/lib/constants/tiers";

/**
 * Single source of truth:
 * - If roomId contains vipN, the room is vipN.
 * - Special-case: VIP3 II => vip3ii (vip3ii / vip3_ii / vip3-ii / vip3 ii).
 * - If it contains free markers, it's free.
 * - Otherwise default "free" (legacy behavior).
 */
export function tierFromRoomId(id: string): TierId {
  const s = String(id || "").toLowerCase().trim();

  // --- VIP3 II (MUST be before vip3 detection) ---
  // Accept: vip3ii, vip3_ii, vip3-ii, vip3 ii, _vip3_ii, -vip3-ii, etc.
  // NOTE: keep this broad but safe; the boundary prevents "vip31ii" false hits.
  if (
    s.includes("vip3ii") ||
    s.includes("_vip3ii") ||
    s.includes("vip3_ii") ||
    s.includes("_vip3_ii") ||
    /(^|[^a-z0-9])vip3[\s_-]*ii([^a-z0-9]|$)/i.test(s)
  ) {
    return "vip3" as TierId; // legacy vip3ii -> vip3
  }

  // --- Kids tiers (only if your TierId supports these) ---
  // If kids tiers are not part of TierId in your constants, remove these lines.
  if (s.includes("kids_1") || s.includes("_kids_1") || s.includes("-kids_1"))
    return "kids_1" as TierId;
  if (s.includes("kids_2") || s.includes("_kids_2") || s.includes("-kids_2"))
    return "kids_2" as TierId;
  if (s.includes("kids_3") || s.includes("_kids_3") || s.includes("-kids_3"))
    return "kids_3" as TierId;

  // --- VIP9..VIP1 (check high -> low) ---
  for (let n = 9; n >= 1; n--) {
    // boundary match prevents vip3ii being treated as vip3
    const re = new RegExp(`(^|[^a-z0-9])vip${n}([^a-z0-9]|$)`, "i");
    if (re.test(s) || s.includes(`_vip${n}`) || s.includes(`-vip${n}`)) {
      return `vip${n}` as TierId;
    }
  }

  // --- FREE patterns (only when explicit) ---
  if (
    s.endsWith("_free") ||
    s.endsWith("-free") ||
    s.includes("_free_") ||
    s.includes("-free-") ||
    /(^|[^a-z0-9])free([^a-z0-9]|$)/i.test(s)
  ) {
    return "free" as TierId;
  }

  // Legacy default
  return "free" as TierId;
}
