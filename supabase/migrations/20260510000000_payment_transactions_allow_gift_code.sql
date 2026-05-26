-- Allow 'gift_code' as a payment_method on payment_transactions so the
-- redeem-access-code Edge Function can record gift / promo redemptions
-- without lying about the payment method (Option B from the diagnosis:
-- extend the constraint, do not reuse 'bank_transfer').
--
-- Existing constraint:
--   CHECK (payment_method = ANY (ARRAY['stripe','paypal','bank_transfer']))
-- New constraint adds 'gift_code'.
--
-- Also cleans up an orphan user_subscriptions row left behind during the
-- diagnosis attempt: 97d04b24-7afc-4626-bdc2-4b8e5dbb328c (user
-- 471284c7-44de-48a1-be7c-c58c6e188023). The atomic-RPC introduced in the
-- same PR prevents future orphans.

ALTER TABLE public.payment_transactions
  DROP CONSTRAINT IF EXISTS payment_transactions_payment_method_check;

ALTER TABLE public.payment_transactions
  ADD CONSTRAINT payment_transactions_payment_method_check
  CHECK (payment_method = ANY (ARRAY[
    'stripe'::text,
    'paypal'::text,
    'bank_transfer'::text,
    'gift_code'::text
  ]));

-- One-off cleanup of the orphan subscription created during diagnosis.
DELETE FROM public.user_subscriptions
WHERE id = '97d04b24-7afc-4626-bdc2-4b8e5dbb328c'
  AND user_id = '471284c7-44de-48a1-be7c-c58c6e188023';

-- Atomic redemption RPC. Replaces the multi-statement flow that the
-- redeem-access-code Edge Function previously did from outside the
-- database, where a payment_transactions failure would leave a
-- half-redeemed user_subscriptions row behind.
--
-- All statements run inside the implicit function transaction. Any RAISE
-- rolls everything back. Concurrency: the SELECT ... FOR UPDATE on
-- access_codes serialises concurrent redemptions of the same code so the
-- used_count check + increment can't race.
--
-- Returns a single row with the data the Edge Function needs to build
-- its success response. Errors are signalled via RAISE EXCEPTION with
-- a stable code prefix so the Edge Function can map them to user-facing
-- messages.

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
  -- 1. Look up + lock the access code row to serialise concurrent redeems.
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

  -- 2. Block double-redemption by the same user.
  IF EXISTS (
    SELECT 1 FROM public.access_code_redemptions
    WHERE code_id = v_code_row.id AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'ALREADY_REDEEMED' USING ERRCODE = 'P0004';
  END IF;

  -- 3. Resolve tier name (used in the success payload + transaction metadata).
  SELECT name INTO v_tier_name
  FROM public.subscription_tiers
  WHERE id = v_code_row.tier_id;

  -- 4. Find an active subscription for this user, if any. We don't use
  -- .single() semantics — if multiple actives exist (data anomaly) we
  -- pick the one with the latest current_period_end so extension stacks
  -- onto the longest-running grant.
  SELECT id, current_period_end
    INTO v_existing_sub_id, v_existing_period_end
  FROM public.user_subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  ORDER BY current_period_end DESC NULLS LAST
  LIMIT 1;

  -- 5. Compute end date. days = -1 means lifetime (~100 years out).
  v_is_lifetime := (v_code_row.days = -1);
  IF v_existing_period_end IS NOT NULL AND v_existing_period_end > v_start THEN
    v_start := v_existing_period_end;
  END IF;
  v_end := CASE
    WHEN v_is_lifetime THEN v_start + interval '100 years'
    ELSE v_start + (v_code_row.days || ' days')::interval
  END;

  -- 6. Upsert the user subscription.
  IF v_existing_sub_id IS NOT NULL THEN
    UPDATE public.user_subscriptions
    SET tier_id = v_code_row.tier_id,
        current_period_start = v_start,
        current_period_end = v_end,
        status = 'active',
        updated_at = now()
    WHERE id = v_existing_sub_id;
    v_subscription_id := v_existing_sub_id;
  ELSE
    INSERT INTO public.user_subscriptions (
      user_id, tier_id, current_period_start, current_period_end, status
    ) VALUES (
      p_user_id, v_code_row.tier_id, v_start, v_end, 'active'
    )
    RETURNING id INTO v_subscription_id;
  END IF;

  -- 7. Record the payment transaction.
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

  -- 8. Record the redemption.
  INSERT INTO public.access_code_redemptions (
    code_id, user_id, subscription_id, transaction_id
  ) VALUES (
    v_code_row.id, p_user_id, v_subscription_id, v_transaction_id
  );

  -- 9. Bump the code's used_count.
  UPDATE public.access_codes
  SET used_count = used_count + 1, updated_at = now()
  WHERE id = v_code_row.id;

  -- 10. Return the data the Edge Function needs for the success payload.
  tier_name := v_tier_name;
  days := v_code_row.days;
  is_lifetime := v_is_lifetime;
  valid_until := v_end;
  RETURN NEXT;
END;
$$;

-- Only the service role (used by the Edge Function) may invoke this.
REVOKE ALL ON FUNCTION public.redeem_access_code_atomic(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_access_code_atomic(uuid, text) TO service_role;
