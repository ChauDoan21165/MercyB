/**
 * Kids English Area Registry
 * Manages all Kids rooms across 3 age levels
 */

export interface KidsLevel {
  id: string;
  name_en: string;
  name_vi: string;
  age_range: string;
  description_en: string | null;
  description_vi: string | null;
  color_theme: string;
  price_monthly: number;
  display_order: number;
  is_active: boolean;
}

export interface KidsRoom {
  id: string;
  level_id: string;
  title_en: string;
  title_vi: string;
  description_en: string | null;
  description_vi: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface KidsEntry {
  id: string;
  room_id: string;
  content_en: string;
  content_vi: string;
  audio_url: string | null;
  display_order: number;
  is_active: boolean;
}

/**
 * Level metadata for quick reference
 */
export const KIDS_LEVELS = {
  level1: {
    name_en: "English for Little Explorers",
    name_vi: "Tiếng Anh Cho Nhà Thám Hiểm Nhỏ",
    age_range: "4-7",
    color: "#FFB4E5" // Soft pink
  },
  level2: {
    name_en: "English for Young Adventurers",
    name_vi: "Tiếng Anh Cho Nhà Phiêu Lưu Trẻ",
    age_range: "7-10",
    color: "#A8E6CF" // Soft green
  },
  level3: {
    name_en: "English for Growing Thinkers",
    name_vi: "Tiếng Anh Cho Người Tư Duy",
    age_range: "10-13",
    color: "#FFD89C" // Soft orange
  }
} as const;

/**
 * Room count per level for validation
 */
export const ROOMS_PER_LEVEL = 12;
export const ENTRIES_PER_ROOM = 5;

/**
 * Get level color by ID
 */
export function getLevelColor(levelId: string): string {
  return KIDS_LEVELS[levelId as keyof typeof KIDS_LEVELS]?.color || "#E0E0E0";
}

/**
 * Get level name in specified language
 */
export function getLevelName(levelId: string, language: 'en' | 'vi'): string {
  const level = KIDS_LEVELS[levelId as keyof typeof KIDS_LEVELS];
  return language === 'en' ? level?.name_en : level?.name_vi || '';
}

/**
 * Check if user has access to a level
 */
export function hasLevelAccess(levelId: string, userSubscriptions: string[]): boolean {
  return userSubscriptions.includes(levelId);
}

/**
 * Get room icon by ID (for fallback)
 */
export function getRoomIcon(roomId: string): string {
  // Extract icon from room ID pattern or provide defaults
  const iconMap: Record<string, string> = {
    'colors-shapes': '🎨',
    'animals-sounds': '🐶',
    'my-family': '👨‍👩‍👧‍👦',
    'food-snacks': '🍎',
    'toys-games': '🧸',
    'weather-seasons': '☀️',
    'my-body': '👦',
    'at-home': '🏠',
    'feelings-emotions': '😊',
    'nature-outdoors': '🌳',
    'numbers-counting': '🔢',
    'simple-actions': '🏃',
    'daily-routines': '⏰',
    'at-school': '🏫',
    'my-hobbies': '⚽',
    'describing-people': '👥',
    'describing-places': '🗺️',
    'animals-habitats': '🦁',
    'healthy-habits': '💪',
    'around-city': '🏙️',
    'short-stories': '📖',
    'travel-transportation': '🚗',
    'basic-grammar': '📝',
    'asking-answering': '❓',
    'expressing-opinions': '💭',
    'creative-writing': '✍️',
    'science-curiosity': '🔬',
    'friendship-teamwork': '🤝',
    'problem-solving': '🧩',
    'technology-future': '💻',
    'nature-planet': '🌍',
    'storytelling-narrative': '📚',
    'emotions-self-expression': '🎭',
    'study-skills': '📚',
    'world-cultures': '🌏',
    'conversation-skills': '💬'
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (roomId.includes(key)) return icon;
  }
  
  return '📖'; // Default icon
}
