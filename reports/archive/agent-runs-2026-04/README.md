# April 2026 agent-run reports — archive

Historical agent run reports from April 2026 (and earlier May 2026 runbook
runs whose operations completed weeks ago). Kept for audit trail.

**Do not act on these — superseded by May 2026 wave.** Live runbooks and
operator artifacts now live at `reports/PENDING-CHAU-ACTIONS-2026-05-20.md`
plus the dispatch-driven `OPS-*`, `CUSTOMER-*`, `SQL-*`, `RUNBOOK-*`, and
`RECON-*` files at the top of `reports/`.

Earlier files in this directory were archived by PR #791 (`cleanup(reports):
archive 7 zero-reference legacy a<N>-* files (Tier-C per A23)`). A9k's
second sweep (this commit) adds the cohort that A9j classified as
ARCHIVE-class — 11 additional files that had no semantic references
outside `reports/`.

If a file you're looking for had an outside-code reference (e.g.
`a7-bundle-audit.md` is cited by `vite.config.ts`; `a4-tracking-runbook.md`
is cited by `index.html` + `src/services/behaviorTrackingFlag.ts`), it
stayed in the top-level `reports/` directory. Those files are pointed at
by load-bearing references that an archive move would break.
