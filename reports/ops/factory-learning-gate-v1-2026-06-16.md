# Factory Learning Gate v1 - 2026-06-16

## Incident Lesson

During the CI flood incident, `remote-worker-ci-feeder` ignored testing/governor state and kept creating `automation/c2-strict-ci-worthy` MRs. That leaked old automation into testing mode, created MR flood, and wasted CI capacity.

## Release Rule

Testing mode must deny release when any of these process signatures are alive:

- `remote-worker-ci-feeder`
- `ci-pump`
- `ci-pending-pump`
- `ci-backlog-controller`
- `c2-strict-ci-worthy`

The guard is implemented in `scripts/ops/factory-testing-release-guard.mjs`.

Use:

```sh
FACTORY_MODE=testing node scripts/ops/factory-testing-release-guard.mjs
```

or:

```sh
node scripts/ops/factory-testing-release-guard.mjs --mode testing
```

Expected behavior:

- Exit `0` when testing mode has no blocked feeder or CI pump process alive.
- Exit `1` and print the matching process commands when testing mode has a blocked process alive.
- Exit `0` outside testing mode because this release guard is intentionally scoped to the factory testing gate.

## Scope Control

This change is ops-only. It does not change app product behavior, auth, billing, database policy, secrets, deploy config, or CI topology.

## Verification

Focused test:

```sh
npx vitest run tests/ops/factory-testing-release-guard.test.mjs
```
