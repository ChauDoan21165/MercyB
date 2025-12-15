// src/lib/roomData.ts
// Room Data Management Utilities (Supabase-first, no build-time roomDataImports)

import { tierFromRoomId } from "@/lib/tierFromRoomId";
import type { RoomData } from "./roomDataLoader";
import { loadRoomDataMap } from "./roomDataLoader";

// Metadata interface for room listing
export interface RoomInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  hasData: boolean;
  tier:
    | "free"
    | "vip1"
    | "vip2"
    | "vip3"
    | "vip4"
    | "vip5"
    | "vip6"
    | "vip7"
    | "vip8"
    | "vip9";
}

// Normalize room name extraction (supports older schemas)
function getEnglishName(roomId: string, roomData: any): string {
  return (
    roomData?.nameEn ||
    roomData?.name ||
    roomData?.title?.en ||
    roomData?.title?.en_us ||
    roomData?.meta?.title_en ||
    roomId
  );
}

function getVietnameseName(roomId: string, roomData: any): string {
  return (
    roomData?.nameVi ||
    roomData?.name_vi ||
    roomData?.title?.vi ||
    roomData?.meta?.title_vi ||
    roomId
  );
}

/**
 * ✅ Supabase-first room list (async)
 * This avoids build-time imports like "./roomDataImports" which can break Vercel builds.
 */
export async function getAllRooms(): Promise<RoomInfo[]> {
  const roomDataMap: Record<string, RoomData> = await loadRoomDataMap();

  const rooms: RoomInfo[] = Object.entries(roomDataMap).map(([roomId, roomData]) => {
    const tier = tierFromRoomId(roomId) as RoomInfo["tier"];
    const nameEn = getEnglishName(roomId, roomData);
    const nameVi = getVietnameseName(roomId, roomData);

    return {
      id: roomId,
      nameEn,
      nameVi,
      tier,
      hasData: !!(roomData?.hasData || (Array.isArray((roomData as any)?.entries) && (roomData as any).entries.length > 0)),
    };
  });

  return rooms.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getRoomsByTier(tier: RoomInfo["tier"]): Promise<RoomInfo[]> {
  const all = await getAllRooms();
  return all.filter((r) => r.tier === tier);
}

export async function getRoomInfo(roomId: string): Promise<RoomInfo | null> {
  const all = await getAllRooms();
  return all.find((r) => r.id === roomId) || null;
}
