import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const PromoCode = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error("Please enter a promo code");
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

      // Check if code exists and is valid
      const { data: promoData, error: promoError } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (promoError || !promoData) {
        toast.error("Invalid or expired promo code");
        return;
      }

      // Check if already redeemed
      const { data: existingRedemption } = await supabase
        .from("user_promo_redemptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("promo_code_id", promoData.id)
        .single();

      if (existingRedemption) {
        toast.error("You've already redeemed this code");
        return;
      }

      // Check max redemptions
      if (promoData.current_redemptions >= promoData.max_redemptions) {
        toast.error("This promo code has reached its maximum redemptions");
        return;
      }

      // Redeem the code
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { error: redeemError } = await supabase
        .from("user_promo_redemptions")
        .insert({
          user_id: user.id,
          promo_code_id: promoData.id,
          daily_question_limit: promoData.daily_question_limit,
          expires_at: expiresAt.toISOString()
        });

      if (redeemError) throw redeemError;

      // Update promo code redemption count
      await supabase
        .from("promo_codes")
        .update({ current_redemptions: promoData.current_redemptions + 1 })
        .eq("id", promoData.id);

      toast.success(`Success! You now have ${promoData.daily_question_limit} questions per day for 1 year!`);
      setCode("");
      
    } catch (error: any) {
      console.error("Redemption error:", error);
      toast.error("Failed to redeem code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="container max-w-2xl mx-auto py-8">
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
            <CardTitle className="text-2xl">Redeem Promo Code</CardTitle>
            <CardDescription>
              Enter your promotional code to unlock additional questions per day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter promo code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-lg"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleRedeem}
              disabled={isLoading || !code.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Redeeming..." : "Redeem Code"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromoCode;
