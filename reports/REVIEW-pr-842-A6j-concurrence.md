# Concurrence — #842 billing-angle sanity check (A6j)

**Reviewer:** A6 (A6j re-eye on #842 from a billing-failure-mode angle, complementary to A6g's structural review)
**Concurs with:** A6g's APPROVE at `reports/REVIEW-pr-842-A6g.md` (PR #848 on branch `review/842-email-audit-gap-a`).
**Verdict:** ✅ **APPROVE** — concur with A6g; no billing-logic gap.

---

## All three dispatch checks already covered by A6g

| # | Dispatch check | Where A6g covered it | Independent re-verify |
|---|---|---|---|
| 1 | Scrub fires BEFORE Pass 4 (auth erase)? | A6g §1a — `user.email` captured at `index.ts:74`, consumed at L177, auth erase at L210 (33 lines later; in-memory JS object survives the DB-row delete) | ✅ confirmed |
| 2 | Null / undefined / empty `userEmail` handled (partially-deleted user)? | A6g §2 cases 3 + 4 + 5 — helper returns `{kind: "skipped", reason: "no_recipient_email"}` without throwing; caller falls through silently | ✅ confirmed |
| 3 | Sentry capture includes enough context (userId, reason)? | A6g §1c — verified the **report.errors[]-only** pattern (no `captureEdgeError` call in the scrub path) | ✅ confirmed; see clarification below |

## One clarification on check #3 (not a gap, just framing)

The dispatch's #3 ("Sentry capture includes enough context") implies a Sentry path exists. **It does not** — and this is correct.

- The helper (`email-audit-recipient-scrub.ts`) does **not** import `../sentry.ts` and makes **zero** `captureEdgeError` calls. Independently grep-verified.
- The caller (`index.ts:175–197`) handles all three outcomes (`skipped` / `scrubbed` / `error`) via `report.errors.push(...)` / `report.anonymized.push(...)` — **not** via Sentry.
- This matches the surrounding `delete-account` pattern: Pass 1 (`index.ts:127`) and Pass 2 (`index.ts:153`) also use `report.errors.push` and never call `captureEdgeError`. **Pass 2b is pattern-consistent** with the project's existing "errors land in the report payload returned to the client, not in Sentry" choice.
- On a real error, the report entry carries `{table: "email_audit", column: "recipient_email", action: "anonymize_recipient", message: <error>}` — that's the equivalent of a "reason" tag in this surface. `userId` is implicit (it's the deletion target). Adequate context for the existing post-deletion-report ops flow.

If routing delete-account errors to Sentry is ever judged worth doing, that's a **separate cross-cutting refactor** touching all three passes (Pass 1 + Pass 2 + Pass 2b) plus the manifest-driven loop — not a #842 follow-up.

## Nothing else

A6g's analysis + 6-case test review + truth-table walk of the #811-vs-#842 interaction is complete. Billing-logic angle adds no new findings.

**Concur APPROVE #842.**

## Cross-references

- A6g's full review: `reports/REVIEW-pr-842-A6g.md` on branch `review/842-email-audit-gap-a` (PR #848)
- #842 — `fix/email-audit-recipient-scrub`
- #811 — `fix/b1-manifest-42-tables` (admin-side `email_audit` manifest entry; merged)
