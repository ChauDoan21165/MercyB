# delete-account pipeline — post-2026-05-19 wave (A4g)

**Author:** A4
**Date:** 2026-05-19
**Snapshot:** #811 (`fix/b1-manifest-42-tables`) **MERGED** at 2026-05-19T22:28:29Z (dafa9b540 on main) — its 196-entry manifest is now live. #842 (`fix/email-audit-recipient-scrub`) and #837 (`feat/audit-tables-nullable-user-id`) are still **OPEN**; #837 is also **unapplied** in prod. Line refs for Pass 2b–4 below come from the #842 branch — on current main (Pass 2b absent) Pass 3 is at index.ts:163 and Pass 4 at index.ts:176; they slide back to 191/204 once #842 merges.
**Verified-against-main:** 2026-05-19 post-merge wave (#789 #792 #793 #796 #808 #811 #821 #832 all merged; manifest counts confirmed unchanged: 196 entries / 193 unique tables / 106 delete / 36 anonymize / 53 skip_view / 1 skip_admin).
**Purpose:** a single map for any future agent who has to touch `supabase/functions/delete-account/*`. After tonight's wave the function has 4½ passes, 193 manifest tables, two PRs in flight, and one schema-blocking constraint. This doc captures what each pass does, what data is available when, and what's still pending.

---

## TL;DR

The flow is **five sequential passes, fail-soft on individual errors, fail-hard on the final auth.users delete**. Pass 2b was added by #842 to close a privacy gap (GDPR Art. 17 violation: recipient emails surviving deletion). The manifest covers 193 user-id tables across 4 actions; 4 of those tables are "schema-blocked" — they should be `anonymize` per the A6d retention policy but are forced to `delete` until #837 applies.

```
Pass 0  →  identify the deleted user        (auth.getUser + aal=2 gate)
Pass 1  →  DELETE every personal-data row   (~106 manifest entries)
Pass 2  →  ANONYMIZE audit/financial rows   (~36 manifest entries)
Pass 2b →  recipient-side email_audit scrub (#842 — by email, not user_id)
Pass 3  →  DELETE profiles row              (parent of many FKs)
Pass 4  →  DELETE auth.users                (cascade catches stragglers)
```

---

## 1. Pass-by-pass map

All references are to `supabase/functions/delete-account/index.ts` **as it will exist when #842 merges**. Line numbers are from that branch. If #842 is not yet merged when you read this, drop the Pass 2b block from line 164 onward and slide everything down ~25 lines.

### Pass 0 — Identity, MFA gate, and admin-client setup (`index.ts:66–117`)

- Caller's JWT is validated by `auth.getUser()` against the anon client. `user.id` and `user.email` are extracted and held in handler scope. **Both stay live until the handler returns** — Pass 4's `auth.users` delete does not erase the in-memory copy.
- `readAalFromJwt` + `evaluateDeleteAccountAal` (pure logic in `aal-gate.ts`) enforce: if the user has any verified TOTP factor, they must be at `aal=2`. Users without an MFA factor pass through (they have no path to aal=2; see issue #233). On factor-lookup failure the function **fails closed** with HTTP 503 — the operation is irreversible.
- Service-role `admin` client is created. Subsequent passes use it to bypass RLS.
- `WipeReport` object is initialized: `{ deleted: [], anonymized: [], errors: [] }`. Every subsequent pass writes into this; the final response includes it for client-side logging.

### Pass 1 — DELETE personal-data rows (`index.ts:119–135`)

```ts
for (const { table, column } of getDeleteEntries()) {
  const { error } = await admin.from(table).delete().eq(column, userId);
  // error → report.errors[]; success → report.deleted[]
}
```

- Iterates every manifest entry whose `action === "delete"` (~106 entries — see §2).
- Per-row error handling: failures append to `report.errors[]` but the loop continues. Rationale: Pass 4's `auth.users` CASCADE will catch anything a `delete` pass missed (defense in depth), so a single-table failure must not block the rest of the wipe.
- No FK-ordering guarantee in the manifest. The leaf-to-root order works in practice because (a) Pass 4's CASCADE handles anything Pass 1 couldn't, and (b) deletes are by `user_id`, which is the same value across all referencing rows — no inter-row dependency.

### Pass 2 — ANONYMIZE audit / financial / security rows (`index.ts:137–161`)

```ts
for (const { table, column, scrub_columns } of getAnonymizeEntries()) {
  const payload = { [column]: null, ...scrub_columns };
  const { error } = await admin.from(table).update(payload).eq(column, userId);
  // error → report.errors[]; success → report.anonymized[]
}
```

- Iterates every manifest entry whose `action === "anonymize"` (~36 entries).
- For each: sets the user-id column to `NULL` plus overwrites the columns listed in `scrub_columns` (PII like `feedback.message`, `security_events.ip_address`, jsonb payloads that embed emails — see manifest reasons).
- **Critical: the filter is `eq(column, userId)`.** Only catches rows where the deleted user appears as that column's value. The recipient-email case (`email_audit`) is one of the few PII surfaces NOT expressible this way — hence Pass 2b.
- Same fail-soft pattern as Pass 1.

### Pass 2b — RECIPIENT-side `email_audit` scrub (`index.ts:164–190`, NEW — #842)

```ts
const scrubResult = await scrubEmailAuditByRecipient(admin, user.email);
if (scrubResult.kind === "error") report.errors.push({ … "anonymize_recipient" … });
else if (scrubResult.kind === "scrubbed") report.anonymized.push({ … });
```

- Dedicated pre-pass. Filters by `recipient_email = user.email`, not by user-id column — the manifest schema cannot express this (its `column` field must be a user-id-shaped name).
- Scrubs `recipient_email` + `subject` to `"[deleted]"`. Keeps `admin_user_id` / `feedback_id` / `error_message` / `metadata` intact (those identify the active admin who sent the email, not the recipient).
- Skips entirely (returns `{ kind: "skipped", reason: "no_recipient_email" }`) if `user.email` is null/undefined/empty. Defensive — the core deletion must still complete.
- Order rationale: **must run before Pass 4** because Pass 4's `admin.auth.admin.deleteUser(userId)` erases the `auth.users` row, after which the `user.email` lookup is gone. Placing it between Pass 2 and Pass 3 keeps it adjacent to the other anonymize work in the report and gives one more error-bucket slot in `report.errors` without restructuring the response shape.

### Pass 3 — DELETE profiles (`index.ts:191–202`)

```ts
const { error } = await admin.from("profiles").delete().eq("id", userId);
// error → report.errors[]
```

- Single targeted delete. `profiles` is the parent of many FK CASCADE chains downstream — taking it out first lets Pass 4's `auth.users` delete proceed without violating FK chains that would otherwise need explicit cleanup.
- Profiles is NOT iterated through the manifest (the manifest entry for `profiles` is `skip_view` with reason "handled by separate final DELETE + auth.users cascade" — see `user-data-manifest.ts:399`).

### Pass 4 — DELETE auth.users (`index.ts:204–214`, fail-hard)

```ts
const { error: authDeleteError } = await admin.auth.admin.deleteUser(userId);
if (authDeleteError) return 500 + report;
```

- The single fail-hard pass. If `auth.users` deletion fails, the entire endpoint returns HTTP 500 with the partial `WipeReport`. The caller is expected to retry; idempotent re-runs of Passes 1–3 are safe.
- CASCADE catches stragglers: any user-id table not in the manifest but with `ON DELETE CASCADE` from `auth.users` (defense in depth — the manifest is the source of truth, but the FK chain is the safety net).

---

## 2. Manifest summary (post-#811)

`user-data-manifest.ts` on current `main` (post-#811 merge, dafa9b540):

| Action | Entries | Notes |
|---|---|---|
| `delete` | **106** | Personal learning / progress / memory / behavior data — irrecoverable by intent. Iterated by Pass 1. |
| `anonymize` | **36** | Audit / financial / cost-tracking — row retained, user-id column nulled, PII columns scrubbed. Iterated by Pass 2. |
| `skip_view` | **53** | Postgres views + materialized views — pass through to base tables. |
| `skip_admin` | **1** | `admin_access_audit` — admin actions, not deleted-user data. |
| **Total** | **196 entries** (over **193 unique tables**) | The 3-table delta = tables with multiple user-id columns: `private_chat_requests` (sender + receiver), `private_messages` (sender + receiver), `user_role_audit` (actor + target). |

**Schema-blocked subset (4 tables, currently classified `delete`):**

| Table | A6d target | Why blocked | Unblocking PR |
|---|---|---|---|
| `email_sends_log` | `anonymize` (RFC 8058 deliverability audit) | `user_id NOT NULL` + FK `ON DELETE CASCADE` | [#837](https://github.com/ChauDoan21165/MercyB/pull/837) — `feat/audit-tables-nullable-user-id` |
| `push_send_log` | `anonymize` (delivery diagnostics) | same | #837 |
| `referral_audit_log` | `anonymize` (**ANTI-ABUSE / fraud-detection** — highest-priority of the four; deleting fraud evidence on user-erasure request is a policy risk) | `user_id NOT NULL` + FK `ON DELETE CASCADE` to `profiles` | #837 |
| `speech_analysis_logs` | `anonymize` (OpenAI cost analytics) | `user_id NOT NULL` + FK `ON DELETE CASCADE` | #837 |

After #837 applies (Chau-run, SQL Editor only, idempotent ALTER COLUMN + FK swap to `SET NULL`), a small follow-up manifest PR flips these 4 from `delete` → `anonymize`. The unit test in `__tests__/user-data-manifest.test.ts` asserts coverage by table name only, so the flip is regression-test-safe.

**Anonymize tables of note (post-#811):**

- `email_audit` — admin-sender side (this PR's manifest entry) + recipient side (#842's Pass 2b). Both directions covered.
- `lifetime_intent_signups` — marketing intent retained as aggregate; `email` + `reason_text` scrubbed.
- `mercy_tts_usage` — flipped to `anonymize` in #811 (FK already SET NULL). Cost analytics retained, no PII to scrub beyond `user_id`.
- `paywall_experiment_exposures` — flipped to `anonymize` in #811 with `scrub_columns: { anon_id: null }` and a **known-tradeoff** comment: the table has `CHECK (user_id IS NOT NULL OR anon_id IS NOT NULL)`, so the simultaneous null UPDATE rolls back atomically; Pass 4's FK cascade then nulls `user_id` alone, leaving `anon_id` non-scrubbed. End state preserves the experiment denominator but defers the anti-relink scrub until a future CHECK-loosening migration.

---

## 3. Data-flow diagram — identifier lifetimes

```
TIME →

Identifier         │ Pass 0 │ Pass 1 │ Pass 2 │ Pass 2b │ Pass 3 │ Pass 4 │ After
────────────────────┼────────┼────────┼────────┼─────────┼────────┼────────┼──────
user.id  (handler) │   ✓    │   ✓    │   ✓    │    ✓    │   ✓    │   ✓    │   ✓
user.email (handlr)│   ✓    │   ✓    │   ✓    │    ✓    │   ✓    │   ✓    │   ✓
profiles row       │   ✓    │   ✓    │   ✓    │    ✓    │   X    │   —    │   —
auth.users row     │   ✓    │   ✓    │   ✓    │    ✓    │   ✓    │   X    │   —
   ↑ auth lookup     │  set   │ used   │ used   │  used   │ used   │  ←—  THIS IS WHY PASS 2b
   path             │   by   │   by   │   by   │    by   │   by   │       MUST RUN BEFORE
                    │ getUser│  Pass 1│ Pass 2 │ Pass 2b │ Pass 3 │       PASS 4
```

Two load-bearing facts:

1. **`user.email` is captured in handler scope at Pass 0 (line 72)** and survives every subsequent pass — it's a JavaScript variable, not a DB lookup. So even though `auth.users` is gone after Pass 4, `user.email` is still readable inside the same request. That's what lets Pass 2b run between Pass 2 and Pass 3 instead of needing to run before Pass 1.
2. **`profiles.id` is the only thing Pass 3 needs.** No `profiles.*` columns are read after Pass 1. So Pass 1 / Pass 2 deletions and anonymizations on tables FK'd to `profiles` work the same regardless of when `profiles` itself is deleted, as long as it's BEFORE `auth.users`.

---

## 4. Open gaps and queued follow-ups

| Gap | Status | Tracking |
|---|---|---|
| **#811 manifest** — 42 user-id tables + 6 anonymize re-classifications + 4 schema-blocked group. | ✅ **MERGED** 2026-05-19T22:28:29Z (dafa9b540) | [PR #811](https://github.com/ChauDoan21165/MercyB/pull/811) |
| **#837 not applied in prod** — without it, 4 audit tables (`email_sends_log`, `push_send_log`, `referral_audit_log`, `speech_analysis_logs`) are forced to `delete`. A6d's anti-abuse retention argument for `referral_audit_log` is currently unhonored. | PR open; awaits Chau-run SQL Editor apply | [PR #837](https://github.com/ChauDoan21165/MercyB/pull/837) |
| **#842 not merged** — without it, GAP A (`email_audit.recipient_email` survives deletion when the deleted user was the recipient) is live. GDPR Art. 17 + Apple 5.1.1(v) defect. | OPEN — CI green, awaiting merge | [PR #842](https://github.com/ChauDoan21165/MercyB/pull/842) |
| **Follow-up manifest flip PR** — once #837 applies, the 4 schema-blocked tables can be re-classified to `anonymize`. The unit test asserts coverage by table name, so the flip is a 4-line manifest change + 4 reason updates. | Not yet authored | (no PR yet) |
| **`paywall_experiment_exposures` anti-relink scrub deferred** — the CHECK constraint means `anon_id` survives even though the manifest spec lists it for scrub. Closing this needs a CHECK-loosening migration. | Documented inline in #811's manifest reason | (no PR yet) |
| **GAP B (`email_audit` possible drift)** — `send-security-email/index.ts` writes columns (`user_id`, `kind`, `template_id`, `status`, `provider_message_id`, `error_msg`) NOT in the tracked DDL. Either SQL-Editor drift extended the table OR those inserts silently fail. **A single SQL Editor `information_schema.columns` query by Chau resolves this.** Until verified, the recipient-side scrub closes the GDPR risk via `recipient_email`, but if drift exists, additional user-side scrub may be needed. | Investigation deferred — see #819 §2 | [PR #819](https://github.com/ChauDoan21165/MercyB/pull/819) |
| **Anonymous data re-audit after #837 + flip** — once the 4 tables flip to anonymize, their `anonymize` rows survive deletion. Quick re-audit needed to confirm no residual PII columns slipped through (similar to my #819 method). | Queued after the flip lands | (queued) |
| **Plain-text PII columns broader sweep** — `recipient_email` is the surfaced example; others might exist (`user_email`, `target_email`, `to_address`, `notification_email` in other tables). Out of scope for B1; would be a privacy-completeness pass. | Out of scope; flagged in #819 | (no PR) |

---

## 5. GDPR Art. 17 coverage matrix

Personal data categories per the GDPR taxonomy + this pipeline's response:

| Category | Examples | Action | Justification |
|---|---|---|---|
| **Direct identifiers** | `auth.users.id`, `auth.users.email`, `profiles.id` | DELETE (Pass 3 + Pass 4) | Art. 17(1)(a) — no purpose to retain |
| **Personal learning / behavioral data** | `study_log`, `speech_attempts`, `pronunciation_evaluations`, `user_notebook_items`, `mercy_conversations`, `room_*` per-user state | DELETE (Pass 1, ~106 tables) | Art. 17(1)(a) — primary user-facing data; no retention basis |
| **Free-text user-generated content** | `user_stories`, `user_writing_submissions`, `room_reflections`, `community_messages`, private chat messages | DELETE (Pass 1) | Art. 17(1)(a) — also Apple 5.1.1(v) "all account information" |
| **Financial / billing audit** | `payment_transactions`, `payments`, `subscriptions`, `apple_iap_events`, `bank_*` | ANONYMIZE (Pass 2, with PII scrubs) | Art. 17(3)(e) — "establishment, exercise or defence of legal claims" + tax law retention requirements |
| **Security / abuse-prevention audit** | `audit_logs`, `security_events`, `system_logs`, `user_moderation_violations`, `user_role_audit` | ANONYMIZE (Pass 2, scrubs IP / user-agent / message text / metadata jsonb) | Art. 17(3)(d) — legitimate interest in platform safety + audit accountability |
| **Admin email audit (sender side)** | `email_audit` rows where deleted user was admin | ANONYMIZE (Pass 2, manifest entry — scrubs recipient_email + subject + error_message + metadata) | Art. 17(3)(d) — admin accountability |
| **Admin email audit (recipient side)** | `email_audit` rows where deleted user was recipient | ANONYMIZE (Pass 2b — #842 — scrubs recipient_email + subject) | Art. 17(1)(a) — recipient email is PII; admin row retained for accountability of the still-active admin |
| **Marketing intent (aggregated)** | `lifetime_intent_signups` | ANONYMIZE (Pass 2, scrub email + reason_text; retain country + reason_code + created_at) | Art. 17(3)(d) — statistical purpose; PII stripped |
| **Cost / experiment analytics** | `mercy_tts_usage`, `paywall_experiment_exposures` | ANONYMIZE (Pass 2, #811) | Art. 17(3)(d) — cost analysis + experiment integrity (denominator preservation) |
| **Anti-abuse / fraud-detection audit** | `referral_audit_log` | DELETE today (schema-blocked); ANONYMIZE target post-#837 | Currently **non-compliant with A6d's stated policy**; covered by #837 + follow-up flip PR |
| **Audit logs of admin actions on third parties** | `admin_access_audit` | SKIP_ADMIN (not touched) | Action by admin, not data of deleted user — not in scope of erasure right |
| **Postgres views** | All `v_*`, `mb_v_*` | SKIP_VIEW (pass through to base tables) | n/a — views reflect their bases |

**Coverage today (pending merges):**

- ✅ All direct identifiers — fully erased
- ✅ All personal learning / behavioral data — deleted
- ✅ All financial records — anonymized with PII scrubs
- ✅ Audit / security logs — anonymized
- ✅ Admin-sender side of `email_audit` — anonymized (via #811 manifest entry)
- ⚠️ Recipient side of `email_audit` — **gap closed by #842 (open)**, until then live defect
- ⚠️ `referral_audit_log` anti-abuse retention — **A6d policy unhonored** until #837 applies + follow-up flip PR
- ⚠️ `paywall_experiment_exposures` anti-relink — `anon_id` survives due to CHECK constraint; documented tradeoff

**Net Art. 17 / Apple 5.1.1(v) status after #811 + #842 merge:** **compliant** for direct PII + free text + financial + most audit. Two known retention-policy gaps (referral_audit_log, paywall_anon_id) documented and tracked.

---

## 6. Quick reference for future edits

If you're a future agent about to touch this pipeline:

1. **Adding a new user-id table to the schema?** The CI gate (`scripts/check-delete-account-coverage.mjs`, wired in #797) will fail your PR until you add it to the manifest. Classify per the taxonomy at `user-data-manifest.ts:7–19`.
2. **Anonymizing on a `NOT NULL` column?** Don't. It rolls back atomically and the cascade deletes the row anyway. See #811 + #837 for the migration pattern.
3. **PII column NOT in the user-id-shape hint list?** Manifest can't filter on it. Build a Pass 2b-style dedicated pre-pass, the same shape as `email-audit-recipient-scrub.ts`. Keep the helper Deno-free + side-effect-injected so vitest can exercise it.
4. **Need a pre-deletion lookup against `auth.users`?** Capture it at Pass 0 into handler scope. By Pass 4 it's gone.
5. **Adding tests?** Existing tests live in `supabase/functions/delete-account/__tests__/*.test.ts` using vitest. Pure-logic + injected-side-effect, no Deno runtime. Pattern: `aal-gate.test.ts`, `user-data-manifest.test.ts` (#811), `email-audit-recipient-scrub.test.ts` (#842).
6. **Migration that affects an existing manifest table?** Read CLAUDE.md "Git discipline" + memory `project_db_schema_drift_audit` first. Migrations are Chau-applied via SQL Editor only — NEVER `supabase db push`. Idempotent + stage-safe. Header documents apply discipline + pre/post-apply verify SELECTs.

---

## References

- [PR #797](https://github.com/ChauDoan21165/MercyB/pull/797) — wires `check-delete-account-coverage.mjs` into the CI gate (A7)
- [PR #811](https://github.com/ChauDoan21165/MercyB/pull/811) — +42 manifest entries + 6 anonymize flips + schema-blocked group (A4 + A6d)
- [PR #819](https://github.com/ChauDoan21165/MercyB/pull/819) — privacy audit of anonymize entries (A4c)
- [PR #837](https://github.com/ChauDoan21165/MercyB/pull/837) — nullable-user_id migration unblocking the 4 schema-blocked tables (A4e)
- [PR #842](https://github.com/ChauDoan21165/MercyB/pull/842) — `email_audit` recipient-side scrub Pass 2b (A4f, closes GAP A)
- `reports/PRIVACY-b1-manifest-classification-A6d.md` — A6d retention policy classifications
- `reports/PRIVACY-b1-anonymize-audit-A4c.md` — anonymize-path completeness audit
- `supabase/functions/delete-account/{index.ts,user-data-manifest.ts,aal-gate.ts,email-audit-recipient-scrub.ts}`
- `scripts/check-delete-account-coverage.mjs` — the prod-schema drift guard
