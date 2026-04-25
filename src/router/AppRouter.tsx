/**
 * Path: src/router/AppRouter.tsx
 * File: AppRouter.tsx
 */

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
import { useUserAccess } from "@/hooks/useUserAccess";
import TrialExpiredScreen from "@/components/TrialExpiredScreen";

const MB_ROUTER_VERSION = "2026-04-11-app-router-room-alias-hardening";

const ChatHub             = lazy(() => import("@/pages/ChatHub"));
const AllRooms            = lazy(() => import("@/pages/AllRooms"));
const Home                = lazy(() => import("@/pages/Home"));
const Privacy             = lazy(() => import("@/pages/Privacy"));
const Terms                = lazy(() => import("@/pages/Terms"));
const AccountPage         = lazy(() => import("@/pages/AccountPage"));
const BillingPage         = lazy(() => import("@/pages/Billing"));
const BillingSuccessPage  = lazy(() => import("@/pages/BillingSuccessPage"));
const Pricing             = lazy(() => import("../screens/Pricing"));
const TierIndex           = lazy(() => import("@/pages/TierIndex"));
const TierDetail          = lazy(() => import("@/pages/TierDetail"));
const LoginPage           = lazy(() => import("@/pages/LoginPage"));
const ResetPasswordPage   = lazy(() => import("@/pages/ResetPasswordPage"));

const PlacementWelcomePage = lazy(() => import("@/pages/placement/WelcomePage"));
const PlacementWhoForPage  = lazy(() => import("@/pages/placement/WhoForPage"));
const PlacementTestPage    = lazy(() => import("@/pages/placement/TestPage"));
const PlacementResultsPage = lazy(() => import("@/pages/placement/ResultsPage"));

const SpeechDrillPage      = lazy(() => import("@/pages/SpeechDrillPage"));
const SpeechHistoryPage    = lazy(() => import("@/pages/speech/SpeechHistoryPage"));

// Mercy v2 — multi-turn conversation thread page (auth-required).
const MercyThreadPage      = lazy(() => import("@/pages/mercy/MercyThreadPage"));

const WritingFeedbackPage  = lazy(() => import("@/pages/writing/WritingFeedbackPage"));

// SEO landing pages — Vietnamese-keyword targeted, public, no auth required.
const SeoHocTiengAnhChoNguoiVietPage = lazy(() => import("@/pages/seo/HocTiengAnhChoNguoiVietPage"));
const SeoSuaPhatAmTiengAnhPage       = lazy(() => import("@/pages/seo/SuaPhatAmTiengAnhPage"));
const SeoLoiTiengAnhNguoiVietPage    = lazy(() => import("@/pages/seo/LoiTiengAnhNguoiVietHaySaiPage"));
const SeoPhongVanTiengAnhPage        = lazy(() => import("@/pages/seo/PhongVanTiengAnhPage"));
const SeoHocTiengAnhMienPhiPage      = lazy(() => import("@/pages/seo/HocTiengAnhMienPhiPage"));

const BlogIndex = lazy(() => import("@/pages/blog/BlogIndex"));
const BlogPost  = lazy(() => import("@/pages/blog/BlogPost"));

const PublicProfilePage   = lazy(() => import("@/pages/profile/PublicProfilePage"));
const ShareProgressPage   = lazy(() => import("@/pages/profile/ShareProgressPage"));

const PurchaseGiftPage    = lazy(() => import("@/pages/gift/PurchaseGiftPage"));
const RedeemGiftPage      = lazy(() => import("@/pages/gift/RedeemGiftPage"));
const MyGiftsPage         = lazy(() => import("@/pages/gift/MyGiftsPage"));

const VNCulturalIndexPage = lazy(() => import("@/pages/cultural-packs/VNCulturalIndexPage"));
const VNCulturalPackPage  = lazy(() => import("@/pages/cultural-packs/VNCulturalPackPage"));

const GroupsIndex          = lazy(() => import("@/pages/groups/GroupsIndex"));
const GroupPage            = lazy(() => import("@/pages/groups/GroupPage"));
const CreateGroupPage      = lazy(() => import("@/pages/groups/CreateGroupPage"));

const InterviewIndex         = lazy(() => import("@/pages/interview/InterviewIndex"));
const InterviewSessionPage   = lazy(() => import("@/pages/interview/InterviewSessionPage"));
const InterviewSummaryPage   = lazy(() => import("@/pages/interview/InterviewSummaryPage"));

const NailTechnicianPage     = lazy(() => import("@/pages/profession-packs/NailTechnicianPage"));

const ContributeSentencePage = lazy(() => import("@/pages/contribute/ContributeSentencePage"));
const MySubmissionsPage      = lazy(() => import("@/pages/contribute/MySubmissionsPage"));
const PendingSentencesPage   = lazy(() => import("@/pages/admin/PendingSentencesPage"));

const FamilyPlanPage         = lazy(() => import("@/pages/family/FamilyPlanPage"));

const CorporateDashboardPage = lazy(() => import("@/pages/corporate/CorporateDashboardPage"));
const CreateCorporatePage    = lazy(() => import("@/pages/corporate/CreateCorporatePage"));
const JoinCorporatePage      = lazy(() => import("@/pages/corporate/JoinCorporatePage"));

const AdminDashboard          = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsersPage          = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminPaymentsPage       = lazy(() => import("@/pages/admin/AdminPaymentsPage"));
const AdminAccessCodes        = lazy(() => import("@/pages/admin/AdminAccessCodes"));
const AudioCoveragePage       = lazy(() => import("@/pages/admin/AudioCoveragePage"));
const AdminFeedbackPage       = lazy(() => import("@/pages/admin/AdminFeedbackPage"));
const AdminSubscriptions      = lazy(() => import("@/pages/admin/AdminSubscriptions"));
const FeatureFlagsAdmin       = lazy(() => import("@/pages/admin/FeatureFlagsAdmin"));
const AdminAnalyticsPage      = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const RoomLoadDiagnostics     = lazy(() =>
  import("@/components/admin/RoomLoadDiagnostics").then((m) => ({
    default: m.RoomLoadDiagnostics,
  })),
);

// Dev-only: useAudioUrl manual test harness. Gated behind import.meta.env.DEV
// so Vite tree-shakes both the dynamic import and the route JSX in prod builds.
const DevAudioTest = import.meta.env.DEV
  ? lazy(() => import("@/pages/DevAudioTest"))
  : null;

declare global {
  interface Window { MB_ROUTER_VERSION?: string; }
}

// ── Guards ────────────────────────────────────────────────────────────────────

/**
 * Redirect unauthenticated users to /signin with a `next=` param
 * so they return to the intended page after signing in.
 * Shows nothing while auth is still loading.
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Auth is resolving — render nothing to avoid a flash of the protected page
    return null;
  }

  if (!user) {
    const next = encodeURIComponent(
      `${location.pathname}${location.search}${location.hash}`,
    );
    return <Navigate to={`/signin?next=${next}`} replace />;
  }

  return <>{children}</>;
}

/**
 * Room-level auth gate. Kids rooms stay login-free per CLAUDE.md #2
 * ("Kids mode is sacred. No login friction."). All other rooms require
 * sign-in. Kids pattern match mirrors src/pages/TierIndex.tsx.
 */
function RequireAuthForRoom({ children }: { children: React.ReactNode }) {
  const { roomId } = useParams<{ roomId: string }>();
  const id = roomId ?? "";
  const isKidsRoom =
    id.includes("_kids_l1") || id.includes("_kids_l2") || id.includes("_kids_l3");

  if (isKidsRoom) return <>{children}</>;
  return <RequireAuth>{children}</RequireAuth>;
}

/**
 * Trial-expiry gate. Renders the TrialExpiredScreen for free-tier users
 * whose 3-day trial has ended. Premium users and grandfathered users
 * (profiles.created_at before the cutoff in me-entitlement) pass through.
 * Kids rooms skip this layer entirely via RequireAuthForRoom.
 */
function RequireTrialActive({ children }: { children: React.ReactNode }) {
  const { isTrialExpired, isLoading } = useUserAccess();
  if (isLoading) return null;
  if (isTrialExpired) return <TrialExpiredScreen />;
  return <>{children}</>;
}

// ── Fallbacks ─────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div style={{ padding: 32 }}>
      <h2>404</h2>
      <p>Page not found.</p>
    </div>
  );
}

function RouteFallback() {
  return <div style={{ padding: 24, opacity: 0.72 }}>Loading…</div>;
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

// ── Redirect helpers ──────────────────────────────────────────────────────────

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

function RoomsDirectRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

function ChatAliasRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

function LoginRedirect()   { return <Navigate to="/signin" replace />; }
function RedeemRedirect()  { return <Navigate to="/account" replace />; }

function AuthRedirect() {
  const location = useLocation();
  const target = `/signin${location.search || ""}${location.hash || ""}`;
  return <Navigate to={target} replace />;
}

// ── Shell ─────────────────────────────────────────────────────────────────────

function AppHeroShell() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, isLoading } = useAuth();

  const pathname    = String(loc.pathname || "");
  const isAdmin     = pathname.startsWith("/admin");
  const userEmail   = String(user?.email ?? "").trim();
  const PAGE_MAX    = 980;
  const FRAME_PAD_X = 16;

  const shell: React.CSSProperties = {
    minHeight: "100vh", width: "100%", position: "relative",
    zIndex: 999999, pointerEvents: "auto",
    overflowX: "hidden",
  };

  const band: React.CSSProperties = {
    position: "sticky", top: 0, zIndex: 999999, pointerEvents: "auto",
    background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  };

  const bandInner: React.CSSProperties = {
    maxWidth: PAGE_MAX, margin: "0 auto",
    padding: `4px ${FRAME_PAD_X}px 2px`,
    display: "grid", gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center", gap: 12,
  };

  const leftNavWrap: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 10,
    justifyContent: "flex-start", flexWrap: "wrap",
  };

  const rightWrap: React.CSSProperties = {
    display: "flex", justifyContent: "flex-end",
    alignItems: "center", gap: 10, flexWrap: "wrap",
  };

  const navBtn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.90)", color: "rgba(0,0,0,0.78)",
    textDecoration: "none", fontWeight: 900, fontSize: 13,
    lineHeight: 1, cursor: "pointer", pointerEvents: "auto",
  };

  const authStatusPill: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 12px", borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.90)", color: "rgba(0,0,0,0.62)",
    fontWeight: 900, fontSize: 13, lineHeight: 1, pointerEvents: "auto",
  };

  const statusDot: React.CSSProperties = {
    width: 9, height: 9, borderRadius: 9999,
    background: user ? "rgb(16,185,129)" : "rgba(0,0,0,0.30)",
    flex: "0 0 auto",
  };

  const brand: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    justifySelf: "center", lineHeight: 0, textDecoration: "none",
    width: "min(190px, 46vw)", height: 56, minHeight: 56,
    padding: 0, overflow: "hidden",
  };

  const brandImg: React.CSSProperties = {
    display: "block", width: "min(250px, 62vw)", height: 84,
    maxWidth: "none", maxHeight: "none", objectFit: "contain",
    objectPosition: "center", transform: "translateY(-1px) scale(1.62)",
    transformOrigin: "center center", filter: "none",
    userSelect: "none", pointerEvents: "none",
  };

  const onBack = () => {
    try {
      if (typeof window !== "undefined" && window.history?.length <= 1) {
        nav("/");
      } else {
        nav(-1);
      }
    } catch { nav("/"); }
  };

  const contentFrame: React.CSSProperties = {
    maxWidth: PAGE_MAX, margin: "0 auto", width: "100%",
    minWidth: 0, overflowX: "hidden",
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
                  <Link to="/" style={navBtn} aria-label="Go Home">⌂ Home</Link>
                )}
                <button type="button" style={navBtn} onClick={onBack} aria-label="Go Back">
                  ← Back
                </button>
              </div>

              <Link to="/" style={brand} title="Mercy Blade" aria-label="Mercy Blade">
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
                  <Link to="/account" style={navBtn} aria-label="Account" title={userEmail || "Account"}>
                    Account
                  </Link>
                ) : (
                  <Link to="/signin" style={navBtn} aria-label="Sign in">Sign in</Link>
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

function AdminLayoutShell() {
  return (
    <AdminLayout>
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </AdminLayout>
  );
}

function RouterBeacon() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.MB_ROUTER_VERSION = MB_ROUTER_VERSION;
      }
      // Only expose router version in DOM during development
      if (import.meta.env.DEV && typeof document !== "undefined") {
        document.documentElement.setAttribute(
          "data-mb-router-version",
          MB_ROUTER_VERSION,
        );
      }
    } catch { /* ignore */ }
  }, []);
  return null;
}

// ── Router ────────────────────────────────────────────────────────────────────

export default function AppRouter() {
  return (
    <>
      <RouterBeacon />

      <Routes>
        {/* Public auth routes */}
        <Route path="/signin" element={<LazyPage><LoginPage /></LazyPage>} />
        <Route path="/login"  element={<LoginRedirect />} />

        <Route path="/reset-password"
          element={<LazyPage><ResetPasswordPage /></LazyPage>} />

        {/* /auth redirects preserve query/hash for OAuth callbacks */}
        <Route path="/auth"          element={<AuthRedirect />} />
        <Route path="/auth/callback" element={<AuthRedirect />} />

        <Route element={<AppHeroShell />}>
          {/* Public pages */}
          <Route path="/"        element={<LazyPage><Home /></LazyPage>} />
          <Route path="/privacy" element={<LazyPage><Privacy /></LazyPage>} />
          <Route path="/terms"   element={<LazyPage><Terms /></LazyPage>} />
          <Route path="/pricing" element={<LazyPage><Pricing /></LazyPage>} />
          <Route path="/upgrade" element={<LazyPage><Pricing /></LazyPage>} />
          <Route path="/rooms"   element={<LazyPage><AllRooms /></LazyPage>} />

          {/* Public blog */}
          <Route path="/blog"        element={<LazyPage><BlogIndex /></LazyPage>} />
          <Route path="/blog/:slug"  element={<LazyPage><BlogPost /></LazyPage>} />
          <Route path="/tiers"   element={<LazyPage><TierIndex /></LazyPage>} />
          <Route path="/tiers/:tierId" element={<LazyPage><TierDetail /></LazyPage>} />
          <Route path="/redeem"     element={<RedeemRedirect />} />
          <Route path="/promo-code" element={<RedeemRedirect />} />

          {/* SEO landing pages — public, Vietnamese-keyword targeted */}
          <Route path="/seo/hoc-tieng-anh-cho-nguoi-viet"
            element={<LazyPage><SeoHocTiengAnhChoNguoiVietPage /></LazyPage>} />
          <Route path="/seo/sua-phat-am-tieng-anh"
            element={<LazyPage><SeoSuaPhatAmTiengAnhPage /></LazyPage>} />
          <Route path="/seo/loi-tieng-anh-nguoi-viet-hay-sai"
            element={<LazyPage><SeoLoiTiengAnhNguoiVietPage /></LazyPage>} />
          <Route path="/seo/phong-van-tieng-anh"
            element={<LazyPage><SeoPhongVanTiengAnhPage /></LazyPage>} />
          <Route path="/seo/hoc-tieng-anh-mien-phi"
            element={<LazyPage><SeoHocTiengAnhMienPhiPage /></LazyPage>} />

          {/* Placement test — requires auth (profile writes keyed on user.id) */}
          <Route path="/placement"
            element={
              <RequireAuth>
                <LazyPage><PlacementWelcomePage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/placement/who"
            element={
              <RequireAuth>
                <LazyPage><PlacementWhoForPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/placement/test"
            element={
              <RequireAuth>
                <LazyPage><PlacementTestPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/placement/results"
            element={
              <RequireAuth>
                <LazyPage><PlacementResultsPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Speech drill — page self-gates on pronunciationScoringEnabled flag */}
          <Route path="/speak"
            element={
              <RequireAuth>
                <LazyPage><SpeechDrillPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Speech history — page self-gates on pronunciationScoringEnabled flag */}
          <Route path="/speech/history"
            element={
              <RequireAuth>
                <LazyPage><SpeechHistoryPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Mercy v2 — multi-turn conversation thread (Step 7) */}
          <Route path="/mercy"
            element={
              <RequireAuth>
                <LazyPage><MercyThreadPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Writing feedback (Step 7 / AI Teacher v2 — rule-based MVP) */}
          <Route path="/writing-feedback"
            element={
              <RequireAuth>
                <LazyPage><WritingFeedbackPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Study groups (Step 6 / Community) — auth-gated; data RLS is auth-only too */}
          <Route path="/groups"
            element={
              <RequireAuth>
                <LazyPage><GroupsIndex /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/groups/new"
            element={
              <RequireAuth>
                <LazyPage><CreateGroupPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/groups/:id"
            element={
              <RequireAuth>
                <LazyPage><GroupPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Mock interviews (Step 7 / AI Teacher v2) — auth-gated; data RLS owner-only */}
          <Route path="/interview"
            element={
              <RequireAuth>
                <LazyPage><InterviewIndex /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/interview/:slug"
            element={
              <RequireAuth>
                <LazyPage><InterviewSessionPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/interview/:slug/summary"
            element={
              <RequireAuth>
                <LazyPage><InterviewSummaryPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Profession packs (Step 10 / VN moat) — auth-gated; per-page paywall gate */}
          <Route path="/pack/nail-tech"
            element={
              <RequireAuth>
                <LazyPage><NailTechnicianPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Protected pages — redirect to /signin if not authenticated */}
          <Route path="/account"
            element={
              <RequireAuth>
                <LazyPage><AccountPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/billing"
            element={
              <RequireAuth>
                <LazyPage><BillingPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/billing/success"
            element={
              <RequireAuth>
                <LazyPage><BillingSuccessPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Public profile (anon-readable when is_public=true) */}
          <Route path="/u/:username" element={<LazyPage><PublicProfilePage /></LazyPage>} />

          {/* Share progress (auth-required — own stats) */}
          <Route path="/share/progress"
            element={
              <RequireAuth>
                <LazyPage><ShareProgressPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Gift subscriptions (Step 9) — auth-required for all three */}
          <Route path="/gift"
            element={
              <RequireAuth>
                <LazyPage><PurchaseGiftPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/gift/redeem"
            element={
              <RequireAuth>
                <LazyPage><RedeemGiftPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/gift/my"
            element={
              <RequireAuth>
                <LazyPage><MyGiftsPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* VN cultural packs (Step 10) — public, no auth needed */}
          <Route path="/culture/vn"
            element={<LazyPage><VNCulturalIndexPage /></LazyPage>}
          />
          <Route path="/culture/vn/:packId"
            element={<LazyPage><VNCulturalPackPage /></LazyPage>}
          />

          {/* Community: user-generated sentences (Step 6) */}
          <Route path="/contribute"
            element={
              <RequireAuth>
                <LazyPage><ContributeSentencePage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/contribute/my-submissions"
            element={
              <RequireAuth>
                <LazyPage><MySubmissionsPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Family plan (Step 9 monetization) */}
          <Route path="/family"
            element={
              <RequireAuth>
                <LazyPage><FamilyPlanPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Corporate / school multi-seat (Step 9) */}
          <Route path="/corporate"
            element={
              <RequireAuth>
                <LazyPage><CorporateDashboardPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/corporate/setup"
            element={
              <RequireAuth>
                <LazyPage><CreateCorporatePage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/corporate/join"
            element={
              <RequireAuth>
                <LazyPage><JoinCorporatePage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Room alias redirects */}
          <Route path="/room/room/:roomId" element={<RoomRoomRedirect />} />
          <Route path="/room"              element={<RoomIndexRedirect />} />
          <Route path="/rooms/room/:roomId" element={<RoomsRoomRedirect />} />
          <Route path="/rooms/:roomId"     element={<RoomsDirectRedirect />} />
          <Route path="/chat/:roomId"      element={<ChatAliasRedirect />} />

          <Route
            path="/room/:roomId"
            element={
              <RequireAuthForRoom>
                <RequireTrialActive>
                  <LazyPage><ChatHub /></LazyPage>
                </RequireTrialActive>
              </RequireAuthForRoom>
            }
          />

          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminRoute />}>
            <Route element={<AdminLayoutShell />}>
              <Route index element={<LazyPage><AdminDashboard /></LazyPage>} />
              <Route path="users"                element={<LazyPage><AdminUsersPage /></LazyPage>} />
              <Route path="payments"             element={<LazyPage><AdminPaymentsPage /></LazyPage>} />
              <Route path="access-codes"         element={<LazyPage><AdminAccessCodes /></LazyPage>} />
              <Route path="audio-coverage"       element={<LazyPage><AudioCoveragePage /></LazyPage>} />
              <Route path="feedback"             element={<LazyPage><AdminFeedbackPage /></LazyPage>} />
              <Route path="subscriptions"        element={<LazyPage><AdminSubscriptions /></LazyPage>} />
              <Route path="feature-flags"        element={<LazyPage><FeatureFlagsAdmin /></LazyPage>} />
              <Route path="analytics"            element={<LazyPage><AdminAnalyticsPage /></LazyPage>} />
              <Route path="pending-sentences"    element={<LazyPage><PendingSentencesPage /></LazyPage>} />
              <Route path="room-load-diagnostics" element={<LazyPage><RoomLoadDiagnostics /></LazyPage>} />
              <Route path="*" element={<LazyPage><AdminDashboard /></LazyPage>} />
            </Route>
          </Route>

          {import.meta.env.DEV && DevAudioTest ? (
            <Route path="/dev/audio-test" element={<LazyPage><DevAudioTest /></LazyPage>} />
          ) : null}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}