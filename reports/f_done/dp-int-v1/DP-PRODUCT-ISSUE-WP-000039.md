# DP-PRODUCT-ISSUE-WP-000039 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: bc309328523849a2a5501ba31bf1d2dfefe40108

Objective: Add regression coverage for the cited DP invariant so unsupported edits fail before promotion. Base invariant: Block any DP decision that converts product failure into learner weakness.

Implementation evidence:
- Tightened DP validation so a present product issue with `handledAsProductIssue: false` fails as `product_failure_as_learner_weakness`.
- Added regression coverage for that failure path.

Validation evidence:
- `npm test -- --run src/lib/tm-int src/components/placement` passed: 28 files, 217 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

