# Synthetic run #4 — (a) trace verdict (pipeline 2668925468, job 15295384554)

## VERDICT (one paragraph)
**The anon-clobber hypothesis is KILLED.** The (a) trace shows **no `/auth/v1/token`
password-grant POST ever fired** (the only POSTs in the whole trace are telemetry
`/rest/v1/web_vitals_events`), and **no `/auth/v1/signup` anonymous sign-in fired
either** — so there was never a real session to be overwritten, and
`bootstrapAnonymousSession` never even created an anon session in this window. The
real cause is a **spec form-driving defect**: the `passwordTab` locator's regex
(`…|^sign in$|đăng nhập · sign in`) also matched the **"Đăng nhập · Sign in" SUBMIT
button** and clicked *that* instead of the "Sign in with password" toggle, so the form
**never entered password mode**, the login was never submitted, and the page stayed in
the default **email-code** mode (ARIA snapshot: "we'll send a code…") with **no error
notice** → the assertion read /signin and called it "BOUNCED". This is **not an app
auth race** — the app is fine (Chau's manual login works); the fix is spec-side
(proposed below, unmerged).

## 1. Trace timeline walk
Action timeline (times = ms from trace start), from `0-trace.trace`:
| t (ms) | action | detail |
|---|---|---|
| 1290 | goto | `/signin` |
| 3547 | isVisible | `passwordTab` → **resolved to `<button type="button">Đăng nhập · Sign in</button>`** (the submit, not the toggle) |
| 3571 | click | that same "Đăng nhập · Sign in" button (with the form still empty) |
| 3630 | fill | email = `trankhuctriet@yahoo…` (autocomplete=email) ✓ |
| 3641 | fill | password = `********` ✓ |
| 3651 | click | "Đăng nhập · Sign in" again |
| — | waitForURL(leave /signin, 20s) | timed out; URL never left /signin |

- **Did the login POST fire and return 200?** **NO — it never fired.** Network trace
  (229 resource-snapshots): the only POSTs are `/rest/v1/web_vitals_events` (201).
  Zero `/auth/v1/*` requests of any kind.
- **Session storage at redirect time?** **N/A** — no login POST → no session written;
  no `/auth/v1/signup` → no anon session created. Nothing to hold or overwrite.
- **Ordering — bootstrapAnonymousSession vs sign-in:** the anon bootstrap's
  `signInAnonymously()` (`/auth/v1/signup`) does **not appear** in the trace, so it did
  not create an anon session during this test. There is no getSession/signInAnonymously
  vs sign-in race to observe, because **neither** auth call happened.
- **Page end state** (`error-context.md` ARIA): heading "Đăng nhập hoặc tạo tài khoản",
  body "…we'll send a **code**…" → **email-code mode**, no error/alert region populated.

## 2. Verdict: anon-clobber CONFIRMED-KILLED
Every leg of the hypothesis fails against the trace: no verified login (nothing to
clobber), no anon sign-in (nothing doing the clobbering), and the page never left the
email-code form. `AuthProvider.tsx:453 → anonymousBootstrap.ts:76→86` is **not**
implicated by this run.

## 3/4. Real cause + proposed fix (SPEC only — app not touched)
Root: `journeys.spec.ts` journey (a) — the `passwordTab` (mode-switch) locator matched
the submit button and never entered password mode, so the password sign-in was never
driven. **Proposed spec fix (in this MR, UNMERGED):**
- Match the toggle **only**: `getByRole("button", { name: /sign in with password|đăng
  nhập bằng mật khẩu/i })` (drop the `^sign in$` / `đăng nhập · sign in` alternatives
  that hit the submit).
- **Deterministic** (your ask, grounded in the real flow): after the toggle, `waitFor`
  the password field to be **visible** before filling; then submit; then wait for the
  URL to leave /signin. No sleeps, no blind fills.
- **No app change proposed.** The app correctly requires password mode and redirects a
  real sign-in (manual works); nothing in this trace shows the app bouncing a confirmed
  session.

**Validation note:** I can't run the fixed (a) against prod from here (needs the
synthetic creds/env). The next synthetic run exercises it end-to-end. If (a) STILL
fails *after* this fix — i.e. the `/auth/v1/token` POST now fires (200) but the app does
not redirect — *that* would be the app-side signal to investigate; but per this trace
the login never fired, so the spec correction is the necessary first step.

## Held
- Merge of this MR — **HELD** for your review (it overturns the anon-clobber hypothesis;
  you should see the verdict before it lands).
- (f) ancestor-tolerance fix already merged (run #3, `8a7fc9e5f`) and confirmed green
  here — (e)(f) passed this run.
