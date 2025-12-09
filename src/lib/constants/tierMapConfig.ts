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
    en: 'Core Mercy Blade',
    vi: 'Cốt Lõi Mercy Blade',
  },
  skills: {
    en: 'Life Skills / Survival',
    vi: 'Kỹ Năng Sống / Sinh Tồn',
  },
} as const;

/**
 * Tier-specific content descriptions for the Tier Map
 * Maps each tier to what content belongs in each column
 */
export const TIER_CONTENT_MAP: Record<TierId, {
  english: { title: string; titleVi: string; subtitle?: string };
  core: { title: string; titleVi: string; subtitle?: string };
  skills: { title: string; titleVi: string; subtitle?: string };
}> = {
  free: {
    english: { 
      title: 'English Foundation', 
      titleVi: 'Nền Tảng Tiếng Anh',
      subtitle: '14 rooms for beginners'
    },
    core: { 
      title: 'Foundations of Life', 
      titleVi: 'Nền Tảng Cuộc Sống',
      subtitle: 'Health, stress basics'
    },
    skills: { 
      title: 'Survival Skills', 
      titleVi: 'Kỹ Năng Sinh Tồn',
      subtitle: '15 safety rooms'
    },
  },
  vip1: {
    english: { 
      title: 'A1 Beginner', 
      titleVi: 'A1 Sơ Cấp',
      subtitle: 'Beginner English'
    },
    core: { 
      title: 'Basic Habits', 
      titleVi: 'Thói Quen Cơ Bản',
      subtitle: 'Foundation habits'
    },
    skills: { 
      title: 'Basic Life Skills', 
      titleVi: 'Kỹ Năng Sống Cơ Bản',
    },
  },
  vip2: {
    english: { 
      title: 'A2 + B1', 
      titleVi: 'A2 + B1',
      subtitle: 'Pre-Intermediate'
    },
    core: { 
      title: 'Intermediate Skills', 
      titleVi: 'Kỹ Năng Trung Cấp',
    },
    skills: { 
      title: 'Debate', 
      titleVi: 'Tranh Biện',
    },
  },
  vip3: {
    english: { 
      title: 'B2 + C1 + C2', 
      titleVi: 'B2 + C1 + C2',
      subtitle: 'Advanced English'
    },
    core: { 
      title: 'Advanced Core', 
      titleVi: 'Nội Dung Nâng Cao',
      subtitle: 'Philosophy, Psychology, Life Meaning'
    },
    skills: { 
      title: 'Martial Arts & Public Speaking', 
      titleVi: 'Võ Thuật & Nói Trước Đám Đông',
    },
  },
  vip3ii: {
    english: { 
      title: '—', 
      titleVi: '—',
    },
    core: { 
      title: 'Core Specialization', 
      titleVi: 'Chuyên Biệt Cốt Lõi',
      subtitle: 'Sexuality, Finance, Schizophrenia, Heavy Psychology'
    },
    skills: { 
      title: '—', 
      titleVi: '—',
    },
  },
  vip4: {
    english: { 
      title: 'Career English', 
      titleVi: 'Tiếng Anh Nghề Nghiệp',
    },
    core: { 
      title: 'CareerZ', 
      titleVi: 'Nghề Nghiệp',
      subtitle: 'Career Development'
    },
    skills: { 
      title: 'Work Skills', 
      titleVi: 'Kỹ Năng Công Việc',
    },
  },
  vip5: {
    english: { 
      title: 'Writing English', 
      titleVi: 'Viết Tiếng Anh',
    },
    core: { 
      title: 'Writing', 
      titleVi: 'Viết Lách',
      subtitle: 'Advanced Writing Skills'
    },
    skills: { 
      title: 'Professional Communication', 
      titleVi: 'Giao Tiếp Chuyên Nghiệp',
    },
  },
  vip6: {
    english: { 
      title: '—', 
      titleVi: '—',
    },
    core: { 
      title: 'Psychology', 
      titleVi: 'Tâm Lý Học',
      subtitle: 'Shadow Psychology & Mental Health'
    },
    skills: { 
      title: '—', 
      titleVi: '—',
    },
  },
  vip9: {
    english: { 
      title: '—', 
      titleVi: '—',
    },
    core: { 
      title: 'Strategy Mindset', 
      titleVi: 'Tư Duy Chiến Lược',
      subtitle: 'Individual, Corporate, National, Historical'
    },
    skills: { 
      title: 'Strategic Leadership', 
      titleVi: 'Lãnh Đạo Chiến Lược',
    },
  },
  kids_1: {
    english: { 
      title: 'Kids English L1', 
      titleVi: 'Tiếng Anh Trẻ Em L1',
      subtitle: 'Ages 3-6'
    },
    core: { 
      title: 'Kids Foundation', 
      titleVi: 'Nền Tảng Trẻ Em',
    },
    skills: { 
      title: 'Basic Safety', 
      titleVi: 'An Toàn Cơ Bản',
    },
  },
  kids_2: {
    english: { 
      title: 'Kids English L2', 
      titleVi: 'Tiếng Anh Trẻ Em L2',
      subtitle: 'Ages 6-9'
    },
    core: { 
      title: 'Kids Intermediate', 
      titleVi: 'Trẻ Em Trung Cấp',
    },
    skills: { 
      title: 'Life Skills for Kids', 
      titleVi: 'Kỹ Năng Sống Trẻ Em',
    },
  },
  kids_3: {
    english: { 
      title: 'Kids English L3', 
      titleVi: 'Tiếng Anh Trẻ Em L3',
      subtitle: 'Ages 9-12'
    },
    core: { 
      title: 'Kids Advanced', 
      titleVi: 'Trẻ Em Nâng Cao',
    },
    skills: { 
      title: 'Pre-Teen Skills', 
      titleVi: 'Kỹ Năng Tiền Thiếu Niên',
    },
  },
};

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

/**
 * Tier display order for the Tier Map (top to bottom = highest to lowest)
 */
export const TIER_MAP_ORDER: TierId[] = [
  'vip9',
  'vip6',
  'vip5',
  'vip4',
  'vip3ii',
  'vip3',
  'vip2',
  'vip1',
  'free',
];

/**
 * Get the route path for a tier
 */
export function getTierPath(tierId: TierId): string {
  switch (tierId) {
    case 'free': return '/rooms';
    case 'vip1': return '/vip/vip1';
    case 'vip2': return '/vip/vip2';
    case 'vip3': return '/vip/vip3';
    case 'vip3ii': return '/vip/vip3ii';
    case 'vip4': return '/vip/vip4';
    case 'vip5': return '/vip/vip5';
    case 'vip6': return '/vip/vip6';
    case 'vip9': return '/vip/vip9';
    case 'kids_1': return '/kids-level1';
    case 'kids_2': return '/kids-level2';
    case 'kids_3': return '/kids-level3';
    default: return '/rooms';
  }
}

/**
 * Get display label for a tier
 */
export function getTierLabel(tierId: TierId): string {
  switch (tierId) {
    case 'free': return 'Free';
    case 'vip1': return 'VIP1';
    case 'vip2': return 'VIP2';
    case 'vip3': return 'VIP3';
    case 'vip3ii': return 'VIP3 II';
    case 'vip4': return 'VIP4';
    case 'vip5': return 'VIP5';
    case 'vip6': return 'VIP6';
    case 'vip9': return 'VIP9';
    case 'kids_1': return 'Kids L1';
    case 'kids_2': return 'Kids L2';
    case 'kids_3': return 'Kids L3';
    default: return tierId.toUpperCase();
  }
}
