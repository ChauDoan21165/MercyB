import { useEffect } from "react";
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

import Welcome from "./pages/Welcome";
import Homepage from "./pages/Homepage";
import Tiers from "./pages/Tiers";
import MeaningOfLife from "./pages/MeaningOfLife";
import RoomGrid from "./pages/RoomGrid";
import EnglishLearningPathway from "./pages/EnglishLearningPathway";
import RoomGridVIP1 from "./pages/RoomGridVIP1";
import RoomGridVIP2 from "./pages/RoomGridVIP2";
import RoomGridVIP3 from "./pages/RoomGridVIP3";
import RoomGridVIP3II from "./pages/RoomGridVIP3II";
import RoomGridVIP4 from "./pages/RoomGridVIP4";
import RoomGridVIP5 from "./pages/RoomGridVIP5";
import RoomGridVIP6 from "./pages/RoomGridVIP6";
import RoomsVIP9 from "./pages/RoomsVIP9";
import AllRooms from "./pages/AllRooms";
import ChatHub from "./pages/ChatHub";
import NotFound from "./pages/NotFound";
import VIPRequestForm from "./pages/VIPRequestForm";
import VIPRequests from "./pages/VIPRequests";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVIPRooms from "./pages/AdminVIPRooms";
import AdminDesignAudit from "./pages/AdminDesignAudit";
import AppMetrics from "./pages/admin/AppMetrics";
import MatchmakingHub from "./pages/MatchmakingHub";
import Auth from "./pages/Auth";
import PaymentTest from "./pages/PaymentTest";
import ManualPayment from "./pages/ManualPayment";
import PromoCode from "./pages/PromoCode";
import VIPTopicRequest from "./pages/VIPTopicRequest";
import AdminReports from "./pages/AdminReports";
import FeedbackInbox from "./pages/admin/FeedbackInbox";
import AdminStats from "./pages/AdminStats";
import AdminSystemMetrics from "./pages/AdminSystemMetrics";
import PaymentMonitoring from "./pages/admin/PaymentMonitoring";
import AdminAudioUpload from "./pages/AdminAudioUpload";
import AdminModeration from "./pages/AdminModeration";
import ResetPassword from "./pages/ResetPassword";
import SexualityCultureRoom from "./pages/SexualityCultureRoom";
import FinanceCalmRoom from "./pages/FinanceCalmRoom";
import AdminRooms from "./pages/AdminRooms";
import AdminRoomEditor from "./pages/AdminRoomEditor";
import AdminRoomImport from "./pages/AdminRoomImport";
import AdminUserRoles from "./pages/AdminUserRoles";
import AdminCodeEditor from "./pages/AdminCodeEditor";
import AudioUpload from "./pages/AudioUpload";
import AdminFeedbackAnalytics from "./pages/AdminFeedbackAnalytics";
import AdminPayments from "./pages/AdminPayments";
import AdminPaymentVerification from "./pages/AdminPaymentVerification";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminSecurity from "./pages/AdminSecurity";
import AuditLog from "./pages/admin/AuditLog";
import AIUsage from "./pages/admin/AIUsage";
import JoinCode from "./pages/JoinCode";
import KidsLevel1 from "./pages/KidsLevel1";
import KidsLevel2 from "./pages/KidsLevel2";
import KidsLevel3 from "./pages/KidsLevel3";
import KidsChat from "./pages/KidsChat";
import KidsRoomValidation from "./pages/KidsRoomValidation";
import KidsRoomHealthCheck from "./pages/KidsRoomHealthCheck";
import RedeemGiftCode from "./pages/RedeemGiftCode";
import AdminGiftCodes from "./pages/AdminGiftCodes";
import AdminSpecification from "./pages/AdminSpecification";
import SecurityDashboard from "./pages/SecurityDashboard";
import Settings from "./pages/Settings";
import HealthDashboard from "./pages/admin/HealthDashboard";
import UnifiedHealthCheck from "./pages/admin/UnifiedHealthCheck";
import SystemHealth from "./pages/admin/SystemHealth";
import EdgeFunctions from "./pages/admin/EdgeFunctions";
import RoomSpecification from "./pages/admin/RoomSpecification";
import UserMusicUpload from "./pages/UserMusicUpload";
import MusicApproval from "./pages/admin/MusicApproval";
import MusicManager from "./pages/admin/MusicManager";
import TierMap from "./pages/TierMap";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import FeatureFlags from "./pages/admin/FeatureFlags";
import AudioAssetAuditor from "./pages/admin/AudioAssetAuditor";
import UserSupportConsole from "./pages/admin/UserSupportConsole";

const queryClient = new QueryClient();

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
