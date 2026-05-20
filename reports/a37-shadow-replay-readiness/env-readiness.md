# A37 Environment Readiness

Date: 2026-05-20

## Evidence

Commands run:

```bash
env | grep -E 'OPENAI|GEMINI|AZURE|SUPABASE|PLACEMENT' | sed 's/=.*/=<redacted>/' \
  | tee reports/a37-shadow-replay-readiness/env-audit.log

find . -maxdepth 3 \( -iname '*env*' -o -iname '*.example' \) \
  | tee reports/a37-shadow-replay-readiness/env-files-found.log
```

`env-audit.log` contains no matching exported variables. No required provider or Supabase variables were available to the runtime shell.

## Required Env Vars For Real A37

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Browser-side Vite equivalents where needed: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Present Env Vars

None of the required `OPENAI`, `GEMINI`, `AZURE`, `SUPABASE`, or `PLACEMENT` variables were exported in the shell used for verification.

## Missing Env Vars

All required runtime secrets are missing:

- OpenAI provider credentials
- Gemini provider credentials
- Azure Speech credentials
- Supabase URL
- Supabase anon key
- Supabase service role key

## Env Files Found

The clean `origin/main` worktree contains `.env.example`. The shared local worktree also had local ignored env files, but this audit did not read or rely on them because secrets must not be copied into reports.

## Blockers Still True

- Real OpenAI calls cannot be verified.
- Real Gemini calls cannot be verified.
- Real Azure speech/scoring calls cannot be verified.
- Real Supabase edge function persistence cannot be verified.
- Real provider routing and failover cannot be verified.
- Real shadow replay cannot be executed.

## Blockers Cleared After #942

- Placement V3 code is now merged into `origin/main`.
- Placement V3 session edge function exists on `origin/main`.
- Placement V3 writing and conversation grader edge functions exist on `origin/main`.
- Placement V3 vertical mocked E2E can run from `origin/main`.
