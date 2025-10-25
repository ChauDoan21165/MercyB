// Room Data Management Utilities
// This file provides helper functions for working with room data
import { roomDataMap } from './roomDataImports';

export interface RoomInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  hasData: boolean;
  tier: 'free' | 'vip1' | 'vip2' | 'vip3';
  dataFile?: string;
}

// Auto-generate room info from loaded room data
function generateRoomInfo(): RoomInfo[] {
  const rooms: RoomInfo[] = [];
  
  for (const [roomId, roomData] of Object.entries(roomDataMap)) {
    // Extract tier from room data meta or tier field
    const rawTier = (roomData.meta?.tier || roomData.tier || 'free').toLowerCase();
    // Normalize tier format: "vip 3 / cấp vip 3" -> "vip3", "vip 1" -> "vip1", etc.
    const tier = rawTier.replace(/\s+/g, '').split('/')[0] as RoomInfo['tier'];
    
    // Extract names from room data
    const nameEn = roomData.description?.en?.split('.')[0] || 
                   roomData.title?.en ||
                   roomId.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const nameVi = roomData.description?.vi?.split('.')[0] ||
                   roomData.title?.vi ||
                   nameEn;
    
    rooms.push({
      id: roomId,
      nameVi: nameVi,
      nameEn: nameEn,
      hasData: true,
      tier: tier,
      dataFile: `${roomId.replace(/-/g, '_')}.json`
    });
  }
  
  return rooms.sort((a, b) => a.id.localeCompare(b.id));
}

// Complete list of all rooms in the app (auto-generated)
export const ALL_ROOMS: RoomInfo[] = generateRoomInfo();

// Get room info by ID
export function getRoomInfo(roomId: string): RoomInfo | null {
  return ALL_ROOMS.find(room => room.id === roomId) || null;
}

// Get all rooms with data
export function getRoomsWithData(): RoomInfo[] {
  return ALL_ROOMS.filter(room => room.hasData);
}

// Get rooms by tier
export function getRoomsByTier(tier: RoomInfo['tier']): RoomInfo[] {
  return ALL_ROOMS.filter(room => room.tier === tier);
}

/**
 * Room Data Structure (from JSON files):
 * 
 * Each room JSON contains:
 * - schema_version: Version of the data schema
 * - schema_id: Unique identifier for the room
 * - description: { en, vi } - Room descriptions in both languages
 * - supported_languages: Array of language codes
 * - keywords: Object mapping keyword groups to {en, vi} arrays
 * - entries: Array of consultation entries with:
 *   - artifact_id: Unique ID for the entry
 *   - title: { en, vi }
 *   - content: { en, vi }
 *   - keywords: Related keywords
 *   - tags: Categories
 * - crisis_footer: { en, vi } - Emergency contact info
 * - safety_disclaimer: { en, vi } - Medical disclaimer
 * - room_essay: { en, vi } - Comprehensive room overview
 * 
 * The AI uses this structured data to provide contextual,
 * bilingual responses that are educational and safe.
 */
