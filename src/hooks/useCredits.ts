import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CreditInfo {
  questionsUsed: number;
  questionsLimit: number;
  hasPromoCode: boolean;
  isUnlimited: boolean;
}

export const useCredits = () => {
  const [creditInfo, setCreditInfo] = useState<CreditInfo>({
    questionsUsed: 0,
    questionsLimit: 10, // Default free tier
    hasPromoCode: false,
    isUnlimited: false
  });
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check for active subscriptions
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_tiers(*)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      // Check for promo code redemptions
      const { data: promoRedemption } = await supabase
        .from("user_promo_redemptions")
        .select("*")
        .eq("user_id", user.id)
        .gte("expires_at", new Date().toISOString())
        .single();

      // Get today's usage
      const today = new Date().toISOString().split('T')[0];
      const { data: quota } = await supabase
        .from("user_quotas")
        .select("*")
        .eq("user_id", user.id)
        .eq("quota_date", today)
        .single();

      const questionsUsed = quota?.questions_used || 0;
      
      let questionsLimit = 10; // Default free tier
      let isUnlimited = false;

      if (subscription) {
        // VIP subscription - unlimited questions
        isUnlimited = true;
        questionsLimit = 999999;
      } else if (promoRedemption) {
        // Active promo code
        questionsLimit = promoRedemption.daily_question_limit;
      }

      setCreditInfo({
        questionsUsed,
        questionsLimit,
        hasPromoCode: !!promoRedemption,
        isUnlimited
      });
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Upsert quota record
    const { error } = await supabase
      .from("user_quotas")
      .upsert({
        user_id: user.id,
        quota_date: today,
        questions_used: creditInfo.questionsUsed + 1
      }, {
        onConflict: "user_id,quota_date",
        ignoreDuplicates: false
      });

    if (!error) {
      setCreditInfo(prev => ({
        ...prev,
        questionsUsed: prev.questionsUsed + 1
      }));
    }
  };

  const hasCreditsRemaining = () => {
    return creditInfo.isUnlimited || creditInfo.questionsUsed < creditInfo.questionsLimit;
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return {
    creditInfo,
    loading,
    hasCreditsRemaining,
    incrementUsage,
    refreshCredits: fetchCredits
  };
};
