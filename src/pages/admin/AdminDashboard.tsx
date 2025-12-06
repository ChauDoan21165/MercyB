import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { useUserAccess } from '@/hooks/useUserAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Users, 
  DollarSign, 
  FileText, 
  Settings,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Database,
  Music
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useUserAccess();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

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

  return (
    <div className="min-h-screen admin-bg">
      <ColorfulMercyBladeHeader subtitle="Admin Dashboard" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 admin-heading">Admin Dashboard</h1>
          <p className="admin-text-muted">System overview and quick actions</p>
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
              <div className="text-2xl font-bold admin-heading">—</div>
              <p className="text-xs admin-text-muted mt-1">
                Loading...
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
              <div className="text-2xl font-bold admin-heading">—</div>
              <p className="text-xs admin-text-muted mt-1">
                Loading...
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
              <div className="text-2xl font-bold admin-heading">—</div>
              <p className="text-xs admin-text-muted mt-1">
                Loading...
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
              <div className="text-2xl font-bold admin-heading">—</div>
              <p className="text-xs admin-text-muted mt-1">
                Loading...
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
