BEGIN;

ALTER TABLE public.room_entries ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.room_entries TO anon, authenticated;

DROP POLICY IF EXISTS "Users can view room entries based on room tier" ON public.room_entries;
DROP POLICY IF EXISTS room_entries_public_select ON public.room_entries;
DROP POLICY IF EXISTS room_entries_public_free_select ON public.room_entries;
DROP POLICY IF EXISTS room_entries_select_gated ON public.room_entries;

CREATE POLICY room_entries_public_free_select
  ON public.room_entries
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM rooms r
      WHERE r.id = room_entries.room_id
        AND COALESCE(r.required_vip_rank, 0) = 0
    )
  );

CREATE POLICY room_entries_select_gated
  ON public.room_entries
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM rooms r
      WHERE r.id = room_entries.room_id
        AND (
          COALESCE(r.required_vip_rank, 0) = 0
          OR user_vip_rank(auth.uid()) >= COALESCE(r.required_vip_rank, 0)
        )
    )
  );

COMMIT;
