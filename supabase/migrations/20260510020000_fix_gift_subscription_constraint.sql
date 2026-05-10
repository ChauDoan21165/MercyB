-- Fix gift-code redemption end-to-end. Three bugs, one migration.
--
-- BUG 1 — `active_requires_stripe_for_paid_tiers` CHECK constraint
-- (applied via SQL Editor, not in our migration tree) blocks any
-- active paid-tier user_subscriptions row that doesn't have a
-- stripe_subscription_id. Gift-code redemptions never have one, so
-- the redeem RPC silently degraded: it caught the failed UPDATE/INSERT
-- on the paid tier and was leaving the user on Free.
--
-- The brief's first-draft fix (EXISTS subquery on payment_transactions)
-- can't be used: Postgres CHECK constraints cannot contain subqueries
-- nor reference other tables. Using the brief's "alternative simpler
-- approach": add an `is_gift_redemption` boolean to user_subscriptions
-- and key the constraint off it.
--
-- BUG 2 — All 30 `GIFT*` access codes were created pointing to the
-- Free tier id (`e50f166d-...`) because the seed SQL used
-- `ORDER BY created_at LIMIT 1` which picked the oldest tier. The
-- correct target is the One Year tier (`a2863250-...`, vip_key `vip9`).
-- We update only `used_count = 0` rows so already-redeemed codes are
-- left alone — those are corrected per-row in Bug 3 territory.
--
-- BUG 3 — One existing redemption (trankhuctriet@yahoo.com,
-- user 5171545f-...) already used GIFT1Y-DB4433 but landed on Free.
-- profiles.tier was already manually patched to 'vip9' in the SQL
-- Editor; user_subscriptions could not be patched until the
-- constraint changed. Both UPDATEs run here for completeness; the
-- profiles UPDATE is idempotent.
--
-- Order matters: column added first, constraint dropped+recreated
-- before the user_subscriptions UPDATE so the new row passes the
-- new check.

-- ── 1. user_subscriptions.is_gift_redemption column ───────────────────

ALTER TABLE public.user_subscriptions
  ADD COLUMN IF NOT EXISTS is_gift_redemption boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.user_subscriptions.is_gift_redemption IS
  'True when the row was created or extended by an access-code redemption '
  'via redeem_access_code_atomic. Used by the '
  'active_requires_stripe_for_paid_tiers CHECK to allow active paid-tier '
  'rows that do not have a stripe_subscription_id.';

-- ── 2. Replace the gating constraint ──────────────────────────────────

ALTER TABLE public.user_subscriptions
  DROP CONSTRAINT IF EXISTS active_requires_stripe_for_paid_tiers;

ALTER TABLE public.user_subscriptions
  ADD CONSTRAINT active_requires_stripe_for_paid_tiers
  CHECK (
    status <> 'active'
    OR tier_id = 'e50f166d-c3dd-41b8-bdb4-c0a8ca58b35d'  -- Free tier
    OR stripe_subscription_id IS NOT NULL
    OR is_gift_redemption = true
  );

-- ── 3. Repoint unredeemed GIFT* codes to the One Year tier ────────────
-- Only `used_count = 0` rows are touched. Already-redeemed codes are
-- handled by the per-user fixup below.

UPDATE public.access_codes
SET tier_id = 'a2863250-1798-443e-b1d3-d20e3db06281', -- One Year (vip9)
    updated_at = now()
WHERE code LIKE 'GIFT%'
  AND used_count = 0;

-- ── 4. Fix trankhuctriet's already-redeemed subscription ──────────────
-- The single UPDATE sets both tier_id (now paid) AND
-- is_gift_redemption=true so the constraint check on the resulting row
-- evaluates the new column and passes.

UPDATE public.user_subscriptions
SET tier_id = 'a2863250-1798-443e-b1d3-d20e3db06281',
    is_gift_redemption = true,
    updated_at = now()
WHERE user_id = '5171545f-d9c9-435b-bb5f-f944314f099e'
  AND status = 'active';

-- profiles.tier was already manually patched to 'vip9' via the SQL
-- Editor before this migration; this re-asserts it for idempotency.
UPDATE public.profiles
SET tier = 'vip9'
WHERE id = '5171545f-d9c9-435b-bb5f-f944314f099e';

-- ── 5. Update the RPC to set is_gift_redemption on every redeem ───────
-- Body otherwise verbatim from
-- 20260510000000_payment_transactions_allow_gift_code.sql; only the
-- two user_subscriptions write paths (UPDATE + INSERT) gain the new
-- column. Same signature, same SECURITY DEFINER, same GRANT.

CREATE OR REPLACE FUNCTION public.redeem_access_code_atomic(
  p_user_id uuid,
  p_code text
)
RETURNS TABLE (
  tier_name text,
  days integer,
  is_lifetime boolean,
  valid_until timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code_row public.access_codes%ROWTYPE;
  v_tier_name text;
  v_existing_sub_id uuid;
  v_existing_period_end timestamptz;
  v_subscription_id uuid;
  v_transaction_id uuid;
  v_start timestamptz := now();
  v_end timestamptz;
  v_is_lifetime boolean;
BEGIN
  SELECT * INTO v_code_row
  FROM public.access_codes
  WHERE code = upper(p_code) AND is_active = true
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CODE_NOT_FOUND' USING ERRCODE = 'P0001';
  END IF;

  IF v_code_row.expires_at IS NOT NULL AND v_code_row.expires_at < now() THEN
    RAISE EXCEPTION 'CODE_EXPIRED' USING ERRCODE = 'P0002';
  END IF;

  IF v_code_row.used_count >= v_code_row.max_uses THEN
    RAISE EXCEPTION 'CODE_FULLY_REDEEMED' USING ERRCODE = 'P0003';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.access_code_redemptions
    WHERE code_id = v_code_row.id AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'ALREADY_REDEEMED' USING ERRCODE = 'P0004';
  END IF;

  SELECT name INTO v_tier_name
  FROM public.subscription_tiers
  WHERE id = v_code_row.tier_id;

  SELECT id, current_period_end
    INTO v_existing_sub_id, v_existing_period_end
  FROM public.user_subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  ORDER BY current_period_end DESC NULLS LAST
  LIMIT 1;

  v_is_lifetime := (v_code_row.days = -1);
  IF v_existing_period_end IS NOT NULL AND v_existing_period_end > v_start THEN
    v_start := v_existing_period_end;
  END IF;
  v_end := CASE
    WHEN v_is_lifetime THEN v_start + interval '100 years'
    ELSE v_start + (v_code_row.days || ' days')::interval
  END;

  IF v_existing_sub_id IS NOT NULL THEN
    UPDATE public.user_subscriptions
    SET tier_id = v_code_row.tier_id,
        current_period_start = v_start,
        current_period_end = v_end,
        status = 'active',
        is_gift_redemption = true,
        updated_at = now()
    WHERE id = v_existing_sub_id;
    v_subscription_id := v_existing_sub_id;
  ELSE
    INSERT INTO public.user_subscriptions (
      user_id, tier_id, current_period_start, current_period_end, status,
      is_gift_redemption
    ) VALUES (
      p_user_id, v_code_row.tier_id, v_start, v_end, 'active',
      true
    )
    RETURNING id INTO v_subscription_id;
  END IF;

  INSERT INTO public.payment_transactions (
    user_id, tier_id, amount, payment_method, transaction_type,
    external_reference, period_days, status, metadata
  ) VALUES (
    p_user_id,
    v_code_row.tier_id,
    0,
    'gift_code',
    'redemption',
    v_code_row.code,
    CASE WHEN v_is_lifetime THEN NULL ELSE v_code_row.days END,
    'completed',
    jsonb_build_object(
      'code_id', v_code_row.id,
      'tier_name', v_tier_name,
      'is_lifetime', v_is_lifetime
    )
  )
  RETURNING id INTO v_transaction_id;

  INSERT INTO public.access_code_redemptions (
    code_id, user_id, subscription_id, transaction_id
  ) VALUES (
    v_code_row.id, p_user_id, v_subscription_id, v_transaction_id
  );

  UPDATE public.access_codes
  SET used_count = used_count + 1, updated_at = now()
  WHERE id = v_code_row.id;

  tier_name := v_tier_name;
  days := v_code_row.days;
  is_lifetime := v_is_lifetime;
  valid_until := v_end;
  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_access_code_atomic(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_access_code_atomic(uuid, text) TO service_role;
