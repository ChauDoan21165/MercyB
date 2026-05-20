# Privacy audit — B1 anonymize-path completeness (A4c)

**Auditor:** A4 (continuation of #811 review chain — read-only audit)
**Branch:** `docs/b1-anonymize-path-audit` (off `origin/main` @ `cff975a54`)
**Date:** 2026-05-19
**Scope:** the two `anonymize` entries added by [PR #811](https://github.com/ChauDoan21165/996Mercy/pull/811) — `email_audit` and `lifetime_intent_signups`. The other 40 entries in #811 are classified `delete` / `skip_view` and out of scope here.

---

## Runtime model — how anonymize is actually applied

`supabase/functions/delete-account/index.ts:143-161` (Pass 2 of the delete flow):

```ts
for (const { table, column, scrub_columns } of getAnonymizeEntries()) {
  const payload: Record<string, string | null> = { [column]: null };
  if (scrub_columns) {
    for (const [k, v] of Object.entries(scrub_columns)) {
      payload[k] = v;
    }
  }
  const { error } = await admin.from(table).update(payload).eq(column, userId);
  …
}
```

Three load-bearing properties:
1. **The filter is exactly `eq(column, userId)`** — only rows matching the manifest's `column` field are touched. Rows where the deleted user appears as a *different* identifying value (e.g., as a literal email string in a non-FK column) are not seen.
2. **The scrub set is exactly `{[column]: null, ...scrub_columns}`** — there is no auto-discovery of "other PII columns." Anything not in `scrub_columns` survives.
3. **Errors are recorded but do not block subsequent passes**, and Pass 4 (`auth.users` delete) cascades via FK. A column that doesn't exist in the live schema produces a `report.errors[]` entry but the deletion still completes — silent half-anonymization is possible.

That third point is what makes the live-schema-vs-tracked-DDL question (below) non-academic.

---

## 1. `lifetime_intent_signups` — VERDICT: ✅ **NO GAP, scrub complete**

### Tracked DDL — `supabase/migrations/20260503010000_lifetime_intent.sql:24-32`

```sql
CREATE TABLE IF NOT EXISTS public.lifetime_intent_signups (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email        text,
  country      text,
  reason_code  text CHECK (reason_code IN ('gift','commitment','savings','other') OR reason_code IS NULL),
  reason_text  text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
```

### #811 manifest entry

```ts
{
  table: "lifetime_intent_signups", action: "anonymize", column: "user_id",
  scrub_columns: { email: null, reason_text: "[deleted]" },
  …
}
```

### Drift check
- ⚠️ Zero in-repo insert sites (`grep -rE "from\(['\"]lifetime_intent_signups['\"]\)" src/ supabase/functions/`). The migration comment ("Anonymous capture is handled by the SECURITY DEFINER RPC below if/when it ships") implies the writer path may not be live yet.
- No subsequent migration alters this table.
- **Drift evidence: none**.

### Column-by-column sign-off

| Column         | Type         | PII? | Action                         | Verified |
|---------------|--------------|------|--------------------------------|----------|
| `id`          | uuid PK      | no   | retain (random)                | ✅ |
| `user_id`     | uuid FK      | yes (link) | NULL via `column` field  | ✅ |
| `email`       | text         | YES  | NULL via `scrub_columns.email` | ✅ |
| `country`     | text         | coarse — not PII alone (GDPR Rec. 26) | retain | ✅ |
| `reason_code` | text enum    | no   | retain (low-cardinality aggregate) | ✅ |
| `reason_text` | text free-form | YES (may contain "I want to gift this to my husband Tuấn") | scrub to `"[deleted]"` via `scrub_columns.reason_text` | ✅ |
| `created_at`  | timestamptz  | timestamp — see note     | retain | ✅ |

**Residual minor consideration (NOT a gap):** after scrub the surviving row is `{id, country, reason_code, created_at}`. For a Vietnam-first product with ~100 users, the combination `country="VN" + reason_code="commitment" + created_at=2026-05-19T14:32:01Z` is theoretically re-identifiable. GDPR Rec. 26's "all the means reasonably likely to be used" test would call this borderline anonymisation; pure marketing-aggregate analytics would only need `country` + `reason_code` truncated to month, not seconds. **This is a minor consideration for a future hardening pass, not a B1 gap** — the email and free-text reason (the actual PII) are scrubbed. Flagging only because the audit asks for the GDPR cross-reference (§4 below).

---

## 2. `email_audit` — VERDICT: ⚠️ **TWO GAPS, both real**

### Tracked DDL — `supabase/migrations/20260505020000_email_audit.sql:15-25`

```sql
CREATE TABLE IF NOT EXISTS public.email_audit (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  feedback_id     uuid REFERENCES public.feedback(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  subject         text NOT NULL,
  sent_at         timestamptz NOT NULL DEFAULT now(),
  success         boolean NOT NULL,
  error_message   text,
  metadata        jsonb
);
```

### #811 manifest entry

```ts
{
  table: "email_audit", action: "anonymize", column: "admin_user_id",
  scrub_columns: { recipient_email: "[deleted]", subject: "[deleted]",
                   error_message: "[deleted]", metadata: null },
  …
}
```

### Writers in repo

Two edge functions insert here (`grep -rEn "email_audit" supabase/functions/`):

**A. `send-feedback-reply/index.ts:297-305`** — writes the DDL columns exactly:
```ts
await supabaseAdmin.from("email_audit").insert({
  admin_user_id, feedback_id, recipient_email, subject, success, error_message, metadata,
});
```

**B. `send-security-email/index.ts:321-329`** — writes columns NOT in the tracked DDL:
```ts
await supabase.from("email_audit").insert({
  user_id: params.userId,
  recipient_email: params.email,
  kind: "security",
  template_id: params.kind,            // e.g. "security_2fa_enabled"
  status: params.status,
  provider_message_id: params.messageId ?? null,
  error_msg: params.errorMsg ?? null,
});
```

Of these 7 columns, **only `recipient_email` exists in the tracked DDL**. Either:
- (i) the live schema has been extended via SQL-Editor drift (likely — per memory `project_db_schema_drift_audit`, ~179 PROD_AHEAD relations exist in this Supabase), so columns `user_id`, `kind`, `template_id`, `status`, `provider_message_id`, `error_msg` exist in prod but not in any tracked migration, or
- (ii) every send-security-email audit insert is silently failing at runtime (the function's try/catch swallows the error: `// Audit failures must never block the email send — log and move on.`).

The #797 coverage script surfaces `email_audit` for having a user-id-hint column — which would be true of (i) (drift added `user_id`) OR just the DDL-tracked `admin_user_id`. Without service-role catalog access (Keychain read is auto-mode-denied for production schema reads under this task), I cannot confirm (i) from in-worktree alone. **What is certain either way is that the existing manifest entry is incomplete.**

### GAP A — recipient-side PII leak (certain, DDL-derived)

The manifest filters with `.eq("admin_user_id", userId)` — so the UPDATE only fires when the deleted user was the **admin who sent** an email. When the deleted user was the **recipient** (the normal case for any feedback reply or security email), `admin_user_id ≠ userId` → the update does not match → `recipient_email = deleted-user@example.com` survives the account deletion, indefinitely, with their subject line, their feedback content (via `feedback_id` chain), and any send-result metadata.

This is a real GDPR Art. 17 / Apple 5.1.1(v) defect: the user's email address survives in an admin audit log after they request account deletion.

The reason the existing #797 coverage script did **not** catch this:
- `recipient_email` is `text`, not in the user-id-column hint list (`user_id`, `admin_id`, `admin_user_id`, `actor_user_id`, `target_user_id`, `sender_id`, `receiver_id`, `owner_id`). The script's surfacing pass cannot detect "user is identified by a plain-text email column."

### GAP B — drift-side coverage hole (conditional on drift hypothesis)

If hypothesis (i) holds and the live schema has a `user_id` column, then send-security-email rows have `admin_user_id IS NULL` and `user_id = userId`. The current manifest entry's `.eq("admin_user_id", userId)` skips all such rows. The deleted user's:
- `recipient_email` (their email)
- `template_id` (which 2FA / backup-code event they had: `security_2fa_enabled`, `backup_code_used`, `lockout_triggered`, …)
- `provider_message_id` (Resend-side tracking)
- `error_msg` (free-text error)

…all survive. **This is the same recipient-side leak as GAP A but with an additional 4 columns of metadata.**

If hypothesis (ii) holds (drift never happened, security-email audit inserts have been failing silently), then there are no security-email rows in `email_audit` to leak — only GAP A is live. But that itself is a separate observability defect, not a B1 issue.

### Fix scope — separate PR (PRINCIPLES §3, do not bundle into #811)

Two layers, separable into one or two PRs. Both are **describe, not implement** per the brief.

**Fix layer 1 — close GAP A (DDL-only, definitely needed):** Add a recipient-side scrub pass to `supabase/functions/delete-account/index.ts` that runs **before** the manifest passes (or just before the final auth.users delete), keyed on the deleted user's *email* rather than their user_id:

```ts
// New pre-pass — before Pass 2 anonymize loop.
// Captures user.email BEFORE auth.users is deleted (Pass 4); after that
// the lookup is gone.
const deletedEmail = user.email;
if (deletedEmail) {
  const { error } = await admin
    .from("email_audit")
    .update({
      recipient_email: "[deleted]",
      subject: "[deleted]",
      // do NOT touch admin_user_id here — this pass is for the
      // recipient-side leak; the existing anonymize entry on
      // admin_user_id handles the sender-side case.
    })
    .eq("recipient_email", deletedEmail);
  if (error) report.errors.push({
    table: "email_audit", column: "recipient_email",
    action: "anonymize_recipient", message: error.message,
  });
}
```

Notes:
- Runs under service role → bypasses RLS.
- Keep `error_message` / `metadata` untouched on this pass: a recipient-side scrub on rows still owned by an active admin must not destroy the admin's own audit content. Only the recipient-identifying fields (`recipient_email`, `subject`) are scrubbed — both can carry the deleted user's name/identity verbatim ("Re: your refund request, Tuấn"). `error_message` is admin-system-side text, kept.
- This is an additive code change to `index.ts`, NOT a manifest schema extension — the manifest's "match-by-user-id-column" abstraction stays clean.
- Idempotent: re-runs would find no remaining matching rows.

**Fix layer 2 — close GAP B IF drift is confirmed:** Two sub-options. **Do not pick blind — verify drift first.**
- (a) **If drift exists** (live schema has `user_id`, `kind`, `template_id`, `provider_message_id`, `error_msg`): add a second manifest entry for email_audit keyed on `user_id`:

  ```ts
  {
    table: "email_audit", action: "anonymize", column: "user_id",
    scrub_columns: {
      recipient_email: "[deleted]", subject: null, template_id: null,
      provider_message_id: null, error_msg: "[deleted]",
    },
    reason: "send-security-email rows; same recipient-side scrub as the admin_user_id entry but keyed on user_id (drift-added column).",
  },
  ```

  This mirrors the existing pattern of multi-entry-per-table (see `user_role_audit` actor + target entries). Plus: write a tombstone migration adopting the drifted columns into version control at the same time (per memory `project_repo_ahead_reconciliation`: untracked SQL-Editor drift gets reconciled the moment it's first touched in repo).

- (b) **If drift does NOT exist** (security-email inserts have been silently failing): fix `send-security-email/index.ts` to write only the DDL columns, OR add a proper migration that creates them. Either way the audit-log writer needs to align with the schema — a separate observability/data-integrity defect from the privacy audit. Track in its own issue.

### Recommended sequencing

1. **Verify drift status** (Chau-run in SQL Editor — no agent has prod catalog access for this):
   ```sql
   SELECT column_name, data_type, is_nullable
     FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'email_audit'
    ORDER BY ordinal_position;
   ```
   Compare against the 9 DDL columns. Any additional columns = drift confirmed.

2. **Ship GAP A fix** as its own PR — close the certain leak immediately. ~15 lines in `delete-account/index.ts` + a unit test that mocks `recipient_email = "alice@example.com"` and asserts the update fires.

3. **GAP B branch decision** based on step 1's result.

### Column-by-column sign-off — **post-fix** (illustrative — current state has GAP)

| Column           | Type            | PII? | After fix-layer-1 + (a) | Verified |
|-----------------|-----------------|------|--------------------------|----------|
| `id`            | uuid PK         | no   | retain                                                                  | n/a |
| `admin_user_id` | uuid FK         | yes  | NULL via existing entry (when deleted user IS admin)                    | ✅ |
| `feedback_id`   | uuid FK         | link only — feedback row's own scrub handles content | retain                          | ✅ |
| `recipient_email` | text NOT NULL | YES  | `"[deleted]"` via (i) existing entry when deleted user is admin **OR** (ii) new recipient-keyed pre-pass when deleted user is recipient **OR** (iii) (if drift) new `user_id` entry | ⚠️ currently leaks (GAP A) |
| `subject`       | text NOT NULL   | YES  | `"[deleted]"` via the same three paths | ⚠️ currently leaks (GAP A) |
| `sent_at`       | timestamptz     | timestamp | retain | n/a |
| `success`       | boolean         | no   | retain | n/a |
| `error_message` | text            | possibly (admin-system-side text) | `"[deleted]"` via existing entry on sender side; retained on recipient-pre-pass scrub | ✅ (with fix) |
| `metadata`      | jsonb           | YES  (carries `resend_id` + `source` per the writer) | NULL via existing entry on sender side; retained on recipient-pre-pass scrub | ✅ (with fix) |
| **drift cols (if present):** `user_id` | uuid | yes (link) | NULL via new GAP B (a) entry | gated on drift verification |
| `kind` / `template_id` / `status` / `provider_message_id` / `error_msg` | mixed | mixed | scrub via new entry | gated on drift verification |

---

## 3. GDPR Art. 17 / Apple 5.1.1(v) cross-reference

**`lifetime_intent_signups`** — anonymize-in-place defensible:
- GDPR Art. 17(3)(d) allows retention "for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes." Marketing intent aggregation is a legitimate-interest statistical purpose if PII is stripped.
- Apple 5.1.1(v) does not require row-level deletion in non-user-facing tables; anonymizing the user-facing fields suffices when documented in the privacy policy. The required action is "permanently delete the user account and associated personal information" — `user_id`, `email`, and `reason_text` (all PII) are scrubbed; what remains is non-personal aggregate.

**`email_audit`** — anonymize-in-place IS the correct architectural choice (admin accountability for an outbound email must survive any single user's deletion), BUT only if the scrub is complete. The current GAP A is a **non-compliant** state:
- GDPR Art. 17(1)(a): personal data shall be erased without undue delay "where the personal data are no longer necessary in relation to the purposes for which they were collected." After account deletion, the recipient's email address is no longer necessary for any purpose; the admin audit trail can be preserved with `recipient_email = "[deleted]"`.
- Apple 5.1.1(v): "all account information" — the recipient email IS account information.

**Bottom line: anonymize wins over delete for both tables, but `email_audit`'s scrub must be extended (fix layer 1, immediately).**

---

## Verdicts

| Table | Verdict | Severity | Next action |
|---|---|---|---|
| `lifetime_intent_signups` | ✅ **scrub complete** | — | none |
| `email_audit` | ⚠️ **2 gaps** (1 certain, 1 conditional on drift) | GAP A: medium (real PII leak after deletion); GAP B: tbd | (1) Chau verifies drift in SQL Editor; (2) separate PR adds the recipient-keyed pre-pass to `delete-account/index.ts`; (3) GAP B follow-up gated on (1)'s result |

---

## Cross-task — broader sweep worth doing (out of scope for this audit)

The class of bug "deleted user identified by a plain-text column not in the user-id hint list" likely affects more than `email_audit.recipient_email`. A one-off `grep -rE "(recipient_email|user_email|target_email|to_address|notification_email)" --include='*.sql' supabase/migrations/` would surface candidate tables for a future privacy-completeness pass. **Not part of B1**, but worth tracking as a follow-up so we don't audit one table at a time forever.
