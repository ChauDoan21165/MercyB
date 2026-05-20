# A37 Shadow Replay Readiness Report

## Executive Decision

DO NOT RESTART A37

Full implementation is not safe to restart yet. #942 cleared the main codebase blocker, but this environment still lacks all provider and Supabase runtime credentials needed to capture real sessions, replay them, and prove drift behavior.

## What Changed Since #945

#942 merged Placement V3 into `origin/main`.

The merged codebase now has V3 routes, UI pages, hooks, browser client code, session orchestration, writing grading, Mercy conversation grading, persistence, recommendations, and mocked vertical E2E coverage.

Impact: A37 can now be designed against real merged Placement V3 code instead of missing draft files. It still cannot be validated as real shadow replay without runtime credentials and a capture/replay schema.

## Current Environment Readiness

Present required env vars: none.

Missing required env vars:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Evidence: `reports/a37-shadow-replay-readiness/env-audit.log`

## Current Codebase Readiness

Ready for design:

- Placement V3 session orchestration exists.
- Writing and conversation grader functions exist.
- Session persistence exists.
- Recommendation output exists.
- V3 frontend route/UI surface exists behind disabled flags.

Not ready for implementation:

- No shadow capture middleware exists on `origin/main`.
- No shadow replay schema exists on `origin/main`.
- No replay engine exists on `origin/main`.
- No sanitization audit exists on `origin/main`.
- No replay dashboard exists on `origin/main`.
- No real shadow sessions or replay artifacts exist.

## Runtime Verification

Commands run from clean `origin/main` worktree:

- `npm ci --ignore-scripts`: pass with engine/audit warnings.
- `npm run typecheck`: pass.
- `npm run typecheck:ci`: pass.
- `npm run build`: pass with existing Vite warnings.
- `npm run lint`: pass with warnings only.
- `npx vitest run supabase/functions/placement-v3-session/__tests__ supabase/functions/placement-v3-grade-writing/__tests__/core.test.ts src/data/placement/v3/__tests__ src/lib/placement/v3/__tests__`: 124 tests passed.
- `npx playwright test -c playwright.smoke.config.ts tests/e2e/placement-v3-vertical.spec.ts`: pass.

Repeated verification:

- Pass A `npm run typecheck` + `npm run build`: pass.
- Pass B `npm run typecheck:ci` + `npm run lint`: pass after rerunning `npm ci` to repair local lint tooling in the temporary worktree.
- Pass C `npm run typecheck` + `npm run build`: pass.

Logs are under `reports/a37-shadow-replay-readiness/`.

## Still-True Blockers

- Provider credentials are unavailable.
- Supabase runtime credentials are unavailable.
- Azure speech credentials are unavailable.
- No real Placement V3 sessions were captured.
- No replay artifacts exist.
- No replay schema/RLS exists.
- No sanitization audit exists.
- No provider routing, token usage, latency, or failover behavior can be proven.

## Cleared Blockers

- Placement V3 files are now merged into `origin/main`.
- Placement V3 session orchestrator exists.
- Placement V3 writing/conversation grader functions exist.
- Placement V3 mocked vertical E2E passes.
- Build/typecheck/lint gates pass from a clean main worktree.

## Privacy Risks

Shadow replay would capture sensitive free text, possible audio/transcripts, CEFR outcomes, Vietnamese L1 interference flags, recommendation outputs, provider raw outputs, and timing/retry metadata.

Do not store long-lived raw writing or raw audio by default. Use sanitized payloads, hashes, short retention, admin-only access, RLS, and audited exports.

## Minimum Safe Shadow Replay Design

Minimum architecture requires:

- Shadow session table.
- Ordered shadow step/event table.
- Replay run table.
- Replay diff table.
- Replay alert table.
- Sanitization audit tooling.
- Correlation IDs across session, step, and provider call.
- Prompt/code/model version hashes.
- Replay-safe event ordering by sequence number.
- Admin-only dashboard and audited access.

## Required Chau Actions

- Provide runtime Supabase test project credentials.
- Provide OpenAI/Gemini provider keys or explicitly scope one provider out.
- Provide Azure Speech credentials before speaking replay is included.
- Approve retention policy for raw writing/audio.
- Approve RLS/admin access model for shadow tables.
- Run the first implementation in a test environment with Placement V3 flags isolated from production users.

## Operational Setup Status

Follow-up runbooks now exist under `reports/a37-shadow-replay-readiness/`:

- Provider setup: `provider-setup/openai-setup.md`, `provider-setup/gemini-setup.md`, `provider-setup/azure-speech-setup.md`, `provider-setup/supabase-setup.md`
- Runtime validation: `runtime-validation/validate-openai.md`, `runtime-validation/validate-gemini.md`, `runtime-validation/validate-azure-speech.md`, `runtime-validation/validate-supabase.md`, `runtime-validation/validate-placement-v3-stack.md`
- Operations gates: `privacy-operations-checklist.md`, `replay-readiness-matrix.md`, `local-simulation-guide.md`, `production-rollout-gates.md`

These are operational preparation only. They do not prove runtime provider access, Supabase persistence, real shadow capture, or replay drift.

## What Chau Can Do Immediately

1. Complete the provider setup runbooks for OpenAI, Gemini, Azure Speech, and Supabase.
2. Run each runtime validation command and save the generated logs.
3. Review the privacy operations checklist and decide whether raw writing/audio are ever allowed.
4. Fill the replay readiness matrix with real owner/status updates.
5. Keep A37 implementation parked until runtime validation logs exist.

## What Still Requires Engineering

- Shadow capture schema and RLS.
- Capture middleware that fails softly.
- Replay engine and diff generation.
- Sanitization audit tooling.
- Replay dashboard.
- Kill switch and observability.
- Real-session replay evidence.

## Exact Sequence To Unblock A37 Safely

1. Export provider and Supabase credentials in a local/test runtime, never in git.
2. Run `runtime-validation/validate-openai.md`.
3. Run `runtime-validation/validate-gemini.md`.
4. Run `runtime-validation/validate-azure-speech.md`.
5. Run `runtime-validation/validate-supabase.md`.
6. Run `runtime-validation/validate-placement-v3-stack.md`.
7. Complete privacy review using `privacy-operations-checklist.md`.
8. Approve the minimum schema/RLS design.
9. Assign A37 implementation only for a test environment.
10. Capture one real Placement V3 session and stop to review evidence before scaling to 10+ sessions.

## Recommended Next Step

Prepare a credentialed Supabase/provider test runtime and run a one-session real Placement V3 smoke test before assigning A37 implementation.

## Unsupported Claims

Nobody should claim:

- Shadow sessions have been captured.
- Replay works.
- Provider replay works.
- Azure speaking replay works.
- Drift has been measured.
- Replay artifacts are sanitized.
- Shadow replay is production-ready.
