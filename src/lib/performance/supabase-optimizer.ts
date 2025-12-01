/**
 * Supabase Query Optimizer
 * Best practices for efficient database queries
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Optimized room fetch - only select needed columns
 */
export async function fetchRoomOptimized(roomId: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('id, title_en, title_vi, tier, domain, entries, keywords')
    .eq('id', roomId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Optimized room list fetch with pagination
 */
export async function fetchRoomListOptimized(tier: string, page = 0, limit = 50) {
  const { data, error } = await supabase
    .from('rooms')
    .select('id, title_en, title_vi, tier, domain')
    .eq('tier', tier)
    .order('title_en')
    .range(page * limit, (page + 1) * limit - 1)
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Optimized user profile fetch - minimal columns
 */
export async function fetchUserProfileOptimized(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Optimized subscription check - only status
 */
export async function checkUserSubscriptionOptimized(userId: string) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('tier_id, status, current_period_end')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore "not found"
  return data;
}

/**
 * Batch fetch with IN clause (more efficient than multiple queries)
 */
export async function fetchRoomsBatch(roomIds: string[]) {
  const { data, error } = await supabase
    .from('rooms')
    .select('id, title_en, title_vi, tier')
    .in('id', roomIds)
    .limit(100);

  if (error) throw error;
  return data;
}

/**
 * Indexed query patterns (ensure these columns have indexes)
 */
export const RECOMMENDED_INDEXES = `
-- Performance-critical indexes for Mercy Blade

-- Rooms table
CREATE INDEX IF NOT EXISTS idx_rooms_tier ON rooms(tier);
CREATE INDEX IF NOT EXISTS idx_rooms_domain ON rooms(domain);
CREATE INDEX IF NOT EXISTS idx_rooms_is_demo ON rooms(is_demo);

-- User subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_id ON user_subscriptions(tier_id);

-- Room assignments
CREATE INDEX IF NOT EXISTS idx_room_assignments_user_id ON room_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_room_assignments_room_id ON room_assignments(room_id);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
`;
