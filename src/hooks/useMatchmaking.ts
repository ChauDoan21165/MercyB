// src/hooks/useMatchmaking.ts
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

function hasVip3Access(tier: TierId): boolean {
  return (
    tier === "vip3" ||
    tier === "vip4" ||
    tier === "vip5" ||
    tier === "vip6" ||
    tier === "vip9"
  );
}

export const useMatchmaking = () => {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVIP3, setIsVIP3] = useState(false);

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
      const entitlement = await fetchCurrentEntitlement(supabase);
      const tier = resolveEntitlementTier(entitlement);
      const allowed = hasVip3Access(tier);

      setIsVIP3(allowed);

      // Fail closed: do not fetch premium data when backend entitlement
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
  }, [authLoading, userId]);

  const generateSuggestions = useCallback(async () => {
    if (!userId) {
      throw new Error("Please sign in first.");
    }

    const entitlement = await fetchCurrentEntitlement(supabase);
    const tier = resolveEntitlementTier(entitlement);

    if (!hasVip3Access(tier)) {
      throw new Error("Premium entitlement required.");
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
  }, [fetchSuggestions, userId]);

  const updateSuggestionStatus = useCallback(
    async (suggestionId: string, status: "accepted" | "rejected") => {
      const entitlement = await fetchCurrentEntitlement(supabase);
      const tier = resolveEntitlementTier(entitlement);

      if (!hasVip3Access(tier)) {
        throw new Error("Premium entitlement required.");
      }

      const { error } = await supabase
        .from("matchmaking_suggestions")
        .update({ status })
        .eq("id", suggestionId);

      if (error) throw error;

      await fetchSuggestions();
    },
    [fetchSuggestions],
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