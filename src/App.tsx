import { useEffect, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AdminFloatingButton } from "@/components/AdminFloatingButton";
import { ZoomControl } from "@/components/ZoomControl";
import { HomeButton } from "@/components/HomeButton";
import { BackButton } from "@/components/BackButton";
import { GlobalPlayingIndicator } from "@/components/GlobalPlayingIndicator";
import { AdminRoute } from "@/components/AdminRoute";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { LowDataModeProvider } from "@/contexts/LowDataModeContext";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineDetector } from "@/components/OfflineDetector";
import { PerformanceProfiler } from "@/lib/performance/profiler";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { preloadCriticalRoutes } from "@/lib/performance";

// Critical pages - loaded immediately
import Welcome from "./pages/Welcome";
import Homepage from "./pages/Homepage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import EnvironmentBanner from "./components/admin/EnvironmentBanner";

// Heavy components - lazy loaded
const ChatHub = lazy(() => import("./pages/ChatHub"));
const UnifiedHealthCheck = lazy(() => import("./pages/admin/UnifiedHealthCheck"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const KidsChat = lazy(() => import("./pages/KidsChat"));

// VIP Tier pages - lazy loaded
const Tiers = lazy(() => import("./pages/Tiers"));
const RoomGrid = lazy(() => import("./pages/RoomGrid"));
const EnglishLearningPathway = lazy(() => import("./pages/EnglishLearningPathway"));
const RoomGridVIP1 = lazy(() => import("./pages/RoomGridVIP1"));
const RoomGridVIP2 = lazy(() => import("./pages/RoomGridVIP2"));
const RoomGridVIP3 = lazy(() => import("./pages/RoomGridVIP3"));
const RoomGridVIP3II = lazy(() => import("./pages/RoomGridVIP3II"));
const RoomGridVIP4 = lazy(() => import("./pages/RoomGridVIP4"));
const RoomGridVIP5 = lazy(() => import("./pages/RoomGridVIP5"));
const RoomGridVIP6 = lazy(() => import("./pages/RoomGridVIP6"));
const RoomsVIP9 = lazy(() => import("./pages/RoomsVIP9"));

// Kids pages - lazy loaded
const KidsLevel1 = lazy(() => import("./pages/KidsLevel1"));
const KidsLevel2 = lazy(() => import("./pages/KidsLevel2"));
const KidsLevel3 = lazy(() => import("./pages/KidsLevel3"));

// Admin pages - lazy loaded
const AdminVIPRooms = lazy(() => import("./pages/AdminVIPRooms"));
const AdminDesignAudit = lazy(() => import("./pages/AdminDesignAudit"));
const AppMetrics = lazy(() => import("./pages/admin/AppMetrics"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const FeedbackInbox = lazy(() => import("./pages/admin/FeedbackInbox"));
const AdminStats = lazy(() => import("./pages/AdminStats"));
const AdminSystemMetrics = lazy(() => import("./pages/AdminSystemMetrics"));
const PaymentMonitoring = lazy(() => import("./pages/admin/PaymentMonitoring"));
const AdminAudioUpload = lazy(() => import("./pages/AdminAudioUpload"));
const AdminModeration = lazy(() => import("./pages/AdminModeration"));
const AdminRooms = lazy(() => import("./pages/AdminRooms"));
const AdminRoomEditor = lazy(() => import("./pages/AdminRoomEditor"));
const AdminRoomImport = lazy(() => import("./pages/AdminRoomImport"));
const AdminUserRoles = lazy(() => import("./pages/AdminUserRoles"));
const AdminCodeEditor = lazy(() => import("./pages/AdminCodeEditor"));
const AdminFeedbackAnalytics = lazy(() => import("./pages/AdminFeedbackAnalytics"));
const AdminPayments = lazy(() => import("./pages/AdminPayments"));
const AdminPaymentVerification = lazy(() => import("./pages/AdminPaymentVerification"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminUserDetail = lazy(() => import("./pages/AdminUserDetail"));
const AdminSecurity = lazy(() => import("./pages/AdminSecurity"));
const AuditLog = lazy(() => import("./pages/admin/AuditLog"));
const AIUsage = lazy(() => import("./pages/admin/AIUsage"));
const AdminGiftCodes = lazy(() => import("./pages/AdminGiftCodes"));
const AdminSpecification = lazy(() => import("./pages/AdminSpecification"));
const HealthDashboard = lazy(() => import("./pages/admin/HealthDashboard"));
const RoomHealthDashboard = lazy(() => import("./pages/admin/RoomHealthDashboard"));
const KidsRoomHealthCheck = lazy(() => import("./pages/KidsRoomHealthCheck"));
const SystemHealth = lazy(() => import("./pages/admin/SystemHealth"));
const EdgeFunctions = lazy(() => import("./pages/admin/EdgeFunctions"));
const RoomSpecification = lazy(() => import("./pages/admin/RoomSpecification"));
const MusicApproval = lazy(() => import("./pages/admin/MusicApproval"));
const MusicManager = lazy(() => import("./pages/admin/MusicManager"));
const FeatureFlags = lazy(() => import("./pages/admin/FeatureFlags"));
const AudioAssetAuditor = lazy(() => import("./pages/admin/AudioAssetAuditor"));
const UserSupportConsole = lazy(() => import("./pages/admin/UserSupportConsole"));
const SystemLogs = lazy(() => import("./pages/admin/SystemLogs"));

// Other pages - lazy loaded
const MeaningOfLife = lazy(() => import("./pages/MeaningOfLife"));
const AllRooms = lazy(() => import("./pages/AllRooms"));
const VIPRequestForm = lazy(() => import("./pages/VIPRequestForm"));
const VIPRequests = lazy(() => import("./pages/VIPRequests"));
const MatchmakingHub = lazy(() => import("./pages/MatchmakingHub"));
const PaymentTest = lazy(() => import("./pages/PaymentTest"));
const ManualPayment = lazy(() => import("./pages/ManualPayment"));
const PromoCode = lazy(() => import("./pages/PromoCode"));
const VIPTopicRequest = lazy(() => import("./pages/VIPTopicRequest"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SexualityCultureRoom = lazy(() => import("./pages/SexualityCultureRoom"));
const FinanceCalmRoom = lazy(() => import("./pages/FinanceCalmRoom"));
const AudioUpload = lazy(() => import("./pages/AudioUpload"));
const JoinCode = lazy(() => import("./pages/JoinCode"));
const KidsRoomValidation = lazy(() => import("./pages/KidsRoomValidation"));
const RedeemGiftCode = lazy(() => import("./pages/RedeemGiftCode"));
const SecurityDashboard = lazy(() => import("./pages/SecurityDashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const UserMusicUpload = lazy(() => import("./pages/UserMusicUpload"));
const TierMap = lazy(() => import("./pages/TierMap"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Refund = lazy(() => import("./pages/Refund"));

// Optimized QueryClient config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Remove tracking parameters from URL if present
    const url = new URL(window.location.href);
    const trackingParams = [
      'fbclid',
      'gclid',
      'msclkid',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ];
    
    let hasTrackingParams = false;
    trackingParams.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        hasTrackingParams = true;
      }
    });
    
    if (hasTrackingParams) {
      window.history.replaceState({}, '', url.toString());
    }

    // Preload critical routes on idle
    preloadCriticalRoutes([
      '/vip/vip1',
      '/vip/vip2',
      '/vip/vip3',
      '/room',
      '/kids-chat',
    ]);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LowDataModeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <OfflineDetector />
              <MusicPlayerProvider>
                <BrowserRouter>
                  <EnvironmentBanner />
                  <AdminFloatingButton />
                  <ZoomControl />
                  
                  <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
                      <div className="flex items-center gap-2">
                        <HomeButton />
                        <BackButton />
                      </div>
                    </div>
                  </header>
                  
                  <GlobalPlayingIndicator />
                  <PerformanceProfiler />
        <Suspense fallback={<LoadingSkeleton variant="page" />}>
          <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/tiers" element={<Tiers />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/meaning-of-life" element={<MeaningOfLife />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/join/:code" element={<JoinCode />} />
          {/* Canonical routes per Design System v1.1 */}
          <Route path="/rooms" element={<RoomGrid />} />
          <Route path="/english-pathway" element={<EnglishLearningPathway />} />
          <Route path="/vip/vip1" element={<RoomGridVIP1 />} />
          <Route path="/vip/vip2" element={<RoomGridVIP2 />} />
          <Route path="/vip/vip3" element={<RoomGridVIP3 />} />
          <Route path="/vip/vip3ii" element={<RoomGridVIP3II />} />
          <Route path="/vip/vip4" element={<RoomGridVIP4 />} />
          <Route path="/vip/vip5" element={<RoomGridVIP5 />} />
          <Route path="/vip/vip6" element={<RoomGridVIP6 />} />
          <Route path="/vip/vip9" element={<RoomsVIP9 />} />
          <Route path="/kids-level1" element={<KidsLevel1 />} />
          <Route path="/kids-level2" element={<KidsLevel2 />} />
          <Route path="/kids-level3" element={<KidsLevel3 />} />
          <Route path="/kids-chat/:roomId" element={<KidsChat />} />
          <Route path="/sexuality-culture" element={<SexualityCultureRoom />} />
          <Route path="/finance-calm" element={<FinanceCalmRoom />} />
          <Route path="/all-rooms" element={<AllRooms />} />
          <Route path="/room/:roomId" element={<ChatHub />} />
          <Route path="/vip-request" element={<VIPRequestForm />} />
          <Route path="/vip-requests" element={<VIPRequests />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/vip-rooms" element={<AdminRoute><AdminVIPRooms /></AdminRoute>} />
          <Route path="/admin/design-audit" element={<AdminRoute><AdminDesignAudit /></AdminRoute>} />
          <Route path="/admin/app-metrics" element={<AdminRoute><AppMetrics /></AdminRoute>} />
          <Route path="/matchmaking" element={<MatchmakingHub />} />
          <Route path="/subscribe" element={<PaymentTest />} />
          <Route path="/payment-test" element={<PaymentTest />} /> {/* Legacy redirect */}
          <Route path="/manual-payment" element={<ManualPayment />} />
          <Route path="/promo-code" element={<PromoCode />} />
          <Route path="/vip-topic-request" element={<VIPTopicRequest />} />
                <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
                <Route path="/admin/feedback" element={<AdminRoute><FeedbackInbox /></AdminRoute>} />
                <Route path="/admin/feedback-analytics" element={<AdminRoute><AdminFeedbackAnalytics /></AdminRoute>} />
                <Route path="/admin/stats" element={<AdminRoute><AdminStats /></AdminRoute>} />
          <Route path="/admin/payment-verification" element={<AdminRoute><AdminPaymentVerification /></AdminRoute>} />
          <Route path="/admin/audio-upload" element={<AdminRoute><AdminAudioUpload /></AdminRoute>} />
          <Route path="/admin/moderation" element={<AdminRoute><AdminModeration /></AdminRoute>} />
          <Route path="/admin/rooms" element={<AdminRoute><AdminRooms /></AdminRoute>} />
          <Route path="/admin/rooms/new" element={<AdminRoute><AdminRoomEditor /></AdminRoute>} />
          <Route path="/admin/rooms/edit/:roomId" element={<AdminRoute><AdminRoomEditor /></AdminRoute>} />
          <Route path="/admin/rooms/import" element={<AdminRoute><AdminRoomImport /></AdminRoute>} />
          <Route path="/admin/user-roles" element={<AdminRoute><AdminUserRoles /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/users/:userId" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
          <Route path="/admin/security" element={<AdminRoute><AdminSecurity /></AdminRoute>} />
          <Route path="/admin/code-editor" element={<AdminRoute><AdminCodeEditor /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
          <Route path="/admin/system-metrics" element={<AdminRoute><AdminSystemMetrics /></AdminRoute>} />
          <Route path="/admin/payment-monitoring" element={<AdminRoute><PaymentMonitoring /></AdminRoute>} />
          <Route path="/admin/gift-codes" element={<AdminRoute><AdminGiftCodes /></AdminRoute>} />
          <Route path="/admin/specification" element={<AdminRoute><AdminSpecification /></AdminRoute>} />
          <Route path="/admin/room-specification" element={<AdminRoute><RoomSpecification /></AdminRoute>} />
           <Route path="/admin/health" element={<AdminRoute><UnifiedHealthCheck /></AdminRoute>} />
           <Route path="/admin/kids-room-health" element={<AdminRoute><KidsRoomHealthCheck /></AdminRoute>} />
           <Route path="/admin/health-dashboard" element={<AdminRoute><HealthDashboard /></AdminRoute>} />
           <Route path="/admin/room-health-dashboard" element={<AdminRoute><RoomHealthDashboard /></AdminRoute>} />
           <Route path="/admin/room-health/:tier" element={<AdminRoute><UnifiedHealthCheck /></AdminRoute>} />
           <Route path="/admin/system-health" element={<AdminRoute><SystemHealth /></AdminRoute>} />
          <Route path="/admin/edge-functions" element={<AdminRoute><EdgeFunctions /></AdminRoute>} />
          <Route path="/redeem-gift" element={<RedeemGiftCode />} />
          <Route path="/user-music-upload" element={<UserMusicUpload />} />
          <Route path="/admin/music-approval" element={<AdminRoute><MusicApproval /></AdminRoute>} />
          <Route path="/admin/music-manager" element={<AdminRoute><MusicManager /></AdminRoute>} />
          <Route path="/admin/audit-log" element={<AdminRoute><AuditLog /></AdminRoute>} />
          <Route path="/admin/ai-usage" element={<AdminRoute><AIUsage /></AdminRoute>} />
          <Route path="/admin/feature-flags" element={<AdminRoute><FeatureFlags /></AdminRoute>} />
          <Route path="/admin/audio-audit" element={<AdminRoute><AudioAssetAuditor /></AdminRoute>} />
          <Route path="/admin/user-support" element={<AdminRoute><UserSupportConsole /></AdminRoute>} />
          <Route path="/admin/system-logs" element={<AdminRoute><SystemLogs /></AdminRoute>} />
          <Route path="/tier-map" element={<TierMap />} />
          <Route path="/audio-upload" element={<AudioUpload />} />
          <Route path="/kids-validation" element={<KidsRoomValidation />} />
          <Route path="/security-dashboard" element={<SecurityDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <MusicPlayer />
                </BrowserRouter>
              </MusicPlayerProvider>
            </TooltipProvider>
          </LowDataModeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
