import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { AlertCircle, Sparkles } from "lucide-react";

interface CreditLimitModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  questionsUsed: number;
  questionsLimit: number;
}

export const CreditLimitModal = ({ open, onClose, onSuccess, questionsUsed, questionsLimit }: CreditLimitModalProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsRedeeming(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login first");
        return;
      }

      // Validate code server-side using secure function
      const { data: validationResult, error: validationError } = await supabase
        .rpc("validate_promo_code", { code_input: promoCode.toUpperCase() });

      const result = validationResult as any;
      
      if (validationError || !result?.valid) {
        toast.error(result?.error || "Invalid or expired promo code / Mã không hợp lệ hoặc đã hết hạn");
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

      toast.success(`Success! You now have ${result.daily_question_limit} total questions across all rooms! / Thành công! Bạn có ${result.daily_question_limit} câu hỏi tổng cộng!`);
      setPromoCode("");
      onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error("Redemption error:", error);
      toast.error("Failed to redeem code / Không thể đổi mã");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <DialogTitle>Daily Limit Reached / Đã hết câu hỏi</DialogTitle>
          </div>
          <DialogDescription className="space-y-3 text-base">
            <p className="font-semibold text-destructive">
              You've reached your question limit!
            </p>
            <p className="text-sm text-muted-foreground">
              Bạn đã hết số câu hỏi!
            </p>
            <p className="text-sm mt-2">
              💡 <strong>Get more questions by entering a promo code below!</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              💡 <strong>Nhận thêm câu hỏi bằng cách nhập mã khuyến mãi bên dưới!</strong>
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <p className="font-semibold">Do you have a promo code?</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Bạn có mã khuyến mãi không?
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo">Enter Promo Code / Nhập mã khuyến mãi</Label>
            <Input
              id="promo"
              placeholder="XXXXX-XXXXX-XXXXX"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              disabled={isRedeeming}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleRedeem}
              disabled={isRedeeming || !promoCode.trim()}
              className="flex-1"
            >
              {isRedeeming ? "Redeeming... / Đang đổi..." : "Redeem / Đổi mã"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isRedeeming}
              className="flex-1"
            >
              Cancel / Hủy
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Or upgrade to VIP for unlimited questions
            </p>
            <p className="text-xs text-muted-foreground">
              Hoặc nâng cấp VIP để có câu hỏi không giới hạn
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
