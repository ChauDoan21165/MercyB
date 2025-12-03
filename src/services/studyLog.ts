import { supabase } from '@/integrations/supabase/client';

export type MoodKey = 'light' | 'ok' | 'heavy' | 'anxious';

export type StudyLogEntry = {
  id: string;
  date: string;
  room_id?: string | null;
  path_slug?: string | null;
  day_index?: number | null;
  topic_en?: string | null;
  topic_vi?: string | null;
  minutes?: number | null;
  mood_before?: MoodKey | null;
  mood_after?: MoodKey | null;
};

export async function addStudyLogEntry(input: {
  room_id?: string;
  path_slug?: string;
  day_index?: number;
  topic_en?: string;
  topic_vi?: string;
  minutes?: number;
  mood_before?: MoodKey;
  mood_after?: MoodKey;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('study_log')
    .insert({
      user_id: user.id,
      room_id: input.room_id || null,
      path_slug: input.path_slug || null,
      day_index: input.day_index ?? null,
      topic_en: input.topic_en || null,
      topic_vi: input.topic_vi || null,
      minutes: input.minutes ?? null,
      mood_before: input.mood_before || null,
      mood_after: input.mood_after || null,
    });

  if (error) {
    console.warn('Failed to add study log entry:', error);
  }
}

export async function getRecentStudyLog(limit = 10): Promise<StudyLogEntry[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('study_log')
    .select('id, date, room_id, path_slug, day_index, topic_en, topic_vi, minutes, mood_before, mood_after')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('Failed to get study log:', error);
    return [];
  }

  return (data || []) as StudyLogEntry[];
}

export async function getYesterdayAndTodaySummary(): Promise<{
  yesterday?: StudyLogEntry;
  todayTotalMinutes: number;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { todayTotalMinutes: 0 };

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Get yesterday's latest entry
  const { data: yesterdayData } = await supabase
    .from('study_log')
    .select('id, date, room_id, path_slug, day_index, topic_en, topic_vi, minutes, mood_before, mood_after')
    .eq('user_id', user.id)
    .eq('date', yesterdayStr)
    .order('created_at', { ascending: false })
    .limit(1);

  // Get today's total minutes
  const { data: todayData } = await supabase
    .from('study_log')
    .select('minutes')
    .eq('user_id', user.id)
    .eq('date', todayStr);

  const todayTotalMinutes = (todayData || []).reduce((sum, row) => sum + (row.minutes || 0), 0);

  return {
    yesterday: yesterdayData?.[0] as StudyLogEntry | undefined,
    todayTotalMinutes,
  };
}

export async function getRecentMoods(limit = 3): Promise<MoodKey[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('study_log')
    .select('mood_after')
    .eq('user_id', user.id)
    .not('mood_after', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data || []).map(d => d.mood_after as MoodKey).filter(Boolean);
}
