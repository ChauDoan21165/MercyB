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
import MatchmakingHub from "./pages/MatchmakingHub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/rooms" element={<RoomGrid />} />
          <Route path="/rooms-vip1" element={<RoomGridVIP1 />} />
          <Route path="/rooms-vip2" element={<RoomGridVIP2 />} />
          <Route path="/rooms-vip3" element={<RoomGridVIP3 />} />
          <Route path="/all-rooms" element={<AllRooms />} />
          <Route path="/chat/:roomId" element={<ChatHub />} />
          <Route path="/vip-request" element={<VIPRequestForm />} />
          <Route path="/vip-requests" element={<VIPRequests />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/matchmaking" element={<MatchmakingHub />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
