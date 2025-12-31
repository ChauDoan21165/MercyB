// src/router/AppRouter.tsx
// MB-BLUE-100.8 — 2025-12-31 (+0700)
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
// ADMIN (100.7):
// - /admin/* is guarded by <AdminRoute>
// - /admin renders the full Admin Control Board
//
// FIX (100.8):
// - Add /auth → /signin so it never 404s.

import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

import ChatHub from "@/pages/ChatHub";
import AllRooms from "@/pages/AllRooms";
import Home from "@/pages/Home";
import NotFound from "@/_legacy_next_pages/NotFound";

// ✅ Tier spine pages (NO FETCH)
import TierIndex from "@/pages/TierIndex";
import TierDetail from "@/pages/TierDetail";

// ✅ Auth / Signin
import LoginPage from "@/pages/LoginPage";

// ✅ Admin guard + layout + control board
import { AdminRoute } from "@/components/admin/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";

// Existing admin pages (already in src/pages/admin)
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminBankTransfers from "@/pages/admin/AdminBankTransfers";
import AdminPaymentVerification from "@/pages/admin/AdminPaymentVerification";
import AdminAccessCodes from "@/pages/admin/AdminAccessCodes";
import AudioCoveragePage from "@/pages/admin/AudioCoveragePage";

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

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/* New thing to learn:
   When a page 404s, it’s almost always missing in the active router — add the route before touching auth logic. */
