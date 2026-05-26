# Wave 2 — Step 1 (P0-3) — Manual Test Plan

Tests the new `user_room_progress` writer end-to-end on **staging**.

Goal: a user who enters a room sees that room appear on the Home page's
"recent rooms" card within ~1 second, survives page reload, and updates
on each subsequent visit.

Prereqs:
- Migration `20260424000000_user_room_progress_writer_support.sql` applied.
- Branch `feat/history-wave-2-core` deployed to staging.
- A real test user account with no existing `user_room_progress` rows.

---

## Test 1 — First entry populates Home immediately

1. Sign in as the test user. Note the user's UUID from Supabase SQL Editor:
   ```sql
   select id from auth.users where email = 'your-test-email@example.com';
   ```
   I'll call this `:uid`.

2. Before entering any room, confirm the table is empty for this user:
   ```sql
   select count(*) from user_room_progress where user_id = ':uid';
   -- expected: 0
   ```

3. Navigate to any room, e.g. `/room/sun_tzu_v2`.

4. Within 1 second, query:
   ```sql
   select app_id, room_id, progress_pct, repeat_count, last_seen_at
   from user_room_progress
   where user_id = ':uid' and room_id = 'sun_tzu_v2';
   ```
   **Expected:** exactly 1 row with `app_id = 'mercy_blade'`, `progress_pct = 0`,
   `repeat_count = 1`, `last_seen_at` within the last few seconds.

5. Go back to Home (`/`). The room `sun_tzu_v2` should appear in the
   "recent rooms" card with its last-studied timestamp.

## Test 2 — Keyword click updates progress_pct monotonically

1. In the same room, click a keyword (any keyword in the UI).

2. Within 1 second:
   ```sql
   select progress_pct, last_keyword_en, last_entry_id, last_seen_at
   from user_room_progress
   where user_id = ':uid' and room_id = 'sun_tzu_v2';
   ```
   **Expected:** `progress_pct > 0`, `last_keyword_en` matches what you clicked.

3. Click 3 more keywords. Each click should bump `progress_pct`.

4. Click a keyword you already clicked before. `progress_pct` MUST NOT
   decrease (monotonic). `last_keyword_en` updates to the new keyword.

## Test 3 — Entry throttle (repeat_count)

1. Leave the room (navigate to Home).

2. Within 30 minutes, go back to the same room.

3. Query:
   ```sql
   select repeat_count from user_room_progress
   where user_id = ':uid' and room_id = 'sun_tzu_v2';
   ```
   **Expected:** `repeat_count = 1` still (throttle active, < 30 min window).
   `last_seen_at` DID update.

4. Manually simulate a > 30-min gap by updating `last_seen_at`:
   ```sql
   update user_room_progress
     set last_seen_at = now() - interval '40 minutes'
     where user_id = ':uid' and room_id = 'sun_tzu_v2';
   ```

5. Navigate away from the room, then back into it.

6. Re-query:
   ```sql
   select repeat_count from user_room_progress
   where user_id = ':uid' and room_id = 'sun_tzu_v2';
   ```
   **Expected:** `repeat_count = 2`.

## Test 4 — Home "recent rooms" list ordering

1. Enter 3 different rooms in sequence: A, B, C.

2. Navigate to Home. The list should show C, B, A (most recent first).

3. Re-enter room A. Return to Home. Order should now be A, C, B.

## Test 5 — Cross-device persistence

1. Sign in as the same test user on a different browser (or incognito window).

2. Navigate to Home before entering any room.

3. **Expected:** the recent-rooms card shows the rooms visited on the
   first device. This is server-side data, no localStorage dependency.

## Test 6 — Unauthenticated is no-op

1. Sign out.

2. Navigate to any room. The room should render normally (nothing breaks).

3. Check browser Network tab: there should be NO `user_room_progress`
   POST/PATCH requests.

4. After signing back in, room progress tracking resumes.

## Test 7 — RLS isolation

1. As test user A, enter a room. Note the row created.

2. Using service role in SQL Editor:
   ```sql
   set local role authenticated;
   set local "request.jwt.claim.sub" = '<some-other-user-uuid>';
   select * from user_room_progress where user_id = '<A-uuid>';
   -- expected: 0 rows (RLS blocks cross-user reads)
   ```

3. As user B (signed into the app), query their own progress — should
   only see their own rows.

## Test 8 — delete-account still wipes room progress

1. As test user A, confirm `user_room_progress` has rows:
   ```sql
   select count(*) from user_room_progress where user_id = ':uid';
   -- expected: > 0
   ```

2. Trigger account deletion (Account → Delete my account).

3. Verify:
   ```sql
   select count(*) from user_room_progress where user_id = ':uid';
   -- expected: 0
   ```
   (Already covered by the Wave 1 manifest — this is a regression check.)

## Test 9 — Error resilience

1. Block the Supabase API temporarily (DevTools → Network → throttle offline, or use browser blocking rules).

2. Enter a room. The room UI should render normally (no crashes).

3. Browser console should show exactly ONE warning per failed write:
   `[roomProgress] trackRoomEntry failed: …`

4. Re-enable network. Next room entry should succeed normally.

---

## Exit criteria

- All 9 tests pass.
- No console errors in the happy path (only the expected warn in Test 9).
- Unit tests: `npx vitest run src/services/__tests__/roomProgress.test.ts` — 10 passed.

## If any test fails

Do NOT merge. File the failure on the PR with:
- Step that failed
- Observed state (SQL output, screenshot)
- Expected state

Then I'll fix on the branch, push, and the test re-runs.
