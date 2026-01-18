/**
 * Semantic Matcher v2.1
 * Phase 4: Full GCE Integration
 *
 * FIX (MB-BLUE-102.2x — 2026-01-15):
 * - Numeric tokens like "2" MUST be treated as INDEX matches (never "exact"),
 *   even if an entry slug literally equals "2".
 *
 * FIX (MB-BLUE-102.2y — 2026-01-15):
 * - Numeric-token detection MUST NOT depend on roomId string formatting.
 *   (normalizeRoomId may hyphenate while filenames may contain underscores.)
 * - We now extract numeric token from the filename generically:
 *     <anything>[-_]<number>[-_](en|vi).mp3
 *   and force index match FIRST.
 */

import { similarityScore } from "./filenameValidator";
import {
  getCanonicalAudioForRoom,
  normalizeRoomId,
  extractLanguage,
  MIN_CONFIDENCE_FOR_AUTO_FIX,
} from "./globalConsistencyEngine";

export interface SemanticMatch {
  filename: string;
  matchedEntry: { slug: string | number; index: number } | null;
  confidence: number;
  matchType: "exact" | "slug" | "index" | "levenshtein" | "none";
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
  confidence: number; // 0..1
  matchType: "exact" | "slug" | "index" | "levenshtein";
}

function asSlug(entry: RoomEntry, fallbackIndex: number): string | number {
  return (entry.slug ?? entry.artifact_id ?? entry.id ?? fallbackIndex) as any;
}

function normToken(s: string): string {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\.mp3$/i, "")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

function isPureNumberToken(s: string): boolean {
  return /^[0-9]+$/.test(String(s || "").trim());
}

function escapeRegExp(s: string): string {
  return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extract a numeric token from a filename regardless of roomId formatting.
 * Matches patterns like:
 *   room-2-en.mp3
 *   room_2_en.mp3
 *   room-anything-12-vi.mp3
 * Returns the numeric string ("2", "12") or null.
 */
function extractNumericTokenFromFilename(filenameLower: string): string | null {
  const s = String(filenameLower || "").trim().toLowerCase();

  // Look for ...[-_]NUM[-_](en|vi).mp3 at the end
  const m = s.match(/[-_]+(\d+)[-_]+(en|vi)\.mp3$/i);
  if (m && m[1]) return m[1];

  // Also support edge: ...[-_]NUM(en|vi).mp3 (no separator before lang)
  const m2 = s.match(/[-_]+(\d+)(en|vi)\.mp3$/i);
  if (m2 && m2[1]) return m2[1];

  return null;
}

/**
 * (Optional) strong detector with roomId included, but tolerant of '-' vs '_' in roomId
 * Not required for correctness anymore; kept for extra safety.
 */
function isNumericTokenFilename(filenameLower: string, normalizedRoomId: string): boolean {
  const rid = escapeRegExp(String(normalizedRoomId || "").trim())
    // allow '-' and '_' to be interchangeable
    .replace(/\\-/g, "[-_]")
    .replace(/_/g, "[-_]");
  return new RegExp(`^${rid}[-_]+\\d+[-_]+(en|vi)\\.mp3$`, "i").test(filenameLower);
}

function extractSlugFromFilename(filename: string, roomId: string): string {
  let slug = filename.replace(/\.mp3$/i, "");

  // tolerate '-' vs '_' in roomId matching
  const ridRaw = String(roomId || "").trim();
  if (ridRaw) {
    const rid = escapeRegExp(ridRaw)
      .replace(/\\-/g, "[-_]")
      .replace(/_/g, "[-_]");
    slug = slug.replace(new RegExp(`^${rid}([_\\-]+)?`, "i"), "");
  }

  slug = slug.replace(/([_\-]+)(en|vi)$/i, "");
  return slug;
}

function findExactMatch(
  filename: string,
  roomId: string,
  entries: RoomEntry[],
  lang: "en" | "vi"
): MatchResult | null {
  const normalizedFilename = filename.toLowerCase();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const slug = asSlug(entry, i);
    const canonical = getCanonicalAudioForRoom(roomId, slug);

    if (normalizedFilename === canonical[lang].toLowerCase()) {
      return { entry, index: i, confidence: 1, matchType: "exact" };
    }
  }
  return null;
}

function findSlugMatch(slugPart: string, entries: RoomEntry[]): MatchResult | null {
  const needle = normToken(slugPart);
  if (!needle) return null;

  let best: MatchResult | null = null;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entrySlug = normToken(String(asSlug(entry, i)));
    const score = similarityScore(needle, entrySlug);
    if (!best || score > best.confidence) {
      best = { entry, index: i, confidence: score, matchType: "slug" };
    }
  }
  return best;
}

function findIndexMatch(slugPart: string, entries: RoomEntry[]): MatchResult | null {
  const needle = normToken(slugPart);
  const numbers = needle.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;

  for (const numStr of numbers) {
    const num = parseInt(numStr, 10);

    // 1) Prefer explicit entry.index
    const byExplicitIndex = entries.findIndex((e) => Number(e?.index) === num);
    if (byExplicitIndex >= 0) {
      return {
        entry: entries[byExplicitIndex],
        index: byExplicitIndex,
        confidence: 0.9,
        matchType: "index",
      };
    }

    // 2) Numeric slug/id like "2" should map by value (still index match)
    const byNumericSlug = entries.findIndex((e, i) => {
      const s = String(asSlug(e, i)).trim();
      return isPureNumberToken(s) && parseInt(s, 10) === num;
    });
    if (byNumericSlug >= 0) {
      return {
        entry: entries[byNumericSlug],
        index: byNumericSlug,
        confidence: 0.88,
        matchType: "index",
      };
    }

    // 3) Fallback positional (0-based and 1-based)
    for (const offset of [0, -1]) {
      const index = num + offset;
      if (index >= 0 && index < entries.length) {
        return {
          entry: entries[index],
          index,
          confidence: 0.85,
          matchType: "index",
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
  lang: "en" | "vi"
): MatchResult | null {
  let best: MatchResult | null = null;
  const normalizedFilename = filename.toLowerCase();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const slug = asSlug(entry, i);
    const canonical = getCanonicalAudioForRoom(roomId, slug)[lang];
    const score = similarityScore(normalizedFilename, canonical.toLowerCase());
    if (!best || score > best.confidence) {
      best = { entry, index: i, confidence: score, matchType: "levenshtein" };
    }
  }

  return best;
}

export function matchAudioToEntry(
  filename: string,
  roomId: string,
  entries: RoomEntry[]
): SemanticMatch {
  const filenameLower = filename.toLowerCase();
  const normalizedRoomId = normalizeRoomId(roomId);
  const lang = extractLanguage(filename);

  if (!lang) {
    return {
      filename,
      matchedEntry: null,
      confidence: 0,
      matchType: "none",
      suggestedCanonical: null,
      requiresHumanReview: true,
    };
  }

  const slugRaw = extractSlugFromFilename(filenameLower, normalizedRoomId);
  const slugToken = normToken(slugRaw);

  // ✅ ABSOLUTE RULE (robust):
  // If the filename ends with a numeric token before lang, treat as INDEX FIRST,
  // regardless of roomId formatting (underscore vs hyphen).
  const numericToken = extractNumericTokenFromFilename(filenameLower);
  if (numericToken) {
    const indexMatch = findIndexMatch(numericToken, entries);
    if (indexMatch) {
      const slug = asSlug(indexMatch.entry, indexMatch.index);
      return {
        filename,
        matchedEntry: { slug, index: indexMatch.index },
        confidence: Math.round(indexMatch.confidence * 100),
        matchType: "index",
        suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
        requiresHumanReview: false,
      };
    }
  }

  // Extra safety: also treat purely numeric slugToken or strict numeric-token pattern as index
  if (isPureNumberToken(slugToken) || isNumericTokenFilename(filenameLower, normalizedRoomId)) {
    const indexMatch = findIndexMatch(slugToken, entries);
    if (indexMatch) {
      const slug = asSlug(indexMatch.entry, indexMatch.index);
      return {
        filename,
        matchedEntry: { slug, index: indexMatch.index },
        confidence: Math.round(indexMatch.confidence * 100),
        matchType: "index",
        suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
        requiresHumanReview: false,
      };
    }
  }

  // Strategy 1: Exact canonical match (only AFTER numeric-index rule)
  const exactMatch = findExactMatch(filename, roomId, entries, lang);
  if (exactMatch) {
    const slug = asSlug(exactMatch.entry, exactMatch.index);
    return {
      filename,
      matchedEntry: { slug, index: exactMatch.index },
      confidence: 100,
      matchType: "exact",
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: false,
    };
  }

  // Strategy 2: Slug similarity match (only if NOT numeric)
  if (!isPureNumberToken(slugToken)) {
    const slugMatch = findSlugMatch(slugToken, entries);
    if (slugMatch && slugMatch.confidence > 0.9) {
      const slug = asSlug(slugMatch.entry, slugMatch.index);
      return {
        filename,
        matchedEntry: { slug, index: slugMatch.index },
        confidence: Math.round(slugMatch.confidence * 100),
        matchType: "slug",
        suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
        requiresHumanReview: false,
      };
    }
  }

  // Strategy 3: Index match (non-numeric tokens can still contain numbers)
  const indexMatch = findIndexMatch(slugToken, entries);
  if (indexMatch && indexMatch.confidence > 0.8) {
    const slug = asSlug(indexMatch.entry, indexMatch.index);
    return {
      filename,
      matchedEntry: { slug, index: indexMatch.index },
      confidence: Math.round(indexMatch.confidence * 100),
      matchType: "index",
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: false,
    };
  }

  // Strategy 4: Levenshtein fallback
  const levenshteinMatch = findLevenshteinMatch(filename, roomId, entries, lang);
  if (levenshteinMatch && levenshteinMatch.confidence >= MIN_CONFIDENCE_FOR_AUTO_FIX) {
    const slug = asSlug(levenshteinMatch.entry, levenshteinMatch.index);
    return {
      filename,
      matchedEntry: { slug, index: levenshteinMatch.index },
      confidence: Math.round(levenshteinMatch.confidence * 100),
      matchType: "levenshtein",
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: false,
    };
  }

  const bestGuess =
    levenshteinMatch ||
    indexMatch ||
    (!isPureNumberToken(slugToken) ? findSlugMatch(slugToken, entries) : null);

  if (bestGuess) {
    const slug = asSlug(bestGuess.entry, bestGuess.index);
    return {
      filename,
      matchedEntry: { slug, index: bestGuess.index },
      confidence: Math.round(bestGuess.confidence * 100),
      matchType: numericToken || isPureNumberToken(slugToken) ? "index" : bestGuess.matchType,
      suggestedCanonical: getCanonicalAudioForRoom(roomId, slug)[lang],
      requiresHumanReview: true,
    };
  }

  return {
    filename,
    matchedEntry: null,
    confidence: 0,
    matchType: "none",
    suggestedCanonical: null,
    requiresHumanReview: true,
  };
}

export function batchMatchOrphans(
  orphanFiles: string[],
  roomId: string,
  entries: RoomEntry[]
): { autoRepairs: SemanticMatch[]; humanReview: SemanticMatch[] } {
  const autoRepairs: SemanticMatch[] = [];
  const humanReview: SemanticMatch[] = [];

  for (const file of orphanFiles) {
    const match = matchAudioToEntry(file, roomId, entries);
    if (
      match.matchedEntry &&
      match.confidence >= MIN_CONFIDENCE_FOR_AUTO_FIX * 100 &&
      !match.requiresHumanReview
    ) {
      autoRepairs.push(match);
    } else {
      humanReview.push(match);
    }
  }

  return { autoRepairs, humanReview };
}

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
    let enFile: string | null = null;
    let viFile: string | null = null;

    for (const file of audioFiles) {
      if (usedFiles.has(file)) continue;

      const m = matchAudioToEntry(file, roomId, entries);
      if (!m.matchedEntry) continue;
      if (m.matchedEntry.index !== i) continue;

      const fileLang = extractLanguage(file);
      if (fileLang === "en" && m.confidence >= 80) {
        enFile = file;
        usedFiles.add(file);
      } else if (fileLang === "vi" && m.confidence >= 80) {
        viFile = file;
        usedFiles.add(file);
      }
    }

    matched.push({ entryIndex: i, enFile, viFile });
    if (!enFile || !viFile) missingEntries.push(i);
  }

  for (const file of audioFiles) {
    if (!usedFiles.has(file)) unmatched.push(file);
  }

  return { matched, unmatched, missingEntries };
}

export function getMatchConfidence(filename: string, canonical: string): number {
  return similarityScore(filename.toLowerCase(), canonical.toLowerCase());
}
