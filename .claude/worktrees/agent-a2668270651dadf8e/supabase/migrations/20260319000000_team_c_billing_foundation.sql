-- Team C billing foundation patch
-- Goals:
--   * keep public.subscriptions as the only canonical subscription source
--   * add additive fields required for multi-provider normalization
--   * add replay-safe provider event idempotency storage
--   * add entitlement event logging support
--   * avoid disturbing the working Stripe flow

begin;

create extension if not exists pgcrypto;

do $$
begin
  if to_regclass('public.subscriptions') is null then
    raise exception 'Expected canonical table public.subscriptions to exist before applying Team C billing foundation patch';
  end if;
end $$;

-- Ensure enum-backed provider column can represent apple/google before any checks touch it.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'provider'
      and udt_name = 'billing_provider'
  ) then
    begin
      alter type public.billing_provider add value if not exists 'apple';
    exception when duplicate_object then
      null;
    end;

    begin
      alter type public.billing_provider add value if not exists 'google';
    exception when duplicate_object then
      null;
    end;
  end if;
end $$;

alter table public.subscriptions
  add column if not exists provider text,
  add column if not exists provider_subscription_id text,
  add column if not exists provider_customer_id text,
  add column if not exists provider_product_id text,
  add column if not exists provider_price_id text,
  add column if not exists environment text,
  add column if not exists currency_code text,
  add column if not exists billing_interval text,
  add column if not exists billing_interval_count integer,
  add column if not exists quantity integer,
  add column if not exists trial_started_at timestamptz,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists current_period_start_at timestamptz,
  add column if not exists current_period_end_at timestamptz,
  add column if not exists cancel_at timestamptz,
  add column if not exists canceled_at timestamptz,
  add column if not exists ended_at timestamptz,
  add column if not exists provider_metadata jsonb;

update public.subscriptions
set
  provider = coalesce(provider, 'stripe'),
  environment = coalesce(environment, 'production'),
  quantity = coalesce(quantity, 1),
  provider_metadata = coalesce(provider_metadata, '{}'::jsonb)
where
  provider is null
  or environment is null
  or quantity is null
  or provider_metadata is null;

alter table public.subscriptions
  alter column provider set default 'stripe',
  alter column provider set not null,
  alter column environment set default 'production',
  alter column environment set not null,
  alter column quantity set default 1,
  alter column quantity set not null,
  alter column provider_metadata set default '{}'::jsonb,
  alter column provider_metadata set not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'stripe_subscription_id'
  ) then
    execute $stmt$
      update public.subscriptions
      set provider_subscription_id = coalesce(provider_subscription_id, stripe_subscription_id)
      where stripe_subscription_id is not null
    $stmt$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'stripe_customer_id'
  ) then
    execute $stmt$
      update public.subscriptions
      set provider_customer_id = coalesce(provider_customer_id, stripe_customer_id)
      where stripe_customer_id is not null
    $stmt$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'stripe_price_id'
  ) then
    execute $stmt$
      update public.subscriptions
      set provider_price_id = coalesce(provider_price_id, stripe_price_id)
      where stripe_price_id is not null
    $stmt$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'stripe_product_id'
  ) then
    execute $stmt$
      update public.subscriptions
      set provider_product_id = coalesce(provider_product_id, stripe_product_id)
      where stripe_product_id is not null
    $stmt$;
  end if;
end $$;

do $$
declare
  v_provider_is_enum boolean;
begin
  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'provider'
      and udt_name = 'billing_provider'
  ) into v_provider_is_enum;

  if not v_provider_is_enum then
    if not exists (
      select 1
      from pg_constraint
      where conname = 'subscriptions_provider_check'
        and conrelid = 'public.subscriptions'::regclass
    ) then
      alter table public.subscriptions
        add constraint subscriptions_provider_check
        check (provider in ('stripe', 'apple', 'google'));
    end if;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'subscriptions_environment_check'
      and conrelid = 'public.subscriptions'::regclass
  ) then
    alter table public.subscriptions
      add constraint subscriptions_environment_check
      check (environment in ('production', 'sandbox', 'test'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'subscriptions_billing_interval_check'
      and conrelid = 'public.subscriptions'::regclass
  ) then
    alter table public.subscriptions
      add constraint subscriptions_billing_interval_check
      check (
        billing_interval is null
        or billing_interval in ('day', 'week', 'month', 'year')
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'subscriptions_billing_interval_count_check'
      and conrelid = 'public.subscriptions'::regclass
  ) then
    alter table public.subscriptions
      add constraint subscriptions_billing_interval_count_check
      check (billing_interval_count is null or billing_interval_count > 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'subscriptions_quantity_check'
      and conrelid = 'public.subscriptions'::regclass
  ) then
    alter table public.subscriptions
      add constraint subscriptions_quantity_check
      check (quantity > 0);
  end if;
end $$;

create index if not exists subscriptions_provider_idx
  on public.subscriptions (provider);

create index if not exists subscriptions_provider_subscription_id_idx
  on public.subscriptions (provider, provider_subscription_id)
  where provider_subscription_id is not null;

create index if not exists subscriptions_provider_customer_id_idx
  on public.subscriptions (provider, provider_customer_id)
  where provider_customer_id is not null;

create index if not exists subscriptions_current_period_end_at_idx
  on public.subscriptions (current_period_end_at)
  where current_period_end_at is not null;

create table if not exists public.billing_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  environment text not null default 'production',
  event_key text not null,
  provider_event_id text,
  event_type text,
  event_created_at timestamptz,
  received_at timestamptz not null default now(),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  delivery_count integer not null default 1,
  process_status text not null default 'received',
  processed_at timestamptz,
  processing_error text,
  payload jsonb not null default '{}'::jsonb,
  headers jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_provider_events_provider_check
    check (provider in ('stripe', 'apple', 'google')),
  constraint billing_provider_events_environment_check
    check (environment in ('production', 'sandbox', 'test')),
  constraint billing_provider_events_process_status_check
    check (process_status in ('received', 'processing', 'processed', 'ignored', 'failed')),
  constraint billing_provider_events_delivery_count_check
    check (delivery_count > 0)
);

create unique index if not exists billing_provider_events_provider_event_key_uidx
  on public.billing_provider_events (provider, environment, event_key);

create index if not exists billing_provider_events_provider_status_received_idx
  on public.billing_provider_events (provider, process_status, received_at desc);

create index if not exists billing_provider_events_provider_event_id_idx
  on public.billing_provider_events (provider, provider_event_id)
  where provider_event_id is not null;

create index if not exists billing_provider_events_processed_at_idx
  on public.billing_provider_events (processed_at)
  where processed_at is not null;

create table if not exists public.billing_entitlement_events (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null,
  subscription_ref text,
  provider text not null,
  environment text not null default 'production',
  entitlement_key text not null,
  action text not null,
  reason text,
  effective_at timestamptz not null,
  period_start_at timestamptz,
  period_end_at timestamptz,
  source_event_key text,
  source_provider_event_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_entitlement_events_provider_check
    check (provider in ('stripe', 'apple', 'google')),
  constraint billing_entitlement_events_environment_check
    check (environment in ('production', 'sandbox', 'test')),
  constraint billing_entitlement_events_action_check
    check (action in ('grant', 'revoke', 'sync'))
);

create unique index if not exists billing_entitlement_events_source_uidx
  on public.billing_entitlement_events (provider, environment, source_event_key, entitlement_key, action)
  where source_event_key is not null;

create index if not exists billing_entitlement_events_subject_effective_idx
  on public.billing_entitlement_events (subject_id, effective_at desc);

create index if not exists billing_entitlement_events_subscription_ref_idx
  on public.billing_entitlement_events (subscription_ref)
  where subscription_ref is not null;

alter table public.billing_provider_events enable row level security;
alter table public.billing_entitlement_events enable row level security;

create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_billing_provider_events_updated_at'
  ) then
    create trigger set_billing_provider_events_updated_at
      before update on public.billing_provider_events
      for each row
      execute function public.set_row_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_billing_entitlement_events_updated_at'
  ) then
    create trigger set_billing_entitlement_events_updated_at
      before update on public.billing_entitlement_events
      for each row
      execute function public.set_row_updated_at();
  end if;
end $$;

drop function if exists public.register_billing_provider_event(text, text, text, text, text, timestamptz, jsonb, jsonb, jsonb);

create or replace function public.register_billing_provider_event(
  p_provider text,
  p_environment text,
  p_event_key text,
  p_provider_event_id text default null,
  p_event_type text default null,
  p_event_created_at timestamptz default null,
  p_payload jsonb default '{}'::jsonb,
  p_headers jsonb default '{}'::jsonb,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  is_new boolean,
  delivery_count integer,
  process_status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.billing_provider_events%rowtype;
begin
  if p_provider not in ('stripe', 'apple', 'google') then
    raise exception 'Unsupported provider: %', p_provider;
  end if;

  if p_environment not in ('production', 'sandbox', 'test') then
    raise exception 'Unsupported environment: %', p_environment;
  end if;

  begin
    insert into public.billing_provider_events (
      provider,
      environment,
      event_key,
      provider_event_id,
      event_type,
      event_created_at,
      payload,
      headers,
      metadata
    )
    values (
      p_provider,
      p_environment,
      p_event_key,
      p_provider_event_id,
      p_event_type,
      p_event_created_at,
      coalesce(p_payload, '{}'::jsonb),
      coalesce(p_headers, '{}'::jsonb),
      coalesce(p_metadata, '{}'::jsonb)
    )
    returning * into v_row;

    return query
    select v_row.id, true, v_row.delivery_count, v_row.process_status;
    return;
  exception
    when unique_violation then
      update public.billing_provider_events
      set
        last_seen_at = now(),
        delivery_count = billing_provider_events.delivery_count + 1,
        provider_event_id = coalesce(billing_provider_events.provider_event_id, p_provider_event_id),
        event_type = coalesce(billing_provider_events.event_type, p_event_type),
        event_created_at = coalesce(billing_provider_events.event_created_at, p_event_created_at),
        metadata = billing_provider_events.metadata || coalesce(p_metadata, '{}'::jsonb)
      where provider = p_provider
        and environment = p_environment
        and event_key = p_event_key
      returning * into v_row;

      return query
      select v_row.id, false, v_row.delivery_count, v_row.process_status;
      return;
  end;
end;
$$;

drop function if exists public.log_billing_entitlement_event(text, text, text, text, text, text, text, timestamptz, timestamptz, timestamptz, text, text, jsonb);

create or replace function public.log_billing_entitlement_event(
  p_subject_id text,
  p_subscription_ref text,
  p_provider text,
  p_environment text,
  p_entitlement_key text,
  p_action text,
  p_reason text default null,
  p_effective_at timestamptz default now(),
  p_period_start_at timestamptz default null,
  p_period_end_at timestamptz default null,
  p_source_event_key text default null,
  p_source_provider_event_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.billing_entitlement_events (
    subject_id,
    subscription_ref,
    provider,
    environment,
    entitlement_key,
    action,
    reason,
    effective_at,
    period_start_at,
    period_end_at,
    source_event_key,
    source_provider_event_id,
    metadata
  )
  values (
    p_subject_id,
    p_subscription_ref,
    p_provider,
    p_environment,
    p_entitlement_key,
    p_action,
    p_reason,
    coalesce(p_effective_at, now()),
    p_period_start_at,
    p_period_end_at,
    p_source_event_key,
    p_source_provider_event_id,
    coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (provider, environment, source_event_key, entitlement_key, action)
  where source_event_key is not null
  do update set
    reason = excluded.reason,
    effective_at = excluded.effective_at,
    period_start_at = excluded.period_start_at,
    period_end_at = excluded.period_end_at,
    source_provider_event_id = coalesce(excluded.source_provider_event_id, public.billing_entitlement_events.source_provider_event_id),
    metadata = public.billing_entitlement_events.metadata || excluded.metadata,
    updated_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on table public.billing_provider_events from public, anon, authenticated;
revoke all on table public.billing_entitlement_events from public, anon, authenticated;
revoke all on function public.register_billing_provider_event(text, text, text, text, text, timestamptz, jsonb, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.log_billing_entitlement_event(text, text, text, text, text, text, text, timestamptz, timestamptz, timestamptz, text, text, jsonb) from public, anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update on table public.billing_provider_events to service_role;
grant select, insert, update on table public.billing_entitlement_events to service_role;
grant execute on function public.register_billing_provider_event(text, text, text, text, text, timestamptz, jsonb, jsonb, jsonb) to service_role;
grant execute on function public.log_billing_entitlement_event(text, text, text, text, text, text, text, timestamptz, timestamptz, timestamptz, text, text, jsonb) to service_role;

comment on table public.billing_provider_events is
  'Replay-safe provider event inbox keyed by (provider, environment, event_key). Used for webhook idempotency and attach-request dedupe.';

comment on table public.billing_entitlement_events is
  'Append-style entitlement event log for future canonical entitlement engine. Does not replace public.subscriptions as source of subscription truth.';

notify pgrst, 'reload schema';

commit;