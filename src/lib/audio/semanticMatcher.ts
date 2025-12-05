/**
 * Semantic Matcher v2.0
 * Phase 4: Full GCE Integration
 * 
 * Entry-level semantic matching using:
 * - Levenshtein distance
 * - Number/index extraction
 * - Slug similarity
 * - GCE canonical naming
 */

import { similarityScore, levenshteinDistance } from './filenameValidator';
import { 
  getCanonicalAudioForRoom, 
  normalizeRoomId, 
  extractLanguage,
  MIN_CONFIDENCE_FOR_AUTO_FIX,
} from './globalConsistencyEngine';

// ============================================
// Types
// ============================================

export interface SemanticMatch {
  filename: string;
  matchedEntry: {
    slug: string | number;
    index: number;
  } | null;
  confidence: number;
  matchType: 'exact' | 'slug' | 'index' | 'levenshtein' | 'none';
  suggestedCanonical: string | null;
  requiresHumanReview: boolean;
}

export interface RoomEntry {
  slug?: string;
  id?: string | number;
  artifact_id?: string;
  index?: number;
  audio?: { en?: string; vi?: string } | string;
}

interface MatchResult {
  entry: RoomEntry;
  index: number;
  confidence: number;
  matchType: 'exact' | 'slug' | 'index' | 'levenshtein';
}

// ============================================
// Main Matching Function
// ============================================

/**
 * Match an audio filename to a room entry
 * Uses multiple strategies with decreasing confidence
 */
export function matchAudioToEntry(
  filename: string,
  roomId: string,
  entries: RoomEntry[]
): SemanticMatch {
  const normalizedFilename = filename.toLowerCase();
  const normalizedRoomId = normalizeRoomId(roomId);
  const lang = extractLanguage(filename);
  
  if (!lang) {
    return {
      filename,
      matchedEntry: null,
      confidence: 0,
      matchType: 'none',
      suggestedCanonical: null,
      requiresHumanReview: true,
    };
  }
  
  const slugPart = extractSlugFromFilename(normalizedFilename, normalizedRoomId);
  
  // Strategy 1: Exact canonical match
  const exactMatch = findExactMatch(filename, roomId, entries, lang);
  if (exactMatch) {
    const slug = exactMatch.entry.slug || exactMatch.entry.artifact_id || exactMatch.entry.id || exactMatch.index;
    return {
      filename,
      matchedEntry: { slug, index: exactMatch.index },
      confidence: 100,
      matchType: 'exact',
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: false,
    };
  }
  
  // Strategy 2: Slug similarity match
  const slugMatch = findSlugMatch(slugPart, entries);
  if (slugMatch && slugMatch.confidence > 0.9) {
    const slug = slugMatch.entry.slug || slugMatch.entry.artifact_id || slugMatch.entry.id || slugMatch.index;
    return {
      filename,
      matchedEntry: { slug, index: slugMatch.index },
      confidence: Math.round(slugMatch.confidence * 100),
      matchType: 'slug',
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: false,
    };
  }
  
  // Strategy 3: Index/number extraction match
  const indexMatch = findIndexMatch(slugPart, entries);
  if (indexMatch && indexMatch.confidence > 0.8) {
    const slug = indexMatch.entry.slug || indexMatch.entry.artifact_id || indexMatch.entry.id || indexMatch.index;
    return {
      filename,
      matchedEntry: { slug, index: indexMatch.index },
      confidence: Math.round(indexMatch.confidence * 100),
      matchType: 'index',
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: false,
    };
  }
  
  // Strategy 4: Levenshtein distance fallback
  const levenshteinMatch = findLevenshteinMatch(filename, roomId, entries, lang);
  if (levenshteinMatch && levenshteinMatch.confidence >= MIN_CONFIDENCE_FOR_AUTO_FIX) {
    const slug = levenshteinMatch.entry.slug || levenshteinMatch.entry.artifact_id || levenshteinMatch.entry.id || levenshteinMatch.index;
    return {
      filename,
      matchedEntry: { slug, index: levenshteinMatch.index },
      confidence: Math.round(levenshteinMatch.confidence * 100),
      matchType: 'levenshtein',
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: false,
    };
  }
  
  // No confident match - flag for human review
  const bestGuess = levenshteinMatch || slugMatch || indexMatch;
  if (bestGuess) {
    const slug = bestGuess.entry.slug || bestGuess.entry.artifact_id || bestGuess.entry.id || bestGuess.index;
    return {
      filename,
      matchedEntry: { slug, index: bestGuess.index },
      confidence: Math.round(bestGuess.confidence * 100),
      matchType: bestGuess === levenshteinMatch ? 'levenshtein' : 'slug',
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: true,
    };
  }
  
  return {
    filename,
    matchedEntry: null,
    confidence: 0,
    matchType: 'none',
    suggestedCanonical: null,
    requiresHumanReview: true,
  };
}

// ============================================
// Strategy Implementations
// ============================================

function extractSlugFromFilename(filename: string, roomId: string): string {
  let slug = filename.replace(new RegExp(`^${roomId}-?`, 'i'), '');
  slug = slug.replace(/-(en|vi)\.mp3$/i, '');
  return slug;
}

function findExactMatch(
  filename: string,
  roomId: string,
  entries: RoomEntry[],
  lang: 'en' | 'vi'
): MatchResult | null {
  const normalizedFilename = filename.toLowerCase();
  
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const slug = entry.slug || entry.artifact_id || entry.id || i;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    if (normalizedFilename === canonical[lang].toLowerCase()) {
      return { entry, index: i, confidence: 1, matchType: 'exact' };
    }
  }
  
  return null;
}

function findSlugMatch(slugPart: string, entries: RoomEntry[]): MatchResult | null {
  let best: MatchResult | null = null;
  
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entrySlug = String(entry.slug || entry.artifact_id || entry.id || `entry-${i}`).toLowerCase();
    const score = similarityScore(slugPart, entrySlug);
    
    if (!best || score > best.confidence) {
      best = { entry, index: i, confidence: score, matchType: 'slug' };
    }
  }
  
  return best;
}

function findIndexMatch(slugPart: string, entries: RoomEntry[]): MatchResult | null {
  const numbers = slugPart.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  
  for (const numStr of numbers) {
    const num = parseInt(numStr, 10);
    
    // Try 0-indexed and 1-indexed
    for (const offset of [0, -1]) {
      const index = num + offset;
      if (index >= 0 && index < entries.length) {
        return {
          entry: entries[index],
          index,
          confidence: 0.85,
          matchType: 'index',
        };
      }
    }
  }
  
  return null;
}

function findLevenshteinMatch(
  filename: string,
  roomId: string,
  entries: RoomEntry[],
  lang: 'en' | 'vi'
): MatchResult | null {
  let best: MatchResult | null = null;
  const normalizedFilename = filename.toLowerCase();
  
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const slug = entry.slug || entry.artifact_id || entry.id || i;
    const canonical = getCanonicalAudioForRoom(roomId, slug)[lang];
    const score = similarityScore(normalizedFilename, canonical.toLowerCase());
    
    if (!best || score > best.confidence) {
      best = { entry, index: i, confidence: score, matchType: 'levenshtein' };
    }
  }
  
  return best;
}

// ============================================
// Batch Operations
// ============================================

/**
 * Batch match all orphan files for a room
 */
export function batchMatchOrphans(
  orphanFiles: string[],
  roomId: string,
  entries: RoomEntry[]
): {
  autoRepairs: SemanticMatch[];
  humanReview: SemanticMatch[];
} {
  const autoRepairs: SemanticMatch[] = [];
  const humanReview: SemanticMatch[] = [];
  
  for (const file of orphanFiles) {
    const match = matchAudioToEntry(file, roomId, entries);
    
    if (match.matchedEntry && match.confidence >= MIN_CONFIDENCE_FOR_AUTO_FIX * 100 && !match.requiresHumanReview) {
      autoRepairs.push(match);
    } else {
      humanReview.push(match);
    }
  }
  
  return { autoRepairs, humanReview };
}

/**
 * Validate audio-entry consistency for a room
 */
export function validateRoomAudioConsistency(
  roomId: string,
  entries: RoomEntry[],
  audioFiles: string[]
): {
  matched: Array<{ entryIndex: number; enFile: string | null; viFile: string | null }>;
  unmatched: string[];
  missingEntries: number[];
} {
  const matched: Array<{ entryIndex: number; enFile: string | null; viFile: string | null }> = [];
  const unmatched: string[] = [];
  const missingEntries: number[] = [];
  
  const usedFiles = new Set<string>();
  
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const slug = entry.slug || entry.artifact_id || entry.id || i;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    let enFile: string | null = null;
    let viFile: string | null = null;
    
    // Look for files
    for (const file of audioFiles) {
      if (usedFiles.has(file)) continue;
      const match = matchAudioToEntry(file, roomId, [entry]);
      
      if (match.matchedEntry) {
        const lang = extractLanguage(file);
        if (lang === 'en' && match.confidence >= 80) {
          enFile = file;
          usedFiles.add(file);
        } else if (lang === 'vi' && match.confidence >= 80) {
          viFile = file;
          usedFiles.add(file);
        }
      }
    }
    
    matched.push({ entryIndex: i, enFile, viFile });
    
    if (!enFile || !viFile) {
      missingEntries.push(i);
    }
  }
  
  for (const file of audioFiles) {
    if (!usedFiles.has(file)) {
      unmatched.push(file);
    }
  }
  
  return { matched, unmatched, missingEntries };
}

/**
 * Calculate confidence score for a match (exported utility)
 */
export function getMatchConfidence(filename: string, canonical: string): number {
  return similarityScore(filename.toLowerCase(), canonical.toLowerCase());
}
