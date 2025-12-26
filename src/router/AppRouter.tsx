// src/router/AppRouter.tsx
// MercyBlade Blue — ROUTES (Single Source of Truth)
// File: src/router/AppRouter.tsx
// Version: MB-BLUE-94.15.4 — 2025-12-26 (+0700)
//
// LOCKED:
// - main.tsx owns <BrowserRouter> exactly once
// - App.tsx is providers-only
// - ALL routes live here
//
// FIX (94.15.4):
// - HARD redirect "/login" -> "/auth"
// - Keep "/all-rooms" alias -> RoomGrid
// - Module-level proof: window.__MB_ROUTER_VERSION__

import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { AdminRoute } from "@/components/admin/AdminRoute";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import AdminFloatingButton from "@/components/AdminFloatingButton";
import { OnboardingIntro } from "@/components/mercy";

import AudioCoveragePage from "@/pages/admin/AudioCoveragePage";
import Homepage from "@/_legacy_next_pages/Home";
import NotFound from "@/_legacy_next_pages/NotFound";
import Auth from "@/_legacy_next_pages/Auth";
import ResetPassword from "@/_legacy_next_pages/ResetPassword";

// Public pages
const Tiers = lazy(() => import("@/_legacy_next_pages/Tiers"));
const RoomGrid = lazy(() => import("@/_legacy_next_pages/RoomGrid"));
const JoinCode = lazy(() => import("@/_legacy_next_pages/JoinCode"));
const RedeemGiftCode = lazy(() => import("@/_legacy_next_pages/RedeemGiftCode"));
const PromoCode = lazy(() => import("@/_legacy_next_pages/PromoCode"));
const Settings = lazy(() => import("@/_legacy_next_pages/Settings"));
const Terms = lazy(() => import("@/_legacy_next_pages/Terms"));
const Privacy = lazy(() => import("@/_legacy_next_pages/Privacy"));
const Refund = lazy(() => import("@/_legacy_next_pages/Refund"));

const ChatHub = lazy(() => import("@/pages/ChatHub"));
const Logout = lazy(() => import("@/pages/Logout"));

const AdminDashboard = lazy(() => import("@/_legacy_next_pages/AdminDashboard"));

const guard = (el: JSX.Element) => <AdminRoute>{el}</AdminRoute>;

// 🔥 MODULE-LEVEL PROOF
console.log("🔥 AppRouter MODULE LOADED: MB-BLUE-94.15.4");
(window as any).__MB_ROUTER_VERSION__ = "MB-BLUE-94.15.4";

export default function AppRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Supabase recovery hash handling (STRICT + SAFE)
  useEffect(() => {
    const rawHash = window.location.hash;
    if (!rawHash) return;

    const params = new URLSearchParams(rawHash.replace(/^#/, ""));
    const isRecovery =
      params.get("type") === "recovery" &&
      params.get("access_token") &&
      params.get("refresh_token");

    if (!isRecovery) return;

    if (
      location.pathname !== "/reset" &&
      location.pathname !== "/reset-password"
    ) {
      navigate(`/reset-password${rawHash}`, { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <AdminFloatingButton />

      <Suspense fallback={<LoadingSkeleton variant="page" />}>
        <Routes>
          <Route path="/" element={<Homepage />} />

          {/* AUTH */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />

          <Route path="/onboarding" element={<OnboardingIntro />} />
          <Route path="/logout" element={<Logout />} />

          {/* ROOMS */}
          <Route path="/rooms" element={<RoomGrid />} />
          <Route path="/all-rooms" element={<RoomGrid />} />

          <Route path="/tiers" element={<Tiers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />

          {/* RESET */}
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/room/:roomId" element={<ChatHub />} />
          <Route path="/join/:code" element={<JoinCode />} />
          <Route path="/redeem/:code" element={<RedeemGiftCode />} />
          <Route path="/promo" element={<PromoCode />} />

          {/* ADMIN */}
          <Route path="/admin" element={guard(<AdminDashboard />)} />
          <Route path="/admin/audio-coverage" element={guard(<AudioCoveragePage />)} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
