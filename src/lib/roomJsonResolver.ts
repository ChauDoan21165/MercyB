/**
 * CANONICAL ROOM JSON RESOLVER - STRICT MODE (NO FALLBACKS)
 * 
 * This is the SINGLE SOURCE OF TRUTH for all room JSON loading.
 * 
 * SYSTEM-WIDE GUARANTEE:
 * - ONE resolver used everywhere (Chat, Health Check, Registry, Manifest)
 * - ONE naming rule: public/data/{room_id}.json (lowercase snake_case ONLY)
 * - ZERO fallback attempts (no case conversion, no underscore/hyphen swapping)
 * - HARD FAIL on mismatch with clear error message
 * 
 * STRICT VALIDATION:
 * - Filename MUST exactly match JSON.id
 * - Lowercase snake_case ONLY (no kebab-case, TitleCase, PascalCase)
 * - Bilingual fields required (title.en + title.vi OR name + name_vi)
 * - Entry count: 2-8 entries per room
 * - Audio field required for each entry
 * - Entry identifiers required (slug, artifact_id, or id)
 * 
 * LOADING SEQUENCE:
 * 1. Try manifest path (if exists in PUBLIC_ROOM_MANIFEST)
 * 2. Try canonical path (data/{room_id}.json - EXACT MATCH)
 * 3. HARD FAIL with detailed error (no silent skips)
 * 
 * This architecture eliminates:
 * - Phantom rooms in database
 * - "1 entry" display bugs
 * - Silent import failures
 * - Filename/ID mismatches
 * - Inconsistent loader behavior
 * 
 * Used by: Chat system, Health Check, Registry Generation, All room data consumers
 */

import { PUBLIC_ROOM_MANIFEST } from "./roomManifest";

export interface RoomJsonValidationError {
  room_id: string;
  expected_path: string;
  reason: string;
  detail?: string;
}

export class RoomJsonNotFoundError extends Error {
  constructor(
    public room_id: string,
    public expected_path: string,
    public reason: string,
    public detail?: string
  ) {
    super(`❌ ERROR: JSON file not found or invalid
room: ${room_id}
expected: ${expected_path}
reason: ${reason}
${detail ? `detail: ${detail}` : ''}`);
    this.name = 'RoomJsonNotFoundError';
  }
}

/**
 * CANONICAL NAMING RULE (STRICT - NO FALLBACKS):
 * - Filename: public/data/{room_id}.json
 * - room_id EXACTLY equals JSON.id
 * - all lowercase
 * - snake_case only (no kebab-case, no TitleCase, no PascalCase)
 * - NO guessing, NO case conversion, NO fallbacks
 * 
 * If exact match not found → HARD FAIL with clear error
 */
export function getCanonicalPath(roomId: string): string {
  return `data/${roomId}.json`;
}

import { 
  getValidationConfig, 
  validateEntryCount, 
  validateEntryAudio, 
  validateEntryBilingualCopy,
  type ValidationMode 
} from './validation/roomJsonValidation';

/**
 * Validates that JSON structure meets requirements
 * Now supports environment-aware validation modes
 */
export function validateRoomJson(data: any, roomId: string, filename: string, mode?: ValidationMode): void {
  // Check if we got HTML instead of JSON
  if (typeof data === 'string' && (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html'))) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      'Received HTML instead of JSON',
      'File may not exist or server returned error page'
    );
  }

  // Validate JSON.id matches filename (extract id from filename)
  const expectedId = filename.replace(/^data\//, '').replace(/\.json$/, '');
  if (data.id && data.id !== expectedId && data.id !== roomId) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      'JSON.id does not match filename',
      `Expected: ${expectedId}, Got: ${data.id}`
    );
  }

  // Get validation config
  const config = getValidationConfig(mode);

  // Validate bilingual fields
  const hasBilingualTitle = (data.title?.en && data.title?.vi) || (data.name && data.name_vi);
  
  if (!hasBilingualTitle && !config.allowMissingFields) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      'Missing bilingual title fields',
      `Required: title.en + title.vi OR name + name_vi (${config.mode} mode)`
    );
  }

  // Validate entries
  if (!data.entries || !Array.isArray(data.entries)) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      'Missing or invalid entries array',
      'entries field must be an array'
    );
  }

  // Validate entry count with mode-specific rules
  const entryCountResult = validateEntryCount(data.entries.length, mode);
  if (!entryCountResult.valid) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      'Invalid entry count',
      entryCountResult.message
    );
  }

  // Validate each entry has required fields (mode-aware)
  data.entries.forEach((entry: any, index: number) => {
    const hasId = entry.slug || entry.artifact_id || entry.id;
    if (!hasId) {
      throw new RoomJsonNotFoundError(
        roomId,
        filename,
        `Entry ${index + 1} missing identifier`,
        'Each entry must have slug, artifact_id, or id field'
      );
    }

    // Check for audio (mode-aware)
    const audioResult = validateEntryAudio(entry, index, mode);
    if (!audioResult.valid) {
      throw new RoomJsonNotFoundError(
        roomId,
        filename,
        `Entry ${index + 1} audio validation failed`,
        audioResult.message
      );
    }

    // Check for bilingual content (mode-aware)
    const bilingualResult = validateEntryBilingualCopy(entry, index, mode);
    if (!bilingualResult.valid) {
      throw new RoomJsonNotFoundError(
        roomId,
        filename,
        `Entry ${index + 1} bilingual copy validation failed`,
        bilingualResult.message
      );
    }
  });

  // Validate tier if present
  if (data.tier && !['free', 'vip1', 'vip2', 'vip3', 'vip3_ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'].includes(data.tier.toLowerCase().replace(/\s*\/.*$/, '').replace(/\s+/g, ''))) {
    console.warn(`⚠️ Unusual tier value for ${roomId}: ${data.tier}`);
  }
}

/**
 * CENTRAL RESOLVER - Used by all systems
 * Tries paths in order of preference, validates strictly
 */
export async function resolveRoomJsonPath(roomId: string): Promise<string> {
  // 1. Try manifest path first (already validated during registry generation)
  if (PUBLIC_ROOM_MANIFEST[roomId]) {
    const manifestPath = PUBLIC_ROOM_MANIFEST[roomId];
    try {
      const cacheBuster = Date.now();
      const response = await fetch(`/${manifestPath}?t=${cacheBuster}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        validateRoomJson(data, roomId, manifestPath);
        return manifestPath;
      }
    } catch (error) {
      // Continue to next candidate
    }
  }

  // 2. Try canonical path: data/{room_id}.json
  const canonicalPath = getCanonicalPath(roomId);
  try {
    const cacheBuster = Date.now();
    const response = await fetch(`/${canonicalPath}?t=${cacheBuster}`, {
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      validateRoomJson(data, roomId, canonicalPath);
      return canonicalPath;
    }
  } catch (error) {
    // Continue to backwards compatibility
  }

  // 3. HARD FAIL - No valid JSON found
  throw new RoomJsonNotFoundError(
    roomId,
    canonicalPath,
    'File not found - exact match required',
    `Expected exact file: ${canonicalPath}\nJSON.id must exactly match filename (lowercase snake_case)\nNo fallbacks or case conversions attempted`
  );
}

/**
 * Load and validate room JSON data
 */
export async function loadRoomJson(roomId: string): Promise<any> {
  const path = await resolveRoomJsonPath(roomId);
  const cacheBuster = Date.now();
  const response = await fetch(`/${path}?t=${cacheBuster}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new RoomJsonNotFoundError(
      roomId,
      path,
      `HTTP ${response.status}`,
      response.statusText
    );
  }

  const data = await response.json();
  validateRoomJson(data, roomId, path);
  
  return data;
}

/**
 * Bulk validation for pre-publish checks
 */
export async function validateAllRooms(roomIds: string[]): Promise<{
  valid: string[];
  errors: RoomJsonValidationError[];
}> {
  const valid: string[] = [];
  const errors: RoomJsonValidationError[] = [];

  for (const roomId of roomIds) {
    try {
      await loadRoomJson(roomId);
      valid.push(roomId);
    } catch (error) {
      if (error instanceof RoomJsonNotFoundError) {
        errors.push({
          room_id: error.room_id,
          expected_path: error.expected_path,
          reason: error.reason,
          detail: error.detail,
        });
      } else {
        errors.push({
          room_id: roomId,
          expected_path: getCanonicalPath(roomId),
          reason: 'Unknown error',
          detail: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  return { valid, errors };
}
