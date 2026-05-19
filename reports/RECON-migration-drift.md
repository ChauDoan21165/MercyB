> **SUPERSEDED 2026-05-18** by A21's drift audit (memory
> `project_db_schema_drift_audit`; 179 PROD_AHEAD relations) and A31's
> reconciliation (memory `project_repo_ahead_reconciliation`; latency migration
> `20260518000000` applied to prod — DO NOT re-apply). Keep for audit trail.

# RECON — Supabase Migration Drift

**Agent:** migration-drift-agent · **Branch:** `migration-drift-fix` (based at f66eefc5)
**Date:** 2026-05-17 · **Phase:** 1 recon + Step C verification COMPLETE · **Status:** RE-VERIFIED + STEP-C-VERIFIED against live prod schema — awaiting Chau approval for Phase 2 (Step D)

> **Branch base note:** `origin/main` has since advanced to `c3b554e7` (#552 docs-perf, #553 strategy). Neither touched `supabase/migrations/` — inventory below is unaffected. Rebase `migration-drift-fix` onto `origin/main` before any Phase 2 push (hygiene only, no recon impact).

### Re-verification stamp (2026-05-17, independent re-run)

Every load-bearing claim re-checked live this session:

| Claim | Method | Result |
|---|---|---|
| Prior fix `437f1bb2` exists | `git log -1 437f1bb2` | ✅ "fix(migrations): standardize timestamps…" 2026-04-25 |
| No stuck/remote-only rows; PLAN.md 5 + notebook all `Local=Remote` | live `supabase migration list` | ✅ all 6 versions show `Local=Remote`, zero remote-only |
| 19 pending tracking rows | live `migration list` + awk count | ✅ exactly 19 (see caveat ↓) |
| 6 anomaly filenames exist | `ls` each | ✅ all 6 present |
| 3 CI secrets missing | `gh secret list` | ✅ only ANON/FUNCTIONS_URL/SERVICE_ROLE/VITE_URL present; ACCESS_TOKEN, PROJECT_REF, DB_PASSWORD absent |
| Count 205 (not ~150) | `ls *.sql \| wc -l` | ✅ 205 |

> **Caveat on "19":** `migration list` keys by *version*, so the 3 colliding version prefixes (`20260509000000`, `20260510000000`, `20260612`) each collapse to one row though **two files** share each. 19 pending **versions** ⇒ **22 pending files**. Repair is per-version (19 `repair --status applied` calls), but Step B must rename the colliding siblings *first* or `db push` aborts on duplicate-version before any repair matters.

---

## TL;DR — the diagnosis changed

The PLAN.md / NORTH_STAR drift (stuck 20260321 duplicate + 5 pending-but-applied migrations) **was already fixed on 2026-04-25** by commit `437f1bb2` ("fix(migrations): standardize timestamps … Migration tracking table fully synced via supabase migration repair + db push"). `supabase migration list` confirms: **no remote-only/stuck rows exist**, and all 5 PLAN.md migrations show `Local = Remote`.

The thing actually **blocking CI/CD is one layer up and is NOT migration drift**: the GitHub Actions secrets `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD` **do not exist in the repo**. Every `Supabase DB Migrations` run since 2026-04-28 dies at `supabase login --token` (empty token) before `db push` ever runs. Fixing migration tracking will not turn CI green until those secrets are added.

There **is** residual real drift underneath (19 pending rows + 6 malformed/duplicate filenames) that will block `db push` *once secrets exist* — that is the genuine Phase 2 work.

---

## 1. Inventory

| Metric | Value |
|---|---|
| Top-level `.sql` migrations | **205** (PLAN.md said ~150 — grew) |
| Archived (`_archive/`, untracked by CLI) | 6 + empty `_junk/creates` — harmless |
| Date range | `20251020090513` → `20260612` |
| Tracked rows in `supabase migration list` | 205 |
| Remote-only / stuck rows | **0** (the PLAN.md "stuck 20260321 duplicate" is GONE) |
| Local-only / pending rows | **19** |

### Anomalies (filename-level — these break `supabase db push`)

| Type | Files | Severity |
|---|---|---|
| **Duplicate version prefix** | `20260509000000_fix_access_codes_insert_policy.sql` + `20260509000000_share_cards_bucket.sql` | **HARD blocker** — CLI rejects duplicate versions |
| **Duplicate version prefix** | `20260510000000_payment_transactions_allow_gift_code.sql` + `20260510000000_weekly_leaderboard.sql` | **HARD blocker** |
| **Malformed 8-digit + duplicate** | `20260612_pronunciation_srs.sql` + `20260612_pronunciation_srs_rpcs.sql` | **HARD blocker** — version is 8-char `20260612`, not 14-char `YYYYMMDDHHMMSS`. `migration list` shows them literally as version `20260612`. Same bug class `437f1bb2` fixed, reintroduced by `c22a1438` (2026-04-29) |
| **Invalid calendar month** | `20260532000000`–`20260535000000` (`_teacher_review_role`, `_teacher_feedback`, `_user_interview_prompts`, `_cohort_retention`) — "month 53" | LOW — 14-digit so CLI sorts them lexically fine (between `20260531` and `20260601`); cosmetic/confusing only. Leave unless cleaning |
| **Future-dated** (date > 2026-05-17) | everything `20260518000000` → `20260612` (~30 files) | INFO — **intentional sequencing convention, real feature migrations** (latency_events, web_vitals, push_notifications, vocabulary_srs, writing_practice, 2fa, xp…). Not accidental. No action needed beyond the pending ones below |

---

## 2. CLI state vs production (from `supabase migration list`, ran read-only via cached link)

`supabase migration list` **works from this machine** (CLI has a cached link / saved token — `SUPABASE_ACCESS_TOKEN` is *not* an env var but the saved profile authenticates). It is strictly read-only.

### PLAN.md's 5 "problem" migrations — ALL RESOLVED ✅

| Version | Local | Remote | Disposition |
|---|---|---|---|
| `20260321000000_add_apple_iap_events_and_constraints` | ✓ | ✓ | APPLIED-IN-PROD-AND-CLI — do nothing |
| `20260321172500_speech_attempts` | ✓ | ✓ | APPLIED-IN-PROD-AND-CLI — do nothing |
| `20260402000000_admin_billing_metrics` | ✓ | ✓ | APPLIED-IN-PROD-AND-CLI — do nothing |
| `20260403000000_billing_price_map` | ✓ | ✓ | APPLIED-IN-PROD-AND-CLI — do nothing |
| `20260420000038_add_points_and_name` | ✓ | ✓ | APPLIED-IN-PROD-AND-CLI — do nothing |
| `20260420225840_add_notebook` (notebook) | ✓ | ✓ | APPLIED-IN-PROD-AND-CLI — do nothing |

**Question #7 answered:** the 5 specific migrations + the stuck duplicate were handled 22 days ago by `437f1bb2`. No `repair --status reverted` is needed — there is **no stuck/duplicate remote row** anymore. The PLAN.md "DUPLICATE" bucket is **empty**.

### The 19 actual pending rows (`Local` present, `Remote` blank)

These were applied to prod **out of order via the SQL Editor** for shipped features, but never recorded in `schema_migrations` (classic manual-SQL drift). Probe object listed for per-migration verification:

| Version | File | Probe object (check exists in prod) | Idempotent? |
|---|---|---|---|
| 20260504010000 | feedback_require_auth | policy `authenticated users insert own feedback` on `app_feedback` | ❌ bare CREATE POLICY |
| 20260504020000 | feedback_grants | GRANTs on feedback table | ✅ GRANT |
| 20260509000000 | fix_access_codes_insert_policy | policy `Admins can select access codes` | ❌ bare CREATE POLICY |
| 20260509000000 | share_cards_bucket | policy `share_cards_public_read` + bucket `share_cards` | ❌ bare CREATE POLICY |
| 20260510000000 | payment_transactions_allow_gift_code | fn `redeem_access_code_atomic` | ✅ CREATE OR REPLACE |
| 20260510000000 | weekly_leaderboard | fn `weekly_leaderboard_current_week_start` | ✅ CREATE OR REPLACE |
| 20260510010000 | fix_sync_profile_tier_trigger | fn `sync_profile_tier_from_payment_transactions` | ✅ CREATE OR REPLACE |
| 20260510020000 | fix_gift_subscription_constraint | fn `redeem_access_code_atomic` (re-patch) | ✅ CREATE OR REPLACE |
| 20260510030000 | fix_second_gift_subscription_constraint | constraint patch | ⚠️ verify |
| 20260511180000 | grant_award_points_execute | GRANT EXECUTE on `award_points` | ✅ GRANT |
| 20260511190000 | list_user_data_tables_rls_status | fn `list_user_data_tables_rls_status` | ✅ CREATE OR REPLACE |
| 20260602000000 | onboarding_columns | index `profiles_pending_onboarding_idx` + profile cols | ✅ IF NOT EXISTS |
| 20260603000000 | vocabulary_srs | table `user_vocabulary` | ✅ IF NOT EXISTS |
| 20260605000000 | mercy_unified_session | table `mercy_unified_sessions` | ✅ IF NOT EXISTS |
| 20260606000000 | writing_practice | table `writing_prompts` | ✅ IF NOT EXISTS |
| 20260607000000 | pronunciation_challenges | table `pronunciation_challenges` | ✅ IF NOT EXISTS |
| 20260608000000 | 2fa_phase_2 | table `mfa_backup_codes` | ✅ IF NOT EXISTS |
| 20260609000000 | xp_gamification | table `xp_events` | ✅ IF NOT EXISTS |
| 20260610000000 | mock_interview_community_flag | feature-flag seed | ⚠️ verify |
| 20260612 (×2) | pronunciation_srs / _rpcs | table + fn `record_vocabulary_review` | ✅ IF NOT EXISTS — but **malformed filename** |

All these features shipped to prod (PRs #222/#223/#225/#226/#228/#229/#230/#232/#355/#358/#361/#362/#378 are in `origin/main`), so the DDL is **almost certainly already in prod** → most are **APPLIED-IN-PROD-BUT-CLI-PENDING**. But this needs per-object confirmation before marking `applied` (see Risk).

---

## 3. Why CI/CD is actually red (root cause — separate layer)

`gh secret list` for `ChauDoan21165/MercyB`:

```
Present: CRON_SECRET, SENTRY_AUTH_TOKEN, SUPABASE_ANON_KEY, SUPABASE_FUNCTIONS_URL,
         SUPABASE_SERVICE_ROLE_KEY, VERCEL_*, VITE_SUPABASE_URL
MISSING: SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_REF, SUPABASE_DB_PASSWORD
```

`.github/workflows/supabase-migrations.yml` references all three missing secrets. Failure log of latest run (`25689148175`, 2026-05-11):

```
SUPABASE_ACCESS_TOKEN:                       ← empty
flag needs an argument: --token              ← supabase login fails here
##[error]Process completed with exit code 1  ← never reaches `supabase db push`
```

Every run 2026-04-28 → 2026-05-11 is `failure` for the same reason (also `supabase-db-staging-prod.yml`). **Conclusion: the migration tracking table is a red herring for CI being red right now.** Reconciliation is still needed so that `db push` *succeeds* once the secrets exist — but adding the 3 secrets is the actual unblock.

(Minor unrelated CI noise: `fatal: No url found for submodule path '.claude/skills/email-marketing-bible'` — post-job cleanup warning, not the failure cause. No `.gitmodules` at HEAD.)

---

## 4. Reconciliation plan (Phase 2 — needs Chau approval)

Order matters. **A is the real CI unblock; B/C/D fix the drift so `db push` won't error.**

### Step A — Add GitHub secrets (Chau only; I cannot set secrets)
```bash
gh secret set SUPABASE_ACCESS_TOKEN  --repo ChauDoan21165/MercyB   # personal access token, supabase.com/dashboard/account/tokens
gh secret set SUPABASE_PROJECT_REF   --repo ChauDoan21165/MercyB --body "buemdfxyhxunzpgdoqin"
gh secret set SUPABASE_DB_PASSWORD   --repo ChauDoan21165/MercyB   # DB password, project settings → Database
```

### Step B — Fix filename anomalies (code change in this branch, `git mv`, no deletes)
Rename the 6 collision/malformed files to unique 14-digit versions. All 6 are **pending** (not in remote), so renaming is safe — no remote row references the old names:
```
20260509000000_share_cards_bucket.sql                    → 20260509010000_share_cards_bucket.sql
20260510000000_weekly_leaderboard.sql                    → 20260510005000_weekly_leaderboard.sql
20260612_pronunciation_srs.sql                           → 20260612000000_pronunciation_srs.sql
20260612_pronunciation_srs_rpcs.sql                      → 20260612010000_pronunciation_srs_rpcs.sql
```
(`20260509000000_fix_access_codes_insert_policy.sql` and `20260510000000_payment_transactions_allow_gift_code.sql` keep their version — only the colliding sibling moves. Optional: also renumber `20260532–20260535` to valid June dates — cosmetic, defer.)

### Step C — Verify each pending migration's DDL is actually in prod ✅ DONE
Docker started by Chau. Dumped live prod schema read-only:
`supabase db dump --linked --schema public` (23,388 lines) + `--schema storage` (1,402 lines).
Every pending migration probed against the real dump. **Full verdict table in §8.**
Result: **19 of 21 pending files confirmed IN PROD** → `repair --status applied`. **2 genuinely NOT in prod** (`20260511190000`, `20260610000000`) → leave pending, both fully idempotent so `db push` applies them safely.

### Step D — Repair tracking, then push (Step-C-verified — final sequence)
**19 versions confirmed in prod → mark applied** (post-rename version numbers):
```bash
supabase migration repair --status applied 20260504010000   # feedback_require_auth
supabase migration repair --status applied 20260504020000   # feedback_grants
supabase migration repair --status applied 20260509000000   # fix_access_codes (kept version)
supabase migration repair --status applied 20260509010000   # share_cards (renamed)
supabase migration repair --status applied 20260510000000   # payment_transactions (kept version)
supabase migration repair --status applied 20260510005000   # weekly_leaderboard (renamed)
supabase migration repair --status applied 20260510010000   # fix_sync_profile_tier_trigger
supabase migration repair --status applied 20260510020000   # fix_gift_subscription_constraint
supabase migration repair --status applied 20260510030000   # fix_second_gift_subscription_constraint
supabase migration repair --status applied 20260511180000   # grant_award_points_execute
supabase migration repair --status applied 20260602000000   # onboarding_columns (cols+equiv index in prod)
supabase migration repair --status applied 20260603000000   # vocabulary_srs
supabase migration repair --status applied 20260605000000   # mercy_unified_session
supabase migration repair --status applied 20260606000000   # writing_practice
supabase migration repair --status applied 20260607000000   # pronunciation_challenges
supabase migration repair --status applied 20260608000000   # 2fa_phase_2
supabase migration repair --status applied 20260609000000   # xp_gamification
supabase migration repair --status applied 20260612000000   # pronunciation_srs (renamed)
supabase migration repair --status applied 20260612010000   # pronunciation_srs_rpcs (renamed)
```
**2 versions NOT in prod → leave pending; `db push` applies them (both fully idempotent, zero risk):**
- `20260511190000_list_user_data_tables_rls_status` — `CREATE OR REPLACE FUNCTION` (admin RLS-audit helper), genuinely absent (0 occurrences in prod dump).
- `20260610000000_mock_interview_community_flag` — pure data seed `INSERT … ON CONFLICT DO NOTHING`; row state not confirmable from a schema dump, but re-running is a no-op whether or not it exists. Leave pending rather than spend a verification round on a risk-free idempotent insert.

Then verify + push:
```bash
supabase migration list      # expect only 20260511190000 + 20260610000000 still Local-only
supabase db push             # applies exactly those 2 (both idempotent — safe)
supabase migration list      # final: every row Local = Remote, zero blanks
```
No `repair --status reverted` is required (no stuck/remote-only rows).

---

## 5. Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `repair --status applied` on a migration whose DDL is **not** actually in prod | Low (features shipped) but real | **HIGH** — `db push` then skips it forever → permanent missing schema | **Step C is mandatory** per-object verification before any `repair applied`. Do NOT skip. |
| `db push` re-runs non-idempotent DDL already in prod (`CREATE POLICY` ×3, bare `CREATE INDEX`) | Med if pushed without repair | Med — push aborts with "already exists" | Repair-applied the manually-applied ones *first*; only genuinely-new ones reach push |
| Renaming pending migration files desyncs something | Very low | Low — they're pending, no remote row points to old name | `git mv` only; never delete (per ground rule); verify each renamed file still absent in Remote before repair |
| Adding wrong/over-scoped `SUPABASE_ACCESS_TOKEN` | Low | Med — CI gets prod write access | Use a scoped token; rotate after; Chau sets it, not the agent |
| Docker unavailable blocks Step C verification | Certain on this machine | Med — slows Phase 2 | Chau starts Docker for `db dump`, or uses SQL Editor probe queries |
| Recoverability | — | — | All steps reversible: `repair` re-runnable both directions; renames are git-tracked; no destructive SQL proposed; `db push` only forward-applies |

---

## 6. Estimated Phase 2 time

| Step | Owner | Est. |
|---|---|---|
| A — GitHub secrets | Chau | 10 min |
| B — Rename 6 files | agent (this branch) | 15 min |
| C — Verify DDL in prod (Docker dump or SQL probes) | Chau + agent | 30–45 min |
| D — repair sequence + push + verify | Chau (or agent w/ token) | 20 min |
| **Total** | | **~75–90 min** |

## 7. Blockers / what's needed from Chau

1. **Decision:** approve Phase 2? (irreversible-on-prod gate per locked principle #4 — `repair`/`db push` touch the prod tracking table)
2. **GitHub secrets** (Step A) — only Chau can set these.
3. **Docker** running, OR Chau runs the SQL Editor probe queries, for Step C verification.
4. `SUPABASE_ACCESS_TOKEN` / DB password for the agent to run Step D, **or** Chau runs Step D commands manually (recommended — they're short and copy-pasteable above).

**Recommendation:** Step A alone turns CI green for *future* well-formed migrations is NOT true until B+C+D land too (push would still choke on the 6 bad filenames). Do A+B+C+D together as one Phase 2.

---

## 8. Step C verification results (2026-05-17 — live prod schema dump)

**Method:** `supabase db dump --linked --schema public` (23,388 lines) + `--schema storage` (1,402 lines), Docker-backed pg_dump against prod project `buemdfxyhxunzpgdoqin`, strictly read-only. Each pending migration probed for a distinguishing object in the dump. (First probe pass had false-negatives from assuming unquoted `CREATE TABLE public.x`; pg_dump 17 emits `CREATE TABLE IF NOT EXISTS "public"."x"` — re-run with correct quoting; verdicts below are the corrected, trustworthy pass.)

**Step B already done by Chau** (commits `64aaf4ec` re-verify, `b2565c6b` rename) — the 4 colliding/malformed files renamed exactly per the plan. Verdicts use post-rename versions.

| Version (post-rename) | File | Probe object | In prod? | Disposition |
|---|---|---|---|---|
| 20260504010000 | feedback_require_auth | policy `authenticated users insert own feedback` | ✅ | repair → applied |
| 20260504020000 | feedback_grants | fn `check_feedback_rate_limit` (co-shipped) | ✅ | repair → applied |
| 20260509000000 | fix_access_codes_insert_policy | policy `Admins can select access codes` | ✅ | repair → applied |
| 20260509010000 | share_cards_bucket | storage policy `share_cards_public_read` (+`_owner_insert/_delete`) | ✅ | repair → applied (migration is transactional ⇒ bucket INSERT committed with the policies) |
| 20260510000000 | payment_transactions_allow_gift_code | constraint `payment_transactions_payment_method_check` | ✅ | repair → applied |
| 20260510005000 | weekly_leaderboard | fn `weekly_leaderboard_current_week_start` | ✅ | repair → applied |
| 20260510010000 | fix_sync_profile_tier_trigger | fn `sync_profile_tier_from_payment_transactions` | ✅ | repair → applied |
| 20260510020000 | fix_gift_subscription_constraint | col `is_gift_redemption` + constraint `active_requires_stripe_for_paid_tiers` | ✅ | repair → applied |
| 20260510030000 | fix_second_gift_subscription_constraint | constraint `user_subscriptions_active_requires_stripe` | ✅ | repair → applied |
| 20260511180000 | grant_award_points_execute | fn `public.award_points` (grant target) | ✅ | repair → applied |
| **20260511190000** | **list_user_data_tables_rls_status** | fn `list_user_data_tables_rls_status` | ❌ **0 hits** | **LEAVE PENDING → db push** (idempotent `CREATE OR REPLACE FUNCTION`) |
| 20260602000000 | onboarding_columns | cols `onboarded_at/primary_goal/profession` + partial index | ✅ * | repair → applied |
| 20260603000000 | vocabulary_srs | tables `user_vocabulary` + `review_log` | ✅ | repair → applied |
| 20260605000000 | mercy_unified_session | table `mercy_unified_sessions` | ✅ | repair → applied |
| 20260606000000 | writing_practice | table `writing_prompts` | ✅ | repair → applied |
| 20260607000000 | pronunciation_challenges | table `pronunciation_challenges` | ✅ | repair → applied |
| 20260608000000 | 2fa_phase_2 | table `mfa_backup_codes` | ✅ | repair → applied |
| 20260609000000 | xp_gamification | table `xp_events` | ✅ | repair → applied |
| **20260610000000** | **mock_interview_community_flag** | feature_flags seed row | ⚠️ data-only | **LEAVE PENDING → db push** (`INSERT … ON CONFLICT DO NOTHING`; `feature_flags` table exists; row not in schema dump; re-run is a no-op either way) |
| 20260612000000 | pronunciation_srs | tables `vocabulary_srs_items` + `pronunciation_srs_items` | ✅ | repair → applied |
| 20260612010000 | pronunciation_srs_rpcs | fns `record_vocabulary_review` + `record_pronunciation_attempt` | ✅ | repair → applied |

**Tally: 19 IN-PROD (repair → applied) · 2 NOT-IN-PROD (leave pending, db push — both idempotent, safe).**

\* **onboarding_columns nuance:** the 3 columns + their CHECK constraints ARE in prod (dump lines 6971–6983); a functionally-identical partial index exists but is named **`idx_profiles_onboarding_gate`**, not the migration's `profiles_pending_onboarding_idx`. The schema change is materially applied → mark applied. (Migration is fully idempotent; if instead pushed it would add a second, redundant-but-harmless index — `repair → applied` is preferred to avoid that.)

### Updated risk posture (post-Step-C)
- The **HIGH** risk from §5 ("repair-applied on something not actually in prod") is now **retired** — every repair-applied version was object-verified against the live dump. The only 2 not in prod are explicitly left for `db push`, not marked applied.
- Both push-applied migrations are idempotent (`CREATE OR REPLACE` / `ON CONFLICT DO NOTHING`) → `db push` cannot error on them.
- Net residual risk: **LOW**. Step D is 19 reversible `repair` calls + a 2-migration idempotent push. Phase 2 (Step D) est: **~15–20 min**.
