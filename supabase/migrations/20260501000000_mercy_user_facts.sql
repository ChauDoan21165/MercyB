-- Step 7 (AI Teacher v2) — episodic user-fact memory.
--
-- Cross-session, server-backed facts about a user that survive a single
-- conversation and a single device. Distinct from existing layers:
--
--   - src/lib/teacher-mercy/memorySchema.ts       → localStorage, device-local
--   - src/lib/teacher-mercy/teacherMemoryEngine   → recent turns, in-memory
--   - src/components/.../hooks/useMercyMemory.ts  → student-shaped lessons mem
--
-- This table is the long-term "what does Mercy know about me?" store. Facts
-- are immutable once written — to update, write a new row that supersedes
-- the old one (audit trail + reasoning chain). Decay is modeled as
-- confidence drift, not deletion.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.mercy_user_facts;

-- ── 1. Table ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mercy_user_facts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Categorisation. Keep this list intentionally tight; new types should
  -- be discussed (do not silently expand the heuristic extractor).
  --   preference  — likes, formatting choices, tone wishes
  --   goal        — outcome they want (IELTS 7.5, immigration, kids)
  --   context     — biographical / situational facts
  --   avoidance   — topics or styles they explicitly reject
  fact_type           text NOT NULL CHECK (
    fact_type IN ('preference', 'goal', 'context', 'avoidance')
  ),

  content             text NOT NULL CHECK (length(content) BETWEEN 1 AND 1000),

  -- Provenance for audit + future weighting decisions.
  source              text CHECK (
    source IN ('user_stated', 'inferred', 'admin_set')
  ),

  -- 0..1; 0.8 default for user_stated, lower for inferred. Decayed by the
  -- decayUnusedFacts client helper after the configured idle window.
  confidence          double precision NOT NULL DEFAULT 0.8
                       CHECK (confidence >= 0 AND confidence <= 1),

  created_at          timestamptz NOT NULL DEFAULT now(),
  last_referenced_at  timestamptz,

  -- Newer fact replaces this one. NULL = currently active. The
  -- "active facts" lookup filters on superseded_by IS NULL.
  superseded_by       uuid REFERENCES public.mercy_user_facts(id),

  -- Two facts of the same type with the same content for the same user
  -- are duplicates — block them at the DB level so heuristic extractors
  -- don't fan out the table.
  CONSTRAINT mercy_user_facts_uniq UNIQUE (user_id, fact_type, content)
);

-- Active-only lookup (the hot path): partial index on currently-true facts.
CREATE INDEX IF NOT EXISTS idx_mercy_facts_user_active
  ON public.mercy_user_facts (user_id, fact_type, confidence DESC)
  WHERE superseded_by IS NULL;

-- For "find the fact I just superseded" queries during write paths.
CREATE INDEX IF NOT EXISTS idx_mercy_facts_superseded
  ON public.mercy_user_facts (superseded_by)
  WHERE superseded_by IS NOT NULL;

COMMENT ON TABLE public.mercy_user_facts IS
  'Cross-session, server-backed user facts that feed Mercy''s long-term episodic memory.';
COMMENT ON COLUMN public.mercy_user_facts.superseded_by IS
  'When non-null, this fact has been replaced by the row referenced here. Reads should filter superseded_by IS NULL.';

-- ── 2. RLS — owner-only ───────────────────────────────────────────────────
ALTER TABLE public.mercy_user_facts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS mercy_user_facts_select_own ON public.mercy_user_facts;
CREATE POLICY mercy_user_facts_select_own
  ON public.mercy_user_facts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS mercy_user_facts_insert_own ON public.mercy_user_facts;
CREATE POLICY mercy_user_facts_insert_own
  ON public.mercy_user_facts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS mercy_user_facts_update_own ON public.mercy_user_facts;
CREATE POLICY mercy_user_facts_update_own
  ON public.mercy_user_facts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS mercy_user_facts_delete_own ON public.mercy_user_facts;
CREATE POLICY mercy_user_facts_delete_own
  ON public.mercy_user_facts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
