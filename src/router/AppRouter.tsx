// src/router/AppRouter.tsx
// MB-BLUE-101.5 → MB-BLUE-101.5d — 2026-03-20 (-0600)
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
// ✅ PATCH (2026-02-20):
// - Deployment truth beacon is now ALSO exposed on window.MB_ROUTER_VERSION
//   + documentElement data-mb-router-version (easy to verify in prod).
// - IMPORTANT: Do NOT rely on top-level IIFE for beacon; it can be tree-shaken in prod builds.
//   Beacon is now stamped inside AppRouter() (never tree-shaken).
//
// ✅ PATCH (2026-03-02):
// - Add /pricing route (Stripe pricing table page)
//
// ✅ PATCH (2026-03-02e):
// - Keep /upgrade route BUT render the SAME Pricing UI as /pricing.
//   This avoids old pricing copy or 404 loops if legacy links still go to /upgrade.
//
// ✅ PERF PATCH:
// - Route pages are lazy-loaded to reduce the initial bundle.
// - MercyAIHost is lazy-loaded and mounted ONLY on room routes,
//   so it no longer stays globally eligible on first paint for unrelated routes.
//
// ✅ PATCH (2026-03-09):
// - /room now redirects to /rooms (better match for room browsing flow).
// - /redeem temporarily redirects to /pricing instead of /, so CTA lands somewhere intentional.
//
// ✅ PATCH (2026-03-20):
// - Add visible auth state to AppHeroShell right side.
// - Show loading / signed-in badge / email / Account / Sign out / Sign in.
// - This makes post-login status obvious on the homepage and other non-admin pages.
//
// ✅ PATCH (2026-03-20b):
// - Preserve /auth query params + hash when redirecting to /signin.
// - This keeps logged_out / created / reset notices working on LoginPage.
//
// ✅ PATCH (2026-03-20c):
// - Add /billing redirect to /account so legacy billing links never 404.
// - Add /billing/success route for Stripe success return page.

import React, { Suspense, lazy, useEffect } from "react";
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

import AdminRoute from "@/components/admin/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/providers/AuthProvider";

const MB_ROUTER_VERSION = "2026-03-20-app-router-auth-hero-shell-v3";

const ChatHub = lazy(() => import("@/pages/ChatHub"));
const AllRooms = lazy(() => import("@/pages/AllRooms"));
const Home = lazy(() => import("@/pages/Home"));

const AccountPage = lazy(() => import("@/pages/AccountPage"));
const BillingSuccessPage = lazy(() => import("@/pages/BillingSuccessPage"));
const Pricing = lazy(() => import("../screens/Pricing"));

const TierIndex = lazy(() => import("@/pages/TierIndex"));
const TierDetail = lazy(() => import("@/pages/TierDetail"));

const LoginPage = lazy(() => import("@/pages/LoginPage"));

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminPayments = lazy(() => import("@/pages/admin/AdminPayments"));
const AdminBankTransfers = lazy(() => import("@/pages/admin/AdminBankTransfers"));
const AdminPaymentVerification = lazy(
  () => import("@/pages/admin/AdminPaymentVerification")
);
const AdminAccessCodes = lazy(() => import("@/pages/admin/AdminAccessCodes"));
const AudioCoveragePage = lazy(() => import("@/pages/admin/AudioCoveragePage"));
const AdminMonitoring = lazy(() => import("@/pages/admin/AdminMonitoring"));
const AdminMetrics = lazy(() => import("@/pages/admin/AdminMetrics"));
const AdminVIPRooms = lazy(() => import("@/pages/admin/AdminVIPRooms"));

const MercyAIHost = lazy(() => import("@/components/guide/MercyAIHost"));

declare global {
  interface Window {
    MB_ROUTER_VERSION?: string;
  }
}

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

function RouteFallback() {
  return <div style={{ padding: 24, opacity: 0.72 }}>Loading…</div>;
}

function LazyPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

function AppHeroShell() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, isLoading, signOut } = useAuth();

  const isAdmin = String(loc.pathname || "").startsWith("/admin");
  const isAccountPage = String(loc.pathname || "") === "/account";
  const userEmail = String(user?.email ?? "").trim();

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
    flexWrap: "wrap",
  };

  const rightWrap: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
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

  const authStatusPill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 9999,
    border: user
      ? "1px solid rgba(16,185,129,0.24)"
      : "1px solid rgba(0,0,0,0.10)",
    background: user ? "rgba(236,253,245,0.92)" : "rgba(255,255,255,0.90)",
    color: user ? "rgba(6,95,70,0.92)" : "rgba(0,0,0,0.62)",
    fontWeight: 900,
    fontSize: 13,
    lineHeight: 1,
    maxWidth: 300,
    pointerEvents: "auto",
  };

  const statusDot: React.CSSProperties = {
    width: 9,
    height: 9,
    borderRadius: 9999,
    background: user ? "rgb(16,185,129)" : "rgba(0,0,0,0.30)",
    flex: "0 0 auto",
  };

  const authEmail: React.CSSProperties = {
    display: "inline-block",
    maxWidth: 160,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: 800,
    fontSize: 12,
    opacity: 0.82,
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

  const onSignOut = async () => {
    try {
      await signOut();
    } finally {
      nav("/signin", { replace: true });
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

              <div style={rightWrap}>
                {isLoading ? (
                  <div style={authStatusPill} aria-live="polite">
                    <span style={statusDot} />
                    <span>Checking sign-in...</span>
                  </div>
                ) : user ? (
                  <>
                    <div
                      style={authStatusPill}
                      aria-label={userEmail ? `Signed in as ${userEmail}` : "Signed in"}
                      title={userEmail || "Signed in"}
                    >
                      <span style={statusDot} />
                      <span>Signed in</span>
                      {userEmail ? (
                        <span style={authEmail}>{userEmail}</span>
                      ) : null}
                    </div>

                    {!isAccountPage ? (
                      <Link to="/account" style={navBtn} aria-label="Account">
                        Account
                      </Link>
                    ) : null}

                    <button
                      type="button"
                      style={navBtn}
                      onClick={onSignOut}
                      aria-label="Sign out"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link to="/signin" style={navBtn} aria-label="Sign in">
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div style={contentFrame}>
            <Suspense fallback={<RouteFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
}

function RoomRoomRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

function RoomIndexRedirect() {
  return <Navigate to="/rooms" replace />;
}

function RoomsRoomRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

function RedeemRedirect() {
  return <Navigate to="/pricing" replace />;
}

function AuthRedirect() {
  const location = useLocation();
  const target = `/signin${location.search || ""}${location.hash || ""}`;
  return <Navigate to={target} replace />;
}

function BillingRedirect() {
  return <Navigate to="/account" replace />;
}

function AdminShell() {
  return (
    <AdminRoute>
      <AdminLayout>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </AdminLayout>
    </AdminRoute>
  );
}

function MercyHostRouteShell() {
  return (
    <>
      <Outlet />
      <Suspense fallback={null}>
        <MercyAIHost />
      </Suspense>
    </>
  );
}

function RouterBeacon() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.MB_ROUTER_VERSION = MB_ROUTER_VERSION;
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
  }, []);

  return null;
}

export default function AppRouter() {
  console.log("MB_ROUTER_VERSION", MB_ROUTER_VERSION);

  return (
    <>
      <RouterBeacon />

      <Routes>
        <Route
          path="/signin"
          element={
            <LazyPage>
              <LoginPage />
            </LazyPage>
          }
        />
        <Route path="/auth" element={<AuthRedirect />} />

        <Route element={<AppHeroShell />}>
          <Route
            path="/"
            element={
              <LazyPage>
                <Home />
              </LazyPage>
            }
          />

          <Route
            path="/pricing"
            element={
              <LazyPage>
                <Pricing />
              </LazyPage>
            }
          />

          <Route
            path="/upgrade"
            element={
              <LazyPage>
                <Pricing />
              </LazyPage>
            }
          />

          <Route
            path="/account"
            element={
              <LazyPage>
                <AccountPage />
              </LazyPage>
            }
          />

          <Route
            path="/billing"
            element={
              <LazyPage>
                <BillingRedirect />
              </LazyPage>
            }
          />

          <Route
            path="/billing/success"
            element={
              <LazyPage>
                <BillingSuccessPage />
              </LazyPage>
            }
          />

          <Route
            path="/rooms"
            element={
              <LazyPage>
                <AllRooms />
              </LazyPage>
            }
          />

          <Route
            path="/tiers"
            element={
              <LazyPage>
                <TierIndex />
              </LazyPage>
            }
          />

          <Route
            path="/tiers/:tierId"
            element={
              <LazyPage>
                <TierDetail />
              </LazyPage>
            }
          />

          <Route path="/redeem" element={<RedeemRedirect />} />

          <Route path="/room/room/:roomId" element={<RoomRoomRedirect />} />
          <Route path="/room" element={<RoomIndexRedirect />} />
          <Route path="/rooms/room/:roomId" element={<RoomsRoomRedirect />} />

          <Route element={<MercyHostRouteShell />}>
            <Route
              path="/room/:roomId"
              element={
                <LazyPage>
                  <ChatHub />
                </LazyPage>
              }
            />
          </Route>

          <Route path="/admin/*" element={<AdminShell />}>
            <Route
              index
              element={
                <LazyPage>
                  <AdminDashboard />
                </LazyPage>
              }
            />
            <Route
              path="payments"
              element={
                <LazyPage>
                  <AdminPayments />
                </LazyPage>
              }
            />
            <Route
              path="bank-transfers"
              element={
                <LazyPage>
                  <AdminBankTransfers />
                </LazyPage>
              }
            />
            <Route
              path="payment-verification"
              element={
                <LazyPage>
                  <AdminPaymentVerification />
                </LazyPage>
              }
            />
            <Route
              path="access-codes"
              element={
                <LazyPage>
                  <AdminAccessCodes />
                </LazyPage>
              }
            />
            <Route
              path="audio-coverage"
              element={
                <LazyPage>
                  <AudioCoveragePage />
                </LazyPage>
              }
            />
            <Route
              path="monitoring"
              element={
                <LazyPage>
                  <AdminMonitoring />
                </LazyPage>
              }
            />
            <Route
              path="metrics"
              element={
                <LazyPage>
                  <AdminMetrics />
                </LazyPage>
              }
            />
            <Route
              path="vip-rooms"
              element={
                <LazyPage>
                  <AdminVIPRooms />
                </LazyPage>
              }
            />
            <Route
              path="*"
              element={
                <LazyPage>
                  <AdminDashboard />
                </LazyPage>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}