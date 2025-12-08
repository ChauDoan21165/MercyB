/**
 * Runtime room data loader - SUPABASE IS NOW THE ONLY SOURCE OF TRUTH
 * Loads room data directly from Supabase, not from JSON files
 */

import { supabase } from "@/integrations/supabase/client";
import { RoomData } from "@/lib/roomData";

// Runtime cache - only populated when needed
let roomDataCache: Record<string, RoomData> | null = null;
let loadingPromise: Promise<Record<string, RoomData>> | null = null;

/**
 * Load room data map from Supabase (not JSON files)
 */
export async function loadRoomDataMap(): Promise<Record<string, RoomData>> {
  // Return cached data if available
  if (roomDataCache) {
    return roomDataCache;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  // Start loading from Supabase
  loadingPromise = (async () => {
    try {
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('id, title_en, title_vi, tier, domain')
        .order('title_en');

      if (error) {
        console.error('[roomDataLoader] Supabase error:', error);
        roomDataCache = {};
        return roomDataCache;
      }

      const result: Record<string, RoomData> = {};
      
      for (const room of rooms || []) {
        result[room.id] = {
          id: room.id,
          nameEn: room.title_en || room.id,
          nameVi: room.title_vi || room.id,
          tier: room.tier || 'free',
          hasData: true
        };
      }

      roomDataCache = result;
      return result;
    } catch (err) {
      console.error('[roomDataLoader] Failed to load room data map:', err);
      roomDataCache = {};
      return roomDataCache;
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

/**
 * Get a single room's data (async)
 */
export async function getRoomData(roomId: string): Promise<RoomData | null> {
  const map = await loadRoomDataMap();
  return map[roomId] || null;
}

/**
 * Clear the cache (useful for refresh)
 */
export function clearRoomDataCache(): void {
  roomDataCache = null;
  loadingPromise = null;
}
