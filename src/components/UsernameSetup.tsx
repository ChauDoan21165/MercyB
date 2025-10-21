import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface UsernameSetupProps {
  onComplete: () => void;
}

export const UsernameSetup = ({ onComplete }: UsernameSetupProps) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize and sanitize input (trim spaces, remove zero-width chars)
    const cleaned = username
      .normalize('NFKC')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .trim();

    if (cleaned !== username) {
      setUsername(cleaned);
    }
    
    if (cleaned.length < 3 || cleaned.length > 30) {
      toast.error("Username must be between 3 and 30 characters");
      return;
    }

    // Check if username contains only valid characters
    if (!/^[a-zA-Z0-9_]+$/.test(cleaned)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ username: cleaned })
        .eq("id", user.id);

      if (error) {
        console.error("Username error:", error);
        if (error.code === "23505") {
          toast.error(`"${cleaned}" is already taken. Please choose another username.`);
        } else if (error.message) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("Failed to set username. Please try again.");
        }
        return;
      }

      toast.success("Username set successfully!");
      onComplete();
    } catch (error: any) {
      console.error("Username setup error:", error);
      toast.error("Failed to set username. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedUsernames = [
    "MindfulWarrior", "ZenSeeker", "WellnessWizard", "HealthHero",
    "CalmNavigator", "LifeLearner", "WiseWanderer", "PeacefulPioneer"
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>Choose Your Username</CardTitle>
          </div>
          <CardDescription>
            Pick a username that reflects your character / Chọn tên đại diện tính cách của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username (3-30 characters)</Label>
              <Input
                id="username"
                placeholder="your_unique_name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
                required
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedUsernames.map((suggested) => (
                  <Button
                    key={suggested}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUsername(suggested)}
                  >
                    {suggested}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || username.length < 3}
              className="w-full"
            >
              {isLoading ? "Setting up..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
