/**
 * REGISTRY-FIRST VIP ROOM LOADER - Design System v1.1
 * 
 * Source of Truth: JSON files via roomFetcher (runtime loaded)
 * Enhancement: Supabase rooms table (optional metadata)
 * 
 * Contract:
 * - All rooms from roomFetcher MUST appear in the grid
 * - DB is used ONLY for extra metadata (domain, etc.)
 * - Missing DB row does NOT hide a room
 * 
 * This uses async runtime loading instead of static imports.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getRoomsByTier as fetchRoomsByTier } from '@/lib/roomFetcher';
import { TIER_ID_TO_LABEL, type TierId } from '@/lib/constants/tiers';

export interface RegistryRoom {
  id: string;
  title_en: string;
  title_vi: string;
  tier: string;
  domain?: string;
  is_active: boolean;
  hasData: boolean;
  entries?: any[];
}

/**
 * Fetch rooms from fetcher + enhance with DB metadata
 */
async function fetchRegistryVipRooms(tierId: TierId): Promise<RegistryRoom[]> {
  // 1. Get canonical tier label for DB matching
  const tierLabel = TIER_ID_TO_LABEL[tierId];

  // 2. Fetch rooms from runtime loader
  const fetchedRooms = await fetchRoomsByTier(tierId);

  if (import.meta.env.DEV) {
    console.log(`[RegistryVipRooms] ${tierId} → ${fetchedRooms.length} rooms from fetcher`);
  }

  // 3. Fetch DB metadata for all these rooms (optional enhancement)
  const roomIds = fetchedRooms.map((r) => r.id);
  const { data: dbRooms, error } = await supabase
    .from('rooms')
    .select('id, tier, domain')
    .in('id', roomIds);

  if (error) {
    console.warn(`[RegistryVipRooms] DB query warning for ${tierId}:`, error);
    // Continue without DB data - fetcher is source of truth
  }

  // 4. Build room map with DB metadata
  const dbRoomMap = new Map(
    (dbRooms || []).map((r) => [r.id, r])
  );

  // 5. Merge fetcher + DB data
  const mergedRooms: RegistryRoom[] = fetchedRooms.map((room) => {
    const dbRoom = dbRoomMap.get(room.id);

    return {
      id: room.id,
      title_en: room.nameEn,
      title_vi: room.nameVi,
      tier: tierLabel,
      domain: dbRoom?.domain || room.domain,
      is_active: true,
      hasData: room.hasData !== false,
    };
  });

  if (import.meta.env.DEV) {
    console.log(`[RegistryVipRooms] ${tierId} → ${mergedRooms.length} rooms loaded`);
  }

  return mergedRooms;
}

/**
 * React Query hook for registry-first VIP room loading
 */
export function useRegistryVipRooms(tierId: TierId) {
  return useQuery({
    queryKey: ['registry-vip-rooms', tierId],
    queryFn: () => fetchRegistryVipRooms(tierId),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}
