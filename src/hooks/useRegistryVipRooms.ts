/**
 * REGISTRY-FIRST VIP ROOM LOADER - Design System v1.1
 * 
 * Source of Truth: JSON registry (roomDataImports.ts)
 * Enhancement: Supabase rooms table (optional metadata)
 * 
 * Contract:
 * - All rooms in registry MUST appear in the grid
 * - DB is used ONLY for extra metadata (is_active, domain, etc.)
 * - Missing DB row does NOT hide a room
 * - is_active filter applies only if DB row exists
 * 
 * This replaces strict DB-only loading to prevent rooms from disappearing
 * when DB data is incomplete or inconsistent.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { roomDataMap } from '@/lib/roomDataImports';
import { TIER_ID_TO_LABEL, type TierId } from '@/lib/constants/tiers';

export interface RegistryRoom {
  id: string;
  title_en: string;
  title_vi: string;
  tier: string;
  domain?: string;
  is_active: boolean;
  // Additional DB fields can be added as optional
}

/**
 * Fetch rooms from registry + enhance with DB metadata
 */
async function fetchRegistryVipRooms(tierId: TierId): Promise<RegistryRoom[]> {
  // 1. Get canonical tier label for DB matching
  const tierLabel = TIER_ID_TO_LABEL[tierId];

  // 2. Filter registry rooms by tier ID
  const registryRooms = Object.values(roomDataMap).filter(
    (room) => room.tier === tierId
  );

  if (import.meta.env.DEV) {
    console.log(`[RegistryVipRooms] ${tierId} → ${registryRooms.length} rooms in registry`);
  }

  // 3. Fetch DB metadata for all these rooms (optional enhancement)
  const roomIds = registryRooms.map((r) => r.id);
  const { data: dbRooms, error } = await supabase
    .from('rooms')
    .select('id, tier, domain, is_active')
    .in('id', roomIds);

  if (error) {
    console.warn(`[RegistryVipRooms] DB query warning for ${tierId}:`, error);
    // Continue without DB data - registry is source of truth
  }

  // 4. Build room map with DB metadata
  const dbRoomMap = new Map(
    (dbRooms || []).map((r) => [r.id, r])
  );

  // 5. Merge registry + DB data
  const mergedRooms: RegistryRoom[] = registryRooms.map((registryRoom) => {
    const dbRoom = dbRoomMap.get(registryRoom.id);

    return {
      id: registryRoom.id,
      title_en: registryRoom.nameEn,
      title_vi: registryRoom.nameVi,
      tier: tierLabel, // Use canonical tier label
      domain: dbRoom?.domain,
      is_active: dbRoom?.is_active !== false, // Default true if no DB row
    };
  });

  // 6. Filter out rooms marked inactive in DB (only if DB row exists)
  const activeRooms = mergedRooms.filter((room) => {
    const dbRoom = dbRoomMap.get(room.id);
    // If DB row exists and is_active is explicitly false, hide it
    // Otherwise show it (registry is source of truth)
    if (dbRoom && dbRoom.is_active === false) {
      return false;
    }
    return true;
  });

  if (import.meta.env.DEV) {
    console.log(`[RegistryVipRooms] ${tierId} → ${activeRooms.length} active rooms after filtering`);
  }

  return activeRooms;
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
