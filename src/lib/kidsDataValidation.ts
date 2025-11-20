/**
 * Kids English Data Validation Schema
 * Validates incoming JSON for Kids rooms following unified content rules
 */

import { z } from 'zod';

/**
 * Single entry validation (from user's format)
 */
const kidsEntrySchema = z.object({
  slug: z.string().min(1),
  keywords_en: z.array(z.string()).optional(),
  keywords_vi: z.array(z.string()).optional(),
  copy: z.object({
    en: z.string()
      .trim()
      .min(50, "English content must be at least 50 characters")
      .max(1500, "English content must not exceed 1500 characters"),
    vi: z.string()
      .trim()
      .min(50, "Vietnamese translation must be at least 50 characters")
      .max(2000, "Vietnamese translation must not exceed 2000 characters")
  }),
  tags: z.array(z.string()).optional(),
  audio: z.string().min(1, "Audio filename required")
});

/**
 * Kids room JSON structure validation (user's format)
 */
export const kidsRoomJsonSchema = z.object({
  id: z.string()
    .min(1, "Room ID required")
    .regex(/^[\w_]+$/, "Room ID must be alphanumeric with underscores"),
  tier: z.string().min(1, "Tier required"),
  title: z.object({
    en: z.string().trim().min(3).max(100),
    vi: z.string().trim().min(3).max(100)
  }),
  content: z.object({
    en: z.string().trim().min(10).max(1000),
    vi: z.string().trim().min(10).max(1500),
    audio: z.string().optional()
  }),
  entries: z.array(kidsEntrySchema)
    .length(5, "Must have exactly 5 entries per room"),
  meta: z.object({
    age_range: z.string(),
    level: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    entry_count: z.number().int().min(5).max(5),
    room_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color")
  })
});

/**
 * Batch import validation
 */
export const kidsRoomBatchSchema = z.array(kidsRoomJsonSchema).min(1).max(30);

/**
 * Validate single Kids room JSON
 */
export function validateKidsRoomJson(data: unknown) {
  return kidsRoomJsonSchema.safeParse(data);
}

/**
 * Validate batch of Kids rooms
 */
export function validateKidsRoomBatch(data: unknown) {
  return kidsRoomBatchSchema.safeParse(data);
}

/**
 * Extract level from tier string
 */
export function extractLevelFromTier(tier: string): string {
  if (tier.includes('Level 1') || tier.includes('Cấp 1')) return 'level1';
  if (tier.includes('Level 2') || tier.includes('Cấp 2')) return 'level2';
  if (tier.includes('Level 3') || tier.includes('Cấp 3')) return 'level3';
  return 'level1';
}

/**
 * Convert user ID format to database ID format
 * Example: "alphabet_adventure_kids_l1" → "level1-alphabet-adventure"
 */
export function convertRoomIdToDbFormat(id: string, tier: string): string {
  const level = extractLevelFromTier(tier);
  // Remove trailing _kids_l1, _kids_l2, _kids_l3
  const cleanId = id.replace(/_kids_l[1-3]$/, '');
  // Convert underscores to hyphens
  const dashedId = cleanId.replace(/_/g, '-');
  return `${level}-${dashedId}`;
}

/**
 * Validation result type
 */
export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: string[];
};

/**
 * Format validation errors for user display
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.errors.map(err => {
    const path = err.path.join(' → ');
    return path ? `${path}: ${err.message}` : err.message;
  });
}
