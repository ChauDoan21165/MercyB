-- Placement test schema
--
-- Adds five columns to profiles (latest-result snapshot) and a new
-- user_placements audit table (append-only history).
--
-- Called by:
--   - src/lib/placement/usePlacementPersistence.ts (client-side on finish)
--   - Kid branch of /placement/who (writes placement_method='self_report_kid')
--
-- Apply via Supabase SQL Editor; CLI drift per CLAUDE.md.

-- ── profiles: latest snapshot ────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS placement_cefr text
    CHECK (placement_cefr IN ('pre_a1','A1','A2','B1','B2','C1','C2')),
  ADD COLUMN IF NOT EXISTS placement_score numeric,
  ADD COLUMN IF NOT EXISTS placement_starting_room text,
  ADD COLUMN IF NOT EXISTS placement_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS placement_weaknesses jsonb
    DEFAULT '[]'::jsonb;

-- ── user_placements: append-only audit ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  placement_method text NOT NULL
    CHECK (placement_method IN ('test','self_report_kid')),
  cefr text NOT NULL
    CHECK (cefr IN ('pre_a1','A1','A2','B1','B2','C1','C2')),
  score numeric,
  recommended_room_id text NOT NULL,
  question_responses jsonb DEFAULT '[]'::jsonb,
  weakness_flags jsonb DEFAULT '[]'::jsonb,
  elapsed_ms integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_placements_user_id_created_at_idx
  ON public.user_placements (user_id, created_at DESC);

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.user_placements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_placements_own_select ON public.user_placements;
CREATE POLICY user_placements_own_select
  ON public.user_placements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_placements_own_insert ON public.user_placements;
CREATE POLICY user_placements_own_insert
  ON public.user_placements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE or DELETE policies — audit rows are immutable from the client.
-- Admins / edge functions with service_role bypass RLS if they need to touch.

GRANT SELECT, INSERT ON public.user_placements TO authenticated;
