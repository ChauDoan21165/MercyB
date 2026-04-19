// src/hooks/useVipRooms.ts
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
 * - Level 1 rooms: tier = "Level 1 / Level 1" (exact match only)
 * - Level 9 rooms: tier = "Level 9 / Cấp Level 9" (exact match only)
 *
 * If you see fewer rooms than expected:
 * → Check DB: room probably has wrong tier value or is_active=false
 * → Run: npx tsx scripts/audit-db-tiers.ts
 * → Fix data in Supabase UI
 * → Don't add guessing logic here
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/integrations/supabase/types";
import { ROOMS_TABLE, type TierId, TIER_ID_TO_LABEL } from "@/lib/constants";

export type VipRoom = Database["public"]["Tables"]["rooms"]["Row"];

async function fetchStrictVipRooms(tierId: TierId): Promise<VipRoom[]> {
  const tierLabel = TIER_ID_TO_LABEL[tierId];

  const { data, error } = await supabase
    .from(ROOMS_TABLE)
    .select("*")
    .eq("tier", tierLabel)
    .order("created_at", { ascending: false });

  if (error) {
    if (import.meta.env.DEV) {
      console.error(`[VipRooms] DB error for ${tierId}:`, error);
    }
    throw error;
  }

  if (import.meta.env.DEV) {
    console.log(
      `[VipRooms] ${tierId} → ${(data ?? []).length} rooms (tier="${tierLabel}")`,
    );
  }

  return data ?? [];
}

export function useVipRooms(tierId: TierId) {
  return useQuery({
    queryKey: ["vip-rooms", tierId],
    queryFn: () => fetchStrictVipRooms(tierId),
    staleTime: 5 * 60 * 1000,
  });
}