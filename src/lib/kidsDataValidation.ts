/**
 * Kids English Data Validation Schema
 * Validates incoming JSON for Kids rooms following unified content rules
 */

import { z } from 'zod';

/**
 * Audio file naming convention: <roomId>_<entryNumber>_en.mp3
 */
const audioFilenameSchema = z.string().regex(
  /^level[1-3]-[\w-]+-\d+_en\.mp3$/,
  "Audio filename must follow format: <roomId>_<entryNumber>_en.mp3"
);

/**
 * Single entry validation (120 words EN + full VI translation)
 */
const kidsEntrySchema = z.object({
  display_order: z.number().int().min(1).max(5),
  content_en: z.string()
    .trim()
    .min(50, "English content must be at least 50 characters")
    .max(1000, "English content must not exceed 1000 characters")
    .refine(
      (text) => {
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        return wordCount >= 100 && wordCount <= 150;
      },
      "English content must be approximately 120 words (100-150 range)"
    ),
  content_vi: z.string()
    .trim()
    .min(50, "Vietnamese translation must be at least 50 characters")
    .max(1500, "Vietnamese translation must not exceed 1500 characters"),
  audio_filename: audioFilenameSchema.optional(),
  includes_try_this: z.boolean().default(false)
});

/**
 * Kids room JSON structure validation
 */
export const kidsRoomJsonSchema = z.object({
  id: z.string()
    .regex(/^level[1-3]-[\w-]+$/, "Room ID must follow format: level1-room-name"),
  level_id: z.enum(['level1', 'level2', 'level3'], {
    errorMap: () => ({ message: "Level must be level1, level2, or level3" })
  }),
  title_en: z.string().trim().min(3).max(100),
  title_vi: z.string().trim().min(3).max(100),
  description_en: z.string().trim().max(500).optional(),
  description_vi: z.string().trim().max(500).optional(),
  icon: z.string().optional(),
  entries: z.array(kidsEntrySchema)
    .length(5, "Must have exactly 5 entries per room")
    .refine(
      (entries) => {
        const orders = entries.map(e => e.display_order).sort();
        return JSON.stringify(orders) === JSON.stringify([1, 2, 3, 4, 5]);
      },
      "Entries must have display_order values 1, 2, 3, 4, 5"
    ),
  meta: z.object({
    tier: z.enum(['level1', 'level2', 'level3']),
    age_range: z.enum(['4-7', '7-10', '10-13']),
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
 * Validate audio filename matches room ID and entry number
 */
export function validateAudioFilename(
  roomId: string, 
  entryNumber: number, 
  audioFilename: string
): boolean {
  const expected = `${roomId}_${entryNumber}_en.mp3`;
  return audioFilename === expected;
}

/**
 * Generate expected audio filename
 */
export function generateAudioFilename(roomId: string, entryNumber: number): string {
  return `${roomId}_${entryNumber}_en.mp3`;
}

/**
 * Extract room level from room ID
 */
export function extractLevelFromRoomId(roomId: string): string | null {
  const match = roomId.match(/^(level[1-3])-/);
  return match ? match[1] : null;
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
