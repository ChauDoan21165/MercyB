# 6-Hour Factory Hardening

MercyB factory runs should be modest, local-first, and reversible. The unattended loop exists to observe, classify, and clean up local process drift. It must not merge, deploy, push, rotate secrets, change runners, or alter product content.

## Roles

- Admin: owns the run, branch hygiene, final commit decision, and the no auto-merge/no deploy boundary.
- C2: watches runner health, disk pressure, pipeline failures, and infra retries.
- C3: owns code-quality fixes that are already scoped by an MR or a deterministic gate.
- C4: reviews evidence, docs, and guardrails without changing language product/content.

## Machine Rule

Use an 8GB-or-better machine for a 6-hour factory window. Smaller machines create noisy OOM and browser timeout failures that are hard to separate from real regressions.

## Boundaries

- No auto-merge.
- No deploy.
- No pushes from watch/cleanup tooling.
- No DB, Supabase, billing, auth, edge function, package, migration, Cloudflare, runner secret, or token changes.
- No `.local/`, `reports/ladder/`, `deepclaude/`, or `src/pages/home/__tests__/Home.lazyBoundaries.test.ts` in commits.

## Classify CI Failures

Pipe a failed job log into the classifier:

```sh
glab ci trace <job-id> | node scripts/factory/classify-ci-failure.mjs
```

Or classify a saved log:

```sh
node scripts/factory/classify-ci-failure.mjs /tmp/failed-job.log
```

The classifier prints JSON with `classification`, `retryRecommended`, `holdForHuman`, and `reason`.

- `infra_oom`: retry is usually reasonable after reducing local pressure.
- `infra_playwright_timeout`: retry is usually reasonable when the signature is browser/transient.
- `infra_runner_disk`: hold for human cleanup; do not retry blindly.
- `real_type_error`, `real_lint_error`, `real_orphan`: hold for a scoped fix.
- `unknown`: hold for human review.

## Clean Stale Workers

Preview the target behavior by reading the before summary, then let it terminate stale factory workers:

```sh
bash scripts/factory/clean-stale-workers.sh
```

It targets stale `codex`, `claude`, `vite preview`, `esbuild --service`, and `npm exec vite preview` processes older than 1 hour by default. Override the age gate with `MERCYB_STALE_WORKER_MIN_AGE_SECONDS` when a shorter local cleanup window is intentional. It never targets `gitlab-runner`. It also skips reconciler processes unless explicitly requested:

```sh
bash scripts/factory/clean-stale-workers.sh --include-reconciler
```

## Watch A 6-Hour Run

Start the read-only watcher from the repo root:

```sh
bash scripts/factory/watch-6h.sh
```

On macOS it wraps itself in:

```sh
caffeinate -dimsu -t 21600
```

The watcher writes to:

```sh
$HOME/mercyb-6h-watch.log
```

It logs open merge requests, the latest `main` pipeline, and recent failed job summaries when `glab` is available. Without `glab`, it records local git status and the `origin/main` ref. It exits after 6 hours and never merges, deploys, pushes, or retries anything.

## Commit Guard

Run before staging or committing hardening work:

```sh
bash scripts/factory/guard-clean-commit.sh
```

The guard fails if staged, unstaged, or untracked files include blocked local-only paths. Fix the worktree first, then rerun the guard.
