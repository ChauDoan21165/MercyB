# Recon: anon-readable tables — A15b

**Status:** Documentation-only PR. Zero schema change. Zero RLS change.
**Branch:** `docs/A15b-anon-tables-investigation`
**Follow-up to:** PR #897 (`docs/A15-rls-canonical-reference`) — Security Notes §3
**Investigation date:** 2026-05-19

> Label disambiguation: this is the **A15b** RLS docs track. A separate `/private/tmp/A15-raw-payload-backfill` worktree is doing Stripe raw-payload SQL under `A15` — **unrelated**.

---

## TL;DR

| Table | Anon SELECT | Verdict |
| --- | :-: | --- |
| `weekly_digest_data` | ✅ allowed | **SAFE** — schema is aggregate-only by construction |
| `feature_flags` | ✅ allowed | ⚠️ **REAL FINDING** — `enabled_user_ids` column leaks dark-launch tester UUIDs (pending prod confirmation, §2) |
| `listening_clips` | ✅ allowed | **SAFE** — schema is content-catalog only, no PII columns |

**Action items (this PR ships NONE of them — flagged for triage):**

- 🔴 **feature_flags leak**: 4 mitigation options documented in §2.5 below. Recommended option = public view + private base table.
- 🟡 weekly_digest_data + listening_clips: add an explicit `COMMENT ON TABLE` cross-link to this audit so future migrations don't accidentally widen the contract.

---

## 1. `weekly_digest_data` — ✅ SAFE

### 1.1 Source

- **Schema:** `supabase/migrations/20260517000000_weekly_digest_aggregates.sql:1-13`
- **Policy:** `Anyone can read weekly digest aggregates` — `FOR SELECT TO anon, authenticated USING (true)`

### 1.2 Columns

```sql
CREATE TABLE public.weekly_digest_data (
  week_starts_on date PRIMARY KEY,
  total_attempts_this_week integer NOT NULL DEFAULT 0,
  total_unique_active_users_this_week integer NOT NULL DEFAULT 0,
  new_users_this_week integer NOT NULL DEFAULT 0,
  top_phoneme_improved text,
  top_phoneme_improvement_points numeric(5, 2),
  top_topic_practiced text,
  top_topic_attempt_count integer,
  refreshed_at timestamptz NOT NULL DEFAULT now()
);
```

### 1.3 Analysis

- **No `user_id` / `email` / `uuid` / per-user FK columns.** Every non-key column is an aggregate count, a textual top-N label, or a refresh timestamp.
- The table is populated by a `SECURITY DEFINER` function `refresh_weekly_digest()` that aggregates from `speech_attempts` and writes only the rolled-up counts.
- Table already has a `COMMENT ON TABLE` reading: *"A9 weekly community aggregates. Aggregates ONLY — no per-user data."* The audit re-confirms.

### 1.4 Verdict

**SAFE.** The anon SELECT policy is schema-enforced — there's no way to read per-user data because no per-user data is stored. This is the cleanest of the three.

### 1.5 Recommendation

No change. Optionally add a `CHECK` constraint or a schema-test gate that fails if `user_id`-shaped columns are ever added without removing the anon SELECT. Low priority.

---

## 2. `feature_flags` — ⚠️ REAL FINDING (active leak pending prod confirmation)

### 2.1 Source

- **Original CREATE:** `supabase/migrations/20251122032324_…sql` (2025-11-22)
- **PII column added:** `supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql` (2026-04-24) — adds `enabled_user_ids uuid[]`
- **Anon-read policy unchanged across both migrations.** The migration that added the PII column did **not** revisit RLS.

### 2.2 Columns

```sql
-- post-2026-04-24 schema
CREATE TABLE public.feature_flags (
  id uuid PRIMARY KEY,
  flag_key text UNIQUE NOT NULL,
  is_enabled boolean DEFAULT true,
  description text,
  enabled_user_ids uuid[] NOT NULL DEFAULT '{}',   -- ⚠️ added 2026-04-24
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 2.3 Active policy

```sql
CREATE POLICY "Anyone can view feature flags"
  ON public.feature_flags
  FOR SELECT
  USING (true);  -- roles include anon
```

(Admin INSERT/UPDATE policies added later, gated by `get_admin_level >= 9`. They don't affect SELECT.)

### 2.4 Client code path

`src/lib/featureFlags.ts:128-132`:

```ts
const { data } = await client
  .from("feature_flags")
  .select("is_enabled, enabled_user_ids")  // ← both columns leave the DB
  .eq("flag_key", flagKey)
  .maybeSingle();
```

The browser SDK uses the **anon key** for unauthenticated callers. Because the RLS policy is `USING (true)`, anon clients can SELECT the full row including `enabled_user_ids`. No application-layer column filtering exists.

### 2.5 Finding

> **Information disclosure of dark-launch cohort identity.**
>
> Any unauthenticated browser session can read the full `enabled_user_ids` array for every feature flag — the UUIDs of users included in pre-release / dark-launch test cohorts (e.g. Chau + 1–2 testers per the migration comment).
>
> **What a UUID alone enables:** It is not a credential. But it does identify *which users have early access to which features*, and it can be joined against `profiles` (publicly-readable columns) and `auth.users` (admin-only) to map UUID → display_name in some surfaces. For a competitor doing public-site recon, it surfaces internal product strategy + tester identity.
>
> **What a UUID alone does NOT enable:** Login, account takeover, reading per-user content. The UUID is opaque to most surfaces and meaningless without a valid JWT.
>
> **Severity:** Soft information disclosure. Not catastrophic, not nothing. The dark-launch promise is silently broken when the cohort can be enumerated externally.

### 2.6 Activation check (Chau-runnable SQL)

The finding is **theoretical** unless `enabled_user_ids` actually has values in prod. Run in Supabase SQL Editor:

```sql
SELECT
  flag_key,
  is_enabled,
  array_length(enabled_user_ids, 1) AS cohort_size,
  enabled_user_ids
FROM public.feature_flags
WHERE array_length(enabled_user_ids, 1) > 0
ORDER BY flag_key;
```

- **If 0 rows returned:** finding is dormant. The leak vector exists but nothing is exposed today. Document + monitor; mitigation can wait.
- **If ≥ 1 row returned:** finding is active. Apply one of the mitigations in §2.7 before next prod deploy.

### 2.7 Mitigation options (DO NOT ship in this PR — separate triage)

In ascending order of code churn:

| # | Option | Pros | Cons |
| - | --- | --- | --- |
| **1** | **Public view + private base table** — create `feature_flags_public` view exposing only `flag_key, is_enabled`, grant SELECT to anon on the view, REVOKE on the base, point client at the view, keep server-side resolver on base. | Tiniest diff. Client keeps boolean semantics. enabled_user_ids stays admin-only. | Cohort resolution stops working for unauthenticated callers — but they shouldn't have cohort access anyway. |
| 2 | **Server-side resolver edge function** — `/functions/v1/feature-flag/:key` returns `{enabled: boolean}` per (flag, user_id). Revoke all anon access on the table. | Cleanest separation. Hides table entirely from browser. | Adds an edge-function dependency to the SPA boot path. Latency increase. |
| 3 | **Hash UUIDs** — store `hash(uuid \|\| salt)` instead of raw uuid; client hashes own user_id before contains-check. | Anon still sees opaque hashes. | Doesn't fix enumeration if salt leaks. Client code change. Still leaks cohort *size*. |
| 4 | **Tighten RLS** — restrict anon to `flag_key, is_enabled` columns via a column-level GRANT pattern (Postgres supports this on SELECT). | No view, no edge function. | Postgres column-level grants interact awkwardly with `SELECT *` from the SDK. Error-prone. |

**Recommended:** Option 1. ~30 lines of SQL + a one-line client change.

### 2.8 Why this slipped past the original audit

The `feature_flags` table was created with no PII. The original "Anyone can view" policy was correct at the time. Six months later a column was added that changed the threat model, but the policy wasn't revisited.

> **Generalizable lesson:** Any migration that adds a column to an anon-readable table should require an RLS re-audit checkbox. Adding to the CI gate from PR #897 as a follow-up.

---

## 3. `listening_clips` — ✅ SAFE

### 3.1 Source

- **Schema + policy:** `supabase/migrations/20260604000000_listening_library.sql`
- **Policy:** `Anyone can view listening clips` — `FOR SELECT USING (true)` (roles include anon)

### 3.2 Columns

```sql
CREATE TABLE public.listening_clips (
  id text PRIMARY KEY,
  category text NOT NULL,
  title_en text NOT NULL,
  title_vi text NOT NULL,
  description_vi text NOT NULL,
  duration_seconds integer NOT NULL,
  accent text NOT NULL,
  difficulty text NOT NULL,
  transcript jsonb NOT NULL,
  vocabulary_keys text[] NOT NULL DEFAULT '{}',
  comprehension_questions jsonb NOT NULL,
  audio_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### 3.3 Analysis

- **No `user_id` / `email` / per-user attribution columns.** Every column is content (titles, transcript, audio URL, vocab keys, comprehension Qs) or schema metadata.
- The bucket referenced by `audio_url` (`listening-clips`) is also public — confirmed in memory `project_listening_audio_backfill`.
- The migration's `COMMENT ON TABLE` reads: *"Public-read by RLS — no PII or scoring secrets stored here."*
- Per-attempt scoring lives in `speech_attempts`, a separate RLS-gated table — that's where user-scoped data goes.

### 3.4 Verdict

**SAFE.** Schema is content-catalog only.

### 3.5 Recommendation

No change. Add a one-line cross-link in the table comment: `"See reports/RECON-anon-readable-tables-A15b.md for the anon-read audit."` This is the schema-doc breadcrumb for the next auditor.

---

## 4. Methodology

1. **Static schema inspection** — read the `CREATE TABLE` migration for each flagged table; enumerate every column; check for `user_id`/`uuid`/`email`/`name`-shaped columns.
2. **Policy trace** — locate every `CREATE POLICY` / `ALTER POLICY` / `DROP POLICY` touching the table; confirm the final state.
3. **Client trace** — read the application code that queries the table; confirm which columns leave the DB via the anon SDK.
4. **History trace** — diff schema-creation against schema-mutation migrations to spot column additions that may have invalidated the original RLS contract (this is how the `feature_flags.enabled_user_ids` regression surfaced).
5. **Prod activation check** — provide a Chau-runnable `SELECT` that converts a theoretical finding into a measured one.

Steps 1–4 are entirely repo-local (no prod read needed). Step 5 is required for one of the three tables.

---

## 5. Out of scope

- No RLS rule added, modified, or dropped.
- No GRANT/REVOKE issued.
- No edge function changed.
- No client code changed.

Mitigations for §2.5 will be triaged separately once Chau confirms §2.6 activation status.

---

## 6. References

- PR #897 — Canonical RLS reference + COMMENT ON POLICY migration (parent audit work)
- Memory: `project_rls_audit_2026_05_18.md` — prior false-positive on `weekly_digest_data` (this audit confirms safe)
- Memory: `project_listening_audio_backfill.md` — listening-clips audio backfill resolved 2026-05-17
- Migration: `supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql:1-26` — column that introduced the leak
- Client: `src/lib/featureFlags.ts:128-132` — the `.select("is_enabled, enabled_user_ids")` that surfaces it
