import { z } from 'zod';

// Database types
export interface Path {
  id: string;
  slug: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  total_days: number;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PathDay {
  id: string;
  path_id: string;
  day_index: number;
  title_en: string;
  title_vi: string;
  content_en: string;
  content_vi: string;
  reflection_en: string;
  reflection_vi: string;
  dare_en: string;
  dare_vi: string;
  // Legacy audio (single intro)
  audio_intro_en: string | null;
  audio_intro_vi: string | null;
  // New expanded audio (content, reflection, dare)
  audio_content_en: string | null;
  audio_content_vi: string | null;
  audio_reflection_en: string | null;
  audio_reflection_vi: string | null;
  audio_dare_en: string | null;
  audio_dare_vi: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPathProgress {
  id: string;
  user_id: string;
  path_id: string;
  current_day: number;
  completed_days: number[];
  started_at: string;
  updated_at: string;
}

// Zod schemas for validation
export const pathSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title_en: z.string().min(1),
  title_vi: z.string().min(1),
  description_en: z.string().min(1),
  description_vi: z.string().min(1),
  total_days: z.number().int().positive(),
  cover_image: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const pathDaySchema = z.object({
  id: z.string().uuid(),
  path_id: z.string().uuid(),
  day_index: z.number().int().positive(),
  title_en: z.string().min(1),
  title_vi: z.string().min(1),
  content_en: z.string().min(1),
  content_vi: z.string().min(1),
  reflection_en: z.string().min(1),
  reflection_vi: z.string().min(1),
  dare_en: z.string().min(1),
  dare_vi: z.string().min(1),
  audio_intro_en: z.string().nullable(),
  audio_intro_vi: z.string().nullable(),
  audio_content_en: z.string().nullable(),
  audio_content_vi: z.string().nullable(),
  audio_reflection_en: z.string().nullable(),
  audio_reflection_vi: z.string().nullable(),
  audio_dare_en: z.string().nullable(),
  audio_dare_vi: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const userPathProgressSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  path_id: z.string().uuid(),
  current_day: z.number().int().positive(),
  completed_days: z.array(z.number().int()),
  started_at: z.string(),
  updated_at: z.string(),
});

// Extended types with relations
export interface PathWithDays extends Path {
  days: PathDay[];
}

export interface PathWithProgress extends Path {
  progress: UserPathProgress | null;
}
