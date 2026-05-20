# A36 Blockers

Generated: 2026-05-20T11:34:01.751Z

## Command Attempted

`/Users/admin/.local/share/fnm/node-versions/v22.22.1/installation/bin/node /Users/admin/MercyB/scripts/placement-v3/run-grading-replay.ts --batch baseline-01`

## Exact Error

Missing SUPABASE_URL/PLACEMENT_REPLAY_SUPABASE_URL or SUPABASE_ANON_KEY/PLACEMENT_REPLAY_ANON_KEY.

## Replay Stages Completed

- fixture_load_precheck

## Metrics Unavailable

- raw grader outputs
- provider variance
- taxonomy variance from live graders
- latency
- token counts

## What Remains Unverified

- At least 40 fixtures through real graders
- Three replay/tuning cycles
- Provider variance on live OpenAI/Gemini behavior
- Taxonomy instability from live grader output
- Persisted production database rows
- Dashboard rendering real replay data
