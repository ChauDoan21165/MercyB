/**
 * Enhanced Keyword Color System
 * Supports emotion-based colors for adjectives and grayscale for verbs
 * Matches English and Vietnamese translations with the same color
 */

export interface EnhancedKeywordMapping {
  en: string[];
  vi: string[];
  color: string;
  type: 'emotion' | 'verb' | 'noun';
}

let roomKeywordMappings: EnhancedKeywordMapping[] = [];

/**
 * Load keyword mappings from room JSON data
 */
export function loadEnhancedKeywords(highlightedWords: any[]): void {
  if (!highlightedWords || !Array.isArray(highlightedWords)) {
    roomKeywordMappings = [];
    return;
  }

  roomKeywordMappings = highlightedWords.map(hw => ({
    en: hw.en || [],
    vi: hw.vi || [],
    color: hw.color,
    type: hw.type || 'emotion'
  }));
}

/**
 * Clear loaded keywords
 */
export function clearEnhancedKeywords(): void {
  roomKeywordMappings = [];
}

/**
 * Get color for a specific keyword (supports both English and Vietnamese)
 * Returns null if no match found
 */
export function getEnhancedKeywordColor(text: string): string | null {
  if (!text || roomKeywordMappings.length === 0) {
    return null;
  }

  const normalized = text.toLowerCase().trim();

  for (const mapping of roomKeywordMappings) {
    // Check English keywords
    for (const enKeyword of mapping.en) {
      if (enKeyword.toLowerCase() === normalized) {
        return mapping.color;
      }
    }
    
    // Check Vietnamese keywords
    for (const viKeyword of mapping.vi) {
      if (viKeyword.toLowerCase() === normalized) {
        return mapping.color;
      }
    }
  }

  return null;
}

/**
 * Get all keyword mappings for debugging
 */
export function getAllEnhancedMappings(): EnhancedKeywordMapping[] {
  return roomKeywordMappings;
}
