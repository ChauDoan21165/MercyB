# C4-BUILD-ENV-PREBUILD-GUARD-001 — EXECUTION REPORT

## Workpack
`C4-BUILD-ENV-PREBUILD-GUARD-001`

## Root cause
`npm run build` runs a `prebuild` hook whose first step is
`node scripts/validate-vite-supabase-env.mjs`. The guard is fail-closed by design:
it refuses to build when `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is
missing, so production auth can never fall back to a placeholder Supabase config.

In the gate-scan environment neither var was set and no `.env`/`.env.local` file
existed, so the guard exited `2` and the build gate failed. The failure itself was
**correct** — the real defect was that it was **not actionable**: the message did
not tell the operator how to remediate, and the two required core vars were **not
documented** in `.env.example` (which only catalogued the IAP subset). The fix
makes the failure deterministic and self-remediating without weakening the guard.

## Files changed
- `scripts/validate-vite-supabase-env.mjs` — added an actionable "How to fix"
  block to the missing-env branch (names the local `.env.local`/`.env` remedy, the
  CI secrets remedy, points at `.env.example`, and echoes the exact missing keys).
  Guard semantics unchanged: still `process.exit(2)`, still fail-closed, no
  placeholder fallback introduced.
- `.env.example` — added a documented **"Supabase (core build env) — REQUIRED for
  `npm run build`"** section with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  and where to find them; corrected the stale header claim that Supabase vars were
  not catalogued here.

Diff stat: `2 files changed, 36 insertions(+), 5 deletions(-)`.

## Validation results
- `npm run typecheck` → **PASS** (exit 0)
- `npm run lint` → **PASS** (exit 0)
- `npm run build` with **no** env → **fail-closed by design** (exit 2), now emits
  actionable remediation guidance (local + CI paths, exact missing keys).
- `npm run prebuild` with test env
  (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`) → **PASS** (exit 0): advances past
  the guard through `rooms:check` (validate-rooms PASS) and `check:no-raw-react-lazy`.
- Guard unit behavior: missing → exit 2 (actionable); provided → exit 0.

Note: a full `vite build` past `prebuild` requires real Supabase config + audio
manifest generation and was not run locally; the fix is scoped to the prebuild
guard that was the failing step, and its behavior is verified both ways.

## Branch name
`repair/c4-build-env-prebuild-guard-001`

## Commit hash
`1f71117b984d51c486b8661e9a1c6416d769fb9c` (short `1f71117`), message
`Fix build env prebuild guard`. Pre-commit hook (typecheck + lint + rooms
validate + registry) passed.

## Push result
Pushed to `origin` (GitLab `gitlab.com:cd12536/MercyB.git`): new branch
`repair/c4-build-env-prebuild-guard-001`, tracking set. GitLab offered MR link:
https://gitlab.com/cd12536/mercyB/-/merge_requests/new?merge_request%5Bsource_branch%5D=repair%2Fc4-build-env-prebuild-guard-001

## MR recommendation
Open an MR from `repair/c4-build-env-prebuild-guard-001` → `main`. Low risk:
touches one build-guard script (message-only) and `.env.example` (docs). No
product source, no runtime, no schema. Reviewer check: confirm the guard still
exits non-zero on missing env and that no placeholder fallback was added. **No
merge / no deploy** in this workpack.

## Mutation summary
- Source mutation: build-guard script message + `.env.example` docs only (no
  product/runtime source)
- Database mutation: none
- Runtime mutation: none
- Judge/Coverage mutation: none
- Package promotion: none
- Push / merge / deploy: branch push only (explicit Admin approval); no merge, no deploy

## Rollback plan
`git checkout -- scripts/validate-vite-supabase-env.mjs .env.example`, or delete
the branch `repair/c4-build-env-prebuild-guard-001`. No data/runtime state touched;
fully revertible.

## Safety locks honored
- No C2 TM INT runtime fix.
- No architecture changes.
- No Judge/Coverage mutation.
- No merge/deploy.
- Guard remains fail-closed (never fabricates Supabase config).
