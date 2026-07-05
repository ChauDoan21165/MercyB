# DP-PRODUCT-ISSUE-WP-000038 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: bc309328523849a2a5501ba31bf1d2dfefe40108

Objective: Add deterministic fixtures for the cited DP invariant so tests do not depend on hand-built samples. Base invariant: Require Teacher Context product issue fields to remain available for DP.

Implementation evidence:
- Added deterministic TeacherContext fixture for audio and speech product issue fields.
- The fixture asserts stable `source`, `issue`, `affectedSkill`, and `evidenceCount` values for downstream DP.

Validation evidence:
- `npm test -- --run src/lib/tm-int src/components/placement` passed: 28 files, 217 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

