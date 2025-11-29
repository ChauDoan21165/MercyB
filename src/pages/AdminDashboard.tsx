import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle, TrendingUp, MessageSquare, DollarSign, Users, LayoutDashboard, Music, Code, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LiveMetrics {
  totalUsers: number;
  newUsersToday: number;
  activeToday: number;
  totalRooms: number;
  roomsZeroAudio: number;
  roomsLowHealth: number;
  revenueToday: number;
  revenueMonth: number;
  pendingPayouts: number;
}

interface TopRoom {
  rank: number;
  roomId: string;
  title: string;
  sessionsThisWeek: number;
  changeVsLastWeek: number;
}

interface TierRevenue {
  tier: string;
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalEver: number;
}

const CODE_FILES = [
  { index: 1, path: "src/App.tsx", purpose: "Main app router, defines all routes", exports: "App (default)", lines: 180, tags: "core, routing" },
  { index: 2, path: "src/pages/Homepage.tsx", purpose: "Homepage with tier sections + search", exports: "Homepage (default)", lines: 450, tags: "homepage, ui" },
  { index: 3, path: "src/pages/ChatHub.tsx", purpose: "Room chat interface (entries, keywords, audio)", exports: "ChatHub (default)", lines: 650, tags: "rooms, chat, core" },
  { index: 4, path: "src/pages/VIP9.tsx", purpose: "VIP9 tier page with 4 strategic domains", exports: "VIP9 (default)", lines: 380, tags: "vip9, tier" },
  { index: 5, path: "src/pages/KidsEnglishTiers.tsx", purpose: "Kids English tier navigation page", exports: "KidsEnglishTiers (default)", lines: 320, tags: "kids, tier" },
  { index: 6, path: "src/pages/VIP1Rooms.tsx", purpose: "VIP1 tier room listing page", exports: "VIP1Rooms (default)", lines: 280, tags: "vip1, tier" },
  { index: 7, path: "src/pages/VIP2Rooms.tsx", purpose: "VIP2 tier room listing page", exports: "VIP2Rooms (default)", lines: 280, tags: "vip2, tier" },
  { index: 8, path: "src/pages/VIP3Rooms.tsx", purpose: "VIP3 tier room listing page", exports: "VIP3Rooms (default)", lines: 280, tags: "vip3, tier" },
  { index: 9, path: "src/pages/VIP4Rooms.tsx", purpose: "VIP4 tier room listing page", exports: "VIP4Rooms (default)", lines: 280, tags: "vip4, tier" },
  { index: 10, path: "src/pages/VIP5Rooms.tsx", purpose: "VIP5 tier room listing page", exports: "VIP5Rooms (default)", lines: 280, tags: "vip5, tier" },
  { index: 11, path: "src/pages/VIP6Rooms.tsx", purpose: "VIP6 tier room listing page", exports: "VIP6Rooms (default)", lines: 280, tags: "vip6, tier" },
  { index: 12, path: "src/pages/FreeRooms.tsx", purpose: "Free tier room listing page", exports: "FreeRooms (default)", lines: 250, tags: "free, tier" },
  { index: 13, path: "src/pages/Profile.tsx", purpose: "User profile page (subscription, settings)", exports: "Profile (default)", lines: 420, tags: "auth, profile" },
  { index: 14, path: "src/pages/PaymentSuccess.tsx", purpose: "Payment success confirmation page", exports: "PaymentSuccess (default)", lines: 180, tags: "payment, success" },
  { index: 15, path: "src/pages/PaymentTest.tsx", purpose: "Admin payment test page (sandbox mode)", exports: "PaymentTest (default)", lines: 350, tags: "payment, admin, test" },
  { index: 16, path: "src/pages/TierMap.tsx", purpose: "Visual tier map with hand-drawn background", exports: "TierMap (default)", lines: 320, tags: "tier, map, ui" },
  { index: 17, path: "src/pages/SearchResults.tsx", purpose: "Search results page for rooms/keywords", exports: "SearchResults (default)", lines: 280, tags: "search, ui" },
  { index: 18, path: "src/pages/AuthCallback.tsx", purpose: "Auth callback handler for OAuth flows", exports: "AuthCallback (default)", lines: 120, tags: "auth, oauth" },
  { index: 19, path: "src/pages/admin/AdminDashboard.tsx", purpose: "Main admin dashboard with live metrics", exports: "AdminDashboard (default)", lines: 485, tags: "admin, dashboard" },
  { index: 20, path: "src/pages/admin/UnifiedHealthCheck.tsx", purpose: "Room Health Check with sync + deep scan", exports: "UnifiedHealthCheck (default)", lines: 850, tags: "admin, health, validation" },
  { index: 21, path: "src/pages/admin/AdminUsers.tsx", purpose: "Admin user management list", exports: "AdminUsers (default)", lines: 340, tags: "admin, users" },
  { index: 22, path: "src/pages/admin/MusicManager.tsx", purpose: "Music file manager with favorites + player", exports: "MusicManager (default)", lines: 620, tags: "admin, music" },
  { index: 23, path: "src/pages/admin/AdminCodeEditor.tsx", purpose: "JSON room editor for admins", exports: "AdminCodeEditor (default)", lines: 280, tags: "admin, json, editor" },
  { index: 24, path: "src/components/VirtualizedRoomGrid.tsx", purpose: "Virtualized room grid with color toggle", exports: "VirtualizedRoomGrid (default)", lines: 320, tags: "rooms, grid, ui" },
  { index: 25, path: "src/components/RoomSearch.tsx", purpose: "Search box with tier/room/admin suggestions", exports: "RoomSearch (default)", lines: 280, tags: "search, ui" },
  { index: 26, path: "src/components/BackButton.tsx", purpose: "Global back button component", exports: "BackButton (default)", lines: 80, tags: "navigation, ui" },
  { index: 27, path: "src/components/HomeButton.tsx", purpose: "Global home button component", exports: "HomeButton (default)", lines: 80, tags: "navigation, ui" },
  { index: 28, path: "src/components/AdminFloatingButton.tsx", purpose: "Floating admin button with notifications", exports: "AdminFloatingButton (default)", lines: 220, tags: "admin, ui" },
  { index: 29, path: "src/components/ColorfulMercyBladeHeader.tsx", purpose: "Colorful header for room pages", exports: "ColorfulMercyBladeHeader (default)", lines: 150, tags: "ui, header" },
  { index: 30, path: "src/components/kids/KidsLevelCard.tsx", purpose: "Kids level selection card", exports: "KidsLevelCard (default)", lines: 180, tags: "kids, ui" },
  { index: 31, path: "src/components/kids/KidsRoomCard.tsx", purpose: "Kids room card component", exports: "KidsRoomCard (default)", lines: 220, tags: "kids, ui" },
  { index: 32, path: "src/components/payment/PaymentModal.tsx", purpose: "Payment modal with PayPal/USDT options", exports: "PaymentModal (default)", lines: 480, tags: "payment, modal" },
  { index: 33, path: "src/components/payment/PaymentProofForm.tsx", purpose: "Payment proof upload form", exports: "PaymentProofForm (default)", lines: 320, tags: "payment, form" },
  { index: 34, path: "src/components/tiers/TierCard.tsx", purpose: "Subscription tier card component", exports: "TierCard (default)", lines: 280, tags: "tier, ui" },
  { index: 35, path: "src/components/homepage/HeroSection.tsx", purpose: "Homepage hero banner", exports: "HeroSection (default)", lines: 150, tags: "homepage, hero" },
  { index: 36, path: "src/components/homepage/TierSection.tsx", purpose: "Homepage tier showcase section", exports: "TierSection (default)", lines: 220, tags: "homepage, tier" },
  { index: 37, path: "src/components/onboarding/OnboardingFlow.tsx", purpose: "3-step onboarding for first-time users", exports: "OnboardingFlow (default)", lines: 380, tags: "onboarding, ui" },
  { index: 38, path: "src/components/admin/AdminLayout.tsx", purpose: "Admin layout wrapper with sidebar", exports: "AdminLayout (default)", lines: 150, tags: "admin, layout" },
  { index: 39, path: "src/components/admin/AdminSidebar.tsx", purpose: "Admin navigation sidebar", exports: "AdminSidebar (default)", lines: 280, tags: "admin, sidebar" },
  { index: 40, path: "src/components/admin/AdminRoute.tsx", purpose: "Admin route guard (role check)", exports: "AdminRoute (default)", lines: 120, tags: "admin, auth" },
  { index: 41, path: "src/components/admin/AdminBreadcrumb.tsx", purpose: "Admin breadcrumb navigation", exports: "AdminBreadcrumb (default)", lines: 80, tags: "admin, ui" },
  { index: 42, path: "src/lib/roomLoader.ts", purpose: "Core room data loader with tier enforcement", exports: "loadMergedRoom, loadRoomManifest", lines: 420, tags: "core, rooms, data" },
  { index: 43, path: "src/lib/constants/tiers.ts", purpose: "Tier definitions + pricing constants", exports: "TIERS, TIER_FEATURES", lines: 180, tags: "tiers, constants" },
  { index: 44, path: "src/lib/constants/roomManifest.ts", purpose: "Room manifest (all room metadata)", exports: "ROOM_MANIFEST", lines: 1200, tags: "rooms, manifest" },
  { index: 45, path: "src/lib/validation/roomValidator.ts", purpose: "Room data validation logic", exports: "validateRoom, validateEntry", lines: 280, tags: "validation, rooms" },
  { index: 46, path: "src/lib/scripts/validateRoomData.ts", purpose: "CLI script for room data validation", exports: "N/A (CLI)", lines: 320, tags: "validation, cli" },
  { index: 47, path: "src/hooks/useUserAccess.ts", purpose: "Hook for checking user tier access", exports: "useUserAccess", lines: 180, tags: "auth, hooks" },
  { index: 48, path: "src/hooks/useAuth.ts", purpose: "Hook for user authentication state", exports: "useAuth", lines: 150, tags: "auth, hooks" },
  { index: 49, path: "src/hooks/use-toast.ts", purpose: "Toast notification hook", exports: "useToast, toast", lines: 120, tags: "ui, hooks" },
  { index: 50, path: "src/integrations/supabase/client.ts", purpose: "Supabase client initialization", exports: "supabase", lines: 80, tags: "backend, db" },
  { index: 51, path: "src/integrations/supabase/types.ts", purpose: "Database TypeScript types", exports: "Database, Tables", lines: 2400, tags: "backend, types" },
  { index: 52, path: "src/components/ui/button.tsx", purpose: "shadcn Button component", exports: "Button", lines: 60, tags: "ui, shadcn" },
  { index: 53, path: "src/components/ui/card.tsx", purpose: "shadcn Card components", exports: "Card, CardHeader, CardContent", lines: 80, tags: "ui, shadcn" },
  { index: 54, path: "src/components/ui/dialog.tsx", purpose: "shadcn Dialog/Modal component", exports: "Dialog, DialogContent", lines: 120, tags: "ui, shadcn" },
  { index: 55, path: "src/components/ui/input.tsx", purpose: "shadcn Input component", exports: "Input", lines: 50, tags: "ui, shadcn" },
  { index: 56, path: "src/components/ui/table.tsx", purpose: "shadcn Table components", exports: "Table, TableHeader, TableRow", lines: 90, tags: "ui, shadcn" },
  { index: 57, path: "src/components/ui/scroll-area.tsx", purpose: "shadcn ScrollArea component", exports: "ScrollArea", lines: 60, tags: "ui, shadcn" },
  { index: 58, path: "src/components/ui/select.tsx", purpose: "shadcn Select/Dropdown component", exports: "Select, SelectTrigger, SelectContent", lines: 140, tags: "ui, shadcn" },
  { index: 59, path: "src/components/ui/checkbox.tsx", purpose: "shadcn Checkbox component", exports: "Checkbox", lines: 50, tags: "ui, shadcn" },
  { index: 60, path: "src/components/ui/toast.tsx", purpose: "shadcn Toast notification component", exports: "Toast, Toaster", lines: 180, tags: "ui, shadcn" },
  { index: 61, path: "src/pages/admin/AdminFeedback.tsx", purpose: "Admin feedback inbox management", exports: "AdminFeedback (default)", lines: 420, tags: "admin, feedback" },
  { index: 62, path: "src/pages/admin/AdminPayments.tsx", purpose: "Admin payment verification dashboard", exports: "AdminPayments (default)", lines: 480, tags: "admin, payment" },
  { index: 63, path: "src/pages/admin/AdminRoomSpecification.tsx", purpose: "Admin room specification manager", exports: "AdminRoomSpecification (default)", lines: 350, tags: "admin, rooms" },
  { index: 64, path: "src/pages/admin/MusicApproval.tsx", purpose: "Admin music upload approval queue", exports: "MusicApproval (default)", lines: 380, tags: "admin, music" },
  { index: 65, path: "src/components/analytics/DashboardMetrics.tsx", purpose: "Dashboard analytics metrics display", exports: "DashboardMetrics (default)", lines: 220, tags: "analytics, admin" },
  { index: 66, path: "src/lib/utils.ts", purpose: "Utility functions (cn, formatters)", exports: "cn, formatDate", lines: 120, tags: "utils" },
  { index: 67, path: "src/components/ui/badge.tsx", purpose: "shadcn Badge component", exports: "Badge", lines: 40, tags: "ui, shadcn" },
  { index: 68, path: "src/components/ui/separator.tsx", purpose: "shadcn Separator component", exports: "Separator", lines: 30, tags: "ui, shadcn" },
  { index: 69, path: "src/components/ui/sidebar.tsx", purpose: "shadcn Sidebar components", exports: "Sidebar, SidebarProvider", lines: 280, tags: "ui, shadcn" },
  { index: 70, path: "src/pages/LegalTerms.tsx", purpose: "Terms of Service legal page", exports: "LegalTerms (default)", lines: 180, tags: "legal" },
  { index: 71, path: "src/pages/LegalPrivacy.tsx", purpose: "Privacy Policy legal page", exports: "LegalPrivacy (default)", lines: 180, tags: "legal" },
  { index: 72, path: "src/pages/LegalRefund.tsx", purpose: "Refund Policy legal page", exports: "LegalRefund (default)", lines: 180, tags: "legal" },
  { index: 73, path: "src/components/AudioPlayer.tsx", purpose: "Global audio player component", exports: "AudioPlayer (default)", lines: 220, tags: "audio, ui" },
  { index: 74, path: "src/pages/admin/KidsRoomHealthCheck.tsx", purpose: "Kids room health check page", exports: "KidsRoomHealthCheck (default)", lines: 320, tags: "admin, kids, health" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<LiveMetrics>({
    totalUsers: 0,
    newUsersToday: 0,
    activeToday: 0,
    totalRooms: 0,
    roomsZeroAudio: 0,
    roomsLowHealth: 0,
    revenueToday: 0,
    revenueMonth: 0,
    pendingPayouts: 0,
  });
  const [topRooms, setTopRooms] = useState<TopRoom[]>([]);
  const [tierRevenue, setTierRevenue] = useState<TierRevenue[]>([]);
  const [showCodeFiles, setShowCodeFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
    const interval = setInterval(() => {
      fetchLiveMetrics();
      fetchTopRooms();
      fetchTierRevenue();
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = roles?.some(r => r.role === "admin");

      if (!isAdmin) {
        toast({
          title: "Access denied",
          description: "Admin access required",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await fetchLiveMetrics();
      await fetchTopRooms();
      await fetchTierRevenue();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveMetrics = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthStartISO = monthStart.toISOString();

      // Users metrics
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: newUsersToday } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO);

      const { count: activeToday } = await supabase
        .from("user_sessions")
        .select("*", { count: "exact", head: true })
        .gte("last_activity", todayISO);

      // Rooms metrics
      const { count: totalRooms } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true });

      // Revenue metrics (placeholder - update when payment tables exist)
      const { data: paymentsToday } = await supabase
        .from("payment_transactions")
        .select("amount")
        .gte("created_at", todayISO)
        .eq("status", "completed");

      const { data: paymentsMonth } = await supabase
        .from("payment_transactions")
        .select("amount")
        .gte("created_at", monthStartISO)
        .eq("status", "completed");

      const { count: pendingPayouts } = await supabase
        .from("payment_proof_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const revenueToday = paymentsToday?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const revenueMonth = paymentsMonth?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setMetrics({
        totalUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        activeToday: activeToday || 0,
        totalRooms: totalRooms || 0,
        roomsZeroAudio: 0, // Will be calculated by health check
        roomsLowHealth: 0, // Will be calculated by health check
        revenueToday,
        revenueMonth,
        pendingPayouts: pendingPayouts || 0,
      });
    } catch (error) {
      console.error("Error fetching live metrics:", error);
    }
  };

  const fetchTopRooms = async () => {
    try {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 7);
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 14);

      // Get sessions this week
      const { data: thisWeekData } = await supabase
        .from("room_usage_analytics")
        .select("room_id")
        .gte("session_start", weekStart.toISOString());

      // Get sessions last week
      const { data: lastWeekData } = await supabase
        .from("room_usage_analytics")
        .select("room_id")
        .gte("session_start", lastWeekStart.toISOString())
        .lt("session_start", weekStart.toISOString());

      // Count sessions by room
      const thisWeekCounts: Record<string, number> = {};
      const lastWeekCounts: Record<string, number> = {};

      thisWeekData?.forEach(row => {
        thisWeekCounts[row.room_id] = (thisWeekCounts[row.room_id] || 0) + 1;
      });

      lastWeekData?.forEach(row => {
        lastWeekCounts[row.room_id] = (lastWeekCounts[row.room_id] || 0) + 1;
      });

      // Get top 10 rooms
      const sortedRooms = Object.entries(thisWeekCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      // Fetch room titles
      const roomIds = sortedRooms.map(([id]) => id);
      const { data: rooms } = await supabase
        .from("rooms")
        .select("id, title_en")
        .in("id", roomIds);

      const roomTitles = new Map(rooms?.map(r => [r.id, r.title_en]) || []);

      const topRoomsData: TopRoom[] = sortedRooms.map(([roomId, count], index) => {
        const lastWeekCount = lastWeekCounts[roomId] || 0;
        const change = lastWeekCount === 0 ? 100 : ((count - lastWeekCount) / lastWeekCount) * 100;
        
        return {
          rank: index + 1,
          roomId,
          title: roomTitles.get(roomId) || roomId,
          sessionsThisWeek: count,
          changeVsLastWeek: Math.round(change)
        };
      });

      setTopRooms(topRoomsData);
    } catch (error) {
      console.error("Error fetching top rooms:", error);
    }
  };

  const fetchTierRevenue = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 7);
      const weekStartISO = weekStart.toISOString();

      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthStartISO = monthStart.toISOString();

      const tiers = ['vip1', 'vip2', 'vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'usdt'];

      const revenueData: TierRevenue[] = [];

      for (const tier of tiers) {
        const isUsdt = tier === 'usdt';
        const tierFilter = isUsdt 
          ? { payment_method: 'usdt' }
          : { tier_id: tier };

        // Today
        const { data: todayData } = await supabase
          .from("payment_transactions")
          .select("amount")
          .match(tierFilter)
          .gte("created_at", todayISO)
          .eq("status", "completed");

        // This week
        const { data: weekData } = await supabase
          .from("payment_transactions")
          .select("amount")
          .match(tierFilter)
          .gte("created_at", weekStartISO)
          .eq("status", "completed");

        // This month
        const { data: monthData } = await supabase
          .from("payment_transactions")
          .select("amount")
          .match(tierFilter)
          .gte("created_at", monthStartISO)
          .eq("status", "completed");

        // Total ever
        const { data: totalData } = await supabase
          .from("payment_transactions")
          .select("amount")
          .match(tierFilter)
          .eq("status", "completed");

        revenueData.push({
          tier: tier.toUpperCase(),
          today: todayData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
          thisWeek: weekData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
          thisMonth: monthData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
          totalEver: totalData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
        });
      }

      setTierRevenue(revenueData);
    } catch (error) {
      console.error("Error fetching tier revenue:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const MetricCard = ({ label, value, icon: Icon, alert }: { label: string; value: number | string; icon: any; alert?: boolean }) => (
    <Card className={`border-2 ${alert ? 'border-red-500 bg-red-50' : 'border-black bg-white'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-black text-black">{value}</div>
      </CardContent>
    </Card>
  );

  const QuickActionButton = ({ label, path, icon: Icon }: { label: string; path: string; icon: any }) => (
    <Button
      onClick={() => navigate(path)}
      className="w-full h-24 text-lg font-bold bg-black text-white hover:bg-gray-800 border-2 border-black"
    >
      <Icon className="mr-2 h-6 w-6" />
      {label}
    </Button>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <AdminBreadcrumb items={[{ label: "Dashboard" }]} />
        
        {/* LIVE METRICS - TOP ROW */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">📊 Live Metrics (Auto-refresh 5s)</h2>
          
          {/* Users Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <MetricCard label="Total Users" value={metrics.totalUsers} icon={Users} />
            <MetricCard label="New Users Today" value={metrics.newUsersToday} icon={TrendingUp} />
            <MetricCard label="Active Today" value={metrics.activeToday} icon={Activity} />
          </div>

          {/* Rooms Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <MetricCard label="Total Rooms" value={metrics.totalRooms} icon={LayoutDashboard} />
            <MetricCard label="Rooms 0% Audio" value={metrics.roomsZeroAudio} icon={AlertCircle} alert={metrics.roomsZeroAudio > 0} />
            <MetricCard label="Rooms <50% Health" value={metrics.roomsLowHealth} icon={AlertCircle} alert={metrics.roomsLowHealth > 0} />
          </div>

          {/* Revenue Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard label="Revenue Today" value={`$${metrics.revenueToday}`} icon={DollarSign} />
            <MetricCard label="Revenue This Month" value={`$${metrics.revenueMonth}`} icon={DollarSign} />
            <MetricCard label="Pending Payouts" value={metrics.pendingPayouts} icon={AlertCircle} alert={metrics.pendingPayouts > 0} />
          </div>
        </div>

        {/* QUICK ACTIONS - SECOND ROW */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <QuickActionButton label="Room Health Check" path="/admin/health" icon={LayoutDashboard} />
            <QuickActionButton label="Payment Dashboard" path="/admin/payments" icon={DollarSign} />
            <QuickActionButton label="User List" path="/admin/users" icon={Users} />
            <QuickActionButton label="Feedback Inbox" path="/admin/feedback" icon={MessageSquare} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <QuickActionButton label="Room Specification" path="/admin/room-specification" icon={Activity} />
            <QuickActionButton label="Music Approval" path="/admin/music-approval" icon={Music} />
            <QuickActionButton label="Music Manager" path="/admin/music-manager" icon={Music} />
            <Button
              onClick={() => setShowCodeFiles(!showCodeFiles)}
              className="w-full h-24 text-lg font-bold bg-black text-white hover:bg-gray-800 border-2 border-black"
            >
              <Code className="mr-2 h-6 w-6" />
              Code Files Browser
              {showCodeFiles ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* CODE FILES BROWSER */}
        {showCodeFiles && (
          <div>
            <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">📂 Code Files Browser (74 Files)</h2>
            <Card className="border-2 border-black bg-white">
              <ScrollArea className="h-[600px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white border-b-2 border-black">
                    <tr>
                      <th className="text-left p-3 font-bold text-black text-xs w-12">#</th>
                      <th className="text-left p-3 font-bold text-black text-xs">File Path</th>
                      <th className="text-left p-3 font-bold text-black text-xs">Purpose</th>
                      <th className="text-left p-3 font-bold text-black text-xs">Main Exports</th>
                      <th className="text-right p-3 font-bold text-black text-xs w-20">Lines</th>
                      <th className="text-left p-3 font-bold text-black text-xs">Tags</th>
                      <th className="text-center p-3 font-bold text-black text-xs w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CODE_FILES.map((file, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 text-xs font-mono text-gray-600">{file.index}</td>
                        <td className="p-3 text-xs font-mono text-black">{file.path}</td>
                        <td className="p-3 text-xs text-gray-700">{file.purpose}</td>
                        <td className="p-3 text-xs font-mono text-gray-600">{file.exports}</td>
                        <td className="p-3 text-xs text-right text-gray-600">{file.lines}</td>
                        <td className="p-3 text-xs">
                          <div className="flex flex-wrap gap-1">
                            {file.tags.split(', ').map((tag, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs border border-gray-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            onClick={() => setSelectedFile(file.path)}
                            size="sm"
                            variant="outline"
                            className="border-black text-black hover:bg-gray-100 text-xs"
                          >
                            <Code className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </Card>
          </div>
        )}

        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] bg-white border-2 border-black">
            <DialogHeader>
              <DialogTitle className="text-black font-mono text-sm">{selectedFile}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[70vh]">
              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <p className="text-xs text-gray-600 mb-2">
                  Full file content will be loaded here. Copy this path and use it with another AI for editing.
                </p>
                <pre className="text-xs font-mono text-black bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                  {selectedFile}
                </pre>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedFile || '');
                    toast({ title: "Copied!", description: "File path copied to clipboard" });
                  }}
                  className="mt-3 border-black text-black bg-white hover:bg-gray-100"
                  variant="outline"
                >
                  Copy Path to Clipboard
                </Button>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* TOP 10 ROOMS THIS WEEK */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">🏆 Top 10 Rooms This Week</h2>
          <Card className="border-2 border-black bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left p-4 font-bold text-black">Rank</th>
                    <th className="text-left p-4 font-bold text-black">Room Title</th>
                    <th className="text-right p-4 font-bold text-black">Sessions This Week</th>
                    <th className="text-right p-4 font-bold text-black">% Change vs Last Week</th>
                  </tr>
                </thead>
                <tbody>
                  {topRooms.map((room) => (
                    <tr key={room.roomId} className="border-b border-gray-200">
                      <td className="p-4 font-bold text-black">{room.rank}</td>
                      <td className="p-4 text-black">{room.title}</td>
                      <td className="p-4 text-right font-bold text-black">{room.sessionsThisWeek}</td>
                      <td className={`p-4 text-right font-bold ${room.changeVsLastWeek >= 0 ? 'text-black' : 'text-gray-600'}`}>
                        {room.changeVsLastWeek > 0 ? '+' : ''}{room.changeVsLastWeek}%
                      </td>
                    </tr>
                  ))}
                  {topRooms.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-400">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* REVENUE BY TIER */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">💰 Revenue by Tier</h2>
          <Card className="border-2 border-black bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left p-4 font-bold text-black">Tier</th>
                    <th className="text-right p-4 font-bold text-black">Today</th>
                    <th className="text-right p-4 font-bold text-black">This Week</th>
                    <th className="text-right p-4 font-bold text-black">This Month</th>
                    <th className="text-right p-4 font-bold text-black">Total Ever</th>
                  </tr>
                </thead>
                <tbody>
                  {tierRevenue.map((tier) => (
                    <tr key={tier.tier} className="border-b border-gray-200">
                      <td className="p-4 font-bold text-black">{tier.tier}</td>
                      <td className="p-4 text-right font-bold text-black">${tier.today}</td>
                      <td className="p-4 text-right font-bold text-black">${tier.thisWeek}</td>
                      <td className="p-4 text-right font-bold text-black">${tier.thisMonth}</td>
                      <td className="p-4 text-right font-bold text-black">${tier.totalEver}</td>
                    </tr>
                  ))}
                  {tierRevenue.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-400">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* CHARTS - TRENDS ROW (Placeholder) */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">📈 Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-black bg-white p-6">
              <h3 className="text-sm font-bold text-gray-600 mb-2">USER GROWTH (7-DAY)</h3>
              <div className="h-32 flex items-center justify-center text-gray-400">
                Chart coming soon
              </div>
            </Card>
            <Card className="border-2 border-black bg-white p-6">
              <h3 className="text-sm font-bold text-gray-600 mb-2">DAILY ACTIVE USERS</h3>
              <div className="h-32 flex items-center justify-center text-gray-400">
                Chart coming soon
              </div>
            </Card>
            <Card className="border-2 border-black bg-white p-6">
              <h3 className="text-sm font-bold text-gray-600 mb-2">REVENUE TREND</h3>
              <div className="h-32 flex items-center justify-center text-gray-400">
                Chart coming soon
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
