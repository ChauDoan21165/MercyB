-- Smoke checks after applying the Team C migration.

select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'subscriptions'
  and column_name in (
    'provider',
    'provider_subscription_id',
    'provider_customer_id',
    'provider_product_id',
    'provider_price_id',
    'environment',
    'currency_code',
    'billing_interval',
    'billing_interval_count',
    'quantity',
    'trial_started_at',
    'trial_ends_at',
    'current_period_start_at',
    'current_period_end_at',
    'cancel_at',
    'canceled_at',
    'ended_at',
    'provider_metadata'
  )
order by column_name;

select indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('subscriptions', 'billing_provider_events', 'billing_entitlement_events')
order by tablename, indexname;

select proname
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('register_billing_provider_event', 'log_billing_entitlement_event')
order by proname;

select *
from public.register_billing_provider_event(
  p_provider := 'apple',
  p_environment := 'sandbox',
  p_event_key := 'smoke:apple:1',
  p_provider_event_id := 'smoke-event-1',
  p_event_type := 'smoke_test',
  p_payload := '{"ok":true}'::jsonb,
  p_headers := '{"x-test":"1"}'::jsonb,
  p_metadata := '{"smoke":true}'::jsonb
);

select *
from public.register_billing_provider_event(
  p_provider := 'apple',
  p_environment := 'sandbox',
  p_event_key := 'smoke:apple:1',
  p_provider_event_id := 'smoke-event-1',
  p_event_type := 'smoke_test',
  p_payload := '{"ok":true}'::jsonb,
  p_headers := '{"x-test":"1"}'::jsonb,
  p_metadata := '{"smoke":true}'::jsonb
);

select provider, environment, event_key, delivery_count, process_status
from public.billing_provider_events
where event_key = 'smoke:apple:1';
