# Wave 2 Step 3 — Manual Test Plan

Persists CC1's pronunciation scoring results into `speech_attempts`.
Adds an admin SELECT overlay and a per-user rollup view.

Run this on **staging** before merging.

Prereqs:
- Migration `20260426000000_speech_attempts_persistence.sql` applied.
- Branch `feat/history-wave-2-step-3-speech` deployed to staging.
- Both feature flags ON in env:
  - `VITE_PRONUNCIATION_SCORING_ENABLED=true` (or DB feature_flags row enabled)
  - `VITE_SPEECH_PERSISTENCE_ENABLED=true`
- A test user account.

Vocabulary: `:uid` = test user's `auth.users.id`. Replace before running.

---

## Test 1 — Single attempt persists end-to-end

1. Sign in. Navigate to `/speak`.
2. Click the mic, say the prompted English sentence aloud.
3. Wait for the score card to appear.
4. Within ~1 second, query:
   ```sql
   select id, target_text, transcript, overall_score, elapsed_ms,
          jsonb_array_length(word_scores) as word_count,
          context, attempted_at
     from speech_attempts
    where user_id = ':uid'
    order by attempted_at desc
    limit 1;
   ```
   **Expected:** one row, `target_text` matches the prompt, `transcript` matches what you said,
   `overall_score` between 0 and 100, `word_scores` jsonb has at least 1 element,
   `elapsed_ms > 0`, `context` includes `{ "source": "speech_drill_page", "elapsed_ms": ... }`,
   `attempted_at` within the last few seconds.

## Test 2 — Multiple attempts append (no UPDATE / DELETE allowed)

1. Repeat the drill 3 more times.
2. ```sql
   select count(*) from speech_attempts where user_id = ':uid';
   -- Expected: previous count + 4 (one per attempt).
   ```
3. Try to UPDATE from the client (DevTools console, while signed in as the test user):
   ```js
   const { error } = await supabase
     .from('speech_attempts')
     .update({ overall_score: 100 })
     .eq('user_id', '<your-uuid>');
   console.log(error?.message);
   ```
   **Expected:** error like `permission denied for table speech_attempts`
   OR a no-op (0 rows updated). Append-only is enforced via RLS.

## Test 3 — RLS — own-row only for non-admins

1. Sign in as a NON-ADMIN test user (`admin_level < 9`).
2. ```js
   const { data, error } = await supabase
     .from('speech_attempts')
     .select('user_id')
     .neq('user_id', '<your-own-uuid>')
     .limit(5);
   console.log(data, error);
   ```
   **Expected:** `data` is an empty array. RLS filters out other users' rows.

## Test 4 — Admin overlay — level 9+ sees everyone

1. Sign in as an admin (`admin_level >= 9`).
2. Same query as Test 3.
3. **Expected:** non-empty `data` containing rows from multiple users.

## Test 5 — Rollup view returns user aggregates

1. Sign in as the test user from Test 2 (so they have ≥ 4 attempts).
2. ```sql
   select * from v_user_pronunciation_stats where user_id = ':uid';
   ```
   **Expected:** one row.
   - `attempts_7d`, `attempts_30d`, `attempts_90d` ≥ 4.
   - `avg_score_7d` between 0 and 100.
   - `last_attempt_at` matches the most recent attempted_at.
   - `median_elapsed_ms_90d` is a positive number.

3. As a non-admin user with no attempts:
   ```sql
   select count(*) from v_user_pronunciation_stats where user_id = ':their_uid';
   -- Expected: 0 (nothing aggregates because no rows in base table).
   ```

## Test 6 — Score clamping (server check constraint)

1. As an admin (with service-role bypass via SQL Editor), try to insert an out-of-range score:
   ```sql
   insert into speech_attempts (user_id, room_id, line_id, target_text, transcript, overall_score, attempted_at)
     values (':uid', 'test_room', 'test_line', 'hi', 'hi', 200, now());
   -- Expected: ERROR: new row for relation "speech_attempts" violates check constraint
   --          "speech_attempts_overall_score_range"
   ```

2. The client-side service already clamps before insert (unit test
   `recordSpeechAttempt — happy path > clamps overall_score outside 0..100`).
   This server-side constraint is defense-in-depth.

## Test 7 — Feature flag OFF → no insert, scoring still works

1. Set `VITE_SPEECH_PERSISTENCE_ENABLED=false` and redeploy.
2. Run a drill on `/speak`.
3. Query:
   ```sql
   select count(*) from speech_attempts
     where user_id = ':uid' and attempted_at > now() - interval '1 minute';
   -- Expected: 0 (no insert when flag is off).
   ```
4. The score still renders in the UI — only persistence is gated.

## Test 8 — Anonymous user → no insert (no crash)

1. Sign out.
2. Navigate to `/speak`. (If `pronunciationScoringEnabled` flag is global,
   you can still reach the page; if it's per-user, this step is skipped.)
3. Confirm no JS errors in the console and no insert lands.

## Test 9 — delete-account wipes attempts

1. As a user with ≥ 1 attempt, trigger account deletion (Account → Delete my account → type DELETE).
2. ```sql
   select count(*) from speech_attempts where user_id = ':uid';
   -- Expected: 0
   ```
   (Already covered by the Wave 1 manifest entry — this is a regression check.)

---

## Exit criteria

- All 9 tests pass.
- `npm run typecheck`, `npx vite build`, `npx vitest run` green locally.
- 11 unit tests for `recordSpeechAttempt` pass:
  ```bash
  npx vitest run src/services/__tests__/speechAttempts.test.ts
  ```

## Notes

- **Why a plain view, not a materialized view + cron:** at our cohort size (~115 users
  even if every one made 50 attempts/week, that's only ~6k rows/week). PostgreSQL
  aggregates this in milliseconds. No need for cron complexity. Switch to MATERIALIZED
  + `pg_cron` only when read latency becomes measurable.
- **No UPDATE / DELETE policy:** absence is intentional — RLS fail-closed. Only
  `service_role` (edge functions) can mutate, which is the existing
  `speech_attempts_service_role` policy from migration `20260309_create_speech_attempts.sql`.
- **`attempted_at` vs `created_at`:** both columns are now NOT NULL with `now()`
  default. New rows can use either; the client writes `attempted_at` explicitly.
  The view groups on `attempted_at`.
