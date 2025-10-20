import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MatchSuggestion {
  id: string;
  suggested_user_id: string;
  match_score: number;
  match_reason: any;
  common_interests: string[];
  complementary_traits: string[];
  status: string;
  created_at: string;
  suggested_user_profile?: {
    full_name: string;
    email: string;
  };
}

export const useMatchmaking = () => {
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVIP3, setIsVIP3] = useState(false);

  useEffect(() => {
    checkVIP3Status();
    fetchSuggestions();
  }, []);

  const checkVIP3Status = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*, subscription_tiers(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (subscription && subscription.subscription_tiers?.name === 'VIP3') {
      setIsVIP3(true);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('matchmaking_suggestions')
        .select(`
          *,
          profiles!matchmaking_suggestions_suggested_user_id_fkey(
            full_name,
            email
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('match_score', { ascending: false });

      if (error) throw error;

      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Call edge function to generate matchmaking suggestions
      const { data, error } = await supabase.functions.invoke('generate-matches', {
        body: { userId: user.id }
      });

      if (error) throw error;

      await fetchSuggestions();
      return data;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw error;
    }
  };

  const updateSuggestionStatus = async (suggestionId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('matchmaking_suggestions')
        .update({ status })
        .eq('id', suggestionId);

      if (error) throw error;

      await fetchSuggestions();
    } catch (error) {
      console.error('Error updating suggestion:', error);
      throw error;
    }
  };

  return {
    suggestions,
    loading,
    isVIP3,
    generateSuggestions,
    updateSuggestionStatus,
    refreshSuggestions: fetchSuggestions
  };
};
