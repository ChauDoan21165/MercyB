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

  useEffect(() => {
    checkAdminAccess();
    const interval = setInterval(() => {
      fetchLiveMetrics();
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
            <QuickActionButton label="Feedback Inbox" path="/admin/reports" icon={MessageSquare} />
          </div>
        </div>

        {/* CHARTS - THIRD ROW (Placeholder) */}
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
