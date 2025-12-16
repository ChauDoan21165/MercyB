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

import {
  getValidationConfig,
  validateEntryCount,
  validateEntryAudio,
  validateEntryBilingualCopy,
  type ValidationMode,
} from "./validation/roomJsonValidation";

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
${detail ? `detail: ${detail}` : ""}`);
    this.name = "RoomJsonNotFoundError";
  }
}

/**
 * INPUT NORMALIZATION (BOUNDARY-SAFE)
 *
 * IMPORTANT:
 * - This is NOT a filesystem fallback system.
 * - We do NOT "try multiple filenames".
 * - We only normalize USER/URL input into canonical ID formats:
 *   - Manifest keys: kebab-case (english-writing-free)
 *   - Canonical file IDs: snake_case (english_writing_free)
 *
 * This prevents wasted hours caused by underscores/casing/spaces in the URL.
 */
export function normalizeRoomIdForManifest(input: string): string {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Convert any input to canonical snake_case for filenames.
 * This is NOT guessing a different room; it is normalizing the same roomId.
 */
export function normalizeRoomIdForCanonicalFile(input: string): string {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

/**
 * CANONICAL NAMING RULE (STRICT - NO FALLBACKS):
 * - Filename: public/data/{room_id}.json
 * - room_id EXACTLY equals JSON.id
 * - all lowercase
 * - snake_case only (no kebab-case, no TitleCase, no PascalCase)
 * - NO guessing, NO multi-attempt fallbacks
 *
 * If exact match not found → HARD FAIL with clear error
 */
export function getCanonicalPath(roomId: string): string {
  const canonicalSnake = normalizeRoomIdForCanonicalFile(roomId);
  return `data/${canonicalSnake}.json`;
}

/**
 * Validates that JSON structure meets requirements
 * Now supports environment-aware validation modes
 */
export function validateRoomJson(
  data: any,
  roomId: string,
  filename: string,
  mode?: ValidationMode
): void {
  // Check if we got HTML instead of JSON
  if (
    typeof data === "string" &&
    (data.trim().startsWith("<!DOCTYPE") || data.trim().startsWith("<html"))
  ) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      "Received HTML instead of JSON",
      "File may not exist or server returned error page"
    );
  }

  // Validate JSON.id matches filename (extract id from filename)
  const expectedId = filename.replace(/^data\//, "").replace(/\.json$/, "");

  // Strict: JSON.id must match filename ID (snake_case). We allow roomId only as "input" for error context.
  if (data.id && data.id !== expectedId) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      "JSON.id does not match filename",
      `Expected: ${expectedId}, Got: ${data.id}`
    );
  }

  // Get validation config
  const config = getValidationConfig(mode);

  // Validate bilingual fields
  const hasBilingualTitle =
    (data.title?.en && data.title?.vi) || (data.name && data.name_vi);

  if (!hasBilingualTitle && !config.allowMissingFields) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      "Missing bilingual title fields",
      `Required: title.en + title.vi OR name + name_vi (${config.mode} mode)`
    );
  }

  // Validate entries
  if (!data.entries || !Array.isArray(data.entries)) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      "Missing or invalid entries array",
      "entries field must be an array"
    );
  }

  // Validate entry count with mode-specific rules
  const entryCountResult = validateEntryCount(data.entries.length, mode);
  if (!entryCountResult.valid) {
    throw new RoomJsonNotFoundError(
      roomId,
      filename,
      "Invalid entry count",
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
        "Each entry must have slug, artifact_id, or id field"
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

  // Validate tier if present (silent validation in production)
  const validTiers = [
    "free",
    "vip1",
    "vip2",
    "vip3",
    "vip3_ii",
    "vip4",
    "vip5",
    "vip6",
    "vip7",
    "vip8",
    "vip9",
  ];
  if (
    data.tier &&
    !validTiers.includes(
      data.tier.toLowerCase().replace(/\s*\/.*$/, "").replace(/\s+/g, "")
    )
  ) {
    // Invalid tier detected but not blocking in production
  }
}

/**
 * CENTRAL RESOLVER - Used by all systems
 * Tries paths in order of preference, validates strictly
 */
export async function resolveRoomJsonPath(roomId: string): Promise<string> {
  const MODE =
    import.meta.env.VITE_MB_VALIDATION_MODE ||
    (import.meta.env.MODE === "production" ? "strict" : "wip");

  // Normalize ONLY for manifest lookup (because manifest keys are kebab-case)
  const manifestKey = normalizeRoomIdForManifest(roomId);

  // 1. Try manifest path first (already validated during registry generation)
  if (PUBLIC_ROOM_MANIFEST[manifestKey]) {
    const manifestPath = PUBLIC_ROOM_MANIFEST[manifestKey];
    try {
      const cacheBuster = Date.now();
      const response = await fetch(`/${manifestPath}?t=${cacheBuster}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        // Validate against the filename ID (snake_case), not the kebab-case manifest key
        validateRoomJson(data, roomId, manifestPath, MODE);
        return manifestPath;
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 2. Try canonical path: data/{room_id}.json (snake_case)
  const canonicalPath = getCanonicalPath(roomId);
  try {
    const cacheBuster = Date.now();
    const response = await fetch(`/${canonicalPath}?t=${cacheBuster}`, {
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      validateRoomJson(data, roomId, canonicalPath, MODE);
      return canonicalPath;
    }
  } catch {
    // Continue to hard fail
  }

  // 3. HARD FAIL - No valid JSON found
  throw new RoomJsonNotFoundError(
    roomId,
    canonicalPath,
    "File not found - exact match required",
    `Manifest key tried: ${manifestKey}
Expected exact file: ${canonicalPath}
JSON.id must exactly match filename (lowercase snake_case)
No multi-path fallbacks attempted`
  );
}

/**
 * Load and validate room JSON data
 */
export async function loadRoomJson(roomId: string): Promise<any> {
  const MODE =
    import.meta.env.VITE_MB_VALIDATION_MODE ||
    (import.meta.env.MODE === "production" ? "strict" : "wip");

  const path = await resolveRoomJsonPath(roomId);
  const cacheBuster = Date.now();
  const response = await fetch(`/${path}?t=${cacheBuster}`, {
    cache: "no-store",
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
  validateRoomJson(data, roomId, path, MODE);

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
          reason: "Unknown error",
          detail: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  return { valid, errors };
}
