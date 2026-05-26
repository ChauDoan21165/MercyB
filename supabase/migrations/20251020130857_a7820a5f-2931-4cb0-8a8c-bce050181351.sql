-- 20251020130857_a7820a5f-2931-4cb0-8a8c-bce050181351.sql
-- Idempotent user_points table + RLS + trigger + indexes

-- Create table if missing
CREATE TABLE IF NOT EXISTS public.user_points (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  total_points integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ensure columns exist (handles drift)
ALTER TABLE public.user_points
  ADD COLUMN IF NOT EXISTS id uuid;

ALTER TABLE public.user_points
  ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE public.user_points
  ADD COLUMN IF NOT EXISTS total_points integer NOT NULL DEFAULT 0;

ALTER TABLE public.user_points
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();

ALTER TABLE public.user_points
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

-- Ensure primary key exists (if table pre-existed without it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'user_points'
      AND c.contype = 'p'
  ) THEN
    ALTER TABLE public.user_points ADD CONSTRAINT user_points_pkey PRIMARY KEY (id);
  END IF;
END $$;

-- Ensure uniqueness on user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'user_points'
      AND c.contype = 'u'
      AND pg_get_constraintdef(c.oid) LIKE '%(user_id)%'
  ) THEN
    ALTER TABLE public.user_points ADD CONSTRAINT user_points_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Optional FK to auth.users if you want it (safe: only adds if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'user_points'
      AND c.contype = 'f'
      AND pg_get_constraintdef(c.oid) LIKE '%REFERENCES auth.users%'
  ) THEN
    ALTER TABLE public.user_points
      ADD CONSTRAINT user_points_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- auth.users missing in some contexts; ignore
    NULL;
END $$;

-- RLS
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Policies (drop/recreate)
DROP POLICY IF EXISTS "Users can view own points" ON public.user_points;
CREATE POLICY "Users can view own points"
ON public.user_points
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own points" ON public.user_points;
CREATE POLICY "Users can upsert own points"
ON public.user_points
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own points" ON public.user_points;
CREATE POLICY "Users can update own points"
ON public.user_points
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- If you have admin role helper, add admin read/write (optional but common)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'has_role'
  ) THEN
    DROP POLICY IF EXISTS "Admins can view all points" ON public.user_points;
    CREATE POLICY "Admins can view all points"
    ON public.user_points
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

    DROP POLICY IF EXISTS "Admins can manage all points" ON public.user_points;
    CREATE POLICY "Admins can manage all points"
    ON public.user_points
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- updated_at trigger if available
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'handle_updated_at'
  ) THEN
    DROP TRIGGER IF EXISTS update_user_points_updated_at ON public.user_points;
    CREATE TRIGGER update_user_points_updated_at
    BEFORE UPDATE ON public.user_points
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON public.user_points (user_id);