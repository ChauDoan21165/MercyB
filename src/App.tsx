import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminFloatingButton } from "@/components/AdminFloatingButton";
import Welcome from "./pages/Welcome";
import MeaningOfLife from "./pages/MeaningOfLife";
import RoomGrid from "./pages/RoomGrid";
import RoomGridVIP1 from "./pages/RoomGridVIP1";
import RoomGridVIP2 from "./pages/RoomGridVIP2";
import RoomGridVIP3 from "./pages/RoomGridVIP3";
import RoomGridVIP4 from "./pages/RoomGridVIP4";
import AllRooms from "./pages/AllRooms";
import ChatHub from "./pages/ChatHub";
import NotFound from "./pages/NotFound";
import VIPRequestForm from "./pages/VIPRequestForm";
import VIPRequests from "./pages/VIPRequests";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVIPRooms from "./pages/AdminVIPRooms";
import MatchmakingHub from "./pages/MatchmakingHub";
import Auth from "./pages/Auth";
import PaymentTest from "./pages/PaymentTest";
import ManualPayment from "./pages/ManualPayment";
import PromoCode from "./pages/PromoCode";
import VIPTopicRequest from "./pages/VIPTopicRequest";
import AdminReports from "./pages/AdminReports";
import AdminStats from "./pages/AdminStats";
import AdminPaymentVerification from "./pages/AdminPaymentVerification";
import AdminAudioUpload from "./pages/AdminAudioUpload";
import AdminModeration from "./pages/AdminModeration";
import ResetPassword from "./pages/ResetPassword";
import DebugRooms from "./pages/DebugRooms";
import AudioAnalysis from "./pages/AudioAnalysis";
import AudioFileList from "./pages/AudioFileList";
import SexualityCultureRoom from "./pages/SexualityCultureRoom";
import FinanceCalmRoom from "./pages/FinanceCalmRoom";
import AdminRooms from "./pages/AdminRooms";
import AdminRoomEditor from "./pages/AdminRoomEditor";
import AdminRoomImport from "./pages/AdminRoomImport";
import RoomSyncHealth from "./pages/RoomSyncHealth";
import AdminUserRoles from "./pages/AdminUserRoles";
import AdminCodeEditor from "./pages/AdminCodeEditor";
import AudioTestPage from "./pages/AudioTestPage";
import AudioUpload from "./pages/AudioUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminFloatingButton />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/meaning-of-life" element={<MeaningOfLife />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/rooms" element={<RoomGrid />} />
          <Route path="/rooms-vip1" element={<RoomGridVIP1 />} />
          <Route path="/rooms-vip2" element={<RoomGridVIP2 />} />
          <Route path="/rooms-vip3" element={<RoomGridVIP3 />} />
          <Route path="/rooms-vip4" element={<RoomGridVIP4 />} />
          <Route path="/sexuality-culture" element={<SexualityCultureRoom />} />
          <Route path="/finance-calm" element={<FinanceCalmRoom />} />
          <Route path="/all-rooms" element={<AllRooms />} />
          <Route path="/chat/:roomId" element={<ChatHub />} />
          <Route path="/vip-request" element={<VIPRequestForm />} />
          <Route path="/vip-requests" element={<VIPRequests />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vip-rooms" element={<AdminVIPRooms />} />
          <Route path="/matchmaking" element={<MatchmakingHub />} />
          <Route path="/subscribe" element={<PaymentTest />} />
          <Route path="/payment-test" element={<PaymentTest />} /> {/* Legacy redirect */}
          <Route path="/manual-payment" element={<ManualPayment />} />
          <Route path="/promo-code" element={<PromoCode />} />
          <Route path="/vip-topic-request" element={<VIPTopicRequest />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/payments" element={<AdminPaymentVerification />} />
          <Route path="/admin/audio-upload" element={<AdminAudioUpload />} />
          <Route path="/admin/moderation" element={<AdminModeration />} />
          <Route path="/debug/rooms" element={<DebugRooms />} />
          <Route path="/audio-analysis" element={<AudioAnalysis />} />
          <Route path="/audio-files" element={<AudioFileList />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/rooms/new" element={<AdminRoomEditor />} />
          <Route path="/admin/rooms/edit/:roomId" element={<AdminRoomEditor />} />
          <Route path="/admin/rooms/import" element={<AdminRoomImport />} />
          <Route path="/admin/rooms/health" element={<RoomSyncHealth />} />
          <Route path="/admin/users" element={<AdminUserRoles />} />
          <Route path="/admin/code-editor" element={<AdminCodeEditor />} />
          <Route path="/audio-test" element={<AudioTestPage />} />
          <Route path="/audio-upload" element={<AudioUpload />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
