// src/pages/TierDetail.tsx
// MB-BLUE-99.3 — 2025-12-30 (+0700)
//
// FIX (99.3):
// - ✅ Tier truth = inferred from room id suffix (_free / _vip1.._vip9)
// - ✅ Stop trusting r.tier (prevents “default-to-free” leakage)
// - Optional debug: add ?debugTier=1 to URL to log mismatches
//
// LOCKED:
// - Inline styles only here
// - Data source stays getRoomList() (room list truth)
// - No fetching/resolver logic

import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { ALL_TIER_IDS, tierIdToLabel, type TierId } from "@/lib/constants/tiers";
import { getRoomList } from "@/lib/roomList";

type RoomMetaLike = {
  id: string;
  tier?: string;
  title_en?: string;
  title_vi?: string;
  title?: { en?: string; vi?: string };
};

function isTierId(x: string): x is TierId {
  return (ALL_TIER_IDS as readonly string[]).includes(x);
}

function pickTitle(r: RoomMetaLike) {
  return r?.title?.en || r?.title_en || r?.title?.vi || r?.title_vi || r?.id;
}

/** SOURCE OF TRUTH (LOCKED BY YOUR DATA RULE):
 * Every room id ends with _free OR _vip1.._vip9
 */
function inferTierFromRoomId(roomId: string): TierId | null {
  const id = String(roomId || "").toLowerCase().trim();
  const m = id.match(/_(vip[1-9]|free)\b/);
  if (!m) return null;
  const t = m[1] as string;
  return isTierId(t) ? (t as TierId) : null;
}

export default function TierDetail() {
  const { tierId } = useParams<{ tierId: string }>();

  const tier = isTierId(String(tierId || "").toLowerCase())
    ? (String(tierId).toLowerCase() as TierId)
    : null;

  const rooms = useMemo(() => getRoomList() as unknown as RoomMetaLike[], []);

  const filtered = useMemo(() => {
    if (!tier) return [];
    // ✅ STRICT: tier is inferred from id suffix; prevents VIP rooms showing in FREE
    return rooms.filter((r) => inferTierFromRoomId(String(r?.id || "")) === tier);
  }, [rooms, tier]);

  // Optional mismatch debugging (URL: /tiers/free?debugTier=1)
  useEffect(() => {
    if (!tier) return;
    try {
      const qs = new URLSearchParams(window.location.search);
      const debug = qs.get("debugTier") === "1";
      if (!debug) return;

      let mismatches = 0;
      for (const r of rooms) {
        const id = String(r?.id || "");
        const inferred = inferTierFromRoomId(id);
        const claimed = String(r?.tier || "").toLowerCase().trim() || "(empty)";
        const inferredStr = inferred || "(no_match)";

        // Only log suspicious cases
        if (inferred && claimed !== "(empty)" && claimed !== inferredStr) {
          mismatches++;
          // eslint-disable-next-line no-console
          console.log("tier-debug mismatch:", { id, claimed, inferred: inferredStr });
        }
        if (!inferred) {
          mismatches++;
          // eslint-disable-next-line no-console
          console.log("tier-debug missing suffix:", { id, claimed });
        }
      }

      // eslint-disable-next-line no-console
      console.log("tier-debug summary:", {
        pageTier: tier,
        totalRooms: rooms.length,
        roomsInTier: filtered.length,
        mismatches,
      });
    } catch {
      // no-op
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, rooms, filtered.length]);

  const rainbow =
    "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: "rgba(225, 245, 255, 0.85)",
    padding: "18px 0 140px",
  };

  const container: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 16px",
  };

  const headerCard: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    padding: "16px 16px",
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: -0.8,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  const sub: React.CSSProperties = {
    marginTop: 6,
    color: "rgba(0,0,0,0.62)",
    fontWeight: 700,
  };

  const back: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 800,
    color: "rgba(0,0,0,0.65)",
    textDecoration: "underline",
  };

  const grid: React.CSSProperties = {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 12,
  };

  const cardBase: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.86)",
    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
    padding: "14px 14px",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    display: "block",
  };

  const cardTitle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 900,
    color: "rgba(0,0,0,0.78)",
    letterSpacing: -0.2,
    margin: 0,
  };

  const codeRow: React.CSSProperties = {
    marginTop: 8,
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
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(0,0,0,0.62)",
    whiteSpace: "nowrap",
  };

  const tinyCode: React.CSSProperties = {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 11,
    color: "rgba(0,0,0,0.62)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const emptyCard: React.CSSProperties = {
    marginTop: 14,
    borderRadius: 18,
    border: "1px dashed rgba(0,0,0,0.18)",
    background: "rgba(255,255,255,0.70)",
    padding: "16px 16px",
    color: "rgba(0,0,0,0.70)",
    lineHeight: 1.6,
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
            <h1 style={{ ...title, fontSize: 26 }}>Tier not found</h1>
            <div style={{ marginTop: 10 }}>
              <Link style={back} to="/tiers">
                Back to Tier Map
              </Link>
            </div>
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
            <h1 style={title}>{tierIdToLabel(tier)}</h1>
            <Link style={back} to="/tiers">
              Back to Tier Map
            </Link>
          </div>
          <div style={sub}>
            Rooms in this tier: <b>{filtered.length}</b>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={emptyCard} aria-label="Tier empty state">
            <p style={emptyTitle}>No rooms in this tier (yet).</p>
            <div style={{ marginTop: 6 }}>
              This is not an error — it usually means your data currently has no rooms assigned to{" "}
              <b>{tierIdToLabel(tier)}</b>.
            </div>
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
              <p style={cardTitle}>{pickTitle(r)}</p>

              <div style={codeRow}>
                <span style={pill}>OPEN</span>
                <span style={tinyCode}>id: {r.id}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** New thing to learn:
 * If your IDs encode truth (like _vip9), always derive state from that single source of truth
 * instead of trusting optional fields that might be missing or stale. */
