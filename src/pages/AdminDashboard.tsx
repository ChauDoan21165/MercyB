import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, AlertCircle, Users, DollarSign, Database, 
  Shield, MessageSquare, Settings, Code, FileText,
  Music, Heart, Lock, UserCog, Gift, Zap,
  BarChart3, Server, Gauge, Search, Home as HomeIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  activeSubscriptions: number;
  systemReadiness: number;
  moderationQueue: number;
}

// Component for clickable stat cards
const StatCard = ({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  onClick,
  badge 
}: { 
  title: string;
  value: string | number;
  subtext?: string;
  icon: any;
  onClick?: () => void;
  badge?: number;
}) => (
  <Card 
    className={`${onClick ? 'cursor-pointer hover:border-primary transition-all' : ''}`}
    onClick={onClick}
  >
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        {badge !== undefined && badge > 0 && (
          <Badge variant="destructive">{badge}</Badge>
        )}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{title}</p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      )}
    </CardContent>
  </Card>
);

// Component for action buttons
const QuickActionButton = ({ 
  label, 
  icon: Icon, 
  onClick 
}: { 
  label: string;
  icon: any;
  onClick: () => void;
}) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    className="whitespace-nowrap"
  >
    <Icon className="h-4 w-4 mr-2" />
    {label}
  </Button>
);

// Component for section tiles
const SectionTile = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  metric,
  subtext
}: { 
  title: string;
  description: string;
  icon: any;
  onClick: () => void;
  metric?: string;
  subtext?: string;
}) => (
  <Card 
    className="cursor-pointer hover:border-primary transition-all"
    onClick={onClick}
  >
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <Icon className="h-5 w-5 text-muted-foreground" />
        {metric && (
          <span className="text-xs text-muted-foreground">{metric}</span>
        )}
      </div>
      <CardTitle className="text-base mt-2">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-xs text-muted-foreground">{description}</p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1 italic">{subtext}</p>
      )}
    </CardContent>
  </Card>
);

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
    activeSubscriptions: 0,
    systemReadiness: 92, // TODO: Calculate from system-metrics endpoint
    moderationQueue: 0,
  });

  const checkAdminAccess = useCallback(async () => {
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
  }, [navigate, toast]);

  const fetchLiveMetrics = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthStartISO = monthStart.toISOString();

      // Parallelize all queries for speed
      const [
        usersResult,
        newUsersResult,
        activeUsersResult,
        roomsResult,
        paymentsTodayResult,
        paymentsMonthResult,
        pendingPayoutsResult,
        activeSubscriptionsResult,
        moderationQueueResult,
        healthSummaryResult,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
        supabase.from("user_sessions").select("*", { count: "exact", head: true }).gte("last_activity", todayISO),
        supabase.from("rooms").select("*", { count: "exact", head: true }),
        supabase.from("payment_transactions").select("amount").gte("created_at", todayISO).eq("status", "completed"),
        supabase.from("payment_transactions").select("amount").gte("created_at", monthStartISO).eq("status", "completed"),
        supabase.from("payment_proof_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("user_moderation_violations").select("*", { count: "exact", head: true }).is("action_taken", null),
        supabase.functions.invoke('room-health-summary'),
      ]);

      const revenueToday = paymentsTodayResult.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const revenueMonth = paymentsMonthResult.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Extract room health metrics from edge function response
      const healthData = healthSummaryResult.data || {};
      const roomsZeroAudio = healthData.rooms_zero_audio ?? 0;
      const roomsLowHealth = healthData.rooms_low_health ?? 0;
      const vipTrackGaps = healthData.vip_track_gaps_count ?? 0;

      setMetrics({
        totalUsers: usersResult.count || 0,
        newUsersToday: newUsersResult.count || 0,
        activeToday: activeUsersResult.count || 0,
        totalRooms: roomsResult.count || 0,
        roomsZeroAudio,
        roomsLowHealth,
        revenueToday,
        revenueMonth,
        pendingPayouts: pendingPayoutsResult.count || 0,
        activeSubscriptions: activeSubscriptionsResult.count || 0,
        systemReadiness: vipTrackGaps === 0 && roomsLowHealth === 0 && roomsZeroAudio === 0 ? 100 : 92,
        moderationQueue: moderationQueueResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching live metrics:", error);
    }
  }, []);

  useEffect(() => {
    checkAdminAccess();
    const interval = setInterval(fetchLiveMetrics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [checkAdminAccess, fetchLiveMetrics]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading admin dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-7xl px-4 py-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Control Center</h1>
          <p className="text-muted-foreground mt-1">System overview and management</p>
        </div>

        {/* 1. Live Snapshot Row */}
        <section>
          <h2 className="text-lg font-semibold mb-4">📊 Live Snapshot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={metrics.totalUsers}
              subtext={`+${metrics.newUsersToday} today | ${metrics.activeToday} active`}
              icon={Users}
              onClick={() => navigate("/admin/users")}
            />
            <StatCard
              title="Subscriptions & Revenue"
              value={`$${metrics.revenueToday.toFixed(2)}`}
              subtext={`${metrics.activeSubscriptions} active | $${metrics.revenueMonth.toFixed(2)} this month`}
              icon={DollarSign}
              onClick={() => navigate("/admin/payments")}
              badge={metrics.pendingPayouts}
            />
            <StatCard
              title="Rooms Health"
              value={metrics.totalRooms}
              subtext={`${metrics.roomsZeroAudio} no audio | ${metrics.roomsLowHealth} low health`}
              icon={Database}
              onClick={() => navigate("/admin/health-dashboard")}
            />
            <StatCard
              title="System Readiness"
              value={`${metrics.systemReadiness}%`}
              subtext="Uptime & performance"
              icon={Gauge}
              onClick={() => navigate("/admin/system-health")}
            />
          </div>
        </section>

        <Separator />

        {/* 2. Quick Actions Strip */}
        <section>
          <h2 className="text-lg font-semibold mb-4">⚡ Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <QuickActionButton
              label="Room Health Check"
              icon={Activity}
              onClick={() => navigate("/admin/health-dashboard")}
            />
            <QuickActionButton
              label="Payment Dashboard"
              icon={DollarSign}
              onClick={() => navigate("/admin/payment-monitoring")}
            />
            <QuickActionButton
              label="User List"
              icon={Users}
              onClick={() => navigate("/admin/users")}
            />
            <QuickActionButton
              label="Feedback Inbox"
              icon={MessageSquare}
              onClick={() => navigate("/admin/feedback")}
            />
            <QuickActionButton
              label="Moderation Queue"
              icon={Shield}
              onClick={() => navigate("/admin/moderation")}
            />
            <QuickActionButton
              label="Room Specification"
              icon={FileText}
              onClick={() => navigate("/admin/room-specification")}
            />
            <QuickActionButton
              label="Music Approval"
              icon={Heart}
              onClick={() => navigate("/admin/music-approval")}
            />
            <QuickActionButton
              label="Music Manager"
              icon={Music}
              onClick={() => navigate("/admin/music-manager")}
            />
            <QuickActionButton
              label="Code Editor"
              icon={Code}
              onClick={() => navigate("/admin/code-editor")}
            />
          </div>
        </section>

        <Separator />

        {/* 3. Content & Room Management */}
        <section>
          <h2 className="text-lg font-semibold mb-4">🏠 Content & Room Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SectionTile
              title="Room Management"
              description="Manage all rooms across all tiers"
              icon={Database}
              onClick={() => navigate("/admin/rooms")}
              metric={`${metrics.totalRooms} total`}
            />
            <SectionTile
              title="VIP Rooms Overview"
              description="VIP1-VIP9 room management"
              icon={HomeIcon}
              onClick={() => navigate("/admin/vip-rooms")}
            />
            <SectionTile
              title="Design Audit"
              description="Check UI consistency & quality"
              icon={Search}
              onClick={() => navigate("/admin/design-audit")}
            />
            <SectionTile
              title="Spec Doc"
              description="Room specification standard"
              icon={FileText}
              onClick={() => navigate("/admin/specification")}
            />
          </div>
        </section>

        {/* 4. Users & Access Management */}
        <section>
          <h2 className="text-lg font-semibold mb-4">👥 Users & Access Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SectionTile
              title="Users & Profiles"
              description="Manage user accounts & profiles"
              icon={Users}
              onClick={() => navigate("/admin/users")}
              metric={`${metrics.totalUsers} users`}
            />
            <SectionTile
              title="User Roles"
              description="Admin & role management"
              icon={UserCog}
              onClick={() => navigate("/admin/user-roles")}
            />
            <SectionTile
              title="Security Dashboard"
              description="Monitor security events"
              icon={Shield}
              onClick={() => navigate("/security-dashboard")}
            />
            <SectionTile
              title="Gift Codes"
              description="Manage access codes & gifts"
              icon={Gift}
              onClick={() => navigate("/admin/gift-codes")}
            />
          </div>
        </section>

        {/* 5. Payments & Revenue */}
        <section>
          <h2 className="text-lg font-semibold mb-4">💰 Payments & Revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SectionTile
              title="Payment Monitoring"
              description="Real-time payment tracking"
              icon={BarChart3}
              onClick={() => navigate("/admin/payment-monitoring")}
            />
            <SectionTile
              title="Payments Overview"
              description="Transaction history & analytics"
              icon={DollarSign}
              onClick={() => navigate("/admin/payments")}
              metric={`$${metrics.revenueMonth.toFixed(0)} this month`}
            />
            <SectionTile
              title="Payment Verification"
              description="Verify payment proofs"
              icon={Activity}
              onClick={() => navigate("/admin/payment-verification")}
              metric={`${metrics.pendingPayouts} pending`}
            />
            <SectionTile
              title="Subscription Tiers"
              description="Manage tier pricing & features"
              icon={Settings}
              onClick={() => navigate("/tiers")}
              metric={`${metrics.activeSubscriptions} active`}
            />
          </div>
        </section>

        {/* 6. Safety & Moderation */}
        <section>
          <h2 className="text-lg font-semibold mb-4">🛡️ Safety & Moderation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SectionTile
              title="Moderation Queue"
              description="Review flagged content"
              icon={AlertCircle}
              onClick={() => navigate("/admin/moderation")}
              metric={metrics.moderationQueue > 0 ? `${metrics.moderationQueue} pending` : "All clear"}
            />
            <SectionTile
              title="User Reports"
              description="Handle user-submitted reports"
              icon={MessageSquare}
              onClick={() => navigate("/admin/reports")}
            />
            <SectionTile
              title="Locked Users"
              description="Security & access control"
              icon={Lock}
              onClick={() => navigate("/admin/security")}
            />
            <SectionTile
              title="Feedback Analytics"
              description="Analyze user feedback trends"
              icon={BarChart3}
              onClick={() => navigate("/admin/feedback-analytics")}
            />
          </div>
        </section>

        {/* 7. System & DevOps */}
        <section>
          <h2 className="text-lg font-semibold mb-4">⚙️ System & DevOps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SectionTile
              title="System Metrics"
              description="View runtime performance"
              icon={Server}
              onClick={() => navigate("/admin/system-metrics")}
            />
            <SectionTile
              title="System Health"
              description="Check runtime health & errors"
              icon={Activity}
              onClick={() => navigate("/admin/system-health")}
              metric={`${metrics.systemReadiness}%`}
            />
            <SectionTile
              title="Edge Functions"
              description="Manage serverless functions"
              icon={Code}
              onClick={() => navigate("/admin/edge-functions")}
            />
            <SectionTile
              title="Health Dashboard"
              description="Room validation & sync"
              icon={Gauge}
              onClick={() => navigate("/admin/health-dashboard")}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <SectionTile
              title="Kids Room Health"
              description="Kids content validation"
              icon={Heart}
              onClick={() => navigate("/admin/kids-room-health")}
            />
            <SectionTile
              title="App Metrics"
              description="Application-wide metrics"
              icon={BarChart3}
              onClick={() => navigate("/admin/app-metrics")}
            />
          </div>
        </section>

        {/* 8. Configuration & Experiments */}
        <section>
          <h2 className="text-lg font-semibold mb-4">🔧 Configuration & Experiments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Version
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">v2.1.0</p>
                <p className="text-xs text-muted-foreground mt-1">Latest stable</p>
              </CardContent>
            </Card>
            <SectionTile
              title="Room Specification"
              description="JSON standard & rules"
              icon={FileText}
              onClick={() => navigate("/admin/specification")}
            />
            <Card className="opacity-60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Global Banner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 9. Audit & Logs */}
        <section>
          <h2 className="text-lg font-semibold mb-4">📋 Audit & Logs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SectionTile
              title="Audit Log"
              description="Admin actions & changes"
              icon={FileText}
              onClick={() => navigate("/admin/audit-log")}
            />
            <SectionTile
              title="AI Usage & Costs"
              description="Track AI model usage & expenses"
              icon={BarChart3}
              onClick={() => navigate("/admin/ai-usage")}
            />
            <SectionTile
              title="Security Events"
              description="Login attempts, violations"
              icon={Shield}
              onClick={() => navigate("/admin/security")}
            />
          </div>
        </section>

        {/* 10. Backup & Data Safety */}
        <section>
          <h2 className="text-lg font-semibold mb-4">💾 Backup & Data Safety</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="opacity-60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Backups & Snapshots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">DB backup & restore</p>
                <p className="text-xs text-muted-foreground mt-1 italic">TODO: wire up backup timestamp</p>
              </CardContent>
            </Card>
            <Card className="opacity-60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Data Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Export rooms, users, logs</p>
                <p className="text-xs text-muted-foreground mt-1 italic">Coming soon</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 11. Compliance & Policy */}
        <section>
          <h2 className="text-lg font-semibold mb-4">⚖️ Compliance & Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SectionTile
              title="Terms & Privacy"
              description="Legal documents & versions"
              icon={FileText}
              onClick={() => navigate("/terms")}
              subtext="Active: v1.0"
            />
            <SectionTile
              title="Privacy Policy"
              description="View privacy terms"
              icon={Shield}
              onClick={() => navigate("/privacy")}
            />
            <SectionTile
              title="Refund Policy"
              description="View refund terms"
              icon={DollarSign}
              onClick={() => navigate("/refund")}
            />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
