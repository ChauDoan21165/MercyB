-- Second of two CHECK constraints on user_subscriptions that gates
-- active paid-tier rows behind Stripe identity. PR #361 patched
-- `active_requires_stripe_for_paid_tiers`; this one is the sibling
-- `user_subscriptions_active_requires_stripe`, applied separately via
-- the SQL Editor (not in our migration tree). It blocked the
-- trankhuctriet@yahoo.com UPDATE in #361 and is now re-applied here
-- with the same is_gift_redemption escape clause.
--
-- Live constraint definition before this migration (per inspection):
--   CHECK (
--     (status <> 'active')
--     OR (tier_id = 'e50f166d-...')
--     OR ((stripe_subscription_id IS NOT NULL)
--         AND (stripe_customer_id IS NOT NULL))
--   )
--
-- Net change: add `OR (is_gift_redemption = true)` so gift-code
-- redemptions (which never have Stripe identity) are accepted. The
-- column itself was created in 20260510020000 — no column work here.
--
-- One DROP, one ADD. No RPC changes (the RPC body from #361 already
-- writes is_gift_redemption = true on every redeem path).
--
-- The fix-up UPDATE for trankhuctriet's row that #361 included is NOT
-- repeated here intentionally — apply it from the SQL Editor after
-- this migration lands. Keeping the migration to "constraint only"
-- makes its blast radius easy to read in audit later.

ALTER TABLE public.user_subscriptions
  DROP CONSTRAINT IF EXISTS user_subscriptions_active_requires_stripe;

ALTER TABLE public.user_subscriptions
  ADD CONSTRAINT user_subscriptions_active_requires_stripe
  CHECK (
    (status <> 'active')
    OR (tier_id = 'e50f166d-c3dd-41b8-bdb4-c0a8ca58b35d')
    OR ((stripe_subscription_id IS NOT NULL)
        AND (stripe_customer_id IS NOT NULL))
    OR (is_gift_redemption = true)
  );
