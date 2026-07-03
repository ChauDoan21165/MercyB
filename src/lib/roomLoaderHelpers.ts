// src/lib/roomLoaderHelpers.ts — MB-BLUE-94.7 — 2025-12-24 (+0700)
/**
 * Helper functions for room loading - extracted for reusability and performance
 *
 * CANONICAL ROOM ENTRY STRUCTURE (aligned with roomJsonResolver.ts and validation):
 * - audio: entry.audio (string filename, no paths) OR object { en, vi } OR legacy: audio_en, audioEn
 * - copy: entry.copy.en + entry.copy.vi OR legacy: copy_en, copy_vi, essay.en, essay.vi
 * - identifiers: entry.slug OR entry.id OR entry.artifact_id
 * - keywords: entry.keywords_en (array) + entry.keywords_vi (array)
 *
 * Legacy fallbacks are marked and minimal to support gradual migration.
 *
 * MB-BLUE-94.7 change:
 * - Confirm canonical audio normalization supports:
 *   - audio: "file.mp3"
 *   - audio: { en: "file.mp3", vi?: "file_vi.mp3" }
 *   - legacy: audio_en / audioEn
 * - All outputs remain: FILENAMES ONLY (no path prefixes).
 */

// Pre-compiled regex patterns for performance
const WHITESPACE_SPLIT = /\s+/;

type RoomEntryLike = Record<string, unknown>;

function asRecord(value: unknown): RoomEntryLike {
  return value && typeof value === "object" && !Array.isArray(value) ? value as RoomEntryLike : {};
}

function readRecord(record: RoomEntryLike, key: string): RoomEntryLike {
  return asRecord(record[key]);
}

/**
 * Normalize audio filename - strips any path prefixes, returns just filename
 * This is the canonical normalizer for room entry audio fields.
 */
export const normalizeAudioFilename = (
  raw: string | null | undefined
): string | null => {
  if (!raw) return null;
  let name = String(raw).trim();
  if (!name) return null;

  // Strip any path prefixes to get just filename
  if (name.startsWith("public/")) name = name.slice("public/".length);
  if (name.startsWith("/audio/")) name = name.slice("/audio/".length);
  if (name.startsWith("audio/")) name = name.slice("audio/".length);
  if (name.startsWith("/")) name = name.slice(1);

  // Handle legacy en/vi subdirectories
  if (name.startsWith("en/")) name = name.slice("en/".length);
  if (name.startsWith("vi/")) name = name.slice("vi/".length);

  return name || null;
};

/**
 * Process audio field - handles single files and playlists
 * Returns FILENAMES ONLY (no paths) - path construction happens at UI layer
 */
export const processAudioField = (
  audioRaw: unknown
): { audioFilename?: string; audioPlaylist?: string[] } => {
  if (!audioRaw) return {};

  const rawString = String(audioRaw);
  const audioFiles = rawString.trim().split(WHITESPACE_SPLIT).filter(Boolean);

  if (audioFiles.length === 0) return {};

  if (audioFiles.length > 1) {
    // Multiple files - create playlist of filenames
    const audioPlaylist = audioFiles
      .map((f) => normalizeAudioFilename(f))
      .filter((f): f is string => !!f);

    return {
      audioFilename: audioPlaylist[0],
      audioPlaylist,
    };
  }

  // Single file - return just filename
  const audioFilename = normalizeAudioFilename(rawString);

  return audioFilename
    ? {
        audioFilename,
        audioPlaylist: [audioFilename],
      }
    : {};
};

/**
 * Get audio filename from entry - single canonical helper
 * Returns just the filename (no path prefix), or null if not configured.
 *
 * CANONICAL: entry.audio (string filename, no paths)
 * ALSO SUPPORTED: entry.audio as object { en, vi, ... }
 * LEGACY: audio_en, audioEn (deprecated - migrate to audio)
 */
export const getAudioFilename = (entry: unknown): string | null => {
  const entryRecord = asRecord(entry);
  // Canonical field first
  if (entryRecord.audio && typeof entryRecord.audio === "string") {
    const v = entryRecord.audio.trim();
    return v ? v : null;
  }

  // Supported object format { en: "...", vi: "..." }
  const audioRecord = asRecord(entryRecord.audio);
  if (Object.keys(audioRecord).length > 0) {
    const val =
      audioRecord.en ??
      audioRecord.vi ??
      // if some other language key exists, take first value
      Object.values(audioRecord)[0];

    const s = val ? String(val).trim() : "";
    return s ? s : null;
  }

  // Minimal legacy fallbacks
  if (entryRecord.audio_en) {
    const s = String(entryRecord.audio_en).trim();
    return s ? s : null;
  }
  if (entryRecord.audioEn) {
    const s = String(entryRecord.audioEn).trim();
    return s ? s : null;
  }

  return null;
};

/**
 * Extract audio from entry - canonical structure with minimal legacy fallbacks
 * CANONICAL: entry.audio (string filename, no paths) OR object { en, vi }
 * LEGACY: audio_en, audioEn (deprecated - migrate to audio)
 *
 * Logs warning if audio is missing to help with content fixes.
 */
export const extractAudio = (entry: unknown, roomId?: string): string | null => {
  const entryRecord = asRecord(entry);
  const filename = getAudioFilename(entry);

  if (filename) {
    return filename;
  }

  // No audio found - log warning in development only
  if (import.meta.env.DEV) {
    const identifier =
      entryRecord.slug || entryRecord.id || entryRecord.artifact_id || "unknown-entry";

    console.warn(
      `⚠️ Missing audio: Room "${roomId || "unknown"}" → Entry "${identifier}"`,
      '\n   Add "audio" field to entry in JSON file'
    );
  }

  return null;
};

/**
 * Extract content fields (essay/reply/copy) - canonical structure with minimal legacy fallbacks
 * CANONICAL: entry.copy.en + entry.copy.vi
 * LEGACY: copy_en, copy_vi, essay.en, essay.vi (deprecated - migrate to copy.en/vi)
 */
export const extractContent = (entry: unknown) => {
  const entryRecord = asRecord(entry);
  const copy = readRecord(entryRecord, "copy");
  const essay = readRecord(entryRecord, "essay");
  // Canonical nested structure
  const replyEn =
    copy.en ||
    // Legacy flat fields (deprecated)
    entryRecord.copy_en ||
    essay.en ||
    entryRecord.essay_en ||
    "";

  const replyVi =
    copy.vi ||
    // Legacy flat fields (deprecated)
    entryRecord.copy_vi ||
    essay.vi ||
    entryRecord.essay_vi ||
    "";

  return { replyEn, replyVi };
};

/**
 * Extract title from entry - handles various formats
 */
export const extractTitle = (entry: unknown) => {
  const entryRecord = asRecord(entry);
  const title = readRecord(entryRecord, "title");
  const titleEn = title.en ?? entryRecord.title;
  const titleVi = title.vi ?? "";
  return { titleEn, titleVi };
};

/**
 * Single-pass entry processor: extracts keywords AND transforms entry
 * Returns both keywords and transformed entry
 *
 * @param entry - Room entry to process
 * @param idx - Entry index (for fallback identifiers)
 * @param seenKeywords - Set of already-seen keywords for deduplication
 * @param roomId - Optional room ID for better error logging
 */
export const processEntry = (
  entry: unknown,
  idx: number,
  seenKeywords: Set<string>,
  roomId?: string
) => {
  const entryRecord = asRecord(entry);
  // Extract keywords for keyword menu
  let keywords: { en: string; vi: string } | null = null;

  if (Array.isArray(entryRecord.keywords_en) && Array.isArray(entryRecord.keywords_vi)) {
    const maxLen = Math.max(entryRecord.keywords_en.length, entryRecord.keywords_vi.length);

    for (let i = 0; i < maxLen; i++) {
      const en = entryRecord.keywords_en[i] ? String(entryRecord.keywords_en[i]).trim() : "";
      const vi = entryRecord.keywords_vi[i] ? String(entryRecord.keywords_vi[i]).trim() : "";

      if (en) {
        const normalizedEn = en.toLowerCase();
        if (!seenKeywords.has(normalizedEn)) {
          seenKeywords.add(normalizedEn);
          if (!keywords) keywords = { en, vi }; // Use first keyword for this entry
        }
      }
    }
  } else {
    // Fallback: use title or identifier
    const { titleEn, titleVi } = extractTitle(entry);
    const en = String(titleEn || entryRecord.identifier || entryRecord.slug || "").trim();
    const vi = String(titleVi || entryRecord.identifier || entryRecord.slug || "").trim();

    if (en) {
      const normalizedEn = en.toLowerCase();
      if (!seenKeywords.has(normalizedEn)) {
        seenKeywords.add(normalizedEn);
        keywords = { en, vi };
      }
    }
  }

  // Process audio (with room context for better logging)
  // Returns filenames only - path construction happens at UI layer
  const audioRaw = extractAudio(entry, roomId); // string filename or null
  const { audioFilename, audioPlaylist } = processAudioField(audioRaw);

  // Extract content
  const { replyEn, replyVi } = extractContent(entry);

  // Get primary keywords for entry
  const keywordEn =
    Array.isArray(entryRecord.keywords_en) && entryRecord.keywords_en.length > 0
      ? entryRecord.keywords_en[0]
      : entryRecord.identifier || entryRecord.slug || `entry-${idx}`;

  const keywordVi =
    Array.isArray(entryRecord.keywords_vi) && entryRecord.keywords_vi.length > 0
      ? entryRecord.keywords_vi[0]
      : entryRecord.identifier || entryRecord.slug || "";

  // Transform entry - audio contains FILENAME ONLY (no path prefix)
  const transformedEntry = {
    ...entryRecord,
    slug: entryRecord.slug || entryRecord.identifier,
    audio: audioFilename, // Just filename, e.g. "anx_level3_1_en.mp3"
    audioPlaylist, // Array of filenames
    keywordEn,
    keywordVi,
    replyEn,
    replyVi,
    essay_en: replyEn,
    essay_vi: replyVi,
  };

  return { keywords, transformedEntry };
};

/**
 * Process all entries in a single pass
 *
 * @param entries - Array of room entries to process
 * @param roomId - Optional room ID for better error logging
 */
export const processEntriesOptimized = (entries: unknown[], roomId?: string) => {
  const enList: string[] = [];
  const viList: string[] = [];
  const seenKeywords = new Set<string>();
  const transformedEntries: RoomEntryLike[] = [];

  entries.forEach((entry, idx) => {
    const { keywords, transformedEntry } = processEntry(
      entry,
      idx,
      seenKeywords,
      roomId
    );

    if (keywords) {
      enList.push(keywords.en);
      viList.push(keywords.vi);
    }

    transformedEntries.push(transformedEntry);
  });

  return {
    keywordMenu: { en: enList, vi: viList },
    merged: transformedEntries,
  };
};
