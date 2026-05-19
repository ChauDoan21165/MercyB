-- supabase/migrations/20260403_billing_price_map.sql

begin;

create extension if not exists pgcrypto;

create table if not exists public.billing_price_map (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('stripe', 'apple', 'google')),
  price_id text not null,
  plan_name text not null,
  billing_interval text not null check (
    billing_interval in ('day', 'week', 'month', 'year')
  ),
  interval_count integer not null default 1 check (interval_count > 0),
  monthly_amount numeric(12,2) not null default 0,
  yearly_amount numeric(12,2),
  currency text not null default 'VND',
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_price_map_provider_price_id_key
    unique (provider, price_id)
);

-- Remove placeholder seed rows from earlier (pre-billing) setup so they are
-- never present in a fresh env / db push. (Live prod still carried these with
-- is_active=true due to migration drift; a one-shot SQL Editor patch was run
-- by hand to clear them + reconcile the yearly id on the live database — see
-- the feat/stripe-yearly-price-reconciliation PR.)
delete from public.billing_price_map
where price_id in ('price_replace_monthly', 'price_replace_yearly');

-- Upsert real Stripe price mappings
insert into public.billing_price_map (
  provider,
  price_id,
  plan_name,
  billing_interval,
  interval_count,
  monthly_amount,
  yearly_amount,
  currency,
  is_active,
  notes
)
values
  (
    'stripe',
    'price_1TCKY02K1tPxy04uCHQNbvik',
    'VIP Monthly',
    'month',
    1,
    200000.00,
    null,
    'VND',
    true,
    'Live Stripe monthly price id'
  ),
  (
    'stripe',
    'price_1TCKSF2K1tPxy04uNeKcQWp5',
    'VIP Yearly',
    'year',
    1,
    166666.67,
    2000000.00,
    'VND',
    true,
    'Live Stripe yearly price id (reconciled A1: matches Pricing.tsx + all active yearly subscriptions; yearly_amount normalized to monthly MRR via monthly_amount)'
  )
on conflict (provider, price_id) do update
set
  plan_name = excluded.plan_name,
  billing_interval = excluded.billing_interval,
  interval_count = excluded.interval_count,
  monthly_amount = excluded.monthly_amount,
  yearly_amount = excluded.yearly_amount,
  currency = excluded.currency,
  is_active = excluded.is_active,
  notes = excluded.notes,
  updated_at = now();

drop view if exists public.billing_mrr_inputs_v;

create view public.billing_mrr_inputs_v as
select
  s.user_id,
  s.provider,
  s.provider_subscription_id,
  s.provider_price_id,
  s.provider_product_id,
  s.product_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  bpm.plan_name,
  bpm.billing_interval,
  bpm.interval_count,
  bpm.currency,
  bpm.monthly_amount as mapped_monthly_amount,
  bpm.yearly_amount as mapped_yearly_amount
from public.subscriptions s
left join public.billing_price_map bpm
  on bpm.provider = s.provider::text
 and bpm.price_id = s.provider_price_id
 and bpm.is_active = true
where s.status in ('active', 'trialing', 'past_due');

commit;