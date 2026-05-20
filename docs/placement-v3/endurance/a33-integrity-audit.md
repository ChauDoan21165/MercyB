# A33 Placement v3 Integrity Audit

Date: 2026-05-20

## Tooling

Added `scripts/placement-v3/run-session-integrity-check.ts`.

It checks raw endurance runs for:

- orphan sessions
- incomplete sessions
- impossible transitions
- duplicate/replayed submissions
- retry loops
- inconsistent CEFR outcomes
- unclassified failures

## Final 100-Run Audit

Command:

```bash
npx tsx scripts/placement-v3/run-session-integrity-check.ts \
  --input=docs/placement-v3/endurance/raw-runs/a33-local-100-final \
  --out=docs/placement-v3/endurance/raw-runs/a33-local-100-final/integrity.json
```

Result:

- total runs checked: 100
- violation count: 0

## Final 25-Run Audit

Command:

```bash
npx tsx scripts/placement-v3/run-session-integrity-check.ts \
  --input=docs/placement-v3/endurance/raw-runs/a33-final-stability-25-final \
  --out=docs/placement-v3/endurance/raw-runs/a33-final-stability-25-final/integrity.json
```

Result:

- total runs checked: 25
- violation count: 0

## Finding

The local/session-mode burn-in did not produce orphan sessions, impossible
states, duplicate persisted responses, retry loops, or inconsistent CEFR
outcomes.

