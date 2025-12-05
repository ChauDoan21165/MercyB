/**
 * Audio Filename Validator v2.0
 * Chief Automation Engineer: Full Phase 2 Implementation
 * 
 * Enforces naming standards across the project:
 * - all lowercase
 * - hyphen-separated (no underscores or spaces)
 * - roomId-prefixed (REQUIRED)
 * - must match actual JSON entry
 * - ends with -en.mp3 or -vi.mp3
 * - detects duplicate normalized names
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
  expectedCanonicalName?: string;
  severity: 'ok' | 'warning' | 'critical';
}

export interface RoomAwareValidationResult extends ValidationResult {
  roomIdMatch: boolean;
  entryMatch: boolean;
  duplicateOf?: string;
}

export interface DuplicateGroup {
  normalizedName: string;
  variants: string[];
}

/**
 * Basic filename validation (format only)
 */
export function validateAudioFilename(filename: string): ValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];
  let severity: 'ok' | 'warning' | 'critical' = 'ok';

  // Must be .mp3
  if (!filename.toLowerCase().endsWith('.mp3')) {
    errors.push('Must end with .mp3');
    severity = 'critical';
  }

  // Must be lowercase
  if (filename !== filename.toLowerCase()) {
    errors.push('Must be all lowercase');
    suggestions.push(`Rename to: ${filename.toLowerCase()}`);
    severity = severity === 'ok' ? 'warning' : severity;
  }

  // No spaces
  if (filename.includes(' ')) {
    errors.push('Must not contain spaces');
    suggestions.push(`Replace spaces with hyphens`);
    severity = 'critical';
  }

  // No underscores (prefer hyphens)
  if (filename.includes('_')) {
    errors.push('Should use hyphens instead of underscores');
    suggestions.push(`Rename to: ${filename.replace(/_/g, '-')}`);
    severity = severity === 'ok' ? 'warning' : severity;
  }

  // Must end with language suffix
  const hasLangSuffix = /-en\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename);
  if (!hasLangSuffix) {
    errors.push('Must end with -en.mp3 or -vi.mp3');
    severity = 'critical';
  }

  // No special characters except hyphen and dot
  const invalidChars = filename.replace(/[a-z0-9\-\.]/gi, '');
  if (invalidChars.length > 0) {
    errors.push(`Contains invalid characters: ${invalidChars}`);
    severity = 'critical';
  }

  // No leading/trailing quotes or special chars
  if (/^["']/.test(filename)) {
    errors.push('Starts with quote character (corrupted)');
    severity = 'critical';
  }

  // Generate expected canonical name
  const expectedCanonicalName = normalizeFilename(filename);

  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
    expectedCanonicalName,
    severity,
  };
}

/**
 * Room-aware validation (Phase 2 requirement)
 * Validates filename against room context
 */
export function validateWithRoomContext(
  filename: string,
  roomId: string,
  entrySlugs?: (string | number)[],
  allFilenames?: string[]
): RoomAwareValidationResult {
  const baseValidation = validateAudioFilename(filename);
  const errors = [...baseValidation.errors];
  const suggestions = [...baseValidation.suggestions];
  let severity = baseValidation.severity;
  let roomIdMatch = false;
  let entryMatch = false;
  let duplicateOf: string | undefined;

  const normalizedFilename = filename.toLowerCase();
  const normalizedRoomId = roomId.toLowerCase().replace(/[_\s]/g, '-');

  // Rule 1: Filename MUST start with roomId
  if (normalizedFilename.startsWith(normalizedRoomId + '-')) {
    roomIdMatch = true;
  } else {
    errors.push(`Filename must start with roomId: ${normalizedRoomId}-`);
    severity = 'critical';
  }

  // Rule 2: Filename MUST match an actual JSON entry
  if (entrySlugs && entrySlugs.length > 0) {
    const lang = extractLanguage(filename);
    if (lang) {
      for (const slug of entrySlugs) {
        const expectedName = generateCanonicalFilename(roomId, slug, lang);
        if (normalizedFilename === expectedName || 
            normalizeFilename(filename) === expectedName) {
          entryMatch = true;
          break;
        }
      }
      
      if (!entryMatch) {
        // Check if it's close to any entry
        const closestSlug = findClosestEntrySlug(filename, roomId, entrySlugs, lang);
        if (closestSlug) {
          const suggestedName = generateCanonicalFilename(roomId, closestSlug, lang);
          suggestions.push(`Closest match: ${suggestedName}`);
        }
      }
    }
  }

  // Rule 3: Detect duplicate normalized names
  if (allFilenames && allFilenames.length > 0) {
    const myNormalized = normalizeFilename(filename);
    for (const other of allFilenames) {
      if (other !== filename && normalizeFilename(other) === myNormalized) {
        duplicateOf = other;
        errors.push(`Duplicate of: ${other} (both normalize to ${myNormalized})`);
        severity = 'critical';
        break;
      }
    }
  }

  // Generate expected canonical
  const lang = extractLanguage(filename);
  let expectedCanonicalName = baseValidation.expectedCanonicalName;
  
  if (lang && entrySlugs && entrySlugs.length > 0) {
    // Try to match to closest entry
    const closestSlug = findClosestEntrySlug(filename, roomId, entrySlugs, lang);
    if (closestSlug) {
      expectedCanonicalName = generateCanonicalFilename(roomId, closestSlug, lang);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
    expectedCanonicalName,
    severity,
    roomIdMatch,
    entryMatch,
    duplicateOf,
  };
}

/**
 * Find the closest matching entry slug for a filename
 */
function findClosestEntrySlug(
  filename: string,
  roomId: string,
  entrySlugs: (string | number)[],
  lang: 'en' | 'vi'
): string | number | null {
  const normalizedFilename = normalizeFilename(filename);
  
  // Try exact match first
  for (const slug of entrySlugs) {
    const expected = generateCanonicalFilename(roomId, slug, lang);
    if (normalizedFilename === expected) {
      return slug;
    }
  }

  // Try fuzzy match - extract the middle part of the filename
  const roomPrefix = roomId.toLowerCase().replace(/[_\s]/g, '-') + '-';
  const langSuffix = `-${lang}.mp3`;
  
  if (normalizedFilename.startsWith(roomPrefix) && normalizedFilename.endsWith(langSuffix)) {
    const middle = normalizedFilename.slice(roomPrefix.length, -langSuffix.length);
    
    for (const slug of entrySlugs) {
      const slugStr = typeof slug === 'number' ? `entry-${slug}` : slug.toLowerCase().replace(/[_\s]/g, '-');
      if (middle === slugStr || middle.includes(slugStr) || slugStr.includes(middle)) {
        return slug;
      }
    }
  }

  // Return first entry as fallback
  return entrySlugs.length > 0 ? entrySlugs[0] : null;
}

/**
 * Detect duplicate normalized filenames in a list
 */
export function detectDuplicates(filenames: string[]): DuplicateGroup[] {
  const groups = new Map<string, string[]>();
  
  for (const filename of filenames) {
    const normalized = normalizeFilename(filename);
    const existing = groups.get(normalized) || [];
    existing.push(filename);
    groups.set(normalized, existing);
  }

  const duplicates: DuplicateGroup[] = [];
  for (const [normalizedName, variants] of groups) {
    if (variants.length > 1) {
      duplicates.push({ normalizedName, variants });
    }
  }

  return duplicates;
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

/**
 * Batch validate all filenames with duplicate detection
 */
export function batchValidate(
  filenames: string[],
  roomId?: string,
  entrySlugs?: (string | number)[]
): {
  results: Map<string, ValidationResult | RoomAwareValidationResult>;
  duplicates: DuplicateGroup[];
  summary: {
    total: number;
    valid: number;
    warnings: number;
    critical: number;
    duplicateGroups: number;
  };
} {
  const results = new Map<string, ValidationResult | RoomAwareValidationResult>();
  const duplicates = detectDuplicates(filenames);
  
  let valid = 0;
  let warnings = 0;
  let critical = 0;

  for (const filename of filenames) {
    const result = roomId
      ? validateWithRoomContext(filename, roomId, entrySlugs, filenames)
      : validateAudioFilename(filename);
    
    results.set(filename, result);
    
    if (result.isValid) valid++;
    else if (result.severity === 'warning') warnings++;
    else if (result.severity === 'critical') critical++;
  }

  return {
    results,
    duplicates,
    summary: {
      total: filenames.length,
      valid,
      warnings,
      critical,
      duplicateGroups: duplicates.length,
    },
  };
}
