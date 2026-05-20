# Placement V3 Replay Audit

## Replay Input

- Audit ID:
- Environment:
- Correlation ID:
- Source table/export:
- Event count:
- Replay command:
- Replay timestamp:

## Reconstruction Result

- Terminal state:
- Recoverability state:
- Missing event count:
- Retry consistency:
- Provider switches:
- Fallback transitions:
- Degraded result marker:

## Integrity Checks

| Check | Pass/fail | Evidence |
| --- | --- | --- |
| Events ordered by timestamp/sequence |  |  |
| Correlation ID continuous |  |  |
| Retry attempts consistent |  |  |
| Provider metadata present |  |  |
| Terminal state present |  |  |
| No sensitive payload in replay output |  |  |

## Findings

- Reconstructed well:
- Reconstructed poorly:
- Missing evidence:
- Required fix:
