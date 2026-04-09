// src/router/AppRouter.tsx

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

const MB_ROUTER_VERSION =
  "2026-04-09-app-router-admin-users-route-enabled";

const ChatHub = lazy(() => import("@/pages/ChatHub"));
const AllRooms = lazy(() => import("@/pages/AllRooms"));
const Home = lazy(() => import("@/pages/Home"));
const Privacy = lazy(() => import("@/pages/Privacy"));

const AccountPage = lazy(() => import("@/pages/AccountPage"));
const BillingPage = lazy(() => import("@/pages/Billing"));
const BillingSuccessPage = lazy(() => import("@/pages/BillingSuccessPage"));
const Pricing = lazy(() => import("../screens/Pricing"));

const TierIndex = lazy(() => import("@/pages/TierIndex"));
const TierDetail = lazy(() => import("@/pages/TierDetail"));

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminPayments = lazy(() => import("@/pages/admin/AdminPayments"));
const AdminBankTransfers = lazy(() => import("@/pages/admin/AdminBankTransfers"));
const AdminPaymentVerification = lazy(
  () => import("@/pages/admin/AdminPaymentVerification"),
);
const AdminAccessCodes = lazy(() => import("@/pages/admin/AdminAccessCodes"));
const AudioCoveragePage = lazy(() => import("@/pages/admin/AudioCoveragePage"));
const AdminMonitoring = lazy(() => import("@/pages/admin/AdminMonitoring"));
const AdminMetrics = lazy(() => import("@/pages/admin/AdminMetrics"));
const AdminVIPRooms = lazy(() => import("@/pages/admin/AdminVIPRooms"));
const AdminSubscriptions = lazy(
  () => import("@/pages/admin/AdminSubscriptions"),
);
const AdminBillingDashboard = lazy(
  () => import("@/pages/admin/AdminBillingDashboard"),
);

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
  const { user, isLoading } = useAuth();

  const pathname = String(loc.pathname || "");
  const isAdmin = pathname.startsWith("/admin");
  const userEmail = String(user?.email ?? "").trim();

  const PAGE_MAX = 980;
  const FRAME_PAD_X = 16;
  const FRAME_MAX = PAGE_MAX;

  const shell: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    zIndex: 999999,
    pointerEvents: "auto",
  };

  const band: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 999999,
    pointerEvents: "auto",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  };

  const bandInner: React.CSSProperties = {
    maxWidth: FRAME_MAX,
    margin: "0 auto",
    padding: `4px ${FRAME_PAD_X}px 0`,
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 12,
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
    padding: "8px 14px",
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
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.90)",
    color: "rgba(0,0,0,0.62)",
    fontWeight: 900,
    fontSize: 13,
    lineHeight: 1,
    pointerEvents: "auto",
  };

  const statusDot: React.CSSProperties = {
    width: 9,
    height: 9,
    borderRadius: 9999,
    background: user ? "rgb(16,185,129)" : "rgba(0,0,0,0.30)",
    flex: "0 0 auto",
  };

  const brand: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    justifySelf: "center",
    lineHeight: 0,
    textDecoration: "none",
    minHeight: 44,
    padding: 0,
  };

  const brandImg: React.CSSProperties = {
    display: "block",
    width: "auto",
    height: "44px",
    maxHeight: "44px",
    maxWidth: "none",
    objectFit: "contain",
    objectPosition: "center",
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.08))",
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
                {pathname !== "/" && (
                  <Link to="/" style={navBtn} aria-label="Go Home">
                    ⌂ Home
                  </Link>
                )}
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

              <Link
                to="/"
                style={brand}
                title="Mercy Blade"
                aria-label="Mercy Blade"
              >
                <img
                  src="/brand/mercy-blade-header.png"
                  alt="Mercy Blade"
                  style={brandImg}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </Link>

              <div style={rightWrap}>
                {isLoading ? (
                  <div style={authStatusPill} aria-live="polite">
                    <span style={statusDot} />
                    <span>Checking...</span>
                  </div>
                ) : user ? (
                  <Link
                    to="/account"
                    style={navBtn}
                    aria-label="Account"
                    title={userEmail || "Account"}
                  >
                    Account
                  </Link>
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

function RouterBeacon() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.MB_ROUTER_VERSION = MB_ROUTER_VERSION;
      }
      if (typeof document !== "undefined" && document.documentElement) {
        document.documentElement.setAttribute(
          "data-mb-router-version",
          MB_ROUTER_VERSION,
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

        <Route
          path="/reset-password"
          element={
            <LazyPage>
              <ResetPasswordPage />
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
            path="/privacy"
            element={
              <LazyPage>
                <Privacy />
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
                <BillingPage />
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

          <Route
            path="/room/:roomId"
            element={
              <LazyPage>
                <ChatHub />
              </LazyPage>
            }
          />

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
              path="users"
              element={
                <LazyPage>
                  <AdminUsersPage />
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
              path="subscriptions"
              element={
                <LazyPage>
                  <AdminSubscriptions />
                </LazyPage>
              }
            />
            <Route
              path="billing"
              element={
                <LazyPage>
                  <AdminBillingDashboard />
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