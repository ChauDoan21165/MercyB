import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserAccess";

const VIPTopicRequest = () => {
  const [formData, setFormData] = useState({
    tier: "",
    topicTitle: "",
    topicDescription: "",
    specificGoals: "",
    targetAudience: "",
    urgency: "medium",
    additionalNotes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [maxRequests, setMaxRequests] = useState(0);
  const navigate = useNavigate();
  const { tier, loading } = useUserAccess();

  useEffect(() => {
    const checkRequestLimit = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Set max requests based on tier
      const limits = { vip1: 1, vip2: 2, vip3: 3, free: 0 };
      setMaxRequests(limits[tier] || 0);

      // Count existing requests for this user
      const { data, error } = await supabase
        .from("vip_topic_requests_detailed")
        .select("id", { count: "exact" })
        .eq("user_id", user.id);

      if (!error && data) {
        setRequestCount(data.length);
      }
    };

    if (!loading) {
      checkRequestLimit();
    }
  }, [tier, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tier || !formData.topicTitle || !formData.topicDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if user has reached their limit
    if (requestCount >= maxRequests) {
      toast.error(`You've reached your limit of ${maxRequests} topic request${maxRequests > 1 ? 's' : ''}. Upgrade your tier for more requests!`);
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login first");
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("vip_topic_requests_detailed")
        .insert({
          user_id: user.id,
          tier: formData.tier,
          topic_title: formData.topicTitle,
          topic_description: formData.topicDescription,
          specific_goals: formData.specificGoals,
          target_audience: formData.targetAudience,
          urgency: formData.urgency,
          additional_notes: formData.additionalNotes
        });

      if (error) throw error;

      toast.success("Topic request submitted successfully! We'll prepare your custom content soon.");
      setRequestCount(prev => prev + 1);
      navigate("/");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="container max-w-3xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="backdrop-blur-sm bg-card/95 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Request Custom VIP Topic</CardTitle>
                <CardDescription>
                  Tell us exactly what you need - the more detail, the better we can serve you!
                </CardDescription>
              </div>
            </div>
            {maxRequests > 0 && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium">
                  Requests used: {requestCount} / {maxRequests}
                </p>
              </div>
            )}
            {maxRequests === 0 && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  You need a VIP subscription to request custom topics. Please upgrade your account.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tier">Your VIP Tier *</Label>
                <Select value={formData.tier} onValueChange={(value) => setFormData({...formData, tier: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vip1">VIP 1</SelectItem>
                    <SelectItem value="vip2">VIP 2</SelectItem>
                    <SelectItem value="vip3">VIP 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topicTitle">Topic Title *</Label>
                <Input
                  id="topicTitle"
                  placeholder="e.g., Managing Anxiety in Social Situations"
                  value={formData.topicTitle}
                  onChange={(e) => setFormData({...formData, topicTitle: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topicDescription">Detailed Description *</Label>
                <Textarea
                  id="topicDescription"
                  placeholder="Describe what you want to learn about. Be as specific as possible - include your current challenges, what you've tried before, and what success looks like to you."
                  value={formData.topicDescription}
                  onChange={(e) => setFormData({...formData, topicDescription: e.target.value})}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specificGoals">Specific Goals (Optional)</Label>
                <Textarea
                  id="specificGoals"
                  placeholder="What specific outcomes are you hoping for? e.g., 'Be able to speak in front of 20+ people without panic attacks'"
                  value={formData.specificGoals}
                  onChange={(e) => setFormData({...formData, specificGoals: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Who Is This For? (Optional)</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Working professionals in their 30s, Parents of toddlers, etc."
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - No rush</SelectItem>
                    <SelectItem value="medium">Medium - Within a month</SelectItem>
                    <SelectItem value="high">High - As soon as possible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any other context, preferences, or questions you'd like to share with us"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>💡 Pro Tip:</strong> The more details you provide, the better we can tailor the content to your needs. 
                  Include examples, context, and specific situations you want help with.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || requestCount >= maxRequests || maxRequests === 0}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Submitting..." : requestCount >= maxRequests ? "Limit Reached" : "Submit Topic Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VIPTopicRequest;
