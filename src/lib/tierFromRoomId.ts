// src/lib/tierFromRoomId.ts
import type { TierId } from "@/lib/constants/tiers";

/**
 * Single source of truth:
 * Tier MUST be derived from roomId when possible.
 */
export function tierFromRoomId(id: string): TierId {
  const s = String(id || "").toLowerCase();

  // VIP9..VIP1 (check high -> low)
  for (let n = 9; n >= 1; n--) {
    // accept: vip3, _vip3, -vip3 anywhere
    if (
      s.includes(`vip${n}`) ||
      s.includes(`_vip${n}`) ||
      s.includes(`-vip${n}`)
    ) {
      return (`vip${n}` as TierId);
    }
  }

  // FREE patterns (strong signals)
  if (
    s.endsWith("_free") ||
    s.endsWith("-free") ||
    s.includes("_free_") ||
    s.includes("-free-") ||
    s.includes("free")
  ) {
    return "free";
  }

  // default
  return "free";
}
