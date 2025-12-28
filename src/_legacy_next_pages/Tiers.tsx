// src/_legacy_next_pages/Tiers.tsx
// MB-BLUE-97.7 — 2025-12-28 (+0700)
/**
 * TIERS PAGE (AUTHORITATIVE PHASE IV → V)
 * Fix:
 * - NO JSON fetch ✅
 * - NO getRoomList dependency ✅
 * - Uses generated roomDataMap (src/lib/roomDataImports.ts) ✅
 * - 3 columns: English | Core | Living ✅
 * - Click tier → show rooms → click room → /room/:roomId ✅
 *
 * ✅ CRITICAL FIX (97.7):
 * Many rooms have WRONG tier in roomDataMap (often "free") even when id contains vipN
 * Example: alexander_the_great_vip9_vol1 -> tier should be vip9
 *
 * So we compute:
 * - tierFromField = normalizeTier(r.tier)
 * - tierFromId    = normalizeTier(r.id)
 * And choose an "effective tier":
 * - If id clearly shows vipN (vip4/vip5/vip9 etc), ID wins over "free".
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";

// ✅ AUTHORITATIVE GENERATED SOURCE (ALWAYS EXISTS)
import { roomDataMap } from "@/lib/roomDataImports";

type TierId =
  | "free"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip3_ext"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9";

type TierDef = {
  id: TierId;
  label: string;
  description: string;
  order: number;
};

const CORE_TIERS: TierDef[] = [
  { id: "free", label: "Free", description: "Life foundations", order: 0 },
  { id: "vip1", label: "VIP 1", description: "Stability & habits", order: 1 },
  { id: "vip2", label: "VIP 2", description: "Self-regulation", order: 2 },
  { id: "vip3", label: "VIP 3", description: "Depth & meaning", order: 3 },
  { id: "vip3_ext", label: "VIP 3 II", description: "Sexuality, finance, shadow", order: 4 },
  { id: "vip4", label: "VIP 4", description: "Career choosing", order: 5 },
  { id: "vip5", label: "VIP 5", description: "Advanced English writing", order: 6 },
  { id: "vip6", label: "VIP 6", description: "Psychology", order: 7 },
  { id: "vip7", label: "VIP 7", description: "Reserved", order: 8 },
  { id: "vip8", label: "VIP 8", description: "Reserved", order: 9 },
  { id: "vip9", label: "VIP 9", description: "Strategy mindset", order: 10 },
];

type RoomListItem = {
  id: string;
  title_en?: string;
  title_vi?: string;
  tier?: string; // raw tier from generator/json
};

function normalizeTier(input: any): TierId | "unknown" {
  const s = String(input || "").trim().toLowerCase();
  if (!s) return "unknown";

  // vip3 extension naming variants
  if (s.includes("vip3_ii") || s.includes("vip3ii") || s.includes("vip3_ext")) {
    return "vip3_ext";
  }

  // free
  if (s === "free" || s.includes("free")) return "free";

  // last vipN occurrence anywhere (vip9_vol1, vip5_bonus, vip4_vip4, etc.)
  const matches = Array.from(s.matchAll(/vip([1-9])/g));
  if (matches.length > 0) {
    const last = matches[matches.length - 1];
    const n = last?.[1];
    if (n) return `vip${n}` as TierId;
  }

  return "unknown";
}

/**
 * Decide the final tier.
 * - If the id contains vipN, that is authoritative over a lazy/incorrect "free".
 * - Otherwise use the tier field.
 */
function effectiveTier(rawTier: any, id: string): TierId | "unknown" {
  const fromField = normalizeTier(rawTier);
  const fromId = normalizeTier(id);

  // If ID clearly indicates a VIP tier, it wins.
  // This fixes your current situation: many vip4/vip5/vip9 ids are stamped tier="free".
  if (fromId !== "unknown" && fromId !== "free") return fromId;

  // If field is meaningful, use it.
  if (fromField !== "unknown") return fromField;

  // Fallback: whatever ID says (including free/unknown)
  return fromId;
}

export default function Tiers() {
  const [openTier, setOpenTier] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // ✅ Build list from roomDataMap (generated, stable)
  const rooms: RoomListItem[] = useMemo(() => {
    const values = Object.values(roomDataMap || {}) as any[];
    return values.map((r: any) => ({
      id: r.id,
      title_en: r.title_en ?? r.title?.en ?? r.nameEn ?? r.name_en,
      title_vi: r.title_vi ?? r.title?.vi ?? r.nameVi ?? r.name_vi,
      tier: r.tier,
    }));
  }, []);

  const roomsByTier = useMemo(() => {
    const map = new Map<string, RoomListItem[]>();

    for (const r of rooms) {
      const t = effectiveTier(r.tier, r.id);
      const key = t === "unknown" ? "unknown" : t;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }

    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.id || "").localeCompare(b.id || ""));
      map.set(k, arr);
    }
    return map;
  }, [rooms]);

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader subtitle="Tiers" showBackButton={true} />

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold">Tier Map</h1>
          <p className="text-sm text-muted-foreground">
            Read-only “spine” view so you can see the whole app at once. Built from{" "}
            <code>roomDataMap</code> (no fragile JSON fetch).
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <MirrorColumn title="English (Left)" subtitle="Mirror of Core tiers (auto-map later)" />

          <CoreColumn
            tiers={CORE_TIERS}
            roomsByTier={roomsByTier}
            openTier={openTier}
            setOpenTier={setOpenTier}
          />

          <MirrorColumn title="Living skills (Right)" subtitle="Mirror of Core tiers (auto-map later)" />
        </div>

        <div className="mt-10 rounded-2xl border bg-card p-5">
          <div className="text-sm font-semibold">Diagnostics</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Total rooms discovered: <code>{rooms.length}</code> • Unknown tier rooms:{" "}
            <code>{(roomsByTier.get("unknown") || []).length}</code>
          </div>

          <details className="mt-3">
            <summary className="cursor-pointer text-xs">Show sample (first 30)</summary>
            <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-muted p-3 text-xs">
              {rooms
                .slice(0, 30)
                .map((r) => {
                  const f = normalizeTier(r.tier);
                  const i = normalizeTier(r.id);
                  const e = effectiveTier(r.tier, r.id);
                  return `${r.id}  | tierRaw=${r.tier || "∅"} | fromField=${f} | fromId=${i} | EFFECTIVE=${e}`;
                })
                .join("\n")}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

function MirrorColumn({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>

      <div className="mt-6 rounded-xl border bg-white/60 p-4 text-sm text-muted-foreground">
        Reserved column. After Core is stable, we mirror tiers here automatically (no manual drag).
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
  roomsByTier: Map<string, RoomListItem[]>;
  openTier: string | null;
  setOpenTier: (x: string | null) => void;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="text-sm font-semibold">Core (Middle)</div>
      <div className="mt-1 text-xs text-muted-foreground">Free → VIP9</div>

      <div className="mt-4 space-y-3">
        {tiers.map((t) => {
          const list = roomsByTier.get(t.id) || [];
          const isOpen = openTier === t.id;

          return (
            <div key={t.id} className="rounded-xl border bg-white/60 p-4">
              <button className="w-full text-left" onClick={() => setOpenTier(isOpen ? null : t.id)}>
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
                <div className="mt-3">
                  {list.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No rooms tagged for this tier yet.</div>
                  ) : (
                    <ul className="space-y-1">
                      {list.slice(0, 120).map((r) => (
                        <li key={r.id} className="text-sm">
                          <Link className="underline decoration-dotted" to={`/room/${r.id}`}>
                            {r.title_en || r.title_vi || r.id}
                          </Link>
                          <span className="ml-2 text-xs text-muted-foreground">
                            <code>{r.id}</code>
                          </span>
                        </li>
                      ))}
                      {list.length > 120 && (
                        <li className="text-xs text-muted-foreground">Showing first 120. (Search/filter comes next.)</li>
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
