// FILE: TierDetail.tsx
// PATH: src/pages/TierDetail.tsx
// MB-BLUE-99.4a → MB-BLUE-99.4d — 2026-01-17 (+0700)
//
// FIX (99.4d):
// 1) Page "dead/unclickable" hardening (same as TierIndex):
//    - isolation + very high zIndex + pointerEvents on page/container.
// 2) Keep 99.4a: ?area=... and ?debugTier=1 reactive via useLocation().search
// 3) Restore 99.4c: FREE split is explicit-only LIFE detection (NO generic "-life-")
//    - Level 0 LIFE  = tier=level0 AND isExplicitLifeRoom(id)
//    - Level 0 CORE  = tier=level0 AND NOT explicit-life AND area NOT english/kids/life
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

const DOMAIN_IMAGE_MAP: Record<string, string> = {
  'general': '/images/domains/general.svg',
  'kids': '/images/domains/kids.svg',
  'strategy': '/images/domains/strategy.svg',
  'mental health': '/images/domains/mental_health.svg',
  'english': '/images/domains/english.svg',
  'english a1': '/images/domains/english.svg',
  'english a2': '/images/domains/english.svg',
  'english b1': '/images/domains/english.svg',
  'english c1': '/images/domains/english.svg',
  'english c2': '/images/domains/english.svg',
  'corporate': '/images/domains/corporate.svg',
  'survival': '/images/domains/survival.svg',
  'health': '/images/domains/health.svg',
  'national': '/images/domains/national.svg',
  'productivity': '/images/domains/productivity.svg',
  'individual': '/images/domains/individual.svg',
  'power': '/images/domains/power.svg',
  'influence': '/images/domains/influence.svg',
  'ai & technology': '/images/domains/ai_and_technology.svg',
  'interpersonal': '/images/domains/interpersonal.svg',
  'lifeskills': '/images/domains/lifeskills.svg',
  'spirituality': '/images/domains/spirituality.svg',
  'self-mastery': '/images/domains/self_mastery.svg',
  'critical thinking': '/images/domains/critical_thinking.svg',
  'public speaking': '/images/domains/public_speaking.svg',
  'decision making': '/images/domains/decision_making.svg',
  'debate': '/images/domains/debate.svg',
  'relationships': '/images/domains/relationships.svg',
  'perception': '/images/domains/perception.svg',
};

function getDomainImage(domain?: string | null, id?: string): string | undefined {
  if (domain) {
    const img = DOMAIN_IMAGE_MAP[domain.toLowerCase().trim()];
    if (img) return img;
  }
  // Fallback: derive from room ID
  if (id) {
    const lid = id.toLowerCase();
    if (lid.includes('kids') || lid.includes('_l1') || lid.includes('_l2') || lid.includes('_l3')) return DOMAIN_IMAGE_MAP['kids'];
    if (lid.includes('strategy') || lid.includes('vip9') || lid.includes('sun_tzu') || lid.includes('machiavelli')) return DOMAIN_IMAGE_MAP['strategy'];
    if (lid.includes('mental') || lid.includes('anxiety') || lid.includes('depression') || lid.includes('adhd') || lid.includes('addiction')) return DOMAIN_IMAGE_MAP['mental health'];
    if (lid.includes('english') || lid.includes('_a1') || lid.includes('_a2') || lid.includes('_b1') || lid.includes('_b2') || lid.includes('_c1') || lid.includes('_c2')) return DOMAIN_IMAGE_MAP['english'];
    if (lid.includes('corporate') || lid.includes('business') || lid.includes('management')) return DOMAIN_IMAGE_MAP['corporate'];
    if (lid.includes('survival') || lid.includes('crisis')) return DOMAIN_IMAGE_MAP['survival'];
    if (lid.includes('health') || lid.includes('fitness') || lid.includes('nutrition')) return DOMAIN_IMAGE_MAP['health'];
    if (lid.includes('nation') || lid.includes('politic') || lid.includes('history')) return DOMAIN_IMAGE_MAP['national'];
    if (lid.includes('productiv') || lid.includes('habit') || lid.includes('time_manage')) return DOMAIN_IMAGE_MAP['productivity'];
    if (lid.includes('power') || lid.includes('dominan')) return DOMAIN_IMAGE_MAP['power'];
    if (lid.includes('influenc') || lid.includes('persuasion')) return DOMAIN_IMAGE_MAP['influence'];
    if (lid.includes('ai') || lid.includes('tech') || lid.includes('digital')) return DOMAIN_IMAGE_MAP['ai & technology'];
    if (lid.includes('speak') || lid.includes('speech') || lid.includes('present')) return DOMAIN_IMAGE_MAP['public speaking'];
    if (lid.includes('debate')) return DOMAIN_IMAGE_MAP['debate'];
    if (lid.includes('relation') || lid.includes('love') || lid.includes('marriage')) return DOMAIN_IMAGE_MAP['relationships'];
    if (lid.includes('spirit') || lid.includes('mindful') || lid.includes('meditation')) return DOMAIN_IMAGE_MAP['spirituality'];
  }
  return DOMAIN_IMAGE_MAP['general'];
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

    // ✅ Level 0 containment split (matches TierIndex + previous 99.4c intent)
    if (tier === "level0") {
      if (areaToShow === "life") {
        return rooms.filter((r) => r.tier === "level0" && isExplicitLifeRoom(r));
      }
      if (areaToShow === "core") {
        return rooms.filter((r) => {
          if (r.tier !== "level0") return false;
          if (isExplicitLifeRoom(r)) return false;
          const a = String((r as any).area || "").toLowerCase();
          if (a === "english" || a === "kids" || a === "life") return false;
          return true;
        });
      }
      // forced english/kids views
      return rooms.filter((r) => r.tier === "level0" && String((r as any).area || "").toLowerCase() === areaToShow);
    }

    // non-level0 tiers: normal filter
    return rooms.filter((r) => r.tier === tier && String((r as any).area || "").toLowerCase() === areaToShow);
  }, [rooms, tier, areaToShow]);

  const tierAreaCounts = useMemo<TierAreaCounts>(() => {
    if (!tier) return { core: 0, kids: 0, english: 0, life: 0 };

    const out: TierAreaCounts = { core: 0, kids: 0, english: 0, life: 0 };

    if (tier === "level0") {
      // Effective split for Level 0:
      for (const r of rooms) {
        if (r.tier !== "level0") continue;
        if (isExplicitLifeRoom(r)) out.life += 1;
        else {
          const a = String((r as any).area || "").toLowerCase();
          // keep spine-core clean: don't count english/kids/life inside "core"
          if (a !== "english" && a !== "kids" && a !== "life") out.core += 1;
        }
      }

      // Diagnostic-only: what DB thinks is english/kids for level0
      for (const r of rooms) {
        if (r.tier !== "level0") continue;
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
    display: "flex",
    flexDirection: "column",
    gap: 8,
    pointerEvents: "auto",
  };

  const cardBase: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.86)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    padding: "10px 12px",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    pointerEvents: "auto",
  };

  const cardTitle: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: "rgba(0,0,0,0.78)",
    letterSpacing: -0.2,
    margin: 0,
    lineHeight: 1.3,
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const codeRow: React.CSSProperties = {
    marginTop: "auto",
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
            <h1 style={titleStyle}>{tierIdToLabel[tier] ?? tier}</h1>
            <Link style={back} to="/tiers">
              Back to Tier Map
            </Link>
          </div>

          <div style={sub}>
            Rooms in this tier ({areaToShow.toUpperCase()}): <b>{filtered.length}</b>
          </div>

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
                ) : tier === "level0" && areaToShow === "life" ? (
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
              <img src={getDomainImage((r as any).domain, r.id)} alt="" aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0, opacity: 0.95 }} loading="lazy" />
              <p style={cardTitle}>{pickTitle({ id: r.id, title_en: r.title_en, title_vi: r.title_vi })}</p>
              <svg style={{ flexShrink: 0, opacity: 0.35 }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}