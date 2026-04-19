/**
 * Path: src/pages/TierIndex.tsx
 * File: TierIndex.tsx
 */

// PATH: src/pages/TierIndex.tsx
// MB-BLUE-98.9j → MB-BLUE-98.9o — 2026-04-19
//
// PATCH (2026-03-01):
// - REMOVE old displayed tier prices ($5/$12/$29) from Tier Map UI.
// - Add a clear link to the real pricing page (/pricing) instead.
// - REMOVE "God / Universe" decoration entirely.
// - Make Pricing button less harsh (softer, readable).
//
// FIX (98.9k — DELETE Level 3 II from Tier Map UI):
// - Remove level3 from SpineTierId + SPINE_TOP_TO_BOTTOM so the pill disappears.
// - Keep all tier loading/counting logic stable.
//
// FIX (98.9k+ — Level 1 RIGHT CARD):
// - Change Level 1 right anchor from "Martial art / Discipline" → "Survival skills"
// - Route to LIFE area explicitly: /tiers/level1?area=life
//
// FIX (98.9l — AREA-SAFE ROUTING, ALL TIERS):
// - Problem: left + spine + right often landed in the same default (core) because links lacked ?area=...
// - Solution: keep ALL features, only make routing explicit.
//
// FIX (98.9m — REMOVE CONFUSING MID BAND LABELS):
// - Remove the whole mid-band block.
//
// FIX (98.9m+ — REMOVE FREE RIGHT CARD):
// - Delete "Survival skills" card from Level 0 row on the RIGHT.
//
// FIX (98.9m++ — HUNT HIDDEN ROOMS, SAFE DEBUG):
// - Add area/tier breakdown + “hidden bucket” detection.
//
// FIX (98.9n — EXPOSE LOADED ROOMS FOR CONSOLE DEBUG):
// - Export safe globals AFTER DB load.
//
// PATCH (2026-04-12):
// - Remove all old pricing UI (lower CTA, $ icon, price text).
// - Keep only top black "Pricing / Upgrade" button linking to /upgrade.
// - Apply real Mercy Blade color language (soft premium neutrals + tier accents from colors.ts).
// - Stronger visual brand impact while keeping the page clean and readable.
//
// PATCH (2026-04-17):
// - Mobile-first hardening.
// - Do not render the old desktop 3-column map on small screens.
// - Compress mobile spacing.
// - Make stat pills wrap safely.
// - Hide long debug/source text on normal mobile view.
//
// PATCH (2026-04-19):
// - Make Tier Map more colorful without changing routing or data logic.
// - Add soft rainbow page background, colorful stat pills, and level-colored tier links.
// - Add subtle color accents to cards while keeping readability high.

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { TierRoom, TierSource } from "@/lib/tierRoomSource";
import { loadRoomsForTiers } from "@/lib/tierRoomSource";

type SpineTierId =
  | "level0"
  | "level1"
  | "level2"
  | "level3"
  | "level4"
  | "level5"
  | "level6"
  | "level7"
  | "level8"
  | "level9";

type TierNode = {
  id: SpineTierId;
  label: string;
  hint?: string;
};

type CountsState = {
  source: TierSource;
  debug?: string;
  totalAll: number;
  totalCore: number;
  unknownCoreTier: number;
  bySpineTier: Record<SpineTierId, number>;
};

const MOBILE_BREAKPOINT = 860;

const rainbow =
  "linear-gradient(90deg,#ff5a7a 0%,#ff9d57 18%,#ffd85a 32%,#7be77b 48%,#66d7ff 66%,#7b8cff 82%,#c86cff 100%)";

const pageGlow =
  [
    "radial-gradient(circle at 0% 0%, rgba(255,132,169,0.22) 0, transparent 28%)",
    "radial-gradient(circle at 100% 8%, rgba(95,190,255,0.18) 0, transparent 26%)",
    "radial-gradient(circle at 50% 100%, rgba(255,214,102,0.16) 0, transparent 24%)",
    "linear-gradient(180deg, #fbfbff 0%, #f6f7ff 38%, #f8fbff 100%)",
  ].join(",");

const SPINE_TOP_TO_BOTTOM: TierNode[] = [
  { id: "level9", label: "Level 9", hint: "Top level" },
  { id: "level8", label: "Level 8", hint: "High mastery" },
  { id: "level7", label: "Level 7", hint: "Advanced" },
  { id: "level6", label: "Level 6", hint: "Systems / strategy" },
  { id: "level5", label: "Level 5", hint: "Writing / deeper practice" },
  { id: "level4", label: "Level 4", hint: "Climb" },
  { id: "level3", label: "Level 3", hint: "Bridge into the spine" },
  { id: "level2", label: "Level 2", hint: "Strengthen core skills" },
  { id: "level1", label: "Level 1", hint: "Build habit + foundation + survival basics" },
  { id: "level0", label: "Level 0", hint: "Ground / basics" },
];

function norm(v: any): string {
  return String(v ?? "").toLowerCase().trim();
}

function blankCounts(): CountsState {
  const bySpineTier = Object.fromEntries(SPINE_TOP_TO_BOTTOM.map((t) => [t.id, 0])) as Record<
    SpineTierId,
    number
  >;

  return {
    source: "none",
    debug: undefined,
    totalAll: 0,
    totalCore: 0,
    unknownCoreTier: 0,
    bySpineTier,
  };
}

function inferSpineTierFromId(idRaw: any): SpineTierId | null {
  const id = norm(idRaw);
  if (!id) return null;

  const has = (t: SpineTierId) =>
    id === t ||
    id.startsWith(`${t}_`) ||
    id.startsWith(`${t}-`) ||
    id.endsWith(`_${t}`) ||
    id.endsWith(`-${t}`) ||
    id.includes(`_${t}_`) ||
    id.includes(`-${t}-`) ||
    id.includes(`_${t}-`) ||
    id.includes(`-${t}_`);

  if (has("level9")) return "level9";
  if (has("level8")) return "level8";
  if (has("level7")) return "level7";
  if (has("level6")) return "level6";
  if (has("level5")) return "level5";
  if (has("level4")) return "level4";
  if (has("level3")) return "level3";
  if (has("level2")) return "level2";
  if (has("level1")) return "level1";

  if (
    id === "level0" ||
    id.startsWith("free_") ||
    id.startsWith("level0-") ||
    id.endsWith("_free") ||
    id.endsWith("-level0") ||
    id.includes("_level0_") ||
    id.includes("-level0-")
  ) {
    return "level0";
  }

  return null;
}

function inferSpineTierFromRank(r: TierRoom): SpineTierId | null {
  const anyR: any = r as any;

  const candidates = [
    anyR.required_rank,
    anyR.requiredRank,
    anyR.required_vip_rank,
    anyR.requiredVipRank,
    anyR.min_rank,
    anyR.minRank,
    anyR.vip_rank,
    anyR.vipRank,
    anyR.rank,
  ];

  let rank: number | null = null;

  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) {
      rank = c;
      break;
    }
    if (typeof c === "string" && c.trim() !== "" && Number.isFinite(Number(c))) {
      rank = Number(c);
      break;
    }
  }

  if (rank === null) return null;

  const rr = Math.max(0, Math.min(9, Math.trunc(rank)));
  if (rr === 0) return "level0";
  return `vip${rr}` as SpineTierId;
}

function inferSpineTierForCounting(r: TierRoom, spineSet: Set<string>): SpineTierId | null {
  const t = norm((r as any).tier);
  if (t && spineSet.has(t)) return t as SpineTierId;

  const byRank = inferSpineTierFromRank(r);
  if (byRank && spineSet.has(byRank)) return byRank;

  const byId = inferSpineTierFromId((r as any).id);
  if (byId && spineSet.has(byId)) return byId;

  return null;
}

function isExplicitLifeRoom(r: TierRoom): boolean {
  const id = String((r as any)?.id || "").toLowerCase();

  if (id.startsWith("survival-") || id.startsWith("survival_")) return true;
  if (id.includes("-survival-") || id.includes("_survival_")) return true;
  if (id.endsWith("-survival") || id.endsWith("_survival")) return true;

  if (id.startsWith("life-skill-") || id.startsWith("life_skill_")) return true;
  if (id.startsWith("life-skills-") || id.startsWith("life_skills_")) return true;
  if (id.includes("-life-skill-") || id.includes("_life_skill_")) return true;
  if (id.includes("-life-skills-") || id.includes("_life_skills_")) return true;
  if (id.endsWith("-life-skill") || id.endsWith("_life_skill")) return true;
  if (id.endsWith("-life-skills") || id.endsWith("_life_skills")) return true;

  return false;
}

function useIsMobileTierMap(): boolean {
  const getValue = () =>
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_BREAKPOINT : false;

  const [isMobile, setIsMobile] = useState<boolean>(getValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile;
}

function getTierTheme(id: SpineTierId) {
  const map: Record<
    SpineTierId,
    { band: string; glow: string; dot: string; pillBg: string; pillBorder: string }
  > = {
    level9: {
      band: "linear-gradient(135deg, rgba(255,95,143,0.30) 0%, rgba(255,198,86,0.22) 48%, rgba(187,113,255,0.28) 100%)",
      glow: "0 10px 24px rgba(255,120,160,0.18)",
      dot: "#ff5f96",
      pillBg: "rgba(255,111,157,0.14)",
      pillBorder: "rgba(255,111,157,0.28)",
    },
    level8: {
      band: "linear-gradient(135deg, rgba(111,140,255,0.24) 0%, rgba(94,220,255,0.20) 100%)",
      glow: "0 10px 24px rgba(111,140,255,0.16)",
      dot: "#6f8cff",
      pillBg: "rgba(111,140,255,0.13)",
      pillBorder: "rgba(111,140,255,0.28)",
    },
    level7: {
      band: "linear-gradient(135deg, rgba(88,186,255,0.22) 0%, rgba(99,235,212,0.18) 100%)",
      glow: "0 10px 24px rgba(88,186,255,0.16)",
      dot: "#44b8ff",
      pillBg: "rgba(68,184,255,0.13)",
      pillBorder: "rgba(68,184,255,0.28)",
    },
    level6: {
      band: "linear-gradient(135deg, rgba(87,217,137,0.22) 0%, rgba(184,233,106,0.18) 100%)",
      glow: "0 10px 24px rgba(87,217,137,0.16)",
      dot: "#49c878",
      pillBg: "rgba(73,200,120,0.13)",
      pillBorder: "rgba(73,200,120,0.28)",
    },
    level5: {
      band: "linear-gradient(135deg, rgba(255,181,76,0.24) 0%, rgba(255,226,112,0.19) 100%)",
      glow: "0 10px 24px rgba(255,181,76,0.16)",
      dot: "#ffae34",
      pillBg: "rgba(255,174,52,0.14)",
      pillBorder: "rgba(255,174,52,0.28)",
    },
    level4: {
      band: "linear-gradient(135deg, rgba(255,141,84,0.22) 0%, rgba(255,197,135,0.18) 100%)",
      glow: "0 10px 24px rgba(255,141,84,0.16)",
      dot: "#ff8d54",
      pillBg: "rgba(255,141,84,0.13)",
      pillBorder: "rgba(255,141,84,0.28)",
    },
    level3: {
      band: "linear-gradient(135deg, rgba(255,109,151,0.20) 0%, rgba(255,171,206,0.18) 100%)",
      glow: "0 10px 24px rgba(255,109,151,0.14)",
      dot: "#ff6d97",
      pillBg: "rgba(255,109,151,0.13)",
      pillBorder: "rgba(255,109,151,0.28)",
    },
    level2: {
      band: "linear-gradient(135deg, rgba(194,110,255,0.18) 0%, rgba(137,137,255,0.18) 100%)",
      glow: "0 10px 24px rgba(194,110,255,0.14)",
      dot: "#b56cff",
      pillBg: "rgba(181,108,255,0.13)",
      pillBorder: "rgba(181,108,255,0.28)",
    },
    level1: {
      band: "linear-gradient(135deg, rgba(87,178,255,0.18) 0%, rgba(121,214,255,0.18) 100%)",
      glow: "0 10px 24px rgba(87,178,255,0.14)",
      dot: "#57b2ff",
      pillBg: "rgba(87,178,255,0.13)",
      pillBorder: "rgba(87,178,255,0.28)",
    },
    level0: {
      band: "linear-gradient(135deg, rgba(145,217,120,0.20) 0%, rgba(196,233,125,0.16) 100%)",
      glow: "0 10px 24px rgba(145,217,120,0.14)",
      dot: "#72bf59",
      pillBg: "rgba(114,191,89,0.13)",
      pillBorder: "rgba(114,191,89,0.28)",
    },
  };

  return map[id];
}

function getMetaPillTheme(index: number) {
  const themes = [
    {
      background: "linear-gradient(135deg, rgba(255,115,150,0.16) 0%, rgba(255,201,104,0.14) 100%)",
      border: "1px solid rgba(255,134,170,0.28)",
    },
    {
      background: "linear-gradient(135deg, rgba(130,214,255,0.16) 0%, rgba(139,255,219,0.14) 100%)",
      border: "1px solid rgba(95,194,255,0.28)",
    },
    {
      background: "linear-gradient(135deg, rgba(255,212,107,0.16) 0%, rgba(255,165,120,0.14) 100%)",
      border: "1px solid rgba(255,189,87,0.28)",
    },
    {
      background: "linear-gradient(135deg, rgba(199,143,255,0.16) 0%, rgba(255,162,218,0.14) 100%)",
      border: "1px solid rgba(196,122,255,0.28)",
    },
  ];

  return themes[index % themes.length];
}

function TierLink({
  id,
  label,
  count,
  to,
}: {
  id: SpineTierId;
  label: string;
  count?: number;
  to?: string;
}) {
  const theme = getTierTheme(id);

  const a: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 9999,
    border: `1px solid ${theme.pillBorder}`,
    background: theme.band,
    color: "rgba(0,0,0,0.84)",
    fontWeight: 950,
    letterSpacing: -0.2,
    whiteSpace: "nowrap",
    pointerEvents: "auto",
    maxWidth: "100%",
    boxShadow: theme.glow,
    backdropFilter: "blur(8px)",
  };

  const dot: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: 9999,
    background: theme.dot,
    boxShadow: `0 0 0 4px ${theme.pillBg}`,
    flex: "0 0 auto",
  };

  const countPill: React.CSSProperties = {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 900,
    padding: "3px 9px",
    borderRadius: 9999,
    border: `1px solid ${theme.pillBorder}`,
    background: "rgba(255,255,255,0.84)",
    color: "rgba(0,0,0,0.75)",
    flex: "0 0 auto",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
  };

  return (
    <Link to={to ?? `/tiers/${id}`} style={a} aria-label={`Open ${label}`}>
      <span style={dot} />
      <span>{label}</span>
      {typeof count === "number" ? <span style={countPill}>{count}</span> : null}
    </Link>
  );
}

function AnchorCard({
  title,
  tierLabel,
  body,
  to,
}: {
  title: string;
  tierLabel: string;
  body: string;
  to: string;
}) {
  const item: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(125,125,185,0.16)",
    padding: "10px 12px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(252,247,255,0.92) 52%, rgba(244,250,255,0.94) 100%)",
    textDecoration: "none",
    display: "block",
    color: "inherit",
    cursor: "pointer",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    pointerEvents: "auto",
    maxWidth: "100%",
    overflow: "hidden",
    boxShadow: "0 10px 24px rgba(105,114,180,0.06)",
  };

  const itemTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: -0.2,
    color: "rgba(0,0,0,0.82)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  };

  const pill: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    padding: "4px 10px",
    borderRadius: 9999,
    border: "1px solid rgba(170,134,255,0.22)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(244,237,255,0.92) 100%)",
    whiteSpace: "nowrap",
    color: "rgba(73,56,138,0.82)",
  };

  const itemBody: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.68)",
    wordBreak: "break-word",
  };

  return (
    <Link
      to={to}
      style={item}
      aria-label={`Open ${tierLabel}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(118,116,208,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(105,114,180,0.06)";
      }}
    >
      <div style={itemTitle}>
        {title}
        <span style={pill}>{tierLabel}</span>
      </div>
      <p style={itemBody}>{body}</p>
    </Link>
  );
}

export default function TierIndex() {
  const isMobile = useIsMobileTierMap();

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: pageGlow,
    position: "relative",
    zIndex: 999999,
    pointerEvents: "auto",
    isolation: "isolate",
    overflowX: "hidden",
  };

  const container: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: isMobile ? "12px 10px 44px" : "18px 16px 80px",
    position: "relative",
    zIndex: 999999,
    pointerEvents: "auto",
    overflowX: "hidden",
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: isMobile ? 26 : 44,
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: isMobile ? -0.6 : -1.1,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
    wordBreak: "break-word",
    textShadow: "0 10px 24px rgba(255,135,135,0.08)",
  };

  const topActions: React.CSSProperties = {
    marginTop: 10,
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  };

  const ctaBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: isMobile ? "9px 14px" : "10px 14px",
    borderRadius: 9999,
    background: "linear-gradient(135deg, rgba(19,20,30,0.98) 0%, rgba(35,38,69,0.98) 100%)",
    color: "white",
    textDecoration: "none",
    fontWeight: 950,
    letterSpacing: -0.2,
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 12px 28px rgba(57,67,124,0.20)",
    maxWidth: "100%",
  };

  const ctaSub: React.CSSProperties = {
    fontSize: 13,
    color: "rgba(53,63,119,0.64)",
    fontWeight: 800,
  };

  const sub: React.CSSProperties = {
    marginTop: 10,
    color: "rgba(35,42,92,0.72)",
    fontSize: isMobile ? 13 : 16,
    lineHeight: 1.55,
    maxWidth: 860,
    wordBreak: "break-word",
  };

  const metaRow: React.CSSProperties = isMobile
    ? {
        marginTop: 10,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        alignItems: "stretch",
      }
    : {
        marginTop: 10,
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
      };

  const rowGrid: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "1fr 260px 1fr",
    gap: 14,
    alignItems: "start",
    pointerEvents: "auto",
  };

  const colBox: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(137,145,210,0.16)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(251,247,255,0.90) 50%, rgba(245,250,255,0.90) 100%)",
    padding: isMobile ? "10px 12px" : "12px 12px",
    boxShadow: "0 12px 30px rgba(106,116,180,0.08)",
    pointerEvents: "auto",
    maxWidth: "100%",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  };

  const colTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(64,70,133,0.62)",
  };

  const small: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: isMobile ? 13 : 14,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.70)",
    wordBreak: "break-word",
  };

  const cell: React.CSSProperties = {
    minHeight: 84,
    display: "flex",
    alignItems: "center",
    pointerEvents: "auto",
  };

  const cellStack: React.CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
    pointerEvents: "auto",
  };

  const spineCell: React.CSSProperties = { ...cell, justifyContent: "center" };

  const spineHint: React.CSSProperties = {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(57,63,119,0.58)",
    textAlign: "center",
  };

  const mobileTierStack: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const mobileSectionLabel: React.CSSProperties = {
    margin: 0,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "rgba(63,71,132,0.52)",
  };

  const footer: React.CSSProperties = {
    marginTop: 16,
    color: "rgba(50,58,110,0.58)",
    fontSize: 13,
    lineHeight: 1.6,
    wordBreak: "break-word",
  };

  const [allRooms, setAllRooms] = useState<TierRoom[]>([]);
  const [counts, setCounts] = useState<CountsState>(() => blankCounts());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const res = await loadRoomsForTiers();
      if (!alive) return;

      const rooms = res.rooms || [];
      setAllRooms(rooms);

      try {
        (window as any).__MB_ALL_ROOMS__ = rooms;
      } catch {
        // no-op
      }

      const spineSet = new Set(SPINE_TOP_TO_BOTTOM.map((t) => t.id));
      const bySpineTier = Object.fromEntries(
        SPINE_TOP_TO_BOTTOM.map((t) => [t.id, 0])
      ) as Record<SpineTierId, number>;

      const coreRooms = rooms.filter((r) => norm((r as any).area) === "core");
      let unknownCoreTier = 0;

      for (const r of coreRooms) {
        const inferred = inferSpineTierForCounting(r, spineSet);
        if (inferred) bySpineTier[inferred] += 1;
        else unknownCoreTier += 1;
      }

      setCounts({
        source: res.source,
        debug: res.debug,
        totalAll: rooms.length,
        totalCore: coreRooms.length,
        unknownCoreTier,
        bySpineTier,
      });

      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const freeLifeCount = useMemo(
    () => allRooms.filter((r) => (r as any).tier === "level0" && isExplicitLifeRoom(r)).length,
    [allRooms]
  );

  const freeLifeIds = useMemo(
    () =>
      allRooms
        .filter((r) => (r as any).tier === "level0" && isExplicitLifeRoom(r))
        .map((r) => String((r as any).id || ""))
        .sort(),
    [allRooms]
  );

  const freeCoreCount = useMemo(() => {
    return allRooms.filter((r) => {
      if ((r as any).tier !== "level0") return false;
      if (isExplicitLifeRoom(r)) return false;
      const a = String((r as any).area || "").toLowerCase();
      if (a === "english" || a === "kids" || a === "life") return false;
      return true;
    }).length;
  }, [allRooms]);

  const freeCoreIds = useMemo(() => {
    return allRooms
      .filter((r) => {
        if ((r as any).tier !== "level0") return false;
        if (isExplicitLifeRoom(r)) return false;
        const a = String((r as any).area || "").toLowerCase();
        if (a === "english" || a === "kids" || a === "life") return false;
        return true;
      })
      .map((r) => String((r as any).id || ""))
      .sort();
  }, [allRooms]);

  const countsForDisplay = useMemo(() => {
    const by = { ...counts.bySpineTier };
    by.level0 = freeCoreCount;
    return { ...counts, bySpineTier: by };
  }, [counts, freeCoreCount]);

  const nonCoreCount = useMemo(() => {
    const v = countsForDisplay.totalAll - countsForDisplay.totalCore;
    return v >= 0 ? v : 0;
  }, [countsForDisplay.totalAll, countsForDisplay.totalCore]);

  const hiddenReport = useMemo(() => {
    const spineSet = new Set(SPINE_TOP_TO_BOTTOM.map((t) => t.id));

    const byArea: Record<string, TierRoom[]> = {};
    const byTier: Record<string, TierRoom[]> = {};
    const byTierArea: Record<string, TierRoom[]> = {};

    const strictUntiered: TierRoom[] = [];
    const nonSpineTier: TierRoom[] = [];

    for (const r of allRooms) {
      const area = norm((r as any).area) || "unknown";
      const tierRaw = (r as any).tier;
      const tier = norm(tierRaw) || "unknown";
      const key = `${tier}__${area}`;

      (byArea[area] ||= []).push(r);
      (byTier[tier] ||= []).push(r);
      (byTierArea[key] ||= []).push(r);

      const isMissing =
        tierRaw === null ||
        tierRaw === undefined ||
        (typeof tierRaw === "string" && tierRaw.trim() === "") ||
        tier === "unknown";

      if (isMissing) strictUntiered.push(r);
      if (isMissing || !spineSet.has(tier as any)) nonSpineTier.push(r);
    }

    const unknownAreaRooms = byArea["unknown"] || [];
    const unknownTierRooms = byTier["unknown"] || [];

    const lifeAreaRooms = byArea["life"] || [];
    const lifeAreaButNotExplicit = lifeAreaRooms.filter((r) => !isExplicitLifeRoom(r));

    const kidsById = allRooms.filter((r) => {
      const id = norm((r as any).id);
      return id.includes("_kids_l1") || id.includes("_kids_l2") || id.includes("_kids_l3");
    });
    const kidsByIdNotEnglish = kidsById.filter((r) => norm((r as any).area) !== "english");
    const kidsByIdTierUnknown = kidsById.filter((r) => norm((r as any).tier) === "unknown");

    const survivalById = allRooms.filter((r) => {
      const id = norm((r as any).id);
      return id.includes("survival") || id.includes("resilience");
    });
    const survivalNotLife = survivalById.filter((r) => norm((r as any).area) !== "life");

    const pickIds = (rooms: TierRoom[], n = 500) =>
      rooms
        .map((r) => String((r as any).id || ""))
        .filter(Boolean)
        .sort()
        .slice(0, n);

    return {
      totals: {
        all: allRooms.length,
        core: (byArea["core"] || []).length,
        english: (byArea["english"] || []).length,
        life: lifeAreaRooms.length,
        kids: (byArea["kids"] || []).length,
        unknownArea: unknownAreaRooms.length,
        strictUntiered: strictUntiered.length,
        nonSpineTier: nonSpineTier.length,
      },
      counts: {
        lifeAreaButNotExplicit: lifeAreaButNotExplicit.length,
        kidsById: kidsById.length,
        kidsByIdNotEnglish: kidsByIdNotEnglish.length,
        kidsByIdTierUnknown: kidsByIdTierUnknown.length,
        survivalById: survivalById.length,
        survivalNotLife: survivalNotLife.length,
      },
      ids: {
        unknownArea: pickIds(unknownAreaRooms),
        unknownTier: pickIds(unknownTierRooms),
        strictUntiered: pickIds(strictUntiered),
        nonSpineTier: pickIds(nonSpineTier),
        lifeAreaButNotExplicit: pickIds(lifeAreaButNotExplicit),
        kidsByIdNotEnglish: pickIds(kidsByIdNotEnglish),
        kidsByIdTierUnknown: pickIds(kidsByIdTierUnknown),
        survivalNotLife: pickIds(survivalNotLife),
      },
      byTierAreaCount: (tier: string, area: string) =>
        (byTierArea[`${tier}__${area}`] || []).length,
    };
  }, [allRooms]);

  useEffect(() => {
    try {
      (window as any).__MB_TIER_REPORT__ = hiddenReport;
    } catch {
      // no-op
    }
  }, [hiddenReport]);

  useEffect(() => {
    try {
      const qs = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      if (qs.get("debugTier") !== "1") return;

      if (import.meta.env.DEV) {
        if (import.meta.env.DEV) console.log("tier-debug TierIndex:", {
          source: counts.source,
          totalAll: counts.totalAll,
          totalCore: counts.totalCore,
          nonCore: nonCoreCount,
          freeCoreCount,
          freeLifeCount,
        });

        if (import.meta.env.DEV) console.log("tier-debug level0 core ids (first 80):", freeCoreIds.slice(0, 80));
        if (import.meta.env.DEV) console.log("tier-debug level0 explicit-life ids (first 80):", freeLifeIds.slice(0, 80));

        const coreRooms =
          (window as any).__MB_ALL_ROOMS__?.filter((r: any) => norm(r?.area) === "core") || [];
        const spineSet = new Set(SPINE_TOP_TO_BOTTOM.map((t) => t.id));
        const sample = coreRooms.slice(0, 30).map((r: any) => ({
          id: r.id,
          tier: r.tier,
          required_rank:
            r.required_rank ?? r.required_vip_rank ?? r.min_rank ?? r.vip_rank ?? r.rank,
          inferred: inferSpineTierForCounting(r, spineSet),
        }));

        if (import.meta.env.DEV) console.log("tier-debug core sample (first 30):", sample);
      }
    } catch {
      // no-op
    }
  }, [counts, nonCoreCount, freeCoreCount, freeLifeCount, freeCoreIds, freeLifeIds]);

  const leftAnchors: Partial<Record<SpineTierId, React.ReactNode>> = {
    level0: (
      <>
        <AnchorCard
          title="English Foundation"
          tierLabel="Level 0"
          body="English lessons only (foundation)."
          to="/tiers/level0?area=english"
        />
        <AnchorCard
          title="Kids Level 1 (English)"
          tierLabel="Kids 1"
          body="Kids English track (starter)."
          to="/tiers/kids_1"
        />
        <AnchorCard
          title="Kids Level 2 (English)"
          tierLabel="Kids 2"
          body="Kids English track (middle)."
          to="/tiers/kids_2"
        />
        <AnchorCard
          title="Kids Level 3 (English)"
          tierLabel="Kids 3"
          body="Kids English track (advanced)."
          to="/tiers/kids_3"
        />
      </>
    ),
    level1: (
      <AnchorCard
        title="Building sentences"
        tierLabel="Level 1"
        body="Pronunciation + patterns + listening repetition (English path)."
        to="/tiers/level1?area=english"
      />
    ),
    level3: (
      <AnchorCard
        title="Writing (English path)"
        tierLabel="Level 3"
        body="Short essays → structured writing → clear expression."
        to="/tiers/level3?area=english"
      />
    ),
  };

  const rightAnchors: Partial<Record<SpineTierId, React.ReactNode>> = {
    level1: (
      <AnchorCard
        title="Survival skills"
        tierLabel="Level 1"
        body="Life skills (survival/resilience) — safety, preparedness, discipline."
        to="/tiers/level1?area=life"
      />
    ),
    level3: (
      <AnchorCard
        title="Public speaking / Social skill"
        tierLabel="Level 3"
        body="Communication, confidence, relationships, readiness."
        to="/tiers/level3?area=life"
      />
    ),
  };

  const centerAnchors: Partial<Record<SpineTierId, React.ReactNode>> = {
    level3: (
      <AnchorCard
        title="Bridge into the spine"
        tierLabel="Level 3"
        body="Core training content (spine)."
        to="/tiers/level3?area=core"
      />
    ),
  };

  const showHiddenPills =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("showHidden") === "1"
      : false;

  const showDebugTier =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("debugTier") === "1"
      : false;

  const mobileGuideBox: React.CSSProperties = {
    ...colBox,
    background:
      "linear-gradient(135deg, rgba(255,248,252,0.92) 0%, rgba(248,250,255,0.92) 52%, rgba(244,255,248,0.92) 100%)",
  };

  return (
    <div style={wrap}>
      <div style={container}>
        <h1 style={title}>Tier Map</h1>

        <div style={topActions}>
          <Link to="/upgrade" style={ctaBtn} aria-label="Open pricing / upgrade">
            Pricing / Upgrade
          </Link>
          {!isMobile ? <span style={ctaSub}>Opens Stripe upgrade (Pro / Elite).</span> : null}
        </div>

        <div style={sub}>
          {isMobile ? (
            <>
              <b>English</b> / <b>Core</b> / <b>Life</b>
            </>
          ) : (
            <>
              Three columns. One spine. <b>Core</b> is the spine reality.
              <br />
              <b>Left</b> = English lessons only. <b>Right</b> = Life skills.
            </>
          )}
        </div>

        <div style={metaRow} aria-label="Tier stats">
          {[
            `Rooms (all): ${countsForDisplay.totalAll}`,
            `Core rooms: ${countsForDisplay.totalCore}`,
            `Non-core: ${nonCoreCount}`,
            `Unknown core tier: ${countsForDisplay.unknownCoreTier}`,
          ].map((text, index) => {
            const theme = getMetaPillTheme(index);
            const metaPill: React.CSSProperties = {
              fontSize: isMobile ? 11 : 12,
              fontWeight: 900,
              padding: isMobile ? "8px 10px" : "6px 10px",
              borderRadius: 9999,
              border: theme.border,
              background: theme.background,
              color: "rgba(43,45,85,0.82)",
              whiteSpace: isMobile ? "normal" : "nowrap",
              pointerEvents: "auto",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxShadow: "0 8px 18px rgba(120,130,190,0.06)",
            };

            return (
              <span key={text} style={metaPill}>
                {text}
              </span>
            );
          })}

          {(!isMobile || showDebugTier || showHiddenPills) ? (
            <span
              style={{
                fontSize: isMobile ? 11 : 12,
                fontWeight: 900,
                padding: isMobile ? "8px 10px" : "6px 10px",
                borderRadius: 9999,
                border: "1px solid rgba(123,140,255,0.24)",
                background:
                  "linear-gradient(135deg, rgba(235,240,255,0.88) 0%, rgba(248,250,255,0.92) 100%)",
                color: "rgba(43,45,85,0.82)",
                whiteSpace: isMobile ? "normal" : "nowrap",
                pointerEvents: "auto",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Source: {countsForDisplay.source}
            </span>
          ) : null}

          {showHiddenPills ? (
            <>
              <span
                style={{
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 900,
                  padding: isMobile ? "8px 10px" : "6px 10px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,153,190,0.24)",
                  background: "rgba(255,242,249,0.90)",
                  color: "rgba(43,45,85,0.82)",
                }}
              >
                English: {hiddenReport.totals.english}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 900,
                  padding: isMobile ? "8px 10px" : "6px 10px",
                  borderRadius: 9999,
                  border: "1px solid rgba(114,210,172,0.24)",
                  background: "rgba(239,255,247,0.90)",
                  color: "rgba(43,45,85,0.82)",
                }}
              >
                Life: {hiddenReport.totals.life}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 900,
                  padding: isMobile ? "8px 10px" : "6px 10px",
                  borderRadius: 9999,
                  border: "1px solid rgba(118,184,255,0.24)",
                  background: "rgba(240,248,255,0.90)",
                  color: "rgba(43,45,85,0.82)",
                }}
              >
                Kids(area): {hiddenReport.totals.kids}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 900,
                  padding: isMobile ? "8px 10px" : "6px 10px",
                  borderRadius: 9999,
                  border: "1px solid rgba(180,156,255,0.24)",
                  background: "rgba(246,241,255,0.90)",
                  color: "rgba(43,45,85,0.82)",
                }}
              >
                Unknown area: {hiddenReport.totals.unknownArea}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 900,
                  padding: isMobile ? "8px 10px" : "6px 10px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,198,111,0.24)",
                  background: "rgba(255,248,235,0.90)",
                  color: "rgba(43,45,85,0.82)",
                }}
              >
                Untiered(strict): {hiddenReport.totals.strictUntiered}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 900,
                  padding: isMobile ? "8px 10px" : "6px 10px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,150,116,0.24)",
                  background: "rgba(255,244,239,0.90)",
                  color: "rgba(43,45,85,0.82)",
                }}
              >
                Non-spine tier: {hiddenReport.totals.nonSpineTier}
              </span>
            </>
          ) : null}

          {loading ? (
            <span
              style={{
                fontSize: isMobile ? 11 : 12,
                fontWeight: 900,
                padding: isMobile ? "8px 10px" : "6px 10px",
                borderRadius: 9999,
                border: "1px solid rgba(103,198,255,0.24)",
                background: "rgba(238,251,255,0.92)",
                color: "rgba(43,45,85,0.82)",
              }}
            >
              Loading…
            </span>
          ) : null}
        </div>

        {isMobile ? (
          <div style={mobileTierStack} aria-label="Tier rows stack">
            <div style={mobileGuideBox} aria-label="Tier map summary">
              <div style={colTitle}>Map guide</div>
              <p style={small}>
                <b>Left</b> = English. <b>Center</b> = Core. <b>Right</b> = Life.
              </p>
            </div>

            {SPINE_TOP_TO_BOTTOM.map((t) => {
              const theme = getTierTheme(t.id);

              const mobileTierRow: React.CSSProperties = {
                borderRadius: 18,
                border: `1px solid ${theme.pillBorder}`,
                background: theme.band,
                padding: "10px 10px 12px",
                boxShadow: theme.glow,
                maxWidth: "100%",
                overflow: "hidden",
                backdropFilter: "blur(8px)",
              };

              return (
                <div key={t.id} style={mobileTierRow} aria-label={`Tier row ${t.label}`}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <TierLink
                      id={t.id}
                      label={t.label}
                      count={countsForDisplay.bySpineTier[t.id]}
                      to={`/tiers/${t.id}?area=core`}
                    />
                  </div>

                  {t.hint ? <div style={spineHint}>{t.hint}</div> : null}

                  {centerAnchors[t.id] ? (
                    <div style={{ marginTop: 10 }}>
                      <p style={mobileSectionLabel}>Core</p>
                      <div style={{ marginTop: 6 }}>{centerAnchors[t.id]}</div>
                    </div>
                  ) : null}

                  {leftAnchors[t.id] ? (
                    <div style={{ marginTop: 10 }}>
                      <p style={mobileSectionLabel}>English</p>
                      <div style={{ marginTop: 6 }}>{leftAnchors[t.id]}</div>
                    </div>
                  ) : null}

                  {rightAnchors[t.id] ? (
                    <div style={{ marginTop: 10 }}>
                      <p style={mobileSectionLabel}>Life</p>
                      <div style={{ marginTop: 6 }}>{rightAnchors[t.id]}</div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={rowGrid} aria-label="Tier rows grid">
            <div
              style={{
                ...colBox,
                background:
                  "linear-gradient(135deg, rgba(255,247,250,0.92) 0%, rgba(247,249,255,0.92) 100%)",
              }}
              aria-label="Left column header"
            >
              <div style={colTitle}>Left</div>
              <p style={small}>
                <b>English Path</b> — English lessons only (Kids included here).
              </p>
            </div>

            <div
              style={{
                ...colBox,
                background:
                  "linear-gradient(135deg, rgba(247,249,255,0.92) 0%, rgba(250,247,255,0.92) 100%)",
              }}
              aria-label="Spine column header"
            >
              <div style={colTitle}>Spine</div>
              <p style={small}>Core only. Level 0 at ground (bottom). Level 9 at top.</p>
            </div>

            <div
              style={{
                ...colBox,
                background:
                  "linear-gradient(135deg, rgba(247,255,250,0.92) 0%, rgba(247,249,255,0.92) 100%)",
              }}
              aria-label="Right column header"
            >
              <div style={colTitle}>Right</div>
              <p style={small}>
                <b>Life Skills</b> — survival, public speaking, debate, discipline.
              </p>
            </div>

            {SPINE_TOP_TO_BOTTOM.map((t) => {
              const theme = getTierTheme(t.id);

              const coloredCell: React.CSSProperties = {
                ...cell,
                borderRadius: 18,
                padding: "8px 10px",
                background: theme.band,
                border: `1px solid ${theme.pillBorder}`,
                boxShadow: theme.glow,
              };

              const coloredSpineCell: React.CSSProperties = {
                ...spineCell,
                borderRadius: 18,
                padding: "8px 10px",
                background: theme.band,
                border: `1px solid ${theme.pillBorder}`,
                boxShadow: theme.glow,
              };

              return (
                <React.Fragment key={t.id}>
                  <div style={coloredCell} aria-label={`Left cell ${t.label}`}>
                    <div style={cellStack}>{leftAnchors[t.id] ?? null}</div>
                  </div>

                  <div style={coloredSpineCell} aria-label={`Spine cell ${t.label}`}>
                    <div style={cellStack}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <TierLink
                          id={t.id}
                          label={t.label}
                          count={countsForDisplay.bySpineTier[t.id]}
                          to={`/tiers/${t.id}?area=core`}
                        />
                      </div>
                      {centerAnchors[t.id] ? (
                        <div style={{ marginTop: 8 }}>{centerAnchors[t.id]}</div>
                      ) : null}
                      {t.hint ? <div style={spineHint}>{t.hint}</div> : null}
                    </div>
                  </div>

                  <div style={coloredCell} aria-label={`Right cell ${t.label}`}>
                    <div style={cellStack}>{rightAnchors[t.id] ?? null}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {(!isMobile || showDebugTier) && (
          <div style={footer}>
            LOCK CHECK: Kids are not in the spine. Core counts exclude English + Life.
            <br />
            <span style={{ fontSize: 12, color: "rgba(56,65,121,0.48)" }}>
              DEBUG: source={countsForDisplay.source} all={countsForDisplay.totalAll} core=
              {countsForDisplay.totalCore} nonCore={nonCoreCount} free_core={freeCoreCount}{" "}
              free_life_explicit={freeLifeCount}
              {countsForDisplay.debug ? ` | ${countsForDisplay.debug}` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}