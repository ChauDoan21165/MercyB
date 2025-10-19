// Room Data Management Utilities
// This file provides helper functions for working with room data

export interface RoomInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  hasData: boolean;
  tier: 'free' | 'vip1' | 'vip2' | 'vip3';
  dataFile?: string;
}

// Complete list of all rooms in the app
export const ALL_ROOMS: RoomInfo[] = [
  { id: "ai", nameVi: "Trí tuệ nhân tạo", nameEn: "AI", hasData: true, tier: "free", dataFile: "AI.json" },
  { id: "autoimmune", nameVi: "Bệnh tự miễn", nameEn: "Autoimmune Diseases", hasData: true, tier: "free", dataFile: "autoimmune_diseases.json" },
  { id: "burnout", nameVi: "Kiệt sức", nameEn: "Burnout", hasData: true, tier: "vip1", dataFile: "burnout.json" },
  { id: "business-strategy", nameVi: "Chiến lược kinh doanh", nameEn: "Business Strategy", hasData: true, tier: "vip2", dataFile: "business_strategy.json" },
  { id: "cancer-support", nameVi: "Hỗ trợ ung thư", nameEn: "Cancer Support", hasData: true, tier: "vip1", dataFile: "cancer_support.json" },
  { id: "cardiovascular", nameVi: "Tim mạch", nameEn: "Cardiovascular", hasData: true, tier: "free", dataFile: "cardiovascular.json" },
  { id: "child-health", nameVi: "Sức khỏe trẻ em", nameEn: "Child Health", hasData: true, tier: "free", dataFile: "child_health.json" },
  { id: "cholesterol", nameVi: "Cholesterol", nameEn: "Cholesterol", hasData: true, tier: "free", dataFile: "cholesterol.json" },
  { id: "chronic-fatigue", nameVi: "Mệt mỏi mãn tính", nameEn: "Chronic Fatigue", hasData: true, tier: "vip1", dataFile: "chronic_fatigue.json" },
  { id: "cough", nameVi: "Ho", nameEn: "Cough", hasData: true, tier: "free", dataFile: "cough.json" },
  // Additional rooms (data to be added)
  { id: "abdominal-pain", nameVi: "Đau bụng", nameEn: "Abdominal Pain", hasData: false, tier: "free" },
  { id: "addiction", nameVi: "Nghiện", nameEn: "Addiction", hasData: false, tier: "vip2" },
  // ... more rooms
];

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
