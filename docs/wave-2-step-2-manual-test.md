# Wave 2 Step 2 (P0-2) — Manual Test Plan

Server-side streaks with 1-day grace, localStorage migration, browser-timezone
detection. Run on **staging** before merge.

Prereqs
- Migration `20260425000000_server_side_streaks.sql` applied.
- Feature flag `VITE_SERVER_STREAKS_ENABLED=true` set in staging env.
- User account with no pre-existing streak state.
- Access to Supabase SQL Editor.

Vocabulary for this doc:
- `:uid` — the test user's `auth.users.id` UUID. Replace everywhere before running.
- "Engagement write" — `updateRoomProgress` call that increased `progress_pct`.
  Mount-only room entries do NOT trigger streak updates (threshold B).

---

## Test 1 — New user, first engagement → streak = 1

1. Sign in as the test user. No localStorage streak seeded. Confirm the
   server-side state is empty:
   ```sql
   select streak_current, streak_longest, streak_last_studied_date, timezone
   from profiles where id = ':uid';
   ```
   Expected: `streak_current = 0`, `streak_longest = 0`, `streak_last_studied_date = NULL`,
   `timezone = 'Asia/Ho_Chi_Minh'` (default) OR the browser TZ if the migration
   has already pushed it.

2. In the app, enter a room (Home → any room tile).

3. **Wait** — the mount itself should NOT bump the streak (threshold B).
   Verify:
   ```sql
   select streak_current from profiles where id = ':uid';
   -- expected: 0
   ```

4. In the room, click a keyword. This calls `updateRoomProgress` with a
   non-zero `progress_pct`.

5. Within 2 seconds:
   ```sql
   select streak_current, streak_longest, streak_last_studied_date
   from profiles where id = ':uid';
   ```
   **Expected:** `streak_current = 1`, `streak_longest = 1`, `streak_last_studied_date`
   equals today's date in the user's timezone.

## Test 2 — Consecutive day → increments to 2

Simulate being on a new day by manually backdating yesterday's streak:

1. ```sql
   update profiles
     set streak_current = 1,
         streak_longest = 1,
         streak_last_studied_date = current_date - 1
   where id = ':uid';
   ```

2. In the app, click a keyword to trigger an engagement write.

3. Verify:
   ```sql
   select streak_current, streak_longest from profiles where id = ':uid';
   -- expected: streak_current = 2, streak_longest = 2
   ```

## Test 3 — Grace window → 1-day gap preserves streak

1. ```sql
   update profiles
     set streak_current = 5,
         streak_longest = 5,
         streak_last_studied_date = current_date - 2  -- 2 days ago, skipped yesterday
   where id = ':uid';
   ```

2. Trigger a keyword click.

3. Verify:
   ```sql
   select streak_current, streak_longest from profiles where id = ':uid';
   -- expected: streak_current = 6 (grace preserved + incremented),
   --           streak_longest = 6
   ```

## Test 4 — Gap of 3+ days → reset to 1, longest preserved

1. ```sql
   update profiles
     set streak_current = 10,
         streak_longest = 30,
         streak_last_studied_date = current_date - 5
   where id = ':uid';
   ```

2. Trigger a keyword click.

3. Verify:
   ```sql
   select streak_current, streak_longest, streak_last_studied_date
   from profiles where id = ':uid';
   -- expected: streak_current = 1,
   --           streak_longest = 30 (preserved),
   --           streak_last_studied_date = today (local)
   ```

## Test 5 — Same-day debounce → multiple writes are no-op

1. ```sql
   update profiles
     set streak_current = 3,
         streak_last_studied_date = current_date
   where id = ':uid';
   ```

2. Click 10 keywords in a room.

3. Verify:
   ```sql
   select streak_current from profiles where id = ':uid';
   -- expected: streak_current = 3 (unchanged)
   ```

## Test 6 — Mount-only re-entry does NOT bump streak

1. Reset so streak is 0:
   ```sql
   update profiles set streak_current = 0, streak_last_studied_date = NULL
   where id = ':uid';
   ```

2. Enter a room (just mount, don't click any keyword) and leave.

3. Re-enter the same room.

4. Verify:
   ```sql
   select streak_current, streak_last_studied_date
   from profiles where id = ':uid';
   -- expected: streak_current = 0, streak_last_studied_date = NULL
   --           user_room_progress row exists (from Step 1 writer)
   --           but no keyword click = no progress_pct advance = no trigger fire
   ```

## Test 7 — localStorage → server migration (MAX merge + idempotency)

1. Sign out. In browser DevTools console (while signed out), seed local:
   ```js
   localStorage.setItem('mb.points.streak', '15');
   localStorage.setItem('mb.points.lastDaily', '2026-04-22');
   localStorage.setItem('mercy_host_memory', JSON.stringify({
     streakDays: 10, longestStreak: 25, greetings: 4
   }));
   localStorage.setItem('room_progress', JSON.stringify({ streak: 7 }));
   ```

2. Also set the server side to a smaller value:
   ```sql
   update profiles
     set streak_current = 3, streak_longest = 3, streak_migrated_at = NULL
   where id = ':uid';
   ```

3. Sign in. Wait ~3 seconds for the `onAuthStateChange` effect to fire.

4. Verify server values:
   ```sql
   select streak_current, streak_longest, streak_migrated_at
   from profiles where id = ':uid';
   -- expected: streak_current = 15 (MAX of local 15, server 3),
   --           streak_longest = 25 (MAX of local 25, server 3, current 15),
   --           streak_migrated_at = now()
   ```

5. Verify localStorage cleanup:
   ```js
   localStorage.getItem('mb.points.streak');        // null
   localStorage.getItem('mb.points.lastDaily');     // null
   localStorage.getItem('room_progress');           // null
   localStorage.getItem('mb.streak.migrated');      // "true"
   JSON.parse(localStorage.getItem('mercy_host_memory')).streakDays;    // undefined
   JSON.parse(localStorage.getItem('mercy_host_memory')).longestStreak; // undefined
   JSON.parse(localStorage.getItem('mercy_host_memory')).greetings;     // 4 (preserved)
   ```

6. Verify telemetry:
   ```sql
   select interaction_type, interaction_data
   from user_behavior_tracking
   where user_id = ':uid'
     and interaction_type = 'streak_migration_attempt'
   order by created_at desc limit 1;
   -- expected: interaction_data.success = true, interaction_data.merged = {...}
   ```

7. **Idempotency check:** reload the page. The `onAuthStateChange` fires
   again. Verify:
   - No additional telemetry row (local guard blocks re-entry).
   - Server `streak_current = 15` unchanged.
   - If you wipe the local guard and re-try:
     ```js
     localStorage.removeItem('mb.streak.migrated');
     // reload
     ```
     The RPC returns `{ already_migrated: true }`. Server values unchanged.
     Local keys still get cleared (same flow) and guard set again.

## Test 8 — Browser timezone detection on first login

1. As a user currently defaulted to Asia/Ho_Chi_Minh, verify:
   ```sql
   select timezone from profiles where id = ':uid';
   -- expected: 'Asia/Ho_Chi_Minh'
   ```

2. Change your machine to a different timezone (e.g., America/Los_Angeles).
   Refresh the browser. Sign in again.

3. Verify:
   ```sql
   select timezone from profiles where id = ':uid';
   -- expected: 'America/Los_Angeles' (the browser TZ was pushed)
   ```

4. Travel back (reset TZ to Vietnam or any non-default):
   ```sql
   update profiles set timezone = 'Asia/Tokyo' where id = ':uid';
   ```
   Reload. Verify that `timezone` stays `Asia/Tokyo` — once a non-default
   value is set, boot does NOT auto-override it.

## Test 9 — Feature flag OFF → no server path, no migration

1. Flip `VITE_SERVER_STREAKS_ENABLED=false` (or unset the env var) and redeploy.

2. Sign in as a user whose `streak_migrated_at` is NULL and who has local
   streak values.

3. Verify:
   - No RPC call to `migrate_local_streak` in network traffic.
   - No row in `user_behavior_tracking` with `interaction_type = 'streak_migration_attempt'`.
   - `pointsService.getStreakDays()` returns the localStorage value.
   - `profiles.streak_migrated_at` still NULL.

## Test 10 — delete-account wipes streak columns

1. As a user with `streak_current > 0`, trigger account deletion (Account →
   Delete my account → type DELETE).

2. Verify:
   ```sql
   select count(*) from profiles where id = ':uid';
   -- expected: 0 (profile row deleted, streak columns gone with it)
   ```

   Also confirm the auth user is gone:
   ```sql
   select count(*) from auth.users where id = ':uid';
   -- expected: 0
   ```

---

## Exit criteria

- All 10 tests pass.
- Unit tests green:
  ```bash
  npx vitest run src/lib/__tests__/streakMath.test.ts       # 16 passed
  npx vitest run src/lib/__tests__/streakMigration.test.ts  # 17 passed
  npx vitest run src/lib/__tests__/streakCache.test.ts      #  4 passed
  ```

## If any test fails

File on the PR with: test number, observed state (SQL output / console), expected state.
Do NOT merge.

## Notes for Chau

- Feature flag `VITE_SERVER_STREAKS_ENABLED` ships OFF by default. Flip it in
  Vercel env (preview first, then prod after verification) once the trigger
  has been watched for a few hours of real traffic.
- The trigger adds minimal latency (~1 ms lookup + at most 1 UPDATE per
  day's first engagement write). For 115 users we'll never notice; at
  100k users, consider caching.
- Longest-streak display uses `streak_longest`, not derived. If you later
  want "longest per-month" or leaderboards, that's a separate view.
