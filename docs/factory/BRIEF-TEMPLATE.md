# C3 Brief Template

Lane: `<lane name>`.

Contract/forbidden recap:
- Merge every MR yourself, merge commits only, no squash.
- Use green GitLab pipeline when checkable; otherwise record full local gates.
- Memory discipline: one heavy process at a time, sequential gates, halt on exit 137.
- Forbidden surfaces: `supabase db push`, destructive SQL, billing/entitlement/auth unless explicitly in scope, `src/lib/tutor/**`, `searchRooms calculateScore`, credential hunting, invented work.

PREMISE FIRST:
- Verify the stated surface on `origin/main` before building.
- Report the file map and current behavior before edits.
- If the premise is false, stop and report.

Artifact / consumer / done-condition:
- Artifact: `<file, script, CI job, migration SQL, or runtime behavior>`.
- Consumer: `<learner, developer, CI pipeline, owner-run command, deployed app>`.
- Done-condition: `<named observed runtime artifact>`; merged is not enough.

Bounds:
- In scope: `<explicit paths and behaviors>`.
- Out of scope: `<explicit forbidden or deferred paths>`.
- Accepted residual risk must be written under `ACCEPTED-RISKS` with one-line reasons.

Gates:
- Failing-first or regression test for the changed behavior.
- `NODE_OPTIONS=--max-old-space-size=6144 ./node_modules/.bin/tsc --noEmit`.
- `npm run lint`.
- Targeted Vitest or script checks.
- `npm run build` when app/CI/runtime behavior is affected.

Merge policy:
- Open one coherent MR.
- Include the intake test answer: what a learner, developer, deployed app, or CI gets tomorrow.
- Merge on green pipeline; merge commit only.

Report and await:
- Report premise map, implementation, gates, MR, merge state, and observed done-condition.
- Await next instruction; never exit the lane by inventing follow-up work.

Host discipline:
- Start with `source scripts/factory/factory-env.sh && node scripts/factory/host-preflight.mjs`.
