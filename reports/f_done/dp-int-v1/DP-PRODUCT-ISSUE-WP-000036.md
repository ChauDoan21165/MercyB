# DP-PRODUCT-ISSUE-WP-000036 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: bc309328523849a2a5501ba31bf1d2dfefe40108

Objective: Expose the cited DP invariant in reviewable evidence so failures are actionable. Base invariant: Keep runtime product issues visible to DP instead of mixing them into learner performance.

Implementation evidence:
- Added TeacherContext product issue fixture covering audio and speech product failures with exact issue fields and pending retest reasons.
- Product issue evidence remains separate from learner performance and learning-signal paths.

Validation evidence:
- `npm test -- --run src/lib/tm-int src/components/placement` passed: 28 files, 217 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

