// src/pages/TierIndex.tsx
// MB-BLUE-98.8 — 2025-12-30 (+0700)
//
// TIER MAP (LOCKED CONCEPT):
// - 3 columns (left / spine / right)
// - Center = tier spine (Free → VIP9)
// - Left = English Path (learn/skills on the way up)
// - Right = Life Skills / real-world skills
// - A horizontal “mid band” (psychology / critical thinking layer)
//
// NOTE:
// - Inline styles (no Tailwind dependency)
// - This is a VISUAL MAP page
// - Links go to /tiers/:tierId (existing routes)
// - Counts are derived from getRoomList() (local registry), NOT resolver logic
//
// FIX 98.8:
// - KEEP the long visual map + inline styles (no regression)
// - Add room counts per tier + total + unknown tier count
// - Show count pill next to each tier link

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getRoomList } from "@/lib/roomList";

type TierId =
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
  id: TierId;
  label: string;
  hint?: string;
};

type RoomMetaLike = { id: string; tier?: string };

const rainbow =
  "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

const spine: TierNode[] = [
  { id: "free", label: "Free", hint: "Ground / basics" },
  { id: "vip1", label: "VIP1", hint: "Build habit + foundation" },
  { id: "vip2", label: "VIP2", hint: "Strengthen core skills" },
  { id: "vip3", label: "VIP3", hint: "Bridge into the spine" },
  { id: "vip4", label: "VIP4", hint: "Climb" },
  { id: "vip5", label: "VIP5", hint: "Writing / deeper practice" },
  { id: "vip6", label: "VIP6", hint: "Systems / strategy" },
  { id: "vip7", label: "VIP7", hint: "Advanced" },
  { id: "vip8", label: "VIP8", hint: "High mastery" },
  { id: "vip9", label: "VIP9", hint: "Top / near God–Universe" },
];

function normTier(x: any): string {
  return String(x || "").toLowerCase().trim();
}

function TierLink({
  id,
  label,
  count,
}: {
  id: TierId;
  label: string;
  count?: number;
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
    <Link to={`/tiers/${id}`} style={a} aria-label={`Open ${label}`}>
      <span style={dot} />
      <span>{label}</span>
      {typeof count === "number" ? (
        <span style={countPill}>{count}</span>
      ) : null}
    </Link>
  );
}

export default function TierIndex() {
  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "white",
  };

  const container: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "18px 16px 80px",
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
  };

  const grid: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "1fr 240px 1fr",
    gap: 14,
    alignItems: "start",
  };

  // Responsive: collapse to 1 column on narrow screens
  const gridNarrow: React.CSSProperties = {
    ...grid,
    gridTemplateColumns: "1fr",
  };

  const isNarrow =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 860px)").matches
      : false;

  const panel: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.72)",
    padding: "14px 14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  };

  const panelTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.55)",
  };

  const small: React.CSSProperties = {
    marginTop: 10,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.70)",
  };

  const band: React.CSSProperties = {
    marginTop: 14,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background:
      "linear-gradient(90deg, rgba(77,255,184,0.20), rgba(77,184,255,0.18), rgba(184,77,255,0.16), rgba(255,184,77,0.18))",
    padding: "12px 14px",
  };

  const bandRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "baseline",
  };

  const bandLeft: React.CSSProperties = {
    fontWeight: 900,
    color: "rgba(0,0,0,0.78)",
    letterSpacing: -0.2,
  };

  const bandRight: React.CSSProperties = {
    fontWeight: 800,
    color: "rgba(0,0,0,0.62)",
  };

  // Spine styles
  const spineWrap: React.CSSProperties = {
    ...panel,
    background: "rgba(255,255,255,0.78)",
    position: "relative",
    overflow: "hidden",
  };

  const spineLine: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: 56,
    bottom: 18,
    width: 6,
    transform: "translateX(-50%)",
    borderRadius: 9999,
    background: "rgba(0,0,0,0.08)",
  };

  const spineLineFill: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: 56,
    bottom: 18,
    width: 6,
    transform: "translateX(-50%)",
    borderRadius: 9999,
    background: rainbow,
    opacity: 0.65,
  };

  const nodeRow: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 12,
    position: "relative",
    zIndex: 2,
  };

  const node: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  };

  const nodeHint: React.CSSProperties = {
    fontSize: 12,
    color: "rgba(0,0,0,0.55)",
    textAlign: "center",
  };

  // Left/right content blocks tied to tiers (simple + clear)
  const item: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.10)",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.80)",
    marginTop: 10,
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
  };

  const itemBody: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.66)",
  };

  const footer: React.CSSProperties = {
    marginTop: 18,
    color: "rgba(0,0,0,0.55)",
    fontSize: 13,
    lineHeight: 1.6,
  };

  // ✅ counts (local registry)
  const counts = useMemo(() => {
    const by: Record<string, number> = {
      free: 0,
      vip1: 0,
      vip2: 0,
      vip3: 0,
      vip4: 0,
      vip5: 0,
      vip6: 0,
      vip7: 0,
      vip8: 0,
      vip9: 0,
    };

    let unknown = 0;
    const list = getRoomList() as unknown as RoomMetaLike[];

    for (const r of list) {
      const t = normTier(r?.tier);
      if (t in by) by[t] += 1;
      else unknown += 1;
    }

    return { total: list.length, unknown, byTier: by };
  }, []);

  return (
    <div style={wrap}>
      <div style={container}>
        <h1 style={title}>Tier Map</h1>
        <div style={sub}>
          Three columns. One spine. This page is a <b>visual map</b> (your drawing): left = English Path, center = tier
          spine, right = life skills. Click any tier to open its rooms.
        </div>

        {/* quick stats */}
        <div style={metaRow} aria-label="Tier stats">
          <span style={metaPill}>Rooms: {counts.total}</span>
          <span style={metaPill}>Unknown tier: {counts.unknown}</span>
        </div>

        {/* Mid horizontal band (your drawing) */}
        <div style={band} aria-label="Mid band">
          <div style={bandRow}>
            <div style={bandLeft}>Psychology / Tâm lý học</div>
            <div style={bandRight}>Critical thinking / Tư duy phản biện</div>
          </div>
        </div>

        <div style={isNarrow ? gridNarrow : grid} aria-label="Three column tier map">
          {/* LEFT COLUMN */}
          <div style={panel} aria-label="Left column: English path">
            <div style={panelTitle}>Left column</div>
            <p style={small}>
              <b>English Path</b> — climb from basic English to writing, knowledge, and clear thinking.
            </p>

            <div style={item}>
              <div style={itemTitle}>
                English Foundation <span style={pill}>Free</span>
              </div>
              <p style={itemBody}>Basic survival English + everyday phrases. Start on the ground.</p>
            </div>

            <div style={item}>
              <div style={itemTitle}>
                Building sentences <span style={pill}>VIP1–VIP2</span>
              </div>
              <p style={itemBody}>Pronunciation + sentence patterns + listening repetition (audio-first).</p>
            </div>

            <div style={item}>
              <div style={itemTitle}>
                Writing <span style={pill}>VIP3–VIP5</span>
              </div>
              <p style={itemBody}>Short essays → structured writing → clear expression.</p>
            </div>

            <div style={item}>
              <div style={itemTitle}>
                Knowledge / Strategy mindset <span style={pill}>VIP6–VIP9</span>
              </div>
              <p style={itemBody}>Higher-level thinking: systems, strategy, meaning.</p>
            </div>
          </div>

          {/* CENTER SPINE */}
          <div style={spineWrap} aria-label="Center column: tier spine">
            <div style={panelTitle}>Spine</div>

            {/* Vertical spine line */}
            <div style={spineLine} />
            <div style={spineLineFill} />

            <div style={nodeRow}>
              {spine.map((t) => (
                <div key={t.id} style={node}>
                  <TierLink id={t.id} label={t.label} count={counts.byTier[t.id]} />
                  {t.hint ? <div style={nodeHint}>{t.hint}</div> : null}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={panel} aria-label="Right column: life skills">
            <div style={panelTitle}>Right column</div>
            <p style={small}>
              <b>Life Skills</b> — practical strength: health, money, relationships, public speaking, survival skills.
            </p>

            <div style={item}>
              <div style={itemTitle}>
                Survival skills <span style={pill}>Free</span>
              </div>
              <p style={itemBody}>Basics for real life: calm down, simple habits, daily stability.</p>
            </div>

            <div style={item}>
              <div style={itemTitle}>
                Martial art / Discipline <span style={pill}>VIP1–VIP2</span>
              </div>
              <p style={itemBody}>Body + mind training, consistency, courage.</p>
            </div>

            <div style={item}>
              <div style={itemTitle}>
                Public speaking / Social skill <span style={pill}>VIP3–VIP5</span>
              </div>
              <p style={itemBody}>Communication, confidence, relationships, career readiness.</p>
            </div>

            <div style={item}>
              <div style={itemTitle}>
                Money / Trade / Decisions <span style={pill}>VIP6–VIP9</span>
              </div>
              <p style={itemBody}>Decision-making, trade basics, long-term thinking.</p>
            </div>
          </div>
        </div>

        <div style={footer}>
          Tip: if you want the center spine to visually “branch” at VIP3 like your sketch, we can add two diagonal
          connectors from VIP3 into the left/right panels (pure CSS, still inline styles).
        </div>
      </div>
    </div>
  );
}
