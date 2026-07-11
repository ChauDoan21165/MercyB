# Synthetic run #3 diagnosis (pipeline 2668827955, job 15294868302)

1/6 passed — only (e). This run included the selector fix (`75b2a45b` in the tree),
so the sign-in click executed. Live version.json hash: `df2b0b9`.

- **(f) — FIXED here** (spec bug: stale deploy-sha baseline).
- **(a) — HELD** for Chau's Incognito result (evidence below; leading hypothesis:
  the synthetic account's email is unconfirmed → the app correctly won't treat it as
  signed in). No app/spec change made for (a) yet.
- **(b/c/d) — same root as (a)** (unverified synthetic session), not a separate defect.

---

## (a) sign-in — click executed, but NO redirect (held)
Job log / artifact: `Error: BOUNCED back to /signin`, journey ran **22.4s**.
- The selector fix worked — the form was filled and the sign-in button clicked; the
  test then waited the **full 20s** `waitForURL` and the URL never left `/signin`.
- **Credentials are VALID:** journey (b) calls `seedSession()` which does a real
  `POST /auth/v1/token?grant_type=password` and **throws on failure**. There is **no
  "synthetic sign-in failed"** in the log → the password grant succeeded → the
  synthetic **password is correct**.
- **Not the anon-bounce regression:** !2581's fix is in the deployed bundle
  (`live=df2b0b9`, which is ≥ 537add0ae).

**Discrimination:**
- NOT bad credentials (password grant succeeded).
- NOT a slow-redirect-just-over-timeout (it waited the full 20s; a real sign-in
  redirects in ~1–3s — this never redirected).
- NOT the anon bounce (fix deployed).
- **Leading hypothesis — unconfirmed synthetic email.** After !2581, LoginPage only
  redirects on a *verified* session (`email_confirmed_at`), matching AuthProvider's
  long-standing `getVerifiedSession`. If the synthetic account's `email_confirmed_at`
  is null, form login creates a session but is **not** treated as signed-in → **no
  redirect (a)**; and the injected session in (b) is filtered to anonymous → **no
  tutor (b)**. The password grant returning a session (rather than 400 "Email not
  confirmed") is consistent with email-confirmation being disabled at the project
  level, so the session exists but is unverified.

**This is an account-state issue, not an app bug — do not loosen the verified-session
gate.** Remedy (Chau): confirm the synthetic account's email (part of the flag/seed
step), then re-run. **Held pending Chau's Incognito login:**
- Manual login of a **confirmed** account redirects fine → app/fix correct; the
  synthetic account just needs email confirmation.
- Manual login of the **synthetic** account also stays on /signin → confirms the
  account is unconfirmed.

## (b/c/d) — same root, no separate cause
(b) seeds its **own** valid session (`seedSession`, grant succeeded) and navigates to
`/ai-tutor`, then times out (90s) waiting for `getByRole('textbox')`. So (b) is not
literally downstream of (a)'s UI flow — but it fails for the **same underlying reason**:
the synthetic session is not *verified*, so `/ai-tutor` renders as anonymous and the
correction textbox never mounts. There is **no separate selector/logic defect** ((b)'s
own submit selector was already corrected in !2587). (c) and (d) are blocked by (b).

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
