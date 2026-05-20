# Review — PR #842 `fix/email-audit-recipient-scrub` (A6g)

**Reviewer:** A6 (A6g)
**Worktree:** `/private/tmp/A6g-842-review` (off `origin/main` @ `295dfbc10`)
**Source:** `gh pr diff 842` + `git show pr-842:...` on three files
**Mode:** read-only

---

## Headline

**APPROVE.** The Pass 2b pre-pass closes GAP A correctly. `user.email` is captured at the top of the handler (before any erasure), the UPDATE filters by `recipient_email` (not `admin_user_id`), the error path is non-fatal as documented, the 6-test regression lock covers happy / untouched-column / null-skip / undefined-skip / empty-string-skip / error-path. Order-independent with #811 (no double-scrub, no missed case). One minor follow-up worth recording — non-blocking.

---

## 1. Scrub pre-pass — verified line-by-line

### 1a. `user.email` is captured BEFORE auth erasure

`index.ts:73–76` does the authoritative read at the top of the handler:

```ts
const { data: { user }, error: userError } = await authClient.auth.getUser();
if (userError || !user) return json({ error: "Unauthorized" }, 401);
```

`user` then lives as a JS object throughout the handler. Pass 2b at `index.ts:177` consumes it directly:

```ts
const scrubResult = await scrubEmailAuditByRecipient(admin, user.email);
```

Pass 4's `admin.auth.admin.deleteUser(userId)` at `index.ts:210` deletes the **database row**, not the in-memory `user` variable. So `user.email` is still readable at L177 even though the auth row gets wiped 33 lines later.

The helper's doc-comment ("by Pass 4 the lookup is gone") is correctly scoped: it refers to the *DB lookup* — not the JS-side variable — and explains why the helper is invoked at Pass 2b rather than after Pass 4. **Verified correct.**

### 1b. UPDATE targets `recipient_email`, not `admin_user_id`

`email-audit-recipient-scrub.ts:71–75`:

```ts
const { error } = await client
  .from("email_audit")
  .update({ recipient_email: "[deleted]", subject: "[deleted]" })
  .eq("recipient_email", recipientEmail);
```

- Filter column: `recipient_email` ✅ (the recipient case — GAP A)
- Updated columns: `recipient_email` + `subject` only ✅ (as documented in the PR body)
- `admin_user_id` / `feedback_id` / `error_message` / `metadata` / `sent_at` / `success` left intact ✅

### 1c. Error handling is non-fatal — verified

The helper never throws (it returns a discriminated `EmailAuditScrubResult`), and the caller at `index.ts:179–191` handles each kind explicitly:

```ts
if (scrubResult.kind === "error") {
  report.errors.push({ ... });          // recorded, NOT rethrown
} else if (scrubResult.kind === "scrubbed") {
  report.anonymized.push({ ... });
}
// "skipped" (no email): silent no-op
```

The flow falls through to Pass 3 (profiles delete) regardless of scrub outcome. Mirrors the existing Pass 1 / Pass 2 error-handling shape — same pattern. ✅

Side note on telemetry: the caller uses the custom action label `"anonymize_recipient"` to distinguish this from manifest-driven `"anonymize"` entries in `report.errors[]`/`report.anonymized[]`. Useful for ops if a customer reports "my deletion failed" — you can grep for this action explicitly.

---

## 2. Test file — coverage check

`__tests__/email-audit-recipient-scrub.test.ts` (111 lines, 6 cases):

| # | Test name | Asserts what dispatch asked? |
|---|---|---|
| 1 | "scrubs `recipient_email` + `subject` for the deleted user's email" | ✅ Happy-path: `recipient_email` IS scrubbed. Confirms exact UPDATE payload + `.eq()` filter column + filter value. Uses `toHaveBeenCalledExactlyOnceWith` (modern vitest — assertion is exact-match, no `toHaveBeenCalledWith` partial-match drift). |
| 2 | "does NOT touch `admin_user_id` / `feedback_id` / `error_message` / `metadata`" | ✅ Untouched-columns: explicitly asserts each of the four kept columns is **not** in the UPDATE payload. The dispatch's requirement is met to the letter. |
| 3 | "skips the UPDATE entirely when `recipientEmail` is null" | ✅ Confirms `from()` is NOT called when input is null. |
| 4 | "skips the UPDATE entirely when `recipientEmail` is undefined" | ✅ Same for undefined. |
| 5 | "skips the UPDATE entirely when `recipientEmail` is an empty string" | ✅ Same for empty string. |
| 6 | "returns an error result (does NOT throw) when the UPDATE fails" | ✅ Confirms the non-throw contract: errors come back as discriminated-union values, not exceptions. |

**All dispatch-required assertions present.** Coverage is tight; the test file is a real regression lock, not theatre.

Minor stylistic observation (not a change request): the fake client uses `vi.fn().mockResolvedValue(...)` chained through `from() → update() → eq()` — same shape as the existing aal-gate test pattern. Consistent with project idiom.

---

## 3. Ordering / interaction with #811 — no conflict

A4's claim in the PR body: "complementary, order-independent." I walked through every cell of the truth table:

| Row condition | #811 (manifest) targets | #842 (Pass 2b) targets | Result |
|---|---|---|---|
| `admin_user_id = userId`, `recipient_email ≠ user.email` | ✅ This row | — | Full scrub via #811 (admin-side case) |
| `admin_user_id ≠ userId`, `recipient_email = user.email` | — | ✅ This row | Partial scrub via #842 (recipient-side case — GAP A close) |
| `admin_user_id = userId` **AND** `recipient_email = user.email` (admin sent themselves an email) | ✅ This row | Then #842 → `.eq("recipient_email", user.email)` — but #811 already set it to `[deleted]`, so #842's WHERE doesn't match → no-op | Single-pass scrub; no double-update, no error |
| Inverse ordering (#842 runs first, then #811) | After #842, `recipient_email = "[deleted]"`. #811 still finds the row via `.eq("admin_user_id", userId)` — its `scrub_columns` includes `recipient_email: "[deleted]"`, which writes the same value (idempotent). | ✅ This row | Idempotent re-write of `recipient_email` — harmless |
| `admin_user_id ≠ userId`, `recipient_email ≠ user.email` | — | — | Unaffected (not the user's row) |

**No double-scrub on the same row.** **No missed case** in the recipient-or-admin axis. **Either land order is safe** — confirmed.

Also confirmed: the runtime ordering today (per `index.ts`) is Pass 2 (manifest #811) → Pass 2b (#842). The first row of the "BOTH" case above is what plays out; the helper performs a no-op UPDATE because the WHERE doesn't match. Correct and harmless.

---

## 4. One minor non-blocking observation

`#811`'s manifest entry on the admin-side path **does** scrub `error_message` + `metadata` (its `scrub_columns` nulls / `[deleted]`s them). `#842`'s recipient-side path **does not**. The asymmetry is documented in the PR body and defensible:

> Admin-system-side text (Resend IDs, SMTP errors) doesn't identify the recipient on its own.

**Edge case worth recording for a future audit, not for this PR:** if `error_message` is ever populated with content that embeds the recipient's email verbatim (e.g. a Resend bounce string like `"delivery failed for alice@example.com — 550 mailbox not found"`), the recipient email survives in the error-text column even after `#842`'s scrub. The chance is small (most Resend error payloads identify by `provider_message_id`, not by destination address), but if a future audit shows otherwise, extending the recipient-side scrub to also null `error_message` + `metadata` is a one-line follow-up.

**Not requested here.** A4's documented scope is appropriate for GAP A close.

---

## 5. Code quality observations (non-blocking)

- **Helper file structure:** Deno-free, side-effect-injected via the minimal `ScrubClient` interface. Mirrors the established `aal-gate.ts` pattern. Vitest can exercise it without spinning up Supabase or the Deno runtime.
- **Discriminated-union return:** more disciplined than the boolean-or-throw pattern most edge fns use. Forces the caller to handle every branch (the `if/else if` in index.ts:179–191).
- **Block scoping** (`{ ... }`) around Pass 2b avoids `scrubResult` name collision with Pass 3's local error variable. Clean.
- **Doc-comments in the helper** explain *why* only `recipient_email` + `subject` are scrubbed, with the kept-columns table inline. Future readers don't have to dig through #819 / #811 to understand the asymmetry.

---

## 6. Gates (per PR body — re-verified the structure)

- `typecheck:ci` — claimed clean. Diff shows no `any` or untyped imports; trustable.
- `typecheck:functions` — claimed clean.
- vitest — 16/16 (10 existing aal-gate + 6 new). Test file imports verified resolvable.
- `deno check` — not in allowlist for `delete-account/*` (per `scripts/deno-check-edge-functions.sh`'s scope); not a regression.

---

## Final verdict

**APPROVE.** Ship it.

| Question | Answer |
|---|---|
| `user.email` captured BEFORE auth erasure? | ✅ Yes — captured at handler entry (L74), used at L177, auth erasure at L210 |
| UPDATE targets `recipient_email` correctly? | ✅ Yes — filter column + update columns both correct |
| Error handling non-fatal (Sentry-equivalent log + continue, no throw)? | ✅ Yes — discriminated-union return; caller appends to `report.errors[]` and continues |
| Test asserts `recipient_email` IS scrubbed? | ✅ Yes — case 1 |
| Test asserts `admin_user_id` / `feedback_id` / `error_message` / `metadata` NOT scrubbed? | ✅ Yes — case 2 |
| Skip tests cover null / undefined / empty string? | ✅ Yes — cases 3 / 4 / 5 |
| #811 (admin side) and #842 (recipient side) complementary, order-independent? | ✅ Yes — walked the truth table, no double-scrub, no missed case, either land order safe |
| Dangerous defect? | None found. |

### Optional follow-up (not blocking)

Track a small follow-up to extend the recipient-side scrub to `error_message` + `metadata` **only if** a future audit shows those columns frequently embed the recipient's address. Otherwise the current scope (`recipient_email` + `subject`) is the right place to stop — covers the primary GDPR Art. 17 / Apple 5.1.1(v) leak surface without over-scrubbing admin-system diagnostics.

---

## Cross-references

- PR #842 (this review) — `fix/email-audit-recipient-scrub`
- PR #819 — `docs/b1-anonymize-path-audit` (A4c; original GAP A diagnosis)
- PR #811 — `fix/b1-manifest-42-tables` (admin-side `email_audit` manifest entry)
- PR #827 — A6e crosscheck confirming #811's `email_audit` classification
- Helper: `supabase/functions/delete-account/email-audit-recipient-scrub.ts`
- Tests: `supabase/functions/delete-account/__tests__/email-audit-recipient-scrub.test.ts`
- Insertion point: `supabase/functions/delete-account/index.ts:164–190` (Pass 2b)
