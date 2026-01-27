// FILE: tierFromRoomId.ts
// PATH: src/lib/tierFromRoomId.ts
// MB-BLUE-98.9n-tierFromRoomId-vipN-strict — 2026-01-25 (+0700)
//
// PURPOSE (LOCKED):
// - Infer tier from room id string.
// - Used as a *safety net* when registry tier fields are wrong.
// - Mercy Blade sells VIP1 / VIP3 / VIP9 only.
//
// FIX (2026-01-25):
// - Recognize vipN patterns like *_vip5_bonus.
// - Any vip number NOT in {1,3,9} is treated as vip9 (safest lock).
// - Keep kids_* detection.

import type { TierId } from "@/lib/tierRoomSource";

function norm(id: string): string {
  return String(id || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");
}

export function tierFromRoomId(roomId: string): TierId {
  const s = norm(roomId);

  // Kids tiers (support a few historical patterns)
  // Examples: kids_1_..., ..._kids_l1, ..._kids_l2, ..._kids_l3
  const kidsDirect = s.match(/(?:^|_)kids_?([123])(?:_|$)/);
  if (kidsDirect) return (`kids_${Number(kidsDirect[1])}` as unknown) as TierId;

  const kidsL = s.match(/(?:^|_)kids_l([123])(?:_|$)/);
  if (kidsL) return (`kids_${Number(kidsL[1])}` as unknown) as TierId;

  // VIP tiers: match vipN with or without underscore: vip9, vip_9, _vip5_bonus
  const vip = s.match(/(?:^|_)vip_?(\d+)(?:_|$)/);
  if (vip) {
    const n = Number(vip[1]);

    // Mercy Blade product ladder
    if (n === 1) return ("vip1" as unknown) as TierId;
    if (n === 3) return ("vip3" as unknown) as TierId;
    if (n === 9) return ("vip9" as unknown) as TierId;

    // SAFETY: unknown vip numbers are treated as vip9 (locked),
    // because we do not sell vip2/vip4/vip5/vip6/vip7/vip8.
    if (Number.isFinite(n) && n > 0) return ("vip9" as unknown) as TierId;
  }

  return ("free" as unknown) as TierId;
}
