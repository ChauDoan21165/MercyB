create or replace view public.admin_users_dashboard_v1 as
with profile_base as (
  select
    coalesce(p.user_id, p.id) as auth_user_id,
    p.id as profile_id,
    p.user_id,
    p.email,
    coalesce(p.is_admin, false) as is_admin,
    coalesce(p.admin_level, 0) as admin_level
  from public.profiles p
),
subscription_base as (
  select
    s.id as subscription_id,
    s.user_id as auth_user_id,
    s.status,
    s.environment,
    s.billing_interval,
    s.billing_interval_count,
    s.currency_code,
    coalesce(s.quantity, 1) as quantity,
    s.created_at,
    coalesce(s.current_period_end_at, s.current_period_end) as current_period_end,
    coalesce(s.cancel_at_period_end, false) as cancel_at_period_end,
    s.provider_customer_id,
    s.provider_subscription_id,
    s.raw_payload,
    coalesce(
      nullif(s.billing_interval, ''),
      s.raw_payload->'plan'->>'interval',
      s.raw_payload->'items'->'data'->0->'price'->'recurring'->>'interval',
      'unknown'
    ) as plan_interval,
    upper(
      coalesce(
        nullif(s.currency_code, ''),
        s.raw_payload->>'currency',
        s.raw_payload->'plan'->>'currency',
        'USD'
      )
    ) as normalized_currency_code,
    coalesce(
      nullif((s.raw_payload->'plan'->>'amount')::numeric, null),
      nullif((s.raw_payload->'items'->'data'->0->'price'->>'unit_amount')::numeric, null),
      0
    )::bigint as amount_cents
  from public.subscriptions s
),
joined as (
  select
    sb.subscription_id,
    sb.auth_user_id as user_id,
    pb.profile_id,
    pb.email,
    pb.is_admin,
    pb.admin_level,
    sb.status,
    sb.environment,
    sb.plan_interval,
    sb.normalized_currency_code as currency_code,
    sb.amount_cents,
    sb.quantity,
    sb.created_at,
    sb.current_period_end,
    sb.cancel_at_period_end,
    sb.provider_customer_id,
    sb.provider_subscription_id,
    case when pb.auth_user_id is null then true else false end as missing_profile,
    case when coalesce(nullif(trim(pb.email), ''), '') = '' then true else false end as unknown_email,
    case when coalesce(nullif(trim(sb.plan_interval), ''), 'unknown') = 'unknown' then true else false end as unknown_plan,
    case when sb.status = 'active' and coalesce(sb.amount_cents, 0) <= 0 then true else false end as unknown_amount
  from subscription_base sb
  left join profile_base pb
    on pb.auth_user_id = sb.auth_user_id
)
select
  subscription_id,
  user_id,
  profile_id,
  coalesce(nullif(trim(email), ''), 'unknown') as email,
  is_admin,
  admin_level,
  status,
  environment,
  plan_interval,
  currency_code,
  amount_cents,
  quantity,
  created_at,
  current_period_end,
  cancel_at_period_end,
  provider_customer_id,
  provider_subscription_id,
  missing_profile,
  unknown_email,
  unknown_plan,
  unknown_amount,
  (
    array_remove(
      array[
        case when missing_profile then 'missing_profile' end,
        case when unknown_email then 'unknown_email' end,
        case when unknown_plan then 'unknown_plan' end,
        case when unknown_amount then 'unknown_amount' end,
        case when cancel_at_period_end then 'canceling_soon' end,
        case when environment = 'sandbox' then 'sandbox_row' end
      ],
      null
    )
  )::text[] as anomaly_flags
from joined;

create or replace function public.admin_users_dashboard_kpis_v1()
returns table (
  production_active_count bigint,
  production_trialing_count bigint,
  monthly_count bigint,
  yearly_count bigint,
  canceling_soon_count bigint,
  sandbox_count bigint,
  missing_profile_count bigint,
  unknown_email_count bigint,
  estimated_mrr numeric,
  estimated_arr numeric
)
language sql
security definer
as $$
  with base as (
    select *
    from public.admin_users_dashboard_v1
  ),
  active_prod as (
    select *
    from base
    where environment = 'production'
      and status = 'active'
  )
  select
    (select count(*) from base where environment = 'production' and status = 'active') as production_active_count,
    (select count(*) from base where environment = 'production' and status = 'trialing') as production_trialing_count,
    (select count(*) from active_prod where plan_interval = 'month') as monthly_count,
    (select count(*) from active_prod where plan_interval = 'year') as yearly_count,
    (select count(*) from active_prod where cancel_at_period_end = true) as canceling_soon_count,
    (select count(*) from base where environment = 'sandbox') as sandbox_count,
    (select count(*) from base where missing_profile = true) as missing_profile_count,
    (select count(*) from base where unknown_email = true) as unknown_email_count,
    (
      select coalesce(sum(
        case
          when plan_interval = 'month' then (amount_cents * quantity) / 100.0
          when plan_interval = 'year' then ((amount_cents * quantity) / 100.0) / 12.0
          else 0
        end
      ), 0)
      from active_prod
    ) as estimated_mrr,
    (
      select coalesce(sum(
        case
          when plan_interval = 'month' then ((amount_cents * quantity) / 100.0) * 12.0
          when plan_interval = 'year' then (amount_cents * quantity) / 100.0
          else 0
        end
      ), 0)
      from active_prod
    ) as estimated_arr;
$$;