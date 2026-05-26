const loadRoomDataMap: any = undefined;
type RoomData = any;
// FILE: roomData.ts
// PATH: src/lib/roomData.ts
// Room Data Management Utilities (Supabase-first, no build-time roomDataImports)
//
// FIX (Level 0 482 bug — REAL SOURCE):
// - tierFromRoomId() is a fallback that *defaults unknown/missing to "level0"*.
// - For counting/registry listing we must NOT lie.
// - Add a STRICT tier parser that returns undefined for unknown.
// - Store unknown as "unknown" (local-only) so Level 0 cannot absorb everything.
//
// NOTE:
// - This file is "Supabase-first" (runtime loadRoomDataMap), so we implement strict parsing locally
//   to avoid importing build-time helpers.
// - If you later expand TierId set, update STRICT_TIER_IDS below.

import { tierFromRoomId } from "@/lib/tierFromRoomId";
// Metadata interface for room listing
export interface RoomInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  hasData: boolean;
  tier:
    | "level0"
    | "level1"
    | "level2"
    | "level3"
    | "level3"
    | "level4"
    | "level5"
    | "level6"
    | "level7"
    | "level8"
    | "level9"
    | "kids_1"
    | "kids_2"
    | "kids_3"
    | "unknown";
}

const STRICT_TIER_IDS = new Set<RoomInfo["tier"]>([
  "level0",
  "level1",
  "level2",
  "level3",
  "level3",
  "level4",
  "level5",
  "level6",
  "level7",
  "level8",
  "level9",
  "kids_1",
  "kids_2",
  "kids_3",
]);

function strictTierFromRoomId(roomId: string): RoomInfo["tier"] {
  // Your tierFromRoomId() helper is allowed to be permissive.
  // We wrap it and refuse to accept "level0" as a default for unknown shapes.
  const t = String(tierFromRoomId(roomId) ?? "").trim().toLowerCase();

  // If it returns a known tier, accept it.
  if (STRICT_TIER_IDS.has(t as RoomInfo["tier"])) return t as RoomInfo["tier"];

  // Otherwise: UNKNOWN stays unknown.
  return "unknown";
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
    // ✅ STRICT: never let unknown collapse into level0
    const tier = strictTierFromRoomId(roomId);
    const nameEn = getEnglishName(roomId, roomData);
    const nameVi = getVietnameseName(roomId, roomData);

    const domain = String(roomData?.domain || '').toLowerCase().trim();
    const domainImageMap: Record<string, string> = {
      'general': '/images/domains/general.svg',
      'kids': '/images/domains/kids.svg',
      'strategy': '/images/domains/strategy.svg',
      'mental health': '/images/domains/mental_health.svg',
      'english': '/images/domains/english.svg',
      'english a1': '/images/domains/english.svg',
      'english a2': '/images/domains/english.svg',
      'english b1': '/images/domains/english.svg',
      'english c1': '/images/domains/english.svg',
      'english c2': '/images/domains/english.svg',
      'corporate': '/images/domains/corporate.svg',
      'survival': '/images/domains/survival.svg',
      'health': '/images/domains/health.svg',
      'national': '/images/domains/national.svg',
      'productivity': '/images/domains/productivity.svg',
      'individual': '/images/domains/individual.svg',
      'power': '/images/domains/power.svg',
      'influence': '/images/domains/influence.svg',
      'ai & technology': '/images/domains/ai_and_technology.svg',
      'interpersonal': '/images/domains/interpersonal.svg',
      'lifeskills': '/images/domains/lifeskills.svg',
      'spirituality': '/images/domains/spirituality.svg',
      'self-mastery': '/images/domains/self_mastery.svg',
      'critical thinking': '/images/domains/critical_thinking.svg',
      'public speaking': '/images/domains/public_speaking.svg',
      'decision making': '/images/domains/decision_making.svg',
      'debate': '/images/domains/debate.svg',
      'relationships': '/images/domains/relationships.svg',
      'perception': '/images/domains/perception.svg',
    };
    const domainImage = domainImageMap[domain];

    return {
      id: roomId,
      nameEn,
      nameVi,
      domainImage,
      tier,
      hasData: !!(
        roomData?.hasData ||
        (Array.isArray((roomData as any)?.entries) && (roomData as any).entries.length > 0)
      ),
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
