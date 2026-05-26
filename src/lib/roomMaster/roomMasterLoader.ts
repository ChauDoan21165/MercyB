// PATH: src/lib/roomMaster/roomMasterLoader.ts
// FILE: roomMasterLoader.ts
// VERSION: MB-BLUE-97.9d — 2026-01-18 (+0700)
//
// FIX:
// - tierLabelToId is now a record, not a callable function
// - keep strict: never default unknown → level0
// - keep backward-compat named export roomMasterLoader

import type { TierId } from "@/lib/constants/tiers";
import { isValidTierId, tierLabelToId } from "@/lib/constants/tiers";

type AnyRoom = {
  id: string;
  tier?: string | null;
  [k: string]: any;
};

function inferTierFromRoomId(roomId: string): TierId | undefined {
  const s = String(roomId || "").toLowerCase();

  if (s.includes("kids_1") || s.includes("_kids_1")) return "kids_1";
  if (s.includes("kids_2") || s.includes("_kids_2")) return "kids_2";
  if (s.includes("kids_3") || s.includes("_kids_3")) return "kids_3";

  if (s.includes("level3") || s.includes("_vip3")) return "level3";

  const m = s.match(/_vip([1-9])\b/);
  if (m?.[1]) return `vip${m[1]}` as TierId;

  if (s.includes("_free")) return "level0";

  return undefined;
}

function parseTierStrict(room: AnyRoom): TierId | undefined {
  const inferred = inferTierFromRoomId(room.id);
  if (inferred) return inferred;

  const raw = room.tier;
  if (raw == null) return undefined;

  const s = String(raw).trim();
  if (!s) return undefined;

  const lower = s.toLowerCase();

  if (isValidTierId(lower)) return lower as TierId;

  const looksLikeTier =
    /vip\s*\d/i.test(s) ||
    /vip\d/i.test(s) ||
    /vip\s*3\s*ii/i.test(s) ||
    /level3/i.test(s) ||
    /kids/i.test(s) ||
    /trẻ em/i.test(s) ||
    /tre em/i.test(s) ||
    /mien phi|miễn phí|level0/i.test(s);

  if (!looksLikeTier) return undefined;

  if (/vip\s*3\s*ii/i.test(s) || /level3/i.test(s)) return "level3";

  const mapped = tierLabelToId[lower] ?? null;

  if (mapped === "level0") {
    const isReallyFree = /mien phi|miễn phí|level0/i.test(s);
    return isReallyFree ? "level0" : undefined;
  }

  return mapped ?? undefined;
}

export function coerceRoomMaster(room: AnyRoom): AnyRoom & { tier?: TierId } {
  const tierId = parseTierStrict(room);

  return {
    ...room,
    tier: tierId,
  };
}

/**
 * Backward-compat named export:
 * Some simulator code imports { roomMasterLoader } from this file.
 */
export function roomMasterLoader(room: AnyRoom): AnyRoom & { tier?: TierId } {
  return coerceRoomMaster(room);
}