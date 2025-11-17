/**
 * Custom Keyword Loader with Semantic Color Integration
 * Handles room-specific keyword customizations
 */

import { getSemanticColor, SEMANTIC_CATEGORIES } from './semanticColorSystem';

export interface CustomKeywordMapping {
  en: string[];
  vi: string[];
  color: string;
}

let customKeywordMappings: CustomKeywordMapping[] = [];

/**
 * Set custom keyword color mappings from room data
 * Integrates with the semantic color system
 */
export function setCustomKeywordMappings(mappings: CustomKeywordMapping[]) {
  customKeywordMappings = mappings;
}

/**
 * Clear custom keyword mappings (useful when switching rooms)
 */
export function clearCustomKeywordMappings() {
  customKeywordMappings = [];
}

/**
 * Get color for a keyword, checking custom mappings first, then semantic system
 */
export function getKeywordColor(text: string): string | null {
  if (!text || text.trim().length === 0) return null;
  
  const normalizedText = text.toLowerCase().trim();

  // Check custom mappings first (room-specific overrides)
  for (const mapping of customKeywordMappings) {
    const allKeywords = [...mapping.en, ...mapping.vi];
    for (const keyword of allKeywords) {
      const normalizedKeyword = keyword.toLowerCase();
      if (normalizedText === normalizedKeyword || normalizedText.includes(normalizedKeyword)) {
        return mapping.color;
      }
    }
  }

  // Fall back to semantic system
  return getSemanticColor(text);
}

/**
 * Load room keywords from the room's entries
 * Maps them to appropriate semantic categories
 */
export async function loadRoomKeywords(roomId: string): Promise<CustomKeywordMapping[]> {
  try {
    const response = await fetch(`/data/${roomId}.json`);
    if (!response.ok) return [];
    
    const roomData = await response.json();
    const customMappings: CustomKeywordMapping[] = [];

    // Extract keywords from entries if they have custom color specifications
    if (roomData.entries && Array.isArray(roomData.entries)) {
      for (const entry of roomData.entries) {
        // Check if entry has explicit keyword color mappings
        if (entry.keywordColors && Array.isArray(entry.keywordColors)) {
          for (const mapping of entry.keywordColors) {
            if (mapping.en && mapping.vi && mapping.color) {
              customMappings.push({
                en: Array.isArray(mapping.en) ? mapping.en : [mapping.en],
                vi: Array.isArray(mapping.vi) ? mapping.vi : [mapping.vi],
                color: mapping.color
              });
            }
          }
        }
      }
    }

    return customMappings;
  } catch (error) {
    console.error('Error loading room keywords:', error);
    return [];
  }
}

/**
 * Get all available semantic categories for reference
 */
export function getSemanticCategories() {
  return SEMANTIC_CATEGORIES.map(cat => ({
    name: cat.name,
    color: cat.color,
    description: cat.description,
    sampleKeywords: {
      en: cat.en.slice(0, 5),
      vi: cat.vi.slice(0, 5)
    }
  }));
}
