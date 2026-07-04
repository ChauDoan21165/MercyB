# DP-PRODUCT-ISSUE-WP-000028 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: 09799fab31a096de142708410ce476f4f2199880

Objective: Tighten the cited DP contract surface so downstream code cannot bypass the invariant. Base invariant: Require Teacher Context product issue fields to remain available for DP.

Implementation evidence:
- Added TeacherContext field-shape coverage for product issues.
- The fixture asserts `source`, `issue`, `affectedSkill`, and `evidenceCount` remain present for downstream DP handling.

Validation evidence:
- `npm test -- --run src/lib/tm-int src/components/placement` passed: 28 files, 213 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

