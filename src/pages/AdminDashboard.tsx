import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, TrendingUp, MessageSquare, DollarSign, Music, Shield, FileText, TestTube, Code, Palette, Gift, BookOpen, Bell, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LiveUsersMonitor } from "@/components/admin/LiveUsersMonitor";
import { FeedbackMessages } from "@/components/admin/FeedbackMessages";
import { NotificationPreferences } from "@/components/admin/NotificationPreferences";
import { VIP9RoomUpload } from "@/components/admin/VIP9RoomUpload";
import { TestPurchasePanel } from "@/components/admin/TestPurchasePanel";

interface DashboardStats {
  totalRooms: number;
  totalUsers: number;
  pendingRequests: number;
  suspendedUsers: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    totalUsers: 0,
    pendingRequests: 0,
    suspendedUsers: 0,
  });

  useEffect(() => {
    checkAdminAccess();
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

      await fetchDashboardStats();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const { count: roomsCount } = await supabase
        .from("chat_rooms")
        .select("*", { count: "exact", head: true });

      const { count: usersCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true });

      const { count: requestsCount } = await supabase
        .from("vip_room_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { count: suspendedCount } = await supabase
        .from("user_moderation_status")
        .select("*", { count: "exact", head: true })
        .eq("is_suspended", true);

      setStats({
        totalRooms: roomsCount || 0,
        totalUsers: usersCount || 0,
        pendingRequests: requestsCount || 0,
        suspendedUsers: suspendedCount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const cardStyle = "border-2 border-black bg-white hover:shadow-lg transition-shadow cursor-pointer";
  const iconBgStyle = "p-3 bg-gray-100 border border-black rounded-lg";
  const iconStyle = "h-6 w-6 text-black";
  const titleStyle = "text-black font-bold";
  const descStyle = "text-gray-600";
  const textStyle = "text-sm text-gray-700";

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <AdminBreadcrumb items={[{ label: "Dashboard" }]} />
        
        <div className="mb-8 p-8 rounded-2xl bg-black border-2 border-black">
          <h1 className="text-5xl font-bold text-white">
            Mercy Blade Admin Dashboard
          </h1>
          <p className="text-white mt-2 text-lg">Professional Admin Control Panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-black bg-white hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-black">Total Rooms</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{stats.totalRooms}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black bg-white hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-black">Total Users</CardTitle>
              <Users className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black bg-white hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-black">Pending Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{stats.pendingRequests}</div>
              {stats.pendingRequests > 0 && (
                <Badge variant="outline" className="mt-2 border-black text-black">Needs Attention</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-black bg-white hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-black">Suspended Users</CardTitle>
              <Shield className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{stats.suspendedUsers}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <TestPurchasePanel />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Room Management", desc: "Create and edit chat rooms", icon: LayoutDashboard, path: "/admin/rooms", text: "Manage all chat rooms, create new rooms, and edit existing ones." },
            { title: "Code Editor", desc: "Edit room JSON data", icon: Code, path: "/admin/code-editor", text: "Edit room content and structure directly in JSON format." },
            { title: "User Roles", desc: "Manage user permissions", icon: Users, path: "/admin/users", text: "Grant or revoke admin access and manage user roles." },
            { title: "Statistics", desc: "View usage analytics", icon: TrendingUp, path: "/admin/stats", text: "Monitor room usage, session data, and user engagement." },
            { title: "VIP Requests", desc: "Review user requests", icon: MessageSquare, path: "/vip-requests", text: "View and manage VIP room requests from users.", badge: stats.pendingRequests > 0 ? `${stats.pendingRequests} pending` : null },
            { title: "Payment Verification", desc: "Review payment submissions", icon: DollarSign, path: "/admin/payments", text: "Verify and approve user payment proof submissions." },
            { title: "Audio Upload", desc: "Upload audio files", icon: Music, path: "/admin/audio-upload", text: "Upload audio files for rooms and manage existing audio." },
            { title: "Audio Test", desc: "Test audio files", icon: TestTube, path: "/audio-test", text: "Test and verify audio files in VIP4 and other rooms." },
            { title: "Moderation", desc: "Manage user violations", icon: Shield, path: "/admin/moderation", text: "Review reports, suspend users, and manage violations.", badge: stats.suspendedUsers > 0 ? `${stats.suspendedUsers} suspended` : null },
            { title: "Gift Codes", desc: "Manage VIP gift codes", icon: Gift, path: "/admin/gift-codes", text: "Generate and manage VIP2/VIP3 gift codes for 1-year access." },
            { title: "Reports", desc: "View user reports", icon: FileText, path: "/admin/reports", text: "Review and take action on user-submitted reports." },
            { title: "VIP Rooms", desc: "Manage VIP content", icon: LayoutDashboard, path: "/admin/vip-rooms", text: "Manage premium VIP rooms and tier-specific content." },
            { title: "Kids Validation", desc: "Validate kids rooms", icon: TestTube, path: "/kids-validation", text: "Check status and validation of all kids rooms and entries." },
            { title: "Design Audit", desc: "Review design issues", icon: Palette, path: "/admin/design-audit", text: "Check color, spacing, and layout problems to review later.", badgeText: "For Review" },
            { title: "App Metrics", desc: "Application scale overview", icon: BarChart3, path: "/admin/app-metrics", text: "View infrastructure metrics: tiers, rooms, entries, edge functions, and system scale.", badgeText: "Infrastructure" },
            { title: "Room Specification", desc: "Design standards & patterns", icon: BookOpen, path: "/admin/specification", text: "View the master documentation for all room, level, and feature designs.", badgeText: "Master Doc" },
            { title: "Notification Settings", desc: "Customize alert sounds", icon: Bell, path: "#", text: "Configure sound notifications and choose alert tones for admin alerts." }
          ].map((item, idx) => (
            <Card key={idx} className={cardStyle} onClick={() => item.path !== "#" && navigate(item.path)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={iconBgStyle}>
                    <item.icon className={iconStyle} />
                  </div>
                  <div>
                    <CardTitle className={titleStyle}>{item.title}</CardTitle>
                    <CardDescription className={descStyle}>{item.desc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={textStyle}>{item.text}</p>
                {item.badge && (
                  <Badge variant="outline" className="mt-2 border-black text-black">{item.badge}</Badge>
                )}
                {item.badgeText && (
                  <Badge variant="outline" className="mt-2 border-black text-black">{item.badgeText}</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-black">📤 VIP9 Room Upload</h2>
          <VIP9RoomUpload />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black">🔔 Notification Preferences</h2>
          <NotificationPreferences />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black">📹 Live User Monitoring</h2>
          <LiveUsersMonitor />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black">💬 User Messages</h2>
          <FeedbackMessages />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
