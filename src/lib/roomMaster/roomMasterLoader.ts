// FILE: roomMasterLoader.ts
// PATH: src/lib/roomMaster/roomMasterLoader.ts
// VERSION: MB-BLUE-97.9d — 2026-01-18 (+0700)
//
// FIX (vip3ii burial + export):
// - vip3ii is DELETED as a tier. Treat legacy room ids containing "vip3ii" as vip3.
// - Add named export roomMasterLoader for backward-compat with simulator imports.
// - Keep strict: never default unknown → free.

import type { TierId } from "@/lib/constants/tiers";
import { isValidTierId, tierLabelToId } from "@/lib/constants/tiers";

type AnyRoom = {
  id: string;
  tier?: string | null;
  [k: string]: any;
};

function inferTierFromRoomId(roomId: string): TierId | undefined {
  const s = String(roomId || "").toLowerCase();

  // kids first
  if (s.includes("kids_1") || s.includes("_kids_1")) return "kids_1";
  if (s.includes("kids_2") || s.includes("_kids_2")) return "kids_2";
  if (s.includes("kids_3") || s.includes("_kids_3")) return "kids_3";

  // vip3ii is DELETED → map legacy ids to vip3
  if (s.includes("vip3ii") || s.includes("_vip3ii")) return "vip3";

  // vipN suffixes (common: _vip3, _vip4_bonus, etc.)
  const m = s.match(/_vip([1-9])\b/);
  if (m?.[1]) return `vip${m[1]}` as TierId;

  // explicit free suffix
  if (s.includes("_free")) return "free";

  return undefined;
}

function parseTierStrict(room: AnyRoom): TierId | undefined {
  // 1) infer from id (most reliable when tiers are missing)
  const inferred = inferTierFromRoomId(room.id);
  if (inferred) return inferred;

  // 2) parse provided tier string if present
  const raw = room.tier;
  if (raw == null) return undefined;

  const s = String(raw).trim();
  if (!s) return undefined;

  const lower = s.toLowerCase().trim();

  // If already canonical id
  if (isValidTierId(lower)) return lower as TierId;

  // Only attempt tierLabelToId if it actually looks like a tier string.
  // Otherwise tierLabelToId() may default unknown → "free".
  const looksLikeTier =
    /vip\s*\d/i.test(s) ||
    /vip\d/i.test(s) ||
    /vip\s*3\s*ii/i.test(s) ||
    /vip3ii/i.test(s) ||
    /kids/i.test(s) ||
    /trẻ em/i.test(s) ||
    /mien phi|miễn phí|free/i.test(s);

  if (!looksLikeTier) return undefined;

  // If old UI label still says VIP3II -> treat as vip3 (vip3ii is deleted)
  if (/vip\s*3\s*ii/i.test(s) || /vip3ii/i.test(s)) return "vip3";

  const mapped = tierLabelToId(s);

  // Guard: tierLabelToId() falls back to "free" when unrecognized.
  // Only accept "free" if the raw string actually indicates free.
  if (mapped === "free") {
    const isReallyFree = /mien phi|miễn phí|free/i.test(s);
    return isReallyFree ? "free" : undefined;
  }

  return mapped;
}

// ---- Your existing loader export should call this coercion ----
export function coerceRoomMaster(room: AnyRoom): AnyRoom & { tier?: TierId } {
  const tierId = parseTierStrict(room);

  return {
    ...room,
    tier: tierId, // ✅ no default-to-free
  };
}

/**
 * Backward-compat named export:
 * Some simulator code imports { roomMasterLoader } from this file.
 * We keep it as a thin wrapper around the strict coercion.
 */
export function roomMasterLoader(room: AnyRoom): AnyRoom & { tier?: TierId } {
  return coerceRoomMaster(room);
}
