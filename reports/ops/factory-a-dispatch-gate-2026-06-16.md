# Factory A Dispatch Gate - 2026-06-16

## Purpose

Factory A should keep throughput without spending CI on stale, unsafe, or overlapping work. The repair adds a small dispatch/preflight gate, not a new worker wrapper, night-shift loop, CI-pump, or remote-worker feeder.

## Utility

- Script: `scripts/ops/factory-a-dispatch-gate.mjs`
- Test: `tests/ops/factory-a-dispatch-gate.test.mjs`
- Main pure entry point: `evaluateDispatchGate(input)`

The script is deterministic from supplied job/context data. Unit tests do not require live GitLab API access. Live MR, artifact, changed-file, or pipeline data can be passed in as JSON when Admin has it available.

## Decisions

- `ALLOW`: safe to dispatch within Factory A scope.
- `HOLD`: do not dispatch broadly; serialize or inspect first.
- `REJECT`: do not dispatch unless the job is rewritten or explicitly owner-approved where applicable.

## Job Classification

- Type A: reports, docs, and evidence only.
- Type B: `scripts/ops/**` and `tests/ops/**` focused ops/test utility work.
- Type C: app/product code, mixed scope, or unspecified paths. The gate holds this for serialized handling.
- Type D: auth, billing, SQL/RLS, migrations, secrets, `.env`, deploy config, Supabase migrations, Netlify, or wrangler paths. The gate rejects this unless explicit owner override is supplied; with override it remains held for owner-directed handling.

## Required Examples

Type A allowed:

```json
{
  "job": {
    "id": "907-report",
    "paths": ["reports/ops/factory-a-dispatch-gate-2026-06-16.md"]
  }
}
```

Decision: `ALLOW`.

Type B allowed when paths do not overlap:

```json
{
  "job": {
    "id": "907-gate",
    "allowedPaths": [
      "scripts/ops/factory-a-dispatch-gate.mjs",
      "tests/ops/factory-a-dispatch-gate.test.mjs"
    ]
  },
  "context": {
    "openMergeRequests": [
      {
        "iid": 902,
        "state": "opened",
        "changedFiles": ["reports/ops/other-report.md"]
      }
    ]
  }
}
```

Decision: `ALLOW`.

Type C serialized:

```json
{
  "job": {
    "id": "product-change",
    "paths": ["src/pages/Home.tsx"]
  }
}
```

Decision: `HOLD`, because app/product code should not be broad-dispatched.

Type D rejected:

```json
{
  "job": {
    "id": "dangerous-change",
    "paths": [
      "supabase/migrations/202606160001_auth_rls.sql",
      ".env.production",
      "netlify.toml"
    ]
  }
}
```

Decision: `REJECT`, unless explicit owner override is supplied.

Known stale `903-success-streak-promotion-v1` rejected:

```json
{
  "job": {
    "id": "903-success-streak-promotion-v1",
    "paths": ["reports/ops/factory-success-streak-promotion-v1-2026-06-16.md"]
  }
}
```

Decision: `REJECT`.

`DISK_GATE` classified as `runner_disk_floor`:

```json
{
  "job": {
    "id": "disk-floor",
    "paths": ["scripts/ops/factory-a-dispatch-gate.mjs"]
  },
  "context": {
    "failureTrace": "DISK_GATE: 13.9GB < 14GB floor"
  }
}
```

Failure classification: `runner_disk_floor`, `productCodeFailure: false`.

Manual-only main pipeline treated as clean:

```json
{
  "context": {
    "latestMainPipeline": {
      "jobs": [
        { "name": "lint", "status": "success" },
        { "name": "test", "status": "success" },
        { "name": "production deploy", "stage": "production", "status": "manual", "when": "manual" },
        { "name": "production release", "stage": "production", "status": "created", "when": "manual" }
      ]
    }
  }
}
```

Pipeline assessment: clean. All automatic jobs succeeded and only manual/created production jobs remain.

## Optional Live Inputs

The gate can consume live GitLab-derived data if Admin already has it:

- `context.existingArtifacts`
- `context.mergeRequests` or `context.openMergeRequests`
- MR `changedFiles`
- `context.latestMainPipeline.jobs`

The gate does not fetch live data itself. This keeps unit tests pure and avoids creating another wrapper system.

## Verification

Focused test:

```sh
npx vitest run tests/ops/factory-a-dispatch-gate.test.mjs
```

Result: 10 tests passed.

## Scope Control

This change is limited to:

- `scripts/ops/factory-a-dispatch-gate.mjs`
- `tests/ops/factory-a-dispatch-gate.test.mjs`
- `reports/ops/factory-a-dispatch-gate-2026-06-16.md`

It does not change app product behavior, auth, billing, SQL/RLS, secrets, deploy configuration, Supabase migrations, Netlify, wrangler, CI-pump, or remote-worker feeder behavior.
