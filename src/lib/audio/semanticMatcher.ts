/**
 * Semantic Matcher v1.0
 * Phase 3: Entry-Level Semantic Matching Engine
 * 
 * Handles cases where JSON entries change name or order
 * but audio should still map correctly.
 */

import { similarityScore, levenshteinDistance } from './filenameValidator';
import { getCanonicalAudioForRoom, normalizeRoomId, extractLanguage } from './globalConsistencyEngine';

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
  index?: number;
  audio?: { en?: string; vi?: string } | string;
}

export interface MatchResult {
  entry: RoomEntry;
  index: number;
  confidence: number;
  matchType: 'exact' | 'slug' | 'index' | 'levenshtein';
}

/**
 * Match an audio filename to a room entry
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
  
  // Remove room prefix and language suffix to get the slug part
  const slugPart = extractSlugFromFilename(normalizedFilename, normalizedRoomId);
  
  // Strategy 1: Exact canonical match
  const exactMatch = findExactMatch(filename, roomId, entries, lang);
  if (exactMatch) {
    const slug = exactMatch.entry.slug || exactMatch.entry.id || exactMatch.index;
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
    const slug = slugMatch.entry.slug || slugMatch.entry.id || slugMatch.index;
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
    const slug = indexMatch.entry.slug || indexMatch.entry.id || indexMatch.index;
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
  if (levenshteinMatch && levenshteinMatch.confidence > 0.85) {
    const slug = levenshteinMatch.entry.slug || levenshteinMatch.entry.id || levenshteinMatch.index;
    return {
      filename,
      matchedEntry: { slug, index: levenshteinMatch.index },
      confidence: Math.round(levenshteinMatch.confidence * 100),
      matchType: 'levenshtein',
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: false,
    };
  }
  
  // No confident match found
  const bestGuess = levenshteinMatch || slugMatch || indexMatch;
  if (bestGuess) {
    const slug = bestGuess.entry.slug || bestGuess.entry.id || bestGuess.index;
    return {
      filename,
      matchedEntry: { slug, index: bestGuess.index },
      confidence: Math.round(bestGuess.confidence * 100),
      matchType: bestGuess === levenshteinMatch ? 'levenshtein' : 'slug',
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: true, // Low confidence
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

/**
 * Extract slug portion from filename
 */
function extractSlugFromFilename(filename: string, roomId: string): string {
  // Remove room prefix
  let slug = filename.replace(new RegExp(`^${roomId}-?`, 'i'), '');
  // Remove language suffix
  slug = slug.replace(/-(en|vi)\.mp3$/i, '');
  return slug;
}

/**
 * Find exact canonical match
 */
function findExactMatch(
  filename: string,
  roomId: string,
  entries: RoomEntry[],
  lang: 'en' | 'vi'
): MatchResult | null {
  const normalizedFilename = filename.toLowerCase();
  
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const slug = entry.slug || entry.id || i;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    if (normalizedFilename === canonical[lang].toLowerCase()) {
      return { entry, index: i, confidence: 1, matchType: 'exact' };
    }
  }
  
  return null;
}

/**
 * Find match by slug similarity
 */
function findSlugMatch(slugPart: string, entries: RoomEntry[]): MatchResult | null {
  let best: MatchResult | null = null;
  
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entrySlug = String(entry.slug || entry.id || `entry-${i}`).toLowerCase();
    const score = similarityScore(slugPart, entrySlug);
    
    if (!best || score > best.confidence) {
      best = { entry, index: i, confidence: score, matchType: 'slug' };
    }
  }
  
  return best;
}

/**
 * Find match by number/index extraction
 */
function findIndexMatch(slugPart: string, entries: RoomEntry[]): MatchResult | null {
  // Extract numbers from slug part
  const numbers = slugPart.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  
  // Try to match with entry index
  for (const numStr of numbers) {
    const num = parseInt(numStr, 10);
    
    // Check 0-indexed and 1-indexed
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

/**
 * Find match using Levenshtein distance
 */
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
    const slug = entry.slug || entry.id || i;
    const canonical = getCanonicalAudioForRoom(roomId, slug)[lang];
    const score = similarityScore(normalizedFilename, canonical.toLowerCase());
    
    if (!best || score > best.confidence) {
      best = { entry, index: i, confidence: score, matchType: 'levenshtein' };
    }
  }
  
  return best;
}

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
    
    if (match.matchedEntry && match.confidence >= 85 && !match.requiresHumanReview) {
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
  
  // Try to match each entry
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const slug = entry.slug || entry.id || i;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    let enFile: string | null = null;
    let viFile: string | null = null;
    
    // Look for EN file
    for (const file of audioFiles) {
      if (usedFiles.has(file)) continue;
      const match = matchAudioToEntry(file, roomId, [entry]);
      if (match.matchedEntry && extractLanguage(file) === 'en' && match.confidence >= 80) {
        enFile = file;
        usedFiles.add(file);
        break;
      }
    }
    
    // Look for VI file
    for (const file of audioFiles) {
      if (usedFiles.has(file)) continue;
      const match = matchAudioToEntry(file, roomId, [entry]);
      if (match.matchedEntry && extractLanguage(file) === 'vi' && match.confidence >= 80) {
        viFile = file;
        usedFiles.add(file);
        break;
      }
    }
    
    matched.push({ entryIndex: i, enFile, viFile });
    
    if (!enFile || !viFile) {
      missingEntries.push(i);
    }
  }
  
  // Unmatched files
  for (const file of audioFiles) {
    if (!usedFiles.has(file)) {
      unmatched.push(file);
    }
  }
  
  return { matched, unmatched, missingEntries };
}
