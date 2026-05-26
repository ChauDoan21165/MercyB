-- Apple IAP support for Mercy Blade
-- Keeps public.subscriptions canonical and provider-explicit.

create table if not exists public.apple_iap_events (
  id bigserial primary key,
  provider text not null default 'apple',
  event_source text not null check (event_source in ('device_sync', 'server_notification')),
  dedupe_key text not null,
  user_id uuid null,
  notification_uuid text null,
  original_transaction_id text null,
  transaction_id text null,
  signed_date timestamptz null,
  raw_payload jsonb not null,
  created_at timestamptz not null default now(),
  processed_at timestamptz null,
  constraint apple_iap_events_dedupe_key_key unique (dedupe_key)
);

create index if not exists apple_iap_events_original_transaction_id_idx
  on public.apple_iap_events (original_transaction_id);

create index if not exists apple_iap_events_transaction_id_idx
  on public.apple_iap_events (transaction_id);

create index if not exists apple_iap_events_user_id_idx
  on public.apple_iap_events (user_id);

create unique index if not exists subscriptions_provider_subscription_id_key
  on public.subscriptions (provider, provider_subscription_id);

alter table public.subscriptions
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists canceled_at timestamptz null,
  add column if not exists trial_start timestamptz null,
  add column if not exists trial_end timestamptz null,
  add column if not exists metadata jsonb not null default '{}'::jsonb;