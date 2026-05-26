// PATH: src/hooks/useMatchmaking.ts

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import {
  fetchCurrentEntitlement,
  resolveEntitlementTier,
} from "@/lib/authService";
import type { TierId } from "@/lib/constants/tiers";

interface MatchSuggestion {
  id: string;
  suggested_user_id: string;
  match_score: number;
  match_reason: unknown;
  common_interests: string[];
  complementary_traits: string[];
  status: string;
  created_at: string;
  suggested_user_profile?: {
    full_name: string;
    email: string;
  };
}

function normalizeTier(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function isPaidBillingTier(tier: string): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

function isLegacyVipTier(tier: string): boolean {
  return /^vip[1-9]$/.test(tier);
}

/**
 * New policy:
 * - premium_month / premium_year can access the whole paid repo
 * - keep legacy VIP tiers working too
 */
function hasPaidRepoAccess(tier: TierId): boolean {
  const normalized = normalizeTier(tier);
  return isPaidBillingTier(normalized) || isLegacyVipTier(normalized);
}

export const useMatchmaking = () => {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Keep the old field name for compatibility with existing UI,
   * but it now means: user has paid access for this feature.
   */
  const [isVIP3, setIsVIP3] = useState(false);

  const resolveCurrentPaidAccess = useCallback(async (): Promise<boolean> => {
    const entitlement = await fetchCurrentEntitlement(supabase);
    const tier = resolveEntitlementTier(entitlement);
    return hasPaidRepoAccess(tier);
  }, []);

  const fetchSuggestions = useCallback(async () => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!userId) {
      setSuggestions([]);
      setIsVIP3(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const allowed = await resolveCurrentPaidAccess();

      setIsVIP3(allowed);

      // Fail closed: do not fetch paid data when entitlement
      // does not grant access.
      if (!allowed) {
        setSuggestions([]);
        return;
      }

      const { data, error } = await supabase
        .from("matchmaking_suggestions")
        .select(`
          *,
          profiles!matchmaking_suggestions_suggested_user_id_fkey(
            full_name,
            email
          )
        `)
        .eq("user_id", userId)
        .eq("status", "pending")
        .order("match_score", { ascending: false });

      if (error) throw error;

      setSuggestions((data as MatchSuggestion[] | null) ?? []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setIsVIP3(false);
    } finally {
      setLoading(false);
    }
  }, [authLoading, resolveCurrentPaidAccess, userId]);

  const generateSuggestions = useCallback(async () => {
    if (!userId) {
      throw new Error("Please sign in first.");
    }

    const allowed = await resolveCurrentPaidAccess();

    if (!allowed) {
      throw new Error("Paid entitlement required.");
    }

    const { data, error } = await supabase.functions.invoke(
      "generate-matches",
      {
        body: { userId },
      },
    );

    if (error) throw error;

    await fetchSuggestions();
    return data;
  }, [fetchSuggestions, resolveCurrentPaidAccess, userId]);

  const updateSuggestionStatus = useCallback(
    async (suggestionId: string, status: "accepted" | "rejected") => {
      const allowed = await resolveCurrentPaidAccess();

      if (!allowed) {
        throw new Error("Paid entitlement required.");
      }

      const { error } = await supabase
        .from("matchmaking_suggestions")
        .update({ status })
        .eq("id", suggestionId);

      if (error) throw error;

      await fetchSuggestions();
    },
    [fetchSuggestions, resolveCurrentPaidAccess],
  );

  useEffect(() => {
    void fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    loading,
    isVIP3,
    generateSuggestions,
    updateSuggestionStatus,
    refreshSuggestions: fetchSuggestions,
  };
};