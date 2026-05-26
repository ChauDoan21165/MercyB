create extension if not exists pgcrypto;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('stripe', 'apple', 'google')),
  provider_customer_id text,
  provider_subscription_id text,
  provider_transaction_id text,
  provider_original_transaction_id text,
  product_id text,
  environment text check (environment in ('sandbox', 'production')),
  status text not null check (
    status in (
      'active',
      'trialing',
      'grace_period',
      'past_due',
      'paused',
      'expired',
      'revoked'
    )
  ),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  ended_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint subscriptions_provider_identity_chk check (
    provider_subscription_id is not null or provider_transaction_id is not null
  )
);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

create unique index if not exists subscriptions_provider_subscription_id_key
  on public.subscriptions (provider, provider_subscription_id)
  where provider_subscription_id is not null;

create unique index if not exists subscriptions_provider_transaction_id_key
  on public.subscriptions (provider, provider_transaction_id)
  where provider_transaction_id is not null;

create table if not exists public.entitlement_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('stripe', 'apple', 'google')),
  event_type text not null,
  event_id text not null,
  user_id uuid references public.profiles(id) on delete set null,
  payload jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists entitlement_events_user_id_idx
  on public.entitlement_events (user_id);

create unique index if not exists entitlement_events_provider_event_id_key
  on public.entitlement_events (provider, event_id);

alter table public.profiles
  add column if not exists premium_status text not null default 'inactive',
  add column if not exists premium_expires_at timestamptz,
  add column if not exists premium_source text,
  add column if not exists stripe_customer_id text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_premium_status_chk'
  ) then
    alter table public.profiles
      add constraint profiles_premium_status_chk
      check (premium_status in ('active', 'inactive'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_premium_source_chk'
  ) then
    alter table public.profiles
      add constraint profiles_premium_source_chk
      check (
        premium_source is null or premium_source in ('stripe', 'apple', 'google')
      );
  end if;
end $$;