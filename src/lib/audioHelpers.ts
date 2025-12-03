/**
 * Audio Helpers - Canonical audio path handling
 * 
 * AUDIO PATH FORMAT:
 * - Files stored in: public/audio/{filename}.mp3
 * - Runtime URL: /audio/{filename}.mp3
 * - NO "public/" prefix in runtime paths
 * 
 * CANONICAL FILENAME FORMAT:
 * - {room_id}_{entry_index}_en.mp3 (e.g., ef06_01_en.mp3)
 * - All lowercase, underscores between parts
 */

const AUDIO_FOLDER = 'audio';

/**
 * Build audio source URL from filename
 * Ensures consistent path format: /audio/{filename} or preserves /music/ paths
 */
export function buildAudioSrc(filename: string | null | undefined): string | null {
  if (!filename) return null;
  
  let clean = filename.trim();
  if (!clean) return null;
  
  // Remove any leading slashes for consistent handling
  clean = clean.replace(/^\/+/, '');
  
  // Remove "public/" prefix if present (should never be in runtime paths)
  clean = clean.replace(/^public\//, '');
  
  // If already has valid prefix (audio/, music/), just ensure leading slash
  if (clean.startsWith('audio/') || clean.startsWith('music/')) {
    return `/${clean}`;
  }
  
  // For bare filenames, prepend /audio/
  return `/${AUDIO_FOLDER}/${clean}`;
}

/**
 * Normalize audio filename - strips paths, ensures consistent format
 */
export function normalizeAudioFilename(raw: string | null | undefined): string | null {
  if (!raw) return null;
  
  let filename = raw.trim();
  if (!filename) return null;
  
  // Extract just the filename (last segment after any slashes)
  const lastSlash = Math.max(filename.lastIndexOf('/'), filename.lastIndexOf('\\'));
  if (lastSlash >= 0) {
    filename = filename.substring(lastSlash + 1);
  }
  
  // Remove any query params
  const queryIndex = filename.indexOf('?');
  if (queryIndex >= 0) {
    filename = filename.substring(0, queryIndex);
  }
  
  return filename || null;
}

/**
 * Extract audio field from entry - handles various formats
 * CANONICAL: entry.audio (string filename)
 * LEGACY: audio_en, audioEn, audio.en
 */
export function extractAudioFromEntry(entry: any): string | null {
  if (!entry) return null;
  
  // Canonical: entry.audio as string
  if (typeof entry.audio === 'string' && entry.audio.trim()) {
    return entry.audio.trim();
  }
  
  // Object format: entry.audio.en
  if (entry.audio && typeof entry.audio === 'object') {
    const val = entry.audio.en ?? entry.audio.vi ?? Object.values(entry.audio)[0];
    if (val && typeof val === 'string') return val.trim();
  }
  
  // Legacy fallbacks
  if (entry.audio_en && typeof entry.audio_en === 'string') {
    return entry.audio_en.trim();
  }
  if (entry.audioEn && typeof entry.audioEn === 'string') {
    return entry.audioEn.trim();
  }
  
  return null;
}

/**
 * Build full audio URL from entry
 */
export function getEntryAudioUrl(entry: any): string | null {
  const filename = extractAudioFromEntry(entry);
  return buildAudioSrc(filename);
}

/**
 * Validate audio URL - returns true if URL looks valid
 */
export function isValidAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  const clean = url.trim().toLowerCase();
  if (!clean) return false;
  
  // Must end with audio extension
  if (!clean.endsWith('.mp3') && !clean.endsWith('.wav') && !clean.endsWith('.ogg')) {
    return false;
  }
  
  // Must start with /audio/ or /music/ (valid asset folders)
  if (!clean.startsWith('/audio/') && !clean.startsWith('/music/')) {
    return false;
  }
  
  return true;
}
