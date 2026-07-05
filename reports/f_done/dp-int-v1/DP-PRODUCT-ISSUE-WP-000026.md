# DP-PRODUCT-ISSUE-WP-000026 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: 09799fab31a096de142708410ce476f4f2199880

Objective: Add a negative-path fixture for the cited DP invariant so unsafe learner claims are rejected. Base invariant: Keep runtime product issues visible to DP instead of mixing them into learner performance.

Implementation evidence:
- Added TeacherContext coverage proving audio product issues remain in `productIssues` and do not create learning signals.
- The test asserts recommendations cite product issue handling and serialized context contains no learner-weakness language.

Validation evidence:
- `npm test -- --run src/lib/tm-int src/components/placement` passed: 28 files, 213 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

