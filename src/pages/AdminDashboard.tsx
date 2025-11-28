import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle, TrendingUp, MessageSquare, DollarSign, Users, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminLayout } from "@/components/admin/AdminLayout";

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
        </div>

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
