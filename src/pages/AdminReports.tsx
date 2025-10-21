import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUserAccess } from "@/hooks/useUserAccess";
import { toast } from "sonner";
import { ArrowLeft, MessageSquare, Sparkles, Calendar, User } from "lucide-react";

interface Feedback {
  id: string;
  user_id: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
}

interface TopicRequest {
  id: string;
  user_id: string;
  tier: string;
  topic_title: string;
  topic_description: string;
  specific_goals: string | null;
  target_audience: string | null;
  urgency: string;
  additional_notes: string | null;
  status: string;
  created_at: string;
}

const AdminReports = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [topicRequests, setTopicRequests] = useState<TopicRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin } = useUserAccess();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Admin access required");
      navigate("/");
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    try {
      const [feedbackResult, topicsResult] = await Promise.all([
        supabase
          .from("feedback")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("vip_topic_requests_detailed")
          .select("*")
          .order("created_at", { ascending: false })
      ]);

      if (feedbackResult.error) throw feedbackResult.error;
      if (topicsResult.error) throw topicsResult.error;

      setFeedback(feedbackResult.data || []);
      setTopicRequests(topicsResult.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "normal": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="container max-w-7xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>

        <Card className="backdrop-blur-sm bg-card/95 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl">Admin Reports</CardTitle>
            <CardDescription>
              User feedback and custom topic requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="feedback" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="feedback">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  User Feedback ({feedback.length})
                </TabsTrigger>
                <TabsTrigger value="topics">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Topic Requests ({topicRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feedback" className="space-y-4 mt-6">
                <div className="text-sm text-muted-foreground mb-4">
                  All user feedback submitted through the feedback form
                </div>
                {feedback.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No feedback yet</p>
                ) : (
                  feedback.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">{item.message}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                              <Badge variant={item.status === "new" ? "default" : "secondary"}>
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {item.user_id.substring(0, 8)}...
                            </div>
                            {item.category && (
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 ml-auto">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="topics" className="space-y-4 mt-6">
                <div className="text-sm text-muted-foreground mb-4">
                  Custom topic requests from VIP users - prepare content based on their needs
                </div>
                {topicRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No topic requests yet</p>
                ) : (
                  topicRequests.map((request) => (
                    <Card key={request.id} className="border-l-4" style={{
                      borderLeftColor: request.tier === "vip3" ? "#10b981" : 
                                       request.tier === "vip2" ? "#3b82f6" : "#f59e0b"
                    }}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{request.topic_title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {request.topic_description}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge variant="outline">{request.tier.toUpperCase()}</Badge>
                              <Badge variant={getUrgencyColor(request.urgency)}>
                                {request.urgency}
                              </Badge>
                              <Badge variant={request.status === "pending" ? "default" : "secondary"}>
                                {request.status}
                              </Badge>
                            </div>
                          </div>

                          {request.specific_goals && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Goals:</p>
                              <p className="text-sm">{request.specific_goals}</p>
                            </div>
                          )}

                          {request.target_audience && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Target Audience:</p>
                              <p className="text-sm">{request.target_audience}</p>
                            </div>
                          )}

                          {request.additional_notes && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Additional Notes:</p>
                              <p className="text-sm">{request.additional_notes}</p>
                            </div>
                          )}

                          <Separator />

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {request.user_id.substring(0, 8)}...
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                              <Calendar className="h-3 w-3" />
                              {new Date(request.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
