-- Vocabulary + Pronunciation SRS — base data layer.
--
-- WHY THIS EXISTS
-- ────────────────────────────────────────────────────────────────────────
-- Two parallel SRS (spaced-repetition system) trackers, one per skill:
--   - public.vocabulary_srs_items     — classic SM-2, per (user, vocab).
--   - public.pronunciation_srs_items  — quality-multiplier SM-2 variant,
--                                       per (user, phrase). Optional FK
--                                       to vocabulary_srs_items so a
--                                       phrase drilling a single vocab
--                                       word stays linked to its vocab
--                                       SRS row.
--
-- This migration creates the storage. Update primitives live in the
-- companion RPC file (20260612_pronunciation_srs_rpcs.sql) so schema and
-- behavior can review independently.
--
-- WHAT'S OUT OF SCOPE HERE
--   - No RPCs. No triggers. No backfill.
--   - No frontend. No certificate-coupling logic.
--   - Existing user_vocabulary table is untouched — we relate to it via FK,
--     we do not migrate or rename its columns.
--
-- IDEMPOTENT
--   All CREATE TABLE / CREATE INDEX use IF NOT EXISTS; policies use
--   DROP POLICY IF EXISTS … ; CREATE POLICY pattern; feature_flags insert
--   uses ON CONFLICT DO NOTHING. Re-running this migration is a no-op.
--
-- ────────────────────────────────────────────────────────────────────────


-- ── 1. vocabulary_srs_items ────────────────────────────────────────────
-- Classic SuperMemo SM-2. One row per (user_id, vocab_id). Created on
-- first review for that word.

CREATE TABLE IF NOT EXISTS public.vocabulary_srs_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocab_id          uuid NOT NULL REFERENCES public.user_vocabulary(id) ON DELETE CASCADE,
  ease_factor       numeric NOT NULL DEFAULT 2.5  CHECK (ease_factor >= 1.3),
  interval_days     integer NOT NULL DEFAULT 1    CHECK (interval_days >= 1),
  repetitions       integer NOT NULL DEFAULT 0    CHECK (repetitions  >= 0),
  next_review_at    timestamptz NOT NULL DEFAULT now(),
  last_reviewed_at  timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, vocab_id)
);

CREATE INDEX IF NOT EXISTS idx_vocab_srs_user_due
  ON public.vocabulary_srs_items (user_id, next_review_at);

CREATE INDEX IF NOT EXISTS idx_vocab_srs_vocab_id
  ON public.vocabulary_srs_items (vocab_id);

COMMENT ON TABLE public.vocabulary_srs_items IS
  'Spaced-repetition state per (user, vocab). One row created on first review. Standard SM-2 — see record_vocabulary_review() RPC for the update math. A word is considered MASTERED for certificate purposes when interval_days >= 21 AND repetitions >= 4 (LOCKED CONTRACT — coordinate before changing).';

ALTER TABLE public.vocabulary_srs_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own vocab SRS" ON public.vocabulary_srs_items;
CREATE POLICY "Users read own vocab SRS"
  ON public.vocabulary_srs_items
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users write own vocab SRS" ON public.vocabulary_srs_items;
CREATE POLICY "Users write own vocab SRS"
  ON public.vocabulary_srs_items
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own vocab SRS" ON public.vocabulary_srs_items;
CREATE POLICY "Users update own vocab SRS"
  ON public.vocabulary_srs_items
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users delete own vocab SRS" ON public.vocabulary_srs_items;
CREATE POLICY "Users delete own vocab SRS"
  ON public.vocabulary_srs_items
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());


-- ── 2. pronunciation_srs_items ─────────────────────────────────────────
-- Quality-multiplier SM-2 variant. One row per (user_id, target_phrase).
-- pronunciation_score is the per-attempt overall in [0,1] from the
-- speech-scoring pipeline; the update math applies a tier-based
-- multiplier to interval growth (see interval_days COMMENT). Optional
-- vocab_srs_id ties this row back to a vocabulary_srs_items row when
-- the phrase is a single vocab word.

CREATE TABLE IF NOT EXISTS public.pronunciation_srs_items (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Optional link back to the vocab SRS item this pronunciation belongs to.
  -- NULL when the target phrase isn't a single vocab word (e.g. a sentence drill).
  -- ON DELETE CASCADE: a phrase tied to a vocab is meaningless once that vocab is gone.
  vocab_srs_id         uuid REFERENCES public.vocabulary_srs_items(id) ON DELETE CASCADE,
  target_phrase        text NOT NULL,
  target_phonemes      text NOT NULL DEFAULT '',
  ease_factor          numeric NOT NULL DEFAULT 2.5  CHECK (ease_factor >= 1.3),
  interval_days        integer NOT NULL DEFAULT 1    CHECK (interval_days >= 1),
  repetitions          integer NOT NULL DEFAULT 0    CHECK (repetitions  >= 0),
  -- Per-attempt overall score in [0,1]. Renamed from "confidence" to avoid
  -- collision with the per-phoneme "confidence" inside phoneme_scores[].
  pronunciation_score  numeric NOT NULL DEFAULT 0    CHECK (pronunciation_score BETWEEN 0 AND 1),
  phoneme_scores       jsonb   NOT NULL DEFAULT '[]'::jsonb,
  last_overall_score   numeric,
  next_review_at       timestamptz NOT NULL DEFAULT now(),
  last_reviewed_at     timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_phrase)
);

CREATE INDEX IF NOT EXISTS idx_pron_srs_user_due
  ON public.pronunciation_srs_items (user_id, next_review_at);

CREATE INDEX IF NOT EXISTS idx_pron_srs_vocab_srs_id
  ON public.pronunciation_srs_items (vocab_srs_id)
  WHERE vocab_srs_id IS NOT NULL;

COMMENT ON TABLE public.pronunciation_srs_items IS
  'Spaced-repetition state per (user, target_phrase). Quality-multiplier SM-2 variant — see record_pronunciation_attempt() RPC. Optional FK vocab_srs_id links a pronunciation drill to its underlying vocab SRS row when applicable. A phrase is MASTERED for certificate purposes when interval_days >= 21 AND repetitions >= 4 AND pronunciation_score >= 0.8 (LOCKED CONTRACT — coordinate before changing).';

-- ── LOCKED CONTRACTS ────────────────────────────────────────────────────
-- The COMMENTs below are normative. Any agent/PR that diverges from
-- these formulas/shapes MUST update the comments and surface a review
-- request. They are duplicated in the RPC file; the canonical copy
-- lives here.

COMMENT ON COLUMN public.pronunciation_srs_items.pronunciation_score IS
  'LOCKED CONTRACT — pronunciation_score (per-attempt overall).
   Range: [0, 1]. Sourced from the speech-scoring pipeline overall score, normalized to [0,1].
   Reset floor:    score < 0.4 → repetitions := 0, interval_days := 1, ease_factor := max(1.3, ease - 0.20).
   Mastery floor:  pronunciation_score >= 0.8 sustained for cert trigger.
   Distinct from per-element confidence inside phoneme_scores[]: this is the row-level outcome; that one is the scoring-pipeline''s self-reported certainty per phoneme.
   DO NOT change these thresholds without updating record_pronunciation_attempt() and any cert eligibility queries in lockstep.';

COMMENT ON COLUMN public.pronunciation_srs_items.interval_days IS
  'LOCKED CONTRACT — pronunciation interval math (quality-multiplier SM-2).
   Let s   = clamp(pronunciation_score, 0, 1).
   Let f   = ease_factor, i_old = interval_days, r_old = repetitions.
   Let c_avg = mean of phoneme_scores[].confidence over elements with confidence >= 0  (NULL/missing → 0).

   STEP A — scoring confidence floor:
     If c_avg < 0.6 → SKIP THE MODIFIER (minimal progression):
       interval_days, ease_factor, repetitions, pronunciation_score all UNCHANGED.
       last_reviewed_at := now().
       phoneme_scores updated to the new attempt''s payload.
       next_review_at := now() + (GREATEST(1, ROUND(interval_days * 0.5)) * interval ''1 day'')
                        — half-step forward so a string of low-confidence readings doesn''t fully stall the schedule.
     Else proceed to STEP B.

   STEP B — multiplier:
     If s < 0.4   (reset):
       r_new := 0
       i_new := 1
       f_new := max(1.3, f - 0.20)
     Elif 0.4 <= s < 0.7:
       multiplier := 0.5 + s * 0.5            -- range [0.70, 0.85)
       r_new := r_old + 1
       f_new := GREATEST(1.3, f)               -- ease unchanged in mid band, floor enforced
       i_new := LEAST(365, GREATEST(1, ROUND(i_old * f_new * multiplier)::int))
     Else  (s >= 0.7):
       multiplier := 0.85 + s * 0.15           -- range [0.955, 1.00]
       r_new := r_old + 1
       f_new := GREATEST(1.3, LEAST(3.0, f + 0.05 * (s - 0.7) / 0.3))   -- gentle ease lift, clamped
       i_new := LEAST(365, GREATEST(1, ROUND(i_old * f_new * multiplier)::int))

   GLOBAL CLAMPS (applied wherever interval_days / ease_factor are written):
     interval_days := LEAST(365, GREATEST(1, …))   -- never above one year, never below one day
     ease_factor   := GREATEST(1.3, …)              -- never below 1.3 (matches the table CHECK)

   Then: next_review_at := now() + (i_new * interval ''1 day''),
         last_reviewed_at := now(),
         interval_days := i_new, repetitions := r_new, ease_factor := f_new,
         pronunciation_score := s.

   Rationale: multiplier dampens interval growth as score weakens; sub-floor scoring confidence keeps the row "neutral" so noisy mic readings don''t corrupt the schedule.
   DO NOT change without coordinating with record_pronunciation_attempt() and any cert-progression queries that read interval_days.';

COMMENT ON COLUMN public.pronunciation_srs_items.phoneme_scores IS
  'LOCKED CONTRACT — phoneme_scores JSON shape.
   Direct top-level ARRAY of PhonemeScore (not a wrapping object):
     [
       {
         "phoneme":    "<IPA or X-SAMPA>",   -- what the user said (recognizer output)
         "score":      <0..1>,                -- match quality vs expected
         "expected":   "<IPA or X-SAMPA>",    -- the target this position should be
         "got":        "<IPA or X-SAMPA>",    -- duplicate of phoneme for clarity (legacy field)
         "position":   <integer>,             -- 0-based index in the utterance
         "confidence": <0..1>                 -- recognizer''s own certainty in this phoneme
       },
       …
     ]
   - Array order matches utterance order; "position" is the canonical index.
   - "score" is normalized [0,1]; convert from provider-specific scales at the edge.
   - "confidence" feeds the scoring-confidence floor in interval math (see interval_days COMMENT). Mean confidence < 0.6 → modifier skipped.
   - Per-element schema is fixed: exactly the six keys above. Unknown extra keys are tolerated by readers but discouraged.
   - Per-attempt metadata (scored_at, provider, context) is NOT carried inside this column — it lives in sibling columns / metadata where appropriate.
   - Default value is the empty array []::jsonb, NEVER {}.
   DO NOT change the per-element keys without bumping a "schema_version" sibling column.';

ALTER TABLE public.pronunciation_srs_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own pronunciation SRS" ON public.pronunciation_srs_items;
CREATE POLICY "Users read own pronunciation SRS"
  ON public.pronunciation_srs_items
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users write own pronunciation SRS" ON public.pronunciation_srs_items;
CREATE POLICY "Users write own pronunciation SRS"
  ON public.pronunciation_srs_items
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own pronunciation SRS" ON public.pronunciation_srs_items;
CREATE POLICY "Users update own pronunciation SRS"
  ON public.pronunciation_srs_items
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users delete own pronunciation SRS" ON public.pronunciation_srs_items;
CREATE POLICY "Users delete own pronunciation SRS"
  ON public.pronunciation_srs_items
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());


-- ── 3. feature flag (rollout off) ──────────────────────────────────────

INSERT INTO public.feature_flags (flag_key, is_enabled, description) VALUES
  ('pronunciation_srs_enabled', false, 'Enables the pronunciation SRS pipeline (item creation, due-queue surfacing, attempt recording). Default OFF for staged rollout. Vocab SRS does not have a separate flag — it activates with whichever vocab review surface gates it.')
ON CONFLICT (flag_key) DO NOTHING;
