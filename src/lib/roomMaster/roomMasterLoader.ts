// RoomMaster Loader - Unified loader for JSON and database rooms

import type { RoomJson, RoomMasterOutput, ValidationMode } from './roomMasterTypes';
import { validateRoom } from './roomMaster';

/**
 * Load room from JSON file or database and run through RoomMaster validation
 */
export async function roomMasterLoader(
  roomId: string,
  mode: ValidationMode = { mode: 'relaxed', allowMissingFields: true, allowEmptyEntries: false, requireAudio: false, requireBilingualCopy: true, minEntries: 2, maxEntries: 8 }
): Promise<RoomMasterOutput> {
  try {
    // SUPABASE IS NOW THE ONLY SOURCE OF TRUTH
    // Try loading from database first (primary source)
    const dbData = await loadRoomFromDatabase(roomId);
    
    if (dbData) {
      return validateRoom(dbData, mode);
    }

    // Room not found
    throw new Error(`Room not found: ${roomId}`);
  } catch (error: any) {
    // Return error output
    return {
      cleanedRoom: {
        id: roomId,
        tier: 'free',
        title: { en: 'Not Found', vi: 'Không Tìm Thấy' },
        entries: [],
      },
      errors: [{
        field: 'room',
        rule: 'ROOM_NOT_FOUND',
        severity: 'error',
        message: error.message || 'Room not found',
        autoFixable: false,
      }],
      warnings: [],
      autofixed: false,
      crisisFlags: [],
      validationMode: mode.mode,
    };
  }
}

/**
 * Load room from JSON file at /public/data/{id}.json
 */
async function loadRoomJson(roomId: string): Promise<RoomJson | null> {
  try {
    // Construct canonical path: /public/data/{id}.json
    const path = `/public/data/${roomId}.json`;
    
    const response = await fetch(path);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data as RoomJson;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[RoomMasterLoader] Failed to load JSON for ${roomId}:`, error);
    }
    return null;
  }
}

/**
 * Load room from database
 */
async function loadRoomFromDatabase(roomId: string): Promise<RoomJson | null> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .maybeSingle();

    if (error || !room) {
      return null;
    }

    // Transform database row to RoomJson format
    const roomJson: RoomJson = {
      id: room.id,
      tier: room.tier || 'free',
      title: {
        en: room.title_en || room.id,
        vi: room.title_vi || room.title_en || room.id,
      },
      entries: Array.isArray(room.entries) ? room.entries : [],
    };

    if (room.room_essay_en || room.room_essay_vi) {
      roomJson.content = {
        en: room.room_essay_en || '',
        vi: room.room_essay_vi || '',
      };
    }

    if (Array.isArray(room.keywords) && room.keywords.length > 0) {
      roomJson.keywords = room.keywords;
    }

    if (room.domain) {
      roomJson.domain = room.domain;
    }

    if (room.schema_id) {
      roomJson.schema_id = room.schema_id;
    }

    if (room.safety_disclaimer_en || room.safety_disclaimer_vi) {
      roomJson.safety_disclaimer = {
        en: room.safety_disclaimer_en || '',
        vi: room.safety_disclaimer_vi || '',
      };
    }

    if (room.crisis_footer_en || room.crisis_footer_vi) {
      roomJson.crisis_footer = {
        en: room.crisis_footer_en || '',
        vi: room.crisis_footer_vi || '',
      };
    }

    return roomJson;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[RoomMasterLoader] Failed to load from database for ${roomId}:`, error);
    }
    return null;
  }
}

/**
 * Batch load multiple rooms
 */
export async function roomMasterBatchLoader(
  roomIds: string[],
  mode: ValidationMode = { mode: 'relaxed', allowMissingFields: true, allowEmptyEntries: false, requireAudio: false, requireBilingualCopy: true, minEntries: 2, maxEntries: 8 }
): Promise<RoomMasterOutput[]> {
  const results = await Promise.all(
    roomIds.map(id => roomMasterLoader(id, mode))
  );
  
  return results;
}