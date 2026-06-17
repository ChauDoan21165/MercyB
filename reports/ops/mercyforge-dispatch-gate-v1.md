# MercyForge Dispatch Gate v1

Date: 2026-06-17
Job: 907

## Purpose

Dispatch Gate v1 is a small deterministic preflight gate for MercyForge jobs. It sits between the Admin conductor and the worker forges so Admin can decide whether a job should start now, wait, be held for owner review, or be rejected before Codex spends tokens and before GitLab CI spends runner time.

This is not a night wrapper, CI-pump, remote-worker feeder, or autonomous scheduler. It only evaluates supplied JSON inputs and emits a JSON decision.

## Files

- `scripts/ops/mf-gate.mjs`
- `tests/ops/mf-gate.test.mjs`
- `reports/ops/mercyforge-dispatch-gate-v1.md`

## Output Contract

The CLI and pure evaluator return JSON with:

- `decision`
- `reason`
- `job_type`
- `risk_flags`
- `path_lock_key`
- `recommended_target`
- `details`

Decision values:

- `DISPATCH_TO_C2`
- `DISPATCH_TO_C4`
- `DISPATCH_TO_ADMIN`
- `WAIT`
- `HOLD_FOR_OWNER`
- `REJECT_DUPLICATE`
- `REJECT_UNSAFE`

## Gate Checks

Machine health:

- Applies disk floor checks, defaulting to `14` GB.
- Consumes stale worker process flags.
- Consumes runner status inputs such as `online`, `healthy`, `offline`, or other statuses.

Duplicate and stale jobs:

- Checks same `job_id`, `title`, or `branch` against supplied active jobs.
- Checks requested artifacts against supplied existing artifacts.
- Checks supplied merge requests in any state, including open, merged, and closed.
- Always rejects `903-success-streak-promotion-v1` as a known stale duplicate.

Path locks:

- Computes `path_lock_key` from the requested paths.
- Holds for owner review when requested paths overlap active supplied locks.
- Ignores released locks.

Job types:

- Type A: docs, reports, and evidence.
- Type B: `scripts/ops` and `tests/ops`.
- Type C: app or product code.
- Type D: auth, billing, SQL/RLS, migrations, secrets, `.env`, deploy, production config, Supabase migrations, Netlify, or wrangler scope.

CI state:

- If GitLab is saturated, Type A may still dispatch; other types wait.
- Latest main with successful automatic jobs and only manual/created deploy jobs is clean.
- Latest main with a failed automatic job is held for owner review.

## Examples

Dispatch docs while GitLab is saturated:

```json
{
  "job": {
    "job_id": "907-report",
    "paths": ["reports/ops/mercyforge-dispatch-gate-v1.md"]
  },
  "context": {
    "ci": { "gitlabSaturated": true }
  }
}
```

Result shape:

```json
{
  "decision": "DISPATCH_TO_ADMIN",
  "job_type": "Type A",
  "risk_flags": ["GITLAB_SATURATED"],
  "path_lock_key": "reports/ops",
  "recommended_target": "ADMIN"
}
```

Dispatch ops work to C2:

```json
{
  "job": {
    "job_id": "907",
    "paths": ["scripts/ops/mf-gate.mjs", "tests/ops/mf-gate.test.mjs"]
  },
  "context": {
    "machineHealth": {
      "runners": [
        { "role": "C2", "status": "online", "diskFreeGb": 80 },
        { "role": "C4", "status": "online", "diskFreeGb": 80 }
      ]
    }
  }
}
```

Result shape:

```json
{
  "decision": "DISPATCH_TO_C2",
  "job_type": "Type B",
  "risk_flags": [],
  "path_lock_key": "scripts/ops+tests/ops",
  "recommended_target": "C2"
}
```

Reject unsafe scope:

```json
{
  "job": {
    "job_id": "unsafe",
    "paths": ["supabase/migrations/202606170001_rls.sql", ".env.production", "netlify.toml"]
  }
}
```

Result shape:

```json
{
  "decision": "REJECT_UNSAFE",
  "job_type": "Type D",
  "risk_flags": ["UNSAFE_SQL_RLS_MIGRATIONS", "UNSAFE_ENV", "UNSAFE_SUPABASE_MIGRATIONS", "UNSAFE_NETLIFY"],
  "recommended_target": "ADMIN"
}
```

## CLI

Read JSON from stdin:

```bash
printf '%s\n' '{"job":{"job_id":"907","paths":["scripts/ops/mf-gate.mjs"]},"context":{"machineHealth":{"runners":[{"role":"C2","status":"online","diskFreeGb":80}]}}}' \
  | node scripts/ops/mf-gate.mjs
```

Read JSON from a file:

```bash
node scripts/ops/mf-gate.mjs /tmp/mf-job.json
```

Read JSON from an explicit file flag:

```bash
node scripts/ops/mf-gate.mjs --input /tmp/mf-job.json
```

## Verification

Focused test:

```bash
npx vitest run tests/ops/mf-gate.test.mjs
```

Result:

```text
Test Files  1 passed (1)
Tests       11 passed (11)
```
