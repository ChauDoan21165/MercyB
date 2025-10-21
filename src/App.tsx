import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import RoomGrid from "./pages/RoomGrid";
import RoomGridVIP1 from "./pages/RoomGridVIP1";
import RoomGridVIP2 from "./pages/RoomGridVIP2";
import RoomGridVIP3 from "./pages/RoomGridVIP3";
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
import PromoCode from "./pages/PromoCode";
import VIPTopicRequest from "./pages/VIPTopicRequest";
import AdminReports from "./pages/AdminReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/rooms" element={<RoomGrid />} />
          <Route path="/rooms-vip1" element={<RoomGridVIP1 />} />
          <Route path="/rooms-vip2" element={<RoomGridVIP2 />} />
          <Route path="/rooms-vip3" element={<RoomGridVIP3 />} />
          <Route path="/all-rooms" element={<AllRooms />} />
          <Route path="/chat/:roomId" element={<ChatHub />} />
          <Route path="/vip-request" element={<VIPRequestForm />} />
          <Route path="/vip-requests" element={<VIPRequests />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vip-rooms" element={<AdminVIPRooms />} />
          <Route path="/matchmaking" element={<MatchmakingHub />} />
          <Route path="/payment-test" element={<PaymentTest />} />
          <Route path="/promo-code" element={<PromoCode />} />
          <Route path="/vip-topic-request" element={<VIPTopicRequest />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
