import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ALL_ROOMS } from '@/lib/roomData';

export interface MinimalRoomData {
  id: string;
  nameEn: string;
  nameVi: string;
  tier: string;
  hasData: boolean;
  color?: string;
}

const CACHE_KEY = 'rooms-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Try to fetch from edge function cache, fallback to local data
async function fetchCachedRooms(): Promise<MinimalRoomData[]> {
  try {
    const { data, error } = await supabase.functions.invoke('room-cache', {
      method: 'GET'
    });

    if (error) throw error;
    
    if (data?.rooms && Array.isArray(data.rooms)) {
      return data.rooms;
    }
  } catch (err) {
    console.warn('Cache fetch failed, using local data:', err);
  }
  
  // Fallback to local ALL_ROOMS data
  return ALL_ROOMS.map(room => ({
    id: room.id,
    nameEn: room.nameEn || room.id,
    nameVi: room.nameVi || '',
    tier: room.tier,
    hasData: room.hasData
  }));
}

export function useCachedRooms(tier?: string) {
  return useQuery({
    queryKey: [CACHE_KEY, tier],
    queryFn: async () => {
      const rooms = await fetchCachedRooms();
      
      // Filter by tier if specified
      if (tier) {
        return rooms.filter(room => room.tier === tier);
      }
      
      return rooms;
    },
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION * 2,
  });
}
