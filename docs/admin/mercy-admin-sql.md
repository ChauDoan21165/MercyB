# Mercy Blade Admin SQL — Safe Cleanup + Core Queries

## Part 1 — Safe step-by-step cleanup script

Run these in order.

### Step 1 — Check current production vs sandbox subscription counts
```sql
select
  environment,
  status,
  count(*) as users
from subscriptions
group by environment, status
order by environment, status;
```

### Step 2 — Check monthly vs yearly active production subscriptions
```sql
select
  coalesce(
    nullif(billing_interval, ''),
    raw_payload->'plan'->>'interval',
    raw_payload->'items'->'data'->0->'price'->'recurring'->>'interval'
  ) as plan_interval,
  count(*) as users
from subscriptions
where status = 'active'
  and environment = 'production'
group by 1
order by users desc;
```

### Step 3 — Inspect production subscriptions joined to profiles
This shows which subscriptions already have matching profile rows and emails.
```sql
select
  s.user_id as subscription_user_id,
  p.user_id as profile_user_id,
  p.email,
  s.status,
  s.environment,
  s.created_at
from subscriptions s
left join profiles p
  on p.user_id = s.user_id
where s.environment = 'production'
order by s.created_at desc;
```

### Step 4 — Inspect specific profile emails for the subscribed users
```sql
select
  p.user_id,
  p.email as profile_email,
  u.email as auth_email
from profiles p
left join auth.users u
  on u.id = p.user_id
where p.user_id in (
  'cd9b889c-eb9f-428f-9462-de66d4f92c04',
  '397a6ab7-1d3a-480f-9f02-9021a438d02a',
  '04c57155-b479-4615-bb78-d036bb91dbf2',
  '115c2ecf-c215-4147-988c-37ad9cb516a0',
  'ab5a2081-7cd8-4f77-b29b-1eafa93fbc62'
);
```

### Step 5 — Fill missing emails into existing profile rows
```sql
update profiles p
set email = u.email
from auth.users u
where p.user_id = u.id
  and coalesce(trim(p.email), '') = '';
```

### Step 6 — Find auth rows for subscription users missing a profile
```sql
select id, email
from auth.users
where id in (
  '115c2ecf-c215-4147-988c-37ad9cb516a0',
  'ab5a2081-7cd8-4f77-b29b-1eafa93fbc62'
);
```

### Step 7 — Insert missing profile rows for those subscribed users
```sql
insert into profiles (user_id, email, is_admin, admin_level)
select
  u.id,
  u.email,
  false,
  0
from auth.users u
where u.id in (
  '115c2ecf-c215-4147-988c-37ad9cb516a0',
  'ab5a2081-7cd8-4f77-b29b-1eafa93fbc62'
)
and not exists (
  select 1
  from profiles p
  where p.user_id = u.id
);
```

### Step 8 — Verify the production join again
After steps 5–7, rerun this:
```sql
select
  s.user_id as subscription_user_id,
  p.user_id as profile_user_id,
  p.email,
  s.status,
  s.environment,
  s.created_at
from subscriptions s
left join profiles p
  on p.user_id = s.user_id
where s.environment = 'production'
order by s.created_at desc;
```

### Step 9 — Fix malformed admin profile row
First get the real auth ID for the admin email:
```sql
select id, email
from auth.users
where lower(email) = 'cd12536@gmail.com';
```

Then replace the UUID below with the real value from the query above:
```sql
update profiles
set user_id = '9957f25a-7b58-4a17-a3f2-4b91e63e69ae'
where lower(email) = 'cd12536@gmail.com'
  and user_id is null;
```

### Step 10 — Ensure admin flags are set correctly
```sql
update profiles
set is_admin = true,
    admin_level = 9
where lower(email) = 'cd12536@gmail.com';
```

Verify:
```sql
select user_id, email, is_admin, admin_level
from profiles
where lower(email) = 'cd12536@gmail.com';
```

### Step 11 — Keep / reuse the admin profile read policy
This already exists in your project, so you do not need to recreate it unless you delete it.
```sql
create policy "admins can read all profiles"
on profiles
for select
using (
  exists (
    select 1
    from profiles me
    where me.user_id = auth.uid()
      and (
        coalesce(me.is_admin, false) = true
        or coalesce(me.admin_level, 0) >= 1
      )
  )
);
```

### Step 12 — Optional cleanup: preview sandbox subscriptions
```sql
select
  user_id,
  status,
  environment,
  provider_customer_id,
  provider_subscription_id,
  created_at
from subscriptions
where environment = 'sandbox'
order by created_at desc;
```

### Step 13 — Optional cleanup: delete sandbox subscriptions
Only run this if you want to remove test billing rows.
```sql
delete from subscriptions
where environment = 'sandbox';
```

### Step 14 — Final verification queries
```sql
select
  environment,
  status,
  count(*) as users
from subscriptions
group by environment, status
order by environment, status;
```

```sql
select
  coalesce(
    nullif(billing_interval, ''),
    raw_payload->'plan'->>'interval',
    raw_payload->'items'->'data'->0->'price'->'recurring'->>'interval'
  ) as plan_interval,
  count(*) as users
from subscriptions
where status = 'active'
  and environment = 'production'
group by 1
order by users desc;
```

```sql
select
  s.user_id as subscription_user_id,
  p.user_id as profile_user_id,
  p.email,
  s.status,
  s.environment,
  s.created_at
from subscriptions s
left join profiles p
  on p.user_id = s.user_id
where s.environment = 'production'
order by s.created_at desc;
```

---

## Part 2 — The 6 core queries to save for future use

### A. Production vs sandbox counts
```sql
select environment, status, count(*) as users
from subscriptions
group by environment, status
order by environment, status;
```

### B. Monthly vs yearly active production subscriptions
```sql
select
  coalesce(
    nullif(billing_interval, ''),
    raw_payload->'plan'->>'interval',
    raw_payload->'items'->'data'->0->'price'->'recurring'->>'interval'
  ) as plan_interval,
  count(*) as users
from subscriptions
where status = 'active'
  and environment = 'production'
group by 1
order by users desc;
```

### C. Production subscribers with auth email
```sql
select
  u.email,
  s.status,
  s.environment,
  coalesce(
    nullif(s.billing_interval, ''),
    s.raw_payload->'plan'->>'interval',
    s.raw_payload->'items'->'data'->0->'price'->'recurring'->>'interval'
  ) as plan_interval,
  s.created_at
from subscriptions s
join auth.users u on u.id = s.user_id
where s.environment = 'production'
order by s.created_at desc;
```

### D. Production subscriptions joined to profiles
```sql
select
  s.user_id as subscription_user_id,
  p.user_id as profile_user_id,
  p.email,
  s.status,
  s.environment,
  s.created_at
from subscriptions s
left join profiles p on p.user_id = s.user_id
where s.environment = 'production'
order by s.created_at desc;
```

### E. Fill missing profile emails
```sql
update profiles p
set email = u.email
from auth.users u
where p.user_id = u.id
  and coalesce(trim(p.email), '') = '';
```

### F. Insert missing profile rows for subscribed users
```sql
insert into profiles (user_id, email, is_admin, admin_level)
select
  u.id,
  u.email,
  false,
  0
from auth.users u
where u.id in (
  '115c2ecf-c215-4147-988c-37ad9cb516a0',
  'ab5a2081-7cd8-4f77-b29b-1eafa93fbc62'
)
and not exists (
  select 1
  from profiles p
  where p.user_id = u.id
);
```

## Suggested repo path to save this file

Save it at:

```text
docs/admin/mercy-admin-sql.md
```

That is a good place because:
- it is easy to find later
- it keeps admin operations documented
- it can grow as your billing/admin system grows
