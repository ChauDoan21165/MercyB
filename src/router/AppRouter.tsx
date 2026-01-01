// src/router/AppRouter.tsx
// MB-BLUE-101.5 — 2026-01-01 (+0700)
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

import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

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

export default function AppRouter() {
  return (
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
          ✅ ADMIN (GUARDED)
         ========================= */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminPayments />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bank-transfers"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminBankTransfers />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/payment-verification"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminPaymentVerification />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/access-codes"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminAccessCodes />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/audio-coverage"
        element={
          <AdminRoute>
            <AdminLayout>
              <AudioCoveragePage />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* ✅ Monitoring (guarded) */}
      <Route
        path="/admin/monitoring"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminMonitoring />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* ✅ Metrics (guarded) */}
      <Route
        path="/admin/metrics"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminMetrics />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/* New thing to learn:
   Keep “Monitoring” (streams) and “Metrics” (KPIs) separate pages:
   streams explain “what happened”, metrics answer “how big is it”. */
