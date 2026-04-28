-- Subscription tracking — sync from public.subscriptions → public.user_subscriptions.
--
-- ROOT CAUSE
-- ───────────────────────────────────────────────────────────────────────
-- See reports/subscription-tracking-investigation-2026-04-27.md.
--
-- The Stripe webhook writes to public.subscriptions (unified billing,
-- 2026-03 schema). Admin queries / cohort filters / matchmaking joins
-- read from public.user_subscriptions (legacy 2025-10 schema). NO sync
-- layer between them. Paying users are correctly entitled at runtime
-- (`me-entitlement` reads `subscriptions`) but appear as free-tier in
-- every admin surface (which reads `user_subscriptions`).
--
-- WHAT THIS MIGRATION INSTALLS
--   1. Seeds public.app_tier_ranks with the canonical product_key →
--      tier_id → vip_rank mapping. Production currently has 0 rows;
--      the trigger reads this table for the mapping and falls back to
--      a hardcoded Free-tier default if a product_id misses.
--   2. Trigger on public.subscriptions (AFTER INSERT OR UPDATE OF the
--      relevant columns) that mirrors writes into
--      public.user_subscriptions AND updates profiles.vip_rank.
--   3. Recovery RPC `retry_subscription_creation` for admin-initiated
--      backfill of a single user.
--   4. One-shot backfill INSERT-from-subscriptions, idempotent via
--      ON CONFLICT (user_id) DO UPDATE.
--
-- THIS MIGRATION DOES NOT
--   - Delete the 3 known orphan rows in public.user_subscriptions
--     (5b0e03c8…, 42a24883…, fbbbd84d…). Those user_ids have no
--     matching row in public.subscriptions and are likely test or
--     pre-FK orphan rows. Cleanup is a separate decision.
--   - Migrate readers from user_subscriptions to subscriptions
--     (Direction A in the investigation report). That is a follow-up.
--
-- IDEMPOTENCY
-- ───────────────────────────────────────────────────────────────────────
-- Every step is safe to re-run:
--   - app_tier_ranks seed: ON CONFLICT (product_key) DO UPDATE
--   - Backfill: ON CONFLICT (user_id) DO UPDATE (matches the existing
--     UNIQUE constraint on user_subscriptions.user_id)
--   - Trigger: CREATE OR REPLACE FUNCTION + DROP TRIGGER IF EXISTS
--
-- REVERSIBILITY
-- ───────────────────────────────────────────────────────────────────────
--   DROP TRIGGER IF EXISTS trg_sync_subscriptions_to_legacy
--     ON public.subscriptions;
--   DROP FUNCTION IF EXISTS public.sync_subscription_to_legacy();
--   DROP FUNCTION IF EXISTS public.retry_subscription_creation(uuid, text);
--   -- app_tier_ranks rows + user_subscriptions backfill rows can stay;
--   -- they're just data, not structural.

-- ── 1. Seed app_tier_ranks with the canonical mapping ────────────────────
--
-- Production has 0 rows. We seed all 4 known tiers so the trigger has
-- a deterministic source of truth. Today only ONE Stripe product is
-- live (prod_UAfnlqhxFFLDE0 → One Month); rows for One Year + Legacy
-- VIP 3 are seeded with their canonical tier_ids but NULL-equivalent
-- product_keys derived from the tier name so the lookup table is
-- complete for future Stripe products.
--
-- product_key values for tiers without a Stripe product yet are
-- prefixed with `pending_` so a future Stripe webhook with the real
-- product id won't collide on the unique key.

INSERT INTO public.app_tier_ranks (product_key, tier_id, vip_rank) VALUES
  -- Free tier — the absence of a Stripe subscription resolves to this.
  ('free',                       'e50f166d-c3dd-41b8-bdb4-c0a8ca58b35d', 1),
  -- LIVE: 7 active subscribers @ 200,000 VND/month per finding #3.
  ('prod_UAfnlqhxFFLDE0',        '3d5a977c-4fde-4afc-99a4-4b37c3555839', 2),
  -- Pending: no Stripe product wired yet; placeholder key so the row
  -- exists and a future migration can rewrite product_key when the
  -- yearly Stripe product ships.
  ('pending_one_year',           'a2863250-1798-443e-b1d3-d20e3db06281', 3),
  -- Legacy VIP 3 — pre-Stripe internal tier. Not a Stripe product;
  -- placeholder retained so the table is complete and any historical
  -- code path referencing the tier resolves vip_rank correctly.
  ('legacy_vip3',                'abc81cdf-da87-4912-a294-277449745c10', 4)
ON CONFLICT (product_key) DO UPDATE
  SET tier_id  = EXCLUDED.tier_id,
      vip_rank = EXCLUDED.vip_rank;


-- ── 2. Sync trigger function ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.sync_subscription_to_legacy()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier_id        uuid;
  v_vip_rank       integer;
  v_legacy_status  text;
BEGIN
  -- Only mirror Stripe rows; Apple/Google webhooks have their own
  -- (currently unused for tier mapping; revisit when those ship).
  IF NEW.provider <> 'stripe' THEN
    RETURN NEW;
  END IF;

  -- Resolve tier_id + vip_rank from app_tier_ranks. Falls back to the
  -- Free row when the Stripe product_id isn't mapped yet — failing
  -- closed (Free) is safer than failing open (Level 3).
  SELECT tier_id, vip_rank
    INTO v_tier_id, v_vip_rank
  FROM public.app_tier_ranks
  WHERE product_key = COALESCE(NEW.product_id, 'free')
  LIMIT 1;

  IF v_tier_id IS NULL THEN
    SELECT tier_id, vip_rank
      INTO v_tier_id, v_vip_rank
    FROM public.app_tier_ranks
    WHERE product_key = 'free'
    LIMIT 1;
  END IF;

  -- Map unified status enum to legacy status enum.
  --   subscriptions.status: active | trialing | grace_period | past_due |
  --                         paused  | expired  | revoked
  --   user_subscriptions.status: active | cancelled | expired | past_due
  v_legacy_status := CASE NEW.status
    WHEN 'active'       THEN 'active'
    WHEN 'trialing'     THEN 'active'
    WHEN 'grace_period' THEN 'active'
    WHEN 'past_due'     THEN 'past_due'
    WHEN 'paused'       THEN 'cancelled'
    WHEN 'expired'      THEN 'expired'
    WHEN 'revoked'      THEN 'cancelled'
    ELSE 'active'
  END;

  -- UPSERT into user_subscriptions.
  INSERT INTO public.user_subscriptions (
    user_id,
    tier_id,
    stripe_subscription_id,
    stripe_customer_id,
    status,
    current_period_start,
    current_period_end
  )
  VALUES (
    NEW.user_id,
    v_tier_id,
    NEW.provider_subscription_id,
    NEW.provider_customer_id,
    v_legacy_status,
    NEW.current_period_start,
    NEW.current_period_end
  )
  ON CONFLICT (user_id) DO UPDATE SET
    tier_id                = EXCLUDED.tier_id,
    stripe_subscription_id = EXCLUDED.stripe_subscription_id,
    stripe_customer_id     = EXCLUDED.stripe_customer_id,
    status                 = EXCLUDED.status,
    current_period_start   = EXCLUDED.current_period_start,
    current_period_end     = EXCLUDED.current_period_end,
    updated_at             = now();

  -- Propagate vip_rank to profiles so preResponseIntelligence and
  -- weekly-snapshots see the right value without a second migration.
  -- Only update if the column exists (defensive — see CLAUDE.md note
  -- about SQL-Editor manual migrations).
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'vip_rank'
  ) THEN
    UPDATE public.profiles
       SET vip_rank = v_vip_rank
     WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.sync_subscription_to_legacy() IS
  'Mirrors public.subscriptions writes into public.user_subscriptions and propagates vip_rank to profiles. Reads tier mapping from public.app_tier_ranks; falls back to Free on missing product_id. Mapping is idempotent via ON CONFLICT (user_id).';


-- ── 3. Trigger registration ─────────────────────────────────────────────
--
-- AFTER INSERT OR UPDATE — UPDATE matters because Stripe sends status
-- changes (active → past_due, paused → active on retry, etc.) as
-- updates to the existing row. Limiting OF clauses to the columns we
-- mirror means raw_payload-only updates don't fire the trigger.

DROP TRIGGER IF EXISTS trg_sync_subscriptions_to_legacy
  ON public.subscriptions;

CREATE TRIGGER trg_sync_subscriptions_to_legacy
  AFTER INSERT OR UPDATE OF
    status,
    current_period_start,
    current_period_end,
    product_id,
    provider_subscription_id,
    provider_customer_id
  ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_subscription_to_legacy();


-- ── 4. Admin recovery RPC ───────────────────────────────────────────────
--
-- Manual backfill for a single user. Useful for support tickets:
--   SELECT public.retry_subscription_creation(
--     (SELECT id FROM public.profiles WHERE email = 'user@x.com')
--   );
-- Also accepts an optional Stripe subscription id to disambiguate
-- when a user has multiple historical rows in subscriptions.

CREATE OR REPLACE FUNCTION public.retry_subscription_creation(
  p_user_id                 uuid,
  p_stripe_subscription_id  text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_admin_level int;
  v_src                public.subscriptions%ROWTYPE;
  v_tier_id            uuid;
  v_vip_rank           integer;
  v_legacy_status      text;
BEGIN
  -- Admin gate (level >= 9). get_admin_level is the canonical helper
  -- used by every admin SECURITY DEFINER RPC.
  SELECT COALESCE(public.get_admin_level(auth.uid()), 0)
    INTO v_caller_admin_level;
  IF v_caller_admin_level < 9 THEN
    RAISE EXCEPTION 'admin level >= 9 required';
  END IF;

  -- Pick the most-recent Stripe row for this user (most-recent by
  -- current_period_end so an active row beats an expired one).
  SELECT *
    INTO v_src
  FROM public.subscriptions
  WHERE user_id = p_user_id
    AND provider = 'stripe'
    AND (
      p_stripe_subscription_id IS NULL
      OR provider_subscription_id = p_stripe_subscription_id
    )
  ORDER BY current_period_end DESC NULLS LAST,
           updated_at DESC NULLS LAST
  LIMIT 1;

  IF v_src.id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'reason', 'no_unified_row',
      'user_id', p_user_id,
      'hint', 'no row in public.subscriptions for this user — webhook may not have fired'
    );
  END IF;

  -- Same tier + status mapping as the trigger.
  SELECT tier_id, vip_rank
    INTO v_tier_id, v_vip_rank
  FROM public.app_tier_ranks
  WHERE product_key = COALESCE(v_src.product_id, 'free')
  LIMIT 1;

  IF v_tier_id IS NULL THEN
    SELECT tier_id, vip_rank
      INTO v_tier_id, v_vip_rank
    FROM public.app_tier_ranks
    WHERE product_key = 'free'
    LIMIT 1;
  END IF;

  v_legacy_status := CASE v_src.status
    WHEN 'active'       THEN 'active'
    WHEN 'trialing'     THEN 'active'
    WHEN 'grace_period' THEN 'active'
    WHEN 'past_due'     THEN 'past_due'
    WHEN 'paused'       THEN 'cancelled'
    WHEN 'expired'      THEN 'expired'
    WHEN 'revoked'      THEN 'cancelled'
    ELSE 'active'
  END;

  INSERT INTO public.user_subscriptions (
    user_id,
    tier_id,
    stripe_subscription_id,
    stripe_customer_id,
    status,
    current_period_start,
    current_period_end
  )
  VALUES (
    v_src.user_id,
    v_tier_id,
    v_src.provider_subscription_id,
    v_src.provider_customer_id,
    v_legacy_status,
    v_src.current_period_start,
    v_src.current_period_end
  )
  ON CONFLICT (user_id) DO UPDATE SET
    tier_id                = EXCLUDED.tier_id,
    stripe_subscription_id = EXCLUDED.stripe_subscription_id,
    stripe_customer_id     = EXCLUDED.stripe_customer_id,
    status                 = EXCLUDED.status,
    current_period_start   = EXCLUDED.current_period_start,
    current_period_end     = EXCLUDED.current_period_end,
    updated_at             = now();

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'vip_rank'
  ) THEN
    UPDATE public.profiles SET vip_rank = v_vip_rank WHERE id = p_user_id;
  END IF;

  RETURN json_build_object(
    'ok', true,
    'user_id', p_user_id,
    'tier_id', v_tier_id,
    'vip_rank', v_vip_rank,
    'status', v_legacy_status,
    'source_subscription_id', v_src.id
  );
END;
$$;

COMMENT ON FUNCTION public.retry_subscription_creation(uuid, text) IS
  'Admin-initiated backfill of public.user_subscriptions from public.subscriptions for a single user. Idempotent. Admin level >= 9 required.';

REVOKE ALL ON FUNCTION public.retry_subscription_creation(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.retry_subscription_creation(uuid, text) FROM anon;
REVOKE ALL ON FUNCTION public.retry_subscription_creation(uuid, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.retry_subscription_creation(uuid, text) TO service_role;


-- ── 5. One-shot backfill ────────────────────────────────────────────────
--
-- Mirrors every existing Stripe row from subscriptions into
-- user_subscriptions. Idempotent via ON CONFLICT (user_id) DO UPDATE.
-- Same tier + status mapping as the trigger.
--
-- Skips orphan rows automatically — a user_id that exists in
-- user_subscriptions but NOT in subscriptions has no source row to
-- mirror, so this INSERT only adds rows for the 7 active Stripe
-- subscribers (and any historical rows we want backfilled). The 3
-- pre-existing orphan rows are not touched.

INSERT INTO public.user_subscriptions (
  user_id,
  tier_id,
  stripe_subscription_id,
  stripe_customer_id,
  status,
  current_period_start,
  current_period_end
)
SELECT
  s.user_id,
  COALESCE(
    (SELECT atr.tier_id FROM public.app_tier_ranks atr
      WHERE atr.product_key = s.product_id),
    (SELECT atr.tier_id FROM public.app_tier_ranks atr
      WHERE atr.product_key = 'free')
  ) AS tier_id,
  s.provider_subscription_id,
  s.provider_customer_id,
  CASE s.status
    WHEN 'active'       THEN 'active'
    WHEN 'trialing'     THEN 'active'
    WHEN 'grace_period' THEN 'active'
    WHEN 'past_due'     THEN 'past_due'
    WHEN 'paused'       THEN 'cancelled'
    WHEN 'expired'      THEN 'expired'
    WHEN 'revoked'      THEN 'cancelled'
    ELSE 'active'
  END AS status,
  s.current_period_start,
  s.current_period_end
FROM public.subscriptions s
WHERE s.provider = 'stripe'
  -- Take the most-recent row per user (in case a user has historical
  -- Stripe rows from multiple subscriptions).
  AND s.id = (
    SELECT s2.id
    FROM public.subscriptions s2
    WHERE s2.user_id = s.user_id
      AND s2.provider = 'stripe'
    ORDER BY s2.current_period_end DESC NULLS LAST,
             s2.updated_at DESC NULLS LAST
    LIMIT 1
  )
ON CONFLICT (user_id) DO UPDATE SET
  tier_id                = EXCLUDED.tier_id,
  stripe_subscription_id = EXCLUDED.stripe_subscription_id,
  stripe_customer_id     = EXCLUDED.stripe_customer_id,
  status                 = EXCLUDED.status,
  current_period_start   = EXCLUDED.current_period_start,
  current_period_end     = EXCLUDED.current_period_end,
  updated_at             = now();


-- Backfill profiles.vip_rank from app_tier_ranks for every user that
-- now has a user_subscriptions row, scoped to the column existing.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'vip_rank'
  ) THEN
    UPDATE public.profiles p
       SET vip_rank = COALESCE(atr.vip_rank, 1)
      FROM public.user_subscriptions us
      LEFT JOIN public.app_tier_ranks atr ON atr.tier_id = us.tier_id
     WHERE us.user_id = p.id
       AND us.status IN ('active', 'past_due');
  END IF;
END $$;
