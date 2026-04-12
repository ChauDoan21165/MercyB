/**
 * File: TierIndex.tsx
 * Path: src/pages/TierIndex.tsx
 */

// PATH: src/pages/TierIndex.tsx
// MB-BLUE-98.9j → MB-BLUE-98.9n — 2026-01-18 (+0700)
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

const rainbow =
  "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

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

/**
 * Infer spine tier from room id, COUNTING ONLY.
 */
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
    id.includes("_free_") ||
    id.includes("-level0-")
  ) {
    return "level0";
  }

  return null;
}

/**
 * Infer spine tier from numeric rank fields, COUNTING ONLY.
 */
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

/**
 * Final: infer tier for counting:
 * 1) explicit tier string (if in spine)
 * 2) numeric rank fields
 * 3) id inference
 */
function inferSpineTierForCounting(r: TierRoom, spineSet: Set<string>): SpineTierId | null {
  const t = norm((r as any).tier);
  if (t && spineSet.has(t)) return t as SpineTierId;

  const byRank = inferSpineTierFromRank(r);
  if (byRank && spineSet.has(byRank)) return byRank;

  const byId = inferSpineTierFromId((r as any).id);
  if (byId && spineSet.has(byId)) return byId;

  return null;
}

/**
 * LIFE (Survival) must be explicit-only (match TierDetail).
 */
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
  const a: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.92)",
    color: "rgba(0,0,0,0.85)",
    fontWeight: 900,
    letterSpacing: -0.2,
    whiteSpace: "nowrap",
    pointerEvents: "auto",
  };

  const dot: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: 9999,
    background: "rgba(0,0,0,0.75)",
    flex: "0 0 auto",
  };

  const countPill: React.CSSProperties = {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 900,
    padding: "3px 9px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.95)",
    color: "rgba(0,0,0,0.75)",
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
    border: "1px solid rgba(0,0,0,0.10)",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.88)",
    textDecoration: "none",
    display: "block",
    color: "inherit",
    cursor: "pointer",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    pointerEvents: "auto",
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
  };

  const pill: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    padding: "4px 10px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    whiteSpace: "nowrap",
    color: "rgba(0,0,0,0.75)",
  };

  const itemBody: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.68)",
  };

  return (
    <Link
      to={to}
      style={item}
      aria-label={`Open ${tierLabel}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 10px 18px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={itemTitle}>
        {title} <span style={pill}>{tierLabel}</span>
      </div>
      <p style={itemBody}>{body}</p>
    </Link>
  );
}

type CountsState = {
  source: TierSource;
  debug?: string;
  totalAll: number;
  totalCore: number;
  unknownCoreTier: number;
  bySpineTier: Record<SpineTierId, number>;
};

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

export default function TierIndex() {
  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "#f8f9fa", // Mercy Blade soft premium neutral
    position: "relative",
    zIndex: 999999,
    pointerEvents: "auto",
    isolation: "isolate",
  };

  const container: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "18px 16px 80px",
    position: "relative",
    zIndex: 999999,
    pointerEvents: "auto",
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 44,
    fontWeight: 950,
    letterSpacing: -1.1,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  const topActions: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  };

  const ctaBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 9999,
    background: "rgba(0,0,0,0.92)",
    color: "white",
    textDecoration: "none",
    fontWeight: 950,
    letterSpacing: -0.2,
    border: "1px solid rgba(0,0,0,0.10)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
  };

  const ctaSub: React.CSSProperties = {
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
    fontWeight: 700,
  };

  const sub: React.CSSProperties = {
    marginTop: 10,
    color: "rgba(0,0,0,0.65)",
    fontSize: 16,
    lineHeight: 1.6,
    maxWidth: 860,
  };

  const metaRow: React.CSSProperties = {
    marginTop: 10,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  };

  const metaPill: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    color: "rgba(0,0,0,0.75)",
    whiteSpace: "nowrap",
    pointerEvents: "auto",
  };

  const rowGrid: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "1fr 260px 1fr",
    gap: 14,
    alignItems: "start",
    pointerEvents: "auto",
  };

  const isNarrow =
    typeof window !== "undefined" ? window.matchMedia("(max-width: 860px)").matches : false;
  const rowGridNarrow: React.CSSProperties = { ...rowGrid, gridTemplateColumns: "1fr" };

  const colBox: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.88)",
    padding: "12px 12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    pointerEvents: "auto",
  };

  const colTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.55)",
  };

  const small: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.70)",
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
    marginTop: 6,
    fontSize: 12,
    color: "rgba(0,0,0,0.55)",
    textAlign: "center",
  };

  const footer: React.CSSProperties = {
    marginTop: 18,
    color: "rgba(0,0,0,0.55)",
    fontSize: 13,
    lineHeight: 1.6,
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

    const report = {
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

    return report;
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

      // eslint-disable-next-line no-console
      console.log("tier-debug TierIndex:", {
        source: counts.source,
        totalAll: counts.totalAll,
        totalCore: counts.totalCore,
        nonCore: nonCoreCount,
        freeCoreCount,
        freeLifeCount,
      });

      // eslint-disable-next-line no-console
      console.log("tier-debug level0 core ids (first 80):", freeCoreIds.slice(0, 80));
      // eslint-disable-next-line no-console
      console.log("tier-debug level0 explicit-life ids (first 80):", freeLifeIds.slice(0, 80));

      const coreRooms =
        (window as any).__MB_ALL_ROOMS__?.filter((r: any) => norm(r?.area) === "core") || [];
      const spineSet = new Set(SPINE_TOP_TO_BOTTOM.map((t) => t.id));
      const sample = coreRooms.slice(0, 30).map((r: any) => ({
        id: r.id,
        tier: r.tier,
        required_rank: r.required_rank ?? r.required_vip_rank ?? r.min_rank ?? r.vip_rank ?? r.rank,
        inferred: inferSpineTierForCounting(r, spineSet),
      }));
      // eslint-disable-next-line no-console
      console.log("tier-debug core sample (first 30):", sample);
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

  return (
    <div style={wrap}>
      <div style={container}>
        <h1 style={title}>Tier Map</h1>

        {/* Pricing CTA — only the top black button */}
        <div style={topActions}>
          <Link to="/upgrade" style={ctaBtn} aria-label="Open pricing / upgrade">
            Pricing / Upgrade
          </Link>
          <span style={ctaSub}>Opens Stripe upgrade (Pro / Elite).</span>
        </div>

        <div style={sub}>
          Three columns. One spine. <b>Core</b> is the spine reality.
          <br />
          <b>Left</b> = English lessons only. <b>Right</b> = Life skills.
        </div>

        <div style={metaRow} aria-label="Tier stats">
          <span style={metaPill}>Rooms (all): {countsForDisplay.totalAll}</span>
          <span style={metaPill}>Core rooms: {countsForDisplay.totalCore}</span>
          <span style={metaPill}>Non-core: {nonCoreCount}</span>
          <span style={metaPill}>Unknown core tier: {countsForDisplay.unknownCoreTier}</span>
          <span style={metaPill}>Source: {countsForDisplay.source}</span>

          {showHiddenPills ? (
            <>
              <span style={metaPill}>English: {hiddenReport.totals.english}</span>
              <span style={metaPill}>Life: {hiddenReport.totals.life}</span>
              <span style={metaPill}>Kids(area): {hiddenReport.totals.kids}</span>
              <span style={metaPill}>Unknown area: {hiddenReport.totals.unknownArea}</span>
              <span style={metaPill}>Untiered(strict): {hiddenReport.totals.strictUntiered}</span>
              <span style={metaPill}>Non-spine tier: {hiddenReport.totals.nonSpineTier}</span>
            </>
          ) : null}

          {loading ? <span style={metaPill}>Loading…</span> : null}
        </div>

        <div style={isNarrow ? rowGridNarrow : rowGrid} aria-label="Tier rows grid">
          <div style={colBox} aria-label="Left column header">
            <div style={colTitle}>Left</div>
            <p style={small}>
              <b>English Path</b> — English lessons only (Kids included here).
            </p>
          </div>

          <div style={colBox} aria-label="Spine column header">
            <div style={colTitle}>Spine</div>
            <p style={small}>Core only. Level 0 at ground (bottom). Level 9 at top.</p>
          </div>

          <div style={colBox} aria-label="Right column header">
            <div style={colTitle}>Right</div>
            <p style={small}>
              <b>Life Skills</b> — survival, public speaking, debate, discipline.
            </p>
          </div>

          {SPINE_TOP_TO_BOTTOM.map((t) => (
            <React.Fragment key={t.id}>
              <div style={cell} aria-label={`Left cell ${t.label}`}>
                <div style={cellStack}>{leftAnchors[t.id] ?? null}</div>
              </div>

              <div style={spineCell} aria-label={`Spine cell ${t.label}`}>
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

              <div style={cell} aria-label={`Right cell ${t.label}`}>
                <div style={cellStack}>{rightAnchors[t.id] ?? null}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div style={footer}>
          LOCK CHECK: Kids are not in the spine. Core counts exclude English + Life.
          <br />
          <span style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
            DEBUG: source={countsForDisplay.source} all={countsForDisplay.totalAll} core=
            {countsForDisplay.totalCore} nonCore={nonCoreCount} free_core={freeCoreCount} free_life_explicit=
            {freeLifeCount}
            {countsForDisplay.debug ? ` | ${countsForDisplay.debug}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}