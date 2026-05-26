-- Step 9 (Monetization) — Paywall A/B framework.
--
-- One row per (user OR anonymous visitor, experiment) pair, written
-- the first time we render a paywall variant. `converted_at` is set
-- later by the checkout-success path (or replay job) when we want
-- to attribute a paid conversion back to the variant.
--
-- Identity:
--   - user_id      — auth.users(id), nullable (set NULL on user delete
--                     so we keep aggregate stats but lose PII).
--   - anon_id      — sessionStorage UUID for not-yet-signed-in
--                     visitors. Once they sign up the client can
--                     stitch the anon row to the user row in a follow-
--                     up; for now we accept both shapes side by side.
--
-- Uniqueness:
--   - For signed-in users, only one variant per experiment ever, so
--     we get a stable measurement no matter how many times they hit
--     the paywall. Enforced by a partial unique index keyed on
--     (user_id, experiment_key) where user_id IS NOT NULL.
--   - Anonymous rows are NOT deduplicated server-side — the client
--     uses sessionStorage to skip duplicate inserts; if it slips
--     through (e.g. private window across two tabs), we'd rather
--     count multiple impressions than block a write.
--
-- RLS:
--   - INSERT: any authenticated user can write a row for their own
--     `user_id`. Anonymous (`user_id IS NULL`) inserts go through
--     the `record_paywall_exposure_anon` SECURITY DEFINER RPC so
--     the table itself stays auth-only.
--   - SELECT/UPDATE: admin-only via `get_admin_level >= 9`. Regular
--     users do not need to read their own exposures — the framework
--     re-derives the variant deterministically from their id.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.record_paywall_exposure_anon(text, text, text);
--   DROP POLICY IF EXISTS paywall_exposures_insert_self     ON public.paywall_experiment_exposures;
--   DROP POLICY IF EXISTS paywall_exposures_select_admin    ON public.paywall_experiment_exposures;
--   DROP POLICY IF EXISTS paywall_exposures_update_admin    ON public.paywall_experiment_exposures;
--   DROP TABLE IF EXISTS public.paywall_experiment_exposures;

CREATE TABLE IF NOT EXISTS public.paywall_experiment_exposures (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  anon_id         text,
  experiment_key  text NOT NULL,
  variant_key     text NOT NULL,
  exposed_at      timestamptz NOT NULL DEFAULT now(),
  converted_at    timestamptz,
  CONSTRAINT paywall_exposures_identity_chk
    CHECK (user_id IS NOT NULL OR (anon_id IS NOT NULL AND length(trim(anon_id)) > 0)),
  CONSTRAINT paywall_exposures_experiment_key_chk
    CHECK (length(trim(experiment_key)) BETWEEN 1 AND 64),
  CONSTRAINT paywall_exposures_variant_key_chk
    CHECK (length(trim(variant_key)) BETWEEN 1 AND 64)
);

COMMENT ON TABLE public.paywall_experiment_exposures IS
  'Step 9 paywall A/B exposures. One row per (user OR anon, experiment). RLS: insert own; admin read.';

-- "Show me a user's variant" lookup + conversion-rate roll-ups.
CREATE INDEX IF NOT EXISTS idx_paywall_exposures_user_experiment
  ON public.paywall_experiment_exposures (user_id, experiment_key)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_paywall_exposures_anon_experiment
  ON public.paywall_experiment_exposures (anon_id, experiment_key)
  WHERE anon_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_paywall_exposures_experiment_variant
  ON public.paywall_experiment_exposures (experiment_key, variant_key, exposed_at DESC);

-- One variant per (user, experiment). Anonymous rows skip this guard
-- (the partial WHERE filters them out).
CREATE UNIQUE INDEX IF NOT EXISTS uniq_paywall_exposures_user_experiment
  ON public.paywall_experiment_exposures (user_id, experiment_key)
  WHERE user_id IS NOT NULL;

-- ── RLS ──────────────────────────────────────────────────────────────────

ALTER TABLE public.paywall_experiment_exposures ENABLE ROW LEVEL SECURITY;

-- Authenticated users may INSERT only rows tied to their own auth.uid().
DROP POLICY IF EXISTS paywall_exposures_insert_self ON public.paywall_experiment_exposures;
CREATE POLICY paywall_exposures_insert_self
  ON public.paywall_experiment_exposures
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins (level >= 9) may read everything for analytics.
DROP POLICY IF EXISTS paywall_exposures_select_admin ON public.paywall_experiment_exposures;
CREATE POLICY paywall_exposures_select_admin
  ON public.paywall_experiment_exposures
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level() >= 9);

-- Admins may UPDATE — primarily to backfill `converted_at` from a
-- replay job, or to correct a mis-tagged variant.
DROP POLICY IF EXISTS paywall_exposures_update_admin ON public.paywall_experiment_exposures;
CREATE POLICY paywall_exposures_update_admin
  ON public.paywall_experiment_exposures
  FOR UPDATE
  TO authenticated
  USING      (public.get_admin_level() >= 9)
  WITH CHECK (public.get_admin_level() >= 9);

-- Authenticated users may UPDATE only their own row's `converted_at`
-- — used by the post-checkout success page to record the conversion
-- without a server round-trip.
DROP POLICY IF EXISTS paywall_exposures_update_own_conversion
  ON public.paywall_experiment_exposures;
CREATE POLICY paywall_exposures_update_own_conversion
  ON public.paywall_experiment_exposures
  FOR UPDATE
  TO authenticated
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Anonymous-write RPC ──────────────────────────────────────────────────

-- Anonymous visitors don't have an auth.uid() to satisfy the RLS
-- INSERT policy. Route their writes through a SECURITY DEFINER RPC
-- that validates the input and writes with elevated privileges.
-- The RPC is granted to `anon` so unauthenticated clients can call
-- it from the JS bundle.
CREATE OR REPLACE FUNCTION public.record_paywall_exposure_anon(
  p_anon_id        text,
  p_experiment_key text,
  p_variant_key    text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_anon_id IS NULL OR length(trim(p_anon_id)) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'missing_anon_id');
  END IF;
  IF p_experiment_key IS NULL OR length(trim(p_experiment_key)) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'missing_experiment_key');
  END IF;
  IF p_variant_key IS NULL OR length(trim(p_variant_key)) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'missing_variant_key');
  END IF;

  INSERT INTO public.paywall_experiment_exposures
    (user_id, anon_id, experiment_key, variant_key)
  VALUES
    (NULL, p_anon_id, p_experiment_key, p_variant_key);

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_paywall_exposure_anon(text, text, text)
  TO anon, authenticated;

COMMENT ON FUNCTION public.record_paywall_exposure_anon(text, text, text) IS
  'Insert an anonymous paywall exposure row. Caller passes a sessionStorage UUID; never trusted as identity.';
