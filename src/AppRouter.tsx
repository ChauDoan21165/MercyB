// src/AppRouter.tsx
// MB-BLUE-100.8 — 2025-12-31 (+0700)
//
// ROUTING RULES (LOCKED):
// - Canonical room route: /room/:roomId
// - Legacy/bad routes are redirected silently
// - /room (no id) must NOT show NotFound
// - No resolver logic here
//
// FIX (100.8):
// - Wire /admin + known /admin/* routes to existing admin pages.
// - Use the Lovable admin dashboard as the main /admin landing (largest, fully featured).
// - Guard admin pages with AdminRoute (fail-closed).

import { Routes, Route, Navigate, useParams } from "react-router-dom";

import ChatHub from "@/pages/ChatHub";
import AllRooms from "@/pages/AllRooms";
import NotFound from "@/_legacy_next_pages/NotFound";

// ✅ Admin guard (already in repo)
import { AdminRoute } from "@/components/admin/AdminRoute";

/**
 * NEW ADMIN PAGES (src/pages/admin)
 * (small set)
 */
import AdminPayments_New from "@/pages/admin/AdminPayments";
import AdminBankTransfers_New from "@/pages/admin/AdminBankTransfers";
import AdminPaymentVerification_New from "@/pages/admin/AdminPaymentVerification";
import AdminAccessCodes_New from "@/pages/admin/AdminAccessCodes";
import AudioCoveragePage_New from "@/pages/admin/AudioCoveragePage";

/**
 * LOVABLE / LEGACY ADMIN PAGES (src/_legacy_next_pages/admin)
 * (full control board)
 */
import AdminDashboard_Legacy from "@/_legacy_next_pages/admin/AdminDashboard";
import AIUsage_Legacy from "@/_legacy_next_pages/admin/AIUsage";
import AdminAudioBatch_Legacy from "@/_legacy_next_pages/admin/AdminAudioBatch";
import AdminTtsGenerator_Legacy from "@/_legacy_next_pages/admin/AdminTtsGenerator";
import AdminWarmthAudio_Legacy from "@/_legacy_next_pages/admin/AdminWarmthAudio";
import AppMetrics_Legacy from "@/_legacy_next_pages/admin/AppMetrics";
import AudioAssetAuditor_Legacy from "@/_legacy_next_pages/admin/AudioAssetAuditor";
import AudioAutopilot_Legacy from "@/_legacy_next_pages/admin/AudioAutopilot";
import AudioCoverage_Legacy from "@/_legacy_next_pages/admin/AudioCoverage";
import AudioCrystal_Legacy from "@/_legacy_next_pages/admin/AudioCrystal";
import AuditLog_Legacy from "@/_legacy_next_pages/admin/AuditLog";
import CodeViewer_Legacy from "@/_legacy_next_pages/admin/CodeViewer";
import ContentQualityDashboard_Legacy from "@/_legacy_next_pages/admin/ContentQualityDashboard";
import EdgeFunctions_Legacy from "@/_legacy_next_pages/admin/EdgeFunctions";
import EntriesWithoutAudioPage_Legacy from "@/_legacy_next_pages/admin/EntriesWithoutAudioPage";
import FastAudioScannerPage_Legacy from "@/_legacy_next_pages/admin/FastAudioScannerPage";
import FeatureFlags_Legacy from "@/_legacy_next_pages/admin/FeatureFlags";
import FeedbackInbox_Legacy from "@/_legacy_next_pages/admin/FeedbackInbox";
import HealthDashboard_Legacy from "@/_legacy_next_pages/admin/HealthDashboard";
import HomepageMusicController_Legacy from "@/_legacy_next_pages/admin/HomepageMusicController";
import LaunchSimulationDashboard_Legacy from "@/_legacy_next_pages/admin/LaunchSimulationDashboard";
import MercyDiagnosticsPage_Legacy from "@/_legacy_next_pages/admin/MercyDiagnosticsPage";
import MusicApproval_Legacy from "@/_legacy_next_pages/admin/MusicApproval";
import MusicManager_Legacy from "@/_legacy_next_pages/admin/MusicManager";
import PaymentMonitoring_Legacy from "@/_legacy_next_pages/admin/PaymentMonitoring";
import RoomAnalytics_Legacy from "@/_legacy_next_pages/admin/RoomAnalytics";
import RoomCoverage_Legacy from "@/_legacy_next_pages/admin/RoomCoverage";
import RoomHealthCheck_Legacy from "@/_legacy_next_pages/admin/RoomHealthCheck";
import RoomHealthCheckV2_Legacy from "@/_legacy_next_pages/admin/RoomHealthCheckV2";
import RoomHealthDashboard_Legacy from "@/_legacy_next_pages/admin/RoomHealthDashboard";
import RoomMasterDashboard_Legacy from "@/_legacy_next_pages/admin/RoomMasterDashboard";
import RoomSpecification_Legacy from "@/_legacy_next_pages/admin/RoomSpecification";
import SecurityMonitor_Legacy from "@/_legacy_next_pages/admin/SecurityMonitor";
import SystemCodeFiles_Legacy from "@/_legacy_next_pages/admin/SystemCodeFiles";
import SystemHealth_Legacy from "@/_legacy_next_pages/admin/SystemHealth";
import SystemHealthLive_Legacy from "@/_legacy_next_pages/admin/SystemHealthLive";
import SystemLogs_Legacy from "@/_legacy_next_pages/admin/SystemLogs";
import TestEmail_Legacy from "@/_legacy_next_pages/admin/TestEmail";
import UnifiedHealthCheck_Legacy from "@/_legacy_next_pages/admin/UnifiedHealthCheck";
import UnifiedRoomHealthCheck_Legacy from "@/_legacy_next_pages/admin/UnifiedRoomHealthCheck";
import UserSupportConsole_Legacy from "@/_legacy_next_pages/admin/UserSupportConsole";
import TierInspector_Legacy from "@/_legacy_next_pages/admin/tier-inspector";

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
 * (Important: must not render NotFound)
 */
function RoomIndexRedirect() {
  return <Navigate to="/" replace />;
}

function Guarded({ children }: { children: JSX.Element }) {
  return <AdminRoute>{children}</AdminRoute>;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Main landing */}
      <Route path="/" element={<AllRooms />} />

      {/* ✅ Admin landing (Lovable full dashboard) */}
      <Route path="/admin" element={<Guarded><AdminDashboard_Legacy /></Guarded>} />

      {/* ✅ Admin routes (Lovable / legacy set) */}
      <Route path="/admin/ai-usage" element={<Guarded><AIUsage_Legacy /></Guarded>} />
      <Route path="/admin/app-metrics" element={<Guarded><AppMetrics_Legacy /></Guarded>} />
      <Route path="/admin/edge-functions" element={<Guarded><EdgeFunctions_Legacy /></Guarded>} />
      <Route path="/admin/feature-flags" element={<Guarded><FeatureFlags_Legacy /></Guarded>} />

      <Route path="/admin/audio-batch" element={<Guarded><AdminAudioBatch_Legacy /></Guarded>} />
      <Route path="/admin/tts" element={<Guarded><AdminTtsGenerator_Legacy /></Guarded>} />
      <Route path="/admin/warmth-audio" element={<Guarded><AdminWarmthAudio_Legacy /></Guarded>} />

      <Route path="/admin/audio-asset-auditor" element={<Guarded><AudioAssetAuditor_Legacy /></Guarded>} />
      <Route path="/admin/audio-autopilot" element={<Guarded><AudioAutopilot_Legacy /></Guarded>} />
      <Route path="/admin/audio-coverage" element={<Guarded><AudioCoverage_Legacy /></Guarded>} />
      <Route path="/admin/audio-crystal" element={<Guarded><AudioCrystal_Legacy /></Guarded>} />
      <Route path="/admin/audio-scanner" element={<Guarded><FastAudioScannerPage_Legacy /></Guarded>} />
      <Route path="/admin/missing-audio" element={<Guarded><EntriesWithoutAudioPage_Legacy /></Guarded>} />

      <Route path="/admin/audit-log" element={<Guarded><AuditLog_Legacy /></Guarded>} />
      <Route path="/admin/code-viewer" element={<Guarded><CodeViewer_Legacy /></Guarded>} />

      <Route path="/admin/feedback" element={<Guarded><FeedbackInbox_Legacy /></Guarded>} />
      <Route path="/admin/health" element={<Guarded><HealthDashboard_Legacy /></Guarded>} />
      <Route path="/admin/unified-health" element={<Guarded><UnifiedHealthCheck_Legacy /></Guarded>} />
      <Route path="/admin/unified-room-health" element={<Guarded><UnifiedRoomHealthCheck_Legacy /></Guarded>} />

      <Route path="/admin/room-analytics" element={<Guarded><RoomAnalytics_Legacy /></Guarded>} />
      <Route path="/admin/room-coverage" element={<Guarded><RoomCoverage_Legacy /></Guarded>} />
      <Route path="/admin/room-health" element={<Guarded><RoomHealthCheck_Legacy /></Guarded>} />
      <Route path="/admin/room-health-v2" element={<Guarded><RoomHealthCheckV2_Legacy /></Guarded>} />
      <Route path="/admin/room-health-dashboard" element={<Guarded><RoomHealthDashboard_Legacy /></Guarded>} />
      <Route path="/admin/room-master-dashboard" element={<Guarded><RoomMasterDashboard_Legacy /></Guarded>} />
      <Route path="/admin/room-specification" element={<Guarded><RoomSpecification_Legacy /></Guarded>} />

      <Route path="/admin/homepage-music" element={<Guarded><HomepageMusicController_Legacy /></Guarded>} />
      <Route path="/admin/music-approval" element={<Guarded><MusicApproval_Legacy /></Guarded>} />
      <Route path="/admin/music-manager" element={<Guarded><MusicManager_Legacy /></Guarded>} />

      <Route path="/admin/payment-monitoring" element={<Guarded><PaymentMonitoring_Legacy /></Guarded>} />
      <Route path="/admin/security" element={<Guarded><SecurityMonitor_Legacy /></Guarded>} />

      <Route path="/admin/system-codes" element={<Guarded><SystemCodeFiles_Legacy /></Guarded>} />
      <Route path="/admin/system-health" element={<Guarded><SystemHealth_Legacy /></Guarded>} />
      <Route path="/admin/system-health-live" element={<Guarded><SystemHealthLive_Legacy /></Guarded>} />
      <Route path="/admin/logs" element={<Guarded><SystemLogs_Legacy /></Guarded>} />

      <Route path="/admin/test-email" element={<Guarded><TestEmail_Legacy /></Guarded>} />
      <Route path="/admin/launch-sim" element={<Guarded><LaunchSimulationDashboard_Legacy /></Guarded>} />
      <Route path="/admin/diagnostics" element={<Guarded><MercyDiagnosticsPage_Legacy /></Guarded>} />
      <Route path="/admin/content-quality" element={<Guarded><ContentQualityDashboard_Legacy /></Guarded>} />
      <Route path="/admin/user-support" element={<Guarded><UserSupportConsole_Legacy /></Guarded>} />
      <Route path="/admin/tier-inspector" element={<Guarded><TierInspector_Legacy /></Guarded>} />

      {/* ✅ New admin pages (optional, still reachable) */}
      <Route path="/admin/payments" element={<Guarded><AdminPayments_New /></Guarded>} />
      <Route path="/admin/bank-transfers" element={<Guarded><AdminBankTransfers_New /></Guarded>} />
      <Route path="/admin/payment-verification" element={<Guarded><AdminPaymentVerification_New /></Guarded>} />
      <Route path="/admin/access-codes" element={<Guarded><AdminAccessCodes_New /></Guarded>} />
      <Route path="/admin/audio-coverage-v2" element={<Guarded><AudioCoveragePage_New /></Guarded>} />

      {/* 🔁 Legacy fixes (explicit, silent) */}
      <Route path="/room/room/:roomId" element={<RoomRoomRedirect />} />
      <Route path="/room/" element={<RoomIndexRedirect />} />
      <Route path="/room" element={<RoomIndexRedirect />} />

      {/* ✅ Canonical room route */}
      <Route path="/room/:roomId" element={<ChatHub />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
