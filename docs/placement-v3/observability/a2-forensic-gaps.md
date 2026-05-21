# A2 Forensic Gaps

Generated: 2026-05-20

## Closed By This PR

- Added a shared forensic event schema for session, provider, retry, fallback, latency, orchestration, recoverability, degraded result, feature flag, taxonomy, and recommendation events.
- Added durable tables for forensic events, reconstructed timelines, and runtime alerts.
- Added request-level correlation IDs and feature flag snapshots to `placement-v3-session`.
- Added persisted grader provider events, latency events, degraded fallback markers, recommendation events, and fatal failure snapshots.
- Added a timeline builder that detects missing sequences, provider switches, retry inconsistencies, fallback transitions, recoverability, degraded outcomes, and orchestration dead ends.
- Added failure injection and replay scripts with raw JSON artifacts.
- Added an admin dashboard route for failed and degraded Placement V3 sessions.

## Remaining Blind Spots

- Live Supabase persistence was not validated in this local run. The logger swallows insert errors by design so Placement V3 does not fail because observability storage is unavailable.
- Live OpenAI/Gemini provider calls were not executed by the failure-injection harness. The provider scenarios are simulated and labeled as such in raw artifacts.
- Reading, listening, and speaking grader provider metadata remains limited until those graders land behind real Edge Function calls.
- The dashboard queries real persisted tables, but the E2E spec does not authenticate against a real admin Supabase account.
- Persistence write failure remains unrecoverable by product design; the timeline reconstructs it as a terminal operational failure, not a safe degraded result.
- Taxonomy-trigger events are represented in the schema and simulation, but production taxonomy parsing still needs a concrete call site when taxonomy logic moves into the Edge runtime.

## Operational Impact

Placement V3 is more debuggable after this PR, but not fully production-burned-in against live providers and a real Supabase project from this workspace.
