# DP-PRODUCT-ISSUE-WP-000037 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: bc309328523849a2a5501ba31bf1d2dfefe40108

Objective: Connect the cited DP invariant through the runtime integration path used by placement or lessons. Base invariant: Verify DP product-failure output reaches placement score exclusion reasons.

Implementation evidence:
- Added placement runtime coverage proving product-failure replay is ordered DP before PED.
- The test asserts the runtime decision excludes listening, offers retest, and applies `product_failure_audio` as the placement score exclusion reason.

Validation evidence:
- `npm test -- --run src/lib/tm-int src/components/placement` passed: 28 files, 217 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

