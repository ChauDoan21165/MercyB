// src/router/AppRouter.tsx
// MB-BLUE-101.5 → MB-BLUE-101.5c — 2026-01-29 (+0700)
//
// ROUTING RULES (LOCKED):
// - Home route: /
// - Rooms list route: /rooms
// - Canonical room route: /room/:roomId
// - Legacy/bad routes are redirected silently
// - /room (no id) must NOT show NotFound
//
// Tier spine routes:
// - /tiers
// - /tiers/:tierId
//
// ADMIN (100.7+):
// - /admin/* is guarded by <AdminRoute>
// - /admin renders the Admin Control Board
//
// FIX (100.8):
// - Add /auth → /signin so it never 404s.
//
// FIX (101.3):
// - Add /admin/monitoring (guarded) and wire to AdminMonitoring page.
//
// FIX (101.4):
// - Add /admin/metrics (guarded) and wire to AdminMetrics page.
//
// FIX (101.5):
// - Standardize AdminRoute import to DEFAULT export (no braces).
// - Remove legacy NotFound import; use local NotFound to avoid dependency loops.
//
// ✅ FIX (101.5a):
// - Add AdminVIPRooms import + guarded route: /admin/vip-rooms
//
// ✅ CRITICAL FIX (admin blank page):
// - Use nested routing under "/admin/*" so dashboard is the INDEX route.
// - Wrap AdminLayout/AdminRoute ONCE at the parent.
// - TEMP: Remove RequireMercyAuth wrapper from admin routes because it can return null (blank page).
//   AdminRoute + useUserAccess is the real gate here.
//
// ✅ HARDEN (101.5c — global hero shell, no new file):
// - Add AppHeroShell INSIDE this file (no AppHeroLayout.tsx required).
// - Exclude only /signin (and keep /auth redirect outside).
// - Add global Home+Back + Mercy Blade rainbow band for all non-admin pages.
// - Keep admin clean: AppHeroShell auto-disables band on /admin/*.
// - Add click-safety containment (isolation + pointerEvents + high zIndex).
//
// ✅ PATCH (2026-01-31d):
// - UNIVERSAL WIDTH FIX: wrap Outlet in the SAME 980px frame as the hero band.
//   This makes ALL pages (rooms/tiers/rooms list/home) share the same width baseline.

import React from "react";
import { Routes, Route, Navigate, useParams, Outlet, Link, useLocation, useNavigate } from "react-router-dom";

import ChatHub from "@/pages/ChatHub";
import AllRooms from "@/pages/AllRooms";
import Home from "@/pages/Home";

// ✅ Tier spine pages (NO FETCH)
import TierIndex from "@/pages/TierIndex";
import TierDetail from "@/pages/TierDetail";

// ✅ Auth / Signin
import LoginPage from "@/pages/LoginPage";

// ✅ Admin guard + layout + control board
import AdminRoute from "@/components/admin/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";

// Existing admin pages (already in src/pages/admin)
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminBankTransfers from "@/pages/admin/AdminBankTransfers";
import AdminPaymentVerification from "@/pages/admin/AdminPaymentVerification";
import AdminAccessCodes from "@/pages/admin/AdminAccessCodes";
import AudioCoveragePage from "@/pages/admin/AudioCoveragePage";

// ✅ Monitoring + Metrics
import AdminMonitoring from "@/pages/admin/AdminMonitoring";
import AdminMetrics from "@/pages/admin/AdminMetrics";

// ✅ VIP Rooms
import AdminVIPRooms from "@/pages/admin/AdminVIPRooms";

// ✅ Mercy AI Host (global floating guide)
import MercyAIHost from "@/components/guide/MercyAIHost";

/**
 * Local NotFound — ZERO dependencies
 * (Do not import legacy Next-era NotFound here)
 */
function NotFound() {
  return (
    <div style={{ padding: 32 }}>
      <h2>404</h2>
      <p>Page not found.</p>
    </div>
  );
}

/**
 * Global shell (NO new file).
 * - Excludes /signin by routing (see Routes below).
 * - Auto-disables band on /admin/* to avoid messing with AdminLayout.
 * - Adds click-safety containment so pages don’t go “dead”.
 *
 * PATCH (2026-01-31):
 * - UNIFY the global top band frame with the app-wide PAGE_MAX=980 + px-4 (16px).
 * - This fixes the “sticking out” vs “shrinks inside border” mismatch.
 *
 * PATCH (2026-01-31d):
 * - UNIVERSAL WIDTH FIX: constrain ALL non-admin pages under the same 980px frame.
 */
function AppHeroShell() {
  const nav = useNavigate();
  const loc = useLocation();

  const isAdmin = String(loc.pathname || "").startsWith("/admin");

  const rainbow =
    "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

  // ✅ SINGLE SOURCE OF TRUTH for frame sizing
  // Match Home/ChatHub/etc: max-w-[980px] px-4
  const PAGE_MAX = 980;
  const FRAME_PAD_X = 16; // px-4 (band uses this)
  const FRAME_MAX = PAGE_MAX;

  // click-safety containment (prevents random fixed overlays from eating clicks)
  const shell: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    zIndex: 999999,
    pointerEvents: "auto",
    isolation: "isolate",
  };

  const band: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 999999,
    pointerEvents: "auto",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  };

  // ✅ FIX: was maxWidth:1100 and padding 14px → mismatch
  // Now EXACTLY matches app frame: max 980 + 16px horizontal padding
  const bandInner: React.CSSProperties = {
    maxWidth: FRAME_MAX,
    margin: "0 auto",
    padding: `10px ${FRAME_PAD_X}px`,
    display: "flex",
    alignItems: "center",
    gap: 10,
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
    pointerEvents: "auto",
  };

  const brand: React.CSSProperties = {
    marginLeft: 6,
    fontWeight: 950,
    letterSpacing: -0.6,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
    fontSize: 18,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  // ✅ UNIVERSAL CONTENT FRAME (the actual fix)
  // - Forces every page under this shell to render within 980px max width.
  // - Padding is intentionally 0 here to avoid “double px-4” on pages like Home
  //   that already apply their own px-4 container.
  const contentFrame: React.CSSProperties = {
    maxWidth: FRAME_MAX,
    margin: "0 auto",
    width: "100%",
  };

  return (
    <div style={shell}>
      {/* Keep Admin clean: no band, just outlet */}
      {isAdmin ? (
        <Outlet />
      ) : (
        <>
          <div style={band} aria-label="Mercy global hero band">
            <div style={bandInner}>
              <Link to="/" style={navBtn} aria-label="Go Home">
                ⌂ Home
              </Link>
              <button type="button" style={navBtn} onClick={() => nav(-1)} aria-label="Go Back" title="Back">
                ← Back
              </button>

              <div style={{ flex: 1 }} />

              <div style={brand} title="Mercy Blade">
                Mercy Blade
              </div>
            </div>
          </div>

          {/* ✅ KEY: constrain every non-admin page to the same frame */}
          <div style={contentFrame}>
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

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
 */
function RoomIndexRedirect() {
  return <Navigate to="/" replace />;
}

/**
 * Safety fix:
 * /rooms/room/:roomId → /room/:roomId
 */
function RoomsRoomRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

/**
 * TEMP:
 * /redeem → /
 * (prevents Home CTA from hitting NotFound)
 */
function RedeemRedirect() {
  return <Navigate to="/" replace />;
}

/**
 * FIX (100.8):
 * /auth → /signin
 */
function AuthRedirect() {
  return <Navigate to="/signin" replace />;
}

/**
 * ADMIN SHELL (nested routes) — LOCKED
 * - Guards ONCE
 * - Layout ONCE
 * - Child pages render via <Outlet />
 */
function AdminShell() {
  return (
    <AdminRoute>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminRoute>
  );
}

export default function AppRouter() {
  return (
    <>
      <Routes>
        {/* ✅ NO HERO on sign-in */}
        <Route path="/signin" element={<LoginPage />} />

        {/* ✅ Keep /auth redirect outside shell (still “no UI”) */}
        <Route path="/auth" element={<AuthRedirect />} />

        {/* ✅ HERO (global shell) on everything else */}
        <Route element={<AppHeroShell />}>
          {/* ✅ HOME (curated front door) */}
          <Route path="/" element={<Home />} />

          {/* Rooms list */}
          <Route path="/rooms" element={<AllRooms />} />

          {/* ✅ Tier Spine */}
          <Route path="/tiers" element={<TierIndex />} />
          <Route path="/tiers/:tierId" element={<TierDetail />} />

          {/* ✅ TEMP: keep Home CTA safe */}
          <Route path="/redeem" element={<RedeemRedirect />} />

          {/* 🔁 Legacy fixes (explicit, silent) */}
          <Route path="/room/room/:roomId" element={<RoomRoomRedirect />} />
          <Route path="/room" element={<RoomIndexRedirect />} />
          <Route path="/rooms/room/:roomId" element={<RoomsRoomRedirect />} />

          {/* ✅ Canonical room route */}
          <Route path="/room/:roomId" element={<ChatHub />} />

          {/* =========================
              ✅ ADMIN (GUARDED) — LOCKED
              ✅ Parent is /admin/* with INDEX dashboard
             ========================= */}
          <Route path="/admin/*" element={<AdminShell />}>
            {/* Dashboard */}
            <Route index element={<AdminDashboard />} />

            {/* Pages */}
            <Route path="payments" element={<AdminPayments />} />
            <Route path="bank-transfers" element={<AdminBankTransfers />} />
            <Route path="payment-verification" element={<AdminPaymentVerification />} />
            <Route path="access-codes" element={<AdminAccessCodes />} />
            <Route path="audio-coverage" element={<AudioCoveragePage />} />
            <Route path="monitoring" element={<AdminMonitoring />} />
            <Route path="metrics" element={<AdminMetrics />} />
            <Route path="vip-rooms" element={<AdminVIPRooms />} />

            {/* Unknown admin subpath → dashboard (safe default) */}
            <Route path="*" element={<AdminDashboard />} />
          </Route>

          {/* Fallback (hero applies) */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      {/* Mercy AI Host — global floating guide (must be inside Router context) */}
      <MercyAIHost />
    </>
  );
}

/* Teacher GPT – new thing to learn:
   Universal width problems are solved by ONE router shell frame around <Outlet />. */
