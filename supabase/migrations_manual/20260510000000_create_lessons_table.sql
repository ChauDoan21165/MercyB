-- ============================================================================
-- public.lessons — Language lesson content storage
-- Phase 1 of PLAN-LESSONS-REFACTOR.md
--
-- Apply via Supabase SQL Editor (Dashboard → SQL Editor → New Query).
-- Do NOT use CLI migrations for this file.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lessons (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    language        text NOT NULL,
    level           text NOT NULL,
    lesson_index    integer NOT NULL,
    content         jsonb NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),

    -- Each (language, level, lesson_index) pair is unique.
    -- The sync script upserts on this constraint so re-running is idempotent.
    CONSTRAINT lessons_lang_level_idx_unique UNIQUE (language, level, lesson_index)
);

-- Enable RLS (does nothing without policies, but ensures no accidental
-- open access if policies are dropped later).
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all lesson rows.
-- No INSERT / UPDATE / DELETE policies — the sync script uses the
-- service role key and bypasses RLS entirely.
CREATE POLICY "Authenticated users can read lessons"
ON public.lessons
FOR SELECT
TO authenticated
USING (true);

-- Trigger: auto-update updated_at on every row modification.
CREATE OR REPLACE FUNCTION public.lessons_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lessons_set_updated_at ON public.lessons;
CREATE TRIGGER trg_lessons_set_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.lessons_set_updated_at();

-- Index for the most common query pattern: fetch all lessons for a
-- language + level, ordered by lesson_index.
CREATE INDEX IF NOT EXISTS idx_lessons_lang_level
ON public.lessons (language, level, lesson_index);
