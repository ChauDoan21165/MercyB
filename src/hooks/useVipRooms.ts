/**
 * STRICT VIP ROOM LOADER - Design System v1.1
 * 
 * NO GUESSING. NO FALLBACKS. NO RESCUE LOGIC.
 * 
 * Simple contract:
 * - DB tier field MUST exactly match TIER_ID_TO_LABEL[tierId]
 * - No domain filtering (shows all rooms for that tier)
 * - No fuzzy matching, no case conversion, no normalization
 * - If data is wrong, CI validation + admin tools catch it
 * 
 * Examples:
 * - VIP1 rooms: tier = "VIP1 / VIP1" (exact match only)
 * - VIP9 rooms: tier = "VIP9 / Cấp VIP9" (exact match only)
 * 
 * If you see fewer rooms than expected:
 * → Check DB: room probably has wrong tier value or is_active=false
 * → Run: npx tsx scripts/audit-db-tiers.ts
 * → Fix data in Supabase UI
 * → Don't add guessing logic here
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { ROOMS_TABLE, TierId, TIER_ID_TO_LABEL } from '@/lib/constants';

export type VipRoom = Database["public"]["Tables"]["rooms"]["Row"];

/**
 * Fetch rooms for a tier using STRICT exact tier matching.
 * No fuzzy logic. DB tier must exactly match canonical label.
 */
async function fetchStrictVipRooms(tierId: TierId): Promise<VipRoom[]> {
  // Get canonical tier label - this is the ONLY acceptable DB value
  const tierLabel = TIER_ID_TO_LABEL[tierId];

  const { data, error } = await supabase
    .from(ROOMS_TABLE)
    .select('*')
    .eq('tier', tierLabel)         // STRICT: exact match only
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`[VipRooms] DB error for ${tierId}:`, error);
    throw error;
  }

  if (import.meta.env.DEV) {
    console.log(`[VipRooms] ${tierId} → ${(data || []).length} rooms (tier="${tierLabel}")`);
  }

  return data || [];
}

/**
 * React Query hook for VIP room loading.
 * Uses strict exact tier matching - no fallbacks.
 */
export function useVipRooms(tierId: TierId) {
  return useQuery({
    queryKey: ['vip-rooms', tierId],
    queryFn: () => fetchStrictVipRooms(tierId),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}
