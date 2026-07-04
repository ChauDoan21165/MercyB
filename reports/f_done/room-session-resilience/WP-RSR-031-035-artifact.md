# WP-RSR-031..035 F Artifact

Lane: room-session-resilience
Worker: F
Status: f_done pending Judge/Admin verification

## Workpacks

- WP-RSR-031 `room-json-resolver.canonicalize-inputs`
- WP-RSR-032 `room-json-resolver.offline-pack-shape`
- WP-RSR-033 `room-json-resolver.keyword-backfill-ja`
- WP-RSR-034 `room-json-resolver.error-kind-contract`
- WP-RSR-035 `room-json-resolver.manifest-path-contract`

## Files Changed

- `src/lib/__tests__/roomJsonResolver.offline.test.ts`

## Implementation Summary

- Added canonical room-id tests for suffixes, paths, query strings, whitespace, dashes, and casing.
- Added manifest path trust and canonical fallback path coverage.
- Added direct offline room normalization coverage for envelope, flat, and malformed stored values.
- Added Japanese keyword backfill coverage through `loadRoomJson` plus preservation coverage for existing top-level Japanese keywords.
- Added server and invalid-JSON error-kind coverage.

## Acceptance Mapping

- WP-RSR-031: canonicalization and resolved path output are asserted.
- WP-RSR-032: offline pack envelope, flat, and malformed shapes are covered.
- WP-RSR-033: Japanese keyword backfill is deduped and does not overwrite existing top-level values.
- WP-RSR-034: server and JSON-invalid error kinds are covered alongside existing network/offline coverage.
- WP-RSR-035: manifest paths are trusted while unknown rooms fall back to canonical `/data` paths.

Judge/Admin must independently inspect the commit, rerun validations, and record `judge_pass` or `judge_fail`.
