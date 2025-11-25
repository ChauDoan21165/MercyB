import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

// Fetch minimal room data from database
async function fetchCachedRooms(tier?: string): Promise<MinimalRoomData[]> {
  try {
    let query = supabase
      .from('rooms')
      .select('id, title_en, title_vi, tier, schema_id');
    
    if (tier) {
      // Normalize tier query - handle variations
      const normalizedTier = tier.toLowerCase().replace(/\s+/g, '');
      query = query.ilike('tier', `%${normalizedTier}%`);
    }
    
    const { data, error } = await query.order('title_en');

    if (error) throw error;
    
    return (data || []).map(room => ({
      id: room.id,
      nameEn: room.title_en || room.id,
      nameVi: room.title_vi || '',
      tier: room.tier || 'free',
      hasData: true
    }));
  } catch (err) {
    console.warn('Failed to fetch rooms:', err);
    return [];
  }
}

export function useCachedRooms(tier?: string) {
  return useQuery({
    queryKey: [CACHE_KEY, tier],
    queryFn: () => fetchCachedRooms(tier),
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION * 2,
  });
}
