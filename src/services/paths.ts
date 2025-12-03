import { supabase } from '@/integrations/supabase/client';
import type { Path, PathDay, UserPathProgress, PathWithProgress } from '@/types/paths';

// Get all paths
export async function getAllPaths(): Promise<Path[]> {
  const { data, error } = await supabase
    .from('paths')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching paths:', error);
    throw error;
  }

  return (data || []) as Path[];
}

// Get path by slug
export async function getPathBySlug(slug: string): Promise<Path | null> {
  const { data, error } = await supabase
    .from('paths')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching path:', error);
    throw error;
  }

  return data as Path;
}

// Get path days
export async function getPathDays(pathId: string): Promise<PathDay[]> {
  const { data, error } = await supabase
    .from('path_days')
    .select('*')
    .eq('path_id', pathId)
    .order('day_index', { ascending: true });

  if (error) {
    console.error('Error fetching path days:', error);
    throw error;
  }

  return (data || []) as PathDay[];
}

// Get single day
export async function getPathDay(pathId: string, dayIndex: number): Promise<PathDay | null> {
  const { data, error } = await supabase
    .from('path_days')
    .select('*')
    .eq('path_id', pathId)
    .eq('day_index', dayIndex)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching path day:', error);
    throw error;
  }

  return data as PathDay;
}

// Get user progress for a path
export async function getUserProgress(userId: string, pathId: string): Promise<UserPathProgress | null> {
  const { data, error } = await supabase
    .from('user_path_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('path_id', pathId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching user progress:', error);
    throw error;
  }

  // Parse completed_days from JSONB
  const progress = data as any;
  return {
    ...progress,
    completed_days: Array.isArray(progress.completed_days) ? progress.completed_days : [],
  } as UserPathProgress;
}

// Get all user progress
export async function getAllUserProgress(userId: string): Promise<UserPathProgress[]> {
  const { data, error } = await supabase
    .from('user_path_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }

  return (data || []).map((p: any) => ({
    ...p,
    completed_days: Array.isArray(p.completed_days) ? p.completed_days : [],
  })) as UserPathProgress[];
}

// Start a path
export async function startPath(userId: string, pathId: string): Promise<UserPathProgress> {
  const { data, error } = await supabase
    .from('user_path_progress')
    .upsert({
      user_id: userId,
      path_id: pathId,
      current_day: 1,
      completed_days: [],
      started_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,path_id',
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting path:', error);
    throw error;
  }

  const progress = data as any;
  return {
    ...progress,
    completed_days: Array.isArray(progress.completed_days) ? progress.completed_days : [],
  } as UserPathProgress;
}

// Complete a day
export async function completeDay(
  userId: string,
  pathId: string,
  dayIndex: number,
  totalDays: number
): Promise<UserPathProgress> {
  // First get current progress
  const current = await getUserProgress(userId, pathId);
  
  if (!current) {
    throw new Error('No progress found. Please start the path first.');
  }

  // Add day to completed if not already
  const completedDays = current.completed_days.includes(dayIndex)
    ? current.completed_days
    : [...current.completed_days, dayIndex].sort((a, b) => a - b);

  // Calculate next day
  const nextDay = dayIndex < totalDays ? dayIndex + 1 : dayIndex;

  const { data, error } = await supabase
    .from('user_path_progress')
    .update({
      current_day: nextDay,
      completed_days: completedDays,
    })
    .eq('user_id', userId)
    .eq('path_id', pathId)
    .select()
    .single();

  if (error) {
    console.error('Error completing day:', error);
    throw error;
  }

  const progress = data as any;
  return {
    ...progress,
    completed_days: Array.isArray(progress.completed_days) ? progress.completed_days : [],
  } as UserPathProgress;
}

// Reset path progress
export async function resetPath(userId: string, pathId: string): Promise<void> {
  const { error } = await supabase
    .from('user_path_progress')
    .delete()
    .eq('user_id', userId)
    .eq('path_id', pathId);

  if (error) {
    console.error('Error resetting path:', error);
    throw error;
  }
}

// Get paths with user progress
export async function getPathsWithProgress(userId: string | null): Promise<PathWithProgress[]> {
  const paths = await getAllPaths();
  
  if (!userId) {
    return paths.map(p => ({ ...p, progress: null }));
  }

  const progressList = await getAllUserProgress(userId);
  const progressMap = new Map(progressList.map(p => [p.path_id, p]));

  return paths.map(path => ({
    ...path,
    progress: progressMap.get(path.id) || null,
  }));
}
