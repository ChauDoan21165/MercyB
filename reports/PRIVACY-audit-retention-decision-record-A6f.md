# Privacy Decision Record — Audit-Table Retention Policy

**Status:** Adopted (this record) · awaiting schema migration (A4e) to make implementable
**Author:** A6 (A6f follow-up to A6d / A6e / A4 / A4c / A4e)
**Date:** 2026-05-19
**Class:** standing policy — applies to all current and future audit/fraud/analytics tables
**Supersedes:** the implicit "delete everything" default that B1 (#811) was forced into by the current NOT NULL schema

---

## 1. The decision

> For tables that fall into the **audit / fraud-evidence / cost-analytics** class, the canonical manifest action is **`anonymize`** (UPDATE SET user_id = NULL, row retained, identifiable text scrubbed via `scrub_columns`), **not** `delete`.

This applies to four currently-classified-as-`delete` tables that should switch to `anonymize` the moment the schema permits it:

| Table | Class | Why anonymize, not delete |
|---|---|---|
| `referral_audit_log` | fraud-evidence | The row IS the fraud signal. Patterns like "20 accounts created from the same referrer in 10 minutes, all deleted within an hour" are detectable only if anonymized rows survive. Deleting the row destroys the evidence the table was created to preserve. |
| `email_sends_log` | deliverability diagnostics | Aggregate send-success / bounce / spam-complaint rates per campaign drive list-hygiene decisions and List-Unsubscribe compliance (RFC 8058). Per-user linkage is not what these analytics need; per-row counts are. |
| `push_send_log` | delivery diagnostics | Same shape as `email_sends_log` — per-row delivery outcomes drive APNS/FCM health monitoring. User identity not needed in the aggregate. |
| `speech_analysis_logs` | cost analytics | Per-attempt OpenAI cost rows feed monthly cost-per-language / cost-per-feature analytics. Anonymized rows preserve the cost denominator; deleted rows shrink it artificially each time a user deletes their account, distorting cost-per-active-user metrics. |

The principle: **the row's purpose is the aggregate signal it contributes to**, not the user's identifiable trace. Anonymize keeps the signal, removes the trace.

---

## 2. Why this matters more than B1's defaulted "delete"

B1 (PR #811, merged shortly after this record) classified all four tables as `delete`. That was **not a product preference** — it was forced by the current schema:

```sql
-- present in supabase/migrations/ for all four tables:
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
-- (referral_audit_log uses public.profiles(id), same constraints)
```

`UPDATE SET user_id = NULL WHERE user_id = $1` violates `NOT NULL` and fails at runtime. The `ON DELETE CASCADE` foreign-key behaviour also means the row gets auto-deleted when `auth.users` is wiped, even before the manifest runs.

A6e's crosscheck (#827) confirmed there is no dangerous compliance violation in the B1-defaulted `delete` for any of the four — none triggers a legal retention requirement under GDPR, PDPL, or CCPA — but **the analytics + anti-abuse value being destroyed is real** and avoidable.

**A4e's migration unblocks this** by making `user_id` nullable and dropping (or relaxing) the CASCADE on these four tables. Once it lands, the manifest entries can flip from `delete` → `anonymize` in a small follow-up PR.

---

## 3. Current state vs target state

### Schema today (blocks anonymize)

```sql
-- email_sends_log     (20260424031000_email_sends_log.sql)
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE

-- push_send_log       (20260527000000_push_notifications.sql)
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE

-- referral_audit_log  (20260524000000_referral_leaderboard.sql)
user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE

-- speech_analysis_logs (20260506000000_speech_analysis_logs.sql)
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
```

All four: NOT NULL + CASCADE. Anonymize is structurally impossible.

### Target state (enables anonymize)

A4e's migration ([PR #837](https://github.com/ChauDoan21165/MercyB/pull/837), `feat/audit-tables-nullable-user-id`) is expected to:

1. **Drop NOT NULL on `user_id`** for the four tables.
2. **Change FK from `ON DELETE CASCADE` to `ON DELETE SET NULL`**, so the FK does not pre-empt the manifest's anonymize step.
3. **Leave RLS, indexes, and triggers untouched** — those don't depend on the column being non-null.

After A4e applies (manual SQL Editor per `project_agent_infra_access`), all four tables will accept `UPDATE SET user_id = NULL` cleanly.

### Manifest follow-up after A4e merges

A small ~12-line PR will flip these four entries in `supabase/functions/delete-account/user-data-manifest.ts`:

```ts
// BEFORE (#811 as-merged):
{ table: "email_sends_log",      action: "delete",    column: "user_id", reason: "re-engagement email delivery log; user_id is NOT NULL (FK CASCADE)" },
{ table: "push_send_log",        action: "delete",    column: "user_id", reason: "per-user push delivery log" },
{ table: "referral_audit_log",   action: "delete",    column: "user_id", reason: "referral audit; user_id NOT NULL (FK CASCADE from profiles)" },
{ table: "speech_analysis_logs", action: "delete",    column: "user_id", reason: "per-user speech analysis log" },

// AFTER (post-A4e):
{ table: "email_sends_log",      action: "anonymize", column: "user_id",
  scrub_columns: { email: null, error_message: null },
  reason: "retain deliverability/list-hygiene signal (RFC 8058 ops); strip user + recipient email + error text" },
{ table: "push_send_log",        action: "anonymize", column: "user_id",
  scrub_columns: { provider_message_id: null, error_message: null },
  reason: "retain APNS/FCM delivery diagnostics aggregate; strip user + provider IDs + error text" },
{ table: "referral_audit_log",   action: "anonymize", column: "user_id",
  reason: "retain fraud evidence (anti-abuse legitimate interest, GDPR Art. 17(3)(e)); strip user linkage" },
{ table: "speech_analysis_logs", action: "anonymize", column: "user_id",
  scrub_columns: { error_msg: null },
  reason: "retain per-attempt OpenAI cost aggregate (anonymous data, GDPR Rec. 26); strip user + error text" },
```

Test update needed in the same follow-up PR: the existing `user-data-manifest.test.ts` regression test in #811 has a fixture asserting the action for each of the 42 B1 tables — those four assertions flip from `"delete"` to `"anonymize"` and the `column` + `scrub_columns` shapes get verified.

The follow-up PR is gated on A4e merging — without the schema change, flipping the manifest produces runtime failures.

---

## 4. The `paywall_experiment_exposures` edge case

`paywall_experiment_exposures` was a candidate for anonymize during the A6e crosscheck — A4 chose `delete` despite the schema already allowing anonymize. The reason matters for the future-self reader:

### Why anonymize is *partially* possible but not chosen

```sql
-- 20260503020000_paywall_experiments.sql
CREATE TABLE IF NOT EXISTS public.paywall_experiment_exposures (
  ...
  user_id  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  anon_id  text,
  ...
  CONSTRAINT paywall_exposures_identity_chk
    CHECK (user_id IS NOT NULL OR (anon_id IS NOT NULL AND length(trim(anon_id)) > 0)),
  ...
);
```

`user_id` is nullable, so `UPDATE SET user_id = NULL` is permitted by the column constraint — but the **CHECK constraint** then requires `anon_id IS NOT NULL AND length > 0`. So:

- **Path A — scrub `anon_id` to NULL alongside `user_id`:** CHECK fails, UPDATE rolls back. **This is what the original A6d recommendation would have done, and it would fail.**
- **Path B — scrub `anon_id` to a sentinel like `'[deleted]'`:** CHECK passes (length > 0), the original anon_id cookie value is destroyed, re-link via cookie is broken. But the row remains anonymizable.
- **Path C — leave `anon_id` intact, scrub only `user_id`:** CHECK passes trivially. But `anon_id` is a pre-login device fingerprint — a deleted user opening the app again on the same device would re-link to their old experiment exposures. **Privacy hole.**
- **Path D — delete the row outright** (#811's choice). No CHECK to worry about; row gone.

### Accepted tradeoff

**Path D (`delete`) was the right call for this single table** because:

1. Paths B and C both leak partial identifiability (B leaks the experiment exposure itself; C leaks device-level re-linkability).
2. Path B is feasible but requires scrub_columns logic that no other manifest entry exercises (sentinel-string into an otherwise-typed column) — adds surface area for one row's edge case.
3. Account deletion is rare; the lost experiment denominator is small (a few percent at most).
4. Privacy-strict default wins on a tie.

This is the **one** table in the audit/analytics class where `delete` is correct on the merits, not forced by NOT NULL. Future agents who see "but it's nullable, why is it `delete`?" should read this section before flipping it to `anonymize`. The CHECK constraint is the answer.

If product ever wants the denominator preserved badly enough, the option is Path B with explicit sentinel-string scrubbing — but treat that as a deliberate decision, not a default.

---

## 5. Legal basis per table

This isn't legal advice, but the framework grounding each retention call:

### `referral_audit_log` — fraud evidence

- **GDPR Art. 17(3)(e):** the right to erasure does not apply where retention is necessary "for the establishment, exercise or defence of legal claims." Anti-abuse / fraud-prevention falls within this when the data demonstrably supports fraud-detection workflows. Storing fraud patterns indefinitely as identifiable data would be excessive; **anonymized** patterns satisfy the legitimate-interest test without retaining personal data.
- **GDPR Recital 26 / Art. 4(1):** anonymized data is outside the scope of GDPR. Once `user_id` is nullified and no other quasi-identifier remains, the row ceases to be personal data and can be retained indefinitely.
- **Vietnam PDPD (Decree 13/2023) Art. 14:** right of erasure is enumerated; fraud-prevention is not an explicit exception, but anonymized data is not "personal data" under PDPD's definition (Art. 2.1), same shape as GDPR. Anonymization satisfies the erasure obligation.

### `email_sends_log` + `push_send_log` — deliverability + delivery diagnostics

- **No regulatory retention requirement.** RFC 8058 (List-Unsubscribe-Post) governs the unsubscribe mechanism, not the send log; ESP best-practice retention (~12-24 months for spam-complaint rate calculation) is convention, not law.
- **Justified under GDPR Rec. 26 (anonymized data):** the per-row delivery outcome is what's needed; identity is incidental. Stripping `user_id` + `email` + `provider_message_id` leaves a row that's pure aggregate signal.
- **PDPD parity:** same — anonymized rows are not personal data.

### `speech_analysis_logs` — cost analytics

- **No regulatory retention requirement.** OpenAI's API ToS does not require us to retain per-call cost logs.
- **Justified under GDPR Rec. 26:** per-attempt cost rows feed cost-per-active-user / cost-per-language analytics. The user identity contributes nothing to those aggregates; the row's `audio_seconds`/`openai_cost_usd`/`status` columns are what matter.
- **PDPD parity.**

### Summary

| Table | Legal basis for `anonymize` retention |
|---|---|
| `referral_audit_log` | GDPR Art. 17(3)(e) (fraud-prevention) + Rec. 26 (anonymized data) · PDPD Art. 14 / 2.1 parity |
| `email_sends_log` | GDPR Rec. 26 (anonymized data) · PDPD parity |
| `push_send_log` | GDPR Rec. 26 (anonymized data) · PDPD parity |
| `speech_analysis_logs` | GDPR Rec. 26 (anonymized data) · PDPD parity |

For all four: **the row, once anonymized, is no longer personal data**, so the deleted user's erasure right is satisfied and the row may persist for as long as the analytics or fraud-detection signal remains useful.

---

## 6. Review cadence

> Re-audit this policy whenever a new audit/fraud/analytics-class table is added, and whenever a related migration changes a nullability or CASCADE behaviour.

### Triggers that require this record to be revisited

1. **New audit/log table merged.** If a migration adds a table whose name ends in `_log` / `_audit` / `_history` / `_analytics` and whose purpose is per-row aggregate signal rather than personal data, classify it under this policy from inception — schema should ship with `user_id` nullable and FK `ON DELETE SET NULL`, manifest entry should ship as `anonymize`.
2. **Schema change to one of the four tables in §3.** If a later migration reverts to `NOT NULL` or `CASCADE` on `user_id`, this record is the answer to "why don't we do that" — the migration author should read this before merging.
3. **CHECK constraint added to any anonymize-eligible table.** Paywall (§4) is the live example; future tables with identity-CHECK constraints need the same Path A/B/C/D analysis documented as an addendum here.
4. **Legal-basis change.** If GDPR is amended, or if Vietnam's PDPD enforcement guidance shifts in a way that affects anonymized-data exemptions, revisit. Same if MercyBlade opens markets where new laws apply (EU users → GDPR strictly applies; California → CCPA/CPRA explicit retention rules).

### How to use this record going forward

- **Agent dispatched to add a new audit log:** read §1 + §5 before drafting the migration. Ship NOT NULL only if there's a specific reason; otherwise default to nullable + `ON DELETE SET NULL`.
- **Agent dispatched to amend a manifest entry:** read §3's BEFORE/AFTER block before flipping any of the four tables to `anonymize` — confirm A4e's migration has landed first.
- **Agent doing a future B1-like sweep:** if a new audit table surfaces missing from the manifest, default to `anonymize` for the class. Only fall back to `delete` if (a) NOT NULL + CASCADE is structurally enforced, (b) a CHECK constraint forces it (like paywall), or (c) the table actually contains personal data that aggregates can't preserve.

---

## 7. Cross-references

- **B1 manifest sweep:** PR #811 (`fix/b1-manifest-42-tables`) — defaulted these four to `delete` due to current schema
- **A6d classification:** PR #818 (`docs/b1-manifest-table-classification`) — recommended `anonymize` for seven tables; four of those gated on this schema work
- **A6e crosscheck:** PR #827 (`docs/b1-manifest-crosscheck`) — surfaced the NOT-NULL constraint catch that prompted this decision record
- **A4e schema migration:** PR #837 (`feat/audit-tables-nullable-user-id`) — drops NOT NULL + relaxes CASCADE on the four tables
- **CI gate:** PR #797 (`fix/b2-wire-delete-coverage-ci`) — the script that originally surfaced the 42 missing tables
- **Manifest file:** `supabase/functions/delete-account/user-data-manifest.ts`
- **Coverage script:** `scripts/check-delete-account-coverage.mjs`
- **Regression test:** `supabase/functions/delete-account/__tests__/user-data-manifest.test.ts` (lands with #811)

---

## Appendix — quick decision tree for future agents

When you encounter a new table during a delete-account manifest audit:

```
Is the table a VIEW or MATERIALIZED VIEW?
├─ YES → skip_view, done.
└─ NO ↓

Does the user_id column identify the deleted user, or an admin who acted on them?
├─ Admin's action only → skip_admin, done.
└─ Deleted user ↓

Does the row carry personal learning/memory/security/membership data?
├─ YES → delete, done.
└─ NO (it's an audit / log / analytics row) ↓

Is user_id NOT NULL OR is the FK ON DELETE CASCADE?
├─ YES → delete, AND flag for the A4e-style schema follow-up.
└─ NO ↓

Is there a CHECK constraint coupling user_id to another identity column (like anon_id)?
├─ YES → analyze Path A/B/C/D (see §4); default delete unless a specific scrub path is documented.
└─ NO → anonymize, with scrub_columns nulling any free-text PII (email, error_message, provider_message_id, ...).
```

The decision tree codifies what this record argues: **audit/log/analytics rows want anonymize; the only reason they end up as delete is a constraint forcing it, and that constraint is itself a follow-up bug.**
