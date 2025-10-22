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

      // Validate code server-side using secure function
      const { data: validationResult, error: validationError } = await supabase
        .rpc("validate_promo_code", { code_input: code.toUpperCase() });

      const result = validationResult as any;

      if (validationError || !result?.valid) {
        toast.error(result?.error || "Invalid or expired promo code");
        return;
      }

      // Redeem the code
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { error: redeemError } = await supabase
        .from("user_promo_redemptions")
        .insert({
          user_id: user.id,
          promo_code_id: result.promo_code_id,
          daily_question_limit: result.daily_question_limit,
          total_question_limit: result.daily_question_limit,
          total_questions_used: 0,
          expires_at: expiresAt.toISOString()
        });

      if (redeemError) throw redeemError;

      // Increment promo code usage
      const { data: promoData } = await supabase
        .from("promo_codes")
        .select("current_redemptions")
        .eq("id", result.promo_code_id)
        .single();
      
      if (promoData) {
        await supabase
          .from("promo_codes")
          .update({ current_redemptions: promoData.current_redemptions + 1 })
          .eq("id", result.promo_code_id);
      }

      toast.success(`Success! You now have ${result.daily_question_limit} total questions across all rooms for 1 year! / Thành công! Bạn có ${result.daily_question_limit} câu hỏi tổng cộng!`);
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
