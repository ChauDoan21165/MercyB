// src/pages/TierIndex.tsx
// MB-BLUE-98.2 — 2025-12-29 (+0700)

import { Link } from "react-router-dom";
import {
  ALL_TIER_IDS,
  TIER_COLUMNS,
  getTierLabel,
  getTierDescription,
  type TierColumn,
  type TierId,
} from "@/lib/constants/tiers";

// ✅ STATIC SOURCE OF TRUTH (generated) — tolerate different export shapes
import * as RoomListMod from "@/lib/roomList";

type RoomMetaLike = {
  id: string;
  tier?: string;
  title_en?: string;
  title_vi?: string;
  title?: { en?: string; vi?: string };
};

function safeTier(raw: any): TierId | "unknown" {
  const v = String(raw || "").toLowerCase().trim();
  if ((ALL_TIER_IDS as readonly string[]).includes(v)) return v as TierId;
  return "unknown";
}

function readRoomList(): RoomMetaLike[] {
  const m: any = RoomListMod as any;

  // prefer constant if present
  if (Array.isArray(m.ROOM_LIST)) return m.ROOM_LIST as RoomMetaLike[];
  if (Array.isArray(m.roomList)) return m.roomList as RoomMetaLike[];

  // some generators export default array
  if (Array.isArray(m.default)) return m.default as RoomMetaLike[];

  // some code exports a getter
  if (typeof m.getRoomList === "function") {
    try {
      const v = m.getRoomList();
      if (Array.isArray(v)) return v as RoomMetaLike[];
    } catch {
      // ignore
    }
  }

  return [];
}

export default function TierIndex() {
  const rooms = readRoomList();

  const counts: Record<string, number> = {};
  for (const id of ALL_TIER_IDS) counts[id] = 0;
  counts["unknown"] = 0;

  for (const r of rooms) {
    const t = safeTier((r as any)?.tier);
    counts[t] = (counts[t] || 0) + 1;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif font-bold">Tier Map</h1>
        <p className="text-muted-foreground">
          Three columns. One spine. You can see the whole system.
        </p>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="underline" to="/">
            All Rooms
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Rooms: {rooms.length}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            Unknown tier: {counts["unknown"] || 0}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIER_COLUMNS.map((col) => (
          <TierColumnCard
            key={col.id}
            column={col.id}
            title={col.label}
            counts={counts}
          />
        ))}
      </div>
    </div>
  );
}

function TierColumnCard({
  column,
  title,
  counts,
}: {
  column: TierColumn;
  title: string;
  counts: Record<string, number>;
}) {
  return (
    <section className="rounded-2xl border bg-card p-5 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="space-y-3">
        {ALL_TIER_IDS.map((tierId) => (
          <Link
            key={`${column}-${tierId}`}
            to={`/tiers/${tierId}`}
            className="block rounded-xl border bg-background/60 hover:bg-background transition p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium">{getTierLabel(tierId, column)}</div>
              <div className="text-xs text-muted-foreground">
                {counts[tierId] ?? 0} rooms
              </div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {getTierDescription(tierId, column)}
            </div>
          </Link>
        ))}
      </div>

      <div className="text-xs text-muted-foreground pt-2 border-t">
        Unknown tier rooms: <b>{counts["unknown"] ?? 0}</b>
      </div>
    </section>
  );
}

/** New thing to learn: In Vite/ESM, “does not provide an export named …” almost always means “wrong import shape”, not missing file. */
