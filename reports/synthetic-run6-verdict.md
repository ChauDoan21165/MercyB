# Synthetic run #6 verdict (pipeline commit af73cb090, job 15295709218)

2/6 — **(e)(f) GREEN** (the host-independent (f) fix holds). (a) failed with the
corrected password-flow spec executing for the first time. Verdict below.

## VERDICT (one paragraph)
**Q1 = NO — `/auth/v1/token` still never fired, but the live form is fine; the SPEC's
toggle click was SKIPPED by a host-timing race.** Run #6 ran on a **third host,
"MercyB Mac shell runner" (`/Users/admin`, a frozen `mac12` chromium)** — slower to
render than the arm64 Air (run #4) or the macbook (run #5). The (a) spec gated the
"Sign in with password" toggle click on a **one-shot `isVisible()`** taken right at
`networkidle`; on that slower host the toggle wasn't laid out yet, so `isVisible`
returned false, the **click was skipped**, the password field never mounted, and
`pwField.waitFor(visible)` timed out at 10 s — no fill, no submit, no login POST
(zero POSTs of any kind in the trace). A live headless probe of the exact flow from
this Air reproduces it **working** (toggle visible at networkidle → click → password
field appears), confirming this is a **spec host-timing race, not a live-DOM or app
problem**. **This is SPEC-ONLY** (form-driving still fragile on slow hosts), so it is
fixed and merged, not held.

## Action timeline (run #6 trace)
| t (ms) | action | result |
|---|---|---|
| 1386 | goto | /signin (networkidle) |
| 3012 | isVisible | `pwToggle` → **false** (toggle not laid out yet on the slow host) → conditional click **SKIPPED** |
| 3035 | waitForSelector | `input[type=password]…` → **Timeout 10000ms** (field never mounted) |
| — | fill / click / auth POST | **never reached** — 0 POSTs in the trace |

## The fix (SPEC only)
Drop the one-shot `isVisible()` gate on the toggle. Instead: click the toggle with
Playwright **auto-waiting** (it waits for the toggle to render + become actionable,
15 s), guarded only by whether the password field is already visible (so it also
handles a page that's already in password mode); then `waitFor` the password field
(15 s). Robust across fast/slow hosts. No app/auth change.

## (b/c/d) — purely downstream, no independent defect
Same as every run: `b=no correction/buttons: waiting for getByRole('textbox')` — the
`/ai-tutor` correction surface never renders as signed-in, so (c)(d) are blocked. No
NEW defect surfaced in run #6; it stays downstream of not having a working signed-in
surface. (The injected-session-not-rendering on `/ai-tutor` remains a separate open
item, not a run-6 regression.)

## Host trail (why each run failed differently)
- #4 arm64 Air (chaudoanm3): old passwordTab regex clicked the submit → no login.
- #5 amd64 macbook: ran the pre-fix spec (commit predated it) + (f) API-404.
- #6 admin (MercyB Mac shell runner, frozen chromium): corrected spec, but the
  one-shot `isVisible` raced the slow render → toggle click skipped.
The auto-wait fix removes the last host-timing dependence in the (a) form-driving.

## Deliverable
`reports/synthetic-run6-verdict.md` + the spec fix (`journeys.spec.ts`). SPEC-ONLY →
merged on green per standing authority.

**Validation caveat:** next run exercises it end-to-end. If (a) STILL fails after
this — i.e. `/auth/v1/token` now FIRES (200 → no redirect, or non-200) — *that* is the
next signal (app/auth or creds/rate-limit); per this trace the login never fired
because the toggle click was skipped.
