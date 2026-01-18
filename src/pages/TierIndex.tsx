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
// NOTE: Inline styles only. Locked concept preserved.

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { TierId, TierRoom, TierSource } from "@/lib/tierRoomSource";
import { loadRoomsForTiers, computeCoreSpineCounts } from "@/lib/tierRoomSource";

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

/**
 * LIFE (Survival) must be explicit-only (match TierDetail).
 * Do NOT use generic "-life-" (it catches "meaning-of-life").
 */
function isExplicitLifeRoom(r: TierRoom): boolean {
  const id = String((r as any)?.id || "").toLowerCase();

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
  // ✅ click-safety: keep this page above any global overlays
  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "white",
    position: "relative",
    zIndex: 999999, // go nuclear
    pointerEvents: "auto",
    isolation: "isolate", // prevent parent stacking-context weirdness
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

  const tierRow: React.CSSProperties = { display: "contents" };
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

      // ✅ expose rooms for console debugging (so "window.__MB_ALL_ROOMS__" is real)
      try {
        (window as any).__MB_ALL_ROOMS__ = rooms;
      } catch {
        // no-op
      }

      const spineIds = SPINE_TOP_TO_BOTTOM.map((t) => t.id) as readonly TierId[];
      const coreCounts = computeCoreSpineCounts(rooms, spineIds);

      const bySpineTier = Object.fromEntries(
        SPINE_TOP_TO_BOTTOM.map((t) => [t.id, coreCounts.byTier[t.id] ?? 0])
      ) as Record<SpineTierId, number>;

      setCounts({
        source: res.source,
        debug: res.debug,
        totalAll: rooms.length,
        totalCore: coreCounts.totalCore,
        unknownCoreTier: coreCounts.unknownTier,
        bySpineTier,
      });

      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  // ✅ RIGHT anchor count (explicit-only) — kept for debug even if Free card is hidden
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

  // ✅ Free CORE (TierDetail-aligned):
  // free core = tier=free AND not explicit-life AND not english/kids/life (area gate)
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

  // ✅ Replace displayed Free count in spine with our correct Free CORE count
  const countsForDisplay = useMemo(() => {
    const by = { ...counts.bySpineTier };
    by.free = freeCoreCount;
    return { ...counts, bySpineTier: by };
  }, [counts, freeCoreCount]);

  const nonCoreCount = useMemo(
    () => allRooms.filter((r) => String((r as any).area || "") !== "core").length,
    [allRooms]
  );

  // ---- DEBUG: hidden rooms / mismatches (console + optional pills) ----
  const hiddenReport = useMemo(() => {
    const norm = (v: any) => String(v || "").toLowerCase().trim();
    const spineSet = new Set(SPINE_TOP_TO_BOTTOM.map((t) => t.id));

    const byArea: Record<string, TierRoom[]> = {};
    const byTier: Record<string, TierRoom[]> = {};
    const byTierArea: Record<string, TierRoom[]> = {};

    const strictUntiered: TierRoom[] = []; // missing/blank/"unknown"
    const nonSpineTier: TierRoom[] = []; // not in spine (kids_1, kids_2, kids_3, etc.) OR missing

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

        // IMPORTANT:
        // - strictUntiered = missing/blank/"unknown"
        // - nonSpineTier = anything not in spine tiers (includes kids_1/2/3 etc.)
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

  // ✅ expose report (so you can copy/paste lists directly from DevTools)
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
    } catch {
      // no-op
    }
  }, [
    counts.source,
    counts.totalAll,
    counts.totalCore,
    nonCoreCount,
    freeCoreCount,
    freeLifeCount,
    freeCoreIds,
    freeLifeIds,
  ]);

  useEffect(() => {
    try {
      const qs = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      if (qs.get("debugHidden") !== "1") return;

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden totals:", hiddenReport.totals);

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden counts:", hiddenReport.counts);

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden ids.strictUntiered:", hiddenReport.ids.strictUntiered);

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden ids.nonSpineTier:", hiddenReport.ids.nonSpineTier);

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden ids.unknownArea:", hiddenReport.ids.unknownArea);

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden ids.unknownTier:", hiddenReport.ids.unknownTier);

      // eslint-disable-next-line no-console
      console.log(
        "tier-debugHidden ids.lifeAreaButNotExplicit:",
        hiddenReport.ids.lifeAreaButNotExplicit
      );

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden ids.kidsByIdNotEnglish:", hiddenReport.ids.kidsByIdNotEnglish);

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden ids.kidsByIdTierUnknown:", hiddenReport.ids.kidsByIdTierUnknown);

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden ids.survivalNotLife:", hiddenReport.ids.survivalNotLife);

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden sanity:", {
        vip1_core: hiddenReport.byTierAreaCount("vip1", "core"),
        vip1_english: hiddenReport.byTierAreaCount("vip1", "english"),
        vip1_life: hiddenReport.byTierAreaCount("vip1", "life"),
        vip3_core: hiddenReport.byTierAreaCount("vip3", "core"),
        vip3_english: hiddenReport.byTierAreaCount("vip3", "english"),
        vip3_life: hiddenReport.byTierAreaCount("vip3", "life"),
        free_english: hiddenReport.byTierAreaCount("free", "english"),
        free_life: hiddenReport.byTierAreaCount("free", "life"),
      });

      // eslint-disable-next-line no-console
      console.log("tier-debugHidden globals:", {
        __MB_ALL_ROOMS__: (window as any).__MB_ALL_ROOMS__?.length,
        __MB_TIER_REPORT__: (window as any).__MB_TIER_REPORT__?.totals,
      });
    } catch {
      // no-op
    }
  }, [hiddenReport]);

  // LEFT = English path only (Kids is English path)
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

  // RIGHT = Life skills only
  const rightAnchors: Partial<Record<SpineTierId, React.ReactNode>> = {
    // ✅ DELETE FREE RIGHT CARD (Survival skills in Free)
    // free: (...)  <-- intentionally not rendered

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

  // CENTER (core) anchor per tier (optional; only add where you want a visible middle card)
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

  // show pills only when requested (UI stays clean by default)
  const showHiddenPills =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("showHidden") === "1"
      : false;

  return (
    <div style={wrap}>
      <div style={container}>
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

              {/* IMPORTANT: two different “unknown” concepts */}
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
              <div style={tierRow}>
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
