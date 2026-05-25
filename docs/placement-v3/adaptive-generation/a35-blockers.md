# A35 Blockers

Generated: 2026-05-20T12:32:00Z

## Commands Attempted

```bash
pnpm tsx scripts/placement-v3/run-adaptive-item-gauntlet.ts --batch baseline-01
pnpm tsx scripts/placement-v3/run-adaptive-item-gauntlet.ts --batch tuned-01 --full
OPENAI_API_KEY= GEMINI_API_KEY= npx tsx scripts/placement-v3/run-adaptive-item-gauntlet.ts --batch smoke-no-keys --count 1
```

## Exact Errors

The baseline command completed.

The tuned full command stopped during the live model-call loop:

```text
fetch failed
```

The no-key smoke command intentionally verified honest-stop behavior:

```text
No model credentials found. Set OPENAI_API_KEY or GEMINI_API_KEY.
```

## What Was Tested Locally

- Baseline live run completed: 30 generated candidates and 30 validation records under `raw-runs/baseline-01-*`.
- Partial tuned live run completed: 29 generated candidates and 29 validation records under `raw-runs/tuned-01-cycle1-*`.
- Raw evidence includes ISO timestamps, provider/model, latency, token usage, raw generated item, raw validator response, final decision, and rejection reasons.
- Shared schemas, prompt construction, Edge Function entry points, local gauntlet writing, and report generation structure are implemented.
- Missing-credential behavior writes this blocker file instead of fabricating data.

## What Remains Unverified

- The hard gate of 90 generated candidates was not met; current live evidence is 59 candidates.
- The hard gate of 90 validation records was not met; current live evidence is 59 validation records.
- Three sequential prompt-tuning cycles did not complete because the tuned full run stopped during cycle 1.
- At least 30 accepted items were not reached; current live evidence has 4 accepted items across baseline plus partial tuned run.
- Production replacement safety remains unproven.

No missing generated items, validation scores, token counts, acceptance rates, or latency data were fabricated.
