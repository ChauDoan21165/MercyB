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
const LEADING_SLASHES = /^\/+/;
const PUBLIC_PREFIX = /^public\//;
const AUDIO_LANG_PREFIX = /^audio\/(en|vi)\//;
const AUDIO_PREFIX = /^audio\//;
const WHITESPACE_SPLIT = /\s+/;

/**
 * Normalize audio path - optimized version with fewer operations
 */
export const normalizeAudioPath = (path: string): string => {
  let p = path.replace(LEADING_SLASHES, '').replace(PUBLIC_PREFIX, '');
  
  if (p.startsWith('rooms/')) {
    return `/audio/${p}`;
  }
  
  p = p.replace(AUDIO_LANG_PREFIX, 'audio/').replace(AUDIO_PREFIX, '');
  return `/audio/${p}`;
};

/**
 * Process audio field - handles single files and playlists
 */
export const processAudioField = (audioRaw: any): { audioPath?: string; audioPlaylist?: string[] } => {
  if (!audioRaw) return {};
  
  const rawString = String(audioRaw);
  const audioFiles = rawString.trim().split(WHITESPACE_SPLIT).filter(Boolean);
  
  if (audioFiles.length === 0) return {};
  
  if (audioFiles.length > 1) {
    // Multiple files - create playlist
    const audioPlaylist = audioFiles.map(normalizeAudioPath);
    return {
      audioPath: audioPlaylist[0],
      audioPlaylist
    };
  }
  
  // Single file
  const audioPath = normalizeAudioPath(rawString);
  return {
    audioPath,
    audioPlaylist: [audioPath]
  };
};

/**
 * Extract audio from entry - canonical structure with minimal legacy fallbacks
 * CANONICAL: entry.audio (string filename, no paths)
 * LEGACY: audio_en, audioEn (deprecated - migrate to audio)
 */
export const extractAudio = (entry: any): any => {
  // Canonical field
  if (entry?.audio) {
    if (typeof entry.audio === 'object') {
      return entry.audio.en ?? entry.audio.vi ?? Object.values(entry.audio)[0];
    }
    return entry.audio;
  }
  
  // Legacy fallbacks (deprecated)
  return entry?.audio_en || entry?.audioEn || null;
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
 */
export const processEntry = (entry: any, idx: number, seenKeywords: Set<string>) => {
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
  
  // Process audio
  const audioRaw = extractAudio(entry);
  const { audioPath, audioPlaylist } = processAudioField(audioRaw);
  
  // Extract content
  const { replyEn, replyVi } = extractContent(entry);
  
  // Get primary keywords for entry
  const keywordEn = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0 
    ? entry.keywords_en[0] 
    : entry.identifier || entry.slug || `entry-${idx}`;
  const keywordVi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0 
    ? entry.keywords_vi[0] 
    : entry.identifier || entry.slug || '';
  
  // Transform entry
  const transformedEntry = {
    ...entry,
    slug: entry.slug || entry.identifier,
    audio: audioPath,
    audioPlaylist,
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
 */
export const processEntriesOptimized = (entries: any[]) => {
  const enList: string[] = [];
  const viList: string[] = [];
  const seenKeywords = new Set<string>();
  const transformedEntries: any[] = [];
  
  entries.forEach((entry, idx) => {
    const { keywords, transformedEntry } = processEntry(entry, idx, seenKeywords);
    
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