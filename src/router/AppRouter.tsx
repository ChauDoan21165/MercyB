// src/router/AppRouter.tsx
// MercyBlade Blue — ROUTES (Single Source of Truth)
// File: src/router/AppRouter.tsx
// Version: MB-BLUE-94.15.1 — 2025-12-26 (+0700)
//
// LOCKED:
// - main.tsx owns <BrowserRouter> exactly once
// - App.tsx is providers-only
// - ALL routes live here
//
// FIX (94.15.1):
// - Add "/login" alias -> Auth (so /login never 404 again)
// - Keep "/all-rooms" alias -> RoomGrid
// - Module-level proof: window.__MB_ROUTER_VERSION__

import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { AdminRoute } from "@/components/admin/AdminRoute";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

// ✅ ALWAYS visible
import AdminFloatingButton from "@/components/AdminFloatingButton";

// ✅ Onboarding
import { OnboardingIntro } from "@/components/mercy";

// ✅ Current app page (not legacy)
import AudioCoveragePage from "@/pages/admin/AudioCoveragePage";

// Critical pages (small bundles)
import Homepage from "@/_legacy_next_pages/Home";
import NotFound from "@/_legacy_next_pages/NotFound";

// ✅ IMPORTANT: Auth + ResetPassword NON-LAZY
import Auth from "@/_legacy_next_pages/Auth";
import ResetPassword from "@/_legacy_next_pages/ResetPassword";

// ✅ Public/user pages (lazy OK)
const Tiers = lazy(() => import("@/_legacy_next_pages/Tiers"));
const RoomGrid = lazy(() => import("@/_legacy_next_pages/RoomGrid"));
const JoinCode = lazy(() => import("@/_legacy_next_pages/JoinCode"));
const RedeemGiftCode = lazy(() => import("@/_legacy_next_pages/RedeemGiftCode"));
const PromoCode = lazy(() => import("@/_legacy_next_pages/PromoCode"));
const Settings = lazy(() => import("@/_legacy_next_pages/Settings"));
const Terms = lazy(() => import("@/_legacy_next_pages/Terms"));
const Privacy = lazy(() => import("@/_legacy_next_pages/Privacy"));
const Refund = lazy(() => import("@/_legacy_next_pages/Refund"));

// ✅ CANONICAL ChatHub (current)
const ChatHub = lazy(() => import("@/pages/ChatHub"));

// ✅ Logout
const Logout = lazy(() => import("@/pages/Logout"));

// Admin core pages
const AdminDashboard = lazy(() => import("@/_legacy_next_pages/AdminDashboard"));
const AdminPayments = lazy(() => import("@/_legacy_next_pages/AdminPayments"));
const AdminBankTransfers = lazy(() => import("@/_legacy_next_pages/AdminBankTransfers"));
const AdminPaymentVerification = lazy(
  () => import("@/_legacy_next_pages/AdminPaymentVerification")
);

// Admin feature pages
const AdminVIPRooms = lazy(() => import("@/_legacy_next_pages/AdminVIPRooms"));
const AdminDesignAudit = lazy(() => import("@/_legacy_next_pages/AdminDesignAudit"));
const AppMetrics = lazy(() => import("@/_legacy_next_pages/admin/AppMetrics"));
const AdminReports = lazy(() => import("@/_legacy_next_pages/AdminReports"));
const FeedbackInbox = lazy(() => import("@/_legacy_next_pages/admin/FeedbackInbox"));
const AdminStats = lazy(() => import("@/_legacy_next_pages/AdminStats"));
const ContentQualityDashboard = lazy(
  () => import("@/_legacy_next_pages/admin/ContentQualityDashboard")
);
const LaunchSimulationDashboard = lazy(
  () => import("@/_legacy_next_pages/admin/LaunchSimulationDashboard")
);
const AdminSystemMetrics = lazy(() => import("@/_legacy_next_pages/AdminSystemMetrics"));
const PaymentMonitoring = lazy(() => import("@/_legacy_next_pages/admin/PaymentMonitoring"));
const AdminAudioUpload = lazy(() => import("@/_legacy_next_pages/AdminAudioUpload"));
const AdminModeration = lazy(() => import("@/_legacy_next_pages/AdminModeration"));
const AdminRooms = lazy(() => import("@/_legacy_next_pages/AdminRooms"));
const AdminRoomEditor = lazy(() => import("@/_legacy_next_pages/AdminRoomEditor"));
const AdminRoomImport = lazy(() => import("@/_legacy_next_pages/AdminRoomImport"));
const AdminUserRoles = lazy(() => import("@/_legacy_next_pages/AdminUserRoles"));
const AdminCodeEditor = lazy(() => import("@/_legacy_next_pages/AdminCodeEditor"));
const AdminFeedbackAnalytics = lazy(
  () => import("@/_legacy_next_pages/AdminFeedbackAnalytics")
);
const AdminUsers = lazy(() => import("@/_legacy_next_pages/AdminUsers"));
const AdminUserDetail = lazy(() => import("@/_legacy_next_pages/AdminUserDetail"));
const AdminSecurity = lazy(() => import("@/_legacy_next_pages/AdminSecurity"));
const AuditLog = lazy(() => import("@/_legacy_next_pages/admin/AuditLog"));
const AIUsage = lazy(() => import("@/_legacy_next_pages/admin/AIUsage"));
const AdminGiftCodes = lazy(() => import("@/_legacy_next_pages/AdminGiftCodes"));
const AdminManageAdmins = lazy(() => import("@/_legacy_next_pages/AdminManageAdmins"));
const AdminSpecification = lazy(() => import("@/_legacy_next_pages/AdminSpecification"));
const HealthDashboard = lazy(() => import("@/_legacy_next_pages/admin/HealthDashboard"));
const RoomHealthDashboard = lazy(() => import("@/_legacy_next_pages/admin/RoomHealthDashboard"));
const UnifiedRoomHealthCheck = lazy(
  () => import("@/_legacy_next_pages/admin/UnifiedRoomHealthCheck")
);
const SystemHealth = lazy(() => import("@/_legacy_next_pages/admin/SystemHealth"));
const SystemHealthLive = lazy(() => import("@/_legacy_next_pages/admin/SystemHealthLive"));
const EdgeFunctions = lazy(() => import("@/_legacy_next_pages/admin/EdgeFunctions"));
const RoomSpecification = lazy(() => import("@/_legacy_next_pages/admin/RoomSpecification"));
const MusicApproval = lazy(() => import("@/_legacy_next_pages/admin/MusicApproval"));
const MusicManager = lazy(() => import("@/_legacy_next_pages/admin/MusicManager"));
const FeatureFlags = lazy(() => import("@/_legacy_next_pages/admin/FeatureFlags"));
const SystemLogs = lazy(() => import("@/_legacy_next_pages/admin/SystemLogs"));
const CodeViewer = lazy(() => import("@/_legacy_next_pages/admin/CodeViewer"));
const TestEmail = lazy(() => import("@/_legacy_next_pages/admin/TestEmail"));

const guard = (element: JSX.Element) => <AdminRoute>{element}</AdminRoute>;

// 🔥 Module-level proof (runs immediately when router module is imported)
console.log("🔥 AppRouter MODULE LOADED: MB-BLUE-94.15.1");
(window as any).__MB_ROUTER_VERSION__ = "MB-BLUE-94.15.1";

export default function AppRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Supabase recovery links sometimes land on "/#access_token=..."
  useEffect(() => {
    const rawHash = window.location.hash || "";
    if (!rawHash) return;

    const params = new URLSearchParams(rawHash.replace(/^#/, ""));
    const isRecovery =
      params.get("type") === "recovery" &&
      params.get("access_token") &&
      params.get("refresh_token");

    if (!isRecovery) return;

    if (location.pathname !== "/reset-password" && location.pathname !== "/reset") {
      navigate(`/reset-password${rawHash}`, { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <AdminFloatingButton />

      <Suspense fallback={<LoadingSkeleton variant="page" />}>
        <Routes>
          <Route path="/" element={<Homepage />} />

          {/* ✅ AUTH (canonical + aliases) */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />

          <Route path="/onboarding" element={<OnboardingIntro />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/tiers" element={<Tiers />} />

          {/* ✅ canonical room list */}
          <Route path="/rooms" element={<RoomGrid />} />
          {/* ✅ legacy/dev alias */}
          <Route path="/all-rooms" element={<RoomGrid />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />

          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset" element={<ResetPassword />} />

          <Route path="/room/:roomId" element={<ChatHub />} />
          <Route path="/join/:code" element={<JoinCode />} />
          <Route path="/redeem/:code" element={<RedeemGiftCode />} />
          <Route path="/promo" element={<PromoCode />} />

          <Route path="/admin" element={guard(<AdminDashboard />)} />
          <Route path="/admin/payments" element={guard(<AdminPayments />)} />
          <Route path="/admin/bank-transfers" element={guard(<AdminBankTransfers />)} />
          <Route
            path="/admin/payment-verification"
            element={guard(<AdminPaymentVerification />)}
          />
          <Route path="/admin/payment-monitoring" element={guard(<PaymentMonitoring />)} />
          <Route path="/admin/users" element={guard(<AdminUsers />)} />
          <Route path="/admin/users/:userId" element={guard(<AdminUserDetail />)} />
          <Route path="/admin/user-roles" element={guard(<AdminUserRoles />)} />
          <Route path="/admin/manage-admins" element={guard(<AdminManageAdmins />)} />

          <Route path="/admin/rooms" element={guard(<AdminRooms />)} />
          <Route path="/admin/room-editor" element={guard(<AdminRoomEditor />)} />
          <Route path="/admin/room-import" element={guard(<AdminRoomImport />)} />
          <Route path="/admin/vip-rooms" element={guard(<AdminVIPRooms />)} />
          <Route path="/admin/design-audit" element={guard(<AdminDesignAudit />)} />
          <Route path="/admin/content-quality" element={guard(<ContentQualityDashboard />)} />
          <Route
            path="/admin/launch-simulation"
            element={guard(<LaunchSimulationDashboard />)}
          />
          <Route path="/admin/room-specification" element={guard(<RoomSpecification />)} />
          <Route path="/admin/specification" element={guard(<AdminSpecification />)} />

          <Route path="/admin/health" element={guard(<UnifiedRoomHealthCheck />)} />
          <Route path="/admin/health-dashboard" element={guard(<HealthDashboard />)} />
          <Route path="/admin/room-health-dashboard" element={guard(<RoomHealthDashboard />)} />
          <Route path="/admin/system-health" element={guard(<SystemHealth />)} />
          <Route path="/admin/system-health-live" element={guard(<SystemHealthLive />)} />
          <Route path="/admin/system-metrics" element={guard(<AdminSystemMetrics />)} />
          <Route path="/admin/app-metrics" element={guard(<AppMetrics />)} />
          <Route path="/admin/stats" element={guard(<AdminStats />)} />
          <Route path="/admin/logs" element={guard(<SystemLogs />)} />

          <Route path="/admin/moderation" element={guard(<AdminModeration />)} />
          <Route path="/admin/security" element={guard(<AdminSecurity />)} />

          <Route path="/admin/reports" element={guard(<AdminReports />)} />
          <Route path="/admin/feedback" element={guard(<FeedbackInbox />)} />
          <Route
            path="/admin/feedback-analytics"
            element={guard(<AdminFeedbackAnalytics />)}
          />

          <Route path="/admin/audio-upload" element={guard(<AdminAudioUpload />)} />
          <Route path="/admin/audio-coverage" element={guard(<AudioCoveragePage />)} />

          <Route path="/admin/music-approval" element={guard(<MusicApproval />)} />
          <Route path="/admin/music-manager" element={guard(<MusicManager />)} />

          <Route path="/admin/code-editor" element={guard(<AdminCodeEditor />)} />
          <Route path="/admin/code-viewer" element={guard(<CodeViewer />)} />
          <Route path="/admin/edge-functions" element={guard(<EdgeFunctions />)} />
          <Route path="/admin/feature-flags" element={guard(<FeatureFlags />)} />
          <Route path="/admin/ai-usage" element={guard(<AIUsage />)} />
          <Route path="/admin/audit-log" element={guard(<AuditLog />)} />
          <Route path="/admin/test-email" element={guard(<TestEmail />)} />

          <Route path="/security-dashboard" element={<Navigate to="/admin/security" replace />} />
          <Route path="/vip-requests" element={<Navigate to="/admin" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
