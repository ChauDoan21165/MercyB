import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/providers/AuthProvider';

export const useBehaviorTracking = (roomId: string) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  // Track room visit
  useEffect(() => {
    if (!userId) return;
    void supabase.from('user_behavior_tracking').insert({
      user_id: userId,
      room_id: roomId,
      interaction_type: 'visited',
      interaction_data: { timestamp: new Date().toISOString() }
    });
  }, [roomId, userId]);

  // Track message sent
  const trackMessage = useCallback(async (messageContent: string) => {
    if (!userId) return;
    await supabase.from('user_behavior_tracking').insert({
      user_id: userId,
      room_id: roomId,
      interaction_type: 'message_sent',
      interaction_data: {
        message_length: messageContent.length,
        timestamp: new Date().toISOString()
      }
    });
  }, [roomId, userId]);

  // Track keyword triggered
  const trackKeyword = useCallback(async (keyword: string) => {
    if (!userId) return;
    await supabase.from('user_behavior_tracking').insert({
      user_id: userId,
      room_id: roomId,
      interaction_type: 'keyword_triggered',
      interaction_data: {
        keyword,
        timestamp: new Date().toISOString()
      }
    });
    await updateKnowledgeProfile(userId, keyword);
  }, [roomId, userId]);

  // Track room completion
  const trackCompletion = useCallback(async () => {
    if (!userId) return;
    await supabase.from('user_behavior_tracking').insert({
      user_id: userId,
      room_id: roomId,
      interaction_type: 'completed',
      interaction_data: { timestamp: new Date().toISOString() }
    });
    await updateCompletedTopics(userId, roomId);
  }, [roomId, userId]);

  return { trackMessage, trackKeyword, trackCompletion };
};

// Helper function to update knowledge profile
async function updateKnowledgeProfile(userId: string, interest: string) {
  const { data: profile, error } = await supabase
    .from('user_knowledge_profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.warn('[useBehaviorTracking] updateKnowledgeProfile read failed', error);
  }

  if (profile) {
    const interests = Array.isArray(profile.interests) ? profile.interests : [];
    if (!interests.includes(interest)) {
      await supabase
        .from('user_knowledge_profile')
        .update({
          interests: [...interests, interest],
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    }
  } else {
    await supabase.from('user_knowledge_profile').insert({
      user_id: userId,
      interests: [interest]
    });
  }
}

// Helper function to update completed topics
async function updateCompletedTopics(userId: string, roomId: string) {
  const { data: profile, error } = await supabase
    .from('user_knowledge_profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.warn('[useBehaviorTracking] updateCompletedTopics read failed', error);
  }

  if (profile) {
    const completed = Array.isArray(profile.completed_topics) ? profile.completed_topics : [];
    if (!completed.includes(roomId)) {
      await supabase
        .from('user_knowledge_profile')
        .update({
          completed_topics: [...completed, roomId],
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    }
  } else {
    await supabase.from('user_knowledge_profile').insert({
      user_id: userId,
      completed_topics: [roomId]
    });
  }
}
