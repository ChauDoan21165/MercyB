# A37 Shadow Session Replay Blockers

Timestamp: 2026-05-20T12:40:33Z
Branch: `feat/a37-shadow-session-replay`

## Summary

A37 cannot be completed honestly in this sandbox because the required real runtime credentials are not available. The task explicitly requires real placement sessions, real provider calls, real Supabase persistence, real replay comparisons, and real sanitization audit output. None of those artifacts were created.

No shadow sessions, replay diffs, drift reports, provider-routing changes, screenshots, or sanitization results are claimed in this branch.

## Runtime Credential Gate

Command run:

```bash
printf 'OPENAI_API_KEY=%s\nGEMINI_API_KEY=%s\nAZURE_SPEECH_KEY=%s\nAZURE_SPEECH_REGION=%s\nSUPABASE_URL=%s\nSUPABASE_ANON_KEY=%s\nSUPABASE_SERVICE_ROLE_KEY=%s\n' "${OPENAI_API_KEY:+set}" "${GEMINI_API_KEY:+set}" "${AZURE_SPEECH_KEY:+set}" "${AZURE_SPEECH_REGION:+set}" "${SUPABASE_URL:+set}" "${SUPABASE_ANON_KEY:+set}" "${SUPABASE_SERVICE_ROLE_KEY:+set}"
```

Observed output:

```text
OPENAI_API_KEY=
GEMINI_API_KEY=
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Impact:

- Cannot run real OpenAI or Gemini grading/provider calls.
- Cannot run real Azure phoneme/scoring calls.
- Cannot persist or read real shadow-session rows through Supabase.
- Cannot execute the required 10 real placement sessions.
- Cannot execute replay cycles with provider-routing, latency, taxonomy, and recommendation drift evidence.
- Cannot produce a truthful sanitization audit over captured production-like sessions.

## Required Context Availability Check

Command run:

```bash
for p in docs/placement-v3/README.md supabase/functions/placement-v3-session-orchestrator/index.ts supabase/functions/_shared/aiProvider.ts supabase/functions/_shared/aiLogger.ts supabase/functions/placement-v3-grade-writing/index.ts src/lib/recommendations docs/placement-v3/taxonomy src/config/featureFlags.ts src/pages/placement; do
  if [ -e "$p" ]; then
    printf 'present %s\n' "$p"
  else
    printf 'missing %s\n' "$p"
  fi
done
```

Observed output on the clean branch from `origin/main`:

```text
missing docs/placement-v3/README.md
missing supabase/functions/placement-v3-session-orchestrator/index.ts
present supabase/functions/_shared/aiProvider.ts
present supabase/functions/_shared/aiLogger.ts
missing supabase/functions/placement-v3-grade-writing/index.ts
missing src/lib/recommendations
missing docs/placement-v3/taxonomy
missing src/config/featureFlags.ts
present src/pages/placement
```

Impact:

- The clean base branch does not contain several A37-required Placement V3 files yet.
- Shadow replay implementation would depend on draft or unmerged Placement V3 work if attempted from this base.

## What Was Completed

- Created this blocker report under `docs/placement-v3/shadow-replay/a37-blockers.md`.
- Verified the sandbox lacks the runtime credentials required for honest A37 execution.
- Verified the clean branch is missing several required Placement V3 context files.

## What Was Not Completed

- No shadow session capture middleware.
- No replay engine.
- No replay comparison library.
- No Supabase persistence migration.
- No operator dashboard.
- No replay report edge function.
- No sanitization audit tooling.
- No integration or e2e tests.
- No real sessions captured.
- No replay cycles executed.
- No drift findings produced.
- No production-readiness claim.

## Remaining Work For Chau Or A Credentialed Runtime

1. Provide a branch/base containing the merged Placement V3 orchestrator, grading, recommendation, taxonomy, and feature-flag files.
2. Provide runtime credentials for the actual providers and Supabase environment:
   - `OPENAI_API_KEY` and/or `GEMINI_API_KEY`
   - `AZURE_SPEECH_KEY`
   - `AZURE_SPEECH_REGION`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - service-role credentials only in server-only execution contexts when persistence setup requires them
3. Run at least 10 real placement sessions.
4. Persist captured shadow artifacts.
5. Run at least 3 replay/improvement cycles.
6. Run sanitization audit over captured sessions.
7. Document real drift, runtime bugs, and remaining determinism risks.

## Honest Status

A37 is blocked before implementation. Any claim of completed replay coverage, provider routing, scoring drift, sanitization audit success, or production readiness from this sandbox would be fabricated.
