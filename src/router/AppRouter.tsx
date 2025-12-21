/**
 * AppRouter - Lazy-loaded route definitions
 * Extracted from App.tsx to keep it minimal (providers only)
 */

import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminRoute } from "@/components/AdminRoute";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { AdminFloatingButton } from "@/components/AdminFloatingButton";

// Critical pages - loaded immediately (small bundles)
import Welcome from "@/_legacy_next_pages/Welcome";
import Homepage from "@/_legacy_next_pages/Homepage";
import Auth from "@/_legacy_next_pages/Auth";
import NotFound from "@/_legacy_next_pages/NotFound";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

// All other pages - lazy loaded
const ChatHub = lazy(() => import("@/_legacy_next_pages/ChatHub"));
const AdminDashboard = lazy(() => import("@/_legacy_next_pages/AdminDashboard"));
const KidsChat = lazy(() => import("@/_legacy_next_pages/KidsChat"));

// VIP Tier pages
const Tiers = lazy(() => import("@/_legacy_next_pages/Tiers"));
const RoomGrid = lazy(() => import("@/_legacy_next_pages/RoomGrid"));
const EnglishLearningPathway = lazy(() =>
  import("@/_legacy_next_pages/EnglishLearningPathway")
);
const RoomGridVIP1 = lazy(() => import("@/_legacy_next_pages/RoomGridVIP1"));
const RoomGridVIP2 = lazy(() => import("@/_legacy_next_pages/RoomGridVIP2"));
const RoomGridVIP3 = lazy(() => import("@/_legacy_next_pages/RoomGridVIP3"));
const RoomGridVIP3II = lazy(() => import("@/_legacy_next_pages/RoomGridVIP3II"));
const RoomGridVIP4 = lazy(() => import("@/_legacy_next_pages/RoomGridVIP4"));
const RoomGridVIP5 = lazy(() => import("@/_legacy_next_pages/RoomGridVIP5"));
const RoomGridVIP6 = lazy(() => import("@/_legacy_next_pages/RoomGridVIP6"));
const RoomsVIP9 = lazy(() => import("@/_legacy_next_pages/RoomsVIP9"));

// Kids pages
const KidsLevel1 = lazy(() => import("@/_legacy_next_pages/KidsLevel1"));
const KidsLevel2 = lazy(() => import("@/_legacy_next_pages/KidsLevel2"));
const KidsLevel3 = lazy(() => import("@/_legacy_next_pages/KidsLevel3"));

// Paths pages
const PathOverview = lazy(() => import("@/_legacy_next_pages/PathOverview"));
const PathDayPage = lazy(() => import("@/_legacy_next_pages/PathDayPage"));
const PathCompleted = lazy(() => import("@/_legacy_next_pages/PathCompleted"));

// Other user pages
const MeaningOfLife = lazy(() => import("@/_legacy_next_pages/MeaningOfLife"));
const AllRooms = lazy(() => import("@/_legacy_next_pages/AllRooms"));
const VIPRequestForm = lazy(() => import("@/_legacy_next_pages/VIPRequestForm"));
const VIPRequests = lazy(() => import("@/_legacy_next_pages/VIPRequests"));
const MatchmakingHub = lazy(() => import("@/_legacy_next_pages/MatchmakingHub"));
const PaymentTest = lazy(() => import("@/_legacy_next_pages/PaymentTest"));
const ManualPayment = lazy(() => import("@/_legacy_next_pages/ManualPayment"));
const BankTransferPayment = lazy(() =>
  import("@/_legacy_next_pages/BankTransferPayment")
);
const PromoCode = lazy(() => import("@/_legacy_next_pages/PromoCode"));
const VIPTopicRequest = lazy(() => import("@/_legacy_next_pages/VIPTopicRequest"));
const ResetPassword = lazy(() => import("@/_legacy_next_pages/ResetPassword"));
const SexualityCultureRoom = lazy(() =>
  import("@/_legacy_next_pages/SexualityCultureRoom")
);
const FinanceCalmRoom = lazy(() => import("@/_legacy_next_pages/FinanceCalmRoom"));
const AudioUpload = lazy(() => import("@/_legacy_next_pages/AudioUpload"));
const JoinCode = lazy(() => import("@/_legacy_next_pages/JoinCode"));
const KidsRoomValidation = lazy(() =>
  import("@/_legacy_next_pages/KidsRoomValidation")
);
const RedeemGiftCode = lazy(() => import("@/_legacy_next_pages/RedeemGiftCode"));
const SecurityDashboard = lazy(() => import("@/_legacy_next_pages/SecurityDashboard"));
const Settings = lazy(() => import("@/_legacy_next_pages/Settings"));
const UserMusicUpload = lazy(() => import("@/_legacy_next_pages/UserMusicUpload"));
const TierMap = lazy(() => import("@/_legacy_next_pages/TierMap"));
const Terms = lazy(() => import("@/_legacy_next_pages/Terms"));
const Privacy = lazy(() => import("@/_legacy_next_pages/Privacy"));
const Refund = lazy(() => import("@/_legacy_next_pages/Refund"));

// Admin pages - lazy loaded
const AdminVIPRooms = lazy(() => import("@/_legacy_next_pages/AdminVIPRooms"));
const AdminDesignAudit = lazy(() => import("@/_legacy_next_pages/AdminDesignAudit"));
const AppMetrics = lazy(() => import("@/_legacy_next_pages/admin/AppMetrics"));
const AdminReports = lazy(() => import("@/_legacy_next_pages/AdminReports"));
const FeedbackInbox = lazy(() => import("@/_legacy_next_pages/admin/FeedbackInbox"));
const AdminStats = lazy(() => import("@/_legacy_next_pages/AdminStats"));
const ContentQualityDashboard = lazy(() =>
  import("@/_legacy_next_pages/admin/ContentQualityDashboard")
);
const LaunchSimulationDashboard = lazy(() =>
  import("@/_legacy_next_pages/admin/LaunchSimulationDashboard")
);
const AdminSystemMetrics = lazy(() =>
  import("@/_legacy_next_pages/AdminSystemMetrics")
);
const PaymentMonitoring = lazy(() =>
  import("@/_legacy_next_pages/admin/PaymentMonitoring")
);
const AdminAudioUpload = lazy(() => import("@/_legacy_next_pages/AdminAudioUpload"));
const AdminModeration = lazy(() => import("@/_legacy_next_pages/AdminModeration"));
const AdminRooms = lazy(() => import("@/_legacy_next_pages/AdminRooms"));
const AdminRoomEditor = lazy(() => import("@/_legacy_next_pages/AdminRoomEditor"));
const AdminRoomImport = lazy(() => import("@/_legacy_next_pages/AdminRoomImport"));
const AdminUserRoles = lazy(() => import("@/_legacy_next_pages/AdminUserRoles"));
const AdminCodeEditor = lazy(() => import("@/_legacy_next_pages/AdminCodeEditor"));
const AdminFeedbackAnalytics = lazy(() =>
  import("@/_legacy_next_pages/AdminFeedbackAnalytics")
);
const AdminPayments = lazy(() => import("@/_legacy_next_pages/AdminPayments"));
const AdminPaymentVerification = lazy(() =>
  import("@/_legacy_next_pages/AdminPaymentVerification")
);
const AdminUsers = lazy(() => import("@/_legacy_next_pages/AdminUsers"));
const AdminUserDetail = lazy(() => import("@/_legacy_next_pages/AdminUserDetail"));
const AdminSecurity = lazy(() => import("@/_legacy_next_pages/AdminSecurity"));
const AuditLog = lazy(() => import("@/_legacy_next_pages/admin/AuditLog"));
const AIUsage = lazy(() => import("@/_legacy_next_pages/admin/AIUsage"));
const AdminGiftCodes = lazy(() => import("@/_legacy_next_pages/AdminGiftCodes"));
const AdminManageAdmins = lazy(() =>
  import("@/_legacy_next_pages/AdminManageAdmins")
);
const AdminSpecification = lazy(() => import("@/_legacy_next_pages/AdminSpecification"));
const HealthDashboard = lazy(() => import("@/_legacy_next_pages/admin/HealthDashboard"));
const RoomHealthDashboard = lazy(() =>
  import("@/_legacy_next_pages/admin/RoomHealthDashboard")
);
const UnifiedRoomHealthCheck = lazy(() =>
  import("@/_legacy_next_pages/admin/UnifiedRoomHealthCheck")
);
const SystemHealth = lazy(() => import("@/_legacy_next_pages/admin/SystemHealth"));
const SystemHealthLive = lazy(() =>
  import("@/_legacy_next_pages/admin/SystemHealthLive")
);
const EdgeFunctions = lazy(() => import("@/_legacy_next_pages/admin/EdgeFunctions"));
const RoomSpecification = lazy(() =>
  import("@/_legacy_next_pages/admin/RoomSpecification")
);
const MusicApproval = lazy(() => import("@/_legacy_next_pages/admin/MusicApproval"));
const MusicManager = lazy(() => import("@/_legacy_next_pages/admin/MusicManager"));
const HomepageMusicController = lazy(() =>
  import("@/_legacy_next_pages/admin/HomepageMusicController")
);
const FeatureFlags = lazy(() => import("@/_legacy_next_pages/admin/FeatureFlags"));
const AudioAssetAuditor = lazy(() =>
  import("@/_legacy_next_pages/admin/AudioAssetAuditor")
);
const UserSupportConsole = lazy(() =>
  import("@/_legacy_next_pages/admin/UserSupportConsole")
);
const SystemLogs = lazy(() => import("@/_legacy_next_pages/admin/SystemLogs"));
const FastAudioScannerPage = lazy(() =>
  import("@/_legacy_next_pages/admin/FastAudioScannerPage")
);
const EntriesWithoutAudioPage = lazy(() =>
  import("@/_legacy_next_pages/admin/EntriesWithoutAudioPage")
);
const AudioCoverage = lazy(() => import("@/_legacy_next_pages/admin/AudioCoverage"));
const AudioCrystal = lazy(() => import("@/_legacy_next_pages/admin/AudioCrystal"));
const AudioAutopilot = lazy(() => import("@/_legacy_next_pages/admin/AudioAutopilot"));
const RoomCoverage = lazy(() => import("@/_legacy_next_pages/admin/RoomCoverage"));
const RoomAnalytics = lazy(() => import("@/_legacy_next_pages/admin/RoomAnalytics"));
const AuditSafeShield = lazy(() => import("@/components/admin/AuditSafeShield"));
const SystemCodeFiles = lazy(() =>
  import("@/_legacy_next_pages/admin/SystemCodeFiles")
);
const CodeViewer = lazy(() => import("@/_legacy_next_pages/admin/CodeViewer"));
const TestEmail = lazy(() => import("@/_legacy_next_pages/admin/TestEmail"));
const AdminBankTransfers = lazy(() =>
  import("@/_legacy_next_pages/AdminBankTransfers")
);
const AdminEmailBroadcast = lazy(() =>
  import("@/_legacy_next_pages/AdminEmailBroadcast")
);

// Tier Inspector — PROTECTED
const TierInspectorPage = lazy(() =>
  import("@/_legacy_next_pages/admin/tier-inspector")
);

const AppRouter = () => {
  return (
    <>
      <AdminFloatingButton />
      <Suspense fallback={<LoadingSkeleton variant="page" />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/room/:roomId" element={<ChatHub />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
