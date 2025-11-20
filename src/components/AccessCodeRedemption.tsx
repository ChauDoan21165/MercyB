import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Gift } from "lucide-react";

export const AccessCodeRedemption = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast({
        title: "Please enter a code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('redeem-access-code', {
        body: { code: code.trim().toUpperCase() }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Code redeemed successfully!",
          description: `You now have ${data.tier} access for ${data.days} days.`
        });
        setCode("");
        
        // Refresh the page to update user access
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to redeem code");
      }
    } catch (error: any) {
      console.error("Redemption error:", error);
      toast({
        title: "Failed to redeem code",
        description: error.message || "Invalid or expired code",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Redeem Access Code
        </CardTitle>
        <CardDescription>
          Enter your MB-TIER-DAYS-XXXX code to unlock premium access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="MB-VIP1-30-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRedeem();
              }
            }}
          />
          <Button onClick={handleRedeem} disabled={loading || !code.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Redeeming...
              </>
            ) : (
              "Redeem"
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Access codes are case-insensitive and follow the format: MB-TIER-DAYS-RANDOM
        </p>
      </CardContent>
    </Card>
  );
};
