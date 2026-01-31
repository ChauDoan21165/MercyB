// FILE: TierDetail.tsx
// PATH: src/pages/TierDetail.tsx
// MB-BLUE-99.4a → MB-BLUE-99.4d — 2026-01-17 (+0700)
//
// FIX (99.4d):
// 1) Page "dead/unclickable" hardening (same as TierIndex):
//    - isolation + very high zIndex + pointerEvents on page/container.
// 2) Keep 99.4a: ?area=... and ?debugTier=1 reactive via useLocation().search
// 3) Restore 99.4c: FREE split is explicit-only LIFE detection (NO generic "-life-")
//    - Free LIFE  = tier=free AND isExplicitLifeRoom(id)
//    - Free CORE  = tier=free AND NOT explicit-life AND area NOT english/kids/life
// 4) tierAreaCounts for FREE uses effective split (core vs life) + diagnostic english/kids counts.
//
// NOTE: UI containment only; source-of-truth still belongs in tierRoomSource.
//
// PATCH (99.4d hardening):
// - Catch loadRoomsForTiers() errors so TierDetail doesn't crash the whole page.
//
// PATCH (2026-01-29):
// - Add HOME + BACK (history) buttons at top, like Tier Map UX.
//
// PATCH (2026-01-31):
// - REMOVE local Home/Back top nav to avoid duplicates.
//   GlobalHeader/AppShell now owns Home+Back across pages.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { ALL_TIER_IDS, tierIdToLabel, type TierId } from "@/lib/constants/tiers";
import type { TierRoom, TierSource, RoomArea } from "@/lib/tierRoomSource";
import { loadRoomsForTiers } from "@/lib/tierRoomSource";

type RoomMetaLike = {
  id: string;
  title_en?: string;
  title_vi?: string;
};

function isTierId(x: string): x is TierId {
  return (ALL_TIER_IDS as readonly string[]).includes(x);
}

function pickTitle(r: RoomMetaLike) {
  return r?.title_en || r?.title_vi || r?.id;
}

function parseAreaParam(v: string | null): RoomArea | null {
  const s = String(v || "").toLowerCase().trim();
  if (s === "core" || s === "kids" || s === "english" || s === "life") return s;
  return null;
}

function defaultAreaForTier(t: TierId): RoomArea {
  if (t === "kids_1" || t === "kids_2" || t === "kids_3") return "kids";
  return "core";
}

/**
 * LIFE (Survival) must be explicit-only.
 * Do NOT use generic "-life-" (it catches "meaning-of-life").
 */
function isExplicitLifeRoom(r: TierRoom): boolean {
  const id = String(r?.id || "").toLowerCase();

  // ✅ Survival explicit markers
  if (id.startsWith("survival-") || id.startsWith("survival_")) return true;
  if (id.includes("-survival-") || id.includes("_survival_")) return true;
  if (id.endsWith("-survival") || id.endsWith("_survival")) return true;

  // ✅ Life-skill explicit markers (strict; avoids "meaning-of-life")
  if (id.startsWith("life-skill-") || id.startsWith("life_skill_")) return true;
  if (id.startsWith("life-skills-") || id.startsWith("life_skills_")) return true;
  if (id.includes("-life-skill-") || id.includes("_life_skill_")) return true;
  if (id.includes("-life-skills-") || id.includes("_life_skills_")) return true;
  if (id.endsWith("-life-skill") || id.endsWith("_life_skill")) return true;
  if (id.endsWith("-life-skills") || id.endsWith("_life_skills")) return true;

  return false;
}

type TierAreaCounts = { core: number; kids: number; english: number; life: number };

export default function TierDetail() {
  const { tierId } = useParams<{ tierId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const tier = isTierId(String(tierId || "").toLowerCase())
    ? (String(tierId).toLowerCase() as TierId)
    : null;

  const isKidsTier = tier === "kids_1" || tier === "kids_2" || tier === "kids_3";

  const [rooms, setRooms] = useState<TierRoom[]>([]);
  const [source, setSource] = useState<TierSource>("none");
  const [debug, setDebug] = useState<string | undefined>(undefined);

  // ✅ Debug-only visibility flag (keeps diagnostics out of normal UI)
  // - Supports existing ?debugTier=1
  // - Also supports ?debug=1
  // - Always true in DEV
  const showDebug = useMemo(() => {
    try {
      const qs = new URLSearchParams(location.search);
      return import.meta.env.DEV || qs.get("debugTier") === "1" || qs.get("debug") === "1";
    } catch {
      return Boolean(import.meta.env.DEV);
    }
  }, [location.search]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await loadRoomsForTiers();
        if (!alive) return;
        setRooms(res.rooms || []);
        setSource(res.source);
        setDebug(res.debug);
      } catch (e: any) {
        if (!alive) return;
        setRooms([]);
        setSource("none");
        setDebug(`TierDetail loadRoomsForTiers failed: ${String(e?.message || e)}`);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const areaToShow = useMemo<RoomArea>(() => {
    if (!tier) return "core";
    try {
      const qs = new URLSearchParams(location.search);
      const forced = parseAreaParam(qs.get("area"));
      if (forced) return forced;
    } catch {
      // no-op
    }
    return defaultAreaForTier(tier);
  }, [tier, location.search]);

  const filtered = useMemo(() => {
    if (!tier) return [];

    // ✅ Free containment split (matches TierIndex + previous 99.4c intent)
    if (tier === "free") {
      if (areaToShow === "life") {
        return rooms.filter((r) => r.tier === "free" && isExplicitLifeRoom(r));
      }
      if (areaToShow === "core") {
        return rooms.filter((r) => {
          if (r.tier !== "free") return false;
          if (isExplicitLifeRoom(r)) return false;
          const a = String((r as any).area || "").toLowerCase();
          if (a === "english" || a === "kids" || a === "life") return false;
          return true;
        });
      }
      // forced english/kids views
      return rooms.filter((r) => r.tier === "free" && String((r as any).area || "").toLowerCase() === areaToShow);
    }

    // non-free tiers: normal filter
    return rooms.filter((r) => r.tier === tier && String((r as any).area || "").toLowerCase() === areaToShow);
  }, [rooms, tier, areaToShow]);

  const tierAreaCounts = useMemo<TierAreaCounts>(() => {
    if (!tier) return { core: 0, kids: 0, english: 0, life: 0 };

    const out: TierAreaCounts = { core: 0, kids: 0, english: 0, life: 0 };

    if (tier === "free") {
      // Effective split for Free:
      for (const r of rooms) {
        if (r.tier !== "free") continue;
        if (isExplicitLifeRoom(r)) out.life += 1;
        else {
          const a = String((r as any).area || "").toLowerCase();
          // keep spine-core clean: don't count english/kids/life inside "core"
          if (a !== "english" && a !== "kids" && a !== "life") out.core += 1;
        }
      }

      // Diagnostic-only: what DB thinks is english/kids for free
      for (const r of rooms) {
        if (r.tier !== "free") continue;
        const a = String((r as any).area || "").toLowerCase();
        if (a === "english") out.english += 1;
        if (a === "kids") out.kids += 1;
      }

      return out;
    }

    for (const r of rooms) {
      if (r.tier !== tier) continue;
      const a = String((r as any).area || "").toLowerCase();
      if (a === "core") out.core += 1;
      else if (a === "kids") out.kids += 1;
      else if (a === "english") out.english += 1;
      else if (a === "life") out.life += 1;
    }
    return out;
  }, [rooms, tier]);

  const rainbow =
    "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

  // ✅ click-safety: keep this page above any global overlays
  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: "rgba(225, 245, 255, 0.85)",
    padding: "18px 0 140px",
    position: "relative",
    zIndex: 999999,
    pointerEvents: "auto",
    isolation: "isolate",
  };

  const container: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 16px",
    position: "relative",
    zIndex: 999999,
    pointerEvents: "auto",
  };

  const headerCard: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    padding: "16px 16px",
    pointerEvents: "auto",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: -0.8,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
    lineHeight: 1.05,
  };

  const sub: React.CSSProperties = {
    marginTop: 6,
    color: "rgba(0,0,0,0.62)",
    fontWeight: 700,
    fontSize: 16,
  };

  const back: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 800,
    color: "rgba(0,0,0,0.65)",
    textDecoration: "underline",
  };

  const debugLine: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(0,0,0,0.50)",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  };

  const grid: React.CSSProperties = {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 14,
    pointerEvents: "auto",
    alignItems: "stretch",
  };

  const cardBase: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.86)",
    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
    padding: "14px 14px 12px",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    display: "flex",
    flexDirection: "column",
    pointerEvents: "auto",
    minHeight: 112, // ✅ consistent rhythm
  };

  // ✅ 2-line clamp for long slugs; keeps cards calm
  const cardTitle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 800,
    color: "rgba(0,0,0,0.78)",
    letterSpacing: -0.2,
    margin: 0,
    lineHeight: 1.2,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  const codeRow: React.CSSProperties = {
    marginTop: "auto", // ✅ pins actions to bottom
    paddingTop: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  };

  const pill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.80)",
    fontSize: 12.5,
    fontWeight: 800,
    color: "rgba(0,0,0,0.58)",
    whiteSpace: "nowrap",
    opacity: 0.92,
  };

  const tinyCode: React.CSSProperties = {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(0,0,0,0.55)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "58%",
  };

  const emptyCard: React.CSSProperties = {
    marginTop: 14,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "rgba(255,255,255,0.70)",
    padding: "16px 16px",
    color: "rgba(0,0,0,0.70)",
    lineHeight: 1.6,
    pointerEvents: "auto",
  };

  const emptyTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
    color: "rgba(0,0,0,0.78)",
  };

  if (!tier) {
    return (
      <div style={page}>
        <div style={container}>
          <div style={headerCard}>
            <h1 style={{ ...titleStyle, fontSize: 26 }}>Tier not found</h1>
            <div style={{ marginTop: 10 }}>
              <Link style={back} to="/tiers">
                Back to Tier Map
              </Link>
            </div>
            {showDebug ? (
              <div style={debugLine}>
                source={source}
                {debug ? ` | ${debug}` : ""}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={container}>
        <div style={headerCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "baseline",
            }}
          >
            <h1 style={titleStyle}>{tierIdToLabel(tier)}</h1>
            <Link style={back} to="/tiers">
              Back to Tier Map
            </Link>
          </div>

          <div style={sub}>
            Rooms in this tier ({areaToShow.toUpperCase()}): <b>{filtered.length}</b>
          </div>

          {/* ✅ Debug-only diagnostics (keeps premium UI clean) */}
          {showDebug ? (
            <div style={debugLine}>
              source={source}
              {debug ? ` | ${debug}` : ""}
              {` | tier-area counts: core=${tierAreaCounts.core}, kids=${tierAreaCounts.kids}, english=${tierAreaCounts.english}, life=${tierAreaCounts.life}`}
            </div>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div style={emptyCard} aria-label="Tier empty state">
            <p style={emptyTitle}>No rooms in this tier for {areaToShow.toUpperCase()} (yet).</p>

            <div style={{ marginTop: 6 }}>
              If this looks wrong, it usually means either:
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                <li>
                  The room ids are not tagged, or the <b>area</b> classifier isn’t marking them correctly.
                </li>

                {isKidsTier ? (
                  <li>
                    For kids tiers: try <b>?debug=1</b> or <b>?debugTier=1</b> and check “excluded by area”. You can
                    also override with <b>?area=kids</b> / <b>?area=core</b>.
                  </li>
                ) : tier === "free" && areaToShow === "life" ? (
                  <li>
                    LIFE is <b>explicit-only</b> (survival-* / life-skill-*). If empty, you currently have no FREE rooms
                    with those id markers.
                  </li>
                ) : (
                  <li>
                    Spine tiers default to CORE. For debugging you can try <b>?area=kids</b> / <b>?area=english</b> /{" "}
                    <b>?area=life</b> / <b>?debug=1</b>.
                  </li>
                )}
              </ul>
            </div>

            {showDebug ? (
              <div style={{ marginTop: 10, ...debugLine }}>
                tip: add <b>?debug=1</b> to show diagnostics on this page.
              </div>
            ) : null}
          </div>
        ) : null}

        <div style={grid} aria-label="Tier room grid">
          {filtered.map((r) => (
            <Link
              key={r.id}
              to={`/room/${r.id}`}
              style={cardBase}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 12px 26px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.08)";
              }}
              aria-label={`Open room ${r.id}`}
            >
              <p style={cardTitle}>{pickTitle({ id: r.id, title_en: r.title_en, title_vi: r.title_vi })}</p>

              <div style={codeRow}>
                <span style={pill}>OPEN</span>
                {showDebug ? <span style={tinyCode}>id: {r.id}</span> : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
