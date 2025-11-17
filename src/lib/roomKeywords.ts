/**
 * Room-specific keyword highlighting configuration
 * Loads custom keyword colors from room JSON files
 */

import { CustomKeywordMapping } from './keywordColors';
import { PUBLIC_ROOM_MANIFEST } from './roomManifest';

export interface RoomKeywordConfig {
  highlighted_words?: {
    en: string[];
    vi: string[];
    color: string;
  }[];
}

/**
 * Resolve candidate JSON paths for a given roomId, matching roomLoader logic
 */
const buildRoomJsonCandidates = (roomId: string): string[] => {
  const candidates: string[] = [];
  const hasTier = /(\-|_)(free|vip1|vip2|vip3|vip4)($|\-)/.test(roomId);
  const manifestKey = hasTier ? roomId.replace(/_/g, '-') : `${roomId.replace(/_/g, '-')}-free`;
  const directKey = roomId ? roomId.replace(/_/g, '-') : '';
  const filename = PUBLIC_ROOM_MANIFEST[manifestKey] || (directKey ? PUBLIC_ROOM_MANIFEST[directKey] : undefined);
  if (filename) candidates.push(`/${encodeURI(filename)}`);

  const base = manifestKey.replace(/-/g, '_');
  const directBase = (roomId || '').replace(/-/g, '_');
  candidates.push(`/data/${base}.json`);
  candidates.push(`/data/${base.toLowerCase()}.json`);
  if (directBase) {
    candidates.push(`/data/${directBase}.json`);
    candidates.push(`/data/${directBase.toLowerCase()}.json`);
  }
  const parts = base.split('_');
  const tierIndex = parts.findIndex(p => ['free','vip1','vip2','vip3','vip4'].includes(p.toLowerCase()));
  if (tierIndex > 0) {
    const beforeTier = parts.slice(0, tierIndex)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    const tierPart = parts[tierIndex].toLowerCase();
    const titleCaseWithLowerTier = [...beforeTier, tierPart].join('_');
    candidates.push(`/data/${titleCaseWithLowerTier}.json`);
  }
  const titleCase = base.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_');
  candidates.push(`/data/${titleCase}.json`);
  if (tierIndex >= 0) {
    const tierFolder = parts[tierIndex].toLowerCase();
    candidates.push(`/data/${tierFolder}/${base}.json`);
    candidates.push(`/data/${tierFolder}/${base.toLowerCase()}.json`);
    if (tierIndex > 0) {
      const beforeTier = parts.slice(0, tierIndex)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      const tierPart = parts[tierIndex].toLowerCase();
      const titleCaseWithLowerTier = [...beforeTier, tierPart].join('_');
      candidates.push(`/data/${tierFolder}/${titleCaseWithLowerTier}.json`);
    }
    candidates.push(`/data/${tierFolder}/${titleCase}.json`);
  }
  return candidates;
};

/**
 * Load keyword highlighting configuration from room data
 */
export async function loadRoomKeywords(roomId: string): Promise<CustomKeywordMapping[]> {
  try {
    const paths = buildRoomJsonCandidates(roomId);
    for (const path of paths) {
      try {
        const cacheBust = `?cb=${Date.now()}&r=${Math.random()}`;
        const response = await fetch(path + cacheBust, { cache: 'no-store' });
        if (!response.ok) continue;
        const json = await response.json() as RoomKeywordConfig;
        if (json.highlighted_words && Array.isArray(json.highlighted_words)) {
          return json.highlighted_words.map(hw => ({
            en: hw.en || [],
            vi: hw.vi || [],
            color: hw.color
          }));
        }
      } catch {
        // try next path
      }
    }
    return [];
  } catch (error) {
    console.error(`Failed to load room keywords for ${roomId}:`, error);
    return [];
  }
}

/**
 * Generate default color palette for English learning rooms
 * These colors are optimized for readability and semantic meaning
 */
export const ENGLISH_LEARNING_COLORS = {
  // Grammar & Structure
  grammar: '#B8D4F1',      // Calm blue for grammar concepts
  structure: '#C8E6F5',    // Light blue for structural elements
  syntax: '#A8E6F5',       // Bright blue for syntax
  
  // Skills & Methods
  skill: '#90EE90',        // Growth green for skills
  method: '#98FB98',       // Fresh green for methods
  technique: '#A8F0A8',    // Soft green for techniques
  
  // Learning Process
  practice: '#D8F0E6',     // Calm green for practice
  learning: '#E0F5F8',     // Cool blue-green for learning
  training: '#D8F0F5',     // Light blue for training
  
  // Cognitive
  thinking: '#E0D8F5',     // Purple for thinking
  processing: '#D9C8F0',   // Soft purple for processing
  cognitive: '#C4EAEA',    // Teal for cognitive
  
  // Performance
  fluency: '#FFE0CC',      // Warm peach for fluency
  momentum: '#FFD8B8',     // Light orange for momentum
  productivity: '#FFF4D8', // Bright yellow for productivity
  
  // Strategy
  strategy: '#D8F0F5',     // Strategic blue
  planning: '#E0F5F8',     // Planning blue-green
  framework: '#C8E6F5',    // Framework blue
  
  // Communication
  speaking: '#FFE0EC',     // Warm pink for speaking
  expression: '#FFF8D8',   // Bright cream for expression
  communication: '#FFE0D8',// Warm coral for communication
  
  // Key concepts
  important: '#FFD8E6',    // Highlight pink for key terms
  emphasis: '#FFE0ED',     // Emphasis pink
  focus: '#A8C8E6'         // Focus blue
};
