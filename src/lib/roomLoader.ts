// src/lib/roomLoader.ts
import { supabase } from '@/integrations/supabase/client';
import { processEntriesOptimized } from './roomLoaderHelpers';
import { ROOMS_TABLE, AUDIO_FOLDER } from '@/lib/constants/rooms';
import { normalizeTier, type TierId, KIDS_TIER_IDS } from '@/lib/constants/tiers';
import type { Database } from '@/integrations/supabase/types';
import { logger } from './logger';
import { useSWR } from './cache/swrCache';

type RoomRow = Database['public']['Tables']['rooms']['Row'];

// Error codes for distinguishing room load failures
export type RoomLoadErrorCode = 'ROOM_NOT_FOUND' | 'ACCESS_DENIED' | 'AUTH_REQUIRED';

// Return type for room loader
export type LoadedRoomResult = {
  merged: any[];
  keywordMenu: { en: string[]; vi: string[] };
  audioBasePath: string;
  roomTier?: TierId | null;
  errorCode?: RoomLoadErrorCode;
};

// Kids tier array for cleaner checks
const KIDS_TIERS: readonly TierId[] = KIDS_TIER_IDS;

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
    return null;
  }
  
  if (!dbRoom) {
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

  const { keywordMenu, merged } = processEntriesOptimized(dbRoom.entries, dbRoomId);

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

    const { keywordMenu, merged } = processEntriesOptimized(jsonData.entries, roomId);
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
 * Helper to check if a tier is a kids tier
 */
const isKidsTier = (tier: TierId | null | undefined): boolean => {
  if (!tier) return false;
  return (KIDS_TIERS as readonly string[]).includes(tier);
};

/**
 * Main room loader with SWR caching - returns cached data instantly, revalidates in background
 */
export const loadMergedRoom = async (roomId: string): Promise<LoadedRoomResult> => {
  const cacheKey = `room:${roomId}`;
  
  return useSWR({
    key: cacheKey,
    fetcher: () => loadMergedRoomInternal(roomId),
    ttl: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Internal room loader - optimized for fast loading with tier-based access control
 * SECURITY: Fetches authenticated user tier internally, never trusts caller
 */
const loadMergedRoomInternal = async (roomId: string): Promise<LoadedRoomResult> => {
  const startTime = performance.now();
  const { canUserAccessRoom } = await import('./accessControl');

  try {
    // 1. Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        merged: [],
        keywordMenu: { en: [], vi: [] },
        audioBasePath: AUDIO_BASE_PATH,
        errorCode: 'AUTH_REQUIRED',
      };
    }

    // 2. Check admin status via has_role RPC
    const { data: isAdminRpc, error: adminError } = await supabase.rpc('has_role', {
      _role: 'admin',
      _user_id: user.id,
    });

    if (adminError) {
      logger.error('Error checking admin role', { scope: 'roomLoader', error: adminError.message });
    }

    const isAdmin = !!isAdminRpc;

    // 3. Get user's tier from database
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('subscription_tiers(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    const rawUserTier = (subscription?.subscription_tiers as any)?.name || 'Free / Miễn phí';
    const baseTier: TierId = normalizeTier(rawUserTier);
    const normalizedUserTier: TierId = isAdmin ? 'vip9' : baseTier;

    // Special handling for Kids tiers (using helper)
    const isUserKidsTier = isKidsTier(baseTier);

    // 4. Normalize room ID
    const dbRoomId = normalizeRoomId(roomId);

    // 5. Try database first
    try {
      const dbResult = await loadFromDatabase(dbRoomId);
  
      if (dbResult) {
        // Safety net: if keyword menu is empty but merged entries exist,
        // rebuild keyword menu from entry-level keywordEn/keywordVi fields
        if (
          dbResult.keywordMenu &&
          Array.isArray(dbResult.merged) &&
          dbResult.merged.length > 0 &&
          (!dbResult.keywordMenu.en || dbResult.keywordMenu.en.length === 0)
        ) {
          const fallbackEn: string[] = [];
          const fallbackVi: string[] = [];
  
          (dbResult.merged as any[]).forEach((entry) => {
            const en = String(entry.keywordEn || entry.slug || entry.identifier || '').trim();
            const vi = String(entry.keywordVi || entry.keywordEn || entry.slug || '').trim();
  
            if (en) {
              fallbackEn.push(en);
              fallbackVi.push(vi);
            }
          });
  
          dbResult.keywordMenu = {
            en: fallbackEn,
            vi: fallbackVi,
          };
        }
  
        const normalizedRoomTier = dbResult.roomTier ?? ('free' as TierId);
        const isRoomKidsTier = isKidsTier(normalizedRoomTier);
        
        // 6. Enforce access control using authenticated tier (admins bypass)
        if (!isAdmin) {
          if (isUserKidsTier && !isRoomKidsTier) {
            return {
              merged: [],
              keywordMenu: { en: [], vi: [] },
              audioBasePath: AUDIO_BASE_PATH,
              roomTier: normalizedRoomTier,
              errorCode: 'ACCESS_DENIED',
            };
          }
          
          if (!canUserAccessRoom(normalizedUserTier, normalizedRoomTier)) {
            return {
              merged: [],
              keywordMenu: { en: [], vi: [] },
              audioBasePath: AUDIO_BASE_PATH,
              roomTier: normalizedRoomTier,
              errorCode: 'ACCESS_DENIED',
            };
          }
        }
  
        // Log successful load with performance
        const duration = performance.now() - startTime;
        logger.roomLoad(roomId, duration, true, { source: 'database', entryCount: dbResult.merged.length });
        
        return dbResult;
      }
    } catch (dbError: any) {
      // Database load failed, continue to JSON fallback
      logger.error('Database load error', { scope: 'roomLoader', roomId, error: dbError?.message });
    }

    // 7. Fallback to JSON files (with tier enforcement)
    // Use normalized ID first, then try original if different
    try {
      let jsonResult = await loadFromJson(dbRoomId);
      
      // Extra safety: if normalized ID didn't find it, try original
      if (!jsonResult && dbRoomId !== roomId) {
        jsonResult = await loadFromJson(roomId);
      }
      
      if (jsonResult) {
        const isRoomKidsTierJson = isKidsTier(jsonResult.roomTier);
        
        // Enforce tier access for JSON rooms too (admins bypass)
        if (jsonResult.roomTier && !isAdmin) {
          if (isUserKidsTier && !isRoomKidsTierJson) {
            return {
              merged: [],
              keywordMenu: { en: [], vi: [] },
              audioBasePath: AUDIO_BASE_PATH,
              roomTier: jsonResult.roomTier,
              errorCode: 'ACCESS_DENIED',
            };
          }
          
          if (!canUserAccessRoom(normalizedUserTier, jsonResult.roomTier)) {
            return {
              merged: [],
              keywordMenu: { en: [], vi: [] },
              audioBasePath: AUDIO_BASE_PATH,
              roomTier: jsonResult.roomTier,
              errorCode: 'ACCESS_DENIED',
            };
          }
        }
        
        // Log successful load with performance
        const duration = performance.now() - startTime;
        logger.roomLoad(roomId, duration, true, { source: 'json', entryCount: jsonResult.merged.length });
        
        return jsonResult;
      }
    } catch (error: any) {
      // Failed to load room from JSON
      logger.error('JSON load error', { scope: 'roomLoader', roomId, error: error?.message });
    }

    // 8. Room not found - return with explicit errorCode
    const duration = performance.now() - startTime;
    logger.roomLoad(roomId, duration, false, { error: 'Room not found in database or JSON' });

    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: AUDIO_BASE_PATH,
      errorCode: 'ROOM_NOT_FOUND',
    };
  } catch (error: any) {
    // Log error and return with error code
    const duration = performance.now() - startTime;
    logger.error('Room load error', {
      scope: 'roomLoader',
      roomId,
      duration_ms: duration,
      error: error.message,
      errorStack: error.stack,
    });
    
    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: AUDIO_BASE_PATH,
      errorCode: 'ROOM_NOT_FOUND',
    };
  }
};
