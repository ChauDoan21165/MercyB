# Study History & Memory — Phase 1 Audit

**Auditor:** CC4 · **Date:** 2026-04-23 · **Branch:** `audit/history-memory` · **Status:** Phase 1, no code changes

Reference bar per Chau: Duolingo / Anki / Babbel.

---

## TL;DR

The system is **mostly scaffolded, partially live, and critically broken in two places**:

1. **Account deletion leaks user data** (Apple 5.1.1v + GDPR Art. 17 risk). The `delete-account` edge function only wipes 5 tables; at least 6 more user-owned tables are left orphaned.
2. **Six tables in the schema have zero writers** — features that were half-built and never turned on. The most visible casualty: `user_room_progress` is empty, so the home-page "history" view is mostly blank for every user.

SRS exists, but only for the notebook feature (SM-2 on `user_notebook_items`). Rooms/lessons have no SRS. Streak logic is scattered across localStorage in 5 different places with different rules. No offline write queue. No calendar/heatmap UI.

The good news: most of the right **tables** exist. The broken part is the wiring, coverage, and UI.

---

## 1. Full inventory

### 1A. Supabase tables — what exists, who writes it, is it alive?

| Table | Written by | Read by | Rows today | Verdict |
|---|---|---|---:|---|
| `user_path_progress` | `src/services/paths.ts` (upsert + update) | `v_user_progress_current` view, `useUserProgress` | 0 | ✅ wired, unused (users haven't run path flow?) |
| `user_room_progress` | **🚨 NO WRITER ANYWHERE** | `v_user_progress_current` | 0 | ❌ DEAD — view will always be empty for rooms |
| `user_sessions` | `useSessionManagement.ts:73`, `session-hardening.ts:92` | admin dashboards, `v_user_progress_current` (for minutes_7d/30d) | 0 via probe | ✅ wired |
| `user_points` | `pointsService.ts` + `usePoints.ts` via `award_points` RPC | `pointsService.loadPointsFromSupabase` | 0 via probe | ✅ wired |
| `point_transactions` | Server-side `award_points` RPC (assumed) | — | 0 via probe | ⚠️ wired only if RPC implements it |
| `teacher_memory` | `useMercyMemory.ts` (upsert) | Same hook | 0 via probe | ✅ wired |
| `user_notebook_items` | notebook feature + SM-2 scheduler | notebook UI | RLS-gated | ✅ wired, **has full SM-2 SRS** |
| `speech_attempts` | **🚨 NO WRITER** | — | 0 | ❌ DEAD — pronunciation attempts never persisted |
| `room_reflections` | **🚨 NO WRITER** (only localStorage) | — | 0 | ❌ DEAD — user reflections stay on-device only |
| `mb_user_progress_narratives` | **🚨 NO WRITER** | — | 0 | ❌ DEAD — weekly-snapshot cron scaffolded but unwired |
| `mb_user_progress_snapshots` | **🚨 NO WRITER** | — | 0 | ❌ DEAD — same |
| `mb_user_room_weekly_pronunciation` | **🚨 NO WRITER** | — | 0 | ❌ DEAD — same |
| `v_user_progress_current` (view) | — (computed) | `useUserProgress` | depends on base tables | ⚠️ joins on empty `user_room_progress` → returns only path rows |

### 1B. Frontend — what gets read, what gets displayed

| Layer | File | Backend | Persistence |
|---|---|---|---|
| **Room visit tracker (legacy)** | `src/hooks/useRoomProgress.ts` | localStorage `room_progress` | device-only |
| **Supabase read hook** | `src/hooks/useUserProgress.ts` | view `v_user_progress_current` | server |
| **Home progress cards** | `src/components/home/HomeProgressCards.tsx` | uses hook above | — |
| **Points engine** | `src/services/pointsService.ts` | localStorage + `award_points` RPC | device + server |
| **Teacher memory (persistent)** | `src/lib/teacher-mercy/memory.ts` + `memorySchema.ts` | localStorage key `mercy_host_memory` | device-only |
| **Teacher logs** | `src/lib/teacher-mercy/logs.ts` | localStorage, max 100 events | device-only |
| **Curriculum tracker** | `src/lib/teacher-mercy/curriculumTracker.ts` | localStorage | device-only |
| **Lesson memory (per-session)** | `src/lib/teacher-mercy/lessonMemory.ts` | sessionStorage | tab-only, cleared on close |
| **Teaching arc / continuity / mastery** | `sessionTeachingArc.ts`, `teacherContinuity.ts`, `conceptMasteryStore.ts` | in-memory Map | lost on reload |

### 1C. What currently gets tracked (structured)

| Concept | Tracked? | Where | Persists across devices? |
|---|---|---|---|
| Room completion (binary) | ❌ No — only `progress_pct` | Would-be `user_room_progress` | n/a (dead) |
| Path day completion | ✅ Yes | `user_path_progress.completed_days` jsonb | yes |
| Time per session | ✅ Yes (minutes_7d, minutes_30d) | view, computed from `user_sessions` | yes |
| Timestamps — session start | ✅ `user_sessions.started_at` | Supabase | yes |
| Timestamps — session end | ✅ `user_sessions.ended_at` | Supabase | yes |
| Timestamps — last studied | ✅ `last_seen_at` on both progress tables | Supabase | yes |
| Timestamps — last login | ✅ via `mb.points.lastDaily` | localStorage | **no** — per-device |
| Mistakes (per-attempt) | ❌ Schema exists (`speech_attempts`), table empty | — | n/a |
| Accuracy per keyword | ❌ not tracked at all | — | — |
| Accuracy at path level | ❌ no `correct / total` | — | — |
| Pronunciation score | ❌ Schema exists (`speech_attempts.match_score`), never written | — | n/a |
| Pronunciation — weekly roll-up | ❌ `mb_user_room_weekly_pronunciation` table exists, never populated | — | n/a |
| Streak (daily login) | ⚠️ localStorage only | `mb.points.streak` + `mb.points.lastDaily` | **no** — resets per device |
| Streak (room visit) | ⚠️ localStorage only | `room_progress.streak` | **no** |
| Streak (topic/concept) | ⚠️ localStorage only | `mercy_curriculum_tracker.streak` | **no** |
| Streak (session correct) | ⚠️ sessionStorage only | `lessonMemory.correctStreak` | **no**, tab-only |
| Streak (teacher memory) | ⚠️ localStorage only | `mercy_host_memory.streakDays` | **no** |
| Points (XP) | ✅ Hybrid: localStorage + `user_points.total_points` | both | yes (on reconnect) |
| User-written reflection | ⚠️ localStorage only | `RoomRenderer.tsx:1412` writes locally | **no** |
| Teacher AI memory | ⚠️ device-only vs also Supabase via `teacher_memory`? | mixed | partially |
| Notebook items (flashcards) | ✅ Yes, with SM-2 SRS | `user_notebook_items` | yes |

---

## 2. Gap analysis vs. top-tier standard

| Capability | Duolingo / Anki / Babbel | MercyBlade | Gap |
|---|---|---|---|
| SRS for lesson content | Duolingo: half-life regression; Babbel: spaced intervals; Anki: SM-2/FSRS | **None for rooms**. SM-2 exists **only on `user_notebook_items`**. | 🔴 P0 — either apply notebook's SM-2 to room keywords, or adopt FSRS |
| Per-item error tracking | Every wrong answer logged, shown back | Schema exists (`speech_attempts`), **never written** | 🔴 P0 — wire the speech-analyze path to upsert |
| Cross-device streak | Yes — server-authoritative | **No — streak is localStorage**, resets on device switch | 🔴 P0 — streak must move to server |
| Session resumability | "Continue this lesson" with mid-exercise state | **Room-level resume only** ("last room"); mid-drill state lost | 🟡 P1 — add mid-exercise checkpoint to `user_sessions` |
| Calendar heatmap / contribution graph | Duolingo tree-map, Babbel calendar | **None — list-only UI** | 🟡 P1 — build heatmap from `v_user_progress_current` + daily rollup |
| Weekly / monthly summary | Yes (Duolingo "year in review", weekly digest emails) | Scaffolded (`mb_user_progress_narratives`) but **cron unwired** | 🟡 P1 — deploy weekly-snapshot cron |
| Streak freeze / grace | Duolingo streak freeze | **None** | 🟢 P2 — simple flag + 1/week credit |
| Export / data portability | GDPR right; Anki .apkg, Duolingo JSON | **None** — no export endpoint | 🟡 P1 — GDPR requires this, add export edge function |
| Account deletion wipes all user data | Required | 🚨 **Broken — only 5 of 11+ user-owned tables wiped** | 🔴 **P0 — compliance risk** |
| RLS correctness | Every user table scoped by `auth.uid()` | Mixed. 8 tables probe-confirmed "permission denied" to anon (tight). 5 let anon SELECT but filter to 0 rows (looser but safe). | 🟡 P1 — tighten GRANTs, add missing DELETE policies |
| Offline write queue | Duolingo queues lesson results in IndexedDB, syncs later | **None** — points are write-through-best-effort; other data local-only | 🟡 P1 — IndexedDB outbox for all writes |
| Indexes on hot paths | — | `user_points (user_id)`, `user_path_progress (user_id, path_id)`, `user_sessions (user_id, device_type; last_activity)`, `speech_attempts (user_id, room_id, line_id, created_at)`. **No composite (user_id, last_seen_at DESC)** on progress tables. | 🟡 P1 — add composite indexes |

---

## 3. Technical-quality audit

### Writes idempotent / crash-safe?

- **Partially.** `user_path_progress`, `user_sessions`, `user_points`, `teacher_memory` use `.upsert()` — idempotent.
- `award_points` RPC is not idempotent by event — double-clicking a button could double-count.
- No transaction boundaries across related writes (e.g. completing a room would ideally touch points + progress + session atomically).

### Offline?

- **No outbox / retry queue.**
- `pointsService.syncToSupabase()` is fire-and-forget with a kill-switch (if one sync fails 403, all future syncs in the tab are disabled).
- Teacher memory, logs, curriculum tracker are localStorage-only — no sync path at all. A user who changes phone loses them.

### RLS correctness

Probed with anon key:

| Table | anon SELECT result | Verdict |
|---|---|---|
| `user_room_progress` | 42501 permission denied | ✅ tight |
| `user_path_progress` | 42501 permission denied | ✅ tight |
| `user_points` | 42501 permission denied | ✅ tight |
| `user_sessions` | 42501 permission denied | ✅ tight |
| `point_transactions` | 42501 permission denied | ✅ tight |
| `mb_user_progress_narratives` | 42501 permission denied | ✅ tight |
| `mb_user_progress_snapshots` | 42501 permission denied | ✅ tight |
| `mb_user_room_weekly_pronunciation` | 42501 permission denied | ✅ tight |
| `speech_attempts` | OK, 0 rows | ⚠️ anon SELECT allowed; RLS filters to empty for non-authed. Should be denied outright. |
| `room_reflections` | OK, 0 rows | ⚠️ same |
| `teacher_memory` | OK, 0 rows | ⚠️ same |
| `user_notebook_items` | OK, count unknown | ⚠️ same |

Migration-confirmed RLS policies:
- `user_path_progress`, `user_points`, `user_sessions`, `teacher_memory`: full CRUD own-row policies.
- `user_room_progress`, `point_transactions`, `speech_attempts`, `room_reflections`, `mb_user_*`: not found in migrations — likely applied via SQL Editor (drift).
- **`teacher_memory` has no DELETE policy** — users cannot remove their own memory even if they wanted to.

### Indexes

Migration-confirmed indexes on history tables:
- `user_path_progress`: `user_id`, `path_id`
- `user_points`: `user_id`
- `user_sessions`: `(user_id, device_type)`, `last_activity`
- `speech_attempts`: `user_id`, `room_id`, `line_id`, `created_at DESC`

**Missing** (based on query patterns in `useUserProgress`):
- `user_room_progress`: no migration visible. If not in SQL Editor, `v_user_progress_current` does a full scan.
- `user_path_progress`: no `(user_id, last_seen_at DESC)` composite — current query ORDERS BY `updated_at DESC`, so the view needs either `(user_id, updated_at DESC)` or is already relying on table scans.
- `point_transactions`: no `(user_id, created_at DESC)` visible — admin/history queries will slow as data grows.

### N+1 / table scans

- `useUserProgress` does **one** query. No N+1 in the happy path.
- HomeProgressCards re-renders per state change but uses the same data. Fine.
- Concern only appears at scale (tens of thousands of progress rows per user — unlikely at current cohort size of 115).

### Delete-account coverage (⚠️ critical)

Current `supabase/functions/delete-account/index.ts` hard-deletes only:
- `favorite_tracks`, `user_points`, `user_sessions`, `teacher_memory`, `user_notebook_items`

Anonymizes: `feedback`. Marks-deleted: `user_subscriptions`. Finally deletes `profiles` + `auth.users`.

**User-owned tables NOT addressed:**
- `user_room_progress` — empty today, but if/when writes start, will orphan
- `user_path_progress` — live, has real user data, not wiped
- `point_transactions` — financial/engagement log, not wiped
- `speech_attempts` — empty today, but contains user voice transcripts when used
- `room_reflections` — user-written text, not wiped (and not synced in the first place, but schema still has a column for `user_id`)
- `mb_user_progress_narratives` / `mb_user_progress_snapshots` / `mb_user_room_weekly_pronunciation` — AI-written data derived from user behavior
- `entitlement_events` — per `20260422020000_enable_rls…` migration — possibly retained for billing, which is OK, but should be explicit

Whether CASCADE saves us: `user_path_progress` has `ON DELETE CASCADE` via `paths` FK but not `user_id` FK → deleting auth user won't cascade. `teacher_memory` has CASCADE. `user_sessions` has CASCADE. Others are unclear without live `pg_constraint` inspection.

**Verdict: P0 compliance bug.** Apple rejected us under 5.1.1(v) already; a future review could re-reject if data is retained. GDPR Art. 17 also applies (EU users if any).

---

## 4. Schema sketch (current)

```
auth.users
  ├── profiles (1:1)
  │     tier, display_name, total_points (denorm), ...
  │
  ├── user_sessions (1:N)               ← session log, upserted by app
  │     session_id, device_type, started_at, ended_at, current_room_id
  │
  ├── user_points (1:1)                 ← snapshot, upserted via award_points RPC
  │     total_points
  │
  ├── point_transactions (1:N)          ← awarded by server RPC
  │     points, transaction_type, room_id, created_at
  │
  ├── user_path_progress (1:N)          ← ONLY live progress writer
  │     path_id, current_day, completed_days (jsonb), progress_pct, room_id
  │
  ├── user_room_progress (1:N)          ← DEAD: no writer
  │     room_id, progress_pct, repeat_count, last_entry_id, last_keyword_en
  │
  ├── teacher_memory (1:1)              ← jsonb blob, written from useMercyMemory
  │     memory (jsonb)
  │
  ├── user_notebook_items (1:N)         ← SM-2 SRS live here
  │     item_type, content_en, content_vi,
  │     ease_factor, interval_days, repetitions, next_review_at, last_reviewed_at
  │
  ├── speech_attempts (1:N)             ← DEAD: table exists, no writer
  │     room_id, line_id, target_text, transcript, match_score, missing_words, extra_words
  │
  ├── room_reflections (1:N)            ← DEAD: written only to localStorage
  │     room_id, reflection_text, keyword
  │
  ├── mb_user_progress_narratives (1:N) ← DEAD: weekly cron unwired
  │     narrative_type, title, body, evidence (jsonb)
  │
  ├── mb_user_progress_snapshots (1:N)  ← DEAD
  │     window_start, window_end, mode, metrics (jsonb)
  │
  └── mb_user_room_weekly_pronunciation ← DEAD
        room_id, week_start, week_end, pronunciation_attempts, avg_overall_score

view v_user_progress_current
  = union over user_room_progress (empty) + user_path_progress (live)
    + join to user_sessions for minutes_7d / minutes_30d
    + computed streak_days, days_active_30d, last_study_at
```

---

## 5. Proposed schema changes (if approved)

Minimal, additive. No breaking renames.

1. **Add `user_room_progress` writer** OR decide to keep it dead and drop it. If we keep it, need a room-completion trigger (client writes `progress_pct` on keyword exhaustion or a `room_complete` event handler writes via RPC).

2. **New table `user_study_events`** (append-only event log): `id, user_id, event_type, room_id, line_id, payload jsonb, occurred_at, synced_from_device_id`. This is the single source of truth that all views/rollups derive from. Lets us:
   - Drop the 6 dead tables or make them materialized views
   - Cleanly support offline outbox (client writes events to IndexedDB → syncs bulk → idempotent via uuid)
   - Power streak, calendar heatmap, weekly digest from one source

3. **Add SRS fields to room/keyword level** — either a new `user_keyword_srs` table mirroring `user_notebook_items` schema (ease_factor, interval_days, next_review_at) or promote notebook to be the unified SRS target and auto-add every studied keyword to notebook.

4. **`streak` table or columns on profiles**: `current_streak, longest_streak, last_study_day, freezes_available`. Computed server-side from `user_study_events.occurred_at`. Client reads — never writes.

5. **Session resume state**: add `user_sessions.resume_state jsonb` — small blob (last line index, scroll position, answer draft).

6. **Indexes to add**:
   - `user_room_progress (user_id, last_seen_at DESC)` — if we keep this table
   - `point_transactions (user_id, created_at DESC)`
   - `user_study_events (user_id, occurred_at DESC)` — if added
   - All `mb_user_*` tables: `(user_id, window_start DESC)` or similar

7. **RLS completeness audit** — migration that enumerates every user-owned table, confirms policies for SELECT/INSERT/UPDATE/DELETE (plus GRANTs). Run as a one-time check, not rerun each time.

---

## 6. Prioritized recommendations

### 🔴 P0 — must fix

| # | Item | Why | Effort |
|---|---|---|---|
| P0-1 | **Fix `delete-account` to wipe all user history.** Add `user_room_progress`, `user_path_progress`, `point_transactions`, `speech_attempts`, `room_reflections`, `mb_user_*`, plus a CASCADE check script that blocks merge if a new user-owned table lacks cleanup. | Apple 5.1.1(v) + GDPR Art. 17 compliance. Apple already rejected us once on 5.1.1(v). | **S — 2-3 hours.** Edit one file + one migration. |
| P0-2 | **Move streaks to server.** Pick one canonical streak (daily study). Compute from `user_sessions.started_at` distinct dates. Expose via `v_user_streak`. Keep client streak UI; client READS only. Delete the other 4 scattered streak counters. | Streak that resets when the user switches phone is a learning-loss bug, not just cosmetic. Every top-tier app has server-side streak. | **M — 1 day.** View + 1 hook rewrite + 5 deletions. |
| P0-3 | **Decide the fate of `user_room_progress`.** Either (a) wire up a writer (room-completion trigger) or (b) drop it + rebuild the view off `user_study_events`. Current state: `v_user_progress_current` silently returns no room data because nothing writes. | UI users see "no recent rooms" incorrectly; this is the most visible data bug. | **M — 1 day for (a), 2-3 days for (b).** |
| P0-4 | **Add `teacher_memory` DELETE policy** + add `memory.delete()` UI under Account → Privacy. Currently users cannot remove their own AI-memory profile. | GDPR Article 17. Also UX — some users will want to reset Mercy. | **S — 1 hour.** |

### 🟡 P1 — should fix

| # | Item | Why | Effort |
|---|---|---|---|
| P1-1 | **Wire `speech_attempts` writes into `speech-analyze` edge function.** Every pronunciation attempt → row in table. Add weekly rollup cron into `mb_user_room_weekly_pronunciation`. | Currently the pronunciation feature is write-only (user gets score, nothing learns from it). Server-side data unlocks weak-area detection. | **M — 1-2 days.** |
| P1-2 | **Add SRS to room content.** Reuse notebook's SM-2 by auto-inserting every studied keyword with source=`room` into `user_notebook_items`. Notebook already has `next_review_at` scheduling. | Notebook SRS works. Extending it to rooms is reuse, not new infra. This is the biggest single lift toward "Anki-class." | **M — 2-3 days** (includes UI surfacing the "due for review" list). |
| P1-3 | **Calendar heatmap UI.** Build a 90-day grid from `user_sessions.started_at` (or the new `user_study_events`) on the Home page. | Top-3 most visible features in Duolingo / Babbel. Low-risk to build, big UX win. | **M — 1-2 days.** |
| P1-4 | **Deploy weekly-snapshot cron** that populates `mb_user_progress_snapshots` + generates narratives (via OpenAI) into `mb_user_progress_narratives`. Show in a "Your week" card. | Three tables already exist for this; the cron was scaffolded but never wired. Low marginal cost. | **M — 1-2 days.** |
| P1-5 | **Offline outbox (IndexedDB).** Queue writes to `user_sessions`, `user_points`, `point_transactions`, `speech_attempts` + flush on reconnect. Idempotent via client-generated UUIDs. | Learners on slow Vietnamese mobile networks lose data today. | **L — 3-5 days.** Non-trivial; add after P0s are green. |
| P1-6 | **Data export endpoint** (GDPR Art. 20). New edge function `export-my-data` returns a zip with CSVs for all user-owned tables + jsonb blobs. Link from Account → Privacy. | Required for GDPR even outside EU if we market there; good hygiene. | **S — 1 day.** |
| P1-7 | **Persist the in-memory "teaching context" Maps** (`sessionTeachingArc`, `conceptMasteryStore`, `teacherMemoryEngine`). Either into `teacher_memory.memory` jsonb or dedicated columns. | Mercy forgets everything on page reload mid-lesson, which breaks the "smart teacher" premise. | **M — 1-2 days.** |
| P1-8 | **Composite indexes** on `point_transactions (user_id, created_at DESC)`, plus audit `user_room_progress` if kept. | Table scans today are fast because data is sparse; add before data grows. | **S — 30 min.** |

### 🟢 P2 — nice to have

| # | Item | Effort |
|---|---|---|
| P2-1 | Streak freeze / grace (1 per week, auto-consumed). | S — 2 hours. |
| P2-2 | Weak-areas dashboard (derived from `speech_attempts.missing_words` rollup). | M — 1-2 days. |
| P2-3 | "Resume mid-lesson" state (add `user_sessions.resume_state jsonb`). | M — 1 day. |
| P2-4 | Public share card ("I studied X days on MercyBlade") — growth hook. | S — 4 hours. |
| P2-5 | Migrate localStorage-only teacher logs into `user_study_events` (if introduced). | S — 2 hours bundled with P0-3. |

---

## 7. Decision matrix — pick a path

**Path A — Minimum compliance (1-2 days):** P0-1 + P0-4 only. Ships before next Apple review; nothing else changes.

**Path B — Minimum viable "top-tier":** P0-1 through P0-4 + P1-1 + P1-2 + P1-3 (≈ 1.5-2 weeks). Ships: working history view, server-side streak, SRS on rooms, calendar heatmap, compliance. This is what I recommend.

**Path C — Full rebuild around `user_study_events`:** everything above + P1-5 + P1-7 + drop 3-4 dead tables (≈ 3-4 weeks). Best long-term; biggest short-term risk because it touches central files.

My pick: **Path B.** It resolves compliance and makes the most-visible gaps disappear, without a central-files rewrite.

---

## Appendix — files created during audit

- `scripts/storage-inventory.mjs` (previous task, uncommitted)
- `scripts/audio-bucket-orphan-audit.mjs` (previous task, uncommitted)
- `scripts/history-schema-audit.mjs` (new, this audit, uncommitted)
- `scripts/history-schema-openapi.mjs` (new, this audit, uncommitted)
- `scripts/history-rls-probe.mjs` (new, this audit, uncommitted)
- `scripts/.audio-bucket-audit.json` (previous task, uncommitted)
- `docs/audit-history-phase-1.md` (this file, uncommitted)
