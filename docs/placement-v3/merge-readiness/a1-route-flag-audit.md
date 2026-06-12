# A1 Route and Feature Flag Audit

Date: 2026-05-20

Evidence:

- `docs/placement-v3/merge-readiness/raw/route-flag-grep-by-ref.log`
- `docs/placement-v3/merge-readiness/raw/943-route-flag-check.log`
- `docs/placement-v3/merge-readiness/raw/944-claims-route-check.log`

## Findings

### Defaults

- On `origin/main`, `FEATURE_FLAGS.PLACEMENT_TEST_ENABLED` is hardcoded `false`.
- On #942/#943, `PLACEMENT_TEST_ENABLED` reads `VITE_PLACEMENT_TEST_ENABLED` and defaults `false`.
- On #942/#943, `PLACEMENT_V3_UI_ENABLED` reads `VITE_PLACEMENT_V3_UI_ENABLED` and defaults `false`.
- No audited branch flips either placement flag to default true.

### Placement Routes

Historical audit result before Chau's June 12 product decision:

- `/placement` and `/placement/who` mount V3 pages only when `PLACEMENT_V3_UI_ENABLED` is true.
- `/placement/test/:sessionId`, `/placement/results/:sessionId`, `/placement/resume`, and `/placement/skip` were wrapped in the former placement route gate.
- Legacy v2 fallback remains behind `PLACEMENT_TEST_ENABLED`.
- With both flags default false, `/placement*` paths still fail closed.

Superseded June 12: `/placement` routes now mount regardless of
`PLACEMENT_TEST_ENABLED` or `PLACEMENT_V3_UI_ENABLED`; the flags remain
defined for non-route consumers.

### Admin Drift Route

#943 adds:

- `PlacementDriftDashboard` lazy import.
- `/admin/placement-drift` inside the existing `/admin/*` `AdminRoute` shell.

The #943 router diff against #942 does not overwrite #942's V3 route block.

### Admin Benchmark Route

#944 adds benchmark dashboard routing only under admin. It does not expose the user placement test flow directly.

#944 should be rebased or merged after #942. Direct merge into current `origin/main` conflicts in session orchestrator files.

## Conclusion

Route and flag state is safe if merge order is respected:

1. Merge #942 first.
2. Merge/rebase #943 onto #942.
3. Merge/rebase #944 onto #942.
