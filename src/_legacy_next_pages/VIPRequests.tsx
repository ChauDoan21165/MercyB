import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
  updated_at: string;
}

const VIPRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your requests",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("vip_room_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/rooms")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Button>
          <Button onClick={() => navigate("/vip-request")}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Content Requests</h1>
          <p className="text-muted-foreground">
            Track your custom room requests and their status
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't submitted any requests yet
              </p>
              <Button onClick={() => navigate("/vip-request")}>
                Submit Your First Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {request.topic_name}
                        {request.topic_name_vi && (
                          <span className="text-sm text-muted-foreground ml-2">
                            ({request.topic_name_vi})
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Description:</p>
                    <p className="text-sm text-muted-foreground">
                      {request.description}
                    </p>
                  </div>

                  {request.admin_notes && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Admin Notes:</p>
                      <p className="text-sm text-muted-foreground">
                        {request.admin_notes}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Submitted: {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VIPRequests;