# A6 — C5 fix: test-email lockdown

**Status:** Removed
**Branch:** `security/a6-test-email-lockdown`
**Owner:** A6
**Severity (per A3 audit):** P0

## Decision: REMOVE entirely (Option A)

The function had no callers anywhere in the codebase, was structurally broken (its import would have crashed at runtime), and used legacy `vip` tier terminology that's already obsolete per `CLAUDE.md` non-negotiable #5 ("No VIP tier"). Locking it down with an admin gate would have meant maintaining a function with zero legitimate users. Removing it is the simpler and safer fix.

## Evidence

### 1. The function was a no-arg skeleton with a placeholder recipient

```ts
// supabase/functions/test-email/index.ts (now deleted)
serve(async () => {
  const templateUrl = new URL(
    "../../../src/emails/access_vip_granted.txt",
    import.meta.url,
  );
  await sendEmail({
    to: "your_email_here@example.com",
    templateUrl,
    variables: { vip_tier: "Level 3", effective_date: "2026-01-05" },
  });
  return new Response(JSON.stringify({ ok: true }), { ... });
});
```

- No `Authorization` header check → any caller could trigger a send.
- Hardcoded recipient is `your_email_here@example.com` (clearly a placeholder, not a real address).
- `sendEmail({ to })` was the only signature accepted, with no caller-supplied recipient → an attacker couldn't redirect the email even if they hit the endpoint.
- "Currently safe" per the audit because the placeholder address is non-routable.
- One copy-paste edit ("change recipient to a variable") would have turned it into an open relay.

### 2. The function's import was already broken

```ts
import { sendEmail } from "../../../src/lib/sendEmail.ts";
```

But `src/lib/sendEmail.ts` did NOT export `sendEmail`. It only exported `renderTemplate` (and its file-header comment incorrectly read `// src/lib/emailRender.ts`, suggesting it was a copy-paste leftover).

A runtime call to this function would have failed at module load with `SyntaxError: The requested module '...' does not provide an export named 'sendEmail'`. So even before the fix, this function was non-functional — the security risk was structural (the empty admin gate), not behavioural.

### 3. Zero callers anywhere in the codebase

Searched `src/**` and `supabase/**` for `test-email`, `test_email`:

```
$ grep -rn 'test-email\|test_email' src/ supabase/ --include='*.ts' --include='*.tsx' --include='*.toml'
(no matches)
```

No frontend code, no other edge function, no `supabase/config.toml` entry referenced it. Removal cannot break any caller.

### 4. Legacy VIP terminology

The function's variables (`vip_tier`, "Level 3" as the value) and its template (`access_vip_granted.txt`) reflect the pre-cutover tier model. `CLAUDE.md` non-negotiable #5: *"No VIP tier. Users are at `profiles.tier = 0..N` ... Any code that references `'vip'` / `'all_vip'` as an audience/cohort is legacy — skip it."*

Reviving this function would have required rewriting it against the current tier model anyway. There's no migration value in keeping it.

### 5. Modern alternatives already exist

If transactional email testing is needed in the future, all of these have proper admin gates and active maintenance:

- `email-broadcast` — admin-level-9-gated batch sends.
- `send-redeem-email` — code-redemption template, admin-gated.
- `send-feedback-reply` — admin reply to user feedback.
- `send-pending-emails` — drains the deferred queue.
- `admin-daily-digest` — daily ops summary.

A Resend dashboard "Send test email" button covers the "did the template render right" use case without server code at all.

## Changes shipped

```
deleted:    supabase/functions/test-email/index.ts
deleted:    src/lib/sendEmail.ts
new file:   reports/a6-c5-test-email-fix.md   (this file)
```

`src/lib/sendEmail.ts` was the only file `test-email` imported. After removing test-email it had zero callers (verified by grep). Removing it as part of the same change keeps the diff a true clean-up.

### Things deliberately left in place

- `src/lib/emailRender.ts` — also appears unused, but cleanup is out of scope for a security P0. Track separately.
- `src/emails/access_vip_granted.txt` — left as-is; not in any caller path either, but VIP-template cleanup is a separate concern (legacy template purge).
- `supabase/functions/_shared/sendEmail.ts` and `_shared/emailRender.ts` — these are the *real*, in-use modules. Untouched.

## Verification

- `supabase functions list` (when run against the project) will no longer show `test-email`. (Cannot run from this worktree without Supabase CLI auth — verifiable post-merge.)
- `grep -rn 'test-email\|test_email' src/ supabase/` returns zero matches.
- `npm run typecheck` — clean.
- `npm test` — clean (the function and its orphan helper had no test coverage to break).

## Reversibility

If a future need arises, `git revert` of this commit restores both files. But the proper path is to use one of the modern admin-gated edge functions listed above, not revive the deleted skeleton.
