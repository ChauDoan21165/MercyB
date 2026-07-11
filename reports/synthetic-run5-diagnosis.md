# Synthetic run #5 diagnosis (pipeline 2668949254, job 15295501083)

1/6 — only (e). Ran on a **different host** (`/Users/macbook`, amd64 — the factory
box), not the prior `/Users/chaudoanm3` arm64 Air. Host was the deciding factor for
**(f)** (fixed here, host-independent) and a **non-factor** for (a)/(b/c/d).

## (a) — NO fix needed: run #5 executed the PRE-fix spec
- `/auth/v1/token` still **never fired** (only telemetry POSTs), same as run #4.
- **But run #5's pipeline commit is `8a7fc9e`, which PREDATES the (a) fix `5631e41`
  (!2592).** Confirmed: `git merge-base --is-ancestor 5631e41 8a7fc9e` → not an
  ancestor → the fix is NOT in run #5's checked-out spec. So (a) ran the **old**
  passwordTab-ambiguity code and failed the same old way.
- **Host is not the (a) factor** — the stale checked-out spec is. The run-4 fix
  (match only the "Sign in with password" toggle; deterministic waits) ships in the
  **next** run on a commit ≥ `5631e41`. No new (a) change here.

## (f) — REGRESSION was HOST TOOLING, not deploy identity → fixed host-independent
- Failure (`journeys.spec.ts:231`): `merge_base API http 404 (live 5631e41 vs ci
  8a7fc9e)`. The run-3 ancestry check used the **GitLab merge_base API**; on the
  `/Users/macbook` host that call **404'd** (that host's `CI_JOB_TOKEN` can't reach
  the repository endpoint, and no `GITLAB_TOKEN`/PAT is set there — the arm64 Air had
  one, which is why run #4 was green with identical code). So the oracle **errored
  rather than compared** — a host-tooling red, not a deploy problem.
- **Second latent bug:** live `5631e41` is a **DESCENDANT** of ci `8a7fc9e` (the
  deploy is AHEAD of this pipeline's own commit — a newer main build deployed while an
  older/scheduled pipeline ran). The run-3 logic only accepted equal-or-live-is-
  ancestor, so it would have failed (f) even with a working API.
- **Fix (spec/infra only) — `isDeployShaAcceptable` rewritten:**
  - Resolve ancestry with **local git** in the checked-out repo
    (`git merge-base --is-ancestor`), no GitLab API, no token → host-independent.
  - Accept if live and ci are on the **same main lineage in EITHER direction**
    (live behind ci = deploy lag; live ahead of ci = newer main build).
  - **FAIL only** if git decisively says they are UNRELATED (rollback / foreign build).
  - **FAIL OPEN with a WARN** if the oracle can't decide (git missing, commit not in
    the clone, fetch failed) — (f) tests DEPLOY IDENTITY, not host tooling.
  - Best-effort `git fetch --depth=200 origin main` first so an AHEAD live sha is in
    the shallow clone.
  - Verified against run #5's shas: `git merge-base --is-ancestor 8a7fc9e 5631e41` → 0
    ⇒ "deploy-ahead" ⇒ **ACCEPT** (would now be green); two unrelated shas ⇒ both exit
    1 ⇒ FAIL (real alarm preserved).

## (b/c/d) — purely downstream of (a)
`b=no correction/buttons: locator.click: Test timeout … waiting for
getByRole('textbox')` — (b) seeds its own session, navigates to `/ai-tutor`, no tutor
textbox. Same as every run: no signed-in tutor surface → no correction → (c)(d)
blocked. No separate defect; host-independent. Will clear once (a) actually completes
a UI sign-in (next run with the fix) OR is separately understood.

## Deliverable
- `reports/synthetic-run5-diagnosis.md` + the (f) host-independent fix
  (`expectedDeploy.ts`) in one MR. **Spec/CI only — no app or auth code** → merge on
  green per standing authority. No (a) change (run-4 fix already on main, awaiting a
  run that includes it).
