/**
 * Admin Dashboard
 * 
 * ARCHITECTURE:
 * - Lovable Cloud = auth + users (profiles) + gift codes + user_tiers + payments
 * - Supabase = content backend (rooms, room_entries only)
 * - Stats are fetched from the admin-stats edge function
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { useUserAccess } from '@/hooks/useUserAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle2,
  Database,
  Music,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalRooms: number;
  revenueMonth: number;
}

interface AdminStatsResponse {
  ok: boolean;
  stats?: AdminStats;
  error?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useUserAccess();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  const fetchStats = async () => {
    if (!isAdmin || isLoading) return;

    setStatsLoading(true);
    setStatsError(null);
    
    try {
      console.log('[AdminDashboard] Fetching stats from edge function...');
      
      const { data, error } = await supabase.functions.invoke<AdminStatsResponse>('admin-stats');
      
      if (error) {
        console.error('[AdminDashboard] Edge function error:', error);
        setStatsError('Failed to load stats');
        return;
      }
      
      if (!data?.ok || !data?.stats) {
        console.error('[AdminDashboard] Stats error:', data?.error);
        setStatsError(data?.error || 'Failed to load stats');
        return;
      }
      
      console.log('[AdminDashboard] Stats received:', data.stats);
      setStats(data.stats);
    } catch (err) {
      console.error('[AdminDashboard] Failed to fetch stats:', err);
      setStatsError('Network error');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isAdmin, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const quickActions = [
    {
      title: 'Room Health Check',
      description: 'Validate room data integrity',
      icon: CheckCircle2,
      path: '/admin/health',
      variant: 'default' as const
    },
    {
      title: 'Payment Dashboard',
      description: 'Manage payments and subscriptions',
      icon: DollarSign,
      path: '/admin/payments',
      variant: 'default' as const
    },
    {
      title: 'User Management',
      description: 'View and manage users',
      icon: Users,
      path: '/admin/users',
      variant: 'default' as const
    },
    {
      title: 'Feedback Inbox',
      description: 'Review user feedback',
      icon: FileText,
      path: '/admin/feedback',
      variant: 'default' as const
    },
    {
      title: 'System Metrics',
      description: 'View system performance',
      icon: Activity,
      path: '/admin/metrics',
      variant: 'default' as const
    },
    {
      title: 'Audio Assets',
      description: 'Audit audio coverage',
      icon: Database,
      path: '/admin/audio-assets',
      variant: 'default' as const
    },
    {
      title: 'Music Controller',
      description: 'Manage homepage songs',
      icon: Music,
      path: '/admin/homepage-music',
      variant: 'default' as const
    }
  ];

  const formatCurrency = (amount: number) => {
    return amount > 0 ? `$${amount.toFixed(2)}` : '$0.00';
  };

  return (
    <div className="min-h-screen admin-bg">
      <ColorfulMercyBladeHeader subtitle="Admin Dashboard" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 admin-heading">Admin Dashboard</h1>
            <p className="admin-text-muted">
              {statsError ? (
                <span className="text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {statsError}
                </span>
              ) : (
                'Live data from Cloud users & Supabase rooms'
              )}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchStats}
            disabled={statsLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="admin-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 admin-text">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold admin-heading">
                {statsLoading ? '—' : stats?.totalUsers ?? 0}
              </div>
              <p className="text-xs admin-text-muted mt-1">
                {statsLoading ? 'Loading...' : 'From Cloud users'}
              </p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 admin-text">
                <Activity className="h-4 w-4" />
                Active Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold admin-heading">
                {statsLoading ? '—' : stats?.activeToday ?? 0}
              </div>
              <p className="text-xs admin-text-muted mt-1">
                {statsLoading ? 'Loading...' : 'TODO: implement tracking'}
              </p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 admin-text">
                <Database className="h-4 w-4" />
                Total Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold admin-heading">
                {statsLoading ? '—' : stats?.totalRooms ?? 0}
              </div>
              <p className="text-xs admin-text-muted mt-1">
                {statsLoading ? 'Loading...' : 'From Supabase rooms table'}
              </p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 admin-text">
                <DollarSign className="h-4 w-4" />
                Revenue (Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold admin-heading">
                {statsLoading ? '—' : formatCurrency(stats?.revenueMonth ?? 0)}
              </div>
              <p className="text-xs admin-text-muted mt-1">
                {statsLoading ? 'Loading...' : 'From Cloud payments'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 admin-heading">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.path} 
                  className="admin-card hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => navigate(action.path)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg admin-text">
                      <Icon className="h-5 w-5" />
                      {action.title}
                    </CardTitle>
                    <CardDescription className="admin-text-muted">{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant={action.variant}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(action.path);
                      }}
                    >
                      Open
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
