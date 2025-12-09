/**
 * TIER MAP CONFIGURATION - Mercy Blade Design System
 * 
 * This config defines the 3-column structure for ALL tiers:
 * - LEFT: English Pathway (all English learning)
 * - CENTER: Core Mercy Blade (health, stress, AI, philosophy, psychology, meaning of life)
 * - RIGHT: Life Skills / Survival (debate, martial arts, productivity, public speaking)
 * 
 * CRITICAL RULES:
 * 1. Same 3-column structure for every tier (FREE → VIP9)
 * 2. Only content difficulty climbs with tiers, not the structure
 * 3. VIP3II is CORE SPECIALIZATION (center column only) - contains sensitive/heavy topics
 * 4. VIP3II is NOT a separate tier - VIP3 users have full access to VIP3II
 * 5. Never auto-mix rooms - use ONLY this explicit config
 */

import { TierId } from './tiers';

export interface TierColumnConfig {
  english: string[];  // LEFT column - English Pathway
  core: string[];     // CENTER column - Core Mercy Blade (philosophy, health, stress, AI, etc.)
  skills: string[];   // RIGHT column - Life Skills / Survival
}

export type TierMapConfig = Record<TierId, TierColumnConfig>;

/**
 * Room categorization patterns for auto-classification
 * Used as fallback when room is not explicitly configured
 */
export const COLUMN_PATTERNS = {
  // English column patterns (LEFT)
  english: [
    /english/i,
    /^a1/i, /^a2/i, /^b1/i, /^b2/i, /^c1/i, /^c2/i,
    /grammar/i,
    /writing.*deep/i,
    /listening/i,
    /speaking.*english/i,
    /vocabulary/i,
    /sentence/i,
    /communication.*english/i,
    /master.*english/i,
    /cognitive.*fluency/i,
    /storytelling/i,
  ],
  
  // Core column patterns (CENTER) - Philosophy, Health, Stress, AI, Psychology
  core: [
    /health/i,
    /stress/i,
    /sleep/i,
    /philosophy/i,
    /psychology/i,
    /meaning.*life/i,
    /god/i,
    /spiritual/i,
    /emotion/i,
    /anxiety/i,
    /trauma/i,
    /healing/i,
    /mental/i,
    /ai.*thinking/i,
    /bilingual/i,
    /schizophrenia/i,
    /sexuality/i,
    /sex.*education/i,
    /finance/i,
    /obesity/i,
    /weight/i,
    /sexual.*health/i,
    /emotional.*well/i,
    /lullabies/i,
    /tired.*heart/i,
  ],
  
  // Skills column patterns (RIGHT) - Life Skills, Survival
  skills: [
    /survival/i,
    /first.*aid/i,
    /debate/i,
    /martial.*art/i,
    /public.*speaking/i,
    /social.*intelligence/i,
    /work.*skill/i,
    /financial.*habit/i,
    /job.*prep/i,
    /productivity/i,
    /strategy.*life/i,
    /delivery.*presence/i,
    /structuring.*message/i,
  ],
};

/**
 * Categorize a room into a column based on ID and title
 */
export function categorizeRoom(
  roomId: string,
  titleEn?: string
): 'english' | 'core' | 'skills' {
  const searchStr = `${roomId} ${titleEn || ''}`.toLowerCase();
  
  // Check English patterns first
  for (const pattern of COLUMN_PATTERNS.english) {
    if (pattern.test(searchStr)) return 'english';
  }
  
  // Check Skills patterns (before core to catch public speaking correctly)
  for (const pattern of COLUMN_PATTERNS.skills) {
    if (pattern.test(searchStr)) return 'skills';
  }
  
  // Check Core patterns
  for (const pattern of COLUMN_PATTERNS.core) {
    if (pattern.test(searchStr)) return 'core';
  }
  
  // Default to core for unclassified rooms
  return 'core';
}

/**
 * Check if a room belongs to VIP3II specialization (by ID pattern)
 * VIP3II rooms are CORE specialization containing sensitive/heavy topics
 */
export function isVip3IIRoom(roomId: string): boolean {
  const id = roomId.toLowerCase();
  return (
    id.includes('vip3ii') ||
    id.includes('vip3_ii') ||
    id.includes('vip3-ii')
  );
}

/**
 * Column labels for display
 */
export const COLUMN_LABELS = {
  english: {
    en: 'English Pathway',
    vi: 'Lộ Trình Tiếng Anh',
  },
  core: {
    en: 'Core / Cấp Cốt Lõi',
    vi: 'Cốt Lõi Mercy Blade',
  },
  skills: {
    en: 'Life Skills / Survival',
    vi: 'Kỹ Năng Sống / Sinh Tồn',
  },
} as const;

/**
 * VIP3II is a CORE SPECIALIZATION block, NOT a separate tier
 * It contains large and sensitive topics that belong in CENTER column:
 * - Sexuality / Sex education
 * - Finance
 * - Schizophrenia mastery
 * - Emotional well-being
 * - Heavy psychological topics
 * - Large philosophical clusters
 * 
 * VIP3 users MUST see VIP3II rooms (same access level = 3)
 */
export const VIP3II_DESCRIPTION = {
  en: 'Core Specialization — Sensitive & Advanced Topics',
  vi: 'Chuyên Biệt Cốt Lõi — Chủ Đề Nhạy Cảm & Nâng Cao',
};
