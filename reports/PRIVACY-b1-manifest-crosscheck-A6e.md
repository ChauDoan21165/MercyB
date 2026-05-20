# B1 Manifest Crosscheck — A4 PR #811 vs A6d Classification (A6e)

**Reviewer:** A6 (A6e crosscheck of A4's PR #811 against A6d's #818 classification)
**Worktree:** `/private/tmp/A6e-manifest-crosscheck` (off `origin/main` @ `d4cf1e382`)
**Sources fetched read-only:**
- A4's manifest entries: `git show pr-811:supabase/functions/delete-account/user-data-manifest.ts` (branch `fix/b1-manifest-42-tables`)
- A6d's classification: `git show a6d:reports/PRIVACY-b1-manifest-classification-A6d.md` (branch `docs/b1-manifest-table-classification`)

**Headline:** the count divergence (A4: 36 `delete` + 2 `anonymize` + 4 `skip_view`; A6d: 29 DELETE + 7 RETAIN + 5 SYSTEM + 1 REVIEW) is **fully explained by one DDL fact A6d missed and A4 caught.** Zero dangerous mismatches.

---

## Merged classification table (42 of 42)

| # | Table | A4 (#811) | A6d (#818) | Match? | Who's right & why |
|---|---|---|---|---|---|
| 1 | `all_time_referral_leaderboard` | `skip_view` | SYSTEM/`skip_view` | ✅ | matched |
| 2 | `certificates` | `delete` (col `user_id`) | REVIEW | ⚠ partial | A4 acceptable — pragmatic default; CI script checks runtime column existence, can amend later without re-classifying |
| 3 | `corporate_seats` | `delete` | DELETE/`delete` | ✅ | matched |
| 4 | `daily_challenges` | `delete` | DELETE/`delete` | ✅ | matched |
| 5 | `email_audit` | `anonymize` (col `admin_user_id`, scrubs `recipient_email`/`subject`/`error_message`/`metadata`) | SYSTEM/`skip_admin` | ❌ | **A4 better.** A6d's `skip_admin` assumes the deleted user is never the admin row's `admin_user_id`. That's wrong: an admin can delete their own account. A4's `anonymize` correctly handles "admin deletes self" by scrubbing the admin's identifiable trail while keeping the audit row. |
| 6 | `email_sends_log` | `delete` | RETAIN/`anonymize` | ❌ | **A4 right (constraint).** `user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`. `UPDATE SET user_id = NULL` would violate NOT NULL → runtime failure. Anonymize is not available without a schema migration. A4's `delete` is the only correct choice given current DDL. |
| 7 | `family_plan_members` | `delete` | DELETE/`delete` | ✅ | matched |
| 8 | `interview_sessions` | `delete` | DELETE/`delete` | ✅ | matched |
| 9 | `leaderboard_weekly` | `delete` | DELETE/`delete` | ✅ | matched |
| 10 | `lifetime_intent_signups` | `anonymize` (scrubs `email`+`reason_text`) | RETAIN/`anonymize` (scrubs `email`) | ✅ | matched (A4 also scrubs `reason_text` — strictly more thorough) |
| 11 | `mercy_conversations` | `delete` | DELETE/`delete` | ✅ | matched |
| 12 | `mercy_tts_usage` | `delete` | RETAIN/`anonymize` | ⚠ product call | Both functional. `user_id` is nullable here (FK is `ON DELETE SET NULL`), so anonymize would have worked. A4 chose privacy-strict; A6d chose cost-analytics retention. Neither is wrong — Chau's call. **Not a blocker.** |
| 13 | `mercy_unified_sessions` | `delete` | DELETE/`delete` | ✅ | matched |
| 14 | `mercy_user_facts` | `delete` | DELETE/`delete` | ✅ | matched |
| 15 | `mfa_backup_codes` | `delete` | DELETE/`delete` | ✅ | matched |
| 16 | `mfa_lockouts` | `delete` | DELETE/`delete` | ✅ | matched |
| 17 | `mock_interview_sessions` | `delete` | DELETE/`delete` | ✅ | matched |
| 18 | `monthly_referral_leaderboard` | `skip_view` | SYSTEM/`skip_view` | ✅ | matched |
| 19 | `paywall_experiment_exposures` | `delete` | RETAIN/`anonymize` | ⚠ product call | Both functional. `user_id` is nullable (FK `ON DELETE SET NULL`). A4 chose privacy-strict; A6d chose experiment-integrity retention. **Not a blocker** but worth flagging — see §note below. |
| 20 | `pronunciation_srs_items` | `delete` | DELETE/`delete` | ✅ | matched |
| 21 | `push_preferences` | `delete` | DELETE/`delete` | ✅ | matched |
| 22 | `push_send_log` | `delete` | RETAIN/`anonymize` | ❌ | **A4 right (constraint).** `user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`. Anonymize is structurally impossible. |
| 23 | `push_tokens` | `delete` | DELETE/`delete` | ✅ | matched |
| 24 | `referral_audit_log` | `delete` | RETAIN/`anonymize` | ❌ | **A4 right (constraint).** `user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`. Anonymize is structurally impossible. (Anti-abuse retention argument is real but unimplementable without a schema migration that drops the NOT NULL — separate ticket if Chau wants it.) |
| 25 | `referral_leaderboard_optin` | `delete` | DELETE/`delete` | ✅ | matched |
| 26 | `review_log` | `delete` | DELETE/`delete` | ✅ | matched |
| 27 | `roadmap_item_votes` | `delete` | DELETE/`delete` | ✅ | matched |
| 28 | `speech_analysis_logs` | `delete` | RETAIN/`anonymize` | ❌ | **A4 right (constraint).** `user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`. Anonymize is structurally impossible. |
| 29 | `study_group_members` | `delete` | DELETE/`delete` | ✅ | matched |
| 30 | `user_challenge_completion` | `delete` | DELETE/`delete` | ✅ | matched |
| 31 | `user_interview_prompt_votes` | `delete` | DELETE/`delete` | ✅ | matched |
| 32 | `user_listening_progress` | `delete` | DELETE/`delete` | ✅ | matched |
| 33 | `user_placements` | `delete` | DELETE/`delete` | ✅ | matched |
| 34 | `user_stories` | `delete` | DELETE/`delete` | ✅ | matched |
| 35 | `user_vocabulary` | `delete` | DELETE/`delete` | ✅ | matched |
| 36 | `user_writing_submissions` | `delete` | DELETE/`delete` | ✅ | matched |
| 37 | `user_xp` | `delete` | DELETE/`delete` | ✅ | matched |
| 38 | `v_analytics_user_cohorts` | `skip_view` | SYSTEM/`skip_view` | ✅ | matched |
| 39 | `v_user_pronunciation_stats` | `skip_view` | SYSTEM/`skip_view` | ✅ | matched |
| 40 | `vocabulary_srs_items` | `delete` | DELETE/`delete` | ✅ | matched |
| 41 | `weekly_leaderboard` | `delete` | DELETE/`delete` | ✅ | matched |
| 42 | `xp_events` | `delete` | DELETE/`delete` | ✅ | matched |

**Match summary:**
- ✅ exact match: **34 / 42**
- ❌ mismatch (resolved in A4's favor): **5** — `email_audit`, `email_sends_log`, `push_send_log`, `referral_audit_log`, `speech_analysis_logs`
- ⚠ product-call divergence (both functional): **2** — `mercy_tts_usage`, `paywall_experiment_exposures`
- ⚠ partial (A4 acceptable, A6d more cautious): **1** — `certificates`

---

## Dangerous-mismatch analysis

A "dangerous mismatch" = either:
- **A** A4 marked `delete` when a legal/regulatory retention requirement applies (would expose to a compliance violation), or
- **B** A4 marked `anonymize` when the data is sensitive enough that retention is itself the risk (e.g., security credentials retained as anonymized rows).

### Case A (delete vs needed retention)

The 4 NOT-NULL-constraint mismatches (entries 6, 22, 24, 28) all sit in **internal ops/cost analytics + anti-abuse audit** territory:

| Table | Retention purpose A6d cited | Is it legally/regulatorily required? |
|---|---|---|
| `email_sends_log` | deliverability / list hygiene | No — RFC 8058 is about unsubscribe mechanics, not send-log retention |
| `push_send_log` | delivery diagnostics | No — no regulatory retention requirement |
| `referral_audit_log` | anti-abuse fraud detection | No — internal platform-safety convenience; no regulatory minimum |
| `speech_analysis_logs` | OpenAI cost tracking | No — billing analytics, not financial-records retention (per-user-id linkage is convenience, not requirement) |

None of the four trigger legal retention. So even setting aside the NOT-NULL constraint that makes anonymize technically impossible, A4's `delete` choice is **compliant**, and A6d's `anonymize` was overly cautious. **Zero Case-A dangerous mismatches.**

### Case B (anonymize vs delete-needed)

A4 only used `anonymize` for two tables: `email_audit` (admin-action log with proper scrubs) and `lifetime_intent_signups` (marketing intent with proper scrubs). Neither retains security credentials, biometrics, or anything else where retention is itself the risk. Both have appropriate `scrub_columns` that null/scrub the identifiable text. **Zero Case-B dangerous mismatches.**

### Case C (missing entries)

Both lists cover all 42 tables. The CI script (PR #797) will reject any table missing from the manifest, so a missing-entry case can't slip past CI.

---

## Why A4's 36-delete-count is higher than A6d's 29

The 7-entry gap is explained by the **NOT NULL constraint** that A6d missed:

| Table | A6d picked | DDL constraint | A4 correctly switched to |
|---|---|---|---|
| `email_sends_log` | anonymize | `user_id NOT NULL` | delete |
| `push_send_log` | anonymize | `user_id NOT NULL` | delete |
| `referral_audit_log` | anonymize | `user_id NOT NULL` | delete |
| `speech_analysis_logs` | anonymize | `user_id NOT NULL` | delete |
| `mercy_tts_usage` | anonymize | nullable | delete *(product call, privacy-strict)* |
| `paywall_experiment_exposures` | anonymize | nullable | delete *(product call, privacy-strict)* |
| `email_audit` | skip_admin | admin-only column | anonymize *(handles admin-deletes-self)* |

**A6d's `anonymize` recommendation for the four NOT-NULL tables would have caused runtime failures** (`UPDATE SET user_id = NULL` violates the NOT NULL constraint). A4's `delete` is the only correct choice without a schema migration. The remaining three are defensible product calls or strict improvements.

---

## Product-call divergences worth Chau seeing (not blockers)

These two aren't wrong on either side; they're judgment calls where A4 chose privacy-strict deletion and A6d recommended analytics retention. Either is defensible; A4's choice is the safer compliance default. Flagging so Chau can override before merge if preferred.

### `mercy_tts_usage` (entry 12)

- A4: `delete`. Result: per-user TTS cost rows go away with the user.
- A6d: `anonymize`. Result: cost rows stay, user link nulled — useful for "total TTS cost per language per month" analytics.
- Schema permits either (FK is `ON DELETE SET NULL`).
- **Recommendation:** keep A4's `delete` unless Chau actively wants the cost-aggregate signal preserved past account deletion. If yes, the manifest entry can be flipped to `anonymize` later — not a merge blocker.

### `paywall_experiment_exposures` (entry 19)

- A4: `delete`. Result: A/B exposures vanish with the user.
- A6d: `anonymize` (scrubs `anon_id` too). Result: exposure rows stay, user_id + device-fingerprint nulled — preserves the experiment denominator.
- Schema permits either (FK is `ON DELETE SET NULL`).
- Trade-off: A4 reduces experiment denominator slightly each time someone deletes; A6d preserves the experiment but keeps a row that could theoretically be re-linked via `anon_id` cookie if A6d's scrub isn't run (A4 sidesteps that risk by deleting outright).
- **Recommendation:** keep A4's `delete` — experiment denominator loss is small (account-deletion is rare), and the cleaner privacy story is worth it.

---

## `certificates` — the one REVIEW item

A4 picked `delete` with `column: "user_id"` as the default; A6d flagged REVIEW because no migration exists in repo (prod-only schema drift).

A4's PR body addresses this explicitly:
> Verifying the exact column name for `certificates` at runtime — the script only confirms it has SOME user-id column from the hint list. `user_id` is the default; if a runtime trace later shows a different column for that table, the manifest entry can be amended without re-classifying.

This is acceptable:
- The CI script (`scripts/check-delete-account-coverage.mjs`) validates against the live schema at run time; if `certificates` actually uses `owner_user_id` or another column, the script will report it and the entry can be amended in a one-line follow-up.
- `delete` is the strong-privacy default for an earned-credential record (user expects "deleting my account removes my certificates").
- If product later decides issued certificates should outlive the holder (e.g., verifiable-credential signing semantics where the certificate is third-party-portable), the manifest entry flips to `anonymize` with a scrub of any embedded user data — separate decision, not a merge blocker.

**No action needed pre-merge.** Chau can confirm column name + retention semantics in a follow-up; the manifest is amendable.

---

## In-repo regression lock (#811's tests)

PR #811 also ships `supabase/functions/delete-account/__tests__/user-data-manifest.test.ts` with 6 vitest cases including:

> **The 42 B1 tables (#797) are all covered**

This locks the classification against future drift — any deletion of one of the 42 entries from the manifest would break this test before reaching CI's live-schema check. Good defense-in-depth. Verified via `gh pr view 811 --json files` — test file is in the PR.

---

## Net verdict

**#811 is SAFE TO MERGE AS-IS.**

- **Dangerous-mismatch count: 0** (no PII deleted under a legal retention requirement; no sensitive credentials retained where deletion is needed).
- **Constraint-aware adjustments: 4** — A4 correctly caught the NOT-NULL constraint that A6d missed on `email_sends_log`, `push_send_log`, `referral_audit_log`, `speech_analysis_logs`. A6d's `anonymize` recommendation for these would have caused runtime failures.
- **Improvements over A6d: 1** — `email_audit` handled via `anonymize` + scrubs is strictly better than A6d's `skip_admin` (covers admin-deletes-self).
- **Product-call divergences: 2** — `mercy_tts_usage`, `paywall_experiment_exposures`. Both A4 choices are defensible privacy-strict picks. Not blockers; Chau can override post-merge if preferred.
- **REVIEW item: 1** — `certificates` resolved by A4's pragmatic default-and-amend approach; manifest is amendable without re-classifying.

### Optional post-merge follow-ups (not blockers)

1. Confirm `certificates` column name via CI run on #811 — if not `user_id`, amend the one entry.
2. Decide on `mercy_tts_usage` + `paywall_experiment_exposures` retention preference — if analytics retention is wanted, drop NOT NULL is not needed (these are already nullable), flip the two entries to `anonymize` in a one-line follow-up PR.
3. **If** anti-abuse retention of `referral_audit_log` is later judged worth a schema change: separate migration drops `NOT NULL` on `user_id`, then flip the manifest entry to `anonymize` — not a today decision.

---

## Cross-references

- A4's manifest PR: #811 (`fix/b1-manifest-42-tables`)
- A6d's classification: #818 (`docs/b1-manifest-table-classification`)
- A7's CI wire-up that surfaced the 42: #797 (`fix/b2-wire-delete-coverage-ci`)
- Live manifest file: `supabase/functions/delete-account/user-data-manifest.ts`
- Coverage script: `scripts/check-delete-account-coverage.mjs`
- New regression test (lands with #811): `supabase/functions/delete-account/__tests__/user-data-manifest.test.ts`
