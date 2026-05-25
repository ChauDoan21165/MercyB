# A3 Automation Runbook

Timestamp: 2026-05-20T14:45:00Z

## Generate The Review Queue

Run:

```bash
npm run placement:data-quality-review
```

This reads the latest saved A3 raw audit outputs and writes:

- `docs/placement-v3/data-quality/review-queue/review-queue.json`
- `docs/placement-v3/data-quality/review-queue/review-queue.md`
- `docs/placement-v3/data-quality/review-queue/remediation-link-review.md`
- `docs/placement-v3/data-quality/review-queue/conversation-calibration-review.md`
- `docs/placement-v3/data-quality/review-queue/unused-taxonomy-disposition.md`
- `docs/placement-v3/data-quality/a3-review-status.md`

The generator fails if it finds unsupported production-safe claims in the A3 report/PR governance docs.

## Update Review Status

Edit `docs/placement-v3/data-quality/a3-review-status.md`.

Allowed statuses:

- `pending`
- `needs Chau review`
- `needs linguist review`
- `approved`
- `rejected`
- `deferred`
- `blocked`

Only a human reviewer may set `approved` or `rejected`. Automation preserves existing statuses but does not create approvals.

## Rerun Audits

After any approved content or taxonomy change, run:

```bash
npx tsx scripts/placement-v3/run-taxonomy-consistency.ts
npx tsx scripts/placement-v3/run-recommendation-graph-audit.ts
npx tsx scripts/placement-v3/run-prompt-rubric-alignment.ts
npx tsx scripts/placement-v3/run-corpus-integrity-audit.ts
npm run placement:data-quality-review
```

Commit the new raw audit outputs and regenerated review queue together.

## Know Whether PR #951 Can Move Forward

PR #951 can move forward as infrastructure-only when:

- The PR body still says no production-safe claim.
- Raw audit outputs are present.
- Review queue files are generated.
- Remaining approvals are clearly marked as pending/deferred/blocked rather than silently ignored.
- `npm run typecheck`, `npm run typecheck:ci`, `npm run build`, and focused A3 tests pass.

PR #951 should remain draft if Chau wants all expert-review items completed before merge.

## What Must Never Be Automated

- Approving remediation-room links.
- Creating calibration responses.
- Changing CEFR labels.
- Marking taxonomy IDs deprecated.
- Claiming Placement V3 data quality is production-safe.
- Rewriting Vietnamese-L1 taxonomy meaning.

Automation can organize evidence and status. It cannot replace expert linguistic review.
