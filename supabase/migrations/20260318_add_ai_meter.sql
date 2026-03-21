create extension if not exists pgcrypto;

create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  feature text not null,
  model text not null,
  request_id text,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  estimated_cost_vnd numeric(12,2) not null default 0 check (estimated_cost_vnd >= 0),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists ai_usage_logs_user_id_created_at_idx
  on public.ai_usage_logs (user_id, created_at desc);

create index if not exists ai_usage_logs_feature_created_at_idx
  on public.ai_usage_logs (feature, created_at desc);

create index if not exists ai_usage_logs_request_id_idx
  on public.ai_usage_logs (request_id)
  where request_id is not null;

alter table public.ai_usage_logs enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_usage_logs'
      and policyname = 'Users can read own ai usage logs'
  ) then
    create policy "Users can read own ai usage logs"
      on public.ai_usage_logs
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;


create table if not exists public.ai_product_catalog (
  product_id text primary key,
  recognized_monthly_revenue_vnd numeric(12,2) not null check (recognized_monthly_revenue_vnd >= 0),
  billing_interval text not null check (billing_interval in ('month', 'year')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists ai_product_catalog_is_active_idx
  on public.ai_product_catalog (is_active);

insert into public.ai_product_catalog (
  product_id,
  recognized_monthly_revenue_vnd,
  billing_interval,
  is_active
)
values (
  'prod_UAfnlqhxFFLDE0',
  0,
  'month',
  true
)
on conflict (product_id) do update
set
  recognized_monthly_revenue_vnd = excluded.recognized_monthly_revenue_vnd,
  billing_interval = excluded.billing_interval,
  is_active = excluded.is_active,
  updated_at = timezone('utc', now());


create or replace function public.check_ai_budget(
  p_user_id uuid,
  p_request_reserve_vnd numeric default 0
)
returns table (
  allowed boolean,
  message text,
  reset_at timestamptz,
  usage_ratio numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subscription public.subscriptions%rowtype;
  v_monthly_revenue_vnd numeric(12,2) := 0;
  v_month_start timestamptz;
  v_next_month_start timestamptz;
  v_spend_vnd numeric(12,2) := 0;
  v_cap_vnd numeric(12,2) := 0;
  v_projected_spend_vnd numeric(12,2) := 0;
  v_usage_ratio numeric := 0;
  v_reserve_vnd numeric(12,2) := greatest(coalesce(p_request_reserve_vnd, 0), 0);
begin
  v_month_start := make_timestamptz(
    extract(year from timezone('utc', now()))::int,
    extract(month from timezone('utc', now()))::int,
    1, 0, 0, 0,
    'UTC'
  );
  v_next_month_start := v_month_start + interval '1 month';

  select s.*
  into v_subscription
  from public.subscriptions s
  where s.user_id = p_user_id
    and s.status in ('active', 'trialing', 'grace_period')
    and (
      s.current_period_end is null
      or s.current_period_end > now()
    )
  order by
    case s.status
      when 'active' then 1
      when 'trialing' then 2
      when 'grace_period' then 3
      else 99
    end,
    coalesce(s.current_period_end, s.updated_at) desc,
    s.updated_at desc
  limit 1;

  if not found then
    return query
    select
      false as allowed,
      'Mercy Host is available in paid plans.'::text as message,
      v_next_month_start as reset_at,
      0::numeric as usage_ratio;
    return;
  end if;

  select c.recognized_monthly_revenue_vnd
  into v_monthly_revenue_vnd
  from public.ai_product_catalog c
  where c.product_id = v_subscription.product_id
    and c.is_active = true
  limit 1;

  if coalesce(v_monthly_revenue_vnd, 0) <= 0 then
    return query
    select
      false as allowed,
      'AI budget is not configured for your current plan yet.'::text as message,
      v_next_month_start as reset_at,
      0::numeric as usage_ratio;
    return;
  end if;

  select coalesce(sum(l.estimated_cost_vnd), 0)
  into v_spend_vnd
  from public.ai_usage_logs l
  where l.user_id = p_user_id
    and l.created_at >= v_month_start
    and l.created_at < v_next_month_start;

  v_cap_vnd := round(v_monthly_revenue_vnd * 0.70, 2);
  v_projected_spend_vnd := round(v_spend_vnd + v_reserve_vnd, 2);

  if v_cap_vnd > 0 then
    v_usage_ratio := round(v_projected_spend_vnd / v_cap_vnd, 4);
  else
    v_usage_ratio := 0;
  end if;

  if v_projected_spend_vnd > v_cap_vnd then
    return query
    select
      false as allowed,
      'You’ve used this month’s AI allowance. It resets next month. You can also purchase extra AI usage now.'::text as message,
      v_next_month_start as reset_at,
      v_usage_ratio as usage_ratio;
    return;
  end if;

  return query
  select
    true as allowed,
    'ok'::text as message,
    v_next_month_start as reset_at,
    v_usage_ratio as usage_ratio;
end;
$$;

revoke all on function public.check_ai_budget(uuid, numeric) from public;
grant execute on function public.check_ai_budget(uuid, numeric) to authenticated;
grant execute on function public.check_ai_budget(uuid, numeric) to service_role;