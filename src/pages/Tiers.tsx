// FILE: Tiers.tsx
// PATH: src/pages/Tiers.tsx
// VERSION: MB-BLUE-97.9e → MB-BLUE-97.9f — 2026-01-17 (+0700)
//
// FIX (DELETE VIP3 II from UI):
// - Remove vip3 from this page’s Tier UI (no pill, no counter, no link).
// - Keep counting strict; anything that used to show as vip3 will now fall into "unknown"
//   unless your upstream tiering maps it to vip3.
//
// NOTE:
// - This is UI-only. Source-of-truth tier inference remains elsewhere.
// - If you truly want vip3 rooms to become vip3, do it upstream (tierFromRoomId / DB tier).

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { TierId } from "@/lib/constants/tiers";
import { TIER_ID_TO_LABEL, normalizeTierOrUndefined } from "@/lib/constants/tiers";
import { getAllRooms, type RoomInfo } from "@/lib/roomData";
import { cn } from "@/lib/utils";

// ✅ Local UI tier list (vip3 removed)
const UI_TIER_IDS: TierId[] = [
  "free",
  "vip1",
  "vip2",
  "vip3",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
  "vip8",
  "vip9",
  "kids_1",
  "kids_2",
  "kids_3",
];

// Keep your real mapping if you have one elsewhere; this fallback keeps UI stable.
const TIER_COLORS: Record<string, string> = {
  free: "bg-zinc-100 text-zinc-800",
  vip1: "bg-zinc-100 text-zinc-800",
  vip2: "bg-zinc-100 text-zinc-800",
  vip3: "bg-zinc-100 text-zinc-800",
  vip4: "bg-zinc-100 text-zinc-800",
  vip5: "bg-zinc-100 text-zinc-800",
  vip6: "bg-zinc-100 text-zinc-800",
  vip7: "bg-zinc-100 text-zinc-800",
  vip8: "bg-zinc-100 text-zinc-800",
  vip9: "bg-zinc-100 text-zinc-800",
  kids_1: "bg-zinc-100 text-zinc-800",
  kids_2: "bg-zinc-100 text-zinc-800",
  kids_3: "bg-zinc-100 text-zinc-800",
  unknown: "bg-zinc-100 text-zinc-800",
};

type TierBucket = TierId | "unknown";

type TierRow = {
  tier: TierBucket;
  count: number;
};

export default function Tiers() {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const all = await getAllRooms();
        if (!alive) return;
        setRooms(all);
        setLoadError(null);
      } catch (e: any) {
        if (!alive) return;
        setRooms([]);
        setLoadError(e?.message ? String(e.message) : "Failed to load rooms");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const tierCounts: TierRow[] = useMemo(() => {
    const counts: Record<TierBucket, number> = {
      unknown: 0,
      free: 0,
      vip1: 0,
      vip2: 0,
      vip3: 0,
      vip4: 0,
      vip5: 0,
      vip6: 0,
      vip7: 0,
      vip8: 0,
      vip9: 0,
      kids_1: 0,
      kids_2: 0,
      kids_3: 0,
    };

    for (const r of rooms) {
      // ✅ STRICT: returns TierId | undefined (never defaults)
      // NOTE: roomData.ts may expose "unknown" as a literal tier; treat it as unknown here.
      const rawTier = (r as any)?.tier;
      if (rawTier === "unknown") {
        counts.unknown = (counts.unknown ?? 0) + 1;
        continue;
      }

      const tierId = normalizeTierOrUndefined(rawTier);

      // ✅ vip3 is not displayed; bucket it as unknown unless upstream maps it to vip3
      if (tierId === ("vip3" as any)) {
        counts.unknown = (counts.unknown ?? 0) + 1;
        continue;
      }

      const bucket: TierBucket = tierId ?? "unknown";
      counts[bucket] = (counts[bucket] ?? 0) + 1;
    }

    return [
      ...UI_TIER_IDS.map((t) => ({ tier: t, count: counts[t] ?? 0 })),
      { tier: "unknown", count: counts.unknown ?? 0 },
    ];
  }, [rooms]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tiers</h1>
        <div className="text-xs text-zinc-500">
          Rooms: {rooms.length}
          {loadError ? <span className="ml-2 text-red-600">({loadError})</span> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tierCounts.map((row) => {
          const tier = row.tier;

          const label = tier === "unknown" ? "Unknown / Chưa rõ" : TIER_ID_TO_LABEL[tier];

          const href = tier === "unknown" ? "/tiers/unknown" : `/tiers/${tier}`;

          return (
            <Link
              key={tier}
              to={href}
              className={cn(
                "rounded-xl border bg-white px-4 py-3 hover:shadow-sm transition",
                "flex items-center justify-between"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                    TIER_COLORS[tier] || TIER_COLORS.free
                  )}
                >
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-500" />
                  <span>{tier === "unknown" ? "Unknown" : tier.toUpperCase()}</span>
                </span>
                <span className="text-sm text-zinc-700">{label}</span>
              </div>

              <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold text-zinc-800">
                {row.count}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-zinc-500">
        Source: getAllRooms() (runtime room loader). Unknown is shown explicitly (never silently counted as Free).
      </div>
    </div>
  );
}
