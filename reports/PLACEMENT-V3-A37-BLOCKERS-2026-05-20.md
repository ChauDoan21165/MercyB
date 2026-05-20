# A37 Shadow Replay Blockers

Date: 2026-05-20

## Failed Or Blocked Runtime Area

Full A37 implementation remains blocked because required runtime secrets are not exported in this environment.

## Exact Evidence

Command:

```bash
env | grep -E 'OPENAI|GEMINI|AZURE|SUPABASE|PLACEMENT' | sed 's/=.*/=<redacted>/'
```

Result: no matching variables were printed.

## What Was Still Verified

- `origin/main` includes #942.
- Placement V3 core code exists.
- Placement V3 mocked vertical E2E passes with `playwright.smoke.config.ts`.
- Typecheck, typecheck:ci, build, and lint pass from a clean `origin/main` worktree.
- Placement V3 focused tests pass: 124 tests across 16 files.

## What Chau Must Verify Manually

- Provide Supabase URL, anon key, and service role key in the runtime shell.
- Provide OpenAI and/or Gemini API keys.
- Provide Azure Speech credentials for speaking replay.
- Run real Placement V3 sessions against a test Supabase project.
- Confirm shadow replay schema/RLS before any production capture.
