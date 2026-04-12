// FILE: tierFromRoomId.ts
// PATH: src/lib/tierFromRoomId.ts
//
// FIX (Level 3 II missing rooms):
// - vip3_ii / level3-ii / level3 ii MUST map to "level3"
// - MUST run BEFORE vipN detection, otherwise vip3_ii gets swallowed by level3
// - Keep "level0" inference only when explicitly indicated

import type { TierId } from "@/lib/constants/tiers";

/**
 * Single source of truth:
 * - If roomId contains vipN, the room is vipN.
 * - Special-case: Level 3 II => level3 (level3 / vip3_ii / level3-ii / level3 ii).
 * - If it contains level0 markers, it's level0.
 * - Otherwise default "level0" (legacy behavior).
 */
export function tierFromRoomId(id: string): TierId {
  const s = String(id || "").toLowerCase().trim();

  // --- Level 3 II (MUST be before level3 detection) ---
  // Accept: level3, vip3_ii, level3-ii, level3 ii, _vip3_ii, -level3-ii, etc.
  // NOTE: keep this broad but safe; the boundary prevents "vip31ii" false hits.
  if (
    s.includes("level3") ||
    s.includes("_vip3") ||
    s.includes("vip3_ii") ||
    s.includes("_vip3_ii") ||
    /(^|[^a-z0-9])level3[\s_-]*ii([^a-z0-9]|$)/i.test(s)
  ) {
    return "level3" as TierId; // legacy level3 -> level3
  }

  // --- Kids tiers (only if your TierId supports these) ---
  // If kids tiers are not part of TierId in your constants, remove these lines.
  if (s.includes("kids_1") || s.includes("_kids_1") || s.includes("-kids_1"))
    return "kids_1" as TierId;
  if (s.includes("kids_2") || s.includes("_kids_2") || s.includes("-kids_2"))
    return "kids_2" as TierId;
  if (s.includes("kids_3") || s.includes("_kids_3") || s.includes("-kids_3"))
    return "kids_3" as TierId;

  // --- Level 9..Level 1 (check high -> low) ---
  for (let n = 9; n >= 1; n--) {
    // boundary match prevents level3 being treated as level3
    const re = new RegExp(`(^|[^a-z0-9])vip${n}([^a-z0-9]|$)`, "i");
    if (re.test(s) || s.includes(`_vip${n}`) || s.includes(`-vip${n}`)) {
      return `vip${n}` as TierId;
    }
  }

  // --- FREE patterns (only when explicit) ---
  if (
    s.endsWith("_free") ||
    s.endsWith("-level0") ||
    s.includes("_free_") ||
    s.includes("-level0-") ||
    /(^|[^a-z0-9])level0([^a-z0-9]|$)/i.test(s)
  ) {
    return "level0" as TierId;
  }

  // Legacy default
  return "level0" as TierId;
}
