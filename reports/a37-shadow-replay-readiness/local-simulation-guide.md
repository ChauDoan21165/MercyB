# Local Simulation Guide

Date: 2026-05-20

Purpose: allow safe local rehearsal of replay mechanics without claiming production replay evidence.

## How To Run Simulation Safely

Use local fixtures and mocked provider outputs only. Do not enable Placement V3 production flags and do not send real user content to providers.

Suggested command shape for a future simulation script:

```bash
SIMULATION_ONLY=1 \
PLACEMENT_REPLAY_FIXTURE_DIR=reports/a37-shadow-replay-readiness/fixtures \
pnpm tsx scripts/placement-v3/run-shadow-replay.ts --simulation --batch local-smoke
```

Expected output shape:

```text
mode=simulation
batch=local-smoke
provider_calls=0
result=completed
```

If the script does not exist yet, the correct result is:

```text
simulation=blocked-script-not-implemented
```

## What Simulation Proves

- Event ordering logic can process fixture sessions.
- Replay diff formatting works.
- Sanitization rules can run over known samples.
- Operator docs and commands are usable.
- Failure handling can be rehearsed without real user data.

## What Simulation Does Not Prove

- Real OpenAI/Gemini provider routing.
- Real Azure speech scoring.
- Real Supabase persistence/RLS.
- Real latency, retries, failover, or token usage.
- Production privacy safety.
- Drift on real Placement V3 sessions.

## Avoiding Confusion With Production Evidence

- Prefix all files with `simulation-`.
- Include `mode=simulation` in every log.
- Record `provider_calls=0` when providers are mocked.
- Do not mix simulation files into `raw-runs/` intended for real sessions.
- Do not cite simulation runs as hard-gate evidence.

## Safe Simulation Checklist

- [ ] Uses fixtures only.
- [ ] No provider env vars required.
- [ ] No Supabase service role required.
- [ ] Output directory is clearly marked simulation.
- [ ] Report explicitly says what remains unproven.
