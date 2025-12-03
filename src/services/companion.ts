import { supabase } from '@/integrations/supabase/client';

export type EnglishLevel = "beginner" | "lower_intermediate" | "intermediate" | "advanced";

export interface CompanionState {
  user_id: string;
  last_room: string | null;
  last_mood: string | null;
  emotional_tags: string[];
  reflection_history: string[];
  path_progress: Record<string, number>;
  last_active_at: string;
}

export interface CompanionProfile {
  preferred_name?: string | null;
  english_level?: EnglishLevel | null;
  learning_goal?: string | null;
  last_english_activity?: string | null;
}

export interface CompanionEvent {
  id: string;
  user_id: string;
  room_id: string | null;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

/**
 * Get companion state for the current user
 */
export async function getCompanionState(): Promise<CompanionState | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('companion_state')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to get companion state:', error);
    return null;
  }

  if (!data) return null;

  return {
    user_id: data.user_id,
    last_room: data.last_room,
    last_mood: data.last_mood,
    emotional_tags: (data.emotional_tags as string[]) || [],
    reflection_history: (data.reflection_history as string[]) || [],
    path_progress: (data.path_progress as Record<string, number>) || {},
    last_active_at: data.last_active_at || new Date().toISOString(),
  };
}

/**
 * Update companion state for the current user
 */
export async function updateCompanionState(
  updates: Partial<Omit<CompanionState, 'user_id'>>
): Promise<CompanionState | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const updateData = {
    ...updates,
    last_active_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('companion_state')
    .upsert({
      user_id: user.id,
      ...updateData,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to update companion state:', error);
    return null;
  }

  return {
    user_id: data.user_id,
    last_room: data.last_room,
    last_mood: data.last_mood,
    emotional_tags: (data.emotional_tags as string[]) || [],
    reflection_history: (data.reflection_history as string[]) || [],
    path_progress: (data.path_progress as Record<string, number>) || {},
    last_active_at: data.last_active_at || new Date().toISOString(),
  };
}

/**
 * Get companion profile (name, English level, learning goal)
 */
export async function getCompanionProfile(): Promise<CompanionProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data, error } = await supabase
    .from('companion_state')
    .select('preferred_name, english_level, learning_goal, last_english_activity')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to get companion profile:', error);
    return {};
  }

  // If no row exists, create one lazily
  if (!data) {
    const { error: insertError } = await supabase
      .from('companion_state')
      .insert({ user_id: user.id })
      .select()
      .single();
    
    if (insertError && !insertError.message.includes('duplicate')) {
      console.error('Failed to create companion state:', insertError);
    }
    return {};
  }

  return {
    preferred_name: data.preferred_name,
    english_level: data.english_level as EnglishLevel | null,
    learning_goal: data.learning_goal,
    last_english_activity: data.last_english_activity,
  };
}

/**
 * Update companion profile (name, English level, learning goal)
 */
export async function updateCompanionProfile(
  patch: Partial<CompanionProfile>
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('companion_state')
    .upsert({
      user_id: user.id,
      ...patch,
      last_active_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Failed to update companion profile:', error);
    throw error;
  }
}

/**
 * Update last English activity timestamp
 */
export async function markEnglishActivity(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('companion_state')
    .upsert({
      user_id: user.id,
      last_english_activity: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Failed to mark English activity:', error);
  }
}

/**
 * Log a companion event
 */
export async function logCompanionEvent(
  event_type: string,
  metadata: Record<string, unknown> = {},
  room_id?: string
): Promise<CompanionEvent | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('companion_events')
    .insert({
      user_id: user.id,
      room_id: room_id || null,
      event_type,
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to log companion event:', error);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    room_id: data.room_id,
    event_type: data.event_type,
    metadata: (data.metadata as Record<string, unknown>) || {},
    created_at: data.created_at,
  };
}

/**
 * Get recent companion events for the current user
 */
export async function getRecentEvents(limit = 20): Promise<CompanionEvent[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('companion_events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to get recent events:', error);
    return [];
  }

  return (data || []).map((event) => ({
    id: event.id,
    user_id: event.user_id,
    room_id: event.room_id,
    event_type: event.event_type,
    metadata: (event.metadata as Record<string, unknown>) || {},
    created_at: event.created_at,
  }));
}
