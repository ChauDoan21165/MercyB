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
//
// ✅ PATCH (2026-02-19):
// - Add /account route inside AppHeroShell (non-admin) so it never 404 in prod.
//
// ✅ PATCH (2026-03-02):
// - Add /pricing route (Stripe pricing table page)
//
// ✅ PATCH (2026-03-02c):
// - REMOVE UpgradePage usage (broken Supabase view).
// - /pricing is canonical.
// - Keep /upgrade as redirect → /pricing so old buttons/links never 404.

import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import ChatHub from "@/pages/ChatHub";
import AllRooms from "@/pages/AllRooms";
import Home from "@/pages/Home";

// ✅ Billing / Account
import AccountPage from "@/pages/AccountPage";

// ✅ Tier spine pages (NO FETCH)
import TierIndex from "@/pages/TierIndex";
import TierDetail from "@/pages/TierDetail";

// ✅ Auth / Signin
import LoginPage from "@/pages/LoginPage";

// ✅ Stripe pricing page (pricing-table embed)
import Pricing from "../screens/Pricing";

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

// ✅ DEPLOYMENT TRUTH BEACON
// Bump this whenever you deploy a router change so you can confirm what's running in prod.
const MB_ROUTER_VERSION = "2026-03-02-app-router-pricing-v3.2";

/**
 * Local NotFound — ZERO dependencies
 */
function NotFound() {
  return (
    <div style={{ padding: 32 }}>
      <h2>404</h2>
      <p>Page not found.</p>
      <div style={{ marginTop: 16, opacity: 0.6, fontSize: 12 }}>
        Router: {MB_ROUTER_VERSION}
      </div>
    </div>
  );
}

function AppHeroShell() {
  const nav = useNavigate();
  const loc = useLocation();

  const isAdmin = String(loc.pathname || "").startsWith("/admin");

  const rainbow =
    "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

  const PAGE_MAX = 980;
  const FRAME_PAD_X = 16;
  const FRAME_MAX = PAGE_MAX;

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

  const bandInner: React.CSSProperties = {
    maxWidth: FRAME_MAX,
    margin: "0 auto",
    padding: `10px ${FRAME_PAD_X}px`,
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 10,
  };

  const leftNavWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
  };

  const rightSpacer: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
  };

  const navBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.9)",
    color: "rgba(0,0,0,0.78)",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 13,
    lineHeight: 1,
    cursor: "pointer",
    pointerEvents: "auto",
  };

  const brand: React.CSSProperties = {
    fontWeight: 950,
    letterSpacing: -0.6,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
    fontSize: 18,
    lineHeight: 1,
    whiteSpace: "nowrap",
    justifySelf: "center",
  };

  const onBack = () => {
    try {
      if (
        typeof window !== "undefined" &&
        window.history &&
        window.history.length <= 1
      ) {
        nav("/");
      } else {
        nav(-1);
      }
    } catch {
      nav("/");
    }
  };

  const contentFrame: React.CSSProperties = {
    maxWidth: FRAME_MAX,
    margin: "0 auto",
    width: "100%",
  };

  return (
    <div style={shell}>
      {isAdmin ? (
        <Outlet />
      ) : (
        <>
          <div style={band} aria-label="Mercy global hero band">
            <div style={bandInner}>
              <div style={leftNavWrap}>
                <Link to="/" style={navBtn} aria-label="Go Home">
                  ⌂ Home
                </Link>
                <button
                  type="button"
                  style={navBtn}
                  onClick={onBack}
                  aria-label="Go Back"
                  title="Back"
                >
                  ← Back
                </button>
              </div>

              <div style={brand} title="Mercy Blade">
                Mercy Blade
              </div>

              <div style={rightSpacer} aria-hidden="true" />
            </div>
          </div>

          <div style={contentFrame}>
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

function RoomRoomRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/"} replace />;
}

function RoomIndexRedirect() {
  return <Navigate to="/" replace />;
}

function RoomsRoomRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

function RedeemRedirect() {
  return <Navigate to="/" replace />;
}

function AuthRedirect() {
  return <Navigate to="/signin" replace />;
}

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
  // eslint-disable-next-line no-console
  console.log("MB_ROUTER_VERSION", MB_ROUTER_VERSION);

  try {
    if (typeof window !== "undefined") {
      (window as any).MB_ROUTER_VERSION = MB_ROUTER_VERSION;
    }
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute(
        "data-mb-router-version",
        MB_ROUTER_VERSION
      );
    }
  } catch {
    // ignore
  }

  return (
    <>
      <Routes>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/auth" element={<AuthRedirect />} />

        <Route element={<AppHeroShell />}>
          <Route path="/" element={<Home />} />

          {/* ✅ canonical pricing */}
          <Route path="/pricing" element={<Pricing />} />

          {/* ✅ legacy /upgrade must never 404 */}
          <Route path="/upgrade" element={<Navigate to="/pricing" replace />} />

          <Route path="/account" element={<AccountPage />} />

          <Route path="/rooms" element={<AllRooms />} />

          <Route path="/tiers" element={<TierIndex />} />
          <Route path="/tiers/:tierId" element={<TierDetail />} />

          <Route path="/redeem" element={<RedeemRedirect />} />

          <Route path="/room/room/:roomId" element={<RoomRoomRedirect />} />
          <Route path="/room" element={<RoomIndexRedirect />} />
          <Route path="/rooms/room/:roomId" element={<RoomsRoomRedirect />} />

          <Route path="/room/:roomId" element={<ChatHub />} />

          <Route path="/admin/*" element={<AdminShell />}>
            <Route index element={<AdminDashboard />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="bank-transfers" element={<AdminBankTransfers />} />
            <Route
              path="payment-verification"
              element={<AdminPaymentVerification />}
            />
            <Route path="access-codes" element={<AdminAccessCodes />} />
            <Route path="audio-coverage" element={<AudioCoveragePage />} />
            <Route path="monitoring" element={<AdminMonitoring />} />
            <Route path="metrics" element={<AdminMetrics />} />
            <Route path="vip-rooms" element={<AdminVIPRooms />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <MercyAIHost />
    </>
  );
}