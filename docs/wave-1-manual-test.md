# Wave 1 — Manual Test Script

Run this on **staging** before merging. Tests both P0-1 (delete-account exhaustive wipe) and P0-4 (Reset Mercy's memory).

Prereqs: service-role access to Supabase SQL Editor for project `buemdfxyhxunzpgdoqin`.

---

## Test 1 — delete-account wipes all user-owned tables (P0-1)

### Step 1.1 — Create a throwaway test account

Use the real app sign-up flow (or `auth.admin.createUser` via SQL). Make a note of the email and the `auth.users.id` UUID.

Example (Supabase SQL Editor):

```sql
-- Run once. Returns the user_id in the response.
select id from auth.users where email = 'your-test-email@example.com';
```

Copy that UUID. Below I'll call it `:uid`. **Replace `:uid` with the real UUID everywhere before running.**

### Step 1.2 — Seed data in every user-owned table

Paste these into SQL Editor. Some rows may fail if the table shape has drifted — record and investigate but continue; the point is to seed as much as the schema will accept.

```sql
-- Personal learning / progress / memory (delete targets)
insert into user_room_progress (user_id, app_id, room_id, progress_pct, repeat_count)          values (':uid', 'mercyblade', 'test_room', 42, 1) on conflict do nothing;
insert into user_path_progress (user_id, app_id, path_id, current_day, completed_days, progress_pct, repeat_count)
  values (':uid', 'mercyblade', (select id from paths limit 1), 1, '[]'::jsonb, 10, 0) on conflict do nothing;
insert into user_points     (user_id, total_points) values (':uid', 100) on conflict (user_id) do update set total_points = 100;
insert into user_sessions   (user_id, session_id, device_type, last_activity) values (':uid', 'test-session', 'web', now());
insert into point_transactions (user_id, points, transaction_type, description) values (':uid', 10, 'manual_test', 'wave 1 seed');
insert into teacher_memory  (user_id, memory)       values (':uid', '{"test": true}'::jsonb) on conflict (user_id) do update set memory = '{"test": true}'::jsonb;
insert into speech_attempts (user_id, room_id, line_id, target_text) values (':uid', 'test_room', 'line1', 'hello world');
insert into room_reflections (user_id, room_id, reflection_text, copied_to_teacher_mercy) values (':uid', 'test_room', 'seeded reflection', false);
insert into user_notebook_items (user_id, item_type, content_en, source) values (':uid', 'word', 'hello', 'manual') on conflict do nothing;
insert into mb_user_progress_narratives  (user_id, narrative_type, title, body, evidence) values (':uid', 'weekly', 'seed', 'seed body', '{}'::jsonb);
insert into mb_user_progress_snapshots   (user_id, window_start, window_end, mode, metrics) values (':uid', now() - interval '7 days', now(), 'test', '{}'::jsonb);
insert into mb_user_room_weekly_pronunciation (user_id, room_id, week_start, week_end, computed_at) values (':uid', 'test_room', (current_date - 7)::date, current_date, now());
insert into favorite_tracks (user_id)                 values (':uid') on conflict do nothing;
insert into favorite_rooms  (user_id, room_id)        values (':uid', 'test_room') on conflict do nothing;

-- Financial / audit / security (anonymize targets)
insert into apple_iap_events        (user_id) values (':uid') on conflict do nothing;
insert into billing_customers       (user_id) values (':uid') on conflict do nothing;
insert into user_subscriptions      (user_id, status) values (':uid', 'active') on conflict do nothing;
insert into user_entitlements       (user_id) values (':uid') on conflict do nothing;
insert into entitlement_events      (user_id) values (':uid');
insert into feedback                (user_id, message) values (':uid', 'public feedback that should be anonymized');
insert into security_events         (user_id) values (':uid');
insert into user_role_audit         (actor_user_id, target_user_id) values (':uid', ':uid');

-- Confirm seed counts (should all be non-zero):
select 'user_room_progress' t, count(*) c from user_room_progress where user_id = ':uid' union all
select 'user_path_progress',     count(*) from user_path_progress where user_id = ':uid' union all
select 'user_points',            count(*) from user_points where user_id = ':uid' union all
select 'user_sessions',          count(*) from user_sessions where user_id = ':uid' union all
select 'point_transactions',     count(*) from point_transactions where user_id = ':uid' union all
select 'teacher_memory',         count(*) from teacher_memory where user_id = ':uid' union all
select 'speech_attempts',        count(*) from speech_attempts where user_id = ':uid' union all
select 'room_reflections',       count(*) from room_reflections where user_id = ':uid' union all
select 'user_notebook_items',    count(*) from user_notebook_items where user_id = ':uid' union all
select 'mb_user_progress_narratives',       count(*) from mb_user_progress_narratives where user_id = ':uid' union all
select 'mb_user_progress_snapshots',        count(*) from mb_user_progress_snapshots where user_id = ':uid' union all
select 'mb_user_room_weekly_pronunciation', count(*) from mb_user_room_weekly_pronunciation where user_id = ':uid' union all
select 'favorite_tracks',        count(*) from favorite_tracks where user_id = ':uid' union all
select 'favorite_rooms',         count(*) from favorite_rooms where user_id = ':uid' union all
select 'apple_iap_events',       count(*) from apple_iap_events where user_id = ':uid' union all
select 'billing_customers',      count(*) from billing_customers where user_id = ':uid' union all
select 'user_subscriptions',     count(*) from user_subscriptions where user_id = ':uid' union all
select 'user_entitlements',      count(*) from user_entitlements where user_id = ':uid' union all
select 'entitlement_events',     count(*) from entitlement_events where user_id = ':uid' union all
select 'feedback',               count(*) from feedback where user_id = ':uid' union all
select 'security_events',        count(*) from security_events where user_id = ':uid' union all
select 'user_role_audit actor',  count(*) from user_role_audit where actor_user_id = ':uid' union all
select 'user_role_audit target', count(*) from user_role_audit where target_user_id = ':uid';
```

### Step 1.3 — Trigger delete-account

Two options:

**Option A (recommended)** — sign in as the test account in a browser, go to Account → "Delete my account" → type DELETE → confirm. This exercises the full client path.

**Option B** — hit the edge function directly. Requires a JWT for the test user (copy from browser dev tools network tab, or use `supabase.auth.signInWithPassword` via a script).

```bash
curl -X POST "https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/delete-account" \
  -H "Authorization: Bearer $TEST_USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected JSON response: `{ "success": true, "report": { "deleted": [...], "anonymized": [...], "errors": [] } }`.

If `errors` is non-empty, those table operations failed — investigate before merging. Most common cause: table exists in schema but service role lacks DELETE/UPDATE grant (fix via explicit `GRANT DELETE ON ... TO service_role;` migration).

### Step 1.4 — Verify every table is wiped

Paste this. **Every row in the `count` column should be 0** for delete targets. For anonymize targets, `feedback` / `billing_customers` / etc. rows should still exist globally, just with `user_id = NULL` for the wiped user.

```sql
-- DELETE targets — must all be 0
select 'user_room_progress' t, count(*) c from user_room_progress where user_id = ':uid' union all
select 'user_path_progress',     count(*) from user_path_progress where user_id = ':uid' union all
select 'user_points',            count(*) from user_points where user_id = ':uid' union all
select 'user_sessions',          count(*) from user_sessions where user_id = ':uid' union all
select 'point_transactions',     count(*) from point_transactions where user_id = ':uid' union all
select 'teacher_memory',         count(*) from teacher_memory where user_id = ':uid' union all
select 'speech_attempts',        count(*) from speech_attempts where user_id = ':uid' union all
select 'room_reflections',       count(*) from room_reflections where user_id = ':uid' union all
select 'user_notebook_items',    count(*) from user_notebook_items where user_id = ':uid' union all
select 'mb_user_progress_narratives',       count(*) from mb_user_progress_narratives where user_id = ':uid' union all
select 'mb_user_progress_snapshots',        count(*) from mb_user_progress_snapshots where user_id = ':uid' union all
select 'mb_user_room_weekly_pronunciation', count(*) from mb_user_room_weekly_pronunciation where user_id = ':uid' union all
select 'favorite_tracks',        count(*) from favorite_tracks where user_id = ':uid' union all
select 'favorite_rooms',         count(*) from favorite_rooms where user_id = ':uid' union all
select 'profiles',               count(*) from profiles where id = ':uid' union all
select 'auth.users',              count(*) from auth.users where id = ':uid';

-- ANONYMIZE targets — rows should still exist (for table-wide audit), but
-- the user linkage should be NULL. Each query should return 0.
select 'apple_iap_events still linked' t, count(*) c from apple_iap_events where user_id = ':uid' union all
select 'billing_customers still linked',    count(*) from billing_customers where user_id = ':uid' union all
select 'user_subscriptions still linked',   count(*) from user_subscriptions where user_id = ':uid' union all
select 'user_entitlements still linked',    count(*) from user_entitlements where user_id = ':uid' union all
select 'entitlement_events still linked',   count(*) from entitlement_events where user_id = ':uid' union all
select 'feedback still linked',             count(*) from feedback where user_id = ':uid' union all
select 'security_events still linked',      count(*) from security_events where user_id = ':uid' union all
select 'user_role_audit actor still linked',  count(*) from user_role_audit where actor_user_id = ':uid' union all
select 'user_role_audit target still linked', count(*) from user_role_audit where target_user_id = ':uid';
```

**Expected:** every `c` column is `0`. If any row is non-zero, that's a gap — update the manifest and re-run.

### Step 1.6 — Verify PII scrub on anonymized rows

Nulling `user_id` alone is not GDPR-safe for tables with free-text columns or
jsonb payloads that can contain identifying content. Confirm the scrub_columns
overlay ran for the rows we anonymized above (seeded with the test `:uid`):

```sql
-- feedback.message must be '[deleted]', not the seeded text.
select id, user_id, message from feedback where message = 'public feedback that should be anonymized';
-- Expected: zero rows. If the original message text is still present,
-- scrub_columns did not apply.

-- Pattern for other scrubbed tables: confirm by checking PII columns are
-- null / '[deleted]' on the anonymized rows. Substitute the seeded row
-- identifiers as needed.
select id, raw_payload from apple_iap_events where raw_payload is not null
  and created_at >= now() - interval '1 hour';
-- Expected: zero newly-seeded rows still carrying raw_payload.

select id, ip_address, user_agent, metadata from security_events
  where created_at >= now() - interval '1 hour'
    and (ip_address is not null or user_agent is not null or metadata is not null);
-- Expected: zero rows — all three columns must be NULL for freshly anonymized rows.

select id, email, customer_id from billing_customers
  where created_at >= now() - interval '1 hour'
    and (email is not null or customer_id is not null);
-- Expected: zero rows.

select id, message_content from user_moderation_violations
  where created_at >= now() - interval '1 hour'
    and message_content != '[deleted]';
-- Expected: zero rows — original violating message text must be scrubbed.
```

If any of these queries return rows, the scrub overlay failed for that table.
Check the edge function `report.errors` JSON response — the update likely
returned an error (most often a missing column in the live schema or a RLS
grant issue).

### Step 1.5 — Broad sweep (belt + suspenders)

Confirm no stray orphans by scanning every table in the manifest:

```sql
-- Any non-view entry that still has the user_id should fail this.
-- Expected: zero rows returned.
select table_name, column_name
from information_schema.columns
where column_name in ('user_id', 'admin_user_id', 'actor_user_id', 'target_user_id', 'sender_id', 'receiver_id')
  and table_schema = 'public'
  and (table_name, column_name) not in (
    -- views auto-clean; skip them
    select table_name, 'user_id' from information_schema.views where table_schema = 'public'
  );
```

For each row returned, run `select count(*) from <table_name> where <column_name> = ':uid';`. All should be 0.

---

## Test 2 — Reset Mercy's memory (P0-4)

### Step 2.1 — Sign in as a different test account (or recreate).

### Step 2.2 — Seed teacher_memory + localStorage

In SQL Editor:

```sql
insert into teacher_memory (user_id, memory) values (':uid', '{"personality": "test"}'::jsonb)
  on conflict (user_id) do update set memory = '{"personality": "test"}'::jsonb;

select count(*) from teacher_memory where user_id = ':uid';  -- should be 1
```

In the browser (DevTools console, while signed in):

```js
localStorage.setItem('mercy_host_memory', JSON.stringify({ v: 6, lastRoom: 'seeded' }));
localStorage.setItem('mercy_host_logs', JSON.stringify([{ event: 'seeded', timestampISO: new Date().toISOString() }]));
localStorage.setItem('mercy_curriculum_tracker', JSON.stringify({ v: 1, topics: {} }));
```

### Step 2.3 — Trigger the reset

On the Account page, click **"Reset Mercy's memory"** → type `RESET` → confirm.

Expected:
- Green success banner appears: "Mercy's memory has been reset."
- Confirmation dialog disappears.

### Step 2.4 — Verify

SQL:

```sql
select count(*) from teacher_memory where user_id = ':uid';  -- should be 0
```

Browser console:

```js
localStorage.getItem('mercy_host_memory');      // should be null
localStorage.getItem('mercy_host_logs');        // should be null
localStorage.getItem('mercy_curriculum_tracker'); // should be null
```

### Step 2.5 — Regression check

Navigate to a room and open Mercy. She should greet the user as if new (no "welcome back" / no streak reference from the wiped memory). Account + progress + points should all be intact (only Mercy memory was reset).

---

## Exit criteria

- **Test 1** all tables show 0 for the deleted user; anonymize-target rows still exist globally with `user_id = NULL`.
- **Test 2** Supabase teacher_memory row gone, localStorage keys gone, account otherwise intact.
- `scripts/check-delete-account-coverage.mjs` prints `OK — manifest covers all N live user-id tables.`

If any step fails, fix on the branch, re-push, re-run the test. Do not merge until green.
