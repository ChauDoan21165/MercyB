/**
 * AppRouter - Lazy-loaded route definitions
 * Extracted from App.tsx to keep it minimal (providers only)
 */

import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminRoute } from "@/components/AdminRoute";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

// Critical pages - loaded immediately (small bundles)
import Welcome from "@/pages/Welcome";
import Homepage from "@/pages/Homepage";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

// All other pages - lazy loaded
const ChatHub = lazy(() => import("@/pages/ChatHub"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const KidsChat = lazy(() => import("@/pages/KidsChat"));

// VIP Tier pages
const Tiers = lazy(() => import("@/pages/Tiers"));
const RoomGrid = lazy(() => import("@/pages/RoomGrid"));
const EnglishLearningPathway = lazy(() => import("@/pages/EnglishLearningPathway"));
const RoomGridVIP1 = lazy(() => import("@/pages/RoomGridVIP1"));
const RoomGridVIP2 = lazy(() => import("@/pages/RoomGridVIP2"));
const RoomGridVIP3 = lazy(() => import("@/pages/RoomGridVIP3"));
const RoomGridVIP3II = lazy(() => import("@/pages/RoomGridVIP3II"));
const RoomGridVIP4 = lazy(() => import("@/pages/RoomGridVIP4"));
const RoomGridVIP5 = lazy(() => import("@/pages/RoomGridVIP5"));
const RoomGridVIP6 = lazy(() => import("@/pages/RoomGridVIP6"));
const RoomsVIP9 = lazy(() => import("@/pages/RoomsVIP9"));

// Kids pages
const KidsLevel1 = lazy(() => import("@/pages/KidsLevel1"));
const KidsLevel2 = lazy(() => import("@/pages/KidsLevel2"));
const KidsLevel3 = lazy(() => import("@/pages/KidsLevel3"));

// Paths pages
const PathOverview = lazy(() => import("@/pages/PathOverview"));
const PathDayPage = lazy(() => import("@/pages/PathDayPage"));
const PathCompleted = lazy(() => import("@/pages/PathCompleted"));

// Other user pages
const MeaningOfLife = lazy(() => import("@/pages/MeaningOfLife"));
const AllRooms = lazy(() => import("@/pages/AllRooms"));
const VIPRequestForm = lazy(() => import("@/pages/VIPRequestForm"));
const VIPRequests = lazy(() => import("@/pages/VIPRequests"));
const MatchmakingHub = lazy(() => import("@/pages/MatchmakingHub"));
const PaymentTest = lazy(() => import("@/pages/PaymentTest"));
const ManualPayment = lazy(() => import("@/pages/ManualPayment"));
const BankTransferPayment = lazy(() => import("@/pages/BankTransferPayment"));
const PromoCode = lazy(() => import("@/pages/PromoCode"));
const VIPTopicRequest = lazy(() => import("@/pages/VIPTopicRequest"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const SexualityCultureRoom = lazy(() => import("@/pages/SexualityCultureRoom"));
const FinanceCalmRoom = lazy(() => import("@/pages/FinanceCalmRoom"));
const AudioUpload = lazy(() => import("@/pages/AudioUpload"));
const JoinCode = lazy(() => import("@/pages/JoinCode"));
const KidsRoomValidation = lazy(() => import("@/pages/KidsRoomValidation"));
const RedeemGiftCode = lazy(() => import("@/pages/RedeemGiftCode"));
const SecurityDashboard = lazy(() => import("@/pages/SecurityDashboard"));
const Settings = lazy(() => import("@/pages/Settings"));
const UserMusicUpload = lazy(() => import("@/pages/UserMusicUpload"));
const TierMap = lazy(() => import("@/pages/TierMap"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Refund = lazy(() => import("@/pages/Refund"));

// Admin pages - all lazy loaded
const AdminVIPRooms = lazy(() => import("@/pages/AdminVIPRooms"));
const AdminDesignAudit = lazy(() => import("@/pages/AdminDesignAudit"));
const AppMetrics = lazy(() => import("@/pages/admin/AppMetrics"));
const AdminReports = lazy(() => import("@/pages/AdminReports"));
const FeedbackInbox = lazy(() => import("@/pages/admin/FeedbackInbox"));
const AdminStats = lazy(() => import("@/pages/AdminStats"));
const ContentQualityDashboard = lazy(() => import("@/pages/admin/ContentQualityDashboard"));
const LaunchSimulationDashboard = lazy(() => import("@/pages/admin/LaunchSimulationDashboard"));
const AdminSystemMetrics = lazy(() => import("@/pages/AdminSystemMetrics"));
const PaymentMonitoring = lazy(() => import("@/pages/admin/PaymentMonitoring"));
const AdminAudioUpload = lazy(() => import("@/pages/AdminAudioUpload"));
const AdminModeration = lazy(() => import("@/pages/AdminModeration"));
const AdminRooms = lazy(() => import("@/pages/AdminRooms"));
const AdminRoomEditor = lazy(() => import("@/pages/AdminRoomEditor"));
const AdminRoomImport = lazy(() => import("@/pages/AdminRoomImport"));
const AdminUserRoles = lazy(() => import("@/pages/AdminUserRoles"));
const AdminCodeEditor = lazy(() => import("@/pages/AdminCodeEditor"));
const AdminFeedbackAnalytics = lazy(() => import("@/pages/AdminFeedbackAnalytics"));
const AdminPayments = lazy(() => import("@/pages/AdminPayments"));
const AdminPaymentVerification = lazy(() => import("@/pages/AdminPaymentVerification"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminUserDetail = lazy(() => import("@/pages/AdminUserDetail"));
const AdminSecurity = lazy(() => import("@/pages/AdminSecurity"));
const AuditLog = lazy(() => import("@/pages/admin/AuditLog"));
const AIUsage = lazy(() => import("@/pages/admin/AIUsage"));
const AdminGiftCodes = lazy(() => import("@/pages/AdminGiftCodes"));
const AdminManageAdmins = lazy(() => import("@/pages/AdminManageAdmins"));
const AdminSpecification = lazy(() => import("@/pages/AdminSpecification"));
const HealthDashboard = lazy(() => import("@/pages/admin/HealthDashboard"));
const RoomHealthDashboard = lazy(() => import("@/pages/admin/RoomHealthDashboard"));
const UnifiedRoomHealthCheck = lazy(() => import("@/pages/admin/UnifiedRoomHealthCheck"));
const SystemHealth = lazy(() => import("@/pages/admin/SystemHealth"));
const SystemHealthLive = lazy(() => import("@/pages/admin/SystemHealthLive"));
const EdgeFunctions = lazy(() => import("@/pages/admin/EdgeFunctions"));
const RoomSpecification = lazy(() => import("@/pages/admin/RoomSpecification"));
const MusicApproval = lazy(() => import("@/pages/admin/MusicApproval"));
const MusicManager = lazy(() => import("@/pages/admin/MusicManager"));
const HomepageMusicController = lazy(() => import("@/pages/admin/HomepageMusicController"));
const FeatureFlags = lazy(() => import("@/pages/admin/FeatureFlags"));
const AudioAssetAuditor = lazy(() => import("@/pages/admin/AudioAssetAuditor"));
const UserSupportConsole = lazy(() => import("@/pages/admin/UserSupportConsole"));
const SystemLogs = lazy(() => import("@/pages/admin/SystemLogs"));
const FastAudioScannerPage = lazy(() => import("@/pages/admin/FastAudioScannerPage"));
const EntriesWithoutAudioPage = lazy(() => import("@/pages/admin/EntriesWithoutAudioPage"));
const AudioCoverage = lazy(() => import("@/pages/admin/AudioCoverage"));
const AudioCrystal = lazy(() => import("@/pages/admin/AudioCrystal"));
const AudioAutopilot = lazy(() => import("@/pages/admin/AudioAutopilot"));
const RoomCoverage = lazy(() => import("@/pages/admin/RoomCoverage"));
const RoomAnalytics = lazy(() => import("@/pages/admin/RoomAnalytics"));
const AuditSafeShield = lazy(() => import("@/components/admin/AuditSafeShield"));
const SystemCodeFiles = lazy(() => import("@/pages/admin/SystemCodeFiles"));
const CodeViewer = lazy(() => import("@/pages/admin/CodeViewer"));
const TestEmail = lazy(() => import("@/pages/admin/TestEmail"));
const AdminBankTransfers = lazy(() => import("@/pages/AdminBankTransfers"));

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="page" />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/tiers" element={<Tiers />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/meaning-of-life" element={<MeaningOfLife />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/join/:code" element={<JoinCode />} />
        
        {/* Room routes */}
        <Route path="/rooms" element={<RoomGrid />} />
        <Route path="/english-pathway" element={<EnglishLearningPathway />} />
        <Route path="/all-rooms" element={<AllRooms />} />
        <Route path="/room/:roomId" element={<ChatHub />} />
        
        {/* VIP tier routes */}
        <Route path="/rooms-vip1" element={<RoomGridVIP1 />} />
        <Route path="/rooms-vip2" element={<RoomGridVIP2 />} />
        <Route path="/rooms-vip3" element={<RoomGridVIP3 />} />
        <Route path="/rooms-vip3ii" element={<RoomGridVIP3II />} />
        <Route path="/rooms-vip4" element={<RoomGridVIP4 />} />
        <Route path="/rooms-vip5" element={<RoomGridVIP5 />} />
        <Route path="/rooms-vip6" element={<RoomGridVIP6 />} />
        <Route path="/rooms-vip9" element={<RoomsVIP9 />} />
        <Route path="/vip/vip1" element={<RoomGridVIP1 />} />
        <Route path="/vip/vip2" element={<RoomGridVIP2 />} />
        <Route path="/vip/vip3" element={<RoomGridVIP3 />} />
        <Route path="/vip/vip3ii" element={<RoomGridVIP3II />} />
        <Route path="/vip/vip4" element={<RoomGridVIP4 />} />
        <Route path="/vip/vip5" element={<RoomGridVIP5 />} />
        <Route path="/vip/vip6" element={<RoomGridVIP6 />} />
        <Route path="/vip/vip9" element={<RoomsVIP9 />} />
        
        {/* Paths routes */}
        <Route path="/paths/:slug" element={<PathOverview />} />
        <Route path="/paths/:slug/day/:day" element={<PathDayPage />} />
        <Route path="/paths/:slug/completed" element={<PathCompleted />} />
        
        {/* Kids routes */}
        <Route path="/kids-level1" element={<KidsLevel1 />} />
        <Route path="/kids-level2" element={<KidsLevel2 />} />
        <Route path="/kids-level3" element={<KidsLevel3 />} />
        <Route path="/kids-chat/:roomId" element={<KidsChat />} />
        
        {/* Special rooms */}
        <Route path="/sexuality-culture" element={<SexualityCultureRoom />} />
        <Route path="/SexualityCultureRoom" element={<SexualityCultureRoom />} />
        <Route path="/finance-calm" element={<FinanceCalmRoom />} />
        <Route path="/FinanceCalmRoom" element={<FinanceCalmRoom />} />
        
        {/* User features */}
        <Route path="/vip-request" element={<VIPRequestForm />} />
        <Route path="/vip-requests" element={<VIPRequests />} />
        <Route path="/matchmaking" element={<MatchmakingHub />} />
        <Route path="/subscribe" element={<PaymentTest />} />
        <Route path="/payment-test" element={<PaymentTest />} />
        <Route path="/manual-payment" element={<ManualPayment />} />
        <Route path="/bank-transfer" element={<BankTransferPayment />} />
        <Route path="/promo-code" element={<PromoCode />} />
        <Route path="/vip-topic-request" element={<VIPTopicRequest />} />
        <Route path="/redeem-gift" element={<RedeemGiftCode />} />
        <Route path="/redeem" element={<RedeemGiftCode />} />
        <Route path="/user-music-upload" element={<UserMusicUpload />} />
        <Route path="/tier-map" element={<TierMap />} />
        <Route path="/audio-upload" element={<AudioUpload />} />
        <Route path="/kids-validation" element={<KidsRoomValidation />} />
        <Route path="/security-dashboard" element={<SecurityDashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/vip-rooms" element={<AdminRoute><AdminVIPRooms /></AdminRoute>} />
        <Route path="/admin/design-audit" element={<AdminRoute><AdminDesignAudit /></AdminRoute>} />
        <Route path="/admin/app-metrics" element={<AdminRoute><AppMetrics /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
        <Route path="/admin/feedback" element={<AdminRoute><FeedbackInbox /></AdminRoute>} />
        <Route path="/admin/feedback-analytics" element={<AdminRoute><AdminFeedbackAnalytics /></AdminRoute>} />
        <Route path="/admin/stats" element={<AdminRoute><AdminStats /></AdminRoute>} />
        <Route path="/admin/content-quality" element={<AdminRoute><ContentQualityDashboard /></AdminRoute>} />
        <Route path="/admin/launch-simulation" element={<AdminRoute><LaunchSimulationDashboard /></AdminRoute>} />
        <Route path="/admin/payment-verification" element={<AdminRoute><AdminPaymentVerification /></AdminRoute>} />
        <Route path="/admin/payment-monitoring" element={<AdminRoute><PaymentMonitoring /></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
        <Route path="/admin/system-metrics" element={<AdminRoute><AdminSystemMetrics /></AdminRoute>} />
        <Route path="/admin/audio-upload" element={<AdminRoute><AdminAudioUpload /></AdminRoute>} />
        <Route path="/admin/moderation" element={<AdminRoute><AdminModeration /></AdminRoute>} />
        <Route path="/admin/rooms" element={<AdminRoute><AdminRooms /></AdminRoute>} />
        <Route path="/admin/room-editor/:roomId" element={<AdminRoute><AdminRoomEditor /></AdminRoute>} />
        <Route path="/admin/room-import" element={<AdminRoute><AdminRoomImport /></AdminRoute>} />
        <Route path="/admin/user-roles" element={<AdminRoute><AdminUserRoles /></AdminRoute>} />
        <Route path="/admin/code-editor" element={<AdminRoute><AdminCodeEditor /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/users/:userId" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
        <Route path="/admin/security" element={<AdminRoute><AdminSecurity /></AdminRoute>} />
        <Route path="/admin/audit-log" element={<AdminRoute><AuditLog /></AdminRoute>} />
        <Route path="/admin/ai-usage" element={<AdminRoute><AIUsage /></AdminRoute>} />
        <Route path="/admin/gift-codes" element={<AdminRoute><AdminGiftCodes /></AdminRoute>} />
        <Route path="/admin/manage-admins" element={<AdminRoute><AdminManageAdmins /></AdminRoute>} />
        <Route path="/admin/specification" element={<AdminRoute><AdminSpecification /></AdminRoute>} />
        <Route path="/admin/health" element={<AdminRoute><HealthDashboard /></AdminRoute>} />
        <Route path="/admin/room-health" element={<AdminRoute><RoomHealthDashboard /></AdminRoute>} />
        <Route path="/admin/room-health-check" element={<AdminRoute><UnifiedRoomHealthCheck /></AdminRoute>} />
        <Route path="/admin/system-health" element={<AdminRoute><SystemHealth /></AdminRoute>} />
        <Route path="/admin/system-health-live" element={<AdminRoute><SystemHealthLive /></AdminRoute>} />
        <Route path="/admin/edge-functions" element={<AdminRoute><EdgeFunctions /></AdminRoute>} />
        <Route path="/admin/room-specification" element={<AdminRoute><RoomSpecification /></AdminRoute>} />
        <Route path="/admin/music-approval" element={<AdminRoute><MusicApproval /></AdminRoute>} />
        <Route path="/admin/music-manager" element={<AdminRoute><MusicManager /></AdminRoute>} />
        <Route path="/admin/homepage-music" element={<AdminRoute><HomepageMusicController /></AdminRoute>} />
        <Route path="/admin/feature-flags" element={<AdminRoute><FeatureFlags /></AdminRoute>} />
        <Route path="/admin/audio-auditor" element={<AdminRoute><AudioAssetAuditor /></AdminRoute>} />
        <Route path="/admin/user-support" element={<AdminRoute><UserSupportConsole /></AdminRoute>} />
        <Route path="/admin/system-logs" element={<AdminRoute><SystemLogs /></AdminRoute>} />
        <Route path="/admin/fast-audio-scanner" element={<AdminRoute><FastAudioScannerPage /></AdminRoute>} />
        <Route path="/admin/entries-without-audio" element={<AdminRoute><EntriesWithoutAudioPage /></AdminRoute>} />
        <Route path="/admin/audio-coverage" element={<AdminRoute><AudioCoverage /></AdminRoute>} />
        <Route path="/admin/audio-crystal" element={<AdminRoute><AudioCrystal /></AdminRoute>} />
        <Route path="/admin/audio-autopilot" element={<AdminRoute><AudioAutopilot /></AdminRoute>} />
        <Route path="/admin/room-coverage" element={<AdminRoute><RoomCoverage /></AdminRoute>} />
        <Route path="/admin/room-analytics" element={<AdminRoute><RoomAnalytics /></AdminRoute>} />
        <Route path="/admin/audit-v4" element={<AdminRoute><AuditSafeShield /></AdminRoute>} />
        <Route path="/admin/code-files" element={<AdminRoute><SystemCodeFiles /></AdminRoute>} />
        <Route path="/admin/code-viewer/:filePath" element={<AdminRoute><CodeViewer /></AdminRoute>} />
        <Route path="/admin/test-email" element={<AdminRoute><TestEmail /></AdminRoute>} />
        <Route path="/admin/bank-transfers" element={<AdminRoute><AdminBankTransfers /></AdminRoute>} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
