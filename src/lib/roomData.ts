// Room Data Management Utilities
// This file provides helper functions for working with room data
import { roomDataMap } from './roomDataImports';

// Fallback Vietnamese names for rooms without name_vi in JSON
const VIETNAMESE_NAME_FALLBACKS: Record<string, string> = {
  // God With Us
  'god-with-us': 'Thiên Chúa Cùng Ta',
  'god-with-us-vip1': 'Thiên Chúa Cùng Ta VIP1',
  'god-with-us-vip2': 'Thiên Chúa Cùng Ta VIP2',
  'god-with-us-vip3': 'Thiên Chúa Cùng Ta VIP3',
  
  // Philosophy & Stoicism
  'philosophy-of-everyday': 'Triết Học Đời Thường',
  'philosophy-of-everyday-vip1': 'Triết Học Đời Thường VIP1',
  'philosophy-of-everyday-vip2': 'Triết Học Đời Thường VIP2',
  'philosophy-of-everyday-vip3': 'Triết Học Đời Thường VIP3',
  'stoicism': 'Chủ Nghĩa Khắc Kỷ',
  'stoicism-vip1': 'Chủ Nghĩa Khắc Kỷ VIP1',
  'stoicism-vip2': 'Chủ Nghĩa Khắc Kỷ VIP2',
  'stoicism-vip3': 'Chủ Nghĩa Khắc Kỷ VIP3',
  
  // Women Health
  'women-health': 'Sức Khỏe Phụ Nữ',
  
  // Other rooms
  'mental-sharpness-vip3': 'Trí Tuệ Sắc Bén VIP3',
  'overcome-storm-vip3': 'Vượt Qua Bão Tố VIP3',
  'keep-soul-calm-vip3': 'Giữ Tâm Hồn Bình Yên VIP3',
  
  // Shadow Work
  'shadow-work': 'Công Việc Bóng Tối',
  'shadow-work-vip1': 'Công Việc Bóng Tối VIP1',
  'shadow-work-vip2': 'Công Việc Bóng Tối VIP2',
  'shadow-work-vip3': 'Công Việc Bóng Tối VIP3',
  
  // Soul Mate
  'soulmate': 'Tìm Người Tri Kỷ',
  'soulmate-vip1': 'Tìm Người Tri Kỷ VIP1',
  'soulmate-vip2': 'Tìm Người Tri Kỷ VIP2',
  'soulmate-vip3': 'Tìm Người Tri Kỷ VIP3',
  
  // AI
  'ai': 'Trí Tuệ Nhân Tạo',
  'ai-vip1': 'Trí Tuệ Nhân Tạo VIP1',
  'ai-vip2': 'Trí Tuệ Nhân Tạo VIP2',
  'ai-vip3': 'Trí Tuệ Nhân Tạo VIP3',
  
  // Mental Health
  'mental-health': 'Sức Khỏe Tâm Thần',
  'mental-health-vip1': 'Sức Khỏe Tâm Thần VIP1',
  
  // Human Rights
  'human-right-vip3': 'Quyền Con Người VIP3',
};

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
    
    // Extract names from room data - try multiple paths
    const nameEn = roomData.name ||
                   roomData.description?.en?.split('.')[0] || 
                   roomData.title?.en ||
                   roomId.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const nameVi = roomData.name_vi ||
                   roomData.description?.vi?.split('.')[0] ||
                   roomData.title?.vi ||
                   VIETNAMESE_NAME_FALLBACKS[roomId] ||
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
