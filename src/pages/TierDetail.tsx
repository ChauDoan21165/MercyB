// src/pages/TierDetail.tsx
// MB-BLUE-97.4 — 2025-12-28 (+0700)

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { ALL_TIER_IDS, getTierLabel, type TierId } from "@/lib/tiers";
import { ROOM_LIST } from "@/lib/roomList";

type RoomMetaLike = {
  id: string;
  tier?: string;
  title_en?: string;
  title_vi?: string;
  title?: { en?: string; vi?: string };
};

function isTierId(x: string): x is TierId {
  return (ALL_TIER_IDS as string[]).includes(x);
}

function pickTitle(r: RoomMetaLike) {
  return r?.title?.en || r?.title_en || r?.title?.vi || r?.title_vi || r?.id;
}

export default function TierDetail() {
  const { tierId } = useParams<{ tierId: string }>();
  const tier = isTierId(String(tierId || "").toLowerCase())
    ? (String(tierId).toLowerCase() as TierId)
    : null;

  const rooms = (ROOM_LIST as unknown as RoomMetaLike[]) || [];

  const filtered = useMemo(() => {
    if (!tier) return [];
    return rooms.filter(
      (r) => String((r as any)?.tier || "").toLowerCase().trim() === tier
    );
  }, [rooms, tier]);

  if (!tier) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">Tier not found</h1>
        <Link className="underline" to="/tiers">
          Back to Tier Map
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl font-serif font-bold">
            {getTierLabel(tier, "core")}
          </h1>
          <Link className="underline text-sm" to="/tiers">
            Back to Tier Map
          </Link>
        </div>
        <p className="text-muted-foreground">
          Rooms in this tier: <b>{filtered.length}</b>
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <Link
            key={r.id}
            to={`/room/${r.id}`}
            className="rounded-2xl border bg-card p-5 hover:shadow-sm transition"
          >
            <div className="font-semibold">{pickTitle(r)}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              id: <code>{r.id}</code>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
