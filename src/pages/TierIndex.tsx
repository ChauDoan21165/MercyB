// src/pages/TierIndex.tsx
// MB-BLUE-98.9 — 2026-01-01 (+0700)
//
// TIER MAP (LOCKED CONCEPT):
// - 3 columns (left / spine / right)
// - Center = tier spine (Free → VIP9), rendered TOP→BOTTOM as VIP9→Free (visual)
// - Left + Right blocks must sit HORIZONTALLY on the same row as the tier they belong to
// - Free = ground (BOTTOM)
// - VIP9 = above the head (TOP)
// - God / Universe sits ABOVE VIP9
//
// DATA RULE (LOCKED):
// - derive room counts from PUBLIC_ROOM_MANIFEST
// - tier inferred from roomId/filename (vipN marker), never trusted from JSON fields
//
// NOTE:
// - Inline styles (no Tailwind dependency)
// - Visual map page
// - Links go to /tiers/:tierId (existing routes)

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";

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

const rainbow =
  "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

const TIERS_TOP_TO_BOTTOM: TierNode[] = [
  { id: "vip9", label: "VIP9", hint: "Top / near God–Universe" },
  { id: "vip8", label: "VIP8", hint: "High mastery" },
  { id: "vip7", label: "VIP7", hint: "Advanced" },
  { id: "vip6", label: "VIP6", hint: "Systems / strategy" },
  { id: "vip5", label: "VIP5", hint: "Writing / deeper practice" },
  { id: "vip4", label: "VIP4", hint: "Climb" },
  { id: "vip3", label: "VIP3", hint: "Bridge into the spine" },
  { id: "vip2", label: "VIP2", hint: "Strengthen core skills" },
  { id: "vip1", label: "VIP1", hint: "Build habit + foundation" },
  { id: "free", label: "Free", hint: "Ground / basics" },
];

function inferTierFromRoomId(roomId: string): TierId | "unknown" {
  const s = String(roomId || "").toLowerCase().trim();

  // Strong match first: _vipN or -vipN or vipN_ etc.
  const m = s.match(/\bvip([1-9])\b/);
  if (m?.[1]) return (`vip${m[1]}` as TierId);

  // Some IDs include vip6_vip6 etc; above regex already catches.
  // If none, treat as free by data rule (many free rooms have no vip marker).
  return "free";
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

function AnchorCard({
  title,
  tierLabel,
  body,
}: {
  title: string;
  tierLabel: string;
  body: string;
}) {
  const item: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.10)",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.80)",
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
    <div style={item}>
      <div style={itemTitle}>
        {title} <span style={pill}>{tierLabel}</span>
      </div>
      <p style={itemBody}>{body}</p>
    </div>
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

  // --- 3-column row grid (HORIZONTAL OWNERSHIP LOCK) ---
  const rowGrid: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "1fr 260px 1fr",
    gap: 14,
    alignItems: "start",
  };

  const isNarrow =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 860px)").matches
      : false;

  const rowGridNarrow: React.CSSProperties = {
    ...rowGrid,
    gridTemplateColumns: "1fr",
  };

  const colBox: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.72)",
    padding: "12px 12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
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

  const tierRow: React.CSSProperties = {
    display: "contents", // important: each tier is ONE ROW across 3 columns
  };

  const cell: React.CSSProperties = {
    minHeight: 84,
    display: "flex",
    alignItems: "center",
  };

  const cellStack: React.CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
  };

  const spineCell: React.CSSProperties = {
    ...cell,
    justifyContent: "center",
  };

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
  };

  const footer: React.CSSProperties = {
    marginTop: 18,
    color: "rgba(0,0,0,0.55)",
    fontSize: 13,
    lineHeight: 1.6,
  };

  // ✅ counts (PUBLIC_ROOM_MANIFEST) — tier inferred from roomId
  const counts = useMemo(() => {
    const by: Record<TierId, number> = {
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

    const ids = Object.keys(PUBLIC_ROOM_MANIFEST || {});
    for (const id of ids) {
      const t = inferTierFromRoomId(id);
      if (t === "unknown") unknown += 1;
      else by[t] += 1;
    }

    return { total: ids.length, unknown, byTier: by };
  }, []);

  // --- BUCKET ANCHORING (FINAL) ---
  // Each bucket appears EXACTLY ONCE at its anchored tier row.
  const leftAnchors: Partial<Record<TierId, React.ReactNode>> = {
    free: (
      <AnchorCard
        title="English Foundation"
        tierLabel="Free"
        body="Basic survival English + everyday phrases. Start on the ground."
      />
    ),
    vip1: (
      <AnchorCard
        title="Building sentences"
        tierLabel="VIP1"
        body="Pronunciation + sentence patterns + listening repetition (audio-first)."
      />
    ),
    vip3: (
      <AnchorCard
        title="Writing"
        tierLabel="VIP3"
        body="Short essays → structured writing → clear expression."
      />
    ),
    vip6: (
      <AnchorCard
        title="Knowledge / Strategy mindset"
        tierLabel="VIP6"
        body="Higher-level thinking: systems, strategy, meaning."
      />
    ),
  };

  const rightAnchors: Partial<Record<TierId, React.ReactNode>> = {
    free: (
      <AnchorCard
        title="Survival skills"
        tierLabel="Free"
        body="Basics for real life: calm down, simple habits, daily stability."
      />
    ),
    vip1: (
      <AnchorCard
        title="Martial art / Discipline"
        tierLabel="VIP1"
        body="Body + mind training, consistency, courage."
      />
    ),
    vip3: (
      <AnchorCard
        title="Public speaking / Social skill"
        tierLabel="VIP3"
        body="Communication, confidence, relationships, career readiness."
      />
    ),
    vip6: (
      <AnchorCard
        title="Money / Trade / Decisions"
        tierLabel="VIP6"
        body="Decision-making, trade basics, long-term thinking."
      />
    ),
  };

  return (
    <div style={wrap}>
      <div style={container}>
        <h1 style={title}>Tier Map</h1>
        <div style={sub}>
          Three columns. One spine. <b>Ownership is horizontal</b>. VIP9 is top, Free is ground.
          God/Universe sits above the head. Click any tier to open its rooms.
        </div>

        <div style={metaRow} aria-label="Tier stats">
          <span style={metaPill}>Rooms: {counts.total}</span>
          <span style={metaPill}>Unknown tier: {counts.unknown}</span>
        </div>

        <div style={band} aria-label="Mid band">
          <div style={bandRow}>
            <div style={bandLeft}>Psychology / Tâm lý học</div>
            <div style={bandRight}>Critical thinking / Tư duy phản biện</div>
          </div>
        </div>

        {/* Column headers */}
        <div style={isNarrow ? rowGridNarrow : rowGrid} aria-label="Tier rows grid">
          {/* LEFT header */}
          <div style={colBox} aria-label="Left column header">
            <div style={colTitle}>Left</div>
            <p style={small}>
              <b>English Path</b> — anchored buckets (no repetition across tiers).
            </p>
          </div>

          {/* SPINE header */}
          <div style={colBox} aria-label="Spine column header">
            <div style={colTitle}>Spine</div>
            <p style={small}>
              Free at ground (bottom). VIP9 at top. Counts come from manifest.
            </p>
          </div>

          {/* RIGHT header */}
          <div style={colBox} aria-label="Right column header">
            <div style={colTitle}>Right</div>
            <p style={small}>
              <b>Life Skills</b> — anchored buckets (no repetition across tiers).
            </p>
          </div>

          {/* GOD / UNIVERSE ROW (ABOVE VIP9) */}
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

          {/* TIER ROWS (VIP9 → FREE) */}
          {TIERS_TOP_TO_BOTTOM.map((t) => (
            <React.Fragment key={t.id}>
              <div style={tierRow}>
                {/* LEFT cell for this tier (anchored only; otherwise empty) */}
                <div style={cell} aria-label={`Left cell ${t.label}`}>
                  <div style={cellStack}>{leftAnchors[t.id] ?? null}</div>
                </div>

                {/* SPINE cell */}
                <div style={spineCell} aria-label={`Spine cell ${t.label}`}>
                  <div style={cellStack}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <TierLink
                        id={t.id}
                        label={t.label}
                        count={counts.byTier[t.id]}
                      />
                    </div>
                    {t.hint ? <div style={spineHint}>{t.hint}</div> : null}
                  </div>
                </div>

                {/* RIGHT cell for this tier (anchored only; otherwise empty) */}
                <div style={cell} aria-label={`Right cell ${t.label}`}>
                  <div style={cellStack}>{rightAnchors[t.id] ?? null}</div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div style={footer}>
          LOCK CHECK: Left/right cards only appear on their anchored tier row, so nothing can float above its tier.
        </div>
      </div>
    </div>
  );
}
