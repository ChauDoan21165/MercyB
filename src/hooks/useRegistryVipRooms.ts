// src/hooks/useRegistryVipRooms.ts
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
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { TIER_ID_TO_LABEL, type TierId } from "@/lib/constants/tiers";

export interface RegistryRoom {
  id: string;
  title_en: string;
  title_vi: string;
  tier: string;
  domain?: string;
  is_active: boolean;
  hasData: boolean;
}

type FetchedRoom = {
  id: string;
  nameEn?: string;
  nameVi?: string;
  domain?: string;
  hasData?: boolean;
};

type DbRoom = {
  id: string;
  tier: string | null;
  domain: string | null;
};

async function fetchRegistryVipRooms(tierId: TierId): Promise<RegistryRoom[]> {
  const tierLabel = TIER_ID_TO_LABEL[tierId];

  // TODO: replace with real runtime loader when implemented
  // Currently returns empty — rooms come from useCachedRooms instead
  const fetchedRooms: FetchedRoom[] = [];

  if (import.meta.env.DEV) {
    console.log(
      `[RegistryVipRooms] ${tierId} → ${fetchedRooms.length} rooms from fetcher`,
    );
  }

  if (fetchedRooms.length === 0) return [];

  const roomIds = fetchedRooms.map((r) => r.id);

  const { data: dbRooms, error } = await supabase
    .from("rooms")
    .select("id, tier, domain")
    .in("id", roomIds);

  if (error) {
    // DB is optional enhancement — log in DEV only and continue
    if (import.meta.env.DEV) {
      console.warn(`[RegistryVipRooms] DB query warning for ${tierId}:`, error);
    }
  }

  const dbRoomMap = new Map<string, DbRoom>(
    (dbRooms ?? []).map((r) => [r.id, r]),
  );

  const mergedRooms: RegistryRoom[] = fetchedRooms.map((room) => {
    const dbRoom = dbRoomMap.get(room.id);

    return {
      id: room.id,
      title_en: room.nameEn ?? room.id,
      title_vi: room.nameVi ?? "",
      tier: tierLabel,
      domain: dbRoom?.domain ?? room.domain,
      is_active: true,
      hasData: room.hasData !== false,
    };
  });

  if (import.meta.env.DEV) {
    console.log(
      `[RegistryVipRooms] ${tierId} → ${mergedRooms.length} rooms loaded`,
    );
  }

  return mergedRooms;
}

export function useRegistryVipRooms(tierId: TierId) {
  return useQuery({
    queryKey: ["registry-vip-rooms", tierId],
    queryFn:  () => fetchRegistryVipRooms(tierId),
    staleTime: 5 * 60 * 1000,
  });
}