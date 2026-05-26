-- Step 10 (VN moat depth) — Vinglish-friendly Mercy mode toggle.
--
-- "Vinglish" is the everyday VN-EN code-switching that real Vietnamese
-- diaspora families use at home: "I want ăn cơm", "Chị go where?", etc.
-- Today Mercy treats those answers as wrong English. With this toggle on
-- (the default for beginner CEFR levels), Mercy detects the
-- code-switching and gently models the full English version instead of
-- penalising the answer.
--
-- Column semantics:
--   profiles.vinglish_friendly_mode = NULL → caller infers default from
--     the user's CEFR level (pre_a1/a1/a2 ⇒ true, b1+ ⇒ false). Keeping
--     NULL as the default lets the inferred default change as we tune
--     the threshold without backfilling every row.
--   true  → always-on regardless of CEFR.
--   false → always-off (advanced learners who want strict English).
--
-- The detection logic itself is in src/lib/feedback/vinglish-detector.ts
-- and runs on every turn whether the toggle is on or off — the toggle
-- only controls whether Mercy *responds* with the gentle modeling.
--
-- Reversibility:
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS vinglish_friendly_mode;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS vinglish_friendly_mode boolean;

COMMENT ON COLUMN public.profiles.vinglish_friendly_mode IS
  'User toggle for Vinglish-friendly Mercy responses. NULL = caller infers default from CEFR (pre_a1/a1/a2 default true). true/false override the default.';
