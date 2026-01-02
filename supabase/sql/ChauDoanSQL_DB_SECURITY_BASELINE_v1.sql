-- ChauDoanSQL_BASELINE_v1 — Mercy Ecosystem Billing Core (2026-01-02)
-- Scope: billing tables + webhook audit + service-role-only writes
-- NOTE: This does NOT implement entitlement logic. It emits deterministic signals only.

-- 0) Extensions
create extension if not exists pgcrypto;

-- 1) Types
do $$
begin
  if not exists (select 1 from pg_type where typname = 'billing_provider') then
    create type public.billing_provider as enum ('stripe');
  end if;

  if not exists (select 1 from pg_type where typname = 'billing_event_status') then
    create type public.billing_event_status as enum ('received','verified','processed','failed');
  end if;

  if not exists (select 1 from pg_type where typname = 'billing_subscription_status') then
    create type public.billing_subscription_status as enum (
      'incomplete','incomplete_expired','trialing','active','past_due',
      'canceled','unpaid','paused'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'billing_payment_status') then
    create type public.billing_payment_status as enum (
      'requires_payment_method','requires_confirmation','requires_action',
      'processing','requires_capture','canceled','succeeded','failed','refunded'
    );
  end if;
end $$;

-- 2) Tables

-- 2.1 webhook_events: immutable-ish audit log of inbound provider events (idempotency anchor)
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider public.billing_provider not null default 'stripe',
  event_id text not null,                     -- Stripe event id (evt_...)
  event_type text not null,                   -- Stripe event type
  livemode boolean not null default false,
  api_version text null,
  received_at timestamptz not null default now(),
  verified_at timestamptz null,
  processed_at timestamptz null,
  status public.billing_event_status not null default 'received',
  signature_valid boolean not null default false,

  -- Linkage hints (filled during processing)
  user_id uuid null,
  app_id text null,
  tier text null,
  customer_id text null,                      -- Stripe customer id (cus_...)
  subscription_id text null,                  -- Stripe subscription id (sub_...)
  invoice_id text null,                       -- Stripe invoice id (in_...)
  payment_intent_id text null,                -- Stripe payment intent id (pi_...)

  payload jsonb not null default '{}'::jsonb,
  error text null
);

-- Idempotency: same provider+event_id only once
create unique index if not exists webhook_events_provider_event_id_uq
  on public.webhook_events(provider, event_id);

create index if not exists webhook_events_status_idx
  on public.webhook_events(status, received_at desc);

create index if not exists webhook_events_user_idx
  on public.webhook_events(user_id, received_at desc);

-- 2.2 billing_customers: Stripe customer per (user, app)
create table if not exists public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  provider public.billing_provider not null default 'stripe',
  user_id uuid not null,
  app_id text not null,
  customer_id text not null,                  -- cus_...

  email text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- prevents duplicates per ecosystem scope
  unique (provider, app_id, user_id),
  unique (provider, customer_id)
);

create index if not exists billing_customers_user_app_idx
  on public.billing_customers(user_id, app_id);

-- 2.3 subscriptions: current known subscription state per provider subscription
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  provider public.billing_provider not null default 'stripe',
  user_id uuid not null,
  app_id text not null,

  customer_id text not null,                  -- cus_...
  subscription_id text not null,              -- sub_...
  price_id text null,                         -- price_...
  product_id text null,                       -- prod_...

  status public.billing_subscription_status not null,
  current_period_start timestamptz null,
  current_period_end timestamptz null,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz null,
  ended_at timestamptz null,

  tier text null,                             -- VIP1/VIP3/VIP9 (your mapping)
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (provider, subscription_id)
);

create index if not exists subscriptions_user_app_idx
  on public.subscriptions(user_id, app_id);

create index if not exists subscriptions_status_idx
  on public.subscriptions(status, current_period_end desc);

-- 2.4 payments: invoice/payment_intent outcomes (append/update by webhook)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  provider public.billing_provider not null default 'stripe',
  user_id uuid not null,
  app_id text not null,

  customer_id text null,
  subscription_id text null,
  invoice_id text null,
  payment_intent_id text null,

  amount_total bigint null,                   -- smallest currency unit
  currency text null,
  status public.billing_payment_status not null,
  paid_at timestamptz null,

  tier text null,
  price_id text null,
  product_id text null,

  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists payments_user_app_idx
  on public.payments(user_id, app_id, created_at desc);

create index if not exists payments_provider_ids_idx
  on public.payments(provider, invoice_id, payment_intent_id);

-- 3) Updated_at triggers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'billing_customers_set_updated_at'
  ) then
    create trigger billing_customers_set_updated_at
    before update on public.billing_customers
    for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'subscriptions_set_updated_at'
  ) then
    create trigger subscriptions_set_updated_at
    before update on public.subscriptions
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- 4) RLS + Policies (LOCK DOWN)
alter table public.webhook_events enable row level security;
alter table public.billing_customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

-- Default: no access
revoke all on public.webhook_events from anon, authenticated;
revoke all on public.billing_customers from anon, authenticated;
revoke all on public.subscriptions from anon, authenticated;
revoke all on public.payments from anon, authenticated;

-- Optional read-only for authenticated (personal view) — KEEP OFF by default
-- If you want it later, we add explicit policies, not now.

-- Service role full control (Supabase maps this via service key, not SQL GRANTs),
-- but we still grant to postgres/service_role for clarity in self-hosted contexts.
grant all on public.webhook_events to service_role;
grant all on public.billing_customers to service_role;
grant all on public.subscriptions to service_role;
grant all on public.payments to service_role;

-- 5) Minimal views (safe, optional)
-- A) webhook backlog view for operators
create or replace view public.webhook_events_pending as
select *
from public.webhook_events
where status in ('received','verified')
order by received_at asc;
