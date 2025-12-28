// src/pages/Tiers.tsx
// MB-BLUE-97.1 — 2025-12-28 (+0700)
/**
 * Tiers (READ-ONLY INDEX)
 * - 3 columns: English | Core | Living
 * - Uses room registry/manifest (no JSON fetch)
 * - Shows tier cards + room counts + expandable list
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { CORE_TIERS, type TierId } from "@/lib/tiers";
import { getRoomList } from "@/lib/roomFetcher";

type RoomMeta = {
  id: string;
  title_en?: string;
  title_vi?: string;
  tier?: string;
};

function normalizeTier(t: any): TierId | "unknown" {
  const s = String(t || "").trim().toLowerCase();
  if (
    s === "free" ||
    s === "vip1" ||
    s === "vip2" ||
    s === "vip3" ||
    s === "vip3_ext" ||
    s === "vip4" ||
    s === "vip5" ||
    s === "vip6" ||
    s === "vip7" ||
    s === "vip8" ||
    s === "vip9"
  ) return s;
  return "unknown";
}

export default function TiersPage() {
  const [openTier, setOpenTier] = useState<string | null>(null);

  const rooms = useMemo(() => {
    // getRoomList() is our authoritative discovery layer
    // If it ever changes shape, we adjust here—NOT by adding fetch hacks.
    const list = (getRoomList() as any[]) || [];
    return list.map((r: any) => ({
      id: r.id,
      title_en: r.title_en || r.title?.en,
      title_vi: r.title_vi || r.title?.vi,
      tier: r.tier,
    })) as RoomMeta[];
  }, []);

  const roomsByTier = useMemo(() => {
    const map = new Map<string, RoomMeta[]>();
    for (const r of rooms) {
      const t = normalizeTier(r.tier);
      const key = t === "unknown" ? "unknown" : t;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    // stable sort inside each tier
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.id || "").localeCompare(b.id || ""));
      map.set(k, arr);
    }
    return map;
  }, [rooms]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-serif font-bold">Tiers</h1>
        <p className="text-muted-foreground">
          Read-only structural map (English | Core | Living). This page is built from the room registry — no fragile JSON fetch.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Column title="English (mirror)" subtitle="Auto-mapped later" />
        <CoreColumn
          tiers={CORE_TIERS}
          roomsByTier={roomsByTier}
          openTier={openTier}
          setOpenTier={setOpenTier}
        />
        <Column title="Living skills (mirror)" subtitle="Auto-mapped later" />
      </div>

      <div className="mt-10 rounded-2xl border bg-card p-5">
        <div className="text-sm font-semibold">Diagnostics</div>
        <div className="mt-2 text-xs text-muted-foreground">
          Total rooms discovered: <code>{rooms.length}</code> • Unknown tier rooms:{" "}
          <code>{(roomsByTier.get("unknown") || []).length}</code>
        </div>

        {(roomsByTier.get("unknown") || []).length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs">Show unknown-tier room IDs</summary>
            <pre className="mt-2 max-h-56 overflow-auto rounded-xl bg-muted p-3 text-xs">
              {(roomsByTier.get("unknown") || []).map((r) => r.id).join("\n")}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

function Column({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
      <div className="mt-6 text-sm text-muted-foreground">
        (Reserved column — we’ll mirror Core tiers here after Core spine is stable.)
      </div>
    </div>
  );
}

function CoreColumn({
  tiers,
  roomsByTier,
  openTier,
  setOpenTier,
}: {
  tiers: { id: string; label: string; description: string }[];
  roomsByTier: Map<string, RoomMeta[]>;
  openTier: string | null;
  setOpenTier: (x: string | null) => void;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="text-sm font-semibold">Core</div>
      <div className="mt-1 text-xs text-muted-foreground">Free → VIP9</div>

      <div className="mt-4 space-y-3">
        {tiers.map((t) => {
          const list = roomsByTier.get(t.id) || [];
          const isOpen = openTier === t.id;

          return (
            <div key={t.id} className="rounded-xl border p-4">
              <button
                className="w-full text-left"
                onClick={() => setOpenTier(isOpen ? null : t.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="rounded-full border px-2 py-1">{list.length} rooms</span>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="mt-3 space-y-2">
                  {list.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No rooms tagged for this tier yet.</div>
                  ) : (
                    <ul className="space-y-1">
                      {list.slice(0, 60).map((r) => (
                        <li key={r.id} className="text-sm">
                          <Link className="underline decoration-dotted" to={`/room/${r.id}`}>
                            {r.title_en || r.title_vi || r.id}
                          </Link>
                          <span className="ml-2 text-xs text-muted-foreground">
                            <code>{r.id}</code>
                          </span>
                        </li>
                      ))}
                      {list.length > 60 && (
                        <li className="text-xs text-muted-foreground">
                          Showing first 60. (We’ll add search/filter next.)
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
