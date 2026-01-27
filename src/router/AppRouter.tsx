// src/router/AppRouter.tsx
// MB-BLUE-101.5 → MB-BLUE-101.5b — 2026-01-14 (+0700)
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
// 🔒 ADMIN ROUTING CONTRACT (LOCKED):
// - Admin routes MUST be nested under "/admin/*".
// - AdminRoute + AdminLayout MUST appear ONCE (in AdminShell only).
// - AdminDashboard MUST be the index route.
// - Do NOT wrap individual admin pages with AdminLayout/AdminRoute.
// - Unknown /admin/* subpaths must land safely (dashboard).

import React from "react";
import { Routes, Route, Navigate, useParams, Outlet } from "react-router-dom";

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
        {/* ✅ HOME (curated front door) */}
        <Route path="/" element={<Home />} />

        {/* ✅ Auth */}
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/auth" element={<AuthRedirect />} />

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

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Mercy AI Host — global floating guide (must be inside Router context) */}
      <MercyAIHost />
    </>
  );
}

/* New thing to learn:
   In React Router v6, "/admin/*" should usually be a parent route with nested children + an index route.
   If you put the dashboard directly on "/admin/*" without nesting, you can get confusing “blank page” behavior. */
