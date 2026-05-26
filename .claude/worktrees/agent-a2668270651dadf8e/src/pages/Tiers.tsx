// PATH: src/pages/Tiers.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { TierId } from "@/lib/constants/tiers";
import { TIER_ID_TO_LABEL, normalizeTierOrUndefined } from "@/lib/constants/tiers";
import { getAllRooms, type RoomInfo } from "@/lib/roomData";
import { cn } from "@/lib/utils";

// ✅ Updated UI tiers (include premium tiers)
const UI_TIER_IDS: TierId[] = [
  "level0",
  "premium_month",
  "premium_year",
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
  "level6",
  "level7",
  "level8",
  "level9",
  "kids_1",
  "kids_2",
  "kids_3",
];

const TIER_COLORS: Record<string, string> = {
  level0: "bg-zinc-100 text-zinc-800",

  premium_month: "bg-blue-100 text-blue-800",
  premium_year: "bg-green-100 text-green-800",

  level1: "bg-zinc-100 text-zinc-800",
  level2: "bg-zinc-100 text-zinc-800",
  level3: "bg-zinc-100 text-zinc-800",
  level4: "bg-zinc-100 text-zinc-800",
  level5: "bg-zinc-100 text-zinc-800",
  level6: "bg-zinc-100 text-zinc-800",
  level7: "bg-zinc-100 text-zinc-800",
  level8: "bg-zinc-100 text-zinc-800",
  level9: "bg-zinc-100 text-zinc-800",

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

      level0: 0,
      premium_month: 0,
      premium_year: 0,

      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
      level6: 0,
      level7: 0,
      level8: 0,
      level9: 0,

      kids_1: 0,
      kids_2: 0,
      kids_3: 0,
    };

    for (const r of rooms) {
      const rawTier = (r as any)?.tier;

      if (rawTier === "unknown") {
        counts.unknown++;
        continue;
      }

      const tierId = normalizeTierOrUndefined(rawTier);

      // keep level3 hidden (your original rule)
      if (tierId === ("level3" as any)) {
        counts.unknown++;
        continue;
      }

      const bucket: TierBucket = tierId ?? "unknown";
      counts[bucket]++;
    }

    return [
      ...UI_TIER_IDS.map((t) => ({
        tier: t,
        count: counts[t] ?? 0,
      })),
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

      <SectionHeader vi="Tiếng Anh hằng ngày" en="Daily English" />
      <TierGrid rows={tierCounts.filter((r) => !String(r.tier).startsWith("kids_"))} />

      <SectionHeader vi="Tiếng Anh cho trẻ em" en="Kids English" />
      <TierGrid rows={tierCounts.filter((r) => String(r.tier).startsWith("kids_"))} />

      <SectionHeader vi="Luyện thi" en="Exams (VSTEP · TOEIC · IELTS)" />
      <p className="mb-4 text-xs text-zinc-500">Sắp ra mắt · Coming soon.</p>

      <SectionHeader vi="Luyện nói" en="Speaking practice" />
      <p className="mb-4 text-xs text-zinc-500">Sắp ra mắt · Coming soon.</p>

      <div className="mt-4 text-xs text-zinc-500">
        Source: getAllRooms() (runtime room loader). Unknown is shown explicitly.
      </div>
    </div>
  );
}

// Section header — small visual divider above each tier group. Pure
// presentation; no logic.
function SectionHeader({ vi, en }: { vi: string; en: string }) {
  return (
    <div className="mt-6 mb-2 first:mt-0">
      <h2 className="text-sm font-semibold text-zinc-900">{vi}</h2>
      <p className="text-xs text-zinc-500">{en}</p>
    </div>
  );
}

// Renders one section's tier rows in the same layout the page used
// before — only difference vs. the original is that the array is a
// pre-filtered slice of tierCounts instead of the full list.
function TierGrid({ rows }: { rows: TierRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
      {rows.map((row) => {
        const tier = row.tier;

        const label =
          tier === "unknown"
            ? "Unknown / Chưa rõ"
            : TIER_ID_TO_LABEL[tier];

        const href =
          tier === "unknown"
            ? "/tiers/unknown"
            : `/tiers/${tier}`;

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
                  TIER_COLORS[tier] || TIER_COLORS.level0
                )}
              >
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-500" />
                <span>
                  {tier === "unknown" ? "Unknown" : tier.toUpperCase()}
                </span>
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
  );
}