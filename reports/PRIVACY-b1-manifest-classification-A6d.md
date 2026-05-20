# B1 — Delete-Account Manifest Classification (42 tables surfaced by PR #797)

**Reviewer:** A6 (A6d follow-up to A7's PR #797)
**Worktree:** `/private/tmp/A6d-b1-table-classify` (off `origin/main` @ `cff975a54`)
**Purpose:** classify the 42 user-id tables that `scripts/check-delete-account-coverage.mjs` surfaced as missing from `supabase/functions/delete-account/user-data-manifest.ts`, so A4 can write the manifest entries without making policy calls alone.
**Scope:** documentation only — does **not** modify `user-data-manifest.ts` (A4 owns that file per dispatch).

---

## Bucket taxonomy → manifest `ManifestAction` mapping

The existing manifest (see `user-data-manifest.ts:21`) defines four `ManifestAction` values:

| Manifest action | This doc's bucket | When to use |
|---|---|---|
| `delete` | **DELETE** | User-generated learning / behavior / memory / progress data. P0 for Apple 5.1.1(v) + GDPR Art. 17. Row is gone. |
| `anonymize` | **RETAIN** | Audit / compliance / cost-tracking records that must survive the deletion. UPDATE sets `user_id = NULL`, row stays. |
| `skip_view` | **SYSTEM** (view subset) | Postgres view or materialized view — deletions pass through to base tables. No-op. |
| `skip_admin` | **SYSTEM** (admin subset) | Row identifies an admin's actions, not the deleted user's data. Admin may still be active. No-op. |
| _(none)_ | **REVIEW** | Schema unclear or product policy not yet set — Chau decides. |

---

## Per-table classification (42 of 42)

Sort order: alphabetical (matches the PR #797 output for easy cross-check).

| # | Table | Bucket | Action | Column | Notes |
|---|---|---|---|---|---|
| 1 | `all_time_referral_leaderboard` | SYSTEM | `skip_view` | — | MATERIALIZED VIEW (`supabase/migrations/20260524000000_referral_leaderboard.sql`). Refreshes from `referral_codes` / `referral_uses` / `auth.users`; user's row disappears on next refresh after auth.users cascade. |
| 2 | `certificates` | **REVIEW** | _(Chau)_ | _(unknown)_ | **No migration in repo** — schema drift (prod-only, per `project_db_schema_drift_audit`). Best-guess: stores user-earned certificates → `delete`. Chau confirms (a) column name (likely `user_id` or `owner_user_id`), (b) whether issued credentials need retention for proof-of-completion. |
| 3 | `corporate_seats` | DELETE | `delete` | `user_id` | Per-user seat membership in a corporate plan. CASCADE on auth.users already. Manifest entry still required (P0 explicitness). |
| 4 | `daily_challenges` | DELETE | `delete` | `user_id` | Per-user daily challenge state + completion + XP awarded. Personal learning data. |
| 5 | `email_audit` | SYSTEM | `skip_admin` | _(admin_user_id, not user's)_ | The `admin_user_id` column records the **admin** who sent the feedback reply, not the deleted user. The user's email may appear in `recipient_email`, but this is an admin-action log, not the user's data. (Compare to existing manifest entries like `access_codes` with the same pattern.) |
| 6 | `email_sends_log` | RETAIN | `anonymize` | `user_id` | Per-send deliverability log. Retain for ops / list-hygiene / deliverability analysis (RFC 8058 patterns) but strip linkage. **Also scrub `email` text column** in the same UPDATE (use `scrub_columns: { email: null }`) — nulling `user_id` alone leaves the address. |
| 7 | `family_plan_members` | DELETE | `delete` | `user_id` | Per-user membership in a family plan. CASCADE on auth.users. |
| 8 | `interview_sessions` | DELETE | `delete` | `user_id` | Per-user interview answers + scoring. Personal performance data. |
| 9 | `leaderboard_weekly` | DELETE | `delete` | `user_id` | Per-user weekly score history. Privacy default + UX (the user's row disappears from the leaderboard, not "Anonymous" stays on it). |
| 10 | `lifetime_intent_signups` | RETAIN | `anonymize` | `user_id` | Lifetime-tier intent signal (marketing/product). `user_id` is already `ON DELETE SET NULL` at the FK — for manifest consistency, codify the same behavior. **Also scrub `email` text column** (`scrub_columns: { email: null }`). |
| 11 | `mercy_conversations` | DELETE | `delete` | `user_id` | Personal AI chat thread. CASCADE on auth.users. (Child `mercy_messages` cascades via `conversation_id`.) |
| 12 | `mercy_tts_usage` | RETAIN | `anonymize` | `user_id` | Per-user TTS cost-tracking. FK is `ON DELETE SET NULL` already. Retain for cost analytics, strip linkage. |
| 13 | `mercy_unified_sessions` | DELETE | `delete` | `user_id` | Per-user unified-session state (Mercy context summary). |
| 14 | `mercy_user_facts` | DELETE | `delete` | `user_id` | Per-user memory blob (preferences, goals, biographical facts). Strictly personal. |
| 15 | `mfa_backup_codes` | DELETE | `delete` | `user_id` | Security credentials. **Must** be removed with the account. CASCADE on auth.users. |
| 16 | `mfa_lockouts` | DELETE | `delete` | `user_id` | Failed-MFA-attempt state. CASCADE on auth.users. |
| 17 | `mock_interview_sessions` | DELETE | `delete` | `user_id` | Per-user mock-interview state. |
| 18 | `monthly_referral_leaderboard` | SYSTEM | `skip_view` | — | MATERIALIZED VIEW (same migration as #1). |
| 19 | `paywall_experiment_exposures` | RETAIN | `anonymize` | `user_id` | A/B experiment exposure log. FK is `ON DELETE SET NULL` already. Retain for experiment integrity (don't post-hoc shrink the denominator). **Also scrub `anon_id` text column** if non-null (it's a pre-login device fingerprint that can re-link). |
| 20 | `pronunciation_srs_items` | DELETE | `delete` | `user_id` | Personal SRS review queue. |
| 21 | `push_preferences` | DELETE | `delete` | `user_id` | Per-user notification settings (quiet hours, timezone, opt-ins). |
| 22 | `push_send_log` | RETAIN | `anonymize` | `user_id` | Per-send delivery audit. Retain for ops/diagnostics, strip linkage. |
| 23 | `push_tokens` | DELETE | `delete` | `user_id` | Device push-notification tokens. **Privacy + security critical** — must remove so the deleted user doesn't keep receiving pushes. CASCADE on auth.users. |
| 24 | `referral_audit_log` | RETAIN | `anonymize` | `user_id` | **Anti-abuse audit log** (suspicious referral patterns). Retain pattern for fraud detection, strip user linkage. Legal basis: anti-fraud / platform safety. |
| 25 | `referral_leaderboard_optin` | DELETE | `delete` | `user_id` | Personal opt-in record + display name. |
| 26 | `review_log` | DELETE | `delete` | `user_id` | SRS review history (per-card grades + interval changes). Personal learning data. |
| 27 | `roadmap_item_votes` | DELETE | `delete` | `user_id` | Personal vote on a roadmap item. (PK is `(roadmap_item_id, user_id)` — manifest entry deletes the rows; parent counter doesn't need a manual recompute, the existing trigger handles aggregate updates.) |
| 28 | `speech_analysis_logs` | RETAIN | `anonymize` | `user_id` | Per-attempt cost + status log (OpenAI billing analytics). Retain for cost analysis, strip linkage. |
| 29 | `study_group_members` | DELETE | `delete` | `user_id` | Per-user membership in a study group. |
| 30 | `user_challenge_completion` | DELETE | `delete` | `user_id` | Per-user pronunciation-challenge completion + score + audio URL. (Also: A4 should confirm whether the storage-bucket audio at `audio_url` is cleaned by an existing storage-deletion sweep — out of manifest scope, separate concern.) |
| 31 | `user_interview_prompt_votes` | DELETE | `delete` | `user_id` | Personal voting record on community-submitted interview prompts. PK is `(user_id, prompt_id, vote_type)`. |
| 32 | `user_listening_progress` | DELETE | `delete` | `user_id` | Per-clip listening-comprehension scores. |
| 33 | `user_placements` | DELETE | `delete` | `user_id` | Per-user placement-test results + question responses. |
| 34 | `user_stories` | DELETE | `delete` | `user_id` | User-submitted moderated stories (community feature; has `status` + `published_at`). Privacy default + GDPR Art. 17 = delete on request. If product later wants to **retain published stories** as community content past account deletion, revisit and switch to `anonymize` with `scrub_columns: { story_text: "[deleted]" }` — but that's a separate product decision; **default is delete**. |
| 35 | `user_vocabulary` | DELETE | `delete` | `user_id` | Personal vocab list (user-curated). |
| 36 | `user_writing_submissions` | DELETE | `delete` | `user_id` | Personal writing submissions + AI feedback. |
| 37 | `user_xp` | DELETE | `delete` | `user_id` | Per-user XP total. |
| 38 | `v_analytics_user_cohorts` | SYSTEM | `skip_view` | — | Plain VIEW (`CREATE OR REPLACE VIEW`), derives from `profiles`. CASCADE on profiles → user disappears from view. |
| 39 | `v_user_pronunciation_stats` | SYSTEM | `skip_view` | — | Plain VIEW, derives from `speech_attempts`. CASCADE on speech_attempts. |
| 40 | `vocabulary_srs_items` | DELETE | `delete` | `user_id` | Personal SRS state for vocab. |
| 41 | `weekly_leaderboard` | DELETE | `delete` | `user_id` | Per-user weekly score history. Same reasoning as #9. (Note: two parallel weekly-leaderboard tables exist — `leaderboard_weekly` vs `weekly_leaderboard`. Both real; both need manifest entries. Cleanup of the duplicate is out-of-scope here.) |
| 42 | `xp_events` | DELETE | `delete` | `user_id` | Append-only per-user XP-event ledger. CASCADE on auth.users. |

---

## Bucket counts

| Bucket | Count | Manifest action |
|---|---|---|
| **DELETE** (personal user data) | **29** | `delete` |
| **RETAIN** (audit / cost / experiment, anonymize) | **7** | `anonymize` (3 of them also need `scrub_columns` — see entries 6, 10, 19) |
| **SYSTEM** (view or admin-action log) | **5** | `skip_view` × 4 (`#1, #18, #38, #39`) + `skip_admin` × 1 (`#5`) |
| **REVIEW** (Chau decision) | **1** | — pending (`certificates`, item #2) |
| **Total** | **42** | matches PR #797 output |

---

## Recommendation for A4's manifest entries

A4 can land **41 of 42** entries from this classification deterministically — only `certificates` is gated on Chau confirming the column name + retention policy (entry #2, REVIEW).

### Paste-ready manifest fragment for A4

In the order the existing manifest groups things, the additions split as:

**DELETE block** (29 entries — under the existing "Personal learning / progress / memory / behavior data → DELETE" header):

```ts
{ table: "corporate_seats",                action: "delete", column: "user_id", reason: "per-user seat membership in a corporate plan" },
{ table: "daily_challenges",               action: "delete", column: "user_id", reason: "personal daily-challenge state + completions" },
{ table: "family_plan_members",            action: "delete", column: "user_id", reason: "per-user family-plan membership" },
{ table: "interview_sessions",             action: "delete", column: "user_id", reason: "per-user interview answers + scores" },
{ table: "leaderboard_weekly",             action: "delete", column: "user_id", reason: "per-user weekly score history" },
{ table: "mercy_conversations",            action: "delete", column: "user_id", reason: "Mercy chat threads (mercy_messages cascade via conversation_id)" },
{ table: "mercy_unified_sessions",         action: "delete", column: "user_id", reason: "per-user unified-session state" },
{ table: "mercy_user_facts",               action: "delete", column: "user_id", reason: "personal memory facts" },
{ table: "mfa_backup_codes",               action: "delete", column: "user_id", reason: "MFA backup codes (security)" },
{ table: "mfa_lockouts",                   action: "delete", column: "user_id", reason: "MFA lockout state (security)" },
{ table: "mock_interview_sessions",        action: "delete", column: "user_id", reason: "per-user mock interview state" },
{ table: "pronunciation_srs_items",        action: "delete", column: "user_id", reason: "personal pronunciation-SRS queue" },
{ table: "push_preferences",               action: "delete", column: "user_id", reason: "per-user notification preferences" },
{ table: "push_tokens",                    action: "delete", column: "user_id", reason: "device push tokens (must remove)" },
{ table: "referral_leaderboard_optin",     action: "delete", column: "user_id", reason: "personal referral-leaderboard opt-in + display name" },
{ table: "review_log",                     action: "delete", column: "user_id", reason: "SRS review history" },
{ table: "roadmap_item_votes",             action: "delete", column: "user_id", reason: "personal votes on roadmap items" },
{ table: "study_group_members",            action: "delete", column: "user_id", reason: "per-user study-group membership" },
{ table: "user_challenge_completion",      action: "delete", column: "user_id", reason: "personal pronunciation-challenge completions" },
{ table: "user_interview_prompt_votes",    action: "delete", column: "user_id", reason: "personal interview-prompt votes" },
{ table: "user_listening_progress",        action: "delete", column: "user_id", reason: "per-clip listening-comprehension progress" },
{ table: "user_placements",                action: "delete", column: "user_id", reason: "per-user placement test results" },
{ table: "user_stories",                   action: "delete", column: "user_id", reason: "personal community story submissions" },
{ table: "user_vocabulary",                action: "delete", column: "user_id", reason: "personal vocab list" },
{ table: "user_writing_submissions",       action: "delete", column: "user_id", reason: "personal writing submissions + AI feedback" },
{ table: "user_xp",                        action: "delete", column: "user_id", reason: "per-user XP total" },
{ table: "vocabulary_srs_items",           action: "delete", column: "user_id", reason: "personal vocab-SRS state" },
{ table: "weekly_leaderboard",             action: "delete", column: "user_id", reason: "per-user weekly score history (parallel to leaderboard_weekly)" },
{ table: "xp_events",                      action: "delete", column: "user_id", reason: "append-only personal XP-event ledger" },
```

**RETAIN block** (7 entries — under the "Billing / financial / audit → anonymize" header):

```ts
{ table: "email_sends_log",                action: "anonymize", column: "user_id",
  scrub_columns: { email: null },
  reason: "retain delivery log for ops/deliverability analysis, strip user + email" },
{ table: "lifetime_intent_signups",        action: "anonymize", column: "user_id",
  scrub_columns: { email: null },
  reason: "retain lifetime-tier intent signal, strip user + email" },
{ table: "mercy_tts_usage",                action: "anonymize", column: "user_id",
  reason: "retain TTS cost analytics, strip user linkage" },
{ table: "paywall_experiment_exposures",   action: "anonymize", column: "user_id",
  scrub_columns: { anon_id: null },
  reason: "retain A/B exposure for experiment integrity, strip user + anon device id" },
{ table: "push_send_log",                  action: "anonymize", column: "user_id",
  reason: "retain push delivery audit, strip user linkage" },
{ table: "referral_audit_log",             action: "anonymize", column: "user_id",
  reason: "retain anti-abuse referral audit, strip user linkage" },
{ table: "speech_analysis_logs",           action: "anonymize", column: "user_id",
  reason: "retain per-attempt cost log (OpenAI billing analytics), strip user linkage" },
```

**SYSTEM block** (5 entries — under the existing "Views" / "Admin actions" headers):

```ts
{ table: "all_time_referral_leaderboard",  action: "skip_view",  reason: "materialized view over referral_codes/uses/auth.users; refresh handles deletion" },
{ table: "email_audit",                    action: "skip_admin", reason: "admin_user_id logs the admin who sent the feedback reply, not the deleted user" },
{ table: "monthly_referral_leaderboard",   action: "skip_view",  reason: "materialized view over referral_codes/uses/auth.users; refresh handles deletion" },
{ table: "v_analytics_user_cohorts",       action: "skip_view",  reason: "plain view over profiles" },
{ table: "v_user_pronunciation_stats",     action: "skip_view",  reason: "plain view over speech_attempts" },
```

**REVIEW item** (1 entry — needs Chau decision before A4 lands):

- `certificates` — no migration in repo (prod-only schema drift). Chau needs to:
  1. Confirm the user-id column name (likely `user_id` or `owner_user_id`).
  2. Decide retention: delete (privacy default — earned credentials disappear) vs anonymize (retain proof of completion in aggregate, strip linkage). The user-facing surface (`src/components/certificates/`) treats certificates as a personal trophy case, which **suggests `delete`** — but A4 should not assume until confirmed.

### Operational notes for A4

1. **`anon_id` scrub on `paywall_experiment_exposures`** is non-obvious — the column is a pre-login device fingerprint that can re-link a "deleted" user via cookie/localStorage. Don't skip it. (The manifest's `scrub_columns` schema supports this.)
2. **Two parallel weekly-leaderboard tables** (`leaderboard_weekly` and `weekly_leaderboard`) — both need entries. Cleanup of the duplicate is a separate concern (out of B1 scope).
3. **`push_tokens` is privacy + security critical** — deleted users must stop receiving pushes immediately. Ensure the manifest entry runs before (or atomically with) the `auth.users` delete so the token can't be used in the window.
4. **`mercy_messages` is NOT in the 42** — already handled via `conversation_id` CASCADE from `mercy_conversations` (entry #11). No manifest entry needed for the child; the existing CI script accepts this because `mercy_messages` doesn't carry a direct `user_id` column.
5. **`user_stories`** — flagged as `delete` per privacy default, but if product later decides published community stories should outlive the author (with byline anonymized), revisit and switch to `anonymize` with `scrub_columns: { user_id: null }` plus whatever displayed-name field gets scrubbed. Not a blocker for the manifest land.

### What this doc does NOT cover

- The CI script's exit-code semantics (PR #797 covers that).
- Storage-bucket cleanup for any user-uploaded audio referenced from `user_challenge_completion.audio_url` or similar — that's an orthogonal sweep, not manifest scope.
- The 7 schemas marked "no migration in repo" (only `certificates` actually hit this — the others had lower-case `create table` and resolved on case-insensitive grep). The repo's migration drift (per `project_db_schema_drift_audit`, 179 PROD_AHEAD relations as of 2026-05-18) is the broader hygiene issue here; this audit only flags the **one** drift case (`certificates`) that lands in the 42.

---

## Cross-references

- PR #797 (the CI wire-up that surfaced these): `fix/b2-wire-delete-coverage-ci`
- Existing manifest: `supabase/functions/delete-account/user-data-manifest.ts`
- Coverage script: `scripts/check-delete-account-coverage.mjs`
- Memory: `project_db_schema_drift_audit` (179 PROD_AHEAD relations 2026-05-18) — context for the `certificates` REVIEW item
- PRINCIPLES.md §3 (one bug per PR) — why B2 (CI gate, #797) and B1 (manifest entries, A4's PR) ship separately
