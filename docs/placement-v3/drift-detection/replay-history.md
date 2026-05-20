# Placement V3 Replay History

## 2026-05-20 — A36 Harness Creation

- Added 40 replay fixtures across reading, listening, and speaking.
- Added replay runner with resumable partial output and database persistence.
- Added drift analysis library, Supabase tables, edge report function, and admin dashboard.
- Added deterministic local simulation mode and three committed simulated replay runs under `simulated-runs/`. These artifacts are explicitly marked `simulated: true` and are not live provider metrics.
- Added deterministic replay guardrails: fixture integrity check, schema validation, repeated-run determinism checker, and `replayDeterminism.test.ts`.
- Ran five additional simulated replay runs and five determinism checker runs under `determinism-runs/`. These are simulated-only pipeline evidence, not live provider drift evidence.
- Attempted live replay command is documented in `a36-blockers.md` if credentials are unavailable.

## Required Future Entries

Each replay cycle must record:

- batch ID
- command
- fixture count
- providers observed
- malformed-output count
- mean absolute CEFR delta
- catastrophic disagreements
- stability adjustment applied before the next replay
- links to raw files in `raw-runs/`
