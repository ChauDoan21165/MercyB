import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";

const VIPRequestForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    topic_name: "",
    topic_name_vi: "",
    description: "",
    urgency: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit a request",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("vip_room_requests")
        .insert({
          user_id: user.id,
          ...formData,
        });

      if (error) throw error;

      toast({
        title: "Request submitted!",
        description: "We'll review your request and get back to you soon.",
      });

      navigate("/vip-requests");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Request Custom Content</CardTitle>
            </div>
            <CardDescription>
              As a VIP1 member, you can request custom learning rooms tailored to your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic_name">Topic Name (English) *</Label>
                <Input
                  id="topic_name"
                  value={formData.topic_name}
                  onChange={(e) =>
                    setFormData({ ...formData, topic_name: e.target.value })
                  }
                  placeholder="e.g., Managing Type 2 Diabetes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic_name_vi">Topic Name (Vietnamese)</Label>
                <Input
                  id="topic_name_vi"
                  value={formData.topic_name_vi}
                  onChange={(e) =>
                    setFormData({ ...formData, topic_name_vi: e.target.value })
                  }
                  placeholder="e.g., Quản lý tiểu đường type 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what you'd like to learn, specific questions you have, or problems you're trying to solve..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, urgency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Just exploring</SelectItem>
                    <SelectItem value="medium">Medium - Would be helpful</SelectItem>
                    <SelectItem value="high">High - Need this soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VIPRequestForm;