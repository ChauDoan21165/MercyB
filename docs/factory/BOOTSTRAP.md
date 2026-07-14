# Factory Bootstrap

Read this at the start of every factory-agent workpack. These rules are the operating contract for repo automation, CI lanes, and robot fleets.

## Synthetic Monitoring Marker

All prod-touching automation must mark itself as synthetic. This includes CI Playwright configs, prod monitoring specs, ad-hoc prod probes, and any lane's robot fleets.

Seed:

```js
localStorage["mercyblade.syntheticMonitoring"] = "1";
```

The marker must be synchronously set and asserted on the final live page origin immediately before the emitting action. Config-level or context-init seeding is useful but not sufficient by itself, because redirects, reused pages, request-only tests, or action helpers can bypass the intended browser state. The client reads the marker per emission, not at module initialization, so a page-origin assertion immediately before the write-producing action is the reliable boundary.

## Done Means Shipped To Review

Agent done means all of the following are true:

- Branch pushed.
- Merge request URL reported.
- MR pipeline is green.
- Final report sent with evidence.

Agents never merge. Never push to `main`.

## State Is Read-Only

The `state/` directory is read-only for agents. Do not write, rewrite, compact, migrate, or delete files under `state/`.

`state/dp_int_factory.sqlite3` is the canonical factory state database. Treat any local export, copy, or generated report as secondary unless it is verified against that database.

## Verify Against Origin

Verify repo facts against origin refs, not local working trees, cached branches, previous agent reports, or self-report. Prefer commands such as:

```sh
git fetch origin
git show origin/main:path/to/file
git ls-tree origin/main path/to/file
git log origin/main -- path/to/file
```

Local files are evidence only for the current unmerged worktree. Remote refs are the source of truth for what is actually merged.

## Worktree Discipline

Use a fresh dedicated worktree from `origin/main` for every workpack. Keep one workpack per branch. Before pushing, verify the changed-file list is exactly the intended surface and that no unrelated dirty state, generated reports, or previous agent output is included.

## Production Credential Fence

CI test suites must never resolve production credentials. Vitest and unit-test jobs run against non-production environments. The shared Vitest setup hard-fails if `VITE_SUPABASE_URL` resolves to the production project ref. Never weaken this guard.

## Stale Ref Discipline

Any branch whose merge-base predates the current CI guards must be rebased onto `origin/main` before its pipeline runs. Old refs execute their own CI config, so in-repo guards added later do not protect them.

## No-Write Verification

Verification of "no unwanted writes" requires a trigger event plus a direct table `SELECT` afterward. Never rely on absence of noise during a quiet window. Name the event, run it, then query the table that would receive the unwanted write.
