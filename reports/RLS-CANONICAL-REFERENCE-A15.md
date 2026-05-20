# RLS Canonical Reference — A15

**Status:** Documentation-only PR. Zero schema change. Zero runtime impact.
**Branch:** `docs/A15-rls-canonical-reference`
**Snapshot:** `reports/RLS-current-state-A15.json` (Chau-pasted from `pg_policies`)
**Source pass:** `supabase/migrations/*.sql` (221 migrations as of 2026-05-19)

> ⚠️ **A15 label collision.** A separate `/private/tmp/A15-raw-payload-backfill` worktree is doing Stripe raw-payload backfill SQL under the same `A15` label. This RLS-docs PR is unrelated. Disambiguate by reading the PR title (`docs(security): canonical RLS reference + inline policy documentation`).

---

## 1. Headlines (from Chau-confirmed `pg_policies` snapshot)

| Metric | Count |
| --- | ---: |
| Total RLS policies (public + auth + storage) | **226** |
| Tables with RLS enabled | **236** |
| Public tables without RLS | **0** ✅ |
| Existing `COMMENT ON POLICY` rows | **0** — this PR closes that gap |

**The repo is the source of truth.** A future auditor can `grep -r 'COMMENT ON POLICY' supabase/migrations/` and see intent inline, instead of needing prod read access.

---

## 2. Conventions used across the catalog

Internalize these once and every policy reads cleanly.

### 2.1 `get_admin_level()` tier ladder

Single source of truth: `get_admin_level()` (a `SECURITY DEFINER` function returning an integer per `auth.uid()`).

| Threshold | Role | Used by |
| ---: | --- | --- |
| `>= 5` | **Teacher / content reviewer** | content read-flags, reviewer queues (~8 occurrences) |
| `>= 7` | **Regional / billing admin** | billing read, refund tools, gift redemption (~10 occurrences) |
| `>= 9` | **Super-admin / SLO monitor** | full table writes, analytics views, RLS-aware functions (~70 occurrences) |
| `> 0` | **Any admin (legacy)** | a handful of older policies — kept for compatibility (~3 occurrences) |

Counts derived from a grep across all 221 migrations. The ratio confirms `>= 9` is the dominant gate.

### 2.2 `require_aal2_when_factor_present` RESTRICTIVE pattern

**One policy name, applied across ~30–40 public tables** (see `supabase/migrations/20260529000000_mfa_aal2_required_when_enrolled.sql`). Applied via a single `DO $$ … LOOP … EXECUTE format(…)` block.

**Intent (one sentence, applies to every instance):**

> RESTRICTIVE FOR ALL TO authenticated — when the calling user has an enrolled MFA factor, the row is unreachable unless the JWT carries `aal=aal2`. Users without an enrolled factor are unaffected. RESTRICTIVE combines via AND with permissive policies → adds a gate, never widens access.

**Predicate:**
```sql
USING       (public.session_is_aal2() OR NOT public.user_has_verified_mfa())
WITH CHECK  (public.session_is_aal2() OR NOT public.user_has_verified_mfa())
```

**Documentation rule:** the COMMENT migration in this PR writes the same one-liner to every `require_aal2_when_factor_present` policy, programmatically. Do not hand-edit per-table.

### 2.3 Permissive vs RESTRICTIVE

- **Permissive** (default): policies OR together — any matching policy grants access.
- **RESTRICTIVE**: policies AND with the permissive set — used as a hard gate (aal2 pattern above).

The catalog flags every RESTRICTIVE policy explicitly in its COMMENT.

### 2.4 Roles

- `anon` — unauthenticated public web traffic (browser anon key).
- `authenticated` — any signed-in user (post-JWT).
- `service_role` — server-only, bypasses RLS entirely (used by Vercel API routes + Supabase edge functions).
- `postgres` / `supabase_admin` — privileged DB roles, used by migrations.

A policy with **`roles = {anon, authenticated}`** is a public-read policy. Treat every one of those as a deliberate decision and verify the table has no per-user PII.

---

## 3. Security notes (flagged — NOT fixed in this PR)

These are observations from the snapshot. They are **separate from the documentation work** and should be triaged in a follow-up audit.

### 3.1 `weekly_digest_data` — `anon + authenticated SELECT` with `qual: true`

- **Table:** `public.weekly_digest_data`
- **Risk:** A truly-public SELECT (`USING true`, roles include `anon`) is safe only if the table holds aggregate-only content (e.g., a "this week we shipped X lessons" content snapshot for the marketing site / blog).
- **Verify before triage:** does any row carry per-user data (user_id, email, telemetry attribution)? If yes → leak.
- **Prior memory hint:** memory `project_rls_audit_2026_05_18` notes this was previously called out as a regex false positive — public /blog content was the intentional surface. Re-confirm before changing anything.

### 3.2 `feature_flags` — `anon`-readable

- **Table:** `public.feature_flags`
- **Likely intentional:** feature flags need to be readable client-side at page load, including for anonymous visitors, so the SPA can branch on rollouts before sign-in.
- **Document the reasoning:** the COMMENT on this policy makes the "anon-readable on purpose, no PII expected" rule explicit so future migrations don't accidentally inherit it for a different table.

### 3.3 `listening_clips` — public SELECT

- **Table:** `public.listening_clips`
- **Likely intentional:** preview audio served to free-tier and trial users. Memory `project_listening_audio_backfill` confirms the bucket is public + audio URLs are stored in-table.
- **Document the reasoning:** anon SELECT is the contract. Treat any later addition of PII columns (e.g., per-user attempt rows) as breaking the contract and revisit RLS.

### 3.4 `require_aal2_when_factor_present` — pattern, not 40 separate findings

- **~40 tables** wear this policy. Documented once in §2.2; the COMMENT migration writes the same templated comment to every instance.
- **Not a finding** — flagged here only because the volume looks like a finding at first glance.

### 3.5 Admin tier consistency

- The `5 / 7 / 9` ladder (§2.1) is well-followed in newer migrations (post-2026-04).
- A handful of legacy migrations use `> 0` (any admin) — flagged for follow-up consolidation, **not** changed in this PR.

---

## 4. What this PR ships

1. `reports/RLS-CANONICAL-REFERENCE-A15.md` — this document.
2. `reports/RLS-current-state-A15.json` — pg_policies snapshot (Chau-pasted; structured for diff against future snapshots).
3. `supabase/migrations/20260625000000_rls_policy_documentation.sql` — data-driven `DO $$ ... $$` block that walks `pg_policies` and applies `COMMENT ON POLICY` to every policy that lacks one, using:
   - hand-curated overrides for the security-noted policies (weekly_digest_data, feature_flags, listening_clips)
   - templated text for `require_aal2_when_factor_present`
   - pattern-matched intent for common naming conventions (owner-access, admin-manage, admin-view, public-read)
   - generic fallback so 100 % of policies receive a comment
   - **Idempotent** — re-running the migration is a no-op for policies that already have a non-empty comment.
4. `scripts/check-rls-doc-coverage.mjs` — CI gate. Loads the JSON snapshot + parses migrations. Fails if a policy in the snapshot has no documentation source.
5. `.github/workflows/ci.yml` — adds `rls-doc-coverage` job, runs the gate on every PR.

## 5. What this PR does **not** do

- Does **not** add, modify, drop, or rename any RLS policy.
- Does **not** change RLS-enabled state on any table.
- Does **not** touch the security findings in §3 — those go into a follow-up.
- Does **not** apply itself via `supabase db push` — Chau applies the COMMENT migration via Supabase SQL Editor per the project's RLS-via-SQL-Editor rule.

## 6. How to update going forward

When you add a new policy in a future migration:

1. Write the policy as you normally would.
2. Add a `COMMENT ON POLICY` in the **same migration file**, one or two sentences explaining intent + role + predicate gist.
3. The CI gate at `scripts/check-rls-doc-coverage.mjs` enforces step 2.

When you re-snapshot `pg_policies`:

1. Run `reports/RLS-pgpolicies-dump-query.sql` in Supabase SQL Editor.
2. Replace `reports/RLS-current-state-A15.json` with the result.
3. Commit. The gate re-runs against the fresh snapshot.

---

## 7. References

- Memory: `project_rls_audit_2026_05_18.md` — prior audit findings, false-positive flags, agent-can't-read-pg_catalog constraint.
- Memory: `project_agent_infra_access.md` — RLS migrations via SQL Editor, not `supabase db push`.
- Memory: `feedback_compliance_risk_framing.md` — never soften compliance findings by cohort size.
- Migration: `supabase/migrations/20260529000000_mfa_aal2_required_when_enrolled.sql` — aal2 RESTRICTIVE source.
- Query: `reports/RLS-pgpolicies-dump-query.sql` — the read-only dump query used.
