import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, Users, MessageSquare } from "lucide-react";
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);

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

      await Promise.all([fetchRequests(), fetchAnalytics()]);
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
            <Button onClick={() => navigate("/admin/payments")} variant="outline">
              📸 Payment Verification
            </Button>
            <Button onClick={() => navigate("/admin/reports")} variant="outline">
              View Reports
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">
              <MessageSquare className="h-4 w-4 mr-2" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

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