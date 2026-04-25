-- Step 9 (Monetization) — gift subscription table.
--
-- Distinct from the existing public.gift_codes table (admin-issued
-- redemption codes for fixed tiers). gift_subscriptions models a
-- peer-to-peer flow:
--   - A purchaser pays for N months of access for a recipient.
--   - The system mints a 12-char unambiguous code.
--   - The recipient redeems the code on their account; entitlement
--     extends by N months from redemption.
--   - The recipient does NOT need an account at purchase time —
--     `recipient_user_id` is nullable, set on redeem.
--
-- "Tặng mẹ 6 tháng tiếng Anh" / "Give Mom 6 months of English" is the
-- VN-diaspora story this table enables.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.gift_subscriptions;

CREATE TABLE IF NOT EXISTS public.gift_subscriptions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 12-char unambiguous code (generator excludes O/0/I/1/L/U/V — see
  -- giftSubscriptionClient.ts). Unique constraint blocks accidental
  -- collisions; the generator retries on conflict.
  code                  text NOT NULL UNIQUE
    CONSTRAINT gift_subs_code_len CHECK (length(code) = 12),

  -- Tightly bounded duration menu. Matches the typical gift-card durations
  -- and gives Stripe a clean small SKU surface.
  duration_months       integer NOT NULL
    CONSTRAINT gift_subs_duration_chk CHECK (duration_months IN (1, 3, 6, 12)),

  -- Purchaser side. user_id may be null if checkout supports guests one
  -- day; today the purchase form is auth-required and writes both.
  purchaser_user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  purchaser_email       text,

  -- Recipient side. Email is captured at purchase time so we can email
  -- the code; user_id is bound at redeem time when the recipient signs in.
  recipient_email       text,
  recipient_user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- 280 chars — Twitter cap, mirrors the public-profile bio rule (PR #85).
  personal_message      text
    CONSTRAINT gift_subs_message_len CHECK (
      personal_message IS NULL OR length(personal_message) <= 280
    ),

  created_at            timestamptz NOT NULL DEFAULT now(),
  redeemed_at           timestamptz,

  -- Code expiry: 1 year from creation if never redeemed.
  expires_at            timestamptz NOT NULL DEFAULT (now() + interval '1 year')
);

-- Hot paths.
CREATE INDEX IF NOT EXISTS idx_gift_subs_purchaser
  ON public.gift_subscriptions (purchaser_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gift_subs_recipient_user
  ON public.gift_subscriptions (recipient_user_id, redeemed_at DESC)
  WHERE recipient_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_gift_subs_recipient_email
  ON public.gift_subscriptions (lower(recipient_email))
  WHERE recipient_email IS NOT NULL;

-- ── RLS ────────────────────────────────────────────────────────────────

ALTER TABLE public.gift_subscriptions ENABLE ROW LEVEL SECURITY;

-- Purchaser: see + insert their own gifts.
DROP POLICY IF EXISTS gift_subs_purchaser_select ON public.gift_subscriptions;
CREATE POLICY gift_subs_purchaser_select
  ON public.gift_subscriptions
  FOR SELECT
  USING (purchaser_user_id = auth.uid());

DROP POLICY IF EXISTS gift_subs_purchaser_insert ON public.gift_subscriptions;
CREATE POLICY gift_subs_purchaser_insert
  ON public.gift_subscriptions
  FOR INSERT
  WITH CHECK (purchaser_user_id = auth.uid());

-- Recipient: see gifts redeemed against their account.
DROP POLICY IF EXISTS gift_subs_recipient_select ON public.gift_subscriptions;
CREATE POLICY gift_subs_recipient_select
  ON public.gift_subscriptions
  FOR SELECT
  USING (recipient_user_id = auth.uid());

-- Redemption is a controlled mutation: any authenticated user can claim
-- a code by setting recipient_user_id + redeemed_at, but only on rows
-- that are currently unredeemed (redeemed_at IS NULL) and not expired.
-- The bound USING + WITH CHECK prevents code theft (an attacker can't
-- update a row that's already redeemed by someone else).
DROP POLICY IF EXISTS gift_subs_redeem ON public.gift_subscriptions;
CREATE POLICY gift_subs_redeem
  ON public.gift_subscriptions
  FOR UPDATE
  USING (redeemed_at IS NULL AND expires_at > now())
  WITH CHECK (
    recipient_user_id = auth.uid()
    AND redeemed_at IS NOT NULL
  );

COMMENT ON TABLE public.gift_subscriptions IS
  'Peer-to-peer gift subscriptions (purchaser → recipient). Code-based redemption grants time-bounded entitlement. Distinct from public.gift_codes (admin-issued tier codes).';
