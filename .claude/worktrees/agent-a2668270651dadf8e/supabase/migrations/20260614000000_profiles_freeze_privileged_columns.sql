-- Fix: profiles privilege escalation — sensitive columns become
-- server-write-only (the `authenticated` REST role can no longer mutate
-- them on its own row).
--
-- Origin: reports/RECON-rls-completeness.md §1 (CRITICAL — EXPLOITABLE),
-- corroborated by this dispatch's Phase 1 verification against
-- origin/main and the 2026-05-17 live prod dump.
--
-- Attack path (live, unmitigated, paywall-independent):
--   `GRANT SELECT,UPDATE ON public.profiles TO authenticated` is
--   table-level (no column grant). Policy `profiles_update_own` is
--   `FOR UPDATE USING (auth.uid() = user_id)` with NO `WITH CHECK`,
--   so Postgres reuses USING for the check; `user_id` is unchanged so
--   the row still passes even when `is_admin` flips. No BEFORE UPDATE
--   trigger guards profiles. Net: any free authenticated account can
--     PATCH /rest/v1/profiles?id=eq.<self> {"is_admin":true,"admin_level":9}
--   then `is_admin_user(self)` returns true → policy
--   `profiles_select_admin` (auth.uid()=user_id OR is_admin_user(...))
--   yields SELECT on EVERY profiles row (all-user PII: email, phone,
--   country, stripe_customer_id, names), and the inline
--   `subscriptions_admin_read` (profiles.is_admin OR admin_level>=1)
--   yields all subscription/billing rows.
--
-- Bounding (important — not full admin takeover): `get_admin_level()`
--   reads the SEPARATE `admin_users` table (service-role-only, no
--   authenticated INSERT path), NOT profiles. The 39 policies gated on
--   get_admin_level()>=9/7/5 (admin dashboards, billing-metrics,
--   audit-log) are NOT reachable via this primitive. Impact is
--   all-user PII + all subscriptions, not the get_admin_level admin
--   surface.
--
-- Drift note (locked #14): `profiles_update_own`,
--   `profiles_select_admin`, and `is_admin_user()` are NOT defined in
--   ANY tracked migration on origin/main — they exist only in live
--   prod (SQL-Editor drift, the same class as #562's access_codes
--   drift). This migration is therefore the FIRST tracked migration
--   for any of this policy surface and is written self-contained
--   against prod reality (CREATE OR REPLACE + DROP TRIGGER IF EXISTS),
--   not as an edit to a prior migration.
--
-- Fix shape (recon §1 option C — BEFORE UPDATE trigger; Chau-selected
--   for smallest blast radius on the most-read table and robustness to
--   the schema drift this codebase demonstrably has — types.ts is
--   already missing trial_extension_days / email_unsubscribe_token):
--   a BEFORE UPDATE trigger that REVERTS (does not reject) any delta to
--   the privileged column class when the caller is the browser
--   `authenticated` REST role. Reverting, not RAISE, is the smallest
--   behavioural blast radius: a legitimate UPDATE that echoes an
--   unchanged sensitive value still succeeds with no error; a malicious
--   changed value is silently neutralised. Every non-sensitive column
--   (including any future column) stays user-writable exactly as today
--   — no functional regression.
--
-- Service-role / SQL-Editor are EXEMPT by design: the trigger only
--   constrains when the verified JWT role claim is 'authenticated'.
--   Edge functions that legitimately write these columns
--   (stripe-webhook billing.ts, me-entitlement, manage-admins) use the
--   service-role key → role claim 'service_role' → pass through. The
--   Supabase SQL Editor runs as postgres with no request.jwt → claim
--   NULL → pass through (Chau's manual admin grants keep working). An
--   attacker cannot forge the claim: it is set by PostgREST from the
--   verified JWT and minting a service_role JWT requires the service
--   secret. anon has neither an UPDATE grant nor a matching policy on
--   profiles, so it cannot reach UPDATE at all.
--
-- Privileged column class frozen for the `authenticated` role (13):
--   is_admin, admin_level, role            -- privilege escalation core
--   tier, plan_type                        -- entitlement
--   premium_status, premium_expires_at, premium_source   -- entitlement
--   access_expires_at, vip_rank, trial_extension_days     -- entitlement
--   stripe_customer_id                     -- billing linkage / takeover
--   email_unsubscribe_token                -- security token
--
-- NOT frozen (legitimate own-profile fields, verified Phase 1 against
--   every browser writer of public.profiles): username, display_name,
--   avatar_url, bio, country, timezone, is_public, preferred_accent,
--   primary_goal, profession, english_level, learning_started_at,
--   onboarded_at, placement_*, email_*_enabled, email_unsubscribed_at,
--   id, email — all remain user-writable.
--
-- Apply path (locked #4 / drift protocol, same as #562): this SQL file
--   is shipped for human review and applied by Chau via the Supabase
--   SQL Editor. It is NOT applied via `supabase db push`.

create or replace function public.profiles_freeze_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Only constrain the browser `authenticated` REST role. service_role
  -- (edge functions) and postgres / SQL Editor (no request.jwt) have a
  -- role claim that is 'service_role' or NULL respectively and
  -- legitimately write the privileged columns. anon cannot UPDATE
  -- profiles at all (no grant, no matching policy).
  if current_setting('request.jwt.claim.role', true)
       is distinct from 'authenticated' then
    return new;
  end if;

  -- Revert (do not reject) any delta to a privileged column. Reverting
  -- is the smallest blast radius: a client that echoes an unchanged
  -- sensitive value never starts erroring; a malicious changed value is
  -- neutralised in place.
  new.is_admin                := old.is_admin;
  new.admin_level             := old.admin_level;
  new.role                    := old.role;
  new.tier                    := old.tier;
  new.plan_type               := old.plan_type;
  new.premium_status          := old.premium_status;
  new.premium_expires_at      := old.premium_expires_at;
  new.premium_source          := old.premium_source;
  new.access_expires_at       := old.access_expires_at;
  new.vip_rank                := old.vip_rank;
  new.trial_extension_days    := old.trial_extension_days;
  new.stripe_customer_id      := old.stripe_customer_id;
  new.email_unsubscribe_token := old.email_unsubscribe_token;

  return new;
end;
$$;

comment on function public.profiles_freeze_privileged_columns() is
  'BEFORE UPDATE guard on public.profiles. Reverts deltas to the 13 '
  'privileged columns (is_admin, admin_level, role, tier, plan_type, '
  'premium_status, premium_expires_at, premium_source, access_expires_at, '
  'vip_rank, trial_extension_days, stripe_customer_id, '
  'email_unsubscribe_token) when the JWT role claim is ''authenticated''. '
  'service_role / SQL-Editor are exempt. Closes the profiles privilege '
  'escalation in reports/RECON-rls-completeness.md §1.';

-- Idempotent, no lockout window: drop then recreate.
drop trigger if exists profiles_freeze_privileged_columns on public.profiles;
create trigger profiles_freeze_privileged_columns
  before update on public.profiles
  for each row
  execute function public.profiles_freeze_privileged_columns();
