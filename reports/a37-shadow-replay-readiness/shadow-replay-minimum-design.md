# Minimum Shadow Replay Design

Date: 2026-05-20

## Minimum Shadow-Session Schema

`placement_v3_shadow_sessions`

- `id`
- `session_id_hash`
- `user_id_hash`
- `started_at`
- `completed_at`
- `placement_session_status`
- `app_version`
- `code_version`
- `prompt_version`
- `grader_prompt_hash`
- `feature_flag_snapshot`
- `sanitization_status`
- `retention_expires_at`
- `created_at`

## Minimum Event Schema

`placement_v3_shadow_steps`

- `id`
- `shadow_session_id`
- `sequence_number`
- `correlation_id`
- `event_type`
- `modality`
- `task_id`
- `prompt_id`
- `input_kind`
- `sanitized_input`
- `input_hash`
- `input_metadata`
- `provider`
- `model`
- `provider_route`
- `attempt_count`
- `retry_reasons`
- `latency_ms`
- `token_usage`
- `raw_output_hash`
- `sanitized_output`
- `parsed_assessment`
- `taxonomy_triggers`
- `recommendation_ids`
- `error_code`
- `created_at`

## Determinism Requirements

- Every replayable step must have a stable `sequence_number`.
- Every provider call must record provider, model, prompt hash, and response schema version.
- Replay comparisons must use thresholds for AI outputs instead of exact equality.
- Recommendation and taxonomy comparisons must separate content drift from ordering drift.
- Replays must persist code version, prompt version, and replay engine version.

## Sanitization Requirements

- Redact emails, phone numbers, URLs, addresses, API keys, auth tokens, and likely personal names.
- Store input and output hashes for forensic matching without retaining raw text indefinitely.
- Do not store raw audio by default.
- Store audio metadata or storage object references only when needed for a short retention window.
- Run sanitization audit before any replay artifact is exported.

## Correlation ID Requirements

- One user placement session correlation ID.
- One step correlation ID per task/action.
- One provider-call correlation ID per AI request.
- Retry attempts must share a parent step ID and have distinct attempt IDs.

## Replay Ordering Requirements

- Replays must use stored `sequence_number`, not wall-clock ordering alone.
- Interrupted and resumed sessions must preserve original action order.
- Provider retries must be replayed as recorded attempts or explicitly marked as non-replayed.

## Persistence Requirements

Minimum tables:

- `placement_v3_shadow_sessions`
- `placement_v3_shadow_steps`
- `placement_v3_replay_runs`
- `placement_v3_replay_diffs`
- `placement_v3_replay_alerts`

## Audit Logging Requirements

- Capture insert success/failure.
- Sanitization pass/fail.
- Replay run start/end.
- Replay comparison result.
- Admin access to replay data.
- Export/download events.

## Failure Recovery Requirements

- Capture must fail softly and never block the placement core path.
- Replay batches must be resumable.
- Failed steps must be persisted with error codes.
- Provider outage must mark replay as blocked, not successful.

## Local vs Runtime Requirements

Can be tested locally:

- Schema shape validation.
- Sanitization rules.
- Replay diff logic.
- Mocked replay ordering.
- Mocked Placement V3 vertical E2E.

Requires Supabase:

- Migration/RLS validation.
- Edge function persistence.
- Service-role inserts.
- Admin dashboard reads.

Requires provider secrets:

- Real provider routing.
- Real grading latency.
- Real token usage.
- Real CEFR drift.
- Real failover behavior.

Requires real user traffic:

- Organic privacy risks.
- Natural malformed responses.
- Real interruption/resume behavior.
- Production-scale replay usefulness.
