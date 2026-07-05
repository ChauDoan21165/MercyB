# DP-LEARNER-SIGNAL-WP-000043 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: 31ac0277baedc832fe72317b23703869faf4a535

Objective: Expose the cited DP invariant in reviewable evidence so failures are actionable. Base invariant: Map repeated hint usage into a DP signal that preserves alternatives.

Implementation evidence:
- Added explicit hint dependency evidence review coverage with distinct task anchors.
- Asserted the signal preserves EDU alternatives while presenting the exact hint evidence used.

Validation evidence:
- `npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int` passed: 25 files, 182 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

