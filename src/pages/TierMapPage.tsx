// src/pages/TierMapPage.tsx
// MB-BLUE-96.3 — 2025-12-28 (+0700)
/**
 * TierMapPage (AUTHORITATIVE)
 * Shows tiers Free → VIP9 and lists rooms belonging to each tier.
 *
 * Rules:
 * - Uses existing room registry/list as truth (not manual lists).
 * - Clean, scannable, "control panel" feel.
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getRoomList, type RoomMeta as FetcherRoomMeta } from "@/lib/roomFetcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type TierId =
  | "free"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9";

const TIERS: { id: TierId; label: string; hint?: string }[] = [
  { id: "free", label: "FREE", hint: "Core" },
  { id: "vip1", label: "VIP1", hint: "Core extension" },
  { id: "vip2", label: "VIP2", hint: "Core extension" },
  { id: "vip3", label: "VIP3", hint: "Core deep" },
  { id: "vip4", label: "VIP4", hint: "Career choosing" },
  { id: "vip5", label: "VIP5", hint: "Advanced English writing" },
  { id: "vip6", label: "VIP6", hint: "Psychology" },
  { id: "vip7", label: "VIP7", hint: "Reserved" },
  { id: "vip8", label: "VIP8", hint: "Reserved" },
  { id: "vip9", label: "VIP9", hint: "Strategy mindset" },
];

function normTier(t: any): TierId {
  const x = String(t || "free").toLowerCase().trim();
  if (x === "free") return "free";
  if (x === "vip1") return "vip1";
  if (x === "vip2") return "vip2";
  if (x === "vip3") return "vip3";
  if (x === "vip4") return "vip4";
  if (x === "vip5") return "vip5";
  if (x === "vip6") return "vip6";
  if (x === "vip7") return "vip7";
  if (x === "vip8") return "vip8";
  if (x === "vip9") return "vip9";
  return "free";
}

function titleOf(r: any) {
  return r?.title_en || r?.title_vi || r?.title || r?.id || "Untitled";
}

export default function TierMapPage() {
  const [rooms, setRooms] = useState<FetcherRoomMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await getRoomList();
        if (!cancelled) setRooms(Array.isArray(list) ? list : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const map: Record<TierId, FetcherRoomMeta[]> = {
      free: [],
      vip1: [],
      vip2: [],
      vip3: [],
      vip4: [],
      vip5: [],
      vip6: [],
      vip7: [],
      vip8: [],
      vip9: [],
    };
    for (const r of rooms) {
      const tier = normTier((r as any)?.tier);
      map[tier].push(r);
    }
    for (const k of Object.keys(map) as TierId[]) {
      map[k].sort((a, b) => String(titleOf(a)).localeCompare(String(titleOf(b))));
    }
    return map;
  }, [rooms]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Mercy Blade — Tier Map
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A structured view of your content: Free → VIP9. Click any room to open.
          </p>
        </div>

        <ThemeToggle />
      </div>

      {loading ? (
        <div className="rounded-2xl border p-8 text-muted-foreground">Loading tiers…</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TIERS.map((t) => (
            <TierCard key={t.id} tier={t} rooms={grouped[t.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

function TierCard({
  tier,
  rooms,
}: {
  tier: { id: TierId; label: string; hint?: string };
  rooms: FetcherRoomMeta[];
}) {
  return (
    <section className="rounded-3xl border bg-card/70 backdrop-blur p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <h2 className="text-xl font-semibold">{tier.label}</h2>
          {tier.hint ? (
            <p className="text-xs text-muted-foreground">{tier.hint}</p>
          ) : null}
        </div>
        <div className="text-xs text-muted-foreground">
          {rooms.length} room{rooms.length === 1 ? "" : "s"}
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
          Empty tier (for now).
        </div>
      ) : (
        <ol className="space-y-2">
          {rooms.slice(0, 30).map((r) => (
            <li key={r.id}>
              <Link
                to={`/room/${r.id}`}
                className="block rounded-2xl border px-4 py-3 hover:bg-accent transition"
              >
                <div className="font-medium leading-snug">{titleOf(r)}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  <code>{r.id}</code>
                </div>
              </Link>
            </li>
          ))}
          {rooms.length > 30 ? (
            <li className="text-xs text-muted-foreground pt-2">
              Showing first 30 rooms…
            </li>
          ) : null}
        </ol>
      )}
    </section>
  );
}
