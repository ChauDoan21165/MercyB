// src/lib/tierFromRoomId.ts
import type { TierId } from "@/lib/constants/tiers";

/**
 * Single source of truth:
 * If roomId contains vipN, the room is vipN. If it contains free, it's free.
 */
export function tierFromRoomId(id: string): TierId {
  const s = String(id || "").toLowerCase();

  // VIP9..VIP1 (check high -> low)
  for (let n = 9; n >= 1; n--) {
    if (
      s.includes(`vip${n}`) ||
      s.includes(`_vip${n}`) ||
      s.includes(`-vip${n}`)
    ) {
      return `vip${n}` as TierId;
    }
  }

  // FREE patterns
  if (
    s.endsWith("_free") ||
    s.endsWith("-free") ||
    s.includes("_free_") ||
    s.includes("-free-") ||
    s.includes("free")
  ) {
    return "free";
  }

  return "free";
}
