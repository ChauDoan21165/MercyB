# Account Deletion Audit — Apple App Store readiness

**Date:** 2026-04-26
**Auditor:** A6 (audit-only — no code changes)
**Scope:** Does MercyBlade have an in-app account deletion path that satisfies Apple guideline 5.1.1(v) and GDPR Art. 17?

---

## TL;DR

**Verdict: EXISTS — fully wired end-to-end, with unusually strong coverage.**

A reviewer creating a test account and tapping "Delete my account" in Settings will succeed: data is deleted/anonymized across the entire schema, the Supabase auth user is removed, and the app signs out + redirects to home. A CI guard prevents new tables from silently bypassing the manifest.

The remaining work is **verification and copy polish**, not implementation. Recommended scope is **(a) MINIMUM VIABLE**, framed as a verification pass rather than a build.

---

## 1. Does in-app account deletion exist?

**Yes — and it is real, not a stub.**

### UI entry point
- `src/pages/AccountPage.tsx:715-726` — visible "Delete my account" / "Xóa tài khoản của tôi" button (red outline) inside the account settings page at route `/account` (`src/router/AppRouter.tsx:653`).
- `src/pages/AccountPage.tsx:828-902` — confirmation modal: bilingual warning ("This permanently deletes your account, memory, notebook, and all associated data. This cannot be undone." + Vietnamese translation), requires the user to type `DELETE` to enable the destructive button.
- `src/pages/AccountPage.tsx:276-300` — `handleDeleteAccount` handler: pulls JWT, invokes the `delete-account` edge function with `Authorization: Bearer <token>`, then `supabase.auth.signOut()` + `nav("/")`.

Route is gated by `<RequireAuth>` (`AppRouter.tsx:655`), so no anon users can hit it. `Account.tsx` is a 7-line legacy re-export shim — no separate path.

### Backend
- `supabase/functions/delete-account/index.ts` — Deno edge function with explicit Apple/GDPR docstring at lines 2-15. Four-pass flow:
  1. `delete-account/index.ts:85-97` — DELETE rows in every "personal data" table from the manifest, keyed on `user_id` (or column variant).
  2. `delete-account/index.ts:105-123` — ANONYMIZE rows in financial/audit tables (UPDATE `user_id = NULL` plus optional `scrub_columns` overlay for free-text PII like `feedback.message`, `security_events.ip_address`, jsonb metadata).
  3. `delete-account/index.ts:126-136` — DELETE `profiles` row directly.
  4. `delete-account/index.ts:139-148` — `admin.auth.admin.deleteUser(userId)` — cascade catches anything missed.

Errors per-table are recorded in `report.errors` but do **not** halt subsequent passes (defense-in-depth).

### Manifest + CI guard
- `supabase/functions/delete-account/user-data-manifest.ts` — 133 table classifications across four actions: `delete`, `anonymize`, `skip_view` (Postgres views — no-op), `skip_admin` (rows about the user as an admin actor, not personal data).
- `scripts/check-delete-account-coverage.mjs` — CI script that pulls the live Supabase OpenAPI spec, finds every table with a user-identifying column (`user_id`, `admin_user_id`, `actor_user_id`, etc.), and **fails the build** if any are unclassified. This is stronger than what most apps ship.

### Dead-code note
- `src/lib/security/rightToBeForgotten.ts` (157 lines) — older, narrower deletion implementation with `deleteUserAccount` + `requestAccountDeletion`. **Zero callers** (`grep -rn rightToBeForgotten src` returns only the file itself). Superseded by the edge function. Safe to delete in a cleanup pass; not blocking Apple.

---

## 2. What would full deletion require?

The current edge function already meets Apple's standard. For reference, "full" coverage spans roughly three buckets, all already addressed:

- **Personal learning / memory / behavior data → DELETE.** Examples from the manifest: `mb_user_personality_memory`, `mb_pronunciation_attempts`, `mb_user_learning_history`, `community_messages`, `favorite_rooms`, `app_feedback`, `notebook_entries`, `point_transactions`. ~73 tables marked `delete`.
- **Financial / audit / security records → ANONYMIZE.** Tax/legal retention obligations require keeping the row but stripping the user link. The manifest does this with `scrub_columns` overlays so jsonb metadata and free-text fields don't leak after `user_id` is nulled. Examples: `payment_events`, `security_events` (scrubs `ip_address` + `user_agent` + `metadata`), `system_logs`, `user_moderation_violations` (scrubs `message_content`).
- **Auth + profile parent rows.** `profiles` deleted in pass 3; `auth.users` deleted in pass 4 to cascade FK leftovers.

No table I checked is missing a classification. The CI guard prevents drift.

---

## 3. Privacy policy accuracy

- `src/pages/Terms.tsx:71-76` — explicit "Account Deletion" section that names the exact path: *"You can delete your account from inside the app at any time under Account → Delete my account."* **Accurate.**
- `src/pages/Privacy.tsx:77-82` — generic "Your Rights" boilerplate: *"you may have rights to access, correct, delete, or request a copy of certain personal information."* **Aspirational but not contradictory.** It does not name the in-app button, does not explain the immediate (no-grace-period) nature of deletion, and does not mention financial-record retention. App Store reviewers do not require this level of detail, but EU GDPR best practice does.

**Recommendation:** consider tightening Privacy section 6 to mirror the Terms section 7 wording before any future EU push. Not blocking for Apple submission.

---

## 4. Apple review evidence

A reviewer creating a test account will:

1. Sign up with an email or sign in with Apple.
2. Navigate to `/account` (visible bottom-nav or profile menu).
3. Scroll to the "Danger zone" / red-bordered controls — see "Delete my account" button at `AccountPage.tsx:715`.
4. Tap → confirmation modal appears (bilingual English/Vietnamese).
5. Type `DELETE` → tap "Permanently delete".
6. App calls edge function, signs out, returns to `/`.
7. Re-attempting login fails (auth user no longer exists).

**Evidence to capture for App Store Connect submission notes:**
- Screenshot 1: Account page showing the red "Delete my account" button.
- Screenshot 2: Confirmation modal with the `DELETE` text input.
- Screenshot 3: Post-deletion home/sign-in screen.
- One sentence in the review notes pointing them to "Account → Delete my account".

No prerecorded video required; the path is self-evident.

---

## 5. Recommended scope

### (a) MINIMUM VIABLE — *recommended*

Because the system is already at near-(b) quality, "minimum viable" here means **verification + documentation**, not new code:

1. Run the flow end-to-end on a real test account (preferably TestFlight build): verify Supabase auth user is gone, `profiles` row is gone, an FK-protected child table (e.g. `pronunciation_evaluations`) is empty for that ID, and an anonymized table (e.g. `payment_events`) has the row preserved with `user_id IS NULL`.
2. Capture the three screenshots above for App Store Connect.
3. (Optional but cheap) tighten Privacy.tsx section 6 to name the in-app path.

**Estimate:** ~1 hour, no engineering required beyond a TestFlight account.

### (b) FULL — defer until post-launch

Adds: confirmation email before final deletion, 30-day undo window (soft-delete tombstone + scheduled hard-delete), audit log entry, post-deletion confirmation email, support-ticket bypass for users who can't log in.

**Reasoning to defer:** Apple does not require any of (b). GDPR does not require an undo window. Adding (b) costs ~1-2 weeks and introduces a soft-delete state that the rest of the codebase would need to respect (auth checks, RLS, billing). Wait until churn data shows accidental-deletion is a real problem.

---

## 6. Concrete next step

If verification in (a) passes, no code changes are needed for Apple submission. If verification surfaces a gap, the relevant files are:

- `src/pages/AccountPage.tsx:276-300` — UI handler.
- `supabase/functions/delete-account/index.ts` — 4-pass deletion.
- `supabase/functions/delete-account/user-data-manifest.ts` — table classifications.
- `scripts/check-delete-account-coverage.mjs` — CI guard (run locally with `node scripts/check-delete-account-coverage.mjs` once `SUPABASE_SERVICE_ROLE_KEY` is in env).

Cascading FKs are not a worry: pass 4 calls `auth.admin.deleteUser()` which cascades `auth.users` → all FKs that reference it. The manifest is belt-and-suspenders on top of that cascade.

**Cleanup PR (optional, separate):** delete `src/lib/security/rightToBeForgotten.ts` — dead code with zero callers.

---

## Questions needing Chau decision

1. **Privacy.tsx section 6 tightening** — keep generic boilerplate, or name the in-app path explicitly? (Cheap, ~5 min copy edit.)
2. **Cleanup of `rightToBeForgotten.ts`** — delete now or leave for a future cleanup sweep?
3. **Confirmation email after deletion** — out of scope per recommendation (a), but: do you want a "your account is gone" email sent to the deleted user's address? If yes, that's a small addition to `delete-account/index.ts` before pass 4 (while we still have the email).

---

╔══════════════════════════════════════════════════════════╗
║  📋 Chau Report from A6 — Account deletion audit         ║
╚══════════════════════════════════════════════════════════╝
- File: reports/account-deletion-audit-2026-04-26.md
- Length: ~1,250 words
- Verdict: **exists** — fully wired end-to-end with CI-enforced manifest
- Recommended scope: **(a) minimum viable** — system already at near-(b) quality, just needs TestFlight verification + screenshots, no code changes
- Implementation estimate: **~1 hour** (verification only, not engineering)
- Questions needing Chau decision: **3** (privacy copy tightening; dead-code cleanup; optional post-deletion confirmation email)
