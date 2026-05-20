// src/pages/TierMapPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getRoomList, type RoomMeta as FetcherRoomMeta } from "@/lib/roomFetcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { loadGoogleFont } from "@/lib/loadGoogleFont";

// Tier-map display type (Playfair headings + DM Sans body). Loaded once
// via an idempotent <link> injection instead of a render-time CSS
// @import inside <style> (request-chained, no preconnect, re-injected
// every render). `display=swap` → no FOIT. See src/lib/loadGoogleFont.ts.
const TIERMAP_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap";

type TierId =
  | "level0" | "level1" | "level2" | "level3" | "level4"
  | "level5" | "level6" | "level7" | "level8" | "level9";

const TIERS: { id: TierId; label: string; hint: string; color: string; accent: string; dot: string }[] = [
  { id: "level9", label: "Level 9", hint: "Top level",              color: "from-[#FF6B6B] to-[#FF8E53]", accent: "#FF6B6B", dot: "#FF6B6B" },
  { id: "level8", label: "Level 8", hint: "High mastery",           color: "from-[#FF8E53] to-[#FFC847]", accent: "#FF8E53", dot: "#FF8E53" },
  { id: "level7", label: "Level 7", hint: "Advanced",               color: "from-[#FFC847] to-[#A8E063]", accent: "#FFC847", dot: "#FFC847" },
  { id: "level6", label: "Level 6", hint: "Psychology",             color: "from-[#A8E063] to-[#56CCF2]", accent: "#56CCF2", dot: "#56CCF2" },
  { id: "level5", label: "Level 5", hint: "Advanced writing",       color: "from-[#56CCF2] to-[#6C8EEA]", accent: "#6C8EEA", dot: "#6C8EEA" },
  { id: "level4", label: "Level 4", hint: "Career choosing",        color: "from-[#6C8EEA] to-[#9B59B6]", accent: "#9B59B6", dot: "#9B59B6" },
  { id: "level3", label: "Level 3", hint: "Core deep",              color: "from-[#9B59B6] to-[#C0392B]", accent: "#9B59B6", dot: "#9B59B6" },
  { id: "level2", label: "Level 2", hint: "Core extension",         color: "from-[#C0392B] to-[#E67E22]", accent: "#E67E22", dot: "#E67E22" },
  { id: "level1", label: "Level 1", hint: "Core extension",         color: "from-[#E67E22] to-[#F1C40F]", accent: "#F1C40F", dot: "#F1C40F" },
  { id: "level0", label: "FREE",    hint: "Core",                   color: "from-[#2ECC71] to-[#1ABC9C]", accent: "#2ECC71", dot: "#2ECC71" },
];

const ALL_TIER_IDS: TierId[] = ["level0","level1","level2","level3","level4","level5","level6","level7","level8","level9"];

function normTier(t: unknown): TierId {
  const x = String(t || "level0").toLowerCase().trim();
  if (ALL_TIER_IDS.includes(x as TierId)) return x as TierId;
  return "level0";
}

/**
 * RoomMeta plus the legacy/DB-projection extras some rows still carry
 * (`title`, `keywords_en`, `keywords_vi`) that are not on the canonical
 * RoomMeta type. Kept structural so a plain FetcherRoomMeta is assignable.
 */
type TierMapRoom = FetcherRoomMeta & {
  title?: string | null;
  keywords_en?: unknown;
  keywords_vi?: unknown;
};

function titleOf(r: TierMapRoom): string {
  return r?.title_en || r?.title_vi || r?.title || r?.id || "Untitled";
}

function matchRoom(r: FetcherRoomMeta, qRaw: string) {
  const q = String(qRaw || "").trim().toLowerCase();
  if (!q) return true;
  const rx = r as TierMapRoom;
  const kwEn = rx.keywords_en;
  const kwVi = rx.keywords_vi;
  const hay = [
    String(rx.id || ""),
    String(titleOf(rx)),
    String(rx.title_en || ""),
    String(rx.title_vi || ""),
    Array.isArray(kwEn) ? kwEn.join(" ") : "",
    Array.isArray(kwVi) ? kwVi.join(" ") : "",
  ].join(" ").toLowerCase();
  return hay.includes(q);
}

export default function TierMapPage() {
  const [rooms, setRooms] = useState<FetcherRoomMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<TierId, boolean>>({
    level0: true, level1: false, level2: false, level3: false, level4: false,
    level5: false, level6: false, level7: false, level8: false, level9: true,
  });

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
    return () => { cancelled = true; };
  }, []);

  // Inject the tier-map font once on mount (idempotent).
  useEffect(() => {
    loadGoogleFont(TIERMAP_FONT_HREF);
  }, []);

  const grouped = useMemo(() => {
    const map: Record<TierId, FetcherRoomMeta[]> = Object.fromEntries(ALL_TIER_IDS.map(id => [id, []])) as unknown as Record<TierId, FetcherRoomMeta[]>;
    for (const r of rooms) map[normTier(r?.tier)].push(r);
    for (const k of ALL_TIER_IDS) map[k].sort((a, b) => String(titleOf(a)).localeCompare(String(titleOf(b))));
    return map;
  }, [rooms]);

  const filteredGrouped = useMemo(() => {
    const out: Record<TierId, FetcherRoomMeta[]> = Object.fromEntries(ALL_TIER_IDS.map(id => [id, []])) as unknown as Record<TierId, FetcherRoomMeta[]>;
    for (const t of TIERS) out[t.id] = grouped[t.id].filter(r => matchRoom(r, query));
    return out;
  }, [grouped, query]);

  const totalRooms = rooms.length;
  const totalVisible = useMemo(() => Object.values(filteredGrouped).flat().length, [filteredGrouped]);
  const coreRooms = useMemo(() => (grouped["level0"]?.length || 0), [grouped]);

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <style>{`
        .tm-root { font-family: 'DM Sans', sans-serif; color: #E8E8F0; }

        /* Hero */
        .tm-hero {
          position: relative;
          padding: 48px 24px 36px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .tm-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 800px 400px at 20% 50%, rgba(255,107,107,0.08), transparent 60%),
            radial-gradient(ellipse 600px 300px at 80% 30%, rgba(108,142,234,0.10), transparent 55%),
            radial-gradient(ellipse 500px 300px at 50% 100%, rgba(46,204,113,0.06), transparent 50%);
          pointer-events: none;
        }
        .tm-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #FFFFFF 0%, #B0B0CC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tm-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        /* Stats row */
        .tm-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 14px 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          border-radius: 16px;
        }
        .tm-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .tm-stat-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.40);
        }

        /* Search */
        .tm-search {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 12px 16px;
          color: #E8E8F0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .tm-search::placeholder { color: rgba(255,255,255,0.25); }
        .tm-search:focus {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
        }

        /* Tier card */
        .tm-tier {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .tm-tier:hover { border-color: rgba(255,255,255,0.12); }

        .tm-tier-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          cursor: pointer;
          user-select: none;
          gap: 12px;
        }
        .tm-tier-head:hover { background: rgba(255,255,255,0.02); }

        .tm-level-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tm-level-name {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
        }
        .tm-level-hint {
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          font-weight: 400;
        }
        .tm-level-count {
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          padding: 2px 10px;
          color: rgba(255,255,255,0.55);
          flex-shrink: 0;
        }
        .tm-chevron {
          font-size: 12px;
          color: rgba(255,255,255,0.30);
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .tm-chevron.open { transform: rotate(180deg); }

        /* Bar accent */
        .tm-tier-bar {
          height: 2px;
          margin: 0 18px;
          border-radius: 999px;
          opacity: 0.5;
        }

        /* Room grid */
        .tm-rooms {
          padding: 12px 14px 14px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 8px;
        }
        .tm-room {
          display: block;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 10px 12px;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
        }
        .tm-room:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.16);
          transform: translateY(-1px);
        }
        .tm-room-title {
          font-size: 13px;
          font-weight: 600;
          color: #E8E8F0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tm-room-id {
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Buttons */
        .tm-btn {
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.05);
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .tm-btn:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.20);
          color: rgba(255,255,255,0.85);
        }

        /* Nav links */
        .tm-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          border-radius: 999px;
          padding: 6px 14px;
          transition: color 0.15s, background 0.15s;
        }
        .tm-nav-link:hover {
          color: rgba(255,255,255,0.80);
          background: rgba(255,255,255,0.08);
        }

        /* Empty state */
        .tm-empty {
          padding: 20px;
          font-size: 13px;
          color: rgba(255,255,255,0.25);
          text-align: center;
        }
      `}</style>

      <div className="tm-root">
        {/* Hero */}
        <div className="tm-hero">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3 flex-wrap">
                <Link to="/" className="tm-nav-link">← Home</Link>
                <span className="tm-badge">Tier Map</span>
              </div>
              <ThemeToggle />
            </div>

            <h1 className="tm-hero-title mb-2">Mercy Blade</h1>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "rgba(255,255,255,0.38)", marginBottom: 24 }}>
              Tier Map — Level 0 → Level 9
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="tm-stat">
                <div className="tm-stat-num">{loading ? "…" : totalRooms}</div>
                <div className="tm-stat-label">Rooms (all)</div>
              </div>
              <div className="tm-stat">
                <div className="tm-stat-num">{loading ? "…" : coreRooms}</div>
                <div className="tm-stat-label">Free rooms</div>
              </div>
              <div className="tm-stat">
                <div className="tm-stat-num">{loading ? "…" : totalRooms - coreRooms}</div>
                <div className="tm-stat-label">Premium rooms</div>
              </div>
              <div className="tm-stat">
                <div className="tm-stat-num">{loading ? "…" : totalVisible}</div>
                <div className="tm-stat-label">Showing</div>
              </div>
            </div>

            {/* Search + controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1" style={{ minWidth: 240 }}>
                <input
                  className="tm-search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search rooms by title, id, keywords…"
                />
              </div>
              <button className="tm-btn" onClick={() => setExpanded(Object.fromEntries(ALL_TIER_IDS.map(id => [id, true])) as Record<TierId, boolean>)}>
                Expand all
              </button>
              <button className="tm-btn" onClick={() => setExpanded(Object.fromEntries(ALL_TIER_IDS.map(id => [id, false])) as Record<TierId, boolean>)}>
                Collapse all
              </button>
            </div>
          </div>
        </div>

        {/* Tier list */}
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-3">
          {TIERS.map(t => {
            const list = filteredGrouped[t.id] || [];
            const isOpen = !!expanded[t.id];

            return (
              <div key={t.id} className="tm-tier">
                {/* Colored top bar */}
                <div
                  className="tm-tier-bar"
                  style={{ background: `linear-gradient(90deg, ${t.accent}, transparent)` }}
                />

                <div
                  className="tm-tier-head"
                  onClick={() => setExpanded(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="tm-level-dot" style={{ background: t.dot }} />
                    <div className="min-w-0">
                      <div className="tm-level-name">{t.label}</div>
                      <div className="tm-level-hint">{t.hint}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="tm-level-count">
                      {loading ? "…" : `${list.length} room${list.length === 1 ? "" : "s"}`}
                    </span>
                    <span className={`tm-chevron ${isOpen ? "open" : ""}`}>▼</span>
                  </div>
                </div>

                {isOpen && (
                  <div>
                    {loading ? (
                      <div className="tm-empty">Loading…</div>
                    ) : list.length === 0 ? (
                      <div className="tm-empty">No rooms match.</div>
                    ) : (
                      <div className="tm-rooms">
                        {list.map(r => {
                          const id = String(r?.id || "");
                          const title = String(titleOf(r));
                          return (
                            <Link key={id || title} to={id ? `/room/${id}` : "#"} className="tm-room">
                              <div className="tm-room-title">{title}</div>
                              <div className="tm-room-id">{id ? `/${id}` : "—"}</div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}