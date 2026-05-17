-- 20260613000000_stripe_webhook_events_idempotency.sql
--
-- Codify public.stripe_webhook_events + its event_id PRIMARY KEY.
--
-- Why: the table was created manually via the Supabase SQL Editor and never
-- captured in a migration (CLI migration drift — see CLAUDE.md). The only
-- prior reference is 20260422020000_enable_rls_on_exposed_tables.sql, which
-- merely ALTERs RLS and *assumes* the table already exists.
--
-- The stripe-webhook function's atomic idempotency claim
-- (INSERT ... ON CONFLICT (event_id) DO NOTHING, via supabase-js upsert with
-- ignoreDuplicates) STRUCTURALLY DEPENDS on a unique/primary-key constraint on
-- event_id. A unique index almost certainly already exists in production
-- (the existing onConflict upsert has been working), but it is an untracked,
-- undocumented invariant. This migration version-controls it.
--
-- 100% idempotent: every statement is guarded so it is a no-op against the
-- live database. Human-reviewed before `supabase db push` (CLAUDE.md).

create table if not exists public.stripe_webhook_events (
  event_id     text        not null,
  created_at   timestamptz default now(),
  type         text,
  livemode     boolean,
  processed_at timestamptz,
  error        text
);

-- Belt-and-braces: if the table pre-exists from the manual SQL-Editor run
-- WITHOUT a primary key (drift), add it. The atomic claim is unsafe without
-- a unique constraint on event_id.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.stripe_webhook_events'::regclass
      and contype = 'p'
  ) then
    alter table public.stripe_webhook_events
      add constraint stripe_webhook_events_pkey primary key (event_id);
  end if;
end
$$;

-- Re-assert RLS-enabled (idempotent; already set by 20260422020000). The
-- function writes with the service-role key, which bypasses RLS — no policy
-- is required for the webhook path.
alter table public.stripe_webhook_events enable row level security;
