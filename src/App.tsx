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
import { LowDataModeProvider } from "@/contexts/LowDataModeContext";

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
import AdminPaymentVerification from "./pages/AdminPaymentVerification";
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
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminSecurity from "./pages/AdminSecurity";
import JoinCode from "./pages/JoinCode";
import AdminSystemMetrics from "./pages/AdminSystemMetrics";
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LowDataModeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
        <HomeButton />
        <AdminFloatingButton />
        <ZoomControl />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/tiers" element={<Tiers />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/meaning-of-life" element={<MeaningOfLife />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/join/:code" element={<JoinCode />} />
          <Route path="/rooms" element={<RoomGrid />} />
          <Route path="/english-pathway" element={<EnglishLearningPathway />} />
          <Route path="/rooms-vip1" element={<RoomGridVIP1 />} />
          <Route path="/rooms-vip2" element={<RoomGridVIP2 />} />
          <Route path="/rooms-vip3" element={<RoomGridVIP3 />} />
          <Route path="/rooms-vip3-ii" element={<RoomGridVIP3II />} />
          <Route path="/rooms-vip4" element={<RoomGridVIP4 />} />
          <Route path="/rooms-vip5" element={<RoomGridVIP5 />} />
          <Route path="/vip6" element={<RoomGridVIP6 />} />
          <Route path="/rooms-vip9" element={<RoomsVIP9 />} />
          <Route path="/kids-level1" element={<KidsLevel1 />} />
          <Route path="/kids-level2" element={<KidsLevel2 />} />
          <Route path="/kids-level3" element={<KidsLevel3 />} />
          <Route path="/kids-chat/:roomId" element={<KidsChat />} />
          <Route path="/sexuality-culture" element={<SexualityCultureRoom />} />
          <Route path="/finance-calm" element={<FinanceCalmRoom />} />
          <Route path="/all-rooms" element={<AllRooms />} />
          <Route path="/chat/:roomId" element={<ChatHub />} />
          <Route path="/vip-request" element={<VIPRequestForm />} />
          <Route path="/vip-requests" element={<VIPRequests />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vip-rooms" element={<AdminVIPRooms />} />
          <Route path="/admin/design-audit" element={<AdminDesignAudit />} />
          <Route path="/admin/app-metrics" element={<AppMetrics />} />
          <Route path="/matchmaking" element={<MatchmakingHub />} />
          <Route path="/subscribe" element={<PaymentTest />} />
          <Route path="/payment-test" element={<PaymentTest />} /> {/* Legacy redirect */}
          <Route path="/manual-payment" element={<ManualPayment />} />
          <Route path="/promo-code" element={<PromoCode />} />
          <Route path="/vip-topic-request" element={<VIPTopicRequest />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/feedback" element={<FeedbackInbox />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/payments" element={<AdminPaymentVerification />} />
          <Route path="/admin/audio-upload" element={<AdminAudioUpload />} />
          <Route path="/admin/moderation" element={<AdminModeration />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/rooms/new" element={<AdminRoomEditor />} />
          <Route path="/admin/rooms/edit/:roomId" element={<AdminRoomEditor />} />
          <Route path="/admin/rooms/import" element={<AdminRoomImport />} />
          <Route path="/admin/user-roles" element={<AdminUserRoles />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:userId" element={<AdminUserDetail />} />
          <Route path="/admin/security" element={<AdminSecurity />} />
          <Route path="/admin/code-editor" element={<AdminCodeEditor />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/system-metrics" element={<AdminSystemMetrics />} />
          <Route path="/admin/gift-codes" element={<AdminGiftCodes />} />
          <Route path="/admin/specification" element={<AdminSpecification />} />
          <Route path="/admin/kids-room-health" element={<UnifiedHealthCheck />} />
          <Route path="/admin/health-dashboard" element={<HealthDashboard />} />
          <Route path="/admin/room-health/:tier" element={<UnifiedHealthCheck />} />
          <Route path="/admin/system-health" element={<SystemHealth />} />
          <Route path="/admin/edge-functions" element={<EdgeFunctions />} />
          <Route path="/redeem-gift" element={<RedeemGiftCode />} />
          <Route path="/audio-upload" element={<AudioUpload />} />
          <Route path="/kids-validation" element={<KidsRoomValidation />} />
          <Route path="/security-dashboard" element={<SecurityDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
          </TooltipProvider>
        </LowDataModeProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
