// FILE: TierIndex.tsx
// PATH: src/pages/TierIndex.tsx
// MB-BLUE-98.9j → MB-BLUE-98.9n — 2026-01-18 (+0700)
//
// FIX (98.9k — DELETE VIP3 II from Tier Map UI):
// - Remove vip3ii from SpineTierId + SPINE_TOP_TO_BOTTOM so the pill disappears.
// - Keep all tier loading/counting logic stable.
// - Any core rooms that would have been classified as vip3ii are now treated as "unknown core tier"
//   unless upstream mapping converts them to vip3.
//
// FIX (98.9k+ — VIP1 RIGHT CARD):
// - Change VIP1 right anchor from "Martial art / Discipline" → "Survival skills"
// - Route to LIFE area explicitly: /tiers/vip1?area=life
//
// FIX (98.9l — AREA-SAFE ROUTING, ALL TIERS):
// - Problem: left + spine + right often landed in the same default (core) because links lacked ?area=...
// - Solution: keep ALL features, only make routing explicit:
//   - LEFT anchors use ?area=english where applicable
//   - SPINE pills always go to ?area=core
//   - RIGHT anchors use ?area=life
// - Do NOT touch tierRoomSource pipeline. UI routing only.
//
// FIX (98.9m — REMOVE CONFUSING MID BAND LABELS):
// - "Psychology / Tâm lý học" and "Critical thinking / Tư duy phản biện" sat in a decorative band
//   with no navigation/filter meaning.
// - Remove the whole mid-band block (and its styles) to reduce UI noise.
//
// FIX (98.9m+ — REMOVE FREE RIGHT CARD):
// - Delete "Survival skills" card from Free row on the RIGHT.
// - Keep counts/debug logic intact; just do not render the Free right anchor.
//
// FIX (98.9m++ — HUNT HIDDEN ROOMS, SAFE DEBUG):
// - Add area/tier breakdown + “hidden bucket” detection using already-loaded allRooms.
// - Console-only unless ?debugHidden=1.
// - Add meta pills for English/Life/Kids/Unknown area/tier so totals can be compared quickly.
// - NO changes to tierRoomSource pipeline; UI/report only.
//
// FIX (98.9n — EXPOSE LOADED ROOMS FOR CONSOLE DEBUG):
// - The UI has rooms in React state; console scripts using window.__MB_ALL_ROOMS__ saw [].
// - Export safe globals AFTER DB load:
//   - window.__MB_ALL_ROOMS__
//   - window.__MB_TIER_REPORT__ (includes strictUntiered + nonSpineTier buckets and IDs)
//
// PATCH (2026-01-28):
// - Fix tier counts showing 0 for many VIP tiers when DB returns tier as unknown/blank.
// - TierIndex now does SAFE local tier inference for COUNTING ONLY:
//   1) tier string if present
//   2) numeric rank fields (required_rank / required_vip_rank / min_rank / vip_rank / etc.) → vip tier
//   3) id inference fallback
//
// PATCH (2026-01-29):
// - Add "Home" + "Back" buttons at top-left for UX. (No changes to tier logic.)
//
// NOTE: Inline styles only. Locked concept preserved.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { TierRoom, TierSource } from "@/lib/tierRoomSource";
import { loadRoomsForTiers } from "@/lib/tierRoomSource";

type SpineTierId =
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

type TierNode = {
  id: SpineTierId;
  label: string;
  hint?: string;
};

const rainbow =
  "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

const SPINE_TOP_TO_BOTTOM: TierNode[] = [
  { id: "vip9", label: "VIP9", hint: "Top / near God–Universe" },
  { id: "vip8", label: "VIP8", hint: "High mastery" },
  { id: "vip7", label: "VIP7", hint: "Advanced" },
  { id: "vip6", label: "VIP6", hint: "Systems / strategy" },
  { id: "vip5", label: "VIP5", hint: "Writing / deeper practice" },
  { id: "vip4", label: "VIP4", hint: "Climb" },
  // ✅ removed vip3ii node
  { id: "vip3", label: "VIP3", hint: "Bridge into the spine" },
  { id: "vip2", label: "VIP2", hint: "Strengthen core skills" },
  { id: "vip1", label: "VIP1", hint: "Build habit + foundation + survival basics" },
  { id: "free", label: "Free", hint: "Ground / basics" },
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

  // higher tiers first
  if (has("vip9")) return "vip9";
  if (has("vip8")) return "vip8";
  if (has("vip7")) return "vip7";
  if (has("vip6")) return "vip6";
  if (has("vip5")) return "vip5";
  if (has("vip4")) return "vip4";
  if (has("vip3")) return "vip3";
  if (has("vip2")) return "vip2";
  if (has("vip1")) return "vip1";

  if (
    id === "free" ||
    id.startsWith("free_") ||
    id.startsWith("free-") ||
    id.endsWith("_free") ||
    id.endsWith("-free") ||
    id.includes("_free_") ||
    id.includes("-free-")
  ) {
    return "free";
  }

  return null;
}

/**
 * Infer spine tier from numeric rank fields, COUNTING ONLY.
 * Mercy often encodes gating as required_rank (0..9) rather than tier strings.
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

  // clamp 0..9
  const rr = Math.max(0, Math.min(9, Math.trunc(rank)));
  if (rr === 0) return "free";
  return (`vip${rr}` as SpineTierId) ?? null;
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
 * Do NOT use generic "-life-" (it catches "meaning-of-life").
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
    background: "rgba(255,255,255,0.85)",
    color: "rgba(0,0,0,0.82)",
    fontWeight: 900,
    letterSpacing: -0.2,
    whiteSpace: "nowrap",
    pointerEvents: "auto",
  };

  const dot: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: 9999,
    background: "rgba(0,0,0,0.65)",
    flex: "0 0 auto",
  };

  const countPill: React.CSSProperties = {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 900,
    padding: "3px 9px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    color: "rgba(0,0,0,0.70)",
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
    background: "rgba(255,255,255,0.80)",
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
    color: "rgba(0,0,0,0.78)",
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
    background: "rgba(255,255,255,0.85)",
    whiteSpace: "nowrap",
    color: "rgba(0,0,0,0.70)",
  };

  const itemBody: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.66)",
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
  const navigate = useNavigate();

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "white",
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

  // NEW: top nav (Home + Back)
  const topNav: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    pointerEvents: "auto",
  };
  const navBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.90)",
    color: "rgba(0,0,0,0.78)",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 13,
    lineHeight: 1,
    cursor: "pointer",
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
    background: "rgba(255,255,255,0.85)",
    color: "rgba(0,0,0,0.70)",
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
    background: "rgba(255,255,255,0.72)",
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

  const godNode: React.CSSProperties = {
    width: "100%",
    borderRadius: 9999,
    padding: "10px 12px",
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    textAlign: "center",
    fontWeight: 950,
    letterSpacing: -0.2,
    color: "rgba(0,0,0,0.78)",
    position: "relative",
    pointerEvents: "none",
  };

  const godGlow: React.CSSProperties = {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: -8,
    height: 10,
    borderRadius: 9999,
    background: rainbow,
    opacity: 0.22,
    filter: "blur(6px)",
    pointerEvents: "none",
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
    () => allRooms.filter((r) => (r as any).tier === "free" && isExplicitLifeRoom(r)).length,
    [allRooms]
  );

  const freeLifeIds = useMemo(
    () =>
      allRooms
        .filter((r) => (r as any).tier === "free" && isExplicitLifeRoom(r))
        .map((r) => String((r as any).id || ""))
        .sort(),
    [allRooms]
  );

  const freeCoreCount = useMemo(() => {
    return allRooms.filter((r) => {
      if ((r as any).tier !== "free") return false;
      if (isExplicitLifeRoom(r)) return false;
      const a = String((r as any).area || "").toLowerCase();
      if (a === "english" || a === "kids" || a === "life") return false;
      return true;
    }).length;
  }, [allRooms]);

  const freeCoreIds = useMemo(() => {
    return allRooms
      .filter((r) => {
        if ((r as any).tier !== "free") return false;
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
    by.free = freeCoreCount;
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
      byTierAreaCount: (tier: string, area: string) => (byTierArea[`${tier}__${area}`] || []).length,
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
      console.log("tier-debug free core ids (first 80):", freeCoreIds.slice(0, 80));
      // eslint-disable-next-line no-console
      console.log("tier-debug free explicit-life ids (first 80):", freeLifeIds.slice(0, 80));

      // NEW: show a sample of core rooms with inferred tier (proves whether rank inference works)
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
      // eslint-disable-next-line no-console
      console.log("tier-debug core sample (first 30):", sample);
    } catch {
      // no-op
    }
  }, [counts, nonCoreCount, freeCoreCount, freeLifeCount, freeCoreIds, freeLifeIds]);

  const leftAnchors: Partial<Record<SpineTierId, React.ReactNode>> = {
    free: (
      <>
        <AnchorCard
          title="English Foundation"
          tierLabel="Free"
          body="English lessons only (foundation)."
          to="/tiers/free?area=english"
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
    vip1: (
      <AnchorCard
        title="Building sentences"
        tierLabel="VIP1"
        body="Pronunciation + patterns + listening repetition (English path)."
        to="/tiers/vip1?area=english"
      />
    ),
    vip3: (
      <AnchorCard
        title="Writing (English path)"
        tierLabel="VIP3"
        body="Short essays → structured writing → clear expression."
        to="/tiers/vip3?area=english"
      />
    ),
  };

  const rightAnchors: Partial<Record<SpineTierId, React.ReactNode>> = {
    vip1: (
      <AnchorCard
        title="Survival skills"
        tierLabel="VIP1"
        body="Life skills (survival/resilience) — safety, preparedness, discipline."
        to="/tiers/vip1?area=life"
      />
    ),
    vip3: (
      <AnchorCard
        title="Public speaking / Social skill"
        tierLabel="VIP3"
        body="Communication, confidence, relationships, readiness."
        to="/tiers/vip3?area=life"
      />
    ),
  };

  const centerAnchors: Partial<Record<SpineTierId, React.ReactNode>> = {
    vip3: (
      <AnchorCard
        title="Bridge into the spine"
        tierLabel="VIP3"
        body="Core training content (spine)."
        to="/tiers/vip3?area=core"
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
        {/* NEW: Home + Back */}
        <div style={topNav} aria-label="Tier Map navigation">
          <Link to="/" style={navBtn} aria-label="Go Home">
            ⌂ Home
          </Link>
          <button
            type="button"
            style={navBtn}
            onClick={() => navigate(-1)}
            aria-label="Go Back"
            title="Back"
          >
            ← Back
          </button>
        </div>

        <h1 style={title}>Tier Map</h1>

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
            <p style={small}>Core only. Free at ground (bottom). VIP9 at top.</p>
          </div>

          <div style={colBox} aria-label="Right column header">
            <div style={colTitle}>Right</div>
            <p style={small}>
              <b>Life Skills</b> — survival, public speaking, debate, discipline.
            </p>
          </div>

          {!isNarrow ? (
            <>
              <div style={cell} />
              <div style={spineCell}>
                <div style={cellStack}>
                  <div style={godNode}>
                    God / Universe (Above the head)
                    <div style={godGlow} />
                  </div>
                </div>
              </div>
              <div style={cell} />
            </>
          ) : (
            <div style={colBox}>
              <div style={godNode}>
                God / Universe (Above the head)
                <div style={godGlow} />
              </div>
            </div>
          )}

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
