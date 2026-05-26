# CI — Deferred / Retired Workflows

Workflows that have been removed or paused, with the reason and a
restoration recipe so future Chau (or a CC) doesn't waste cycles
re-discovering why a check is missing.

Add a new entry to the top of the **Retired** section when you delete
or disable a workflow. Keep the recipe specific enough that someone
can rebuild it without context.

---

## Retired

### `launch-sim.yml` — retired 2026-04-25 (issue #54, PR for `chore/cc2-retire-launch-sim`)

- **What it did (intent):** Ran `npm run launch-sim` on every push to `main` and every PR, uploaded `launch-report.json` / `launch-report.html` as an artifact, and failed the check if the run failed.
- **Why retired:** Orphaned. The workflow's only job step ran `npm run launch-sim`, but `package.json.scripts` has no entry by that name. The script and the workflow drifted apart at some unknown point. PR #50's `actions/checkout@v3 → @v4` bump unmasked the failure (previously the deprecated `upload-artifact@v3` was killing the run at setup-job; @v4 lets the run reach `npm run launch-sim` and fail there with `npm error Missing script: "launch-sim"`).
- **Same pattern as:** `room-validation.yml` (CC7, PR #50). Both were CI surfaces that referenced npm scripts which no longer existed.

#### Was anything legitimately lost?

`scripts/launch-audit.ts` and `scripts/run-launch-simulator.ts` still exist in the repo and are unaffected by this retirement — they are **not** referenced from CI or from `package.json.scripts`. They run manually via `npx tsx scripts/launch-audit.ts` for ad-hoc launch readiness checks. No CI consumer.

#### To restore

If a Chau wants Launch Simulation back as a CI gate:

1. Decide what command should run. The likely candidate is the existing audit:
   ```jsonc
   // package.json scripts:
   "launch-sim": "tsx scripts/launch-audit.ts"
   ```
   or call the simulator preset directly:
   ```jsonc
   "launch-sim": "tsx scripts/run-launch-simulator.ts --preset short"
   ```
   Pick one — these scripts are already wired together (`launch-audit.ts` invokes `run-launch-simulator.ts`).
2. Recreate `.github/workflows/launch-sim.yml`. The pre-retirement file is preserved in the git history of this branch's parent commit if you want to start from the same shape; the reference is:
   ```yaml
   name: Launch Simulation
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
       types: [opened, synchronize]
   jobs:
     simulate:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run launch-sim
         - if: always()
           uses: actions/upload-artifact@v4
           with:
             name: launch-simulation-report
             path: |
               launch-report.json
               launch-report.html
         - if: failure()
           run: |
             echo "Launch simulation failed"
             exit 1
   ```
3. Confirm the artifact paths still exist — `launch-audit.ts` did not (at the time of retirement) emit `launch-report.json` / `launch-report.html`. The artifact step would silently produce empty uploads. Either update the script to emit those files, or drop the artifact step.
4. Open a PR. Re-running this gate on every push to `main` adds CI time, so include a justification for why it's worth the slot.
