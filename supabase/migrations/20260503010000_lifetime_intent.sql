-- Step 9 (Monetization) — Lifetime tier as waitlist-first product validation.
--
-- This is INTENT capture, not a purchase flow. No Stripe product, no
-- charges, no fulfillment commitment. The table records that a user
-- said "I would buy a $199 lifetime if you offered it" so Chau can
-- decide whether to ship a real Lifetime SKU later.
--
-- Why a separate table (vs. extending profiles):
--   - Anonymous-first: user_id is nullable so we can take signal from
--     visitors who haven't authenticated. The fk uses ON DELETE SET NULL
--     so the row survives account deletion (the email + reason were
--     given freely; the link to the auth row is the only PII binding
--     we need to drop).
--   - Multiple submissions allowed: a user might come back with a
--     different reason or country. We don't dedupe at the DB level;
--     the most-recent row is the source of truth at read time.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.lifetime_intent_count();
--   DROP TABLE IF EXISTS public.lifetime_intent_signups;

-- ── 1. Table ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.lifetime_intent_signups (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email        text,
  country      text,
  reason_code  text CHECK (reason_code IN ('gift', 'commitment', 'savings', 'other') OR reason_code IS NULL),
  reason_text  text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lifetime_intent_signups_user_idx
  ON public.lifetime_intent_signups (user_id);
CREATE INDEX IF NOT EXISTS lifetime_intent_signups_created_idx
  ON public.lifetime_intent_signups (created_at DESC);

COMMENT ON TABLE public.lifetime_intent_signups IS
  'Pre-launch intent capture for the Lifetime tier. NOT a paid purchase record.';

-- ── 2. RLS ────────────────────────────────────────────────────────────────

ALTER TABLE public.lifetime_intent_signups ENABLE ROW LEVEL SECURITY;

-- Owner reads own row(s).
DROP POLICY IF EXISTS lifetime_intent_select_own ON public.lifetime_intent_signups;
CREATE POLICY lifetime_intent_select_own
  ON public.lifetime_intent_signups
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can record their own intent. Anonymous capture is
-- handled by the SECURITY DEFINER RPC below if/when it ships; this
-- policy keeps the direct-table path owner-only.
DROP POLICY IF EXISTS lifetime_intent_insert_own ON public.lifetime_intent_signups;
CREATE POLICY lifetime_intent_insert_own
  ON public.lifetime_intent_signups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admin read-all: gated by the existing get_admin_level helper that
-- other tables in this codebase use (level >= 9 = admin). Wrapped in
-- a DO block so the migration is no-op safe if the helper isn't yet
-- in this database.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'get_admin_level'
  ) THEN
    EXECUTE $sql$
      DROP POLICY IF EXISTS lifetime_intent_select_admin ON public.lifetime_intent_signups;
      CREATE POLICY lifetime_intent_select_admin
        ON public.lifetime_intent_signups
        FOR SELECT
        TO authenticated
        USING (public.get_admin_level() >= 9);
    $sql$;
  END IF;
END
$$;

-- ── 3. Public count RPC ───────────────────────────────────────────────────
-- The card displays "X người đã đăng ký" — we expose only the count,
-- never the rows. SECURITY DEFINER so any authenticated user can read
-- the count without RLS leaking row data.
CREATE OR REPLACE FUNCTION public.lifetime_intent_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.lifetime_intent_signups;
$$;

GRANT EXECUTE ON FUNCTION public.lifetime_intent_count() TO authenticated, anon;
