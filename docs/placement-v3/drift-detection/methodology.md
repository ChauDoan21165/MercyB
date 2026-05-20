# Placement V3 Grading Drift Methodology

## Goal

Detect whether prompt edits, model changes, provider failover, parser changes, or grading infrastructure changes alter CEFR placement outcomes in a way that would hurt Vietnamese learners.

## Replay Unit

Each replay fixture contains:

- stable sample ID
- modality
- expected CEFR anchor
- Vietnamese-L1 taxonomy tags
- exact grader payload

Replay output must include ISO timestamp, provider, model, latency, token counts, raw grader output, parsed CEFR result, and replay batch ID.

## Drift Metrics

- CEFR delta: absolute and signed movement between baseline and current replay.
- Catastrophic disagreement: movement of 2+ CEFR bands.
- Malformed-output rate: grader response cannot be parsed into the required CEFR schema.
- Provider variance: success, malformed rate, average expected-level delta, and p95 latency by provider.
- Retry variance: distribution of observed retry/failover paths.
- Taxonomy variance: instability grouped by Vietnamese-L1 interference category.

## Thresholds

- Mean absolute CEFR delta target: below 0.35 bands after repeated calibration.
- Catastrophic provider disagreement: 0 tolerated for production promotion.
- Malformed-output rate: below 3%.
- P95 grading latency: below 30 seconds for replay operations.

## Execution

Run:

```bash
pnpm tsx scripts/placement-v3/run-grading-replay.ts --batch baseline-01 --persist=true
```

The runner refuses to fabricate live outputs if Supabase credentials are missing.

## Current Scope

#942 has merged Placement V3 writing grader infrastructure. A36 adds drift replay infrastructure around available grader endpoints and does not claim live replay metrics; live replay remains blocked unless Supabase/env vars are configured.
