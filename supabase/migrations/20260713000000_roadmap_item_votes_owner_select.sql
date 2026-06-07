BEGIN;

DROP POLICY IF EXISTS roadmap_item_votes_select_all
  ON public.roadmap_item_votes;

DROP POLICY IF EXISTS roadmap_item_votes_select_own
  ON public.roadmap_item_votes;

CREATE POLICY roadmap_item_votes_select_own
  ON public.roadmap_item_votes
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE SELECT ON public.roadmap_item_votes FROM anon;

COMMIT;
