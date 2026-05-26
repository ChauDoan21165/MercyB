-- Step 11 (Trust moat) — Voice-of-customer feedback loop + public roadmap.
--
-- Two tracks shipped together:
--
--   1. Extend public.feedback with sentiment + admin-triage fields so
--      the admin VoC inbox can group / triage / track-to-resolution.
--      Heuristic sentiment runs client-side at submit time (best-effort,
--      never blocks insert). Admin can override sentiment after review.
--
--   2. Public roadmap: roadmap_items + roadmap_item_votes. The /roadmap
--      page renders three columns (Planned, In Progress, Recently
--      Shipped) — only items with public_visible=true. Logged-in users
--      can upvote at most once per item; vote_count is denormalised on
--      roadmap_items via trigger for cheap UI rendering.
--
-- RLS posture:
--   feedback (existing): UPDATE only by admins (already in place).
--   roadmap_items: SELECT for any signed-in user when public_visible;
--                  INSERT/UPDATE/DELETE only by admin level >= 9.
--   roadmap_item_votes: SELECT for any signed-in user (so vote_count is
--                       auditable); INSERT/DELETE limited to own row.
--
-- Reversibility:
--   DROP TRIGGER IF EXISTS trg_roadmap_votes_count ON public.roadmap_item_votes;
--   DROP FUNCTION IF EXISTS public.refresh_roadmap_vote_count();
--   DROP TABLE IF EXISTS public.roadmap_item_votes;
--   DROP TABLE IF EXISTS public.roadmap_items;
--   ALTER TABLE public.feedback DROP COLUMN IF EXISTS admin_notes;
--   ALTER TABLE public.feedback DROP COLUMN IF EXISTS admin_status;
--   ALTER TABLE public.feedback DROP COLUMN IF EXISTS sentiment_tags;
--   ALTER TABLE public.feedback DROP COLUMN IF EXISTS sentiment;

-- ── 1. Extend public.feedback ────────────────────────────────────────────

ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS sentiment       text,
  ADD COLUMN IF NOT EXISTS sentiment_tags  text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS admin_status    text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS admin_notes     text;

ALTER TABLE public.feedback
  DROP CONSTRAINT IF EXISTS feedback_sentiment_chk;
ALTER TABLE public.feedback
  ADD  CONSTRAINT feedback_sentiment_chk
       CHECK (sentiment IS NULL OR sentiment IN ('positive','neutral','negative','mixed'));

ALTER TABLE public.feedback
  DROP CONSTRAINT IF EXISTS feedback_admin_status_chk;
ALTER TABLE public.feedback
  ADD  CONSTRAINT feedback_admin_status_chk
       CHECK (admin_status IN ('new','triaged','in_progress','shipped','wontfix'));

CREATE INDEX IF NOT EXISTS idx_feedback_admin_status_new
  ON public.feedback (created_at DESC)
  WHERE admin_status = 'new';

CREATE INDEX IF NOT EXISTS idx_feedback_sentiment
  ON public.feedback (sentiment)
  WHERE sentiment IS NOT NULL;

COMMENT ON COLUMN public.feedback.sentiment IS
  'Heuristic sentiment from submit-time tagger. Admin can override during triage.';
COMMENT ON COLUMN public.feedback.sentiment_tags IS
  'Topic tags (e.g. {audio_quality, pricing, mercy_voice}). Best-effort client-side.';
COMMENT ON COLUMN public.feedback.admin_status IS
  'Triage state: new → triaged → in_progress → shipped (or wontfix).';

-- ── 2. roadmap_items ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.roadmap_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  description_vi  text,
  description_en  text,
  status          text NOT NULL DEFAULT 'planned',
  priority        integer NOT NULL DEFAULT 0,
  public_visible  boolean NOT NULL DEFAULT true,
  vote_count      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  shipped_at      timestamptz,
  CONSTRAINT roadmap_items_status_chk
    CHECK (status IN ('planned','in_progress','shipped','dropped')),
  CONSTRAINT roadmap_items_title_chk
    CHECK (length(trim(title)) BETWEEN 2 AND 120),
  CONSTRAINT roadmap_items_vote_count_nonneg
    CHECK (vote_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_roadmap_items_public_status
  ON public.roadmap_items (status, priority DESC, created_at DESC)
  WHERE public_visible = true;

COMMENT ON TABLE public.roadmap_items IS
  'Public roadmap entries (Step 11 / Trust moat). public_visible=false hides drafts; vote_count denormalised via trigger.';

-- ── 3. roadmap_item_votes ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.roadmap_item_votes (
  roadmap_item_id  uuid NOT NULL REFERENCES public.roadmap_items(id) ON DELETE CASCADE,
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voted_at         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (roadmap_item_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_roadmap_item_votes_user
  ON public.roadmap_item_votes (user_id);

COMMENT ON TABLE public.roadmap_item_votes IS
  'One-vote-per-(item, user) — composite PK enforces dedup at the DB level.';

-- ── 4. vote_count maintenance trigger ────────────────────────────────────

CREATE OR REPLACE FUNCTION public.refresh_roadmap_vote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.roadmap_items
       SET vote_count = vote_count + 1
     WHERE id = NEW.roadmap_item_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.roadmap_items
       SET vote_count = GREATEST(vote_count - 1, 0)
     WHERE id = OLD.roadmap_item_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_roadmap_votes_count ON public.roadmap_item_votes;
CREATE TRIGGER trg_roadmap_votes_count
  AFTER INSERT OR DELETE ON public.roadmap_item_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.refresh_roadmap_vote_count();

-- ── 5. RLS ───────────────────────────────────────────────────────────────

ALTER TABLE public.roadmap_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_item_votes  ENABLE ROW LEVEL SECURITY;

-- roadmap_items: public-visible rows readable by any authenticated user.
DROP POLICY IF EXISTS roadmap_items_select_public ON public.roadmap_items;
CREATE POLICY roadmap_items_select_public
  ON public.roadmap_items
  FOR SELECT
  TO authenticated
  USING (public_visible = true);

-- roadmap_items: admin (level >= 9) can SELECT everything (including drafts)
-- and INSERT / UPDATE / DELETE.
DROP POLICY IF EXISTS roadmap_items_admin_all ON public.roadmap_items;
CREATE POLICY roadmap_items_admin_all
  ON public.roadmap_items
  FOR ALL
  TO authenticated
  USING      (public.get_admin_level(auth.uid()) >= 9)
  WITH CHECK (public.get_admin_level(auth.uid()) >= 9);

-- roadmap_item_votes: any authenticated user can read all votes (for vote
-- counts) and insert/delete only their own.
DROP POLICY IF EXISTS roadmap_item_votes_select_all ON public.roadmap_item_votes;
CREATE POLICY roadmap_item_votes_select_all
  ON public.roadmap_item_votes
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS roadmap_item_votes_insert_self ON public.roadmap_item_votes;
CREATE POLICY roadmap_item_votes_insert_self
  ON public.roadmap_item_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS roadmap_item_votes_delete_self ON public.roadmap_item_votes;
CREATE POLICY roadmap_item_votes_delete_self
  ON public.roadmap_item_votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
