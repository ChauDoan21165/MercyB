# Placement V3 Forensic Validation Matrix

This matrix tracks what has been validated and what remains blocked. Update links only with real evidence; do not promote simulated or local results into live/production columns.

| Subsystem | Simulated validated? | Local validated? | Live validated? | Production validated? | Evidence link | Remaining blocker |
| --- | --- | --- | --- | --- | --- | --- |
| Provider events | Yes | Partially | No | No | `raw-runs/a2-burnin-02-*-provider-*.json` | Real provider call evidence required |
| Retry events | Yes | Yes | No | No | `raw-runs/a2-burnin-02-retry-exhaustion-after-reconstruction.json` | Live retry path evidence required |
| Degraded results | Yes | Yes | No | No | `a2-final-report.md` and burn-in raw runs | Live degraded safe result evidence required |
| Recommendation events | Yes | Yes | No | No | `raw-runs/a2-burnin-02-recommendation-engine-failure-after-reconstruction.json` | Live recommendation failure or controlled staging anomaly required |
| Taxonomy events | Yes | Yes | No | No | `raw-runs/a2-burnin-02-taxonomy-parse-failure-after-reconstruction.json` | Live taxonomy parse/failure evidence required |
| Replay pipeline | Yes | Yes | No | No | `raw-runs/replay-a2-burnin-02/` | Replay against persisted live rows required |
| Dashboard rendering | Yes | Yes, fixture-based | No | No | `raw-runs/a2-verify-e2e-*.log` | Dashboard must be verified against persisted rows |
| Supabase persistence | Simulated failure only | Not live-hosted | No | No | `a2-blockers.md` | Live Supabase inserts required |
| Correlation IDs | Yes | Yes | No | No | `raw-runs/a2-burnin-02-*-after-reconstruction.json` | Live continuity across provider/retry/fallback required |
| Redaction pipeline | Yes | Yes | No | No | `privacy-redaction-checklist.md` | Live row scan and provider error redaction evidence required |
