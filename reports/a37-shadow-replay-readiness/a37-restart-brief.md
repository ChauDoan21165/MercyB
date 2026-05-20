# Future A37 Restart Brief

Use this only after Chau provides the required runtime environment. Do not start production shadow replay implementation from the current environment.

## Required Env Vars

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Required Runtime Conditions

- #942 or newer Placement V3 mainline checked out.
- Supabase edge functions runnable locally or deployed in a test project.
- Placement V3 flags can be enabled only in an isolated test environment.
- Provider keys have quota and logging permission.
- No production user data captured until schema, RLS, and retention are approved.

## Required Hard Gates

- At least 10 real placement sessions captured.
- At least 10 replay runs executed.
- At least 3 replay cycles after fixes.
- Sanitization audit passes on all captured artifacts.
- Replay artifacts include timestamps, provider, latency, model, token usage where available, replay batch ID, and diff output.
- No unsanitized transcript/audio export remains.

## Required Evidence

- Terminal logs for setup, edge function runs, capture, replay, and audit.
- Supabase table/RLS verification logs.
- Provider response summaries with timestamps and latency.
- Replay diff files.
- Sanitization audit output.
- Dashboard screenshot only after real persisted replay data exists.

## Anti-Fabrication Rules

- Do not invent shadow sessions.
- Do not reuse mock E2E results as real replay evidence.
- Do not claim provider replay without exported provider credentials and command logs.
- Do not claim deterministic replay if outputs were not compared across repeated runs.
- Do not claim privacy safety before sanitization audit passes.

## Minimum Replay Evidence

- Beginner, intermediate, advanced, interrupted, timeout/failure, and retry/failover-adjacent sessions.
- Original vs replay CEFR.
- Original vs replay recommendations.
- Original vs replay taxonomy triggers.
- Provider route and latency deltas.
- Replay failure cases and fixes.

## Stop Conditions

Stop and write a blocker report if:

- Provider env vars are missing.
- Supabase service role is missing.
- Edge functions cannot run locally or in a test project.
- Sanitization audit finds unredacted sensitive data that cannot be fixed quickly.
- Replay outputs are too nondeterministic to compare honestly after three cycles.

## Privacy Constraints

- Do not store raw audio by default.
- Do not store long-lived raw writing by default.
- Hash user/session IDs.
- Enforce admin-only access.
- Apply short retention to raw artifacts.
- Audit all replay dashboard reads and exports.

## Operational Constraints

- Capture must never block the core placement path.
- Replay must be resumable.
- Replay must separate provider drift from recommendation drift.
- Capture schema must version prompts, code, and grader outputs.
- Production rollout requires a kill switch.
