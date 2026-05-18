-- Vocabulary + Pronunciation SRS — update RPCs.
--
-- Companion to 20260612_pronunciation_srs.sql. Apply that migration first
-- (creates the two tables + indexes + RLS + feature flag).
--
-- All RPCs are SECURITY DEFINER + idempotent (CREATE OR REPLACE) and
-- self-check that the caller can act on the target user_id. RLS on the
-- underlying tables is the second line of defense.
--
-- LOCKED CONTRACTS — duplicated from the migration's COMMENTs:
--   - Pronunciation interval math: quality-multiplier SM-2 variant. See
--     pronunciation_srs_items.interval_days COMMENT for the canonical
--     formula; record_pronunciation_attempt below implements it.
--   - Reset floor: pronunciation_score < 0.4 → reset (reps=0, interval=1).
--   - Mastery floor: pronunciation_score >= 0.8 sustained → cert eligible.
--   - Scoring confidence floor: mean(phoneme_scores[].confidence) < 0.6
--     → SKIP modifier (minimal progression). interval_days / ease_factor /
--       repetitions / pronunciation_score unchanged; last_reviewed_at and
--       phoneme_scores update; next_review_at advances by 0.5x interval.
--   - GLOBAL CLAMPS: interval_days := LEAST(365, GREATEST(1, …)),
--                    ease_factor   := GREATEST(1.3, …).
--   - phoneme_scores JSON shape: top-level ARRAY of
--     { phoneme, score, expected, got, position, confidence }.
--     Empty default []::jsonb, never {}::jsonb.


-- ── 1. record_vocabulary_review ─────────────────────────────────────────
-- Classic SM-2. Quality is the conventional 0–5 grade:
--   0 = total blackout, 1 = wrong but familiar, 2 = wrong but easy after,
--   3 = correct with difficulty, 4 = correct with hesitation, 5 = perfect.
-- The frontend can map a binary "got it right / didn't" to {2, 4} or
-- expose the full scale; either is fine.

CREATE OR REPLACE FUNCTION public.record_vocabulary_review(
  p_user_id  uuid,
  p_vocab_id uuid,
  p_quality  integer
)
RETURNS public.vocabulary_srs_items
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.vocabulary_srs_items;
  v_q   integer := GREATEST(0, LEAST(5, p_quality));
  v_e   numeric;
  v_i   integer;
  v_r   integer;
BEGIN
  -- Caller must be the user OR admin.
  IF auth.uid() <> p_user_id AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  -- Load existing or initialize defaults.
  SELECT * INTO v_row
  FROM public.vocabulary_srs_items
  WHERE user_id = p_user_id AND vocab_id = p_vocab_id;

  IF NOT FOUND THEN
    v_row.ease_factor   := 2.5;
    v_row.interval_days := 1;
    v_row.repetitions   := 0;
  END IF;

  -- SM-2 update.
  IF v_q < 3 THEN
    -- Lapse: reset repetitions, drop interval.
    v_r := 0;
    v_i := 1;
    v_e := GREATEST(1.3, v_row.ease_factor - 0.20);
  ELSE
    v_r := v_row.repetitions + 1;
    v_e := GREATEST(
             1.3,
             v_row.ease_factor + (0.1 - (5 - v_q) * (0.08 + (5 - v_q) * 0.02))
           );
    v_i := CASE v_r
             WHEN 1 THEN 1
             WHEN 2 THEN 6
             ELSE GREATEST(1, ROUND(v_row.interval_days * v_e)::int)
           END;
  END IF;

  -- Upsert.
  INSERT INTO public.vocabulary_srs_items
    (user_id, vocab_id, ease_factor, interval_days, repetitions,
     next_review_at, last_reviewed_at, updated_at)
  VALUES
    (p_user_id, p_vocab_id, v_e, v_i, v_r,
     now() + (v_i || ' days')::interval, now(), now())
  ON CONFLICT (user_id, vocab_id) DO UPDATE SET
    ease_factor      = EXCLUDED.ease_factor,
    interval_days    = EXCLUDED.interval_days,
    repetitions      = EXCLUDED.repetitions,
    next_review_at   = EXCLUDED.next_review_at,
    last_reviewed_at = EXCLUDED.last_reviewed_at,
    updated_at       = EXCLUDED.updated_at
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.record_vocabulary_review(uuid, uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_vocabulary_review(uuid, uuid, integer) FROM anon;
GRANT  EXECUTE ON FUNCTION public.record_vocabulary_review(uuid, uuid, integer) TO authenticated;
GRANT  EXECUTE ON FUNCTION public.record_vocabulary_review(uuid, uuid, integer) TO service_role;

COMMENT ON FUNCTION public.record_vocabulary_review(uuid, uuid, integer) IS
  'Apply one SM-2 review to (user_id, vocab_id) and return the upserted row. Caller must be the user or admin. Quality clamped to [0,5]; <3 is a lapse.';


-- ── 2. record_pronunciation_attempt ─────────────────────────────────────
-- LOCKED CONTRACT — quality-multiplier SM-2:
--   c_avg < 0.6 → SKIP modifier; ease/interval/reps/score unchanged;
--                 only last_reviewed_at + phoneme_scores update.
--   else:
--     s < 0.4   → r:=0, i:=1, f := max(1.3, f - 0.20)
--     0.4..0.7  → mult := 0.5 + s*0.5;     i := round(i_old * f * mult); r:=r+1
--     >= 0.7    → mult := 0.85 + s*0.15;   i := round(i_old * f' * mult); r:=r+1
--                 with f' = min(3.0, f + 0.05*(s-0.7)/0.3)
-- See pronunciation_srs_items.interval_days COMMENT for the canonical formula.

CREATE OR REPLACE FUNCTION public.record_pronunciation_attempt(
  p_user_id              uuid,
  p_target_phrase        text,
  p_target_phonemes      text,
  p_pronunciation_score  numeric,
  p_phoneme_scores       jsonb,
  p_overall_score        numeric DEFAULT NULL,
  p_vocab_srs_id         uuid    DEFAULT NULL
)
RETURNS public.pronunciation_srs_items
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row   public.pronunciation_srs_items;
  v_s     numeric;
  v_e     numeric;
  v_e_old numeric;
  v_i     integer;
  v_r     integer;
  v_mult  numeric;
  v_c_avg numeric;
  v_ps    jsonb := COALESCE(p_phoneme_scores, '[]'::jsonb);
  v_skip  boolean := false;
BEGIN
  IF auth.uid() <> p_user_id AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  IF p_target_phrase IS NULL OR length(trim(p_target_phrase)) = 0 THEN
    RAISE EXCEPTION 'target_phrase required' USING ERRCODE = '22023';
  END IF;

  v_s := GREATEST(0, LEAST(1, COALESCE(p_pronunciation_score, 0)));

  -- Mean of per-element confidence; treats missing/NULL as 0.
  -- If the array is empty, c_avg = 0 → skip modifier.
  SELECT COALESCE(AVG(GREATEST(0, LEAST(1, (elem->>'confidence')::numeric))), 0)
    INTO v_c_avg
  FROM jsonb_array_elements(CASE jsonb_typeof(v_ps)
                              WHEN 'array' THEN v_ps
                              ELSE '[]'::jsonb
                            END) AS elem
  WHERE elem ? 'confidence';

  v_skip := (v_c_avg < 0.6);

  SELECT * INTO v_row
  FROM public.pronunciation_srs_items
  WHERE user_id = p_user_id AND target_phrase = p_target_phrase;

  IF NOT FOUND THEN
    v_row.ease_factor          := 2.5;
    v_row.interval_days        := 1;
    v_row.repetitions          := 0;
    v_row.pronunciation_score  := 0;
  END IF;

  v_e_old := v_row.ease_factor;

  IF v_skip THEN
    -- Scoring confidence too low — preserve all SRS state values; record
    -- the attempt and advance the next-review timer by half the current
    -- interval so a string of noisy readings doesn't fully stall.
    v_e := GREATEST(1.3, v_row.ease_factor);
    v_i := v_row.interval_days;                       -- column value unchanged
    v_r := v_row.repetitions;
    v_s := v_row.pronunciation_score;                 -- stored score unchanged
  ELSIF v_s < 0.4 THEN
    -- Reset.
    v_r := 0;
    v_i := 1;
    v_e := GREATEST(1.3, v_e_old - 0.20);
  ELSIF v_s < 0.7 THEN
    -- Mid band — multiplier 0.70..0.85, ease unchanged.
    v_mult := 0.5 + v_s * 0.5;
    v_r    := v_row.repetitions + 1;
    v_e    := GREATEST(1.3, v_e_old);
    v_i    := LEAST(365, GREATEST(1, ROUND(v_row.interval_days * v_e * v_mult)::int));
  ELSE
    -- Strong score — multiplier 0.955..1.00, gentle ease lift, clamped.
    v_mult := 0.85 + v_s * 0.15;
    v_r    := v_row.repetitions + 1;
    v_e    := GREATEST(1.3, LEAST(3.0, v_e_old + 0.05 * (v_s - 0.7) / 0.3));
    v_i    := LEAST(365, GREATEST(1, ROUND(v_row.interval_days * v_e * v_mult)::int));
  END IF;

  INSERT INTO public.pronunciation_srs_items
    (user_id, vocab_srs_id, target_phrase, target_phonemes,
     ease_factor, interval_days, repetitions, pronunciation_score,
     phoneme_scores, last_overall_score,
     next_review_at, last_reviewed_at, updated_at)
  VALUES
    (p_user_id, p_vocab_srs_id, p_target_phrase, COALESCE(p_target_phonemes, ''),
     v_e, v_i, v_r, v_s,
     v_ps, p_overall_score,
     CASE WHEN v_skip
          THEN now() + (LEAST(365, GREATEST(1, ROUND(v_i * 0.5)::int)) || ' days')::interval  -- 0.5x current interval, clamped
          ELSE now() + (v_i || ' days')::interval
     END,
     now(), now())
  ON CONFLICT (user_id, target_phrase) DO UPDATE SET
    -- vocab_srs_id is set on first insert; later attempts don't overwrite a non-null link with NULL.
    vocab_srs_id        = COALESCE(EXCLUDED.vocab_srs_id, public.pronunciation_srs_items.vocab_srs_id),
    target_phonemes     = EXCLUDED.target_phonemes,
    ease_factor         = EXCLUDED.ease_factor,
    interval_days       = EXCLUDED.interval_days,
    repetitions         = EXCLUDED.repetitions,
    pronunciation_score = EXCLUDED.pronunciation_score,
    phoneme_scores      = EXCLUDED.phoneme_scores,
    last_overall_score  = EXCLUDED.last_overall_score,
    next_review_at      = EXCLUDED.next_review_at,
    last_reviewed_at    = EXCLUDED.last_reviewed_at,
    updated_at          = EXCLUDED.updated_at
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.record_pronunciation_attempt(uuid, text, text, numeric, jsonb, numeric, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_pronunciation_attempt(uuid, text, text, numeric, jsonb, numeric, uuid) FROM anon;
GRANT  EXECUTE ON FUNCTION public.record_pronunciation_attempt(uuid, text, text, numeric, jsonb, numeric, uuid) TO authenticated;
GRANT  EXECUTE ON FUNCTION public.record_pronunciation_attempt(uuid, text, text, numeric, jsonb, numeric, uuid) TO service_role;

COMMENT ON FUNCTION public.record_pronunciation_attempt(uuid, text, text, numeric, jsonb, numeric, uuid) IS
  'Apply one quality-multiplier SM-2 review to (user_id, target_phrase) and return the upserted row. Caller must be the user or admin. Pronunciation score clamped to [0,1]; <0.4 is a reset. If mean phoneme_scores[].confidence < 0.6, the modifier is skipped: ease_factor / interval_days / repetitions / pronunciation_score are preserved; last_reviewed_at and phoneme_scores update; next_review_at advances by 0.5x the current interval (clamped to [1, 365] days). Optional p_vocab_srs_id links this row to a vocabulary_srs_items row on first insert. See pronunciation_srs_items.interval_days COMMENT for the canonical formula.';
