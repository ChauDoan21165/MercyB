import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Crown, MessageSquare, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Stats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalPayments: number;
  revenueThisMonth: number;
  vipUsers: { vip1: number; vip2: number; vip3: number };
  feedbackCount: number;
  topicRequests: number;
}

const AdminStats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAndFetchStats();
  }, []);

  const checkAdminAndFetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in');
        navigate('/auth');
        return;
      }

      // Check admin role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      if (!roles || roles.length === 0) {
        toast.error('Access denied - Admin only');
        navigate('/');
        return;
      }

      await fetchStats();
    } catch (error) {
      console.error('Error checking admin:', error);
      navigate('/');
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // New users this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth.toISOString());

      // Total payments (from user_subscriptions)
      const { count: totalPayments } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Revenue this month (approximate from subscription_tiers)
      const { data: activeSubscriptions } = await supabase
        .from('user_subscriptions')
        .select('tier_id, subscription_tiers(price_monthly)')
        .eq('status', 'active')
        .gte('current_period_start', firstDayOfMonth.toISOString());

      const revenueThisMonth = activeSubscriptions?.reduce(
        (sum, sub: any) => sum + (sub.subscription_tiers?.price_monthly || 0),
        0
      ) || 0;

      // VIP users by tier
      const { data: vipData } = await supabase
        .from('user_subscriptions')
        .select('tier_id, subscription_tiers(name)')
        .eq('status', 'active');

      const vipUsers = {
        vip1: vipData?.filter((s: any) => s.subscription_tiers?.name === 'VIP1').length || 0,
        vip2: vipData?.filter((s: any) => s.subscription_tiers?.name === 'VIP2').length || 0,
        vip3: vipData?.filter((s: any) => s.subscription_tiers?.name === 'VIP3').length || 0,
      };

      // Feedback count
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true });

      // Topic requests
      const { count: topicRequests } = await supabase
        .from('vip_room_requests')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: totalUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        totalPayments: totalPayments || 0,
        revenueThisMonth,
        vipUsers,
        feedbackCount: feedbackCount || 0,
        topicRequests: topicRequests || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--gradient-admin)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Mercy Mind Link Statistics</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.newUsersThisMonth} this month
              </p>
            </CardContent>
          </Card>

          {/* Total Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPayments}</div>
              <p className="text-xs text-muted-foreground">
                ${stats?.revenueThisMonth} this month
              </p>
            </CardContent>
          </Card>

          {/* VIP Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Users</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>VIP1:</span>
                  <span className="font-bold">{stats?.vipUsers.vip1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VIP2:</span>
                  <span className="font-bold">{stats?.vipUsers.vip2}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VIP3:</span>
                  <span className="font-bold">{stats?.vipUsers.vip3}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.feedbackCount}</div>
              <p className="text-xs text-muted-foreground">Total messages</p>
            </CardContent>
          </Card>

          {/* Topic Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Topic Requests</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.topicRequests}</div>
              <p className="text-xs text-muted-foreground">Custom topics requested</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate('/admin')}
            className="h-auto py-4"
            variant="outline"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-base font-semibold">Analytics Dashboard</span>
              <span className="text-xs text-muted-foreground">View detailed analytics</span>
            </div>
          </Button>
          
          <Button
            onClick={() => navigate('/admin/vip-rooms')}
            className="h-auto py-4"
            variant="outline"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-base font-semibold">VIP Room Requests</span>
              <span className="text-xs text-muted-foreground">Manage custom topics</span>
            </div>
          </Button>

          <Button
            onClick={() => navigate('/admin/reports')}
            className="h-auto py-4"
            variant="outline"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-base font-semibold">User Reports</span>
              <span className="text-xs text-muted-foreground">View user feedback</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
