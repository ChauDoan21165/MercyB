# Placement V3 Contention Analysis Summary

Generated: 2026-05-20T15:10:19.462Z

- Deterministic pass rate: 100.00%
- Slowest contention run: 54s
- Timeout headroom estimate: 6s against 60s smoke timeout
- CI contention risk estimate: CI_TIMEOUT_RISK
- Runtime spread: 8s to 54s
- Suspected environmental noise: shared CPU/I/O contention during unit-test startup

The evidence supports local contention stability, with conservative CI timeout caution under shared-runner load.
