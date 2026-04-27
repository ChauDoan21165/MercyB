---
title: 2FA design decisions — 6 questions to lock before code
agent: A7
date: 2026-04-27
status: AWAITING SIGN-OFF
followup: Phase 1 PR (TOTP + paid-tier gate), Phase 2 PR (backup codes + recovery + lockout)
---

# 2FA design decisions

Six questions that need an answer before I write any 2FA code. Sign off below each one (initial / "yes A7" / "no, do X instead") and I'll implement to spec.

The recovery-flow question (#1) is the most important — the original brief specifies a flow that **bypasses 2FA entirely**, and getting that wrong means users believe they're protected when they're not. That decision alone is worth your 5 minutes before any code exists.

---

## Decision 1 — Recovery flow shape (the load-bearing one)

**Question:** When a paid user has 2FA enabled and loses their phone, what do they need to provide to recover access?

**Original brief specified:**
- Step 1: enter email
- Step 2: enter one backup code
- Step 3: signed in

**The problem with the brief:** That makes 2FA effectively *single*-factor — the backup code becomes "something you have" with no "something you know" check. If a backup code is exposed (saved in email, screenshot, password manager export, accidental Slack paste, dumped database), the attacker takes over without ever knowing the password. The whole point of MFA is two factors.

### Recommendation

**Require: email + password + one unused backup code.** Three factors during recovery, not two.

### Why

- **Standard practice across credible 2FA implementations.** GitHub, Google, GitLab, Stripe, AWS — all require the *primary* factor (password) plus a backup factor. Backup codes never replace the password; they replace the TOTP step.
- **1Password** is the strictest: their Emergency Kit requires *Secret Key + Master Password* together, and even with both you go through a verification flow. They explicitly do NOT let you bypass the master password.
- **Authy** requires the Authy account password before any device transfer or backup recovery.
- **Google** account recovery with backup codes requires the password first; backup codes only step in for the second factor.
- **GitHub docs (verbatim)**: "If you lose access to your two-factor authentication credentials, you can use your recovery codes... You'll still need to enter your password to sign in."

### Trade-off if you disagree

If you keep the brief's "email + backup code only" flow:
- ✅ Faster recovery for users who forgot their password too
- ❌ Backup codes become a single-factor bypass — anyone who steals them takes over
- ❌ Most likely place backup codes leak: the user's own email (where they probably forwarded the download)
- ❌ A breached email account = full takeover of the MercyBlade account, regardless of password strength

If you want a softer middle ground: **email + password + backup code**, but if the user has forgotten the password, they go through normal password reset first (which itself sends to email), then enter backup code. That's the GitHub model.

**Sign-off:**
- [ ] **A. Email + password + backup code** (my recommendation, GitHub/Google/AWS standard)
- [ ] **B. Email + backup code only** (brief as written, lower security)
- [ ] **C. Email + backup code, but require email-verification link click** (no password, but at least the backup code can't be used without ALSO controlling the email inbox right now)
- [ ] D. Other: __________

---

## Decision 2 — Backup code storage and verification

**Question:** Where do backup codes live, how are they hashed, and where does verification run?

**The catch:** Supabase Auth's built-in MFA does TOTP only. Backup codes are NOT a Supabase feature — we have to build the storage layer ourselves.

### Recommendation

**New table `mfa_backup_codes`** with this shape:

```sql
CREATE TABLE mfa_backup_codes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash     text NOT NULL,         -- bcrypt of the plaintext code
  used_at       timestamptz,           -- null = unused; set on first use
  created_at    timestamptz NOT NULL DEFAULT now(),
  generation_id uuid NOT NULL          -- ties 8 codes to one "regenerate" event
);
CREATE INDEX ON mfa_backup_codes (user_id) WHERE used_at IS NULL;
```

**Verification runs in an edge function**, not in client code:
- Client sends `(user_id, candidate_code)` → edge function `verify-backup-code`
- Edge function pulls all unused codes for the user, runs `bcrypt.compare` until match or exhaustion
- On match: marks `used_at = now()`, returns success
- On miss: increments failed-attempt counter (Decision 3)

**Why hashing client-side won't work**: bcrypt is slow on purpose; you can't hash 8 candidates in the browser fast enough, and even if you could, RLS can't safely "compare hash equality" on the server (timing attacks against the hash itself).

**Code generation:** server-side via the enrollment edge function, using `crypto.randomBytes(8).toString('base64url')` (Node) or `crypto.getRandomValues(Uint8Array(8))` (Deno). 8 codes × 10 base64url characters = unguessable.

### Why

- **Edge function for verification** is the same pattern Supabase recommends for any "user provides secret, server compares against stored hash" flow. RLS is for filtering rows, not comparing hashes.
- **bcrypt over argon2**: bcrypt is in `npm:@types/bcrypt` and battle-tested in Deno; argon2 setup in Deno is more fragile.
- **Per-generation `generation_id`**: when the user regenerates codes, we mark the whole prior generation invalid in one query. Without it, we'd have to delete-then-insert-8 (race-prone if the user is logged in twice).

### Trade-off if you disagree

If you want to store codes in plaintext (DON'T): a database leak = every backup code in the wild. Bcrypt forces ~50ms per attempt even for the attacker.

If you want to use Supabase Auth's `auth.identities` table somehow: it's not designed for this; your migration would fight the Supabase Auth schema and get clobbered on the next Supabase upgrade.

**Sign-off:**
- [ ] **Approve schema + edge-function approach** (my recommendation)
- [ ] Suggest different schema: __________
- [ ] Suggest different verification path: __________

---

## Decision 3 — Lockout storage (server-side, not localStorage)

**Question:** When the user hits 5 failed TOTP attempts, where does the "this user is locked out" state live?

### Recommendation

**Reuse the existing `rate_limits` table** that powers `_shared/rateLimit.ts`. Lockout key: `mfa_attempt:${user_id}`. Same 5/30-minute pattern as the existing speech-analyze rate limit.

This avoids a new schema migration and reuses the audit infrastructure (`rate_limits` is already monitored).

### Why

- **localStorage is bypassed by `localStorage.clear()` or incognito**. Trivially. Don't use it for security boundaries.
- **The existing `rate_limits` table already handles the 5/window/key pattern** — we just call `rateLimit('mfa_attempt:${userId}', 5, 30 * 60 * 1000)` from the verify edge function.
- **Sentry alerting already covers this table** (per the Sentry edge-function helper from PR #162) — so 5+ failures generate Sentry breadcrumbs automatically.

### Trade-off if you disagree

If you want a dedicated `mfa_lockouts` table: you get cleaner separation but pay a migration + a duplicate audit infrastructure. Probably not worth it.

If you want to lock by IP instead of user_id: catches credential-stuffing attacks better, but a paid user behind shared NAT (corporate office, school) can lock out their colleagues. User-id-keyed is the standard.

**Sign-off:**
- [ ] **Reuse `rate_limits` table with `mfa_attempt:${user_id}` key** (my recommendation)
- [ ] New dedicated `mfa_lockouts` table
- [ ] Lock by IP not user_id
- [ ] Other: __________

---

## Decision 4 — Email path for 3 new transactional emails

**Question:** Which edge function sends the 2FA enable / disable / lockout emails?

**Existing edge functions for email:**
- `send-email-campaign` — broadcast-shaped, audience-segmented, wrong shape for transactional
- `email-broadcast` — same, broadcast-shaped
- `email-automations` — supports trigger-based but is currently wired to lifecycle events (welcome, trial-end), not security
- `send-feedback-reply` — 1:1 transactional, closest shape but named for support replies
- `send-redeem-email` — 1:1 transactional, single-purpose
- Resend SDK is already initialized in those functions

### Recommendation

**Add a new edge function `send-security-email`** with three template kinds:
- `security_2fa_enabled`
- `security_2fa_disabled`
- `security_2fa_lockout`

Each kind = one Vietnamese-primary template + EN fallback. Plain-text, no marketing styling, no unsubscribe link (transactional/security emails are exempt from CAN-SPAM unsubscribe in both US and EU rules).

**Why a new function** instead of extending `email-automations`: security emails MUST send even if the user is unsubscribed from marketing. Adding them to `email-automations` would risk a future code change accidentally honoring an unsubscribe flag for a security alert. Separate function = no shared opt-out path.

### Why

- **Security separation**: a user who unsubscribed from marketing still needs to know their 2FA was disabled. A separate function with no opt-out check is the cleanest contract.
- **Template clarity**: 3 templates with one job, easy to audit.
- **Testability**: 1:1 transactional emails are easy to unit-test (just verify the Resend SDK was called with the right args).

### Trade-off if you disagree

If you want to extend `email-automations` instead: ~50% less code but a real risk of a future PR adding an `is_unsubscribed` check that silently breaks security alerts.

If you want to skip the lockout email: faster ship, but a user who didn't trigger the 5 failed attempts (i.e., someone else trying to break in) doesn't know their account is being attacked. That's the scenario the email matters most for.

**Sign-off:**
- [ ] **New `send-security-email` edge function with 3 templates** (my recommendation)
- [ ] Extend `email-automations` instead
- [ ] Use `send-feedback-reply` shape (rename it generic)
- [ ] Skip the lockout email (only enable + disable)

---

## Decision 5 — Phase split (what ships in Phase 1 vs Phase 2)

**Question:** What's in the first PR vs the second?

### Recommendation

**Phase 1 — TOTP + paid-tier gate (~1 day, ~600 lines):**
- Supabase MFA enrollment flow at `/auth/security`
- Login.tsx extended with TOTP challenge step
- `/account/security` page with enable / disable toggle (re-auth required)
- `MfaUpgradePrompt` for free-tier users
- Telemetry for enrollment + successful 2FA login
- 2 emails: `security_2fa_enabled`, `security_2fa_disabled`
- Routes added to `AppRouter.tsx`
- ~10 tests covering enrollment + login happy path + free-tier gate

**Phase 2 — backup codes + recovery + lockout (~2 days, ~900 lines):**
- `mfa_backup_codes` table migration
- `enroll-backup-codes` + `verify-backup-code` edge functions
- Backup-code download UI on the enrollment confirmation page
- `/auth/recover-2fa` page (depends on Decision 1's recovery flow shape)
- 5-attempt lockout via `rate_limits` table
- 1 email: `security_2fa_lockout`
- "Regenerate backup codes" action on `/account/security`
- ~12 tests covering backup codes, recovery, and lockout

**Why this split:**
- **Phase 1 is shippable on its own.** It's better than no 2FA. Users without backup codes lose access if they lose their phone — but support can disable MFA via the Supabase admin dashboard. Acceptable for ~100 users.
- **Phase 2 has the security-sensitive crypto.** Code generation, hashing, recovery flow — all the "get this wrong and it's worse than nothing" surface. Worth a slower, more-reviewed pass.
- **Phase 1 unblocks the marketing claim.** "Paid users get 2FA" can ship after Phase 1; backup codes can be a follow-up announcement.

### Trade-off if you disagree

If you want everything in one PR: ~2000 lines, you can't safely review it in a single sitting, security mistakes in Phase 2 hide in the diff.

If you want Phase 1 only and skip Phase 2 entirely: every paid user who loses their phone needs support intervention. With ~100 users that's ~1 support ticket every few months — manageable. Could defer Phase 2 by months.

**Sign-off:**
- [ ] **Two PRs as recommended** (my recommendation)
- [ ] One PR with everything
- [ ] Phase 1 only, defer Phase 2 indefinitely
- [ ] Different split: __________

---

## Decision 6 — Security review process

**Question:** How do we make sure the 2FA code isn't worse than no 2FA?

### Recommendation

**Run `/security-review` on each PR before merge** (the slash command exists in this repo per the available-skills list). Specifically check:

1. **TOTP secret never logged.** No `console.log(factor.secret)` in any path.
2. **Backup codes never logged.** Generation + display only — never persisted in plaintext, never sent in non-security emails.
3. **Lockout enforcement is server-side.** Verify the verify-backup-code function calls `rateLimit()` BEFORE comparing hashes (so even pre-validation 401s count).
4. **Recovery flow requires the locked-in factors.** Per Decision 1, password+backup_code (not just backup code).
5. **Re-auth required to disable 2FA.** Check `disable2FA` requires fresh password + current TOTP, not just session.
6. **Email-on-disable always sends.** Even if user is unsubscribed from marketing.

### Why

- The 2FA code's bug surface is "user thinks they're protected, they're not" — which is much more expensive than a normal feature bug.
- The streak shame audit and Sentry PRs were caught by typecheck + tests, but security bugs often pass typecheck and have no obvious test signal. A review pass tuned for the 6 specific failure modes above is the right shape.

### Trade-off if you disagree

If you skip the security review: ~30 minutes saved per PR, but the cost of a missed bug here is account theft for paid users. Asymmetric.

**Sign-off:**
- [ ] **Run `/security-review` before merging each PR** (my recommendation)
- [ ] Skip the review (faster ship)
- [ ] Run review on Phase 2 only (Phase 1 is mostly Supabase-native and lower-risk)

---

## Once you sign off

Reply with one of:

- **"All recommendations approved"** — I implement Phase 1 immediately, then Phase 2 after Phase 1 lands and you've smoke-tested it.
- **Per-decision answers** — e.g., "1: A, 2: approved, 3: approved, 4: approved, 5: approved, 6: Phase 2 only" — I implement to spec.
- **Push back on something** — e.g., "1 should be C" — I rewrite that section, you re-approve, then implement.

Until you sign off, no code lands. The decision report itself is the only output of this session.

---

## Appendix — recovery flow shape comparison (real-world apps)

Sources: each app's official documentation as of 2025/2026 (cited verbatim where I quote).

| App | What's required to recover with backup codes? | Notes |
|-----|----------------------------------------------|-------|
| **GitHub** | Password + recovery code | Docs: "You'll still need to enter your password to sign in." Backup codes replace the TOTP step, never the password. |
| **Google** | Password + backup code (or other 2nd factor) | Account recovery uses recovery email + security questions; backup codes only step in for the second factor after password is verified. |
| **AWS** | Password + 1-time MFA code OR contact support | Their docs explicitly warn: "If you lose access to all factors, contact AWS Support" — they don't offer self-service backup-code-only recovery. |
| **GitLab** | Password + recovery code | Same model as GitHub. |
| **1Password** | Secret Key + Master Password (Emergency Kit) | The strictest of the lot. Even with both Secret Key and Master Password, you go through verification on a new device. They explicitly do NOT have a "bypass master password" option. |
| **Authy** | Authy account password | The Authy *account* password (separate from the website you're logging into) is required for any device transfer or backup recovery. |
| **Stripe** | Password + recovery code | Backup codes replace the TOTP step. |
| **Microsoft / Microsoft 365** | Password + recovery code OR alternate verified email | Multiple recovery paths but ALL require at least one factor beyond the backup code. |

**The pattern is unanimous: backup codes are a *second*-factor replacement, not a *first*-factor replacement.** The brief's "email + backup code only" flow is below the bar that any of these competitors set.

This is the single most consequential decision in the report. Recommend taking 5 minutes on it specifically.
