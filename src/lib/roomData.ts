// Room Data Management Utilities
// This file provides helper functions for working with room data
// Now uses async roomFetcher instead of static roomDataImports

import { getRoomList, getRoom, type RoomMeta } from './roomFetcher';

// Fallback Vietnamese names for rooms without name_vi in JSON
const VIETNAMESE_NAME_FALLBACKS: Record<string, string> = {
  // God With Us
  'god-with-us': 'Thiên Chúa Cùng Ta',
  'god-with-us-vip1': 'Thiên Chúa Cùng Ta VIP1',
  'god-with-us-vip2': 'Thiên Chúa Cùng Ta VIP2',
  'god-with-us-vip3': 'Thiên Chúa Cùng Ta VIP3',
  
  // Philosophy & Stoicism
  'philosophy-of-everyday': 'Triết Học Đời Thường',
  'stoicism': 'Chủ Nghĩa Khắc Kỷ',
  
  // Women Health
  'women-health-free': 'Sức Khỏe Phụ Nữ',
  
  // ADHD Support
  'adhd-support-free': 'Hỗ Trợ Rối Loạn Tăng Động Giảm Chú Ý',
  
  // VIP6 Rooms
  'vip6-pride-ego-shadow': 'Bóng Tối Kiêu Ngạo & Cái Tôi',
  'vip6-abandonment-wound': 'Vết Thương Bị Bỏ Rơi',
  'vip6-attachment-trauma': 'Mô Thức Tổn Thương Gắn Bó',
};

// Metadata interface for room listing
export interface RoomInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  hasData: boolean;
  tier: string;
  dataFile?: string;
}

// Type alias for backward compatibility
export type Room = RoomInfo;

// Full room data structure from JSON files
export interface RoomData {
  id?: string;
  name?: string;
  name_vi?: string;
  nameEn?: string;
  nameVi?: string;
  title?: any;
  description?: any;
  keywords?: any;
  keywords_dict?: any;
  entries?: any;
  meta?: any;
  tier?: string;
  safety_disclaimer?: string;
  safety_disclaimer_vi?: string;
  crisis_footer?: {
    en?: string;
    vi?: string;
  };
  room_essay?: any;
  hasData?: boolean;
  [key: string]: any;
}

// Cache for room list (loaded once)
let roomListCache: RoomInfo[] | null = null;
let roomListPromise: Promise<RoomInfo[]> | null = null;

/**
 * Load room list asynchronously
 */
async function loadRoomList(): Promise<RoomInfo[]> {
  if (roomListCache) return roomListCache;
  
  if (!roomListPromise) {
    roomListPromise = getRoomList().then(rooms => {
      const sanitize = (s?: string) => {
        const raw = String(s || '').trim();
        return raw
          .replace(/\s*\(?(?:free|vip\s*-?\s*[1-9])\)?$/i, '')
          .replace(/\b(?:free|vip\s*-?\s*[1-9])\b/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
      };
      
      roomListCache = rooms.map(room => ({
        id: room.id,
        nameEn: sanitize(room.nameEn),
        nameVi: sanitize(room.nameVi) || VIETNAMESE_NAME_FALLBACKS[room.id] || room.nameEn,
        tier: room.tier,
        hasData: room.hasData,
      }));
      
      return roomListCache;
    });
  }
  
  return roomListPromise;
}

/**
 * Get all rooms (async)
 */
export async function getAllRoomsAsync(): Promise<RoomInfo[]> {
  return loadRoomList();
}

/**
 * Get room info by ID (async)
 */
export async function getRoomInfoAsync(roomId: string): Promise<RoomInfo | null> {
  const rooms = await loadRoomList();
  return rooms.find(room => room.id === roomId) || null;
}

/**
 * Get room info by ID (sync - returns null if not cached yet)
 * @deprecated Use getRoomInfoAsync instead
 */
export function getRoomInfo(roomId: string): RoomInfo | null {
  if (!roomListCache) {
    // Trigger async load in background
    loadRoomList().catch(console.error);
    return null;
  }
  return roomListCache.find(room => room.id === roomId) || null;
}

/**
 * Get all rooms - sync version (returns empty if not loaded)
 * @deprecated Use getAllRoomsAsync instead
 */
export function getAllRooms(): RoomInfo[] {
  if (!roomListCache) {
    loadRoomList().catch(console.error);
    return [];
  }
  return roomListCache;
}

// Alias for backward compatibility
export const ALL_ROOMS = {
  get value() {
    return getAllRooms();
  }
};

/**
 * Get rooms with data
 */
export function getRoomsWithData(): RoomInfo[] {
  return getAllRooms().filter(room => room.hasData);
}

/**
 * Get rooms by tier
 */
export function getRoomsByTier(tier: string): RoomInfo[] {
  return getAllRooms().filter(room => room.tier === tier);
}

/**
 * Clear the cache
 */
export function clearRoomDataCache(): void {
  roomListCache = null;
  roomListPromise = null;
}
