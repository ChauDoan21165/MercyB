-- supabase/migrations/20260402_admin_billing_metrics.sql

create or replace view public.billing_active_subscriptions_v as
select
  s.user_id,
  s.provider,
  s.provider_subscription_id,
  s.provider_customer_id,
  s.provider_price_id,
  s.provider_product_id,
  s.product_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.created_at,
  s.updated_at
from public.subscriptions s
where s.status in ('active', 'trialing', 'grace_period', 'past_due');

create or replace view public.billing_subscription_events_v as
select
  e.provider,
  e.event_type,
  e.event_id,
  e.user_id,
  e.created_at
from public.entitlement_events e;

create or replace view public.billing_mrr_inputs_v as
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
  coalesce(st.price_monthly, 0) as mapped_monthly_amount
from public.subscriptions s
left join public.subscription_tiers st
  on lower(st.name) = lower(
    case
      when s.provider_price_id ilike '%level1%' then 'Level 1'
      when s.provider_price_id ilike '%level3%' then 'Level 3'
      when s.provider_price_id ilike '%level9%' then 'Level 9'
      else s.product_id
    end
  )
where s.status in ('active', 'trialing', 'grace_period', 'past_due');

create or replace view public.billing_recent_subscription_changes_v as
select
  s.user_id,
  p.email,
  s.provider,
  s.provider_subscription_id,
  s.provider_customer_id,
  s.provider_price_id,
  s.provider_product_id,
  s.product_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.canceled_at,
  s.ended_at,
  s.updated_at,
  s.created_at
from public.subscriptions s
left join public.profiles p
  on p.id = s.user_id
order by s.updated_at desc nulls last, s.created_at desc nulls last;