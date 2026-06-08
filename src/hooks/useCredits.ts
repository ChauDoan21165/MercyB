// src/hooks/useCredits.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { useUserAccess } from "@/hooks/useUserAccess";

interface CreditInfo {
  questionsUsed: number;
  questionsLimit: number;
  hasPromoCode: boolean;
  isUnlimited: boolean;
  totalQuestionsUsed: number;
  totalQuestionsLimit: number;
  promoExhausted: boolean;
}

const DEFAULT_CREDIT_INFO: CreditInfo = {
  questionsUsed: 0,
  questionsLimit: 10,
  hasPromoCode: false,
  isUnlimited: false,
  totalQuestionsUsed: 0,
  totalQuestionsLimit: 0,
  promoExhausted: false,
};

export const useCredits = () => {
  const { user, isLoading: authLoading } = useAuth();
  const access = useUserAccess();
  const userId = user?.id ?? null;

  const [creditInfo, setCreditInfo] = useState<CreditInfo>(DEFAULT_CREDIT_INFO);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (authLoading || access.isLoading) {
      setLoading(true);
      return;
    }

    if (!userId) {
      setCreditInfo(DEFAULT_CREDIT_INFO);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data: promoRedemption } = await supabase
        .from("user_promo_redemptions")
        .select("*, promo_codes(*)")
        .eq("user_id", userId)
        .gte("expires_at", new Date().toISOString())
        .order("redeemed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const today = new Date().toISOString().split("T")[0];
      const { data: quota } = await supabase
        .from("user_quotas")
        .select("*")
        .eq("user_id", userId)
        .eq("quota_date", today)
        .single();

      const questionsUsed = Number(quota?.questions_used ?? 0);

      let questionsLimit = 10;
      let isUnlimited = false;
      let totalQuestionsUsed = 0;
      let totalQuestionsLimit = 0;
      let promoExhausted = false;

      if (access.hasPremium) {
        isUnlimited = true;
        questionsLimit = 999999;
      } else if (promoRedemption) {
        totalQuestionsUsed = Number(promoRedemption.total_questions_used ?? 0);
        totalQuestionsLimit = Number(
          promoRedemption.total_question_limit ?? 30,
        );
        promoExhausted = totalQuestionsUsed >= totalQuestionsLimit;

        if (!promoExhausted) {
          questionsLimit = totalQuestionsLimit;
        } else {
          questionsLimit = 10;
        }
      }

      setCreditInfo({
        questionsUsed,
        questionsLimit,
        hasPromoCode: !!promoRedemption,
        isUnlimited,
        totalQuestionsUsed,
        totalQuestionsLimit,
        promoExhausted,
      });
    } catch (error) {
      console.error("Error fetching credits:", error);
      setCreditInfo(DEFAULT_CREDIT_INFO);
    } finally {
      setLoading(false);
    }
  }, [access.hasPremium, access.isLoading, authLoading, userId]);

  const incrementUsage = useCallback(async () => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("user_quotas").upsert(
      {
        user_id: userId,
        quota_date: today,
        questions_used: creditInfo.questionsUsed + 1,
      },
      {
        onConflict: "user_id,quota_date",
        ignoreDuplicates: false,
      },
    );

    if (creditInfo.hasPromoCode && !creditInfo.isUnlimited) {
      const { data: promoRedemption } = await supabase
        .from("user_promo_redemptions")
        .select("id, total_questions_used")
        .eq("user_id", userId)
        .gte("expires_at", new Date().toISOString())
        .order("redeemed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (promoRedemption) {
        await supabase
          .from("user_promo_redemptions")
          .update({
            total_questions_used:
              Number(promoRedemption.total_questions_used ?? 0) + 1,
          })
          .eq("id", promoRedemption.id);
      }
    }

    if (!error) {
      setCreditInfo((prev) => ({
        ...prev,
        questionsUsed: prev.questionsUsed + 1,
        totalQuestionsUsed: prev.totalQuestionsUsed + 1,
      }));
    }
  }, [creditInfo, userId]);

  const hasCreditsRemaining = useCallback(() => {
    if (creditInfo.isUnlimited) return true;
    if (creditInfo.promoExhausted) return false;
    if (creditInfo.hasPromoCode) {
      return creditInfo.totalQuestionsUsed < creditInfo.totalQuestionsLimit;
    }
    return creditInfo.questionsUsed < creditInfo.questionsLimit;
  }, [creditInfo]);

  useEffect(() => {
    void fetchCredits();
  }, [fetchCredits]);

  return {
    creditInfo,
    loading,
    hasCreditsRemaining,
    incrementUsage,
    refreshCredits: fetchCredits,
  };
};
