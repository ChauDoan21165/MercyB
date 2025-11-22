import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, TrendingUp, MessageSquare, DollarSign, Music, Shield, FileText, TestTube, Code, Palette, Gift, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LiveUsersMonitor } from "@/components/admin/LiveUsersMonitor";
import { FeedbackMessages } from "@/components/admin/FeedbackMessages";

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
      // Fetch total rooms
      const { count: roomsCount } = await supabase
        .from("chat_rooms")
        .select("*", { count: "exact", head: true });

      // Fetch total users with roles
      const { count: usersCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true });

      // Fetch pending VIP requests
      const { count: requestsCount } = await supabase
        .from("vip_room_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Fetch suspended users
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

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <AdminBreadcrumb items={[{ label: "Dashboard" }]} />
        
        <div className="mb-8 p-8 rounded-2xl" style={{ 
          background: 'var(--gradient-admin)',
          boxShadow: 'var(--shadow-rainbow)'
        }}>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            <span style={{ color: '#E91E63' }}>M</span>
            <span style={{ color: '#9C27B0' }}>e</span>
            <span style={{ color: '#3F51B5' }}>r</span>
            <span style={{ color: '#2196F3' }}>c</span>
            <span style={{ color: '#00BCD4' }}>y</span>
            {' '}
            <span style={{ color: '#009688' }}>B</span>
            <span style={{ color: '#4CAF50' }}>l</span>
            <span style={{ color: '#8BC34A' }}>a</span>
            <span style={{ color: '#FFC107' }}>d</span>
            <span style={{ color: '#FF9800' }}>e</span>
            {' Admin Dashboard'}
          </h1>
          <p className="text-white/90 mt-2 text-lg">Manage your application with colorful rainbow power</p>
        </div>

        {/* Quick Stats - Rainbow themed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:shadow-lg transition-all" style={{ borderColor: '#E91E63' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <LayoutDashboard className="h-4 w-4" style={{ color: '#E91E63' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#E91E63' }}>{stats.totalRooms}</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all" style={{ borderColor: '#2196F3' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4" style={{ color: '#2196F3' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#2196F3' }}>{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all" style={{ borderColor: '#4CAF50' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <MessageSquare className="h-4 w-4" style={{ color: '#4CAF50' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#4CAF50' }}>{stats.pendingRequests}</div>
              {stats.pendingRequests > 0 && (
                <Badge variant="destructive" className="mt-2">Needs Attention</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all" style={{ borderColor: '#FF9800' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended Users</CardTitle>
              <Shield className="h-4 w-4" style={{ color: '#FF9800' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#FF9800' }}>{stats.suspendedUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/rooms")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Room Management</CardTitle>
                  <CardDescription>Create and edit chat rooms</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage all chat rooms, create new rooms, and edit existing ones.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/code-editor")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Code Editor</CardTitle>
                  <CardDescription>Edit room JSON data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Edit room content and structure directly in JSON format.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/users")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>Manage user permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Grant or revoke admin access and manage user roles.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/stats")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>View usage analytics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor room usage, session data, and user engagement.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/vip-requests")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>VIP Requests</CardTitle>
                  <CardDescription>Review user requests</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage VIP room requests from users.
              </p>
              {stats.pendingRequests > 0 && (
                <Badge variant="destructive" className="mt-2">{stats.pendingRequests} pending</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/payments")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Payment Verification</CardTitle>
                  <CardDescription>Review payment submissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Verify and approve user payment proof submissions.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/audio-upload")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Audio Upload</CardTitle>
                  <CardDescription>Upload audio files</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload audio files for rooms and manage existing audio.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/audio-test")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TestTube className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Audio Test</CardTitle>
                  <CardDescription>Test audio files</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Test and verify audio files in VIP4 and other rooms.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/moderation")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Moderation</CardTitle>
                  <CardDescription>Manage user violations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review reports, suspend users, and manage violations.
              </p>
              {stats.suspendedUsers > 0 && (
                <Badge variant="destructive" className="mt-2">{stats.suspendedUsers} suspended</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/gift-codes")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Gift Codes</CardTitle>
                  <CardDescription>Manage VIP gift codes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate and manage VIP2/VIP3 gift codes for 1-year access.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/reports")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>View user reports</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review and take action on user-submitted reports.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/vip-rooms")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>VIP Rooms</CardTitle>
                  <CardDescription>Manage VIP content</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage premium VIP rooms and tier-specific content.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/kids-validation")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TestTube className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Kids Validation</CardTitle>
                  <CardDescription>Validate kids rooms</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check status and validation of all kids rooms and entries.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2" style={{ borderColor: '#FF6B9D' }} onClick={() => navigate("/admin/design-audit")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Palette className="h-6 w-6" style={{ color: '#FF6B9D' }} />
                </div>
                <div>
                  <CardTitle style={{ color: '#FF6B9D' }}>Design Audit</CardTitle>
                  <CardDescription>Review design issues</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check color, spacing, and layout problems to review later.
              </p>
              <Badge variant="outline" className="mt-2" style={{ borderColor: '#FF6B9D', color: '#FF6B9D' }}>For Review</Badge>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer border-2" 
            style={{ borderColor: 'hsl(var(--primary))' }}
            onClick={() => navigate("/admin/specification")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-rainbow)' }}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Room Specification</CardTitle>
                  <CardDescription>Design standards & patterns</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View the master documentation for all room, level, and feature designs.
              </p>
              <Badge 
                variant="outline" 
                className="mt-2" 
                style={{ 
                  borderImage: 'var(--gradient-rainbow) 1',
                  color: 'hsl(var(--primary))'
                }}
              >
                Master Doc
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Live Users Monitor */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">📹 Live User Monitoring</h2>
          <LiveUsersMonitor />
        </div>

        {/* Feedback Messages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">💬 User Messages</h2>
          <FeedbackMessages />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;