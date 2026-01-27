// src/AppRouter.tsx
// MB-BLUE-100.4 — 2025-12-31 (+0700)
//
// ROUTING RULES (LOCKED):
// - Canonical room route: /room/:roomId
// - Legacy/bad routes are redirected silently
// - /room (no id) must NOT show NotFound
// - No resolver logic here
//
// FIX (100.4):
// - Mount BottomMusicBar ONCE at app-shell level
// - Remove it from ChatHub
// - Guarantees identical alignment with room content
// - Stops layout fights / overflow forever
//
// ENHANCE (100.4a — 2026-01-25):
// - Force ChatHub remount on roomId change (prevents stale per-room styling/highlights sticking)
//
// ✅ FIX (2026-01-25d):
// - /tier-map/:tierId must be a PUBLIC preview list (registry-driven), identical for Free/VIP.
// - Show ALL rooms (names) in the tier from roomDataMap.
// - Clicking a VIP room sends user to /room/:id where the real gate happens (“This is for VIP users.”).
// - No “no rooms then suddenly appears” (no async DB listing here).

import React, { useMemo } from "react";
import { Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";

import ChatHub from "@/pages/ChatHub";
import AllRooms from "@/pages/AllRooms";
import NotFound from "@/_legacy_next_pages/NotFound";
import BottomMusicBar from "@/components/audio/BottomMusicBar";

import { roomDataMap } from "@/lib/roomDataImports";
import { tierFromRoomId } from "@/lib/tierFromRoomId";

/**
 * Legacy fix:
 * /room/room/:roomId  →  /room/:roomId
 */
function RoomRoomRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/"} replace />;
}

/**
 * Safety fix:
 * /room  →  /
 * (Important: must not render NotFound)
 */
function RoomIndexRedirect() {
  return <Navigate to="/" replace />;
}

/**
 * Canonical room route wrapper:
 * Force remount when roomId changes so per-room UI (keywords/highlights/styles) can’t get “stuck”.
 */
function RoomRoute() {
  const { roomId } = useParams<{ roomId: string }>();
  return <ChatHub key={roomId || "room"} />;
}

function normTier(input: unknown): string {
  const s = String(input ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (!s) return "";
  // allow "vip_9" etc
  return s.replace(/-/g, "_");
}

function tierLabelPretty(tier: string): string {
  const t = normTier(tier);
  if (t === "free") return "Free";
  const mVip = t.match(/^vip_?(\d+)$/);
  if (mVip) return `VIP${Number(mVip[1])}`;
  const mKids = t.match(/^kids_?(\d+)$/);
  if (mKids) return `Kids ${Number(mKids[1])}`;
  return String(tier || "").toUpperCase() || "Tier";
}

/**
 * ✅ PUBLIC Tier Map tier page (registry only)
 * /tier-map/:tierId
 *
 * - List is identical for everyone.
 * - Do NOT use DB here (no RLS differences, no flashing “0 then 1”).
 * - Clicking always goes to /room/:id; RoomRenderer gate decides access.
 */
function TierMapTierPublic() {
  const nav = useNavigate();
  const { tierId } = useParams<{ tierId: string }>();
  const tierKey = normTier(tierId);

  const rooms = useMemo(() => {
    const out: Array<{
      id: string;
      title_en: string;
      title_vi: string;
      tier: string;
    }> = [];

    const values = Object.values(roomDataMap as any);
    for (const v of values) {
      if (!v) continue;
      if ((v as any).hasData === false) continue;

      const id = String((v as any).id || "").trim();
      if (!id) continue;

      const inferred = String(tierFromRoomId(id) || "free").toLowerCase();
      if (tierKey && inferred !== tierKey) continue;

      out.push({
        id,
        title_en: String((v as any).title_en || (v as any).titleEn || id),
        title_vi: String((v as any).title_vi || (v as any).titleVi || ""),
        tier: inferred,
      });
    }

    // stable sort: title_en then id
    out.sort((a, b) => {
      const ta = a.title_en.toLowerCase();
      const tb = b.title_en.toLowerCase();
      if (ta < tb) return -1;
      if (ta > tb) return 1;
      return a.id.localeCompare(b.id);
    });

    return out;
  }, [tierKey]);

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "rgb(226,245,255)",
    padding: "22px 16px 90px",
  };

  const container: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
  };

  const headerCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 18,
    padding: "18px 18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  };

  const h1: React.CSSProperties = {
    margin: 0,
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: -1.0,
    lineHeight: 1.05,
    color: "rgba(0,0,0,0.85)",
  };

  const sub: React.CSSProperties = {
    marginTop: 10,
    fontSize: 16,
    color: "rgba(0,0,0,0.65)",
    lineHeight: 1.5,
  };

  const topRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const linkBtn: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 800,
    color: "rgba(0,0,0,0.75)",
    textDecoration: "underline",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
  };

  const listWrap: React.CSSProperties = {
    marginTop: 14,
    display: "grid",
    gap: 12,
  };

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.90)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 18,
    padding: "14px 16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  };

  const titleCol: React.CSSProperties = { minWidth: 0 };
  const tEn: React.CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    color: "rgba(0,0,0,0.82)",
    lineHeight: 1.2,
  };

  const tVi: React.CSSProperties = {
    marginTop: 6,
    marginBottom: 0,
    fontSize: 14,
    fontWeight: 800,
    color: "rgba(0,0,0,0.58)",
    lineHeight: 1.35,
  };

  const rightCol: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  };

  const idPill: React.CSSProperties = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 12,
    fontWeight: 800,
    padding: "6px 10px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.10)",
    color: "rgba(0,0,0,0.65)",
    background: "rgba(255,255,255,0.85)",
    whiteSpace: "nowrap",
  };

  const openBtn: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "white",
    color: "rgba(0,0,0,0.78)",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const pretty = tierLabelPretty(tierKey);
  const tierIsVip = /^vip\d+$/i.test(tierKey);
  const tierIsFree = tierKey === "free";

  return (
    <div style={wrap}>
      <div style={container}>
        <div style={headerCard}>
          <div style={topRow}>
            <div>
              <h1 style={h1}>
                {pretty} / Cấp {pretty}
              </h1>
              <div style={sub}>
                Showing <b>all rooms</b> in this tier (public preview): <b>{rooms.length}</b>
                <br />
                {tierIsFree ? (
                  <span>Free users can open these rooms directly.</span>
                ) : tierIsVip ? (
                  <span>
                    Free users can <b>see names</b>; opening a room will show: <b>This is for VIP users.</b>
                  </span>
                ) : (
                  <span>Opening a room may require access depending on tier.</span>
                )}
              </div>
            </div>

            <button type="button" style={linkBtn} onClick={() => nav("/tier-map")}>
              Back to Tier Map
            </button>
          </div>
        </div>

        <div style={listWrap} aria-label={`Tier rooms ${pretty}`}>
          {rooms.map((r) => (
            <div key={r.id} style={card}>
              <div style={titleCol}>
                <p style={tEn}>{r.title_en}</p>
                {r.title_vi ? <p style={tVi}>{r.title_vi}</p> : null}
              </div>

              <div style={rightCol}>
                <span style={idPill}>id: {r.id}</span>
                <button
                  type="button"
                  style={openBtn}
                  onClick={() => nav(`/room/${encodeURIComponent(r.id)}`)}
                  aria-label={`Open ${r.id}`}
                >
                  OPEN
                </button>
              </div>
            </div>
          ))}

          {rooms.length === 0 ? (
            <div style={{ ...card, justifyContent: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: "rgba(0,0,0,0.65)" }}>
                No rooms found in registry for this tier.
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * GLOBAL APP SHELL (LOCKED)
 * - Owns BottomMusicBar
 * - Routes render INSIDE this shell
 */
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomMusicBar />
    </>
  );
}

export default function AppRouter() {
  return (
    <AppShell>
      <Routes>
        {/* Main landing */}
        <Route path="/" element={<AllRooms />} />

        {/* 🔁 Legacy fixes (explicit, silent) */}
        <Route path="/room/room/:roomId" element={<RoomRoomRedirect />} />
        <Route path="/room/" element={<RoomIndexRedirect />} />
        <Route path="/room" element={<RoomIndexRedirect />} />

        {/* ✅ Canonical room route */}
        <Route path="/room/:roomId" element={<RoomRoute />} />

        {/* ✅ Tier Map overview page (your TierIndex uses /tier-map) */}
        <Route path="/tier-map" element={<Navigate to="/tiers" replace />} />
        {/* ✅ Public preview listing (registry-driven, identical for all) */}
        <Route path="/tier-map/:tierId" element={<TierMapTierPublic />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}

/* teacher GPT — new thing to learn:
   If you want “everyone sees the same catalog”, never list rooms from RLS data.
   List from registry, and gate only at the room itself. */
