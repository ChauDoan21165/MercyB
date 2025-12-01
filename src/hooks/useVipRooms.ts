// VIP rooms data hook following Mercy Blade Design System v1.1
// EMERGENCY RESTORATION: Show ALL rooms for tier, ignore domain filters

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { ROOMS_TABLE, TierId, TIER_ID_TO_LABEL } from '@/lib/constants';

export type VipRoom = Database["public"]["Tables"]["rooms"]["Row"];

// Emergency helper: Get ALL rooms for a tier (no domain filtering)
async function getEmergencyRoomsForTier(tierId: TierId): Promise<VipRoom[]> {
  const isDev = import.meta.env.DEV;
  
  // Get canonical tier label
  const tierLabel = TIER_ID_TO_LABEL[tierId];
  
  if (isDev) {
    console.log('[EmergencyRooms] Fetching for tier:', tierId, '→ label:', tierLabel);
  }

  try {
    // Query DB: tier match + active only, NO domain filter
    const { data, error } = await supabase
      .from(ROOMS_TABLE)
      .select('*')
      .eq('tier', tierLabel)
      .neq('is_active', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[EmergencyRooms] DB error:', error);
      throw error;
    }

    if (isDev) {
      console.log('[EmergencyRooms]', tierId, '→', (data || []).length, 'rooms');
    }

    return data || [];
  } catch (err) {
    console.error(`[EmergencyRooms] Failed to fetch ${tierId} rooms:`, err);
    // TODO: Fallback to JSON if needed
    return [];
  }
}

// Emergency hook: Show ALL rooms for tier
export function useEmergencyVipRooms(tierId: TierId) {
  return useQuery({
    queryKey: ['emergency-rooms', tierId],
    queryFn: () => getEmergencyRoomsForTier(tierId),
    staleTime: 2 * 60 * 1000, // 2 min
  });
}
