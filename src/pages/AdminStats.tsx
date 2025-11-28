import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, DollarSign, Crown, MessageSquare, TrendingUp, LayoutDashboard, Home, Gift, BookOpen, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';
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
  const [versionIndicator, setVersionIndicator] = useState('A');
  const [updatingVersion, setUpdatingVersion] = useState(false);

  useEffect(() => {
    checkAdminAndFetchStats();
    fetchVersionIndicator();
  }, []);

  const fetchVersionIndicator = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'version_indicator')
        .single();

      if (error) throw error;
      if (data) setVersionIndicator(data.setting_value);
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  const updateVersionIndicator = async () => {
    if (!versionIndicator || versionIndicator.length !== 1) {
      toast.error('Version must be a single character');
      return;
    }

    try {
      setUpdatingVersion(true);
      const { error } = await supabase
        .from('app_settings')
        .update({ setting_value: versionIndicator.toUpperCase() })
        .eq('setting_key', 'version_indicator');

      if (error) throw error;
      toast.success('Version indicator updated');
    } catch (error) {
      console.error('Error updating version:', error);
      toast.error('Failed to update version');
    } finally {
      setUpdatingVersion(false);
    }
  };

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
    <AdminLayout>
      <div className="min-h-screen p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-black">Admin Statistics</h1>
              <p className="text-gray-600">Mercy Mind Link Analytics & Metrics</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="gap-2 border-black text-black hover:bg-gray-100"
              >
                <Home className="h-4 w-4" />
                Main Dashboard
              </Button>
              <Button onClick={() => navigate('/admin/gift-codes')} variant="outline" className="gap-2 border-black text-black hover:bg-gray-100">
                <Gift className="h-4 w-4" />
                Gift Codes
              </Button>
              <Button onClick={() => navigate('/admin/specification')} variant="outline" className="gap-2 border-black text-black hover:bg-gray-100">
                <BookOpen className="h-4 w-4" />
                Specification
              </Button>
              <Button onClick={() => navigate('/admin/system-metrics')} variant="outline" className="border-black text-black hover:bg-gray-100">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                System Metrics
              </Button>
              <Button onClick={() => navigate('/admin/rooms')} variant="outline" className="border-black text-black hover:bg-gray-100">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Room Management
              </Button>
            </div>
          </div>
  
          {/* Version Indicator Control */}
          <Card className="mb-6 border-2 border-black bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <RefreshCw className="h-5 w-5 text-black" />
                Version Indicator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Update the version indicator visible to all users. Use a single character (A-Z recommended).
              </p>
              <div className="flex gap-2">
                <Input
                  value={versionIndicator}
                  onChange={(e) => setVersionIndicator(e.target.value.slice(0, 1).toUpperCase())}
                  maxLength={1}
                  className="w-20 text-center text-lg font-bold"
                  placeholder="A"
                />
                <Button 
                  onClick={updateVersionIndicator}
                  disabled={updatingVersion}
                >
                  {updatingVersion ? 'Updating...' : 'Update Version'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Users */}
            <Card className="border-2 border-black bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">Total Users</CardTitle>
                <Users className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stats?.totalUsers}</div>
                <p className="text-xs text-gray-600">
                  +{stats?.newUsersThisMonth} this month
                </p>
              </CardContent>
            </Card>
  
            {/* Total Payments */}
            <Card className="border-2 border-black bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">Active Subscriptions</CardTitle>
                <DollarSign className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stats?.totalPayments}</div>
                <p className="text-xs text-gray-600">
                  ${stats?.revenueThisMonth} this month
                </p>
              </CardContent>
            </Card>
  
            {/* VIP Users */}
            <Card className="border-2 border-black bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">VIP Users</CardTitle>
                <Crown className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-black">
                    <span>VIP1:</span>
                    <span className="font-bold">{stats?.vipUsers.vip1}</span>
                  </div>
                  <div className="flex justify-between text-sm text-black">
                    <span>VIP2:</span>
                    <span className="font-bold">{stats?.vipUsers.vip2}</span>
                  </div>
                  <div className="flex justify-between text-sm text-black">
                    <span>VIP3:</span>
                    <span className="font-bold">{stats?.vipUsers.vip3}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Feedback */}
            <Card className="border-2 border-black bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">Feedback Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stats?.feedbackCount}</div>
                <p className="text-xs text-gray-600">Total messages</p>
              </CardContent>
            </Card>
  
            {/* Topic Requests */}
            <Card className="border-2 border-black bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">Topic Requests</CardTitle>
                <TrendingUp className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stats?.topicRequests}</div>
                <p className="text-xs text-gray-600">Custom topics requested</p>
              </CardContent>
            </Card>
          </div>
  
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
  
            <Button
              onClick={() => navigate('/admin/moderation')}
              className="h-auto py-4"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-base font-semibold">User Moderation</span>
                <span className="text-xs text-muted-foreground">Locked users & payments</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;
