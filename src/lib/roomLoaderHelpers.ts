/**
 * Helper functions for room loading - extracted for reusability and performance
 * 
 * CANONICAL ROOM ENTRY STRUCTURE (aligned with roomJsonResolver.ts and validation):
 * - audio: entry.audio (string filename, no paths) OR legacy: audio_en, audioEn
 * - copy: entry.copy.en + entry.copy.vi OR legacy: copy_en, copy_vi, essay.en, essay.vi
 * - identifiers: entry.slug OR entry.id OR entry.artifact_id
 * - keywords: entry.keywords_en (array) + entry.keywords_vi (array)
 * 
 * Legacy fallbacks are marked and minimal to support gradual migration.
 */

// Pre-compiled regex patterns for performance
const WHITESPACE_SPLIT = /\s+/;

/**
 * Normalize audio filename - strips any path prefixes, returns just filename
 * This is the canonical normalizer for room entry audio fields.
 */
export const normalizeAudioFilename = (raw: string | null | undefined): string | null => {
  if (!raw) return null;
  let name = String(raw).trim();
  if (!name) return null;
  
  // Strip any path prefixes to get just filename
  if (name.startsWith('public/')) name = name.slice('public/'.length);
  if (name.startsWith('/audio/')) name = name.slice('/audio/'.length);
  if (name.startsWith('audio/')) name = name.slice('audio/'.length);
  if (name.startsWith('/')) name = name.slice(1);
  
  // Handle legacy en/vi subdirectories
  if (name.startsWith('en/')) name = name.slice('en/'.length);
  if (name.startsWith('vi/')) name = name.slice('vi/'.length);
  
  return name || null;
};

/**
 * Process audio field - handles single files and playlists
 * Returns FILENAMES ONLY (no paths) - path construction happens at UI layer
 */
export const processAudioField = (audioRaw: any): { audioFilename?: string; audioPlaylist?: string[] } => {
  if (!audioRaw) return {};
  
  const rawString = String(audioRaw);
  const audioFiles = rawString.trim().split(WHITESPACE_SPLIT).filter(Boolean);
  
  if (audioFiles.length === 0) return {};
  
  if (audioFiles.length > 1) {
    // Multiple files - create playlist of filenames
    const audioPlaylist = audioFiles.map(f => normalizeAudioFilename(f)).filter((f): f is string => !!f);
    return {
      audioFilename: audioPlaylist[0],
      audioPlaylist
    };
  }
  
  // Single file - return just filename
  const audioFilename = normalizeAudioFilename(rawString);
  return audioFilename ? {
    audioFilename,
    audioPlaylist: [audioFilename]
  } : {};
};

/**
 * Get audio filename from entry - single canonical helper
 * Returns just the filename (no path prefix), or null if not configured.
 * 
 * CANONICAL: entry.audio (string filename, no paths)
 * LEGACY: audio_en, audioEn (deprecated - migrate to audio)
 */
export const getAudioFilename = (entry: any): string | null => {
  // Canonical field first
  if (entry?.audio && typeof entry.audio === 'string') {
    return entry.audio.trim();
  }
  
  // Handle object format { en: "...", vi: "..." }
  if (entry?.audio && typeof entry.audio === 'object') {
    const val = entry.audio.en ?? entry.audio.vi ?? Object.values(entry.audio)[0];
    return val ? String(val).trim() : null;
  }
  
  // Minimal legacy fallbacks
  if (entry?.audio_en) return String(entry.audio_en).trim();
  if (entry?.audioEn) return String(entry.audioEn).trim();
  
  return null;
};

/**
 * Extract audio from entry - canonical structure with minimal legacy fallbacks
 * CANONICAL: entry.audio (string filename, no paths)
 * LEGACY: audio_en, audioEn (deprecated - migrate to audio)
 * 
 * Logs warning if audio is missing to help with content fixes.
 */
export const extractAudio = (entry: any, roomId?: string): any => {
  const filename = getAudioFilename(entry);
  
  if (filename) {
    return filename;
  }
  
  // No audio found - log warning in development only
  if (import.meta.env.DEV) {
    const identifier = entry?.slug || entry?.id || entry?.artifact_id || 'unknown-entry';
    console.warn(
      `⚠️ Missing audio: Room "${roomId || 'unknown'}" → Entry "${identifier}"`,
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
export const extractContent = (entry: any) => {
  // Canonical nested structure
  const replyEn = entry.copy?.en || 
                  // Legacy flat fields (deprecated)
                  entry.copy_en || entry.essay?.en || entry.essay_en || '';
  const replyVi = entry.copy?.vi || 
                  // Legacy flat fields (deprecated)
                  entry.copy_vi || entry.essay?.vi || entry.essay_vi || '';
  
  return { replyEn, replyVi };
};

/**
 * Extract title from entry - handles various formats
 */
export const extractTitle = (entry: any) => {
  const titleEn = typeof entry.title === 'object' ? entry.title?.en : entry.title;
  const titleVi = typeof entry.title === 'object' ? entry.title?.vi : '';
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
  entry: any, 
  idx: number, 
  seenKeywords: Set<string>,
  roomId?: string
) => {
  // Extract keywords for keyword menu
  let keywords: { en: string; vi: string } | null = null;
  
  if (Array.isArray(entry.keywords_en) && Array.isArray(entry.keywords_vi)) {
    const maxLen = Math.max(entry.keywords_en.length, entry.keywords_vi.length);
    for (let i = 0; i < maxLen; i++) {
      const en = entry.keywords_en[i] ? String(entry.keywords_en[i]).trim() : '';
      const vi = entry.keywords_vi[i] ? String(entry.keywords_vi[i]).trim() : '';
      
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
    const en = String(titleEn || entry.identifier || entry.slug || '').trim();
    const vi = String(titleVi || entry.identifier || entry.slug || '').trim();
    
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
  const audioRaw = extractAudio(entry, roomId);
  const { audioFilename, audioPlaylist } = processAudioField(audioRaw);
  
  // Extract content
  const { replyEn, replyVi } = extractContent(entry);
  
  // Get primary keywords for entry
  const keywordEn = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0 
    ? entry.keywords_en[0] 
    : entry.identifier || entry.slug || `entry-${idx}`;
  const keywordVi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0 
    ? entry.keywords_vi[0] 
    : entry.identifier || entry.slug || '';
  
  // Transform entry - audio contains FILENAME ONLY (no path prefix)
  const transformedEntry = {
    ...entry,
    slug: entry.slug || entry.identifier,
    audio: audioFilename, // Just filename, e.g. "debate_01_vip2.mp3"
    audioPlaylist,        // Array of filenames
    keywordEn,
    keywordVi,
    replyEn,
    replyVi,
    essay_en: replyEn,
    essay_vi: replyVi
  };
  
  return { keywords, transformedEntry };
};

/**
 * Process all entries in a single pass
 * 
 * @param entries - Array of room entries to process
 * @param roomId - Optional room ID for better error logging
 */
export const processEntriesOptimized = (entries: any[], roomId?: string) => {
  const enList: string[] = [];
  const viList: string[] = [];
  const seenKeywords = new Set<string>();
  const transformedEntries: any[] = [];
  
  entries.forEach((entry, idx) => {
    const { keywords, transformedEntry } = processEntry(entry, idx, seenKeywords, roomId);
    
    if (keywords) {
      enList.push(keywords.en);
      viList.push(keywords.vi);
    }
    
    transformedEntries.push(transformedEntry);
  });
  
  return {
    keywordMenu: { en: enList, vi: viList },
    merged: transformedEntries
  };
};