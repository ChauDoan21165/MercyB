/**
 * Kids Room Database Utilities
 * Handles fetching and managing Kids English rooms from Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import type { KidsLevel, KidsRoom, KidsEntry } from '@/lib/kidsRoomRegistry';

/**
 * Fetch all active Kids levels
 */
export const getKidsLevels = async (): Promise<KidsLevel[]> => {
  const { data, error } = await supabase
    .from('kids_levels')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    console.error('Error fetching kids levels:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch all rooms for a specific level
 */
export const getRoomsByLevel = async (levelId: string): Promise<KidsRoom[]> => {
  const { data, error } = await supabase
    .from('kids_rooms')
    .select('*')
    .eq('level_id', levelId)
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    console.error('Error fetching kids rooms:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch a single room by ID
 */
export const getKidsRoom = async (roomId: string): Promise<KidsRoom | null> => {
  const { data, error } = await supabase
    .from('kids_rooms')
    .select('*')
    .eq('id', roomId)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching kids room:', error);
    return null;
  }

  return data;
};

/**
 * Fetch all entries for a specific room
 */
export const getRoomEntries = async (roomId: string): Promise<KidsEntry[]> => {
  const { data, error } = await supabase
    .from('kids_entries')
    .select('*')
    .eq('room_id', roomId)
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    console.error('Error fetching room entries:', error);
    throw error;
  }

  return data || [];
};

/**
 * Check if user has an active subscription to a level
 */
export const hasKidsLevelSubscription = async (
  userId: string,
  levelId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('kids_subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('level_id', levelId)
    .eq('status', 'active')
    .gte('current_period_end', new Date().toISOString())
    .limit(1);

  if (error) {
    console.error('Error checking kids subscription:', error);
    return false;
  }

  return (data?.length || 0) > 0;
};

/**
 * Get all active subscriptions for a user
 */
export const getUserKidsSubscriptions = async (
  userId: string
): Promise<string[]> => {
  const { data, error } = await supabase
    .from('kids_subscriptions')
    .select('level_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gte('current_period_end', new Date().toISOString());

  if (error) {
    console.error('Error fetching user kids subscriptions:', error);
    return [];
  }

  return data?.map(sub => sub.level_id) || [];
};

/**
 * Get room count for a level
 */
export const getRoomCountByLevel = async (levelId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('kids_rooms')
    .select('*', { count: 'exact', head: true })
    .eq('level_id', levelId)
    .eq('is_active', true);

  if (error) {
    console.error('Error counting rooms:', error);
    return 0;
  }

  return count || 0;
};

/**
 * Get entry count for a room
 */
export const getEntryCountByRoom = async (roomId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('kids_entries')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', roomId)
    .eq('is_active', true);

  if (error) {
    console.error('Error counting entries:', error);
    return 0;
  }

  return count || 0;
};
