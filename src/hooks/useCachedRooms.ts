import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TierId } from '@/lib/constants/tiers';

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

// System files to exclude from room lists
const SYSTEM_FILES_PATTERNS = [
  'package', 'lock', 'node_modules', '.git', 'config',
  'ryrus', 'tsconfig', 'vite', 'eslint', 'prettier',
  'readme', 'license', 'changelog', '.env', 'docker'
];

// Check if an ID looks like a system file
function isSystemFile(id: string): boolean {
  const lowerCaseId = id.toLowerCase();
  return SYSTEM_FILES_PATTERNS.some(pattern => lowerCaseId.includes(pattern));
}

// Fetch minimal room data from database
async function fetchCachedRooms(tierId?: TierId): Promise<MinimalRoomData[]> {
  try {
    let query = supabase
      .from('rooms')
      .select('id, title_en, title_vi, tier, schema_id, domain');

    
    if (tierId) {
      // Normalize tier query - handle variations
      const normalizedTier = tierId.toLowerCase().replace(/\s+/g, '');
      query = query.ilike('tier', `%${normalizedTier}%`);
    }
    
    // Exclude English Pathway rooms AFTER tier filter, but NOT for free tier
    if (tierId && tierId.toLowerCase() !== 'free') {
      query = query.or('domain.is.null,domain.neq."English Foundation Ladder"');
    }
    
    const { data, error } = await query.order('title_en');

    if (error) throw error;
    
    // Filter out system files and map to MinimalRoomData
    return (data || [])
      .filter(room => !isSystemFile(room.id))
      .map(room => ({
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

export function useCachedRooms(tierId?: TierId) {
  return useQuery({
    queryKey: [CACHE_KEY, tierId],
    queryFn: () => fetchCachedRooms(tierId),
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION * 2,
  });
}
