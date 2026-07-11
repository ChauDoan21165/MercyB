# Synthetic run #3 diagnosis (pipeline 2668827955, job 15294868302)

1/6 passed — only (e). This run included the selector fix (`75b2a45b` in the tree),
so the sign-in click executed. Live version.json hash: `df2b0b9`.

- **(f) — FIXED here** (spec bug: stale deploy-sha baseline).
- **(a) — RUNNER-CONDITIONAL; likely an APP race — REPORTED, not fixed.** Chau's
  Incognito login of the synthetic account SUCCEEDS (outcome A) → account + password
  confirmed good; my earlier unconfirmed-email hypothesis is **DISPROVEN**. Per the
  standing rule ("if the app bounces a confirmed session under fast conditions, report
  before fixing app code"), no app/spec (a) change is made yet — see below.
- **(b/c/d) — same root as (a)**, not a separate defect.
- **Trace-capture fix folded in** so the next run's trace.zip is retrievable.

---

## (a) sign-in — RUNNER-CONDITIONAL bounce (Chau outcome A) → likely anon-bootstrap race
Job log / artifact: `Error: BOUNCED back to /signin`, journey ran **22.4s**.
- The selector fix worked — the form was filled and the sign-in button clicked; the
  test then waited the **full 20s** `waitForURL` and the URL never left `/signin`.
- **Credentials + confirmation are GOOD:** (i) journey (b)'s `seedSession()` password
  grant succeeded (no "synthetic sign-in failed"); (ii) **Chau's manual Incognito login
  of the same account SUCCEEDS and lands in the app, no bounce**. So the account is
  confirmed and the password is correct — **runner-conditional**: same account bounces
  headless but not manual.

**Discrimination:**
- NOT bad credentials, NOT unconfirmed email (Chau outcome A disproves both).
- NOT a slow-redirect-just-over-timeout (waited the full 20s; a real sign-in redirects
  in ~1–3s — this never settled signed-in).
- NOT the stale anon-bounce (that fix is deployed, `live=df2b0b9`).
- **Prime suspect — the anonymous-session bootstrap RACE.** `AuthProvider.boot()` calls
  `bootstrapAnonymousSession()` (`src/providers/AuthProvider.tsx:453`), which
  `getSession()`-checks then `signInAnonymously()` (`src/lib/auth/anonymousBootstrap.ts:
  76→86`) — the check and the sign-in are **not atomic**. A headless runner submits the
  form fast: if `signInAnonymously()` is still in flight when the UI password sign-in
  writes a *verified* session, the anon sign-in completes **after** and clobbers the
  verified session (same storage key `mb-supabase-auth-<ref>`) → the app treats the
  just-signed-in user as anonymous → no redirect / bounce back to /signin. A manual user
  is slow enough that the anon bootstrap finishes first, so their sign-in cleanly
  replaces the anon session — which is exactly why manual works.

**Verdict — this is the "report before fixing app code" branch.** The evidence (full
20s no-settle, manual-works, runner-conditional) rules out a spec-reads-too-early
artifact; the app is not retaining the fast sign-in. That is a real (if narrow)
app-level race, so I am **reporting it rather than papering over it with a spec timing
change**.

**Why no trace-level confirmation this run:** the run-3 `trace.zip`
(`test-results/journeys--a-.../trace.zip`) was **NOT retrievable** — the
`prod-synthetic-learner` job's `artifacts:paths` uploaded only
`reports/prod-synthetic-learner/` (no `test-results/`), and the local runner copy on
mac-runner-2 was already cleaned. **Fix folded here:** add `test-results/` to that job's
`artifacts:paths` so the **next** run captures the exact session/redirect sequence and
confirms the race definitively.

**Held (needs the trace):**
- The deterministic (a) spec change (wait for the signed-in auth-state marker before
  asserting the URL) — held until the trace confirms the exact auth-state sequence so
  the wait is implemented against the real localStorage session shape, not a guess.
- Any app fix to `bootstrapAnonymousSession` (e.g. re-check `getSession()` immediately
  before `signInAnonymously()`, or skip the anon bootstrap on the `/signin` route) —
  reported, not done, per the standing rule.

## (b/c/d) — same runner-conditional root as (a), no separate defect
(b) seeds its **own** session (`seedSession`, grant succeeded on a now-confirmed
account) and navigates to `/ai-tutor`, then times out (90s) waiting for
`getByRole('textbox')` — the tutor never renders as signed-in. Since the account is
confirmed (Chau outcome A), this is **not** an unverified-session issue; it is the
**same runner-conditional session-handling failure as (a)** — most plausibly the same
`bootstrapAnonymousSession` race clobbering the injected session on the fast headless
`/ai-tutor` load (the anon bootstrap runs on every route mount). **No separate
selector/logic defect** ((b)'s own submit selector was already corrected in !2587).
(c) and (d) are blocked by (b). The captured trace (next run) will confirm whether (b)'s
injected session is being clobbered the same way.

## (f) version.json — FIXED (stale deploy-sha baseline)
Log: `live=df2b0b9 expected=75b2a45`.
- Root cause: `resolveExpectedDeploySha` compared version.json against the **latest
  *green* main pipeline** (`75b2a45`), but the synthetic job started before its own
  pipeline (on `df2b0b97a`) was marked green, so the resolver returned the **prior**
  green sha — while Cloudflare had **already deployed `df2b0b9`** (= this pipeline's
  own commit `df2b0b97a`). So it's a resolver/deploy race; note the live sha was
  actually *ahead* of the resolver's stale baseline (the opposite direction from a
  lagging deploy), but the effect is the same spurious red.
- **Fix:** compare live against **`CI_COMMIT_SHA`** (the main HEAD this run is for)
  with ancestor tolerance — new `isDeployShaAcceptable()`:
  - accept if `live == CI_COMMIT_SHA` (this run: `df2b0b9` is the 7-char prefix of
    `df2b0b97a` → pass);
  - accept if `live` is an **ancestor** of `CI_COMMIT_SHA` on origin/main (deploy
    lagging behind main HEAD) — verified via the GitLab `merge_base` API (robust to
    the runner's shallow clone);
  - **fail** only if `live` is **not** an ancestor — a rollback or foreign build, a
    real alarm.
- `resolveExpectedDeploySha` is left in place (unused) for reference.

---

## Deliverable
- `reports/synthetic-run3-diagnosis.md` + the (f) fix (`expectedDeploy.ts`,
  `journeys.spec.ts`) in one MR. **No (a) fix** — held for Chau's Incognito result.
