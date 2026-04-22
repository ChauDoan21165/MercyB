-- Adds server-side storage for Mercy Journey's teacher memory.
-- One row per user; the entire StudentMercyMemory object lives in a JSONB column.
-- Replaces the previous localStorage-only persistence so Journey memory survives
-- browser clears, device switches, and reinstalls.

CREATE TABLE public.teacher_memory (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  memory     jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Maintain updated_at on every UPDATE.
CREATE OR REPLACE FUNCTION public.teacher_memory_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER teacher_memory_updated_at
BEFORE UPDATE ON public.teacher_memory
FOR EACH ROW
EXECUTE FUNCTION public.teacher_memory_set_updated_at();

-- Row-level security: each user can only read + write their own row.
ALTER TABLE public.teacher_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_memory_own_read"
  ON public.teacher_memory
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "teacher_memory_own_insert"
  ON public.teacher_memory
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "teacher_memory_own_update"
  ON public.teacher_memory
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Explicit table-level grants — RLS alone is not enough. Postgres checks
-- grants first; without these an INSERT fails with 42501 ("permission denied
-- for table") before the RLS policy is ever evaluated. Same mistake that
-- broke study_log earlier.
GRANT SELECT, INSERT, UPDATE ON public.teacher_memory TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
