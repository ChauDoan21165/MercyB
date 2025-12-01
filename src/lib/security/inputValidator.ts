/**
 * Input Validation Utilities
 * Centralized validation for user inputs and payloads
 */

import { z } from 'zod';

// ============= ROOM ID VALIDATION =============
const ROOM_ID_PATTERN = /^[a-z0-9_-]+$/i;
const MAX_ROOM_ID_LENGTH = 100;

export function validateRoomId(roomId: string): string {
  if (!roomId || typeof roomId !== 'string') {
    throw new Error('INVALID_ROOM_ID: Room ID is required');
  }

  const trimmed = roomId.trim();

  if (trimmed.length === 0 || trimmed.length > MAX_ROOM_ID_LENGTH) {
    throw new Error(`INVALID_ROOM_ID: Room ID must be 1-${MAX_ROOM_ID_LENGTH} characters`);
  }

  // Prevent path traversal
  if (trimmed.includes('..') || trimmed.includes('/') || trimmed.includes('\\')) {
    throw new Error('INVALID_ROOM_ID: Path traversal detected');
  }

  // Validate against safe pattern
  if (!ROOM_ID_PATTERN.test(trimmed)) {
    throw new Error('INVALID_ROOM_ID: Room ID contains invalid characters. Only [a-z0-9_-] allowed');
  }

  return trimmed;
}

// ============= AUDIO FILENAME VALIDATION =============
const AUDIO_FILENAME_PATTERN = /^[a-z0-9_-]+\.mp3$/i;
const MAX_AUDIO_FILENAME_LENGTH = 200;

export function validateAudioFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    throw new Error('INVALID_AUDIO_FILENAME: Filename is required');
  }

  const trimmed = filename.trim();

  if (trimmed.length === 0 || trimmed.length > MAX_AUDIO_FILENAME_LENGTH) {
    throw new Error(`INVALID_AUDIO_FILENAME: Filename must be 1-${MAX_AUDIO_FILENAME_LENGTH} characters`);
  }

  // Prevent path separators
  if (trimmed.includes('/') || trimmed.includes('\\')) {
    throw new Error('INVALID_AUDIO_FILENAME: Path separators not allowed');
  }

  // Validate against safe pattern
  if (!AUDIO_FILENAME_PATTERN.test(trimmed)) {
    throw new Error('INVALID_AUDIO_FILENAME: Filename must match pattern [a-z0-9_-].mp3');
  }

  return trimmed;
}

// ============= ENTRY TEXT VALIDATION =============
const MAX_ENTRY_TEXT_LENGTH = 50000; // 50KB per entry
const MAX_ESSAY_LENGTH = 200000; // 200KB for essays

export function validateEntryText(text: string, field: string = 'text'): string {
  if (!text || typeof text !== 'string') {
    throw new Error(`INVALID_INPUT: ${field} is required`);
  }

  if (text.length > MAX_ENTRY_TEXT_LENGTH) {
    throw new Error(`INVALID_INPUT: ${field} exceeds maximum length of ${MAX_ENTRY_TEXT_LENGTH} characters`);
  }

  return text;
}

export function validateEssay(essay: string): string {
  if (!essay || typeof essay !== 'string') {
    throw new Error('INVALID_INPUT: Essay is required');
  }

  if (essay.length > MAX_ESSAY_LENGTH) {
    throw new Error(`INVALID_INPUT: Essay exceeds maximum length of ${MAX_ESSAY_LENGTH} characters`);
  }

  return essay;
}

// ============= ROOM SIZE VALIDATION =============
const MAX_ENTRIES_PER_ROOM = 100;

export function validateRoomSize(entriesCount: number): void {
  if (entriesCount > MAX_ENTRIES_PER_ROOM) {
    throw new Error(`INVALID_ROOM_SIZE: Room has ${entriesCount} entries, max allowed is ${MAX_ENTRIES_PER_ROOM}`);
  }
}

// ============= TIER VALIDATION =============
const VALID_TIERS = ['free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'kids_1', 'kids_2', 'kids_3'];

export function validateTier(tier: string): string {
  if (!tier || typeof tier !== 'string') {
    throw new Error('INVALID_TIER: Tier is required');
  }

  const normalized = tier.toLowerCase().trim();

  if (!VALID_TIERS.includes(normalized)) {
    throw new Error(`INVALID_TIER: "${tier}" is not a valid tier. Must be one of: ${VALID_TIERS.join(', ')}`);
  }

  return normalized;
}

// ============= URL VALIDATION =============
const SUSPICIOUS_URL_PATTERNS = [
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /file:/i,
];

export function validateUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    throw new Error('INVALID_URL: URL is required');
  }

  const trimmed = url.trim();

  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_URL_PATTERNS) {
    if (pattern.test(trimmed)) {
      throw new Error('INVALID_URL: Suspicious URL pattern detected');
    }
  }

  // Must be http or https for external URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      new URL(trimmed); // Validate URL format
      return trimmed;
    } catch {
      throw new Error('INVALID_URL: Malformed URL');
    }
  }

  // Internal path - must not contain suspicious characters
  if (trimmed.includes('..') || trimmed.includes('\\')) {
    throw new Error('INVALID_URL: Path traversal detected');
  }

  return trimmed;
}

// ============= GENERIC PAYLOAD VALIDATION =============
export function validatePayloadSize(payload: any, maxBytes: number = 1_000_000): void {
  const size = new TextEncoder().encode(JSON.stringify(payload)).length;
  
  if (size > maxBytes) {
    throw new Error(`PAYLOAD_TOO_LARGE: Payload size ${size} bytes exceeds maximum ${maxBytes} bytes`);
  }
}

// ============= ZOD SCHEMAS FOR COMMON PAYLOADS =============

export const FeedbackSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
  category: z.string().trim().optional(),
});

export const RoomSpecPayloadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional(),
  targetId: z.string().trim().min(1).max(100),
  scope: z.enum(['room', 'tier', 'global']),
});

export const ProfileUpdateSchema = z.object({
  full_name: z.string().trim().max(200).optional(),
  username: z.string().trim().max(50).optional(),
  phone: z.string().trim().max(20).optional(),
});
