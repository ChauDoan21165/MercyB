// src/lib/roomLoader.ts
import { supabase } from '@/integrations/supabase/client';
import { processEntriesOptimized } from './roomLoaderHelpers';
import { ROOMS_TABLE, AUDIO_FOLDER } from '@/lib/constants/rooms';
import { normalizeTier, type TierId } from '@/lib/constants/tiers';
import type { Database } from '@/integrations/supabase/types';

// Optional: if you want to plug hygiene checks later
// import { validateRoom } from '@/lib/validation/roomValidator';

type RoomRow = Database['public']['Tables']['rooms']['Row'];

const ROOM_ID_OVERRIDES: Record<string, string> = {
  // VIP3 II Writing Deep-Dive rooms - map URL IDs to canonical DB IDs
  'english-writing-deep-dive-vip3-ii': 'english-writing-deep-dive-vip3II',
  'english-writing-deep-dive-vip3-ii-ii': 'english-writing-deep-dive-vip3II-II',
  'english-writing-deep-dive-vip3-iii': 'english-writing-deep-dive-vip3ii-III',
};

const normalizeRoomId = (roomId: string): string => {
  // 1. Explicit overrides first
  if (ROOM_ID_OVERRIDES[roomId]) {
    return ROOM_ID_OVERRIDES[roomId];
  }

  // 2. Kids rooms: strip suffix and kebab-case
  if (roomId.endsWith('_kids_l1')) {
    return roomId.replace('_kids_l1', '').replace(/_/g, '-');
  }

  // 3. Handle VIP3II / Roman numeral suffixes (case-insensitive -> uppercase)
  const romanNumeralPattern = /-(i+|ii|iii|iv|v|vi|vii|viii|ix|x)$/i;
  if (romanNumeralPattern.test(roomId)) {
    return roomId.replace(romanNumeralPattern, (match) => match.toUpperCase());
  }

  // 4. Regular rooms: use as-is (database uses kebab/hyphen IDs)
  return roomId;
};

const AUDIO_BASE_PATH = `${AUDIO_FOLDER}/`;

/**
 * Load room from database
 */
const loadFromDatabase = async (dbRoomId: string) => {
  const { data: dbRoom, error } = await supabase
    .from(ROOMS_TABLE)
    .select('*')
    .eq('id', dbRoomId)
    .maybeSingle<RoomRow>();

  if (error) {
    console.warn('[roomLoader] Database error for room:', dbRoomId, error);
    return null;
  }
  
  if (!dbRoom) {
    console.warn('[roomLoader] Room not found in database:', dbRoomId);
    return null;
  }

  const hasEntries = Array.isArray(dbRoom.entries) && dbRoom.entries.length > 0;
  const roomTier: TierId | null = dbRoom.tier ? normalizeTier(dbRoom.tier) : null;

  // If no entries, check for room-level keywords
  if (!hasEntries) {
    const hasRoomKeywords = Array.isArray(dbRoom.keywords) && dbRoom.keywords.length > 0;
    if (!hasRoomKeywords) return null;

    return {
      merged: [],
      keywordMenu: {
        en: dbRoom.keywords || [],
        vi: dbRoom.keywords || [],
      },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
    };
  }

  // Optional: data hygiene validation (non-blocking for now)
  // const validation = validateRoom(dbRoom);
  // if (!validation.isValid) {
  //   console.warn('Room validation failed', dbRoom.id, validation.errors);
  // }

  const { keywordMenu, merged } = processEntriesOptimized(dbRoom.entries);

  return {
    merged,
    keywordMenu,
    audioBasePath: AUDIO_BASE_PATH,
    roomTier,
  };
};

/**
 * Load room from static JSON files (fallback)
 * NOTE: should be phased out. Tier enforcement here is best-effort.
 */
const loadFromJson = async (roomId: string) => {
  try {
    const { loadRoomJson } = await import('./roomJsonResolver');
    const jsonData = await loadRoomJson(roomId);

    if (!Array.isArray(jsonData?.entries) || jsonData.entries.length === 0) {
      return null;
    }

    // Optional hygiene check here too
    // const validation = validateRoom(jsonData);
    // if (!validation.isValid) {
    //   console.warn('JSON room validation failed', jsonData.id, validation.errors);
    // }

    const { keywordMenu, merged } = processEntriesOptimized(jsonData.entries);
    const roomTier: TierId | null = jsonData.tier ? normalizeTier(jsonData.tier) : null;

    return {
      merged,
      keywordMenu,
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
    };
  } catch (error) {
    console.error('Failed to load room from JSON:', error);
    return null;
  }
};

/**
 * Main room loader - optimized for fast loading with tier-based access control
 * SECURITY: Fetches authenticated user tier internally, never trusts caller
 */
export const loadMergedRoom = async (roomId: string) => {
  const { canUserAccessRoom } = await import('./accessControl');

  // 1. Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }

  // 2. Get user's tier from database
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('subscription_tiers(name)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  const rawUserTier = (subscription?.subscription_tiers as any)?.name || 'Free / Miễn phí';
  const normalizedUserTier: TierId = normalizeTier(rawUserTier);

  // 3. Normalize room ID
  const dbRoomId = normalizeRoomId(roomId);
  
  console.log('[roomLoader] Loading room:', roomId, '→', dbRoomId, '| User tier:', normalizedUserTier);

  // 4. Try database first
  try {
    const dbResult = await loadFromDatabase(dbRoomId);

    if (dbResult) {
      const normalizedRoomTier = dbResult.roomTier ?? ('free' as TierId);
      console.log('[roomLoader] Room tier:', normalizedRoomTier, '| Access check:', canUserAccessRoom(normalizedUserTier, normalizedRoomTier));

      // 5. Enforce access control using authenticated tier
      if (!canUserAccessRoom(normalizedUserTier, normalizedRoomTier)) {
        console.warn('[roomLoader] Access denied:', normalizedUserTier, 'cannot access', normalizedRoomTier);
        throw new Error('ACCESS_DENIED_INSUFFICIENT_TIER');
      }

      return dbResult;
    }
  } catch (dbError: any) {
    if (dbError?.message === 'ACCESS_DENIED_INSUFFICIENT_TIER') {
      throw dbError;
    }
    console.error('[roomLoader] Database load failed:', dbError);
  }

  // 6. Fallback to JSON files (with tier enforcement)
  try {
    console.warn('[roomLoader] Falling back to JSON for room:', roomId);
    const jsonResult = await loadFromJson(roomId);
    if (jsonResult) {
      // Enforce tier access for JSON rooms too
      if (jsonResult.roomTier) {
        if (!canUserAccessRoom(normalizedUserTier, jsonResult.roomTier)) {
          console.warn('[roomLoader] Access denied (JSON):', normalizedUserTier, 'cannot access', jsonResult.roomTier);
          throw new Error('ACCESS_DENIED_INSUFFICIENT_TIER');
        }
      }
      return jsonResult;
    }
  } catch (error: any) {
    if (error?.message === 'ACCESS_DENIED_INSUFFICIENT_TIER') {
      throw error;
    }
    console.error('[roomLoader] Failed to load room:', error);
  }

  // 7. Empty fallback
  return {
    merged: [],
    keywordMenu: { en: [], vi: [] },
    audioBasePath: AUDIO_BASE_PATH,
  };
};
