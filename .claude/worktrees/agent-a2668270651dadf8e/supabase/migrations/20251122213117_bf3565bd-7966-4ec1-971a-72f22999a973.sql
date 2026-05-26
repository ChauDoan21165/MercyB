-- Migration: 20251122213117_bf3565bd-7966-4ec1-971a-72f22999a973
-- Purpose:
--   Add admin INSERT/UPDATE policies for kids_entries
--   Guarded so migration is replay-safe when kids tables are absent

DO $$
BEGIN
  -- Skip entirely if kids_entries table does not exist
  IF to_regclass('public.kids_entries') IS NULL THEN
    RAISE NOTICE 'kids_entries missing; skipping kids_entries policies.';
    RETURN;
  END IF;

  -- INSERT policy
  EXECUTE $pol$
    CREATE POLICY "Admins can insert kids entries"
    ON public.kids_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'admin'
      )
    );
  $pol$;

  -- UPDATE policy
  EXECUTE $pol$
    CREATE POLICY "Admins can update kids entries"
    ON public.kids_entries
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'admin'
      )
    );
  $pol$;

END $$;
