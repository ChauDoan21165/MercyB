import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, TrendingUp, Users, MessageSquare, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Request {
  id: string;
  topic_name: string;
  topic_name_vi: string | null;
  description: string;
  urgency: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface Analytics {
  room_id: string;
  total_sessions: number;
  total_time_spent: number;
  avg_messages: number;
  completion_rate: number;
}

interface FeedbackNotification {
  id: string;
  feedback_id: string;
  is_read: boolean;
  created_at: string;
  feedback: {
    message: string;
    priority: string;
    created_at: string;
  };
}

interface ActiveSubscription {
  id: string;
  username: string;
  tier_name: string;
  screenshot_url: string;
  verified_at: string;
  status: string;
}

interface SuspendedUser {
  user_id: string;
  violation_score: number;
  total_violations: number;
  last_violation_at: string;
  is_suspended: boolean;
  profiles?: {
    username: string;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<FeedbackNotification[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);
  const [suspendedUsers, setSuspendedUsers] = useState<SuspendedUser[]>([]);

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

      await Promise.all([
        fetchRequests(), 
        fetchAnalytics(), 
        fetchNotifications(),
        fetchNotificationPreferences(),
        fetchActiveSubscriptions(),
        fetchSuspendedUsers()
      ]);

      // Subscribe to real-time notifications
      const channel = supabase
        .channel('admin-feedback-notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'admin_notifications'
          },
          () => fetchNotifications()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("vip_room_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
      return;
    }

    setRequests(data || []);
  };

  const fetchAnalytics = async () => {
    const { data, error } = await supabase
      .from("room_usage_analytics")
      .select("*");

    if (error) {
      console.error("Error fetching analytics:", error);
      return;
    }

    // Aggregate analytics by room_id
    const aggregated = data?.reduce((acc: Record<string, Analytics>, curr) => {
      if (!acc[curr.room_id]) {
        acc[curr.room_id] = {
          room_id: curr.room_id,
          total_sessions: 0,
          total_time_spent: 0,
          avg_messages: 0,
          completion_rate: 0,
        };
      }

      acc[curr.room_id].total_sessions++;
      acc[curr.room_id].total_time_spent += curr.time_spent_seconds || 0;
      acc[curr.room_id].avg_messages += curr.messages_sent || 0;
      if (curr.completed_room) acc[curr.room_id].completion_rate++;

      return acc;
    }, {});

    const analyticsArray = Object.values(aggregated || {}).map(a => ({
      ...a,
      avg_messages: Math.round(a.avg_messages / a.total_sessions),
      completion_rate: Math.round((a.completion_rate / a.total_sessions) * 100),
    }));

    setAnalytics(analyticsArray);
  };

  const updateRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("vip_room_requests")
        .update({
          status: newStatus,
          admin_notes: adminNotes,
        })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Request updated",
        description: "Status and notes have been saved",
      });

      setSelectedRequest(null);
      setAdminNotes("");
      setNewStatus("");
      fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive",
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('admin_notifications')
        .select(`
          id,
          feedback_id,
          is_read,
          created_at,
          feedback:feedback_id (
            message,
            priority,
            created_at
          )
        `)
        .eq('admin_user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data as any || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('admin_notification_preferences')
        .select('feedback_notifications_enabled')
        .eq('admin_user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setNotificationsEnabled(data.feedback_notifications_enabled);
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  const toggleNotifications = async (enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('admin_notification_preferences')
        .upsert({
          admin_user_id: user.id,
          feedback_notifications_enabled: enabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setNotificationsEnabled(enabled);
      toast({
        title: enabled ? "Notifications enabled" : "Notifications disabled",
        description: enabled 
          ? "You will receive notifications for new feedback" 
          : "You will not receive notifications for new feedback"
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive"
      });
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const fetchActiveSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_proof_submissions')
        .select(`
          id,
          username,
          screenshot_url,
          verified_at,
          status,
          tier_id,
          subscription_tiers (
            name
          )
        `)
        .eq('status', 'approved')
        .order('verified_at', { ascending: false });

      if (error) throw error;

      const subscriptions = data?.map(sub => ({
        id: sub.id,
        username: sub.username,
        tier_name: (sub.subscription_tiers as any)?.name || 'Unknown',
        screenshot_url: sub.screenshot_url,
        verified_at: sub.verified_at || '',
        status: sub.status
      })) || [];

      setActiveSubscriptions(subscriptions);
    } catch (error) {
      console.error('Error fetching active subscriptions:', error);
    }
  };

  const fetchSuspendedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_moderation_status')
        .select('*')
        .eq('is_suspended', true)
        .order('last_violation_at', { ascending: false });

      if (error) throw error;
      
      // Fetch usernames separately
      const usersWithNames = await Promise.all((data || []).map(async (user) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.user_id)
          .single();
        
        return {
          ...user,
          profiles: profile ? { username: profile.username } : undefined
        };
      }));
      
      setSuspendedUsers(usersWithNames as SuspendedUser[]);
    } catch (error) {
      console.error('Error fetching suspended users:', error);
    }
  };

  const unlockUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_moderation_status')
        .update({
          is_suspended: false,
          violation_score: 0,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "User unlocked",
        description: "User account has been reactivated"
      });

      fetchSuspendedUsers();
    } catch (error) {
      console.error('Error unlocking user:', error);
      toast({
        title: "Error",
        description: "Failed to unlock user account",
        variant: "destructive"
      });
    }
  };

  const getRequestsByStatus = (status: string) => {
    return requests.filter(r => r.status === status);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4" style={{ background: 'var(--gradient-admin)' }}>
      <div className="max-w-7xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/rooms")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/admin/vip-rooms")}>
              View VIP Rooms
            </Button>
            <Button onClick={() => navigate("/admin/audio")} variant="outline">
              🎵 Manage Audio
            </Button>
            <Button onClick={() => navigate("/admin/payments")} variant="outline">
              📸 Payment Verification
            </Button>
            <Button onClick={() => navigate("/admin/reports")} variant="outline">
              View Reports
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subscriptions">
              <Users className="h-4 w-4 mr-2" />
              Active Subscriptions ({activeSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Feedback Notifications
              {notifications.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests">
              <MessageSquare className="h-4 w-4 mr-2" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="moderation">
              <Users className="h-4 w-4 mr-2" />
              Suspended Users
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>
                  Users with approved payment submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeSubscriptions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No active subscriptions
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeSubscriptions.map((sub) => (
                      <Card key={sub.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{sub.username}</CardTitle>
                              <Badge variant="outline" className="mt-1">
                                {sub.tier_name}
                              </Badge>
                            </div>
                            <Badge variant="default">Active</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="text-xs text-muted-foreground">
                            Verified: {new Date(sub.verified_at).toLocaleDateString()}
                          </div>
                          {sub.screenshot_url && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium">Payment Screenshot:</p>
                              <img
                                src={sub.screenshot_url}
                                alt={`Payment proof for ${sub.username}`}
                                className="w-full h-40 object-cover rounded-md border cursor-pointer hover:opacity-80 transition"
                                onClick={() => window.open(sub.screenshot_url, '_blank')}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => window.open(sub.screenshot_url, '_blank')}
                              >
                                View Full Screenshot
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Feedback Notifications</CardTitle>
                    <CardDescription>
                      Get notified when users submit new feedback
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="notifications-toggle"
                      checked={notificationsEnabled}
                      onCheckedChange={toggleNotifications}
                    />
                    <Label htmlFor="notifications-toggle">
                      {notificationsEnabled ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No unread feedback notifications
                  </p>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <Card key={notification.id} className="border-l-4 border-l-primary">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">
                                {notification.feedback.message}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant={notification.feedback.priority === 'high' ? 'destructive' : 'outline'}>
                                  {notification.feedback.priority}
                                </Badge>
                                <span>
                                  {new Date(notification.feedback.created_at).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              Mark as Read
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suspended Users</CardTitle>
                <CardDescription>
                  Users who have been suspended for content policy violations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {suspendedUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No suspended users
                  </p>
                ) : (
                  <div className="space-y-4">
                    {suspendedUsers.map((user) => (
                      <Card key={user.user_id} className="border-l-4 border-l-destructive">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div>
                                <p className="font-medium">
                                  {(user.profiles as any)?.username || 'Unknown User'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  User ID: {user.user_id.slice(0, 8)}...
                                </p>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Total Violations</p>
                                  <p className="font-semibold">{user.total_violations}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Violation Score</p>
                                  <p className="font-semibold">{user.violation_score}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Last Violation</p>
                                  <p className="font-semibold text-xs">
                                    {new Date(user.last_violation_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => unlockUser(user.user_id)}
                              className="shrink-0"
                            >
                              Unlock Account
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              {["pending", "in_progress", "completed", "rejected"].map(status => (
                <Card key={status}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      {status.replace("_", " ").toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {getRequestsByStatus(status).length}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              {requests.map(request => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="mb-2">{request.topic_name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline">{request.urgency}</Badge>
                          <Badge>{request.status}</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request.id);
                          setAdminNotes(request.admin_notes || "");
                          setNewStatus(request.status);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{request.description}</p>

                    {selectedRequest === request.id && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Status</label>
                          <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Admin Notes</label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add notes for the user..."
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => updateRequest(request.id)}>
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(null);
                              setAdminNotes("");
                              setNewStatus("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Room Usage Analytics</CardTitle>
                <CardDescription>
                  Track which rooms are most popular and engaging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.map(stat => (
                    <div key={stat.room_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{stat.room_id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stat.total_sessions} sessions • {Math.round(stat.total_time_spent / 60)} min total
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Avg {stat.avg_messages} messages</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.completion_rate}% completion
                        </p>
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
  );
};

export default AdminDashboard;