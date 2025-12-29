// src/AppRouter.tsx
// MB-BLUE-97.8 — 2025-12-29 (+0700)
//
// ROUTING RULES (LOCKED):
// - Canonical room route: /room/:roomId
// - Legacy/bad routes are redirected silently
// - /room (no id) must NOT show NotFound
// - No resolver logic here
//
// Phase IV→V:
// - Tier spine routes:
//   /tiers
//   /tiers/:tierId

import { Routes, Route, Navigate, useParams } from "react-router-dom";

import ChatHub from "@/pages/ChatHub";
import AllRooms from "@/pages/AllRooms";

// ✅ Tier spine pages (NO FETCH)
import TierIndex from "@/pages/TierIndex";
import TierDetail from "@/pages/TierDetail";

/**
 * Local NotFound — ZERO dependencies
 * (DO NOT import legacy pages here)
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

export default function AppRouter() {
  return (
    <Routes>
      {/* Main landing */}
      <Route path="/" element={<AllRooms />} />

      {/* ✅ Tier Spine */}
      <Route path="/tiers" element={<TierIndex />} />
      <Route path="/tiers/:tierId" element={<TierDetail />} />

      {/* 🔁 Legacy fixes (explicit, silent) */}
      <Route path="/room/room/:roomId" element={<RoomRoomRedirect />} />
      <Route path="/room" element={<RoomIndexRedirect />} />

      {/* ✅ Canonical room route */}
      <Route path="/room/:roomId" element={<ChatHub />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
