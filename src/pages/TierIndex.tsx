// FILE: TierIndex.tsx
// PATH: src/pages/TierIndex.tsx
// MB-BLUE-98.9j → MB-BLUE-98.9n — 2026-01-18 (+0700)
//
// (Header text preserved from your version; UI preserved.)
// NOTE: Inline styles only. Locked concept preserved.
//
// ✅ FIX (2026-01-25):
// - Tier Map counts MUST be identical for ALL users (Free/VIP).
// - Tier Map counts MUST NOT depend on DB/RLS.
// - Use useTierMapState() (registry-driven) as the single source of truth for counts + report.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { SpineTierId } from "@/pages/tierMap/tierMapTypes";
import { SPINE_TOP_TO_BOTTOM, rainbow } from "@/pages/tierMap/tierMapData";
import { TierLink, AnchorCard } from "@/pages/tierMap/tierMapUI";

// ✅ SINGLE SOURCE OF TRUTH for Tier Map view (registry-driven, consistent for all users)
import { useTierMapState } from "@/pages/tierMap/tierMapState";

export default function TierIndex() {
  const nav = useNavigate();

  const {
    loading,
    countsForDisplay,
    nonCoreCount,
    freeCoreCount,
    freeLifeCount,
    hiddenReport,
    freeCoreIds,
    freeLifeIds,
  } = useTierMapState();

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

  // ─────────────────────────────────────────────
  // TOP NAV (Back / Home / Pricing)
  // ─────────────────────────────────────────────
  const topNavRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  };

  const topNavLeft: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  };

  const topBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "white",
    color: "rgba(0,0,0,0.78)",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    lineHeight: 1,
    whiteSpace: "nowrap",
    textDecoration: "none",
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

  // ✅ FIX: don't snapshot matchMedia once; make it reactive
  const [isNarrow, setIsNarrow] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(max-width: 860px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia("(max-width: 860px)");
    const sync = () => setIsNarrow(mql.matches);

    // set initial (in case of hydration / zoom)
    sync();

    // Preferred modern API
    if (typeof mql.addEventListener === "function") {
      const onChange = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    // Fallback: listen to resize and re-check mql.matches (Safari/older WebKit safe).
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

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

  const showHiddenPills =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("showHidden") === "1"
      : false;

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
    // ✅ DELETE FREE RIGHT CARD
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

  // ✅ Optional debug logs (only when ?debugTier=1)
  useEffect(() => {
    try {
      const qs = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      if (qs.get("debugTier") !== "1") return;

      // eslint-disable-next-line no-console
      console.log("tier-debug TierIndex (registry-driven):", {
        source: countsForDisplay.source,
        totalAll: countsForDisplay.totalAll,
        totalCore: countsForDisplay.totalCore,
        nonCore: nonCoreCount,
        freeCoreCount,
        freeLifeCount,
        bySpineTier: countsForDisplay.bySpineTier,
        unknownCoreTier: countsForDisplay.unknownCoreTier,
        sampleKeys: Object.keys((countsForDisplay.bySpineTier as any) || {}),
      });

      // eslint-disable-next-line no-console
      console.log("tier-debug free core ids (first 80):", freeCoreIds.slice(0, 80));
      // eslint-disable-next-line no-console
      console.log("tier-debug free explicit-life ids (first 80):", freeLifeIds.slice(0, 80));
    } catch {
      // no-op
    }
  }, [
    countsForDisplay.source,
    countsForDisplay.totalAll,
    countsForDisplay.totalCore,
    countsForDisplay.bySpineTier,
    countsForDisplay.unknownCoreTier,
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
    } catch {
      // no-op
    }
  }, [hiddenReport]);

  return (
    <div style={wrap}>
      <div style={container}>
        {/* TOP NAV */}
        <div style={topNavRow}>
          <div style={topNavLeft}>
            <button
              type="button"
              style={topBtn}
              onClick={() => {
                if (window.history.length > 1) nav(-1);
                else nav("/");
              }}
            >
              ← Back
            </button>

            <button type="button" style={topBtn} onClick={() => nav("/")}>
              🏠 Home
            </button>
          </div>

          <Link to="/tiers" style={topBtn} aria-label="Pricing">
            Pricing
          </Link>
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
              <div style={{ display: "contents" }}>
                <div style={cell} aria-label={`Left cell ${t.label}`}>
                  <div style={cellStack}>{leftAnchors[t.id as SpineTierId] ?? null}</div>
                </div>

                <div style={spineCell} aria-label={`Spine cell ${t.label}`}>
                  <div style={cellStack}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <TierLink
                        id={t.id as SpineTierId}
                        label={t.label}
                        count={countsForDisplay.bySpineTier[t.id as SpineTierId] ?? 0}
                        to={`/tiers/${t.id}?area=core`}
                      />
                    </div>

                    {centerAnchors[t.id as SpineTierId] ? (
                      <div style={{ marginTop: 8 }}>{centerAnchors[t.id as SpineTierId]}</div>
                    ) : null}

                    {t.hint ? <div style={spineHint}>{t.hint}</div> : null}
                  </div>
                </div>

                <div style={cell} aria-label={`Right cell ${t.label}`}>
                  <div style={cellStack}>{rightAnchors[t.id as SpineTierId] ?? null}</div>
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
            {countsForDisplay.debug ? ` | ${String(countsForDisplay.debug)}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

/* teacher GPT — new thing to learn:
   If you want “marketing counts,” never compute from RLS-gated DB rows.
   Use one public registry pipeline, then gate only when opening rooms. */
