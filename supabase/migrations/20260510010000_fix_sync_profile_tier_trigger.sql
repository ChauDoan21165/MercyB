-- Fix `column st.key does not exist` error firing during gift-code
-- redemption. The bug is in trigger function
-- public.sync_profile_tier_from_payment_transactions, NOT in
-- redeem_access_code_atomic (introduced in
-- 20260510000000_payment_transactions_allow_gift_code.sql).
--
-- Schema drift: subscription_tiers.key was renamed to subscription_tiers.vip_key
-- in production via the SQL Editor, but this trigger function was never
-- updated. The trigger fires AFTER INSERT on payment_transactions, so
-- every redemption path that records a payment row hits it — including
-- the new gift_code path.
--
-- subscription_tiers.vip_key is a USER-DEFINED enum (e.g. vip_key_t).
-- profiles.tier is text (default 'level0', per the original
-- 20251021090532 migration). Cast to text so the assignment matches.
--
-- CREATE OR REPLACE keeps the existing trigger binding intact —
-- triggers reference the function by oid, not by source, so the
-- AFTER INSERT trigger on payment_transactions continues to fire the
-- updated function with no rebinding needed.
--
-- Body is verbatim from pg_proc.prosrc as captured during diagnosis,
-- except line `select st.key into v_tier_key` → `select st.vip_key::text`.
-- Everything else (column-existence guards, status filter, EXECUTE
-- format calls, return value) is unchanged so we don't accidentally
-- alter behaviour beyond the column-name fix.

CREATE OR REPLACE FUNCTION public.sync_profile_tier_from_payment_transactions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_tier_key text;
  v_profiles_has_tier boolean := public._col_exists('public','profiles','tier');
  v_profiles_has_tier_id boolean := public._col_exists('public','profiles','tier_id');
begin
  if new.status is null then
    return new;
  end if;

  if lower(new.status) not in ('paid','completed') then
    return new;
  end if;

  -- Find tier key (subscription_tiers.vip_key, formerly .key — renamed
  -- in production; this trigger missed the rename). Cast to text since
  -- profiles.tier is text.
  select st.vip_key::text
    into v_tier_key
  from public.subscription_tiers st
  where st.id = new.tier_id
  limit 1;

  if v_tier_key is null then
    return new;
  end if;

  if v_profiles_has_tier and v_profiles_has_tier_id then
    execute format(
      'update public.profiles
         set tier = $1,
             tier_id = $2
       where id = $3'
    )
    using v_tier_key, new.tier_id, new.user_id;
  elsif v_profiles_has_tier then
    execute format(
      'update public.profiles
         set tier = $1
       where id = $2'
    )
    using v_tier_key, new.user_id;
  elsif v_profiles_has_tier_id then
    execute format(
      'update public.profiles
         set tier_id = $1
       where id = $2'
    )
    using new.tier_id, new.user_id;
  end if;

  return new;
end;
$$;
