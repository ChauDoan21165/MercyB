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
  'women-health-free': 'Sức Khỏe Phụ Nữ',
  'women-health-vip1': 'Sức Khỏe Phụ Nữ VIP1',
  'women-health-vip2': 'Sức Khỏe Phụ Nữ VIP2',
  'women-health-vip3': 'Sức Khỏe Phụ Nữ VIP3',
  
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
  'ai-free': 'Trí Tuệ Nhân Tạo',
  'ai-vip1': 'Trí Tuệ Nhân Tạo VIP1',
  'ai-vip2': 'Trí Tuệ Nhân Tạo VIP2',
  'ai-vip3': 'Trí Tuệ Nhân Tạo VIP3',
  
  // Mental Health
  'mental-health-free': 'Sức Khỏe Tâm Thần',
  'mental-health-vip1': 'Sức Khỏe Tâm Thần VIP1',
  
  // ADHD Support
  'adhd-support-free': 'Hỗ Trợ Rối Loạn Tăng Động Giảm Chú Ý',
  'adhd-support-vip1': 'Hỗ Trợ Rối Loạn Tăng Động Giảm Chú Ý VIP1',
  'adhd-support-vip2': 'Hỗ Trợ Rối Loạn Tăng Động Giảm Chú Ý VIP2',
  'adhd-support-vip3': 'Hỗ Trợ Rối Loạn Tăng Động Giảm Chú Ý VIP3',
  
  // Eating Disorder Support
  'eating-disorder-support-free': 'Hỗ Trợ Rối Loạn Ăn Uống',
  'eating-disorder-support-vip1': 'Hỗ Trợ Rối Loạn Ăn Uống VIP1',
  'eating-disorder-support-vip2': 'Hỗ Trợ Rối Loạn Ăn Uống VIP2',
  'eating-disorder-support-vip3': 'Hỗ Trợ Rối Loạn Ăn Uống VIP3',
  
  // Mindfulness
  'mindfulness-free': 'Thực Hành Chánh Niệm',
  'mindfulness-vip1': 'Thực Hành Chánh Niệm VIP1',
  'mindfulness-vip2': 'Thực Hành Chánh Niệm VIP2',
  'mindfulness-vip3': 'Thực Hành Chánh Niệm VIP3',
  
  // Nutrition
  'nutrition-free': 'Dinh Dưỡng',
  'nutrition-vip1': 'Dinh Dưỡng VIP1',
  'nutrition-vip2': 'Dinh Dưỡng VIP2',
  'nutrition-vip3': 'Dinh Dưỡng VIP3',
  
  // Obesity
  'obesity-free': 'Quản Lý Cân Nặng',
  'obesity-vip1': 'Quản Lý Cân Nặng VIP1',
  'obesity-vip2': 'Quản Lý Cân Nặng VIP2',
  'obesity-vip3': 'Quản Lý Cân Nặng VIP3',
  
  // Sleep
  'sleep-free': 'Cải Thiện Giấc Ngủ',
  'sleep-vip1': 'Cải Thiện Giấc Ngủ VIP1',
  'sleep-vip2': 'Cải Thiện Giấc Ngủ VIP2',
  'sleep-vip3': 'Cải Thiện Giấc Ngủ VIP3',
  
  // Meaning of Life
  'meaning-of-life-free': 'Ý Nghĩa Cuộc Sống',
  'meaning-of-life-vip1': 'Ý Nghĩa Cuộc Sống VIP1',
  'meaning-of-life-vip2': 'Ý Nghĩa Cuộc Sống VIP2',
  'meaning-of-life-vip3': 'Ý Nghĩa Cuộc Sống VIP3',
  
  // Addiction Support
  'addiction-support-free': 'Hỗ Trợ Cai Nghiện',
  
  // Bipolar Support
  'bipolar-support-free': 'Hỗ Trợ Rối Loạn Lưỡng Cực',
  
  // Relationship Healing
  'relationship-healing-free': 'Hàn Gắn Mối Quan Hệ',
  
  // Confidence
  'confidence-free': 'Tự Tin',
  'confidence-vip1': 'Tự Tin VIP1',
  'confidence-vip2': 'Tự Tin VIP2',
  'confidence-vip3': 'Tự Tin VIP3',
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
    // Skip if no data
    if (!roomData) continue;
    
    // Extract tier from roomId first (most reliable source)
    let tier: RoomInfo['tier'] = 'free';
    if (roomId.endsWith('-vip1')) tier = 'vip1';
    else if (roomId.endsWith('-vip2')) tier = 'vip2';
    else if (roomId.endsWith('-vip3')) tier = 'vip3';
    else if (roomId.endsWith('-free')) tier = 'free';
    // Fallback: check room data
    else if (roomData.meta?.tier) {
      const rawTier = roomData.meta.tier.toLowerCase().replace(/\s+/g, '').split('/')[0];
      if (['free', 'vip1', 'vip2', 'vip3'].includes(rawTier)) {
        tier = rawTier as RoomInfo['tier'];
      }
    } else if (roomData.tier) {
      const rawTier = roomData.tier.toLowerCase().replace(/\s+/g, '').split('/')[0];
      if (['free', 'vip1', 'vip2', 'vip3'].includes(rawTier)) {
        tier = rawTier as RoomInfo['tier'];
      }
    }
    
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

// Complete list of all rooms in the app (dynamically generated on access)
let cachedRooms: RoomInfo[] | null = null;

export const ALL_ROOMS = new Proxy([] as RoomInfo[], {
  get(target, prop) {
    // Regenerate room list on each access to ensure it's up-to-date
    if (!cachedRooms || prop === 'length' || typeof prop === 'symbol') {
      cachedRooms = generateRoomInfo();
    }
    return (cachedRooms as any)[prop];
  }
});

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
