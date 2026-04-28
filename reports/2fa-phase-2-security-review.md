---
title: 2FA Phase 2 — security review findings
agent: A7
date: 2026-04-28
branch: feat/2fa-phase-2
predecessor: reports/2fa-design-decisions-2026-04-27.md
---

# 2FA Phase 2 — security review

`/security-review` was run on the branch before opening the PR per
Chau's standing instruction. Summary: **1 HIGH finding identified,
fixed before PR opened. 0 outstanding findings at confidence ≥ 7.**

## Finding F1 — `mfa_backup_codes` `code_hash` column was readable via owner SELECT

**Severity**: HIGH
**Confidence**: 8/10
**Status**: FIXED in commit `a4a4a4db` (same branch, before PR open)
**File**: `supabase/migrations/20260608000000_2fa_phase_2.sql`

### What the bug was

The first version of the migration created `mfa_backup_codes` with an
"owner-read SELECT" RLS policy:

```sql
CREATE POLICY "mfa_backup_codes_owner_read"
  ON public.mfa_backup_codes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
```

PostgreSQL RLS filters **rows** but does not filter **columns**.
Combined with default Supabase grants (which include `SELECT` on
public-schema tables for the `authenticated` role), this permitted
an authenticated client to query the `code_hash` column directly via
PostgREST.

### Exploit chain

1. Attacker captures a victim's signed-in JWT (XSS, browser-extension
   compromise, shared-device session theft, malicious-subdomain
   exfiltration).
2. Attacker calls PostgREST directly with the captured JWT:
   `GET /rest/v1/mfa_backup_codes?select=*` — the row-level policy
   matches because `auth.uid() = user_id`. Response includes all 8
   `code_hash` values plus `used_at` flags so the attacker can target
   only unused codes.
3. Attacker runs offline brute-force with `hashcat -m 3200`. The
   plaintext keyspace is 31 (Crockford base32) × 8 chars = 31⁸ ≈
   8.5 × 10¹¹ candidates. With bcrypt cost 10 and high-end GPU
   cracking (~10⁴–10⁵ H/s), the keyspace is reachable for a
   determined high-value-target attack. The compact 31-char alphabet
   plus the 4-4 dashed grouping makes this materially weaker than
   the cost-10-on-72-byte-input model that informed the design.
4. Once one hash cracks, attacker calls `POST
   /functions/v1/mfa-backup-codes` with `action: 'verify'` and the
   plaintext code. The verify path requires only a valid JWT (which
   the attacker has). The server unenrolls the user's TOTP factor
   and the aal=1 session passes the
   `require_aal2_when_factor_present` RLS gate from Phase 1. **MFA
   is fully bypassed without ever needing the user's phone.**

### Why this matters

The design — articulated in the function header at
`supabase/functions/mfa-backup-codes/index.ts:39-46` and in
`reports/2fa-design-decisions-2026-04-27.md` § Decision 2 — assumes
that bcrypt-hashing the codes prevents offline attack:

> Verification runs in an edge function, not in client code. … Why
> hashing client-side won't work: bcrypt is slow on purpose; you
> can't hash 8 candidates in the browser fast enough, and even if
> you could, RLS can't safely "compare hash equality" on the server.

The fix had to make the bcrypt protection real: the client must
NEVER see the hashes.

### Fix

The fix migration (in the same file, committed before this PR
opened) does three things:

1. **Removes the SELECT policy.** No permissive policies remain on
   `mfa_backup_codes`.
2. **Explicitly REVOKEs all base-table grants:**
   ```sql
   REVOKE ALL ON public.mfa_backup_codes
     FROM PUBLIC, anon, authenticated;
   ```
   This protects against the default Supabase grant that the
   original design overlooked.
3. **Drops the unused `mfa_backup_codes_status` view.** The view
   was a half-built attempt at column-level filtering but had zero
   callers in the codebase. Status reads for the UI go through the
   SECURITY DEFINER helper `public.mfa_backup_code_unused_count()`
   (which only returns a count, never the hash) and the
   `mfa-backup-codes` edge function's `status` action.

The migration also adds a prominent comment block warning future
maintainers not to re-add a SELECT policy on the table.

The same `REVOKE ALL` pattern was applied to `mfa_lockouts` for
defense-in-depth. That table never had a SELECT policy (correctly),
but the explicit REVOKE makes the protection obvious and protects
against accidental policy additions in later migrations.

### Verification

- `mfa_backup_codes` is now reachable only via the service-role key,
  which is held only by the edge functions (`mfa-backup-codes`,
  `mfa-challenge-rate-limit`).
- `mfa_backup_code_unused_count()` runs `SECURITY DEFINER` so it can
  read the row count for `auth.uid()` even when the calling user
  has no direct table grants.
- The 35-test Phase 2 suite (`mfaClientPhase2.test.ts`) mocks
  `globalThis.fetch`, so no test exercises the PostgREST path. The
  attack would only manifest at runtime against a real Supabase
  project — which is what the migration prevents.

---

## Other security concerns considered and dismissed

The sub-agent walked through the broader security surface; all the
following were checked and confirmed not vulnerable.

| # | Concern | Result |
|---|---------|--------|
| A | Recovery factor unenroll auth — could a stolen JWT alone disable MFA? | Verify still requires correct backup code; lockout caps guesses to 5/15-min. Not exploitable without F1's hash dump. |
| B | Recovery model (password + backup code) — could an attacker bypass password? | No path. JWT alone cannot reach mfa.verify; signInWithPassword is required upstream. |
| C | Bcrypt + RNG — codes generated with `crypto.getRandomValues`, hashed with bcrypt cost 10, compared via `bcrypt.compare`. | Correct CSPRNG. Constant-time compare within a single hash. The 8-iteration loop has minor timing variance but the lockout budget makes timing attack infeasible. |
| D | Lockout cooperative-trust — malicious client could skip `record_failure`. | Documented threat model. Backup-code path IS server-enforced; TOTP path is bounded by Supabase's own auth rate limit. Acceptable. |
| E | JWT replay / logging — does any new code log the JWT or backup code? | No. `console.error` in send-security-email logs the audit-insert error object only. `console.warn` in client pages logs the fetch error, not the token. |
| G | `mfa_lockouts` access — clients writing or reading other users' lockout state. | RLS enabled with no policies → default-deny. Service role bypasses for the edge functions. Now also explicitly REVOKEd as defense-in-depth. |
| I | Race during recovery — parallel TOTP verify on the unenrolled factor. | Supabase Auth rejects verify on a non-existent factor. No exploitable race. |
| J | Security email recipient — could an attacker direct emails to themselves? | Recipient derived server-side from `auth.users` via the JWT. Caller cannot specify. (Same pattern as Phase 1.) |
| K | Test mocks — could test runs leak codes/JWTs to a real network? | `fetch` is `vi.mock`'d at the top of the test file. `VITE_SUPABASE_URL` is stubbed. Two explicit assertions verify error messages contain neither the JWT nor the user-submitted code. |

---

## Verdict

**Cleared to open the PR.** The HIGH finding was caught and fixed
on this same branch before PR creation. The remaining design holds
up under review:

- Recovery requires password + backup code (Decision 1 from the
  design report)
- Backup codes are bcrypt-hashed and now genuinely server-only
- Lockout is server-enforced where it matters (backup-code path)
  and cooperatively reported with documented threat model where
  Supabase's API constraints prevent server-side enforcement (TOTP
  path, bounded by Supabase's own rate limit)
- Email notifications fire on every state change with recipient
  derived from JWT
- `mfa_lockouts` is service-role-only, no client probe path

**Phase 2 is shippable. Phase 1's `delete-account` aal-check gap
remains tracked for a follow-up PR (noted in the Phase 1 second-pass
review at `reports/...streak-shame-audit-2026-04-26.md` doesn't
contain it — it's in the security-review chat history rather than a
permanent file). Worth surfacing as a separate ticket.**
