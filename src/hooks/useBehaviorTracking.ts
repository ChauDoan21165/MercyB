import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBehaviorTracking = (roomId: string) => {
  // Track room visit
  useEffect(() => {
    const trackVisit = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_behavior_tracking').insert({
        user_id: user.id,
        room_id: roomId,
        interaction_type: 'visited',
        interaction_data: { timestamp: new Date().toISOString() }
      });
    };

    trackVisit();
  }, [roomId]);

  // Track message sent
  const trackMessage = useCallback(async (messageContent: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('user_behavior_tracking').insert({
      user_id: user.id,
      room_id: roomId,
      interaction_type: 'message_sent',
      interaction_data: { 
        message_length: messageContent.length,
        timestamp: new Date().toISOString()
      }
    });
  }, [roomId]);

  // Track keyword triggered
  const trackKeyword = useCallback(async (keyword: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('user_behavior_tracking').insert({
      user_id: user.id,
      room_id: roomId,
      interaction_type: 'keyword_triggered',
      interaction_data: { 
        keyword,
        timestamp: new Date().toISOString()
      }
    });

    // Update knowledge profile with new interest
    await updateKnowledgeProfile(user.id, keyword);
  }, [roomId]);

  // Track room completion
  const trackCompletion = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('user_behavior_tracking').insert({
      user_id: user.id,
      room_id: roomId,
      interaction_type: 'completed',
      interaction_data: { timestamp: new Date().toISOString() }
    });

    // Update knowledge profile
    await updateCompletedTopics(user.id, roomId);
  }, [roomId]);

  return { trackMessage, trackKeyword, trackCompletion };
};

// Helper function to update knowledge profile
async function updateKnowledgeProfile(userId: string, interest: string) {
  const { data: profile } = await supabase
    .from('user_knowledge_profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

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
  const { data: profile } = await supabase
    .from('user_knowledge_profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

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
