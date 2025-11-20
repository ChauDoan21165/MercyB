import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Activity,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Lock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  getSecurityDashboard,
  blockUser,
  unblockUser,
  revokeUserSessions,
  invalidateUserAccessCodes,
  downgradeUserTier
} from '@/utils/securityUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

const AdminSecurity = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: string;
    userId?: string;
  }>({ open: false, action: '' });
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getSecurityDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading security dashboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to load security dashboard',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionDialog.userId) return;

    try {
      switch (actionDialog.action) {
        case 'block':
          if (!blockReason.trim()) {
            toast({
              title: 'Error',
              description: 'Please provide a reason for blocking',
              variant: 'destructive'
            });
            return;
          }
          await blockUser(actionDialog.userId, blockReason);
          toast({ title: 'Success', description: 'User blocked successfully' });
          break;
        case 'unblock':
          await unblockUser(actionDialog.userId);
          toast({ title: 'Success', description: 'User unblocked successfully' });
          break;
        case 'revoke_sessions':
          await revokeUserSessions(actionDialog.userId);
          toast({ title: 'Success', description: 'All sessions revoked' });
          break;
        case 'invalidate_codes':
          await invalidateUserAccessCodes(actionDialog.userId);
          toast({ title: 'Success', description: 'Access codes invalidated' });
          break;
        case 'downgrade':
          await downgradeUserTier(actionDialog.userId);
          toast({ title: 'Success', description: 'User downgraded to free tier' });
          break;
      }
      
      setActionDialog({ open: false, action: '' });
      setBlockReason('');
      loadDashboard();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Loading security dashboard...</div>
        </div>
      </div>
    );
  }

  const stats = {
    recentFailures: dashboardData?.recentFailures?.length || 0,
    blockedUsers: dashboardData?.blockedUsers?.length || 0,
    suspiciousUsers: dashboardData?.suspiciousUsers?.length || 0,
    activeSessions: dashboardData?.activeSessions?.length || 0
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security & Monitoring</h1>
              <p className="text-muted-foreground mt-1">Monitor and respond to security threats</p>
            </div>
            <Button onClick={loadDashboard} variant="outline">
              Refresh
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Failed Logins (24h)</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentFailures}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
                <Ban className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.blockedUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
                <Shield className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.suspiciousUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSessions}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="alerts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
              <TabsTrigger value="blocked">Blocked Users</TabsTrigger>
              <TabsTrigger value="suspicious">Suspicious Activity</TabsTrigger>
              <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
              <TabsTrigger value="login-attempts">Login Attempts</TabsTrigger>
            </TabsList>

            {/* Security Alerts */}
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Security Events</CardTitle>
                  <CardDescription>Critical security events requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.securityEvents?.map((event: any) => (
                      <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              event.severity === 'critical' ? 'destructive' :
                              event.severity === 'high' ? 'destructive' :
                              event.severity === 'medium' ? 'default' : 'secondary'
                            }>
                              {event.severity}
                            </Badge>
                            <span className="font-medium">{event.event_type}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(event.created_at).toLocaleString()}
                          </p>
                          {event.ip_address && (
                            <p className="text-sm text-muted-foreground">IP: {event.ip_address}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blocked Users */}
            <TabsContent value="blocked">
              <Card>
                <CardHeader>
                  <CardTitle>Blocked Users</CardTitle>
                  <CardDescription>Users currently blocked from the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.blockedUsers?.map((user: any) => (
                      <div key={user.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{user.profiles?.email}</div>
                          <p className="text-sm text-muted-foreground">{user.blocked_reason}</p>
                          <p className="text-sm text-muted-foreground">
                            Blocked: {new Date(user.blocked_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => setActionDialog({
                            open: true,
                            action: 'unblock',
                            userId: user.user_id
                          })}
                          variant="outline"
                          size="sm"
                        >
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suspicious Activity */}
            <TabsContent value="suspicious">
              <Card>
                <CardHeader>
                  <CardTitle>Suspicious Users</CardTitle>
                  <CardDescription>Users with unusual activity patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.suspiciousUsers?.map((user: any) => (
                      <div key={user.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{user.profiles?.email}</div>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>Failed Logins: {user.failed_login_count}</span>
                            <span>Suspicious Events: {user.suspicious_activity_count}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setActionDialog({
                              open: true,
                              action: 'revoke_sessions',
                              userId: user.user_id
                            })}
                            variant="outline"
                            size="sm"
                          >
                            Revoke Sessions
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedUser(user);
                              setActionDialog({
                                open: true,
                                action: 'block',
                                userId: user.user_id
                              });
                            }}
                            variant="destructive"
                            size="sm"
                          >
                            Block
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Active Sessions */}
            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Users currently logged in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.activeSessions?.map((session: any) => (
                      <div key={session.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{session.profiles?.email}</div>
                          <div className="text-sm text-muted-foreground">
                            <div>Device: {session.device_type}</div>
                            <div>Last Active: {new Date(session.last_activity).toLocaleString()}</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => setActionDialog({
                            open: true,
                            action: 'revoke_sessions',
                            userId: session.user_id
                          })}
                          variant="outline"
                          size="sm"
                        >
                          Revoke
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Login Attempts */}
            <TabsContent value="login-attempts">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Login Attempts</CardTitle>
                  <CardDescription>All login attempts in the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recentAttempts?.slice(0, 50).map((attempt: any) => (
                      <div key={attempt.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {attempt.success ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <span className="font-medium">{attempt.email}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <div>IP: {attempt.ip_address}</div>
                            <div>{new Date(attempt.created_at).toLocaleString()}</div>
                            {!attempt.success && attempt.failure_reason && (
                              <div className="text-destructive">Reason: {attempt.failure_reason}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Action Dialog */}
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'block' && 'Block User'}
              {actionDialog.action === 'unblock' && 'Unblock User'}
              {actionDialog.action === 'revoke_sessions' && 'Revoke Sessions'}
              {actionDialog.action === 'invalidate_codes' && 'Invalidate Access Codes'}
              {actionDialog.action === 'downgrade' && 'Downgrade User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'block' && (
                <div className="space-y-4 pt-4">
                  <p>This will block the user from accessing the system.</p>
                  <div>
                    <label className="text-sm font-medium">Reason for blocking:</label>
                    <Input
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="Enter reason..."
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
              {actionDialog.action === 'unblock' && 'This will restore the user\'s access to the system.'}
              {actionDialog.action === 'revoke_sessions' && 'This will log the user out of all devices.'}
              {actionDialog.action === 'invalidate_codes' && 'This will deactivate all access codes for this user.'}
              {actionDialog.action === 'downgrade' && 'This will downgrade the user to the free tier.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSecurity;
