# WP-RSR-021..025 F Artifact

Lane: room-session-resilience
Worker: F
Status: f_done pending Judge/Admin verification

## Workpacks

- WP-RSR-021 `user-sessions.tracking-flag-gates`
- WP-RSR-022 `user-sessions.device-detection`
- WP-RSR-023 `user-sessions.device-info-ssr`
- WP-RSR-024 `user-sessions.heartbeat-query-filters`
- WP-RSR-025 `user-sessions.error-swallowing`

## Files Changed

- `src/services/__tests__/userSessions.test.ts`

## Implementation Summary

- Strengthened disabled-tracking assertions so log and heartbeat paths make no Supabase write calls.
- Added mobile and desktop user-agent coverage for `device_type` and device info payloads.
- Added missing-browser-global coverage to protect SSR/non-browser execution.
- Added heartbeat filter assertions for both `user_id` and detected `device_type`.
- Added heartbeat returned-error and thrown-error coverage to protect auth flow swallowing behavior.
- Tightened the Supabase chain mock so terminal `.eq()` responses can model update success and failure.

## Acceptance Mapping

- WP-RSR-021: disabled tracking makes no DB write for log or heartbeat paths.
- WP-RSR-022: common mobile and desktop user agents produce the expected `device_type`.
- WP-RSR-023: missing `navigator`/`window` does not throw and records safe device info.
- WP-RSR-024: heartbeat updates are scoped by `user_id` and `device_type`.
- WP-RSR-025: upsert and heartbeat failures return `{ ok: false }` without throwing.

Judge/Admin must independently inspect the commit, rerun validations, and record `judge_pass` or `judge_fail`.
