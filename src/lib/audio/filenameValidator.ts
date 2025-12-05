/**
 * Audio Filename Validator
 * 
 * Enforces naming standards across the project:
 * - all lowercase
 * - hyphen-separated (no underscores or spaces)
 * - roomId-prefixed
 * - ends with -en.mp3 or -vi.mp3
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
}

export function validateAudioFilename(filename: string): ValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];

  // Must be .mp3
  if (!filename.toLowerCase().endsWith('.mp3')) {
    errors.push('Must end with .mp3');
  }

  // Must be lowercase
  if (filename !== filename.toLowerCase()) {
    errors.push('Must be all lowercase');
    suggestions.push(`Rename to: ${filename.toLowerCase()}`);
  }

  // No spaces
  if (filename.includes(' ')) {
    errors.push('Must not contain spaces');
    suggestions.push(`Replace spaces with hyphens`);
  }

  // No underscores (prefer hyphens)
  if (filename.includes('_')) {
    errors.push('Should use hyphens instead of underscores');
    suggestions.push(`Rename to: ${filename.replace(/_/g, '-')}`);
  }

  // Must end with language suffix
  const hasLangSuffix = /-en\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename);
  if (!hasLangSuffix) {
    errors.push('Must end with -en.mp3 or -vi.mp3');
  }

  // No special characters except hyphen and dot
  const invalidChars = filename.replace(/[a-z0-9\-\.]/gi, '');
  if (invalidChars.length > 0) {
    errors.push(`Contains invalid characters: ${invalidChars}`);
  }

  // No leading/trailing quotes or special chars
  if (/^["']/.test(filename)) {
    errors.push('Starts with quote character (corrupted)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
  };
}

/**
 * Generate a canonical filename from room ID, entry slug, and language
 */
export function generateCanonicalFilename(
  roomId: string,
  entrySlug: string | number,
  language: 'en' | 'vi'
): string {
  const cleanRoomId = roomId.toLowerCase().replace(/[_\s]/g, '-');
  const cleanSlug = typeof entrySlug === 'number' 
    ? `entry-${entrySlug}` 
    : entrySlug.toLowerCase().replace(/[_\s]/g, '-');
  
  return `${cleanRoomId}-${cleanSlug}-${language}.mp3`;
}

/**
 * Normalize an existing filename to canonical format
 */
export function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/--+/g, '-')
    .replace(/^["']+/, '') // Remove leading quotes
    .trim();
}

/**
 * Extract language from filename
 */
export function extractLanguage(filename: string): 'en' | 'vi' | null {
  if (/_en\.mp3$/i.test(filename) || /-en\.mp3$/i.test(filename)) return 'en';
  if (/_vi\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename)) return 'vi';
  return null;
}
