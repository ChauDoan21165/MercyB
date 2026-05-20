# A2 Failure Scenarios

Generated: 2026-05-20

The local failure-injection harness executed each required scenario twice: a `before` run with intentionally incomplete evidence and an `after` run representing the improved forensic event set.

Command:

```bash
npx tsx scripts/placement-v3/run-failure-injection.ts --run-id a2-burnin-02
```

Replay command:

```bash
for f in docs/placement-v3/observability/raw-runs/a2-burnin-02-*.json; do
  case "$f" in *-reconstruction.json) continue ;; esac
  base=$(basename "$f" .json)
  npx tsx scripts/placement-v3/replay-failure-timeline.ts \
    --input "$f" \
    --output "docs/placement-v3/observability/raw-runs/replay-a2-burnin-02/${base}-replay.json"
done
```

## Scenario Matrix

| Scenario | Before Evidence Gap | After Evidence Added |
| --- | --- | --- |
| provider timeout | no recoverability state, no terminal transition | latency, provider timeout, recoverable marker, terminal transition |
| malformed JSON grader output | parse failure only | deterministic parse failure, degraded fallback marker, terminal transition |
| provider fallback | provider switch visible but no terminal transition | fallback path plus terminal transition |
| retry exhaustion | impossible retry count, no terminal transition | consistent retry attempts and terminal transition |
| recommendation-engine failure | failure only | fallback recommendation status and terminal transition |
| taxonomy parse failure | taxonomy failure only | taxonomy event plus terminal transition |
| persistence write failure | write failure without recoverability | unrecoverable state recorded |
| feature flag mismatch | mismatch only | flag snapshot plus terminal transition |
| interrupted session recovery | resume request without outcome | recovered state and terminal transition |
| partial orchestration corruption | stuck state | failed-state transition that reconstructs without dead end |

## Runtime Evidence

- 20 local runtime executions saved under `docs/placement-v3/observability/raw-runs/a2-burnin-02-*.json`.
- 20 in-process reconstruction outputs saved as `*-reconstruction.json`.
- 20 replay utility outputs saved under `docs/placement-v3/observability/raw-runs/replay-a2-burnin-02/`.
- The failed first wrapper attempt is also preserved as `a2-burnin-01-*`; it exposed a sequence-numbering instrumentation bug that was fixed before `a2-burnin-02`.

No live provider responses are claimed for these scenario files. The harness marks them as local simulation.
